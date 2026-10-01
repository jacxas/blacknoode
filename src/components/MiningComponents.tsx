import { Cpu, Zap, Battery, AlertTriangle, Info } from 'lucide-react';
import { Card, Button, Modal } from './UI';
import { useState } from 'react';

export function MiningControl() {
  const [enabled, setEnabled] = useState(false);
  const [cpuCap, setCpuCap] = useState(30);
  const [showConsent, setShowConsent] = useState(false);

  const handleToggle = () => {
    if (!enabled) {
      setShowConsent(true);
    } else {
      setEnabled(false);
    }
  };

  const confirmConsent = () => {
    setEnabled(true);
    setShowConsent(false);
  };

  return (
    <div className="space-y-6">
      <Card title="Mining Dashboard">
        <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5 mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${enabled ? 'gradient-accent shadow-lg shadow-purple-accent/20 glow' : 'bg-white/5 text-gray-500'}`}>
              <Cpu className={`w-6 h-6 ${enabled ? 'animate-pulse text-white' : ''}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Browser Mining</p>
              <p className="text-xs text-gray-500">{enabled ? 'Active • Optimizing for performance' : 'Inactive • Enable to support network'}</p>
            </div>
          </div>
          <button 
            onClick={handleToggle}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${enabled ? 'bg-cyan-accent' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-7' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Hash Rate</p>
            <p className="text-xl font-bold font-mono text-white">{enabled ? '1,540 H/s' : '0 H/s'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Total Earned</p>
            <p className="text-xl font-bold font-mono text-cyan-accent">{enabled ? '0.00142 XMR' : '0.00000 XMR'}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs text-gray-500 mb-1">Session Profit</p>
            <p className="text-xl font-bold font-mono text-green-400">{enabled ? '≈ $0.24' : '$0.00'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" /> CPU Usage Limit
              </label>
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${cpuCap > 50 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {cpuCap}% {cpuCap <= 30 && '(Recommended)'}
              </span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="5"
              value={cpuCap} 
              onChange={(e) => setCpuCap(parseInt(e.target.value))}
              disabled={!enabled}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-accent disabled:opacity-30" 
            />
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
            <p className="text-xs text-yellow-500/80 leading-relaxed">
              Mining at high CPU capacity may cause browser lag and increase energy consumption. We recommend staying below 30% for normal browsing sessions.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Mining Statistics">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-2"><Battery className="w-4 h-4" /> Battery Saver Mode</span>
                <input type="checkbox" defaultChecked className="w-8 h-4 rounded-full bg-white/10 appearance-none checked:bg-cyan-accent transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4" />
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 flex items-center gap-2"><Info className="w-4 h-4" /> Auto-stop on Idle</span>
                <input type="checkbox" defaultChecked className="w-8 h-4 rounded-full bg-white/10 appearance-none checked:bg-cyan-accent transition-all cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-pink-accent/10 via-purple-accent/10 to-cyan-accent/10 border-white/10 text-white">
          <h3 className="text-lg font-bold mb-2">Mining Policy</h3>
          <p className="text-xs text-gray-400 leading-relaxed mb-4">
            Transparent and ethical. 100% of mining revenue is shared with you. Our browser uses a high-performance WebAssembly miner that strictly respects your CPU limits.
          </p>
          <Button variant="outline" className="w-full text-xs">Read Whitepaper</Button>
        </Card>
      </div>

      <Modal isOpen={showConsent} onClose={() => setShowConsent(false)} title="Legal Consent & Mining Disclosure">
        <div className="space-y-4">
          <p className="text-sm">
            By enabling browser mining, you agree to allow Navegador X to use your device's computational resources (CPU/GPU) to solve cryptographic puzzles.
          </p>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent mt-1.5 shrink-0" />
              <p className="text-xs">Mining increases energy consumption and may shorten battery life.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent mt-1.5 shrink-0" />
              <p className="text-xs">Your device might get warmer during active mining sessions.</p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-accent mt-1.5 shrink-0" />
              <p className="text-xs">You can disable mining or change CPU limits at any time.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Mining is 100% voluntary. We never hide background processes or engage in unauthorized cryptojacking.
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <Button onClick={confirmConsent} className="w-full py-4 text-lg">Accept & Activate Mining</Button>
            <Button variant="secondary" onClick={() => setShowConsent(false)} className="w-full">Decline</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
