import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, BrainCircuit, Wallet, ChevronRight } from 'lucide-react';

interface FloatingWidgetProps {
  key?: string;
  title: string;
  icon: React.ElementType;
  value: string;
  color: string;
  index: number;
}

function Widget({ title, icon: Icon, value, color, index }: FloatingWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="bg-panel/40 backdrop-blur-md border border-white/5 p-3 rounded-2xl flex items-center space-x-3 w-48 shadow-2xl hover:bg-panel/60 transition-colors group cursor-pointer"
    >
      <div className={`p-2 rounded-xl transition-transform group-hover:scale-110`} style={{ backgroundColor: `${color}10`, color }}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-text-secondary font-bold truncate">{title}</p>
        <p className="text-sm font-mono text-text-primary truncate">{value}</p>
      </div>
      <ChevronRight className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

export function FloatingWidgets() {
  const widgets = [
    { title: 'Security', icon: Shield, value: 'Optimal', color: '#00D9FF' },
    { title: 'Neural Net', icon: BrainCircuit, value: '98.2%', color: '#7B2CFF' },
    { title: 'Node Fuel', icon: Wallet, value: '0.042 BTC', color: '#FF0055' },
  ];

  return (
    <div className="fixed right-6 bottom-16 flex flex-col space-y-3 z-40">
      <AnimatePresence>
        {widgets.map((w, i) => (
          <Widget 
            key={w.title} 
            title={w.title} 
            icon={w.icon} 
            value={w.value} 
            color={w.color} 
            index={i} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
