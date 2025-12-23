# Project Life - AI 开发上下文记录

> 本文档用于记录与 Claude/AI 协作开发的上下文信息，确保对话连续性和项目一致性。

---

## 项目基本信息

| 项目名称 | Project Life: 赛亚人崛起篇 |
|----------|---------------------------|
| 仓库地址 | https://github.com/WastematerialFeng/Project-Life.git |
| 开发者 | WastematerialFeng |
| AI 助手 | Claude (后端) + Gemini (前端) |
| 启动日期 | 2024-12-24 |

---

## 当前开发状态

### 进度概览

- [x] PRD 文档完成
- [x] Git 仓库初始化
- [x] 技术规范文档创建
- [x] claude.md 上下文文档创建
- [x] 后端原型搭建 (FastAPI + SQLite)
- [ ] 前端原型搭建 (React + Vite + NES.css)
- [ ] 前后端联调
- [ ] 视觉与动画实现
- [ ] AI 任务拆解功能

### 当前阶段

**第一周：原型机开发**

---

## 核心设计决策

### 1. 技术选型理由

| 选择 | 理由 |
|------|------|
| FastAPI | 现代、快速、自动生成 API 文档 |
| SQLite | 初期单文件数据库，无需配置服务器 |
| React + Vite | 极速构建，生态丰富 |
| NES.css | 核心像素风组件库，契合 RPG 主题 |
| Zustand | 轻量级状态管理，比 Redux 简单 |

### 2. 核心机制

**属性系统：**
- HP (生命值): 睡眠/运动恢复，熬夜/失败消耗
- SP (专注力): 决定悟空形态 (常态/超赛/力竭)
- 归零锁定: HP <= 0 时锁定 INT 类任务

**经济系统：**
- Z金币: 任务奖励获取，失败惩罚扣除
- 商店: 虚拟道具 + 现实奖励

**任务系统：**
- 迷雾模式: 只显示当前阶段任务
- AI 拆解: LLM 将目标拆解为 3-5 步

---

## 对话历史摘要

### Session 1 (2024-12-24)

**用户需求：**
1. 学习 PRD.md 内容
2. 规划开发路线
3. 初始化 Git 仓库
4. 创建技术规范文档 (中文，含版本日志)
5. 创建 claude.md 上下文文档

**执行结果：**
- 分析 PRD 并制定三周开发计划
- 初始化 Git 仓库并连接远程
- 创建 TECH_SPEC.md 和 claude.md

**下一步计划：**
- Day 1: 搭建 FastAPI + SQLite 环境
- 创建 User, Quest, Inventory 数据模型
- 实现基础 CRUD API

---

## 关键代码片段/Prompt

### 后端开发 Prompt (发送给 Claude)

```markdown
Role: Senior Python Backend Developer
Context: Creating a gamified life management system called "Project Life".
Tech Stack: Python FastAPI, SQLite, Pydantic.
...
(详见 PRD.md 第 6.1 节)
```

### 前端开发 Prompt (发送给 Gemini)

```markdown
Role: Senior Frontend Engineer & Pixel Art UI Designer
Context: Developing the UI for "Project Life", a Dragon Ball themed productivity RPG.
...
(详见 PRD.md 第 6.2 节)
```

### AI 任务生成 System Prompt

```markdown
You are the "Grand Kai" (大界王) of Project Life.
Your job is to break down a vague human goal into a structured RPG quest line.
...
(详见 PRD.md 第 6.3 节)
```

---

## 待解决问题

1. [ ] 悟空像素图素材来源 (自制/购买/AI生成)
2. [ ] 8-bit 音效资源获取
3. [ ] PWA 配置方案确定

---

## 备注

- 每次重要对话后更新本文档
- 版本更新同步更新 TECH_SPEC.md 的日志
- 保持文档与代码同步

---

*最后更新: 2024-12-24 02:00*
