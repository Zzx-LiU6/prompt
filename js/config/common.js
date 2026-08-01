// ================================================================
// common.js — 全局星体库（完整版）
// ================================================================

const CELESTIAL_LIBRARY = {

    // =============================================================
    // 一、分盘数据
    // =============================================================
    'D1': { id: 'rasi', category: 'divisional', desc: '本命盘，一切分析的基础' },
    'D9': { id: 'navamsa', category: 'divisional', desc: '婚姻分盘，揭示深层业力与福报' },
    'D10': { id: 'dasamsa', category: 'divisional', desc: '事业分盘，分析职业发展与社会成就' },
    'D24': { id: 'siddhamsa', category: 'divisional', desc: '教育分盘，分析学术能力与知识深度' },
    'D2': { id: 'hora', category: 'divisional', desc: '财富分盘，分析财富稳定性与收入来源' },
    'D6': { id: 'shashtamsa', category: 'divisional', desc: '疾病分盘，专业级健康分析' },
    'D7': { id: 'saptamsa', category: 'divisional', desc: '子女分盘，分析子女与孕育' },

    // =============================================================
    // 二、核心宫主星（1-12宫）
    // =============================================================
    '1宫主': { id: 'lagna_lord', category: 'house_lord', desc: '自我定位、体质、整体活力' },
    '2宫主': { id: 'second_lord', category: 'house_lord', desc: '财富积累、流动资产、储蓄能力' },
    '3宫主': { id: 'third_lord', category: 'house_lord', desc: '沟通表达、行动力、短途社交、技能学习' },
    '4宫主': { id: 'fourth_lord', category: 'house_lord', desc: '家庭根基、居住环境、本地运势、基础教育' },
    '5宫主': { id: 'fifth_lord', category: 'house_lord', desc: '恋爱浪漫、子女孕育、智力学习、投机创造' },
    '6宫主': { id: 'sixth_lord', category: 'house_lord', desc: '日常工作、竞争环境、债务疾病、服务技能' },
    '7宫主': { id: 'seventh_lord', category: 'house_lord', desc: '婚姻伴侣、合作关系、公开对手、一对一关系' },
    '8宫主': { id: 'eighth_lord', category: 'house_lord', desc: '深层转化、手术意外、慢性重疾、性能量、遗产债务' },
    '9宫主': { id: 'ninth_lord', category: 'house_lord', desc: '高等教育、长途旅行、导师贵人、哲学信仰、运气' },
    '10宫主': { id: 'tenth_lord', category: 'house_lord', desc: '职业发展、社会地位、公众形象、事业成就' },
    '11宫主': { id: 'eleventh_lord', category: 'house_lord', desc: '社交网络、收入收益、愿望实现、人脉资源' },
    '12宫主': { id: 'twelfth_lord', category: 'house_lord', desc: '海外远行、灵性独处、亲密卧室、损耗释放、潜意识' },

    // =============================================================
    // 三、核心行星
    // =============================================================
    '太阳': { id: 'sun', category: 'planet', desc: '权威领导力、自信自尊、生命力与免疫、父亲/权威形象' },
    '月亮': { id: 'moon', category: 'planet', desc: '情绪安全感、心理状态、记忆专注、母性滋养、体液平衡' },
    '火星': { id: 'mars', category: 'planet', desc: '行动力与勇气、激情与冲突、炎症与意外、手术刀、竞争' },
    '水星': { id: 'mercury', category: 'planet', desc: '逻辑思维、沟通表达、商业技能、学习考试、信息处理' },
    '木星': { id: 'jupiter', category: 'planet', desc: '智慧扩张、好运保护、导师贵人、财富机遇、婚姻滋养' },
    '金星': { id: 'venus', category: 'planet', desc: '爱与吸引力、享受消费、艺术审美、和谐关系、女性魅力' },
    '土星': { id: 'saturn', category: 'planet', desc: '责任压力、延迟限制、持久积累、慢性消耗、结构稳定' },
    'Rahu': { id: 'rahu', category: 'planet', desc: '执念业力、非传统吸引、投机冲动、异域适应、毒素误诊' },
    'Ketu': { id: 'ketu', category: 'planet', desc: '疏离灵性、前世印记、放下解脱、潜伏隐疾、直觉洞察' },

    // =============================================================
    // 四、Jaimini 指标
    // =============================================================
    'AK': { id: 'atmakaraka', category: 'jaimini', desc: '灵魂指标星，灵魂使命与人生核心驱力' },
    'AmK': { id: 'amatyakaraka', category: 'jaimini', desc: '职业成就指标星，职业道路的核心指向' },
    'DK': { id: 'darakaraka', category: 'jaimini', desc: '伴侣指标星，配偶类型与关系动态的核心' },
    'UL': { id: 'upapada_lagna', category: 'jaimini', desc: '婚姻互动质量指标，关系实质和谐度与社会显化' },

    // =============================================================
    // 五、特殊 Yoga
    // =============================================================
    'Raja Yoga': { id: 'raja_yoga', category: 'yoga', desc: '贵格组合，事业成就与人生尊贵的特殊格局' },
    'Dhana Yoga': { id: 'dhana_yoga', category: 'yoga', desc: '财富组合，与财富积累相关的吉祥格局' },

    // =============================================================
    // 六、时间维度（已补全）
    // =============================================================
    '当前Dasha': { id: 'current_dasha', category: 'time', desc: '当前 Mahadasha 及 Antardasha 主星' },

    '未来MD/AD/PD序列': {
        id: 'future_dasha_sequence',
        category: 'time',
        desc: '未来完整的大运序列，含各周期起止时间和主星，是所有时间预测的根基'
    },

    '未来完整MD序列': {
        id: 'future_md_sequence',
        category: 'time',
        desc: '未来大运的 MD 换运年份序列（仅主大运），用于判断人生转折期和大运交接点'
    },

    '未来完整MD/AD序列': {
        id: 'future_md_ad_sequence',
        category: 'time',
        desc: '未来大运的 MD+AD 完整序列（不含PD），用于大运主题分析和中期事件预测'
    },

    '未来AD序列': {
        id: 'future_ad_sequence',
        category: 'time',
        desc: '未来 Antardasha 序列（含各周期起止时间），用于锁定具体时间窗口'
    },

    '未来5年完整MD/AD序列': {
        id: 'future_5year_md_ad_sequence',
        category: 'time',
        desc: '未来5年的 MD+AD 完整序列（含各周期起止时间），用于综合大运分析'
    },

    'Gochara': {
        id: 'gochara',
        category: 'time',
        desc: '当前及未来行星过运数据（木/土/火/金/水/日/月/Rahu/Ketu的精确度数），用于锁定事件触发窗口'
    },

    'Ashtakavarga': {
        id: 'ashtakavarga',
        category: 'time',
        desc: '各宫位 Sarvashtakavarga 及 Bhinnashtakavarga 积分，用于量化各领域支持强度'
    },

    'Sade Sati': {
        id: 'sade_sati',
        category: 'time',
        desc: '土星过月亮的七年周期阶段判断，人生重大压力与转化期'
    },

    'Dasha Sandhi': {
        id: 'dasha_sandhi',
        category: 'time',
        desc: '大运交接期的具体时段，人生方向切换的关键过渡'
    },

    // =============================================================
    // 七、关键辅助数据
    // =============================================================
    '相位数据': {
        id: 'aspect_data',
        category: 'auxiliary',
        desc: '所有行星之间、行星与宫位的完整相位关系，用于判断受克/吉相位'
    },
    '关键宫位宫内星': {
        id: 'house_occupants',
        category: 'auxiliary',
        desc: '各宫位内的行星落点，用于分析宫位的具体能量和事件性质'
    },
    '关键宫主星度数': {
        id: 'lord_degrees',
        category: 'auxiliary',
        desc: '关键宫主星的精确度数，用于大运序列的精确计算'
    },

    // =============================================================
    // 八、合盘专用
    // =============================================================
    '双方D1': { id: 'both_rasi', category: 'synastry', desc: '双方本命盘完整数据' },
    '双方D9': { id: 'both_navamsa', category: 'synastry', desc: '双方婚姻分盘数据' },
    '双方UL': { id: 'both_upapada', category: 'synastry', desc: '双方婚姻互动指标' },
    '双方太阳': { id: 'both_sun', category: 'synastry', desc: '双方太阳位置，判断认同感与相互欣赏' },
    '双方月亮': { id: 'both_moon', category: 'synastry', desc: '双方月亮位置，判断情绪共鸣与日常契合' },
    '双方金星': { id: 'both_venus', category: 'synastry', desc: '双方金星位置，判断吸引力与爱的表达' },
    '双方火星': { id: 'both_mars', category: 'synastry', desc: '双方火星位置，判断激情互动与冲突模式' },
    '双方木星': { id: 'both_jupiter', category: 'synastry', desc: '双方木星位置，判断相互滋养与成长支持' },
    '双方土星': { id: 'both_saturn', category: 'synastry', desc: '双方土星位置，判断责任压力与持久绑定' },
    '双方Rahu': { id: 'both_rahu', category: 'synastry', desc: '双方北交点位置，判断业力执念与非理性吸引' },
    '双方Ketu': { id: 'both_ketu', category: 'synastry', desc: '双方南交点位置，判断灵性连接与前世印记' },
    '双方7宫主': { id: 'both_seventh_lord', category: 'synastry', desc: '双方第七宫主星，判断婚姻吸引力与承诺倾向' },
    '双方8宫主': { id: 'both_eighth_lord', category: 'synastry', desc: '双方第八宫主星，判断深层欲望、性能量与危机' },
    '双方12宫主': { id: 'both_twelfth_lord', category: 'synastry', desc: '双方第十二宫主星，判断亲密感与卧室生活' },
    '双方AK': { id: 'both_atmakaraka', category: 'synastry', desc: '双方灵魂指标星，判断灵魂层面的匹配度' },
    '双方DK': { id: 'both_darakaraka', category: 'synastry', desc: '双方伴侣指标星，判断关系中的化学反应' },
    '双方月亮Nakshatra': { id: 'both_moon_nakshatra', category: 'synastry', desc: '双方月亮星宿，用于 Ashtakoot 匹配计算' },
    '双方大运': { id: 'both_dasha', category: 'synastry', desc: '双方完整大运序列，判断关系激活窗口' },
    '双方完整相位数据': { id: 'both_aspect_data', category: 'synastry', desc: '双方行星之间的所有交叉相位关系，合盘分析的核心数据' },
    '双方宫内星': { id: 'both_house_occupants', category: 'synastry', desc: '双方行星互落对方各宫位的详细数据' },
    'Ashtakoot': { id: 'ashtakoot', category: 'synastry', desc: '基于双方月亮 Nakshatra 的八维度合盘匹配评分系统' },
};
