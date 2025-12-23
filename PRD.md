Project Life: 赛亚人崛起篇 —— 产品需求与架构白皮书 (PRD)
版本号： V1.0 首席架构师： Gemini 执行开发者： 您 (配合 VSCode + Claude Code) 核心理念： 放弃意志力，建立反馈系统；用“无知的勇气”开启无限游戏。

1. 项目愿景与核心哲学 (Project Vision)
1.1 核心痛点解决
本项目旨在解决“三天打鱼两天晒网”的行为模式。不仅仅是一个 To-Do List，而是一套生物反馈接管系统。

对抗本能： 将延迟满足（长期项目）转化为即时满足（点击完成 -> 金币跳动 -> 经验条增长）。

消除焦虑： 通过“任务日志”和 AI 拆解，消除因不知道下一步做什么而产生的行动瘫痪。

可视化成长： 将隐性的个人能力（编程、健康）转化为显性的 RPG 属性（INT, CON, HP, SP）。

1.2 世界观设定 (The Theme)
美术风格： 2D 像素风 (Pixel Art) + 怀旧 RPG UI (参考《泰拉瑞亚》、《冒险岛》)。

主角设定： 少年孙悟空 (Dragon Ball)。

象征意义：不断突破界限、遇强则强、纯粹的修行者。

核心隐喻： 现实生活即“修行”，困难即“BOSS”，奖励即“天下第一武道会奖金”。

2. 游戏核心机制 (Game Mechanics)
2.1 属性系统 (Stats System)
基础生存属性 (Vitality Stats)
这是一套动态平衡系统，直接决定你是否能进行工作。

HP (生命值/体力)：

来源： 睡眠 (+50/晚)、有氧运动 (+20/次)、健康饮食 (+5)。

消耗： 熬夜 (-10/小时)、任务失败惩罚 (-10)、吃垃圾食品 (-5)。

归零机制 (Lockdown)： 当 HP <= 0，系统进入“重伤强制休息模式”。前端锁定所有 INT 类任务的“完成”按钮，界面变红，提示“去睡觉！”。

SP (专注力/元气)：

来源： 冥想、小憩、使用道具“仙豆”。

消耗： 深度工作 (Deep Work) 每小时消耗 SP。

视觉联动： 决定孙悟空的形态（详见 UI 部分）。

成长属性 (Growth Stats)
INT (智力)： 编程、阅读、逻辑思考任务增加。

CON (体质)： 健身、早睡任务增加。

CHA (魅力)： 社交、演讲、分享任务增加。

Level (等级)： 综合经验值决定，每升一级解锁新的系统功能或商店权限。

2.2 经济系统 (Economy & Gacha)
货币：Z金币 (Zeni)
获取方式 (阶梯式)：

每日委托 (Daily): +10 ~ 20 Gold

支线任务 (Side): +50 ~ 100 Gold

主线阶段 (Main Stage): +500 Gold

史诗成就 (Epic): +1000 Gold

惩罚机制 (Drop System)：

当日未完成每日委托：HP -10，金币 -50 (模拟从口袋掉钱)。

周目标未达成：金币扣除当前总额的 10%。

商店与奖励 (The Shop)
红色传说级 (Real World Rewards):

Tesla Model 3/Y: 解锁条件：金币累积 1,000,000 + 达成特定成就。

MacBook Pro: 解锁条件：金币累积 50,000。

新疆自驾游: 解锁条件：金币累积 30,000 + 连续 3 个月完成主线。

虚拟道具 (Game Items):

仙豆 (Senzu Bean): 瞬间回满 SP。

重力室门票: 接下来 2 小时任务经验值 x2。

免罪金牌: 抵消一次任务失败的惩罚。

2.3 任务系统 (Quest Architecture)
AI 导航仪 (The Oracle):

输入：“本周我要完成 Project Life 的后端开发。”

后台：调用 LLM (Gemini/Claude) 进行拆解。

迷雾模式 (Fog of War): 默认开启。后台生成了 5 个阶段，但前端只显示第 1 阶段任务。完成第 1 阶段后，第 2 阶段的任务才会从迷雾中显现。

任务分类：

主线 (Main): 系统开发、核心事业。

支线 (Side): 阅读《黑客与画家》、整理房间。

每日 (Daily): 喝水 2L、背单词 20 个。

3. UI/UX 视觉设计规范
3.1 界面布局 (The HUD)
风格参考： 暗色像素背景 (Dark Pixel Theme)，金色/木纹边框。

左上角：角色状态区 (Avatar)

Q版孙悟空头像：

状态 A (常态): 20% < SP < 80%。标准黑发悟空，表情平静。

状态 B (超级赛亚人): SP >= 80%。金发竖起，周身带有 CSS 编写的金色光焰呼吸动画 (Glow Effect)。

状态 C (力竭/战损): SP <= 20%。黑白滤镜，表情痛苦，嘴角带血迹像素，身体轻微颤抖。

属性条：

HP：红心像素格 (类似于塞尔达或麦块)。

SP：蓝色能量条。

顶部居中：资产区

显示金币图标 (Z) 和数字滚轮特效。

中央区域：任务卷轴 (Quest Scroll)

背景材质：羊皮纸或全息战术板。

任务卡片：

未完成：暗淡，只有文字。

可交付：边框闪烁微光。

已完成：盖上红色的 "COMPLETED" 像素印章，随后淡出。

右下角：功能入口

背包 (Inventory) / 商店 (Shop) / 设置 (Settings - 含后台管理开关)。

3.2 交互反馈 (Juice)
点击完成任务：

播放清脆的 8-bit 金币音效。

屏幕轻微震动 (Screen Shake)。

+EXP 数字从头像处向上飘起。

升级/重要成就：

屏幕变暗，正中央播放高亮动画，类似《最终幻想》升级结算。

4. 技术架构方案 (Technical Stack)
为了实现高效率开发，采用 Web 全栈 方案，且优先适配 PWA (Progressive Web App) 以便手机安装。

4.1 开发工具链 (The Toolchain)
IDE: VS Code / Cursor (集成 AI)。

Backend Coding: Claude Code (逻辑强，写 Python/SQL 准确)。

Frontend Coding: Gemini 2.0 / 1.5 Pro (视觉理解好，写 CSS/React 强)。

4.2 技术栈详细
前端 (Frontend):

Core: React 18 + Vite (极速构建)。

Styling: Tailwind CSS (布局) + NES.css (核心像素风组件库，必须引入)。

Motion: Framer Motion (处理丝滑的 UI 进出场动画)。

State: Zustand (轻量级全局状态管理，比 Redux 简单)。

后端 (Backend):

Core: Python FastAPI (现代、快、自动生成文档)。

Database: SQLite (初期单文件 game.db，无需配置数据库服务器)。

AI Integration: LangChain 或直接调用 OpenAI/Gemini API (处理任务拆解)。

5. 开发路线图 (Roadmap)
第一周：原型机 (The Prototype)
Day 1: 搭建 FastAPI + SQLite 环境，跑通 User 和 Quest 的增删改查 (CRUD)。

Day 2: 搭建 React + Tailwind 环境，引入 NES.css，画出静态的“任务卷轴”和“悟空头像”。

Day 3: 前后端联调。实现：点击网页按钮 -> 数据库金币增加 -> 网页金币数字变动。

第二周：视觉与逻辑深化 (Visuals & Logic)
Day 4-5: 制作悟空的三种状态图，编写 CSS 动画实现“超级赛亚人”光效。实现 HP/SP 状态机逻辑。

Day 6: 开发“商店”界面和“道具背包”。

第三周：AI 大脑接入 (The AI Brain)
Day 7: 编写 Prompt，接入 LLM API，实现“周目标 -> JSON 任务列表”的自动生成。

Day 8: 完善“迷雾模式”和“惩罚机制”。

6. AI 辅助开发指令集 (Prompt Library)
以下指令请直接复制，分别发给 Claude Code 和 Gemini。

6.1 发送给 Claude Code (后端开发)
Markdown

Role: Senior Python Backend Developer
Context: Creating a gamified life management system called "Project Life".
Tech Stack: Python FastAPI, SQLite, Pydantic.

Task: Create the core backend structure.

Requirements:
1.  **Database Models (SQLAlchemy/Tortoise ORM):**
    -   `User`: id, username, level, current_exp, max_exp, hp, max_hp, sp, max_sp, gold, status (enum: NORMAL, SSJ, EXHAUSTED).
    -   `Quest`: id, title, description, difficulty (EASY, NORMAL, HARD, EPIC), reward_gold, reward_exp, is_completed, parent_quest_id (for AI breakdown), is_visible (for Fog of War).
    -   `Inventory`: user_id, item_id, quantity.

2.  **API Endpoints:**
    -   `POST /quests/generate`: Accepts a `goal_text`. (Mock the AI response for now: return a JSON list of 5 steps, 1st visible, others hidden).
    -   `POST /quests/{id}/complete`:
        -   Check if HP > 0. If not, return error "REST_REQUIRED".
        -   Update User: Gold +, Exp +, SP - (cost based on difficulty).
        -   Check Level Up logic.
        -   Unlock next quest if it was a parent quest chain.
    -   `POST /user/rest`: Restore HP/SP.
    -   `POST /admin/config`: Toggle "Fog of War" mode.

3.  **Business Logic:**
    -   Implement the logic that auto-updates the User `status` based on SP percentage (Normal/SSJ/Exhausted) whenever User data is retrieved.

Output: Please provide the `models.py`, `schemas.py`, and `main.py` file structures.
6.2 发送给 Gemini (前端开发)
Markdown

Role: Senior Frontend Engineer & Pixel Art UI Designer
Context: Developing the UI for "Project Life", a Dragon Ball themed productivity RPG.
Tech Stack: React, Vite, Tailwind CSS, Framer Motion, NES.css.

Task: Build the Main Dashboard Component (`Dashboard.jsx`).

Visual Requirements:
1.  **Avatar Component:**
    -   Display a pixel art Goku image.
    -   **Dynamic Styling:**
        -   If `sp > 80`: Add a golden glow animation (CSS box-shadow pulsing).
        -   If `sp < 20`: Apply a grayscale filter and a shaking animation.
    -   Display HP bar (Red) and SP bar (Blue) below the avatar using Tailwind.

2.  **Quest Scroll Component:**
    -   Use a container with a parchment/scroll texture background.
    -   List items should look like RPG quest markers.
    -   If a quest is `is_visible=false`, do not render it (or render as locked/blur).
    -   Button styling: Use NES.css buttons (Pixel style).

3.  **State Feedback:**
    -   When `hp <= 0`: Overlay the entire screen with a semi-transparent red layer (`pointer-events-none`) and centered text "CRITICAL CONDITION - REST NEEDED".

Output: Please write the React components code. Assume I have the assets (images) ready.
6.3 发送给 LLM (用于任务生成功能的 System Prompt)
这是你将来写在代码里调用 AI 用的提示词

Markdown

You are the "Grand Kai" (大界王) of Project Life.
Your job is to break down a vague human goal into a structured RPG quest line.

User Goal: {user_input}

Output Format: JSON only.
Structure:
[
  {
    "step": 1,
    "title": "Quest Title (Action Oriented)",
    "desc": "Short flavor text describing the task",
    "difficulty": "EASY|MEDIUM|HARD",
    "type": "MAIN",
    "sp_cost": 10
  },
  ...
]

Rules:
1. Break it down into 3-5 steps.
2. The first step must be an immediate action (Micro-habit).
3. Use Dragon Ball or RPG metaphors in the description.