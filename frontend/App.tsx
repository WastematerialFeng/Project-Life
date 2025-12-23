import React, { useState, useEffect, useCallback, useRef } from 'react';
import Avatar from './components/Avatar';
import StatusHUD from './components/StatusHUD';
import QuestLog from './components/QuestLog';
import { FloatingTextManager, useFloatingText } from './components/FloatingText';
import { UserState, Quest, UserStatus, Difficulty, QuestType } from './types';
import { INITIAL_USER_STATE } from './constants';
import * as api from './services/api';

const App: React.FC = () => {
  // --- Global State ---
  const [user, setUser] = useState<UserState>(INITIAL_USER_STATE);
  const [userId, setUserId] = useState<number | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCriticalOverlay, setShowCriticalOverlay] = useState(false);
  const [senzuCount, setSenzuCount] = useState(3);
  const [initialized, setInitialized] = useState(false);
  
  // Floating text hook
  const { texts, addFloatingText } = useFloatingText();
  
  // Refs for floating text positions
  const avatarRef = useRef<HTMLDivElement>(null);

  // --- Initialize: Create or load user ---
  useEffect(() => {
    const initUser = async () => {
      try {
        // Try to get existing user or create new one
        const savedUserId = localStorage.getItem('projectlife_user_id');
        let userData: api.UserData;
        
        if (savedUserId) {
          try {
            userData = await api.getUser(parseInt(savedUserId));
            setUserId(parseInt(savedUserId));
          } catch {
            // User not found, create new
            userData = await api.createUser('孙悟空');
            localStorage.setItem('projectlife_user_id', userData.id.toString());
            setUserId(userData.id);
          }
        } else {
          userData = await api.createUser('孙悟空');
          localStorage.setItem('projectlife_user_id', userData.id.toString());
          setUserId(userData.id);
        }
        
        // Map backend data to frontend state
        setUser({
          name: userData.username,
          level: userData.level,
          currentExp: userData.current_exp,
          maxExp: userData.max_exp,
          hp: userData.hp,
          maxHp: userData.max_hp,
          sp: userData.sp,
          maxSp: userData.max_sp,
          gold: userData.gold,
          status: userData.status as UserStatus
        });
        
        // Init items
        await api.initItems();
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize:', error);
        setInitialized(true); // Continue with local state
      }
    };
    
    initUser();
  }, []);

  // --- Load quests when user is ready ---
  useEffect(() => {
    const loadQuests = async () => {
      if (!userId) return;
      try {
        const questsData = await api.getUserQuests(userId);
        const mappedQuests: Quest[] = questsData.map(q => ({
          id: q.id.toString(),
          title: q.title,
          desc: q.description,
          difficulty: mapDifficulty(q.difficulty),
          type: mapQuestType(q.quest_type),
          spCost: q.sp_cost,
          rewardGold: q.reward_gold,
          rewardExp: q.reward_exp,
          isCompleted: q.is_completed,
          isVisible: q.is_visible,
          step: q.step_order
        }));
        setQuests(mappedQuests);
      } catch (error) {
        console.error('Failed to load quests:', error);
      }
    };
    
    loadQuests();
  }, [userId]);

  // Helper functions to map backend enums to frontend
  const mapDifficulty = (diff: string): Difficulty => {
    const map: Record<string, Difficulty> = {
      'EASY': Difficulty.EASY,
      'NORMAL': Difficulty.MEDIUM,
      'HARD': Difficulty.HARD,
      'EPIC': Difficulty.EPIC
    };
    return map[diff] || Difficulty.MEDIUM;
  };

  const mapQuestType = (type: string): QuestType => {
    const map: Record<string, QuestType> = {
      'MAIN': QuestType.MAIN,
      'SIDE': QuestType.SIDE,
      'DAILY': QuestType.DAILY
    };
    return map[type] || QuestType.MAIN;
  };

  // --- Derived State Logic ---
  const updateStatus = useCallback((currentHp: number, currentSp: number) => {
    if (currentHp <= 0) {
      return UserStatus.EXHAUSTED; // HP 0 overrides SP state
    }
    if (currentSp >= 80) {
      return UserStatus.SSJ;
    }
    if (currentSp <= 20) {
      return UserStatus.EXHAUSTED;
    }
    return UserStatus.NORMAL;
  }, []);

  // --- Effect: Check Critical Condition ---
  useEffect(() => {
    const newStatus = updateStatus(user.hp, user.sp);
    if (user.status !== newStatus) {
      setUser(prev => ({ ...prev, status: newStatus }));
    }
    
    // Lockdown mode if HP is 0
    if (user.hp <= 0) {
        setShowCriticalOverlay(true);
    } else {
        setShowCriticalOverlay(false);
    }
  }, [user.hp, user.sp, user.status, updateStatus]);

  // --- Actions ---

  const showFloatingText = (text: string, color: string) => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      addFloatingText(text, color, rect.left + rect.width / 2, rect.top);
    }
  };

  const handleRest = async () => {
    if (!userId) return;
    
    try {
      const result = await api.userRest(userId);
      showFloatingText(`+${result.hp_restored} HP`, '#ef4444');
      if (result.sp_restored > 0) {
        setTimeout(() => showFloatingText(`+${result.sp_restored} SP`, '#3b82f6'), 200);
      }
      
      // Refresh user data
      const userData = await api.getUser(userId);
      setUser({
        name: userData.username,
        level: userData.level,
        currentExp: userData.current_exp,
        maxExp: userData.max_exp,
        hp: userData.hp,
        maxHp: userData.max_hp,
        sp: userData.sp,
        maxSp: userData.max_sp,
        gold: userData.gold,
        status: userData.status as UserStatus
      });
    } catch (error) {
      console.error('Rest failed:', error);
      // Fallback to local
      const hpGain = Math.min(50, user.maxHp - user.hp);
      const spGain = Math.min(30, user.maxSp - user.sp);
      setUser(prev => ({
        ...prev,
        hp: Math.min(prev.hp + 50, prev.maxHp),
        sp: Math.min(prev.sp + 30, prev.maxSp)
      }));
      if (hpGain > 0) showFloatingText(`+${hpGain} HP`, '#ef4444');
      if (spGain > 0) showFloatingText(`+${spGain} SP`, '#3b82f6');
    }
  };

  const handleMeditate = () => {
    const spGain = Math.min(10, user.maxSp - user.sp);
    if (spGain > 0) {
      setUser(p => ({...p, sp: Math.min(p.sp + 10, p.maxSp)}));
      showFloatingText(`+${spGain} SP`, '#3b82f6');
    }
  };

  const handleConsumeSenzu = () => {
    if (senzuCount <= 0) {
      alert("仙豆已用完！");
      return;
    }
    
    setSenzuCount(prev => prev - 1);
    setUser(prev => ({
        ...prev,
        hp: prev.maxHp,
        sp: prev.maxSp,
        status: UserStatus.SSJ
    }));
    showFloatingText('满状态!', '#ffd700');
  };

  const handleGenerateQuests = async (goalText: string) => {
      if (!userId) return;
      setLoading(true);
      try {
          // Use backend API to generate quests
          const generatedSteps = await api.generateQuests(goalText);
          
          // Create quests in backend
          for (let i = 0; i < generatedSteps.length; i++) {
            const step = generatedSteps[i];
            let baseGold = 10, baseExp = 10;
            if (step.difficulty === 'NORMAL') { baseGold = 30; baseExp = 30; }
            if (step.difficulty === 'HARD') { baseGold = 80; baseExp = 80; }
            if (step.difficulty === 'EPIC') { baseGold = 200; baseExp = 200; }
            
            await api.createQuest(userId, {
              title: step.title,
              description: step.desc,
              difficulty: step.difficulty,
              quest_type: step.type,
              reward_gold: baseGold,
              reward_exp: baseExp,
              sp_cost: step.sp_cost
            });
          }
          
          // Reload quests from backend
          const questsData = await api.getUserQuests(userId);
          const mappedQuests: Quest[] = questsData.map(q => ({
            id: q.id.toString(),
            title: q.title,
            desc: q.description,
            difficulty: mapDifficulty(q.difficulty),
            type: mapQuestType(q.quest_type),
            spCost: q.sp_cost,
            rewardGold: q.reward_gold,
            rewardExp: q.reward_exp,
            isCompleted: q.is_completed,
            isVisible: q.is_visible,
            step: q.step_order
          }));
          setQuests(mappedQuests);
      } catch (error) {
          console.error('Generate quests failed:', error);
      } finally {
          setLoading(false);
      }
  };

  const handleCompleteQuest = async (questId: string) => {
      if (user.hp <= 0) return;

      const quest = quests.find(q => q.id === questId);
      if (!quest) return;

      try {
        const result = await api.completeQuest(parseInt(questId));
        
        // Show floating text feedback
        showFloatingText(`+${result.gold_earned} Z`, '#fbbf24');
        setTimeout(() => showFloatingText(`+${result.exp_earned} EXP`, '#a855f7'), 200);
        
        if (result.level_up && result.new_level) {
          setTimeout(() => showFloatingText(`升级! Lv.${result.new_level}`, '#22c55e'), 400);
        }
        
        // Refresh user and quests from backend
        if (userId) {
          const userData = await api.getUser(userId);
          setUser({
            name: userData.username,
            level: userData.level,
            currentExp: userData.current_exp,
            maxExp: userData.max_exp,
            hp: userData.hp,
            maxHp: userData.max_hp,
            sp: userData.sp,
            maxSp: userData.max_sp,
            gold: userData.gold,
            status: userData.status as UserStatus
          });
          
          const questsData = await api.getUserQuests(userId);
          const mappedQuests: Quest[] = questsData.map(q => ({
            id: q.id.toString(),
            title: q.title,
            desc: q.description,
            difficulty: mapDifficulty(q.difficulty),
            type: mapQuestType(q.quest_type),
            spCost: q.sp_cost,
            rewardGold: q.reward_gold,
            rewardExp: q.reward_exp,
            isCompleted: q.is_completed,
            isVisible: q.is_visible,
            step: q.step_order
          }));
          setQuests(mappedQuests);
        }
      } catch (error: any) {
        alert(error.message || '完成任务失败');
      }
  };

  return (
    <div className="min-h-screen bg-[#212529] text-white p-4 pb-20 font-press-start relative overflow-hidden">
      
      {/* Floating Text Effects */}
      <FloatingTextManager texts={texts} />
      
      {/* Overlay for Critical State */}
      {showCriticalOverlay && (
          <div className="fixed inset-0 bg-red-900/80 z-50 flex flex-col items-center justify-center pointer-events-auto">
              <h1 className="text-4xl text-white mb-8 animate-pulse text-center">高危状态</h1>
              <p className="mb-8 text-center max-w-md">你的生命值已耗尽。无法进行脑力劳动。</p>
              <button onClick={handleRest} className="nes-btn is-success text-2xl">
                  去睡觉 (恢复体力)
              </button>
          </div>
      )}

      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header / Top Bar */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div ref={avatarRef}>
              <Avatar user={user} />
            </div>
            <StatusHUD user={user} />
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col md:flex-row gap-6">
            
            {/* Left Column: Actions & Shop */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
                 {/* 日常行动 */}
                 <div className="nes-container with-title is-dark">
                    <p className="title">日常行动</p>
                    <div className="flex flex-col gap-2">
                        <button 
                            className="nes-btn is-primary" 
                            onClick={handleRest}
                            disabled={user.hp >= user.maxHp && user.sp >= user.maxSp}
                        >
                            😴 休息 (+HP/SP)
                        </button>
                        <button 
                            className="nes-btn" 
                            onClick={handleMeditate}
                            disabled={user.sp >= user.maxSp}
                        >
                            🧘 冥想 (+10 SP)
                        </button>
                    </div>
                 </div>
                 
                 {/* 道具背包 */}
                 <div className="nes-container with-title is-dark">
                    <p className="title">道具背包</p>
                    <div className="flex flex-col gap-2">
                        <button 
                            className={`nes-btn ${senzuCount > 0 ? 'is-warning' : 'is-disabled'}`}
                            onClick={handleConsumeSenzu}
                            disabled={senzuCount <= 0}
                            style={{ backgroundColor: senzuCount > 0 ? '#ec4899' : undefined }}
                        >
                            🫘 仙豆 (剩余: {senzuCount})
                        </button>
                        <p className="text-[10px] text-gray-500 text-center">瞬间回满HP和SP</p>
                    </div>
                 </div>
                 
                 {/* 商店 - 锁定预览 */}
                 <div className="nes-container with-title is-dark">
                     <p className="title">商店 (Shop)</p>
                     {user.level < 5 ? (
                       <div className="text-center py-4">
                         <div className="flex justify-center gap-4 mb-4">
                           <div className="mystery-item w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl">❓</div>
                           <div className="mystery-item w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl" style={{animationDelay: '0.5s'}}>❓</div>
                           <div className="mystery-item w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-2xl" style={{animationDelay: '1s'}}>❓</div>
                         </div>
                         <p className="text-[10px] text-gray-500">传说中的宝物正在沉睡...</p>
                         <p className="text-[10px] text-yellow-600 mt-1">🔒 5级解锁</p>
                       </div>
                     ) : (
                       <div className="text-center text-green-400 text-xs">
                         商店已解锁！
                       </div>
                     )}
                 </div>
            </div>

            {/* Right Column: Quests */}
            <div className="flex flex-col gap-4 w-full md:w-2/3">
                <QuestLog 
                    quests={quests} 
                    onComplete={handleCompleteQuest} 
                    isDisabled={showCriticalOverlay}
                    onGenerateQuests={handleGenerateQuests}
                    isLoading={loading}
                />
            </div>

        </main>
      </div>
    </div>
  );
};

export default App;