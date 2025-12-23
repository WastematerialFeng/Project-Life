from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class UserStatus(str, Enum):
    NORMAL = "NORMAL"
    SSJ = "SSJ"
    EXHAUSTED = "EXHAUSTED"


class QuestDifficulty(str, Enum):
    EASY = "EASY"
    NORMAL = "NORMAL"
    HARD = "HARD"
    EPIC = "EPIC"


class QuestType(str, Enum):
    MAIN = "MAIN"
    SIDE = "SIDE"
    DAILY = "DAILY"


# User Schemas
class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    pass


class UserResponse(UserBase):
    id: int
    level: int
    current_exp: int
    max_exp: int
    hp: int
    max_hp: int
    sp: int
    max_sp: int
    gold: int
    status: UserStatus
    int_stat: int
    con_stat: int
    cha_stat: int

    class Config:
        from_attributes = True


# Quest Schemas
class QuestBase(BaseModel):
    title: str
    description: Optional[str] = ""
    difficulty: QuestDifficulty = QuestDifficulty.NORMAL
    quest_type: QuestType = QuestType.DAILY
    reward_gold: int = 10
    reward_exp: int = 10
    sp_cost: int = 10


class QuestCreate(QuestBase):
    pass


class QuestResponse(QuestBase):
    id: int
    user_id: int
    is_completed: bool
    is_visible: bool
    parent_quest_id: Optional[int]
    step_order: int
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


# Quest Generation
class QuestGenerateRequest(BaseModel):
    goal_text: str


class GeneratedQuestStep(BaseModel):
    step: int
    title: str
    desc: str
    difficulty: str
    type: str
    sp_cost: int


# Item Schemas
class ItemBase(BaseModel):
    name: str
    description: str
    price: int
    hp_restore: int = 0
    sp_restore: int = 0
    exp_multiplier: int = 1
    is_consumable: bool = True


class ItemResponse(ItemBase):
    id: int

    class Config:
        from_attributes = True


# Inventory Schemas
class InventoryResponse(BaseModel):
    id: int
    user_id: int
    item_id: int
    quantity: int
    item: ItemResponse

    class Config:
        from_attributes = True


# Action Responses
class CompleteQuestResponse(BaseModel):
    success: bool
    message: str
    gold_earned: int
    exp_earned: int
    level_up: bool
    new_level: Optional[int]
    next_quest_unlocked: bool


class RestResponse(BaseModel):
    success: bool
    message: str
    hp_restored: int
    sp_restored: int


class UseItemResponse(BaseModel):
    success: bool
    message: str
    hp_change: int
    sp_change: int
