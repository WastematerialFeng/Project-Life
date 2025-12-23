export enum Difficulty {
    EASY = '简单',
    MEDIUM = '普通',
    HARD = '困难',
    EPIC = '史诗'
}

export enum QuestType {
    MAIN = '主线',
    SIDE = '支线',
    DAILY = '日常'
}

export interface Quest {
    id: string;
    title: string;
    desc: string;
    difficulty: Difficulty;
    type: QuestType;
    spCost: number;
    rewardGold: number;
    rewardExp: number;
    isCompleted: boolean;
    isVisible: boolean;
    parentQuestId?: string;
    step?: number;
}

export enum UserStatus {
    NORMAL = 'NORMAL',
    SSJ = 'SSJ', // Super Saiyan (High SP)
    EXHAUSTED = 'EXHAUSTED' // Low SP/HP
}

export interface UserState {
    name: string;
    level: number;
    currentExp: number;
    maxExp: number;
    hp: number;
    maxHp: number;
    sp: number; // Spirit/Focus
    maxSp: number;
    gold: number;
    status: UserStatus;
}