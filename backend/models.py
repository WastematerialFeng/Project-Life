from sqlalchemy import Column, Integer, String, Boolean, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from database import Base


class UserStatus(str, enum.Enum):
    NORMAL = "NORMAL"
    SSJ = "SSJ"  # Super Saiyan
    EXHAUSTED = "EXHAUSTED"


class QuestDifficulty(str, enum.Enum):
    EASY = "EASY"
    NORMAL = "NORMAL"
    HARD = "HARD"
    EPIC = "EPIC"


class QuestType(str, enum.Enum):
    MAIN = "MAIN"
    SIDE = "SIDE"
    DAILY = "DAILY"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    
    # Level & Experience
    level = Column(Integer, default=1)
    current_exp = Column(Integer, default=0)
    max_exp = Column(Integer, default=100)
    
    # Vitality Stats
    hp = Column(Integer, default=100)
    max_hp = Column(Integer, default=100)
    sp = Column(Integer, default=100)
    max_sp = Column(Integer, default=100)
    
    # Economy
    gold = Column(Integer, default=0)
    
    # Status (auto-calculated based on SP)
    status = Column(Enum(UserStatus), default=UserStatus.NORMAL)
    
    # Growth Stats
    int_stat = Column(Integer, default=10)  # Intelligence
    con_stat = Column(Integer, default=10)  # Constitution
    cha_stat = Column(Integer, default=10)  # Charisma
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quests = relationship("Quest", back_populates="user")
    inventory = relationship("Inventory", back_populates="user")


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    title = Column(String(200))
    description = Column(String(500))
    
    difficulty = Column(Enum(QuestDifficulty), default=QuestDifficulty.NORMAL)
    quest_type = Column(Enum(QuestType), default=QuestType.DAILY)
    
    # Rewards
    reward_gold = Column(Integer, default=10)
    reward_exp = Column(Integer, default=10)
    sp_cost = Column(Integer, default=10)
    
    # Status
    is_completed = Column(Boolean, default=False)
    is_visible = Column(Boolean, default=True)  # For Fog of War
    
    # Quest Chain (for AI breakdown)
    parent_quest_id = Column(Integer, ForeignKey("quests.id"), nullable=True)
    step_order = Column(Integer, default=1)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="quests")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    description = Column(String(300))
    price = Column(Integer, default=100)
    
    # Effects
    hp_restore = Column(Integer, default=0)
    sp_restore = Column(Integer, default=0)
    exp_multiplier = Column(Integer, default=1)
    
    is_consumable = Column(Boolean, default=True)


class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    quantity = Column(Integer, default=1)
    
    user = relationship("User", back_populates="inventory")
    item = relationship("Item")
