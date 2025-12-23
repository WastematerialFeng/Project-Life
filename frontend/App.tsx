import React, { useState, useEffect, useCallback } from 'react';
import Avatar from './components/Avatar';
import StatusHUD from './components/StatusHUD';
import QuestLog from './components/QuestLog';
import Oracle from './components/Oracle';
import { UserState, Quest, UserStatus, Difficulty, QuestType } from './types';
import { INITIAL_USER_STATE, MAX_HP, MAX_SP } from './constants';
import { generateQuestsFromGoal } from './services/geminiService';

const App: React.FC = () => {
  // --- Global State ---
  const [user, setUser] = useState<UserState>(INITIAL_USER_STATE);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCriticalOverlay, setShowCriticalOverlay] = useState(false);

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

  const handleRest = () => {
    // Simulating sleep/recovery
    setUser(prev => ({
        ...prev,
        hp: Math.min(prev.hp + 50, prev.maxHp),
        sp: Math.min(prev.sp + 30, prev.maxSp)
    }));
  };

  const handleConsumeSenzu = () => {
      // Cost? Maybe free for prototype
      setUser(prev => ({
          ...prev,
          hp: prev.maxHp,
          sp: prev.maxSp,
          status: UserStatus.SSJ // Boost
      }));
  };

  const handleGenerateQuests = async (goalText: string) => {
      setLoading(true);
      try {
          const generatedSteps = await generateQuestsFromGoal(goalText);
          
          const newQuests: Quest[] = generatedSteps.map((step, index) => {
              // Simple heuristic to calculate rewards based on difficulty
              let baseGold = 10;
              let baseExp = 10;
              if (step.difficulty === '普通') { baseGold = 30; baseExp = 30; }
              if (step.difficulty === '困难') { baseGold = 80; baseExp = 80; }
              if (step.difficulty === '史诗') { baseGold = 200; baseExp = 200; }
              
              // Map incoming difficulty string to enum if needed, or assume prompt returns exact matches
              // Since we updated prompt to output "简单" etc., it should match.
              
              return {
                  id: Date.now().toString() + index,
                  title: step.title,
                  desc: step.desc,
                  difficulty: step.difficulty as Difficulty,
                  type: QuestType.MAIN,
                  spCost: step.sp_cost,
                  rewardGold: baseGold,
                  rewardExp: baseExp,
                  isCompleted: false,
                  isVisible: index === 0, // Fog of War: Only first is visible
                  step: step.step
              };
          });

          setQuests(prev => [...prev, ...newQuests]);
      } finally {
          setLoading(false);
      }
  };

  const handleCompleteQuest = (questId: string) => {
      if (user.hp <= 0) return; // Prevent action if dead

      const questIndex = quests.findIndex(q => q.id === questId);
      if (questIndex === -1) return;
      const quest = quests[questIndex];

      if (user.sp < quest.spCost) {
          alert("元气不足，无法完成此修行！请冥想或休息。");
          return;
      }

      // Update User
      setUser(prev => {
          const newSp = prev.sp - quest.spCost;
          const newExp = prev.currentExp + quest.rewardExp;
          const newGold = prev.gold + quest.rewardGold;
          
          // Level Up Logic (Simple)
          let newLevel = prev.level;
          let newMaxExp = prev.maxExp;
          let tempExp = newExp;
          
          if (tempExp >= prev.maxExp) {
              newLevel += 1;
              tempExp = tempExp - prev.maxExp;
              newMaxExp = Math.floor(prev.maxExp * 1.2);
              // Heal on level up
          }

          return {
              ...prev,
              sp: Math.max(0, newSp),
              currentExp: tempExp,
              maxExp: newMaxExp,
              gold: newGold,
              level: newLevel
          };
      });

      // Update Quests (Mark complete + Reveal next)
      setQuests(prev => {
          const updated = [...prev];
          updated[questIndex] = { ...updated[questIndex], isCompleted: true };
          
          // Reveal next step if it exists in the same chain (based on order in array for now)
          // In a robust system we'd use parentQuestId, here we assume linear generation added to end
          // Simple logic: If there is a quest with step === current.step + 1 that is currently hidden
          const nextStepIndex = updated.findIndex(q => q.step === (quest.step || 0) + 1 && !q.isVisible && !q.isCompleted);
          if (nextStepIndex !== -1) {
              updated[nextStepIndex] = { ...updated[nextStepIndex], isVisible: true };
          }

          return updated;
      });
  };

  return (
    <div className="min-h-screen bg-[#212529] text-white p-4 pb-20 font-press-start relative overflow-hidden">
      
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
            <Avatar user={user} />
            <StatusHUD user={user} />
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col md:flex-row gap-6">
            
            {/* Left Column: Actions & Shop (Simplified) */}
            <div className="flex flex-col gap-4 w-full md:w-1/3">
                 <div className="nes-container with-title is-dark">
                    <p className="title">行动 (Actions)</p>
                    <div className="flex flex-col gap-2">
                        <button 
                            className="nes-btn is-primary" 
                            onClick={handleRest}
                            disabled={user.hp >= user.maxHp && user.sp >= user.maxSp}
                        >
                            休息 / 睡觉 (+HP)
                        </button>
                        <button 
                            className="nes-btn" 
                            onClick={() => setUser(p => ({...p, sp: Math.min(p.sp + 10, p.maxSp)}))}
                        >
                            冥想 (+10 SP)
                        </button>
                        <button 
                            className="nes-btn is-warning" 
                            onClick={handleConsumeSenzu}
                        >
                            吃仙豆 (状态回满)
                        </button>
                    </div>
                 </div>
                 
                 <div className="nes-container with-title is-dark">
                     <p className="title">商店 (Shop)</p>
                     <div className="text-xs text-center text-gray-500">
                         5级解锁
                     </div>
                 </div>
            </div>

            {/* Right Column: Quests & Oracle */}
            <div className="flex flex-col gap-4 w-full md:w-2/3">
                <QuestLog 
                    quests={quests} 
                    onComplete={handleCompleteQuest} 
                    isDisabled={showCriticalOverlay}
                />
                
                <Oracle 
                    onGenerate={handleGenerateQuests} 
                    isLoading={loading}
                    isDisabled={showCriticalOverlay}
                />
            </div>

        </main>
      </div>
    </div>
  );
};

export default App;