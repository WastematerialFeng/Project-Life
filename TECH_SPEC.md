# Project Life 技术规范文档

> 版本: v0.1.0  
> 最后更新: 2024-12-24  
> 维护者: WastematerialFeng

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈](#2-技术栈)
3. [项目结构](#3-项目结构)
4. [开发规范](#4-开发规范)
5. [版本更新日志](#5-版本更新日志)

---

## 1. 项目概述

**Project Life: 赛亚人崛起篇** 是一款游戏化的个人生活管理系统，采用龙珠主题的 RPG 风格，将日常任务转化为游戏任务，通过即时反馈机制帮助用户建立良好的行为习惯。

### 核心功能
- 属性系统 (HP/SP/INT/CON/CHA)
- 任务系统 (主线/支线/每日)
- 经济系统 (Z金币 + 商店)
- AI 任务拆解 (LLM 集成)

---

## 2. 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 核心框架 |
| Vite | 5.x | 构建工具 |
| Tailwind CSS | 3.x | 样式布局 |
| NES.css | 2.x | 像素风组件库 |
| Framer Motion | 10.x | 动画效果 |
| Zustand | 4.x | 状态管理 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.11+ | 运行环境 |
| FastAPI | 0.100+ | Web 框架 |
| SQLite | 3.x | 数据库 |
| SQLAlchemy | 2.x | ORM |
| Pydantic | 2.x | 数据验证 |

### AI 集成
| 技术 | 用途 |
|------|------|
| OpenAI API / Gemini API | 任务拆解 |
| LangChain (可选) | LLM 编排 |

---

## 3. 项目结构

```
Project Life/
├── PRD.md                 # 产品需求文档
├── TECH_SPEC.md           # 技术规范文档 (本文档)
├── claude.md              # AI 开发上下文记录
├── backend/               # 后端代码
│   ├── main.py            # FastAPI 入口
│   ├── models.py          # 数据库模型
│   ├── schemas.py         # Pydantic 模式
│   ├── database.py        # 数据库配置
│   └── routers/           # API 路由
├── frontend/              # 前端代码
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── stores/        # Zustand 状态
│   │   ├── assets/        # 静态资源
│   │   └── App.jsx        # 主应用
│   └── package.json
└── assets/                # 共享资源 (图片/音效)
```

---

## 4. 开发规范

### 4.1 Git 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>
```

**Type 类型：**
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式 (不影响功能)
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具变更

**示例：**
```
feat(backend): 添加用户属性系统 API

- 新增 User 模型 (HP/SP/Gold)
- 实现 /user/status 接口
- 添加状态自动计算逻辑
```

### 4.2 代码风格

**Python (后端):**
- 遵循 PEP 8
- 使用 Type Hints
- 函数/类使用 docstring 注释

**JavaScript/React (前端):**
- 使用 ES6+ 语法
- 组件使用函数式 + Hooks
- 文件命名: PascalCase (组件), camelCase (工具函数)

### 4.3 分支策略

- `main`: 稳定版本
- `dev`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支

---

## 5. 版本更新日志

### v0.1.0 (2024-12-24)

**初始化项目**

| 时间 | 操作 | 修改文件 | 说明 |
|------|------|----------|------|
| 2024-12-24 01:59 | 创建 | PRD.md | 产品需求文档 |
| 2024-12-24 02:00 | 创建 | TECH_SPEC.md | 技术规范文档 |
| 2024-12-24 02:00 | 创建 | claude.md | AI 开发上下文 |
| 2024-12-24 02:00 | 初始化 | .git | Git 仓库初始化 |
| 2024-12-24 02:08 | 创建 | backend/ | 后端项目结构 |
| 2024-12-24 02:08 | 创建 | backend/main.py | FastAPI 主应用 |
| 2024-12-24 02:08 | 创建 | backend/models.py | SQLAlchemy 数据模型 |
| 2024-12-24 02:08 | 创建 | backend/schemas.py | Pydantic 数据模式 |
| 2024-12-24 02:08 | 创建 | backend/database.py | 数据库配置 |
| 2024-12-24 02:08 | 创建 | backend/requirements.txt | Python 依赖 |
| 2024-12-24 02:15 | 创建 | frontend/ | 前端项目结构 |
| 2024-12-24 02:15 | 创建 | frontend/App.tsx | React 主应用 |
| 2024-12-24 02:15 | 创建 | frontend/components/ | UI 组件 (Avatar, StatusHUD, QuestLog, Oracle) |
| 2024-12-24 02:15 | 创建 | frontend/services/ | Gemini AI 服务 |
| 2024-12-24 02:35 | 修改 | frontend/index.html | 增强CSS动画效果 |
| 2024-12-24 02:35 | 修改 | frontend/constants.ts | 替换像素风头像 |
| 2024-12-24 02:35 | 修改 | frontend/components/StatusHUD.tsx | 添加图标、经验条优化 |
| 2024-12-24 02:35 | 修改 | frontend/components/QuestLog.tsx | 空状态引导优化 |
| 2024-12-24 02:35 | 修改 | frontend/App.tsx | 行动区分离、商店诱饵、漂浮数字 |
| 2024-12-24 02:35 | 创建 | frontend/components/FloatingText.tsx | 漂浮数字组件 |

---

## 附录

### A. 环境变量配置

```env
# .env.example
DATABASE_URL=sqlite:///./game.db
OPENAI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

### B. 本地开发启动

```bash
# 后端
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# 前端
cd frontend
npm install
npm run dev
```

---

*本文档随项目开发持续更新*
