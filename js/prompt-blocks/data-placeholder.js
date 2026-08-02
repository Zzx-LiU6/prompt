function buildDataPlaceholderBlock(topicKey, scenarioKey) {
    const isSynastry = topicKey === 'love' && scenarioKey === 'synastry';

    let text = '【星盘数据】\n';

    // 显示一个粘贴框的提示（用户手动粘贴）
    if (isSynastry) {
        text += '（请在此处粘贴双方标准化星盘文本）\n';
    } else {
        text += '（请在此处粘贴您的标准化星盘文本）\n';
    }
    text += '\n提示：您可以从 JHora 清洗工具复制数据粘贴到此区域。';

    return text;
}
