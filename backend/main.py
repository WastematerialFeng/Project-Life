from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import engine, get_db, Base
from models import User, Quest, Item, Inventory, UserStatus, QuestDifficulty, QuestType
from schemas import (
    UserCreate, UserResponse,
    QuestCreate, QuestResponse, QuestGenerateRequest, GeneratedQuestStep,
    CompleteQuestResponse, RestResponse, UseItemResponse,
    ItemResponse, InventoryResponse
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Life API",
    description="赛亚人崛起篇 - 游戏化生活管理系统",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def update_user_status(user: User) -> User:
    """Auto-update user status based on SP percentage"""
    sp_percent = (user.sp / user.max_sp) * 100
    if sp_percent >= 80:
        user.status = UserStatus.SSJ
    elif sp_percent <= 20:
        user.status = UserStatus.EXHAUSTED
    else:
        user.status = UserStatus.NORMAL
    return user


def check_level_up(user: User) -> bool:
    """Check and process level up"""
    if user.current_exp >= user.max_exp:
        user.level += 1
        user.current_exp -= user.max_exp
        user.max_exp = int(user.max_exp * 1.2)
        user.max_hp += 10
        user.max_sp += 10
        user.hp = user.max_hp
        user.sp = user.max_sp
        return True
    return False


# ==================== USER ENDPOINTS ====================

@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user = update_user_status(user)
    db.commit()
    return user


@app.post("/users/{user_id}/rest", response_model=RestResponse)
def user_rest(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    hp_restored = user.max_hp - user.hp
    sp_restored = user.max_sp - user.sp
    user.hp = user.max_hp
    user.sp = user.max_sp
    user = update_user_status(user)
    db.commit()
    
    return RestResponse(
        success=True,
        message="休息完毕，HP和SP已恢复！",
        hp_restored=hp_restored,
        sp_restored=sp_restored
    )


# ==================== QUEST ENDPOINTS ====================

@app.get("/users/{user_id}/quests", response_model=List[QuestResponse])
def get_user_quests(user_id: int, db: Session = Depends(get_db)):
    quests = db.query(Quest).filter(
        Quest.user_id == user_id,
        Quest.is_visible == True
    ).all()
    return quests


@app.post("/users/{user_id}/quests", response_model=QuestResponse)
def create_quest(user_id: int, quest: QuestCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_quest = Quest(
        user_id=user_id,
        title=quest.title,
        description=quest.description,
        difficulty=quest.difficulty,
        quest_type=quest.quest_type,
        reward_gold=quest.reward_gold,
        reward_exp=quest.reward_exp,
        sp_cost=quest.sp_cost
    )
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)
    return db_quest


@app.post("/quests/{quest_id}/complete", response_model=CompleteQuestResponse)
def complete_quest(quest_id: int, db: Session = Depends(get_db)):
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    
    if quest.is_completed:
        raise HTTPException(status_code=400, detail="Quest already completed")
    
    user = db.query(User).filter(User.id == quest.user_id).first()
    
    # Check HP
    if user.hp <= 0:
        raise HTTPException(
            status_code=400,
            detail="REST_REQUIRED: HP为0，请先休息！"
        )
    
    # Check SP
    if user.sp < quest.sp_cost:
        raise HTTPException(
            status_code=400,
            detail="SP不足，请休息或使用仙豆！"
        )
    
    # Complete quest
    quest.is_completed = True
    quest.completed_at = datetime.utcnow()
    
    # Update user stats
    user.gold += quest.reward_gold
    user.current_exp += quest.reward_exp
    user.sp -= quest.sp_cost
    
    # Check level up
    level_up = check_level_up(user)
    user = update_user_status(user)
    
    # Unlock next quest in chain
    next_quest_unlocked = False
    if quest.parent_quest_id:
        next_quest = db.query(Quest).filter(
            Quest.parent_quest_id == quest.parent_quest_id,
            Quest.step_order == quest.step_order + 1
        ).first()
        if next_quest:
            next_quest.is_visible = True
            next_quest_unlocked = True
    
    db.commit()
    
    return CompleteQuestResponse(
        success=True,
        message=f"任务完成！获得 {quest.reward_gold} 金币，{quest.reward_exp} 经验！",
        gold_earned=quest.reward_gold,
        exp_earned=quest.reward_exp,
        level_up=level_up,
        new_level=user.level if level_up else None,
        next_quest_unlocked=next_quest_unlocked
    )


@app.post("/quests/generate", response_model=List[GeneratedQuestStep])
def generate_quests(request: QuestGenerateRequest, db: Session = Depends(get_db)):
    """Mock AI quest generation (will integrate LLM later)"""
    goal = request.goal_text
    
    # Mock response - simulating AI breakdown
    mock_quests = [
        GeneratedQuestStep(
            step=1,
            title=f"准备阶段：了解{goal[:10]}...",
            desc="修行的第一步，先了解敌人的实力！",
            difficulty="EASY",
            type="MAIN",
            sp_cost=10
        ),
        GeneratedQuestStep(
            step=2,
            title="基础训练：搭建环境",
            desc="在重力室中进行基础训练！",
            difficulty="NORMAL",
            type="MAIN",
            sp_cost=20
        ),
        GeneratedQuestStep(
            step=3,
            title="核心修炼：实现主要功能",
            desc="突破极限，向超级赛亚人迈进！",
            difficulty="HARD",
            type="MAIN",
            sp_cost=30
        ),
        GeneratedQuestStep(
            step=4,
            title="精进阶段：优化完善",
            desc="精益求精，追求完美的战斗形态！",
            difficulty="NORMAL",
            type="MAIN",
            sp_cost=20
        ),
        GeneratedQuestStep(
            step=5,
            title="最终决战：部署上线",
            desc="天下第一武道会，展示你的成果！",
            difficulty="EPIC",
            type="MAIN",
            sp_cost=40
        )
    ]
    
    return mock_quests


# ==================== ITEM & INVENTORY ====================

@app.get("/items", response_model=List[ItemResponse])
def get_items(db: Session = Depends(get_db)):
    return db.query(Item).all()


@app.get("/users/{user_id}/inventory", response_model=List[InventoryResponse])
def get_inventory(user_id: int, db: Session = Depends(get_db)):
    return db.query(Inventory).filter(Inventory.user_id == user_id).all()


@app.post("/users/{user_id}/inventory/{item_id}/use", response_model=UseItemResponse)
def use_item(user_id: int, item_id: int, db: Session = Depends(get_db)):
    inv = db.query(Inventory).filter(
        Inventory.user_id == user_id,
        Inventory.item_id == item_id
    ).first()
    
    if not inv or inv.quantity <= 0:
        raise HTTPException(status_code=400, detail="道具不足！")
    
    user = db.query(User).filter(User.id == user_id).first()
    item = db.query(Item).filter(Item.id == item_id).first()
    
    hp_change = min(item.hp_restore, user.max_hp - user.hp)
    sp_change = min(item.sp_restore, user.max_sp - user.sp)
    
    user.hp += hp_change
    user.sp += sp_change
    inv.quantity -= 1
    
    user = update_user_status(user)
    db.commit()
    
    return UseItemResponse(
        success=True,
        message=f"使用了 {item.name}！",
        hp_change=hp_change,
        sp_change=sp_change
    )


# ==================== ADMIN ====================

@app.post("/admin/init-items")
def init_items(db: Session = Depends(get_db)):
    """Initialize default items"""
    default_items = [
        Item(name="仙豆", description="瞬间回满SP！", price=500, sp_restore=100),
        Item(name="重力室门票", description="2小时内经验值x2", price=300, exp_multiplier=2),
        Item(name="免罪金牌", description="抵消一次任务失败惩罚", price=200),
        Item(name="小型HP药水", description="恢复30点HP", price=50, hp_restore=30),
        Item(name="小型SP药水", description="恢复30点SP", price=50, sp_restore=30),
    ]
    
    for item in default_items:
        existing = db.query(Item).filter(Item.name == item.name).first()
        if not existing:
            db.add(item)
    
    db.commit()
    return {"message": "道具初始化完成！"}


@app.get("/")
def root():
    return {
        "message": "Project Life API - 赛亚人崛起篇",
        "version": "0.1.0",
        "docs": "/docs"
    }
