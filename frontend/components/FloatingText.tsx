import React, { useState, useEffect } from 'react';

interface FloatingText {
    id: string;
    text: string;
    color: string;
    x: number;
    y: number;
}

interface FloatingTextManagerProps {
    texts: FloatingText[];
}

export const FloatingTextManager: React.FC<FloatingTextManagerProps> = ({ texts }) => {
    return (
        <>
            {texts.map((ft) => (
                <div
                    key={ft.id}
                    className="floating-text fixed z-50 text-lg"
                    style={{
                        left: ft.x,
                        top: ft.y,
                        color: ft.color,
                    }}
                >
                    {ft.text}
                </div>
            ))}
        </>
    );
};

// Hook to manage floating texts
export const useFloatingText = () => {
    const [texts, setTexts] = useState<FloatingText[]>([]);

    const addFloatingText = (text: string, color: string, x: number, y: number) => {
        const id = Date.now().toString() + Math.random();
        setTexts(prev => [...prev, { id, text, color, x, y }]);
        
        // Remove after animation
        setTimeout(() => {
            setTexts(prev => prev.filter(t => t.id !== id));
        }, 1000);
    };

    return { texts, addFloatingText };
};

export default FloatingTextManager;
