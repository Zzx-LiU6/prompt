# ✨ JHora AI 提问助手

一个帮助用户向 AI 精准提问的吠陀占星工具。解决“数据有了，不知道该怎么问”的断层问题。

在线地址: https://jhora-prompt.pages.dev

## 核心功能

- **六大主题覆盖**：感情婚姻、事业发展、财富运势、身心健康、学业教育、大运流年
- **场景化引导**：每个主题下细分具体场景（如“单身脱单”“已婚趋势”“求职跳槽”）
- **问题清单勾选**：用户只需勾选自己关心的问题，系统自动拼装专属 Prompt
- **三层数据深度**：根据场景自动匹配需要的数据（D1/D9/D10/D24/大运/Gochara 等）
- **一键复制 Prompt**：生成后可直接粘贴到 ChatGPT、DeepSeek、Claude 等 AI 平台
- **术语自动解释**：每个 Prompt 涉及的专业术语自动生成解释，降低学习门槛

## 技术栈

- Vanilla JavaScript（纯原生，零依赖）
- CSS3（暗色主题）
- Cloudflare Pages（部署托管）

## 本地运行

这是一个纯静态 HTML 项目，无需安装任何依赖。克隆后直接用浏览器打开 `index.html` 即可。

## 使用流程

1. 选择主题（感情/事业/财运/健康/学业/大运）
2. 选择具体场景（如“单身脱单”）
3. 勾选你关心的问题（可多选）
4. 点击「生成专属提问话术」
5. 复制 Prompt，粘贴到 AI 平台，替换【星盘数据】部分

## 与 JHora 清洗工具的关系

建议配合使用 [JHora 星盘清洗工具](https://jhora-clean.pages.dev)：

1. 用清洗工具将 JHora 原始输出整理为标准化星盘数据
2. 用提问助手生成专属提问话术
3. 将清洗好的数据粘贴到 Prompt 中，发给 AI

## 项目结构
```text
/
├── index.html                 # 页面结构
├── style.css                  # 样式
├── js/
│   ├── app.js                 # UI 逻辑 + 状态管理
│   ├── renderer.js            # 模板引擎
│   └── config/
│       ├── common.js          # 全局星体库
│       ├── love.js            # 感情婚姻配置
│       ├── career.js          # 事业发展配置
│       ├── wealth.js          # 财富运势配置
│       ├── health.js          # 身心健康配置
│       ├── study.js           # 学业教育配置
│       └── dasha.js           # 大运流年配置
└── prompt-blocks/             # Prompt 模块组件
```


## License

MIT
