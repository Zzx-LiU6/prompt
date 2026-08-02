// ================================================================
// index.js — 组合所有 Prompt 模块
// ================================================================

function renderPromptFromBlocks(topicKey, scenarioKey, selectedQuestionIds) {
    // 1. 获取场景配置
    const topic = SCENARIO_CONFIG[topicKey];
    if (!topic) return null;

    const scenario = topic.subtopics[scenarioKey];
    if (!scenario) return null;

    const selectedQuestions = scenario.questions.filter(q =>
        selectedQuestionIds.includes(q.id)
    );
    if (selectedQuestions.length === 0) return null;

    // 2. 按顺序拼装所有模块
    let prompt = '';

    // ① 角色设定
    prompt += buildRoleBlock(topicKey, scenarioKey);

    // ② 合盘全局架构扫描 + 现实检视
    if (topicKey === 'love' && scenarioKey === 'synastry') {
        if (scenario.globalFramework) {
            prompt += scenario.globalFramework + '\n\n';
        }
        if (scenario.realityCheck) {
            prompt += scenario.realityCheck + '\n\n';
        }
        prompt += `【全局扫描与问题分析的连接规则】\n`;
        prompt += `- 你在上面执行的「关系架构扫描」结果，是回答后续所有具体问题的起点。\n`;
        prompt += `- 每个问题的回答中，必须引用至少一个全局扫描中发现的关键模式（如双向互入、多指标共振、关系类型判定）。\n`;
        prompt += `- 避免孤立地分析单个配置，始终将其放在全局扫描的框架中解读。\n\n`;
    }

    // ③ 用户需求
    prompt += buildUserNeedsBlock(topicKey, scenarioKey, selectedQuestions);

    // ④ 分析框架（每个问题的 answerMap）
    prompt += buildAnalysisFrameworkBlock(topicKey, scenarioKey, selectedQuestions);

    // ⑤ 合盘专属：相位分析细则
    if (topicKey === 'love' && scenarioKey === 'synastry') {
        const phaseBlock = buildSynastryPhaseBlock(selectedQuestions);
        if (phaseBlock) {
            prompt += phaseBlock;
        }
    }

    // ⑥ 输出要求 ← 这里之前漏掉了！
    prompt += buildOutputFormatBlock(topicKey, scenarioKey);

    // ⑦ 数据占位符
    prompt += buildDataPlaceholderBlock(topicKey, scenarioKey);

    return prompt;
}

// 导出供 renderer.js 调用
// 如果使用 ES modules，可以用 export
// 如果使用传统 script 标签，直接挂在 window 上
window.renderPromptFromBlocks = renderPromptFromBlocks;
