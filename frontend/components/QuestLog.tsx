import React from 'react';
import { Quest, Difficulty } from '../types';

interface QuestLogProps {
    quests: Quest[];
    onComplete: (id: string) => void;
    isDisabled: boolean; // True if HP <= 0
    onGenerateQuests?: (goal: string) => Promise<void>;
    isLoading?: boolean;
}

const QuestLog: React.FC<QuestLogProps> = ({ quests, onComplete, isDisabled, onGenerateQuests, isLoading }) => {
    const [goal, setGoal] = React.useState('');
    
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (goal.trim() && onGenerateQuests) {
            onGenerateQuests(goal);
            setGoal('');
        }
    };

    return (
        <div className="nes-container with-title is-dark w-full h-full min-h-[400px]">
            <p className="title">任务卷轴</p>
            
            {/* 空状态 - 显示引导和Oracle输入 */}
            {visibleQuests.length === 0 && (
                <div className="flex flex-col items-center justify-center h-80 text-center">
                    <div className="text-6xl mb-6 opacity-50">📜</div>
                    <p className="text-gray-400 mb-2 text-sm">修行的旅途尚未开始...</p>
                    <p className="text-yellow-500 mb-6 text-xs">告诉大界王，你本周的目标是什么？</p>
                    
                    <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
                        <input 
                            type="text" 
                            className="nes-input is-dark mb-4" 
                            placeholder="例如：一周内学会 React"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            disabled={isLoading || isDisabled}
                        />
                        <button 
                            type="submit" 
                            className={`nes-btn ${isLoading ? 'is-disabled' : 'is-warning'} w-full`}
                            disabled={isLoading || isDisabled || !goal.trim()}
                        >
                            {isLoading ? '大界王思考中...' : '🔮 请教大界王'}
                        </button>
                    </form>
                </div>
            )}

            {/* 有任务时显示任务列表 */}
            {visibleQuests.length > 0 && (
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
                                    <span>⚡ -{quest.spCost}</span>
                                    <span className="text-yellow-600">💰 +{quest.rewardGold} Z</span>
                                    <span className="text-purple-400">✨ +{quest.rewardExp} EXP</span>
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
            )}
        </div>
    );
};

export default QuestLog;