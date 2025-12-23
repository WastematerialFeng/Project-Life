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
                <span className="w-14 text-xs text-red-500 flex items-center gap-1">
                    <i className="nes-icon is-small heart"></i>
                    生命
                </span>
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
                <span className="w-14 text-xs text-blue-400 flex items-center gap-1">
                    <span className="text-yellow-400">⚡</span>
                    元气
                </span>
                <div className="w-full">
                    <progress 
                        className="nes-progress is-primary h-6" 
                        value={user.sp} 
                        max={user.maxSp}
                    />
                </div>
                <span className="text-xs w-16 text-right">{user.sp}/{user.maxSp}</span>
            </div>

            {/* EXP Bar */}
            <div className="flex items-center gap-2">
                <span className="w-14 text-xs text-yellow-500 flex items-center gap-1">
                    <i className="nes-icon is-small star"></i>
                    经验
                </span>
                <div className="w-full">
                    <progress 
                        className="nes-progress is-warning h-8" 
                        value={user.currentExp} 
                        max={user.maxExp}
                        style={{ filter: 'hue-rotate(-10deg) saturate(1.5)' }}
                    />
                </div>
                <span className="text-xs w-20 text-right text-yellow-400">{user.currentExp}/{user.maxExp}</span>
            </div>

            {/* Gold */}
            <div className="flex justify-center mt-2 pt-2 border-t border-gray-700">
                <div className="flex items-center gap-2">
                    <i className="nes-icon coin is-small"></i>
                    <span className="text-yellow-500 text-lg">{user.gold} Z</span>
                </div>
            </div>
        </div>
    );
};

export default StatusHUD;