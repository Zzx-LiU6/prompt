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

    // ② 用户需求
    prompt += buildUserNeedsBlock(topicKey, scenarioKey, selectedQuestions);

    // ③ 分析框架（每个问题的 answerMap）
    prompt += buildAnalysisFrameworkBlock(topicKey, scenarioKey, selectedQuestions);

    // ④ 数据要求（必选/可选星体）
    //prompt += buildDataRequirementsBlock(topicKey, scenarioKey);

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