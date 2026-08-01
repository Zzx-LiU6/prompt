// ================================================================
// common.js — 全局星体库
// ================================================================

const CELESTIAL_LIBRARY = {
    // === 通用核心 ===
    '1宫主': { id: 'lagna_lord', category: 'core_house', level: '必选', desc: '自我定位与基础活力' },
    '月亮': { id: 'moon', category: 'core_planet', level: '必选', desc: '情绪、安全感、心理状态' },
    '木星': { id: 'jupiter', category: 'core_planet', level: '必选', desc: '保护、扩张、智慧、好运' },
    'AK': { id: 'atmakaraka', category: 'core_planet', level: '必选', desc: '灵魂使命，最深的核心驱力' },
    'D1': { id: 'rasi', category: 'divisional', level: '必选', desc: '本命盘，一切分析的基础' },
    'D9': { id: 'navamsa', category: 'divisional', level: '必选', desc: '婚姻、福报、深层业力' },
    '当前Dasha': { id: 'current_dasha', category: 'time', level: '必选', desc: '当前 Mahadasha/Antardasha' },
    'Gochara': { id: 'gochara', category: 'time', level: '可选', desc: '木星/土星/火星过运触发' },
    'Ashtakavarga': { id: 'ashtakavarga', category: 'time', level: '可选', desc: '各宫位力量量化' },
    'Sade Sati': { id: 'sade_sati', category: 'time', level: '可选', desc: '土星过月亮的七年周期，影响人生全局' },

    // === 感情专用 ===
    '7宫主': { id: 'seventh_lord', category: 'core_house', level: '必选', desc: '婚姻/伴侣/合作关系的核心' },
    '5宫主': { id: 'fifth_lord', category: 'core_house', level: '必选', desc: '恋爱/浪漫/感情萌芽' },
    'DK': { id: 'darakaraka', category: 'jaimini', level: '必选', desc: '伴侣特质的最核心指标' },
    '金星': { id: 'venus', category: 'core_planet', level: '必选', desc: '爱的感受/吸引/享乐' },
    'UL': { id: 'upapada_lagna', category: 'jaimini', level: '可选', desc: '婚姻互动质量/社会显化' },
    '火星': { id: 'mars', category: 'core_planet', level: '可选', desc: '激情/冲突/Mangal Dosha' },
    'Rahu': { id: 'rahu', category: 'chaya_graha', level: '可选', desc: '执念/业力吸引/非传统' },
    'Ketu': { id: 'ketu', category: 'chaya_graha', level: '可选', desc: '疏离/灵性连接/前世印记' },
    '土星': { id: 'saturn', category: 'core_planet', level: '可选', desc: '延迟/责任/婚姻牢固度' },
    '9宫主': { id: 'ninth_lord', category: 'core_house', level: '可选', desc: '婚姻果报/长期契合' },
    '8宫主': { id: 'eighth_lord', category: 'core_house', level: '可选', desc: '第八宫（转化/重症/性）的宫主星，关联深层欲望、重大疾病与性转化。' },
    
    // === 事业专用 ===
    '10宫主': { id: 'tenth_lord', category: 'core_house', level: '必选', desc: '职业/社会地位的核心' },
    '6宫主': { id: 'sixth_lord', category: 'core_house', level: '必选', desc: '竞争/服务/日常工作' },
    '2宫主': { id: 'second_lord', category: 'core_house', level: '可选', desc: '财富与职业收入关联' },
    '太阳': { id: 'sun', category: 'core_planet', level: '必选', desc: '权威、领导力、社会认可' },
    '水星': { id: 'mercury', category: 'core_planet', level: '必选', desc: '沟通、商业、逻辑技能' },
    'AmK': { id: 'amatyakaraka', category: 'jaimini', level: '必选', desc: '职业成就指标星' },
    'D10': { id: 'dasamsa', category: 'divisional', level: '必选', desc: '职业专门分盘' },
    'Raja Yoga': { id: 'raja_yoga', category: 'yoga', level: '可选', desc: '贵格，事业成就高度' },

    // === 财运专用 ===
    '11宫主': { id: 'eleventh_lord', category: 'core_house', level: '必选', desc: '收益、愿望实现' },
    'D2': { id: 'hora', category: 'divisional', level: '可选', desc: '财富分盘，分析财富稳定性与收入来源' },
    'Dhana Yoga': { id: 'dhana_yoga', category: 'yoga', level: '可选', desc: '财富组合，判断财富格局' },

    // === 健康专用 ===
    '8宫主': { id: 'eighth_lord', category: 'core_house', level: '可选', desc: '慢性、突发、手术' },
    'D6': { id: 'shashtamsa', category: 'divisional', level: '可选', desc: '疾病分盘，专业级健康分析' },

    // === 学业专用 ===
    '4宫主': { id: 'fourth_lord', category: 'core_house', level: '可选', desc: '基础教育、专注环境' },
    'D24': { id: 'siddhamsa', category: 'divisional', level: '必选', desc: '教育分盘，分析学术能力与知识深度' },

    // === 大运流年专用 ===
    'PD': { id: 'pratyantardasha', category: 'time', level: '可选', desc: '小小运，精确到月' },
    'Dasha Sandhi': { id: 'dasha_sandhi', category: 'time', level: '可选', desc: '大运交接期，人生方向切换的关键时刻' },

    // === 合盘专用 ===
    '双方D1': { id: 'both_rasi', category: 'divisional', level: '必选', desc: '双方本命盘' },
    '双方D9': { id: 'both_navamsa', category: 'divisional', level: '必选', desc: '双方婚姻盘' },
    '双方UL': { id: 'both_upapada', category: 'jaimini', level: '必选', desc: '双方婚姻互动指标' },
    '双方金星': { id: 'both_venus', category: 'synastry', level: '必选', desc: '双方金星，判断吸引力与爱的表达。' },
    '双方火星': { id: 'both_mars', category: 'synastry', level: '必选', desc: '双方火星，判断激情与行动力的互动。' },
    '双方月亮Nakshatra': { id: 'both_moon_nakshatra', category: 'nakshatra', level: '必选', desc: '用于 Ashtakoot 匹配' },
    '双方大运': { id: 'both_dasha', category: 'time', level: '必选', desc: '双方大运信息' },
    'Ashtakoot': { id: 'ashtakoot', category: 'synastry', level: '可选', desc: '八维度合盘匹配系统' },
    '双方AK': { id: 'both_atmakaraka', category: 'synastry', level: '必选', desc: '双方灵魂指标星，判断灵魂层面的匹配度与业力关系。' },
    '双方DK': { id: 'both_darakaraka', category: 'synastry', level: '必选', desc: '双方伴侣指标星，判断关系中的化学反应与伴侣匹配度。' },
};