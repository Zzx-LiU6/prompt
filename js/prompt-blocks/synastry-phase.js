// js/prompt-blocks/synastry-phase.js

function buildSynastryPhaseBlock(selectedQuestions) {
    const hasPhaseQuestions = selectedQuestions.some(q =>
        ['1.2', '1.3', '1.6'].includes(q.id)
    );
    if (!hasPhaseQuestions) return '';

    let text = `【相位分析细则（合盘专用）】\n`;
    text += `当分析以下问题时，请严格按照此结构输出相位解读：\n\n`;

    if (selectedQuestions.some(q => q.id === '1.2' || q.id === '1.6')) {
        text += `**A. 个人星之间的硬相位（合相/对分相/四分相）**\n`;
        text += `- 双方月亮之间的相位：判断情绪共鸣或日常冲突。\n`;
        text += `- 双方金星之间的相位：判断审美与爱的表达方式是否兼容。\n`;
        text += `- 双方火星之间的相位：判断行动力与冲突模式的协同或对抗。\n\n`;
    }

    if (selectedQuestions.some(q => q.id === '1.3' || q.id === '1.6')) {
        text += `**B. 关键星体与对方宫位/主星的相位**\n`;
        text += `- 土星与对方月亮/金星/7宫主的合相或对分相：责任过重、情感压抑或持久绑定。\n`;
        text += `- 木星与对方上升/7宫主/月亮的相位：保护、滋养与成长。\n`;
        text += `- Rahu/Ketu与对方7宫主/金星的紧密合相：业力执念或灵性课题。\n`;
        text += `- 太阳与对方上升/10宫主的相位：身份认同与相互成就。\n\n`;
    }

    if (selectedQuestions.some(q => q.id === '1.3' || q.id === '1.6')) {
        text += `**C. 宫位归属与宫主星交换**\n`;
        text += `- 7宫主互落对方1/4/7/10宫：判断婚姻引力与互补性。\n`;
        text += `- Parivartana Yoga（宫主星互换）：判断深度业力绑定与关系课题。\n`;
        text += `- UL主星与对方关键星体的相位：婚姻质量的业力连接。\n\n`;
    }

    text += `**对每一个相位的输出要求：**\n`;
    text += `- 相位类型（合相/对分相/三分相/刑克/互换）\n`;
    text += `- 落入对方第几宫\n`;
    text += `- 吉凶属性与对应的心理动力（情绪/行为/事件层面）\n`;
    text += `- 实际的生活场景表现\n\n`;

    return text;
}