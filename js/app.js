// ================================================================
// app.js — UI 逻辑 + 状态管理
// ================================================================

// =============================================================
// 一、状态管理
// =============================================================
let currentTopic = 'love';
let currentSubtopic = null;
let selectedQuestions = [];

// =============================================================
// 二、工具函数（Toast / Modal）
// =============================================================
function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal-overlay').forEach(el => {
        el.addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('open');
        });
    });
});

function openTutorialModal() {
    const el = document.getElementById('tutorialModal');
    if (el) el.classList.add('open');
}

function openAI(platform) {
    const urls = {
        chatgpt: 'https://chat.openai.com/',
        deepseek: 'https://chat.deepseek.com/',
        claude: 'https://claude.ai/',
        gemini: 'https://gemini.google.com/'
    };
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
        showToast('🔗 已打开 ' + platform.charAt(0).toUpperCase() + platform.slice(1));
    }
}

function toggleGlossary() {
    const el = document.getElementById('glossaryContent');
    if (el) {
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
    }
}

// =============================================================
// 三、UI 渲染函数
// =============================================================

function selectTopic(topicKey) {
    currentTopic = topicKey;
    currentSubtopic = null;
    selectedQuestions = [];

    document.querySelectorAll('.topic-card').forEach(card => {
        card.classList.toggle('active', card.dataset.topic === topicKey);
    });

    const step2 = document.getElementById('step2');
    if (step2) step2.style.display = 'block';

    const step3 = document.getElementById('step3');
    const stepDataInput = document.getElementById('stepDataInput');
    const step4 = document.getElementById('step4');
    if (step3) step3.style.display = 'none';
    if (stepDataInput) stepDataInput.style.display = 'none';
    if (step4) step4.style.display = 'none';

    renderSubtopics(topicKey);
}

function renderSubtopics(topicKey) {
    const config = SCENARIO_CONFIG[topicKey];
    const grid = document.getElementById('subtopicGrid');
    if (!grid) return;

    if (!config || !config.subtopics || Object.keys(config.subtopics).length === 0) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:40px 0;color:#5a6373;">
                ⚠️ 该主题的子场景正在建设中，请先选择其他主题。
            </div>
        `;
        return;
    }

    let html = '';
    const subtopics = config.subtopics;
    for (const [key, sub] of Object.entries(subtopics)) {
        html += `
            <div class="subtopic-card" data-subtopic="${key}" onclick="selectSubtopic('${key}')">
                <div class="icon">${sub.icon || '📌'}</div>
                <div class="name">${sub.name}</div>
                <div class="desc">${sub.desc || ''}</div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

function selectSubtopic(subKey) {
    currentSubtopic = subKey;
    selectedQuestions = [];

    document.querySelectorAll('.subtopic-card').forEach(card => {
        card.classList.toggle('active', card.dataset.subtopic === subKey);
    });

    const step3 = document.getElementById('step3');
    const step4 = document.getElementById('step4');
    const stepDataInput = document.getElementById('stepDataInput');

    if (step3) step3.style.display = 'block';
    if (step4) step4.style.display = 'none';
    if (stepDataInput) stepDataInput.style.display = 'none';  // 先隐藏，等用户勾选问题后再显示

    renderQuestions();
}

function renderQuestions() {
    const config = SCENARIO_CONFIG[currentTopic];
    if (!config) return;

    const sub = config.subtopics[currentSubtopic];
    if (!sub) return;

    const grid = document.getElementById('questionGrid');
    if (!grid) return;

    let html = '';
    sub.questions.forEach(q => {
        html += `
            <label class="question-item">
                <input type="checkbox" value="${q.id}" onchange="updateSelection()" />
                <span class="q-label"><span class="q-id">${q.id}</span> ${q.label}</span>
            </label>
        `;
    });
    grid.innerHTML = html;

    selectedQuestions = [];
    const step4 = document.getElementById('step4');
    if (step4) step4.style.display = 'none';

    updatePlanPreview();
}

function updateSelection() {
    const checkboxes = document.querySelectorAll('#questionGrid input[type="checkbox"]');
    selectedQuestions = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    updatePlanPreview();

    const step4 = document.getElementById('step4');
    const stepDataInput = document.getElementById('stepDataInput');

    if (step4) {
        if (selectedQuestions.length > 0) {
            step4.style.display = 'block';
            if (stepDataInput) stepDataInput.style.display = 'block';  // 方案出现后再显示输入框
        } else {
            step4.style.display = 'none';
            if (stepDataInput) stepDataInput.style.display = 'none';
        }
    }
}

function selectAllQuestions() {
    document.querySelectorAll('#questionGrid input[type="checkbox"]').forEach(cb => cb.checked = true);
    updateSelection();
}

function deselectAllQuestions() {
    document.querySelectorAll('#questionGrid input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateSelection();
}

// =============================================================
// 四、方案看板（实时预览）
// =============================================================
function updatePlanPreview() {
    const config = SCENARIO_CONFIG[currentTopic];
    if (!config) return;

    const sub = config.subtopics[currentSubtopic];
    if (!sub) {
        document.getElementById('planDataTags').innerHTML = '<span style="color:#5a6373;">请选择子场景</span>';
        document.getElementById('planDataExplain').textContent = '';
        document.getElementById('planSelectedQuestions').innerHTML = '';
        return;
    }

    const details = getDataTagsWithDetails(currentTopic, currentSubtopic);

    let tagsHtml = '';
    
    // 必选标签：点击显示 desc
    if (details.required.length > 0) {
        tagsHtml = details.required.map(item => {
            const descText = item.desc || '基础必选数据';
            return `<span class="tag-required clickable" onclick="showToast('📌 ${item.label}：${descText}')">✅ ${item.label}</span>`;
        }).join(' ');
    }

    // 可选标签：点击显示 benefit，没有则显示 desc
    if (details.optional.length > 0) {
        tagsHtml += ' ';
        tagsHtml += details.optional.map(item => {
            const msg = item.benefit || item.desc || '可选数据，建议提供';
            return `<span class="tag-optional clickable" onclick="showToast('🔹 ${item.label}：${msg}')">➕ ${item.label}</span>`;
        }).join(' ');
    }
    
    document.getElementById('planDataTags').innerHTML = tagsHtml || '<span style="color:#5a6373;">基础数据已包含</span>';

    document.getElementById('planDataExplain').textContent = sub.dataExplain || '💡 请根据清单准备数据。';

    const questions = sub.questions.filter(q => selectedQuestions.includes(q.id));
    if (questions.length === 0) {
        document.getElementById('planSelectedQuestions').innerHTML =
            '<li style="color:#5a6373;">请在上方勾选你关心的问题</li>';
    } else {
        document.getElementById('planSelectedQuestions').innerHTML = questions.map(q =>
            `<li><span class="q-id">${q.id}</span> ${q.label}</li>`
        ).join('');
    }
}

// =============================================================
// 五、生成 Prompt
// =============================================================
function generatePrompt() {
    if (selectedQuestions.length === 0) {
        showToast('⚠️ 请至少勾选一个问题');
        return;
    }

    const config = SCENARIO_CONFIG[currentTopic];
    if (!config) { showToast('⚠️ 主题配置缺失'); return; }

    const sub = config.subtopics[currentSubtopic];
    if (!sub) { showToast('⚠️ 请选择子场景'); return; }

    let prompt = renderPrompt(currentTopic, currentSubtopic, selectedQuestions);
    if (!prompt) {
        showToast('⚠️ 生成失败，请重试');
        return;
    }

    // ===== 替换星盘数据（从用户输入框读取） =====
    const userDataInput = document.getElementById('userDataInput');
    let userData = '';

    if (userDataInput) {
        userData = userDataInput.value.trim();
    }

    if (userData) {
        // 替换整个【星盘数据】区域
        const dataSectionRegex = /【星盘数据】\n[^【]*/;
        const newDataSection = `【星盘数据】\n${userData}\n`;
        prompt = prompt.replace(dataSectionRegex, newDataSection);
        console.log('✅ 已替换星盘数据，长度:', userData.length);
    } else {
        console.log('ℹ️ 没有可用的星盘数据');
    }

    document.getElementById('resultPrompt').value = prompt;
    document.getElementById('resultSub').textContent =
        `主题：${config.name} ｜ 场景：${sub.name} ｜ 已选 ${selectedQuestions.length} 个问题`;

    // 术语表
    const glossary = getGlossary(currentTopic, currentSubtopic);
    const inner = document.getElementById('glossaryInner');
    if (glossary.length > 0) {
        inner.innerHTML = glossary.map(item =>
            `<div class="glossary-item"><span class="term">${item.term}</span><span class="def">${item.def}</span></div>`
        ).join('');
    } else {
        inner.innerHTML = '<div style="color:#5a6373;font-size:13px;">暂无术语解释</div>';
    }
    document.getElementById('glossaryContent').style.display = 'none';

    document.getElementById('promptResultModal').classList.add('open');
    showToast('✅ 专属提问话术已生成');
}

// =============================================================
// 六、复制 Prompt
// =============================================================
function copyPrompt() {
    const text = document.getElementById('resultPrompt').value;
    if (!text) { showToast('⚠️ 没有内容可复制'); return; }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('📝 Prompt 已复制，请前往 AI 粘贴使用');
        }).catch(() => {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const ta = document.getElementById('resultPrompt');
    ta.select();
    try {
        document.execCommand('copy');
        showToast('📝 Prompt 已复制');
    } catch (e) {
        showToast('⚠️ 复制失败，请手动选择复制');
    }
}

// =============================================================
// 七、页面初始化
// =============================================================
document.addEventListener('DOMContentLoaded', function() {
    selectTopic('love');
});
