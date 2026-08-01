// js/prompt-blocks/user-needs.js

function buildUserNeedsBlock(topicKey, scenarioKey, selectedQuestions) {
    const topic = SCENARIO_CONFIG[topicKey];
    const scenario = topic.subtopics[scenarioKey];

    let text = `【用户需求】\n`;
    text += `用户当前处于「${topic.name}」中的「${scenario.name}」场景，提出了以下问题：\n\n`;
    selectedQuestions.forEach(q => {
        text += `**${q.id}** ${q.label}\n`;
    });
    text += '\n';
    return text;
}