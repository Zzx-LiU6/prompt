// js/prompt-blocks/role.js

function buildRoleBlock(topicKey, scenarioKey) {
    const isSynastry = topicKey === 'love' && scenarioKey === 'synastry';
    if (isSynastry) {
        return `【角色设定】\n你是一位精通 Parashara 和 Jaimini 体系的吠陀占星合盘专家，擅长分析双人关系的业力匹配、相位互动与婚姻质量。\n\n`;
    }
    return `【角色设定】\n你是一位精通 Parashara 体系的吠陀占星师，擅长解读星盘中的人生课题与时间规律。\n\n`;
}