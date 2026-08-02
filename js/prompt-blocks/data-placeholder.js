// ================================================================
// data-placeholder.js — 数据占位符
// ================================================================

function buildDataPlaceholderBlock(topicKey, scenarioKey) {
    const isSynastry = topicKey === 'love' && scenarioKey === 'synastry';

    let text = '【星盘数据】\n';

    // 如果有从 clean 传来的数据，直接填入
    if (window._cleanData) {
        text += window._cleanData + '\n';
        text += '\n（以上数据来自 JHora 清洗工具）\n';
    } else if (isSynastry) {
        text += '（请在此处粘贴双方标准化星盘文本）\n';
    } else {
        text += '（请在此处粘贴您的标准化星盘文本）\n';
    }

    return text;
}
