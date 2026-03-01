import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    type?: 'button' | 'submit';
    disabled?: boolean;
}

export const Button = ({
    children,
    onClick,
    className = "",
    variant = 'primary',
    type = 'button',
    disabled = false
}: ButtonProps) => {

    const variants = {
        primary: "bg-gradient-to-r from-accent to-accent-secondary text-white shadow-accent-sm hover:shadow-accent-md",
        secondary: "bg-foreground text-background hover:bg-foreground/90",
        outline: "bg-transparent border border-border text-foreground hover:bg-muted",
        ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
    };

    return (
        <motion.button
            whileHover={!disabled ? { y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-3 rounded-xl font-semibold transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${className}
            `}
        >
            {children}
        </motion.button>
    );
};
