// ================================================================
// analysis-framework.js — 分析框架
// ================================================================

function buildAnalysisFrameworkBlock(topicKey, scenarioKey, selectedQuestions) {
    const topic = SCENARIO_CONFIG[topicKey];
    const scenario = topic.subtopics[scenarioKey];

    let text = '【分析框架】\n';
    text += '请按以下顺序逐一解答上述问题，每个问题给出明确的结论和星盘依据：\n\n';

    selectedQuestions.forEach((q, index) => {
        const instruction = scenario.answerMap[q.id] || '请基于星盘数据给出专业判断。';
        
        // 问题标题单独一行
        text += `${index + 1}. 问题「${q.label}」\n`;
        
        // 把 instruction 按换行符拆分成多条
        const lines = instruction.split('\n').filter(line => line.trim() !== '');
        lines.forEach(line => {
            // 去掉行首的数字编号（如 "1. "、"2. "），改用圆点
            const cleaned = line.replace(/^\d+\.\s*/, '').trim();
            text += `   · ${cleaned}\n`;
        });
        text += '\n';
    });

    return text;
}