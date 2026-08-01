// ================================================================
// renderer.js — 模板引擎 + Prompt 生成器
// ================================================================

// =============================================================
// 一、数据标签生成器（兼容新旧 optional 格式）
// =============================================================
function generateDataTags(scenario) {
    const tags = [];
    const enabled = scenario.enabled || [];
    const optional = scenario.optional || [];

    enabled.forEach(key => {
        const star = CELESTIAL_LIBRARY[key];
        if (star) {
            tags.push(key);
        } else {
            tags.push(key);
        }
    });

    return tags;
}

// =============================================================
// 二、获取场景的数据准备清单（带分类 + benefit）
// =============================================================
function getDataTagsWithDetails(topicKey, scenarioKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return { required: [], optional: [] };

    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return { required: [], optional: [] };

    const required = [];
    const optional = [];

    // 处理必选（始终是字符串数组）
    (scenario.enabled || []).forEach(key => {
        const star = CELESTIAL_LIBRARY[key];
        if (star) {
            required.push({
                key: key,
                label: key,
                desc: star.desc || '',
                level: star.level || '必选'
            });
        } else {
            required.push({ key: key, label: key, desc: '', level: '必选' });
        }
    });

    // 处理可选（兼容字符串和对象两种格式）
    (scenario.optional || []).forEach(item => {
        let key, benefit;
        if (typeof item === 'string') {
            key = item;
            benefit = '';
        } else {
            key = item.key;
            benefit = item.benefit || '';
        }
        const star = CELESTIAL_LIBRARY[key];
        if (star) {
            optional.push({
                key: key,
                label: key,
                desc: star.desc || '',
                benefit: benefit,
                level: '可选'
            });
        } else {
            optional.push({ key: key, label: key, desc: '', benefit: benefit, level: '可选' });
        }
    });

    return { required, optional };
}

// =============================================================
// 三、自动术语表生成器（从星体库读取）
// =============================================================
function getAutoGlossary(topicKey, scenarioKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return [];

    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return [];

    const allKeys = [
        ...(scenario.enabled || []),
        ...(scenario.optional || []).map(item => typeof item === 'string' ? item : item.key)
    ];

    const glossary = [];
    const seen = new Set();
    allKeys.forEach(key => {
        if (seen.has(key)) return;
        seen.add(key);
        const star = CELESTIAL_LIBRARY[key];
        if (star) {
            glossary.push({ term: key, def: star.desc });
        }
    });
    return glossary;
}

// =============================================================
// 四、获取术语表（优先手动定义，无则自动生成）
// =============================================================
function getGlossary(topicKey, scenarioKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return [];

    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return [];

    // 如果场景有手动定义的 glossary，优先使用
    if (scenario.glossary && scenario.glossary.length > 0) {
        return scenario.glossary;
    }

    // 否则自动生成
    return getAutoGlossary(topicKey, scenarioKey);
}

// =============================================================
// 五、核心渲染函数
// =============================================================
function renderPrompt(topicKey, scenarioKey, selectedQuestionIds) {
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return null;

    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return null;

    const selectedQuestions = scenario.questions.filter(q =>
        selectedQuestionIds.includes(q.id)
    );

    if (selectedQuestions.length === 0) return null;

    const isSynastry = topicKey === 'love' && scenarioKey === 'synastry';

    // 构建 Prompt
    let prompt = '';

    // 1. 角色设定
    prompt += '【角色设定】\n';
    if (isSynastry) {
        prompt += '你是一位精通 Parashara 和 Jaimini 体系的吠陀占星合盘专家，擅长分析双人关系的业力匹配、相位互动与婚姻质量。\n\n';
    } else {
        prompt += '你是一位精通 Parashara 体系的吠陀占星师，擅长解读星盘中的人生课题与时间规律。\n\n';
    }

    // 2. 用户需求
    prompt += '【用户需求】\n';
    prompt += `用户当前处于「${topic.name}」中的「${scenario.name}」场景，提出了以下问题：\n\n`;
    selectedQuestions.forEach(q => {
        prompt += `**${q.id}** ${q.label}\n`;
    });
    prompt += '\n';

    // 3. 分析框架
    prompt += '【分析框架】\n';
    prompt += '请按以下顺序逐一解答上述问题，每个问题给出明确的结论和星盘依据：\n\n';

    selectedQuestions.forEach((q, index) => {
        const instruction = scenario.answerMap[q.id] || '请基于星盘数据给出专业判断。';
        prompt += `${index + 1}. 问题「${q.label}」：${instruction}\n`;
    });
    prompt += '\n';

    // 4. 数据要求（细粒度 + 动态生成）
    prompt += '【数据要求】\n';
    const enabledKeys = scenario.enabled || [];
    const optionalKeys = (scenario.optional || []).map(item =>
        typeof item === 'string' ? item : item.key
    );

    if (enabledKeys.length > 0) {
        prompt += '请确保星盘数据包含以下**必选**内容：\n';
        enabledKeys.forEach(key => {
            const star = CELESTIAL_LIBRARY[key];
            const label = star ? `${key}（${star.desc}）` : key;
            prompt += `- ${label}\n`;
        });
    }

    if (optionalKeys.length > 0) {
        prompt += '\n如数据完整，建议同时提供以下**可选**内容（可提升分析深度）：\n';
        optionalKeys.forEach(key => {
            const star = CELESTIAL_LIBRARY[key];
            // 查找 benefit
            let benefit = '';
            (scenario.optional || []).forEach(item => {
                if (typeof item === 'object' && item.key === key) {
                    benefit = item.benefit || '';
                }
            });
            const label = star ? `${key}（${star.desc}）` : key;
            if (benefit) {
                prompt += `- ${label} — ${benefit}\n`;
            } else {
                prompt += `- ${label}\n`;
            }
        });
    }
    prompt += '\n';

    // 5. 合盘专属：相位分析细则
    if (isSynastry) {
        const hasPhaseQuestions = selectedQuestions.some(q =>
            ['1.2', '1.3', '1.6'].includes(q.id)
        );
        if (hasPhaseQuestions) {
            prompt += `【相位分析细则（合盘专用）】\n`;
            prompt += `当分析以下问题时，请严格按照此结构输出相位解读：\n\n`;

            if (selectedQuestions.some(q => q.id === '1.2' || q.id === '1.6')) {
                prompt += `**A. 个人星之间的硬相位（合相/对分相/四分相）**\n`;
                prompt += `- 双方月亮之间的相位：判断情绪共鸣或日常冲突。\n`;
                prompt += `- 双方金星之间的相位：判断审美与爱的表达方式是否兼容。\n`;
                prompt += `- 双方火星之间的相位：判断行动力与冲突模式的协同或对抗。\n\n`;
            }

            if (selectedQuestions.some(q => q.id === '1.3' || q.id === '1.6')) {
                prompt += `**B. 关键星体与对方宫位/主星的相位**\n`;
                prompt += `- 土星与对方月亮/金星/7宫主的合相或对分相：责任过重、情感压抑或持久绑定。\n`;
                prompt += `- 木星与对方上升/7宫主/月亮的相位：保护、滋养与成长。\n`;
                prompt += `- Rahu/Ketu与对方7宫主/金星的紧密合相：业力执念或灵性课题。\n`;
                prompt += `- 太阳与对方上升/10宫主的相位：身份认同与相互成就。\n\n`;
            }

            if (selectedQuestions.some(q => q.id === '1.3' || q.id === '1.6')) {
                prompt += `**C. 宫位归属与宫主星交换**\n`;
                prompt += `- 7宫主互落对方1/4/7/10宫：判断婚姻引力与互补性。\n`;
                prompt += `- Parivartana Yoga（宫主星互换）：判断深度业力绑定与关系课题。\n`;
                prompt += `- UL主星与对方关键星体的相位：婚姻质量的业力连接。\n\n`;
            }

            prompt += `**对每一个相位的输出要求：**\n`;
            prompt += `- 相位类型（合相/对分相/三分相/刑克/互换）\n`;
            prompt += `- 落入对方第几宫\n`;
            prompt += `- 吉凶属性与对应的心理动力（情绪/行为/事件层面）\n`;
            prompt += `- 实际的生活场景表现\n\n`;
        }
    }

    // 6. 输出要求
    prompt += '【输出要求】\n';
    prompt += '- 每个问题单独成段，结论前置（先给答案，再给依据）。\n';
    prompt += '- 专业术语首次出现时附简短解释（如"7宫主即婚姻宫主星"）。\n';
    prompt += '- 每个结论都给出具体的星盘证据（行星位置、相位、宫位等）。\n';
    prompt += '- 语言风格：专业但易懂，温暖但有边界。\n';
    if (isSynastry) {
        prompt += '- 合盘分析需结合双方数据，指出双方星盘的共振与矛盾之处。\n';
        prompt += '- 相位解读必须包含：相位类型、落入宫位、吉凶、心理动力与生活场景。\n';
    }
    prompt += '\n';

    // 7. 数据占位符（细粒度化）
    prompt += '【星盘数据】\n';
    const hasD1 = enabledKeys.includes('D1') || enabledKeys.includes('双方D1');
    const hasD9 = enabledKeys.includes('D9') || enabledKeys.includes('双方D9');
    const hasD10 = enabledKeys.includes('D10');
    const hasD24 = enabledKeys.includes('D24');
    const hasD2 = enabledKeys.includes('D2');
    const hasD6 = enabledKeys.includes('D6');
    const hasD7 = enabledKeys.includes('D7');
    const hasUL = enabledKeys.includes('UL') || enabledKeys.includes('双方UL');
    const hasDasha = enabledKeys.includes('当前Dasha') || enabledKeys.includes('双方大运');
    const hasMoonNakshatra = enabledKeys.includes('双方月亮Nakshatra');

    if (isSynastry) {
        prompt += '请提供双方完整数据：\n';
        if (hasD1) prompt += '- 双方 D1 本命盘（含上升、行星位置、宫位）\n';
        if (hasD9) prompt += '- 双方 D9 婚姻盘（Navamsa）\n';
        if (hasUL) prompt += '- 双方 UL（Upapada Lagna）及其主星\n';
        if (hasMoonNakshatra) prompt += '- 双方月亮的 Nakshatra 与 Pada\n';
        if (hasDasha) prompt += '- 双方当前 Vimshottari Dasha（MD/AD）\n';
        prompt += '\n如数据不完整，分析结果将受影响。';
    } else {
        prompt += '请提供以下数据：\n';
        if (hasD1) prompt += '- D1 本命盘（含上升、行星位置、宫位）\n';
        if (hasD9) prompt += '- D9 婚姻盘（Navamsa）\n';
        if (hasD10) prompt += '- D10 事业分盘（Dasamsa）\n';
        if (hasD24) prompt += '- D24 教育分盘（Siddhamsa）\n';
        if (hasD2) prompt += '- D2 财富分盘（Hora）\n';
        if (hasD6) prompt += '- D6 疾病分盘（Shashtamsa）\n';
        if (hasD7) prompt += '- D7 子女分盘（Saptamsa）\n';
        if (hasUL) prompt += '- UL（Upapada Lagna）及其主星\n';
        if (hasDasha) prompt += '- 当前 Vimshottari Dasha（MD/AD）\n';
        if (!hasD1 && !hasD9 && !hasD10 && !hasD24 && !hasD2 && !hasD6 && !hasD7 && !hasUL) {
            prompt += '- 请提供完整的标准化星盘数据\n';
        }
        prompt += '\n请将数据粘贴在下方：\n\n';
    }

    return prompt;
}

// =============================================================
// 六、导出辅助函数
// =============================================================
function getTopicName(topicKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    return topic ? topic.name : topicKey;
}

function getSubtopicName(topicKey, scenarioKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return scenarioKey;
    const scenario = topic.subtopics[scenarioKey];
    return scenario ? scenario.name : scenarioKey;
}