// js/prompt-blocks/data-requirements.js

function buildDataRequirementsBlock(topicKey, scenarioKey) {
    const topic = SCENARIO_CONFIG[topicKey];
    const scenario = topic.subtopics[scenarioKey];

    const enabledKeys = scenario.enabled || [];
    const optionalKeys = (scenario.optional || []).map(item =>
        typeof item === 'string' ? item : item.key
    );

    let text = `【数据要求】\n`;

    if (enabledKeys.length > 0) {
        text += '请确保星盘数据包含以下**必选**内容：\n';
        enabledKeys.forEach(key => {
            const star = CELESTIAL_LIBRARY[key];
            const label = star ? `${key}（${star.desc}）` : key;
            text += `- ${label}\n`;
        });
    }

    if (optionalKeys.length > 0) {
        text += '\n如数据完整，建议同时提供以下**可选**内容（可提升分析深度）：\n';
        optionalKeys.forEach(key => {
            const star = CELESTIAL_LIBRARY[key];
            let benefit = '';
            (scenario.optional || []).forEach(item => {
                if (typeof item === 'object' && item.key === key) {
                    benefit = item.benefit || '';
                }
            });
            const label = star ? `${key}（${star.desc}）` : key;
            text += benefit ? `- ${label} — ${benefit}\n` : `- ${label}\n`;
        });
    }
    text += '\n';
    return text;
}