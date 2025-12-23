import React from 'react';
import { Quest, Difficulty } from '../types';

interface QuestLogProps {
    quests: Quest[];
    onComplete: (id: string) => void;
    isDisabled: boolean; // True if HP <= 0
}

const QuestLog: React.FC<QuestLogProps> = ({ quests, onComplete, isDisabled }) => {
    
    // Sort: Visible Active -> Visible Completed -> Hidden
    // Filter: Only show visible quests
    const visibleQuests = quests.filter(q => q.isVisible);

    const getDifficultyColor = (diff: Difficulty) => {
        // Enums are now Chinese strings
        switch (diff) {
            case Difficulty.EASY: return "is-success";
            case Difficulty.MEDIUM: return "is-primary";
            case Difficulty.HARD: return "is-warning";
            case Difficulty.EPIC: return "is-error";
            default: return "";
        }
    };

    return (
        <div className="nes-container with-title is-dark w-full h-full min-h-[400px]">
            <p className="title">任务卷轴</p>
            
            {visibleQuests.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    <p>暂无任务。</p>
                    <p className="text-xs mt-2">请咨询大界王（Oracle）开启修行。</p>
                </div>
            )}

            <ul className="flex flex-col gap-4">
                {visibleQuests.map((quest) => (
                    <li 
                        key={quest.id} 
                        className={`nes-container is-rounded p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${quest.isCompleted ? 'opacity-50 grayscale' : ''}`}
                        style={{ borderColor: quest.isCompleted ? '#555' : undefined }}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`nes-badge is-icon`}>
                                    <span className={`is-small ${getDifficultyColor(quest.difficulty)}`}></span>
                                    <span className="is-dark text-[8px]">{quest.type}</span>
                                </span>
                                <h3 className={`text-sm ${quest.isCompleted ? 'line-through' : ''}`}>
                                    {quest.title}
                                </h3>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">{quest.desc}</p>
                            <div className="flex gap-4 text-[10px] text-gray-500">
                                <span>消耗元气: -{quest.spCost}</span>
                                <span className="text-yellow-600">奖励: +{quest.rewardGold} Z</span>
                            </div>
                        </div>

                        {!quest.isCompleted && (
                            <button 
                                type="button" 
                                className={`nes-btn ${isDisabled ? 'is-disabled' : 'is-primary'}`}
                                onClick={() => !isDisabled && onComplete(quest.id)}
                                disabled={isDisabled}
                            >
                                {isDisabled ? "去睡觉！" : "完成"}
                            </button>
                        )}
                        
                        {quest.isCompleted && (
                            <div className="nes-text is-success text-xs border-2 border-green-500 p-1 transform -rotate-12">
                                已完成
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuestLog;