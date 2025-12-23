import React from 'react';
import { UserState } from '../types';

interface StatusHUDProps {
    user: UserState;
}

const StatusHUD: React.FC<StatusHUDProps> = ({ user }) => {
    return (
        <div className="flex flex-col w-full max-w-md gap-4 p-4 nes-container is-dark with-title">
            <p className="title">状态 (Status)</p>
            
            {/* HP Bar */}
            <div className="flex items-center gap-2">
                <span className="w-12 text-xs text-red-500">生命</span>
                <div className="w-full">
                    <progress 
                        className="nes-progress is-error h-6" 
                        value={user.hp} 
                        max={user.maxHp}
                    />
                </div>
                <span className="text-xs w-16 text-right">{user.hp}/{user.maxHp}</span>
            </div>

            {/* SP Bar */}
            <div className="flex items-center gap-2">
                <span className="w-12 text-xs text-blue-400">元气</span>
                <div className="w-full">
                    <progress 
                        className="nes-progress is-primary h-6" 
                        value={user.sp} 
                        max={user.maxSp}
                    />
                </div>
                <span className="text-xs w-16 text-right">{user.sp}/{user.maxSp}</span>
            </div>

            {/* Gold & EXP */}
            <div className="flex justify-between mt-2 pt-2 border-t border-gray-700">
                <div className="flex items-center gap-2">
                    <i className="nes-icon coin is-small"></i>
                    <span className="text-yellow-500">{user.gold} Z</span>
                </div>
                <div className="text-xs text-green-400">
                    经验: {user.currentExp} / {user.maxExp}
                </div>
            </div>
        </div>
    );
};

export default StatusHUD;