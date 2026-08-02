// ================================================================
// data-placeholder.js — 数据占位符
// ================================================================

function buildDataPlaceholderBlock(topicKey, scenarioKey) {
    const isSynastry = topicKey === 'love' && scenarioKey === 'synastry';

    let text = '【星盘数据】\n';

    if (isSynastry) {
        text += '（请在此处粘贴双方标准化星盘文本）\n';
    } else {
        text += '（请在此处粘贴您的标准化星盘文本）\n';
    }

    return text;
}
