import React from 'react';
import { UserState, UserStatus } from '../types';
import { AVATAR_IMAGES } from '../constants';

interface AvatarProps {
    user: UserState;
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
    let avatarClass = "w-32 h-32 md:w-48 md:h-48 rounded-md border-4 border-black transition-all duration-500 object-cover";
    let imageSrc = AVATAR_IMAGES.NORMAL;
    let auraText = "";

    switch (user.status) {
        case UserStatus.SSJ:
            avatarClass += " ssj-glow";
            imageSrc = AVATAR_IMAGES.SSJ;
            auraText = "超级赛亚人";
            break;
        case UserStatus.EXHAUSTED:
            avatarClass += " exhausted-shake";
            imageSrc = AVATAR_IMAGES.EXHAUSTED;
            auraText = "高危状态";
            break;
        default:
            imageSrc = AVATAR_IMAGES.NORMAL;
            break;
    }

    return (
        <div className="flex flex-col items-center">
            <div className="relative">
                <img 
                    src={imageSrc} 
                    alt="Character Avatar" 
                    className={avatarClass}
                />
                {user.status === UserStatus.SSJ && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                         <span className="text-yellow-400 text-xs tracking-widest bg-black px-1">超级赛亚人模式</span>
                    </div>
                )}
            </div>
            <div className="mt-4 text-center">
                <h2 className="text-xl mb-1">{user.name}</h2>
                <div className="text-xs text-gray-400">LVL {user.level}</div>
            </div>
        </div>
    );
};

export default Avatar;