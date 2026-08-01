// js/prompt-blocks/output-format.js

function buildOutputFormatBlock(topicKey, scenarioKey) {
    const isSynastry = topicKey === 'love' && scenarioKey === 'synastry';

    let text = `【输出要求】\n`;
    text += `- 每个问题单独成段，结论前置（先给答案，再给依据）。\n`;
    text += `- 专业术语首次出现时附简短解释（如"7宫主即婚姻宫主星"）。\n`;
    text += `- 每个结论都给出具体的星盘证据（行星位置、相位、宫位等）。\n`;
    text += '- 当星盘数据不足以支持某个结论时，明确说明"数据不足"或"需进一步确认"。\n';
    text += `- 语言风格：专业但易懂，温暖但有边界。\n`;

    if (isSynastry) {
        text += `- 合盘分析需结合双方数据，指出双方星盘的共振与矛盾之处。\n`;
        text += `- 相位解读必须包含：相位类型、落入宫位、吉凶、心理动力与生活场景。\n`;
    }
    text += '\n';
    return text;
}