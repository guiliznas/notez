import React, { useState, useRef } from 'react';

interface SwipeableItemProps {
    children: React.ReactNode;
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    leftContent?: React.ReactNode; // Revealed on Right Swipe
    rightContent?: React.ReactNode; // Revealed on Left Swipe
    leftColor?: string; // Class for left background
    rightColor?: string; // Class for right background
    className?: string; // wrapper class
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({
    children,
    onSwipeLeft,
    onSwipeRight,
    leftContent,
    rightContent,
    leftColor = "bg-blue-500",
    rightColor = "bg-red-500",
    className = "mb-3"
}) => {
    const [offsetX, setOffsetX] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);
    const startY = useRef(0);
    
    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX.current;
        const diffY = currentY - startY.current;

        // Lock scroll if dragging horizontally more than vertically
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Add a threshold to prevent micro-movements from being treated as swipes
            // This ensures clicks on buttons inside the item still work
            if (Math.abs(diffX) > 10) {
                setOffsetX(diffX);
            }
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        if (offsetX > 100 && onSwipeRight) {
            onSwipeRight();
        } else if (offsetX < -100 && onSwipeLeft) {
            onSwipeLeft();
        }
        setOffsetX(0);
    };

    const style = {
        transform: `translateX(${offsetX}px)`,
        transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
    };
    
    // Background Logic
    let bgClass = '';
    let content = null;

    if (offsetX > 0) {
        bgClass = leftColor;
        content = leftContent;
    } else if (offsetX < 0) {
        bgClass = rightColor;
        content = rightContent;
    }

    return (
        <div className={`relative overflow-hidden rounded-xl select-none ${className}`} style={{ touchAction: 'pan-y' }}>
            {/* Background Actions */}
            <div className={`absolute inset-0 flex items-center px-4 ${bgClass}`}>
                 {content}
            </div>
            
            {/* Content */}
            <div 
                className="relative z-10 bg-white"
                style={style}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {children}
            </div>
        </div>
    )
};

export default SwipeableItem;