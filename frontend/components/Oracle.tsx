import React, { useState } from 'react';

interface OracleProps {
    onGenerate: (goal: string) => Promise<void>;
    isLoading: boolean;
    isDisabled: boolean;
}

const Oracle: React.FC<OracleProps> = ({ onGenerate, isLoading, isDisabled }) => {
    const [goal, setGoal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (goal.trim()) {
            onGenerate(goal);
            setGoal('');
        }
    };

    return (
        <div className="nes-container with-title is-dark w-full mt-6">
            <p className="title">大界王神 (Oracle)</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label htmlFor="goal_input" className="text-sm">你的下一个修行目标是什么？</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        id="goal_input" 
                        className="nes-input is-dark" 
                        placeholder="例如：一周内学会 React"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        disabled={isLoading || isDisabled}
                    />
                    <button 
                        type="submit" 
                        className={`nes-btn ${isLoading ? 'is-disabled' : 'is-warning'}`}
                        disabled={isLoading || isDisabled}
                    >
                        {isLoading ? '...' : '请教'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Oracle;