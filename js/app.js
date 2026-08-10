// ================================================================
// app.js — UI 逻辑 + 状态管理
// ================================================================

// =============================================================
// 一、状态管理
// =============================================================
let currentTopic = 'love';
let currentSubtopic = null;
let selectedQuestions = [];
let currentTab = 'thematic';  // 'thematic' | 'divisional'
let selectedDivisional = null;

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

    // 初始化主题
    selectTopic('love');
    // 更新历史角标
    updatePromptHistoryBadge();
    renderDivisionalCards();
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
// 三、Tab 切换
// =============================================================
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
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

// =============================================================
// 八、分盘解读（新增板块）
// =============================================================

function renderDivisionalCards() {
    const grid = document.getElementById('divisionalGrid');
    if (!grid) return;

    let html = '';
    for (const [key, data] of Object.entries(DIVISIONAL_PROMPTS)) {
        html += `
            <div class="divisional-card" data-key="${key}" onclick="selectDivisional('${key}')">
                <div class="icon">${data.icon}</div>
                <div class="name">${data.name}</div>
                <div class="desc">${data.desc}</div>
                <div class="badge">${data.enabled ? data.enabled.join(' · ') : '需数据'}</div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

function selectDivisional(key) {
    const data = DIVISIONAL_PROMPTS[key];
    if (!data) return;

    selectedDivisional = key;

    // 高亮卡片
    document.querySelectorAll('.divisional-card').forEach(el => el.classList.remove('active'));
    document.querySelector(`.divisional-card[data-key="${key}"]`).classList.add('active');

    const userData = document.getElementById('divisionalDataInput').value.trim();
    let prompt = data.prompt;

    console.log('🔍 用户数据长度:', userData.length);

    // 检查 prompt 中是否已有 【星盘数据】 标记
    if (!prompt.includes('【星盘数据】')) {
        // 如果没有，在末尾追加
        prompt = prompt + '\n\n【星盘数据】\n（请在此处粘贴您的标准化星盘文本）';
        console.log('ℹ️ 已自动追加 【星盘数据】 占位符');
    }

    if (userData) {
        // 替换占位符
        const marker = '【星盘数据】';
        const idx = prompt.indexOf(marker);
        if (idx !== -1) {
            const start = idx + marker.length;
            let end = prompt.indexOf('【', start);
            if (end === -1) {
                end = prompt.length;
            }
            prompt = prompt.substring(0, idx) + marker + '\n' + userData + '\n\n' + prompt.substring(end);
            console.log('✅ 已替换星盘数据');
        }
    } else {
        console.log('ℹ️ 没有可用的星盘数据');
    }

    document.getElementById('divisionalPromptOutput').value = prompt;
    document.getElementById('divisionalResult').style.display = 'block';
}

// =============================================================
// 生成分盘 Prompt（供“生成 Prompt”按钮调用）
// =============================================================
function generateDivisionalPrompt() {
    if (!selectedDivisional) {
        showToast('⚠️ 请先选择一个分盘');
        return;
    }
    // 重新执行选择，刷新显示（会读取最新的输入框数据）
    selectDivisional(selectedDivisional);
    showToast('✅ Prompt 已更新');
}

function copyDivisionalPrompt() {
    const text = document.getElementById('divisionalPromptOutput').value;
    if (!text) { showToast('⚠️ 没有内容可复制'); return; }
    navigator.clipboard.writeText(text).then(() => {
        showToast('📝 Prompt 已复制');
    }).catch(() => {
        const ta = document.getElementById('divisionalPromptOutput');
        ta.select();
        document.execCommand('copy');
        showToast('📝 Prompt 已复制');
    });
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

    // ===== 保存历史记录 =====
    const questionLabels = selectedQuestions.map(id => {
        const q = sub.questions.find(q => q.id === id);
        return q ? q.label : id;
    });
    savePromptHistory(prompt, config.name, sub.name, questionLabels);

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
// 七、Prompt 历史记录
// =============================================================

function getPromptHistory() {
    try {
        const data = localStorage.getItem('promptHistory');
        return data ? JSON.parse(data) : [];
    } catch { return []; }
}

function savePromptHistory(content, topic, subtopic, questions) {
    if (!content || content.trim().length < 10) return;
    const history = getPromptHistory();
    const entry = {
        id: Date.now(),
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        topic: topic || '未知主题',
        subtopic: subtopic || '未知场景',
        questions: questions || [],
        content: content,
        preview: content.replace(/\n/g, ' ').slice(0, 80) + (content.length > 80 ? '…' : '')
    };
    // 去重：如果内容完全一样就不重复保存
    const exists = history.some(h => h.content === content);
    if (exists) return;
    history.unshift(entry);
    while (history.length > 50) history.pop();
    localStorage.setItem('promptHistory', JSON.stringify(history));
    updatePromptHistoryBadge();
}

function updatePromptHistoryBadge() {
    const history = getPromptHistory();
    const badge = document.getElementById('promptHistoryBadge');
    if (badge) {
        badge.textContent = history.length > 0 ? `(${history.length})` : '';
    }
}

function openPromptHistoryModal() {
    const history = getPromptHistory();
    const list = document.getElementById('promptHistoryList');
    if (!list) return;

    if (history.length === 0) {
        list.innerHTML = `<div class="history-empty">暂无历史记录<br><span style="font-size:12px;color:#4a5363;">生成 Prompt 后会自动保存</span></div>`;
        document.getElementById('promptHistoryModal').classList.add('open');
        return;
    }

    let html = '';
    history.forEach((item) => {
        const questionsStr = item.questions.length > 0 ? item.questions.join('、') : '无具体问题';
        html += `
            <div class="history-item" onclick="loadPromptHistory(${item.id})">
                <span class="del" onclick="event.stopPropagation();deletePromptHistory(${item.id})">✕</span>
                <div class="time">${item.time}</div>
                <div style="font-size:12px;color:#7a8392;margin-bottom:2px;">${item.topic} → ${item.subtopic} ｜ 问题：${questionsStr}</div>
                <div class="preview">${item.preview}</div>
            </div>
        `;
    });
    list.innerHTML = html;
    document.getElementById('promptHistoryModal').classList.add('open');
}

function loadPromptHistory(id) {
    const history = getPromptHistory();
    const entry = history.find(h => h.id === id);
    if (entry) {
        document.getElementById('resultPrompt').value = entry.content;
        closeModal('promptHistoryModal');
        showToast('✅ 已恢复历史 Prompt，可直接复制');
        // 打开结果弹窗方便复制
        document.getElementById('promptResultModal').classList.add('open');
    }
}

function deletePromptHistory(id) {
    let history = getPromptHistory();
    history = history.filter(h => h.id !== id);
    localStorage.setItem('promptHistory', JSON.stringify(history));
    updatePromptHistoryBadge();
    openPromptHistoryModal();
    showToast('🗑 已删除');
}

function clearAllPromptHistory() {
    if (confirm('确定要清空所有 Prompt 历史记录吗？')) {
        localStorage.removeItem('promptHistory');
        updatePromptHistoryBadge();
        openPromptHistoryModal();
        showToast('🗑 已清空全部历史');
    }
}
