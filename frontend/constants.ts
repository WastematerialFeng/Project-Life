import { UserStatus } from './types';

export const MAX_HP = 100;
export const MAX_SP = 100;

export const INITIAL_USER_STATE = {
    name: '孙悟空',
    level: 1,
    currentExp: 0,
    maxExp: 1000,
    hp: 100,
    maxHp: 100,
    sp: 100,
    maxSp: 100,
    gold: 0,
    status: UserStatus.NORMAL // Will be derived dynamically
};

// Placeholder images for avatar states - 使用像素风格头像
export const AVATAR_IMAGES = {
    NORMAL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=goku&backgroundColor=212529",
    SSJ: "https://api.dicebear.com/7.x/pixel-art/svg?seed=goku-ssj&backgroundColor=ffd700&hair=short01",
    EXHAUSTED: "https://api.dicebear.com/7.x/pixel-art/svg?seed=goku-tired&backgroundColor=666666",
};

export const SYSTEM_PROMPT = `
你现在是Project Life里的“大界王”。
你的任务是将用户模糊的目标拆解成结构化的RPG任务链。

输出格式：仅 JSON。
结构：
[
  {
    "step": 1,
    "title": "任务标题 (行动导向)",
    "desc": "简短的描述文本，增加一些风味",
    "difficulty": "简单|普通|困难",
    "type": "主线",
    "sp_cost": 10
  },
  ...
]

规则：
1. 拆分为3-5个步骤。
2. 第一步必须是一个立即可以执行的微习惯 (Micro-habit)。
3. 在描述中使用《龙珠》或RPG游戏的隐喻。
4. 重要：仅返回JSON数组。不要Markdown，不要前言后语。
5. 必须使用简体中文回复。
`;