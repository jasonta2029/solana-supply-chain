import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    featured?: boolean;
    hover?: boolean;
}

export const Card = ({ children, className = "", featured = false, hover = true }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
            className={`
                relative bg-white border border-border rounded-2xl overflow-hidden transition-all duration-300
                ${featured ? 'ring-2 ring-accent/10 border-accent/20' : ''}
                ${className}
            `}
        >
            {featured && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-secondary" />
            )}
            {children}
        </motion.div>
    );
};
