// API 服务 - 连接后端
const API_BASE = 'http://localhost:8000';

export interface UserData {
    id: number;
    username: string;
    level: number;
    current_exp: number;
    max_exp: number;
    hp: number;
    max_hp: number;
    sp: number;
    max_sp: number;
    gold: number;
    status: 'NORMAL' | 'SSJ' | 'EXHAUSTED';
    int_stat: number;
    con_stat: number;
    cha_stat: number;
}

export interface QuestData {
    id: number;
    user_id: number;
    title: string;
    description: string;
    difficulty: 'EASY' | 'NORMAL' | 'HARD' | 'EPIC';
    quest_type: 'MAIN' | 'SIDE' | 'DAILY';
    reward_gold: number;
    reward_exp: number;
    sp_cost: number;
    is_completed: boolean;
    is_visible: boolean;
    parent_quest_id: number | null;
    step_order: number;
}

export interface CompleteQuestResponse {
    success: boolean;
    message: string;
    gold_earned: number;
    exp_earned: number;
    level_up: boolean;
    new_level: number | null;
    next_quest_unlocked: boolean;
}

// User API
export const createUser = async (username: string): Promise<UserData> => {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
};

export const getUser = async (userId: number): Promise<UserData> => {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    if (!res.ok) throw new Error('Failed to get user');
    return res.json();
};

export const userRest = async (userId: number): Promise<{ hp_restored: number; sp_restored: number }> => {
    const res = await fetch(`${API_BASE}/users/${userId}/rest`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to rest');
    return res.json();
};

// Quest API
export const getUserQuests = async (userId: number): Promise<QuestData[]> => {
    const res = await fetch(`${API_BASE}/users/${userId}/quests`);
    if (!res.ok) throw new Error('Failed to get quests');
    return res.json();
};

export const createQuest = async (userId: number, quest: {
    title: string;
    description: string;
    difficulty: string;
    quest_type: string;
    reward_gold: number;
    reward_exp: number;
    sp_cost: number;
}): Promise<QuestData> => {
    const res = await fetch(`${API_BASE}/users/${userId}/quests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quest)
    });
    if (!res.ok) throw new Error('Failed to create quest');
    return res.json();
};

export const completeQuest = async (questId: number): Promise<CompleteQuestResponse> => {
    const res = await fetch(`${API_BASE}/quests/${questId}/complete`, { method: 'POST' });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'Failed to complete quest');
    }
    return res.json();
};

// Generate quests (mock AI)
export const generateQuests = async (goalText: string): Promise<any[]> => {
    const res = await fetch(`${API_BASE}/quests/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal_text: goalText })
    });
    if (!res.ok) throw new Error('Failed to generate quests');
    return res.json();
};

// Init items
export const initItems = async (): Promise<void> => {
    await fetch(`${API_BASE}/admin/init-items`, { method: 'POST' });
};
