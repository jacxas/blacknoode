import { LayoutDashboard, Shield, Cpu, Sparkles, LogOut, Network, Terminal, Settings, GitBranch } from 'lucide-react';
import { motion } from 'motion/react';
import { auth, logout } from '../lib/firebase';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const isAdmin = auth.currentUser?.email === 'jacxas@gmail.com';

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'vpn', icon: Shield, label: 'VPN Connect' },
    { id: 'ai', icon: Sparkles, label: 'AI Assistant' },
    { id: 'miner', icon: Cpu, label: 'Mining' },
    { id: 'github', icon: GitBranch, label: 'GitHub Sync' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', icon: Terminal, label: 'System Core' });
  }

  return (
    <aside className="w-20 md:w-24 h-full flex flex-col items-center py-8 border-r border-white/5 space-y-8 bg-[#050505] z-40 transition-all duration-300">
      <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
        <Network className="w-6 h-6 text-white" />
      </div>

      <nav className="flex flex-col space-y-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`p-3 rounded-xl transition-all duration-200 group relative ${
                isActive ? 'bg-white/10 text-purple-accent' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}
            >
              <Icon className="w-6 h-6 shrink-0" />
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-accent rounded-r-full shadow-[0_0_8px_#7B2CFF]"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center space-y-6">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-slate-700 hover:border-purple-accent/50 transition-colors cursor-pointer">
          {auth.currentUser?.photoURL ? (
            <img src={auth.currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-800" />
          )}
        </div>
        <button 
          onClick={logout}
          className="p-3 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
}
