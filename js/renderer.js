// ================================================================
// renderer.js — 保留数据处理 + 转发到 prompt-blocks
// ================================================================

// 注意：SCENARIO_CONFIG 和 CELESTIAL_LIBRARY 由 config 模块提供

// =============================================================
// 一、数据标签生成器（app.js 需要）
// =============================================================
function generateDataTags(scenario) {
    const tags = [];
    const enabled = scenario.enabled || [];

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
// 二、获取数据准备清单（app.js 需要）
// =============================================================
function getDataTagsWithDetails(topicKey, scenarioKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return { required: [], optional: [] };

    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return { required: [], optional: [] };

    const required = [];
    const optional = [];

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
// 三、术语表（保留，但转发到 prompt-blocks）
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

function getGlossary(topicKey, scenarioKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return [];

    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return [];

    if (scenario.glossary && scenario.glossary.length > 0) {
        return scenario.glossary;
    }

    return getAutoGlossary(topicKey, scenarioKey);
}

// =============================================================
// 四、辅助函数
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

// =============================================================
// 五、renderPrompt → 转发到 prompt-blocks
// =============================================================
// 注意：renderPrompt 的核心逻辑已拆分到 js/prompt-blocks/
// 这里只做转发，保持 app.js 的调用不变

function renderPrompt(topicKey, scenarioKey, selectedQuestionIds) {
    // 检查是否加载了 prompt-blocks
    if (typeof renderPromptFromBlocks === 'function') {
        return renderPromptFromBlocks(topicKey, scenarioKey, selectedQuestionIds);
    }

    // 降级：如果 prompt-blocks 未加载，用原来的逻辑
    // 这里放原来的 renderPrompt 完整代码作为 fallback（但拆完后可以去掉）
    // 为了安全，我先放一个简易版本
    console.warn('prompt-blocks 未加载，使用简易渲染');

    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return null;
    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return null;
    const selectedQuestions = scenario.questions.filter(q =>
        selectedQuestionIds.includes(q.id)
    );
    if (selectedQuestions.length === 0) return null;

    let prompt = '【角色设定】\n你是一位精通 Parashara 体系的吠陀占星师。\n\n';
    prompt += '【用户需求】\n';
    prompt += `用户当前处于「${topic.name}」中的「${scenario.name}」场景，提出了以下问题：\n\n`;
    selectedQuestions.forEach(q => {
        prompt += `**${q.id}** ${q.label}\n`;
    });
    prompt += '\n【分析框架】\n请按以下顺序逐一解答：\n\n';
    selectedQuestions.forEach((q, index) => {
        const instruction = scenario.answerMap[q.id] || '请基于星盘数据给出专业判断。';
        prompt += `${index + 1}. 问题「${q.label}」：${instruction}\n`;
    });
    prompt += '\n【星盘数据】\n（请在此处粘贴您的标准化星盘文本）\n';
    return prompt;
}