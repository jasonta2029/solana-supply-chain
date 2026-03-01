import { motion } from 'framer-motion';

interface SectionLabelProps {
    label: string;
    pulse?: boolean;
}

export const SectionLabel = ({ label, pulse = true }: SectionLabelProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 mb-6"
        >
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
            )}
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                {label}
            </span>
        </motion.div>
    );
};
