import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    duration?: number;
    threshold?: number;
}

const RevealOnScroll: React.FC<RevealProps> = ({
    children,
    className = "",
    direction = 'up',
    delay = 0,
    duration = 800,
    threshold = 0.1
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: threshold,
                rootMargin: "0px 0px -50px 0px" // Trigger slightly before element is fully in view
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold]);

    const getTransform = () => {
        if (isVisible) return 'translate(0, 0)';
        switch (direction) {
            case 'up': return 'translateY(50px)';
            case 'down': return 'translateY(-50px)';
            case 'left': return 'translateX(50px)';
            case 'right': return 'translateX(-50px)';
            default: return 'translateY(50px)';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: `all ${duration}ms cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

export default RevealOnScroll;
