import { Search, FileText, Code, Globe, ShieldAlert, BrainCircuit, Sliders, Volume2, Shield } from 'lucide-react';
import { Card, Button } from './UI';
import { useState } from 'react';

export function AIFeatureCard({ title, description, icon: Icon, onClick }: { title: string, description: string, icon: any, onClick: () => void }) {
  return (
    <Card className="hover:border-cyan-500/30 transition-all cursor-pointer group" onClick={onClick}>
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-[#00d2ff]" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </Card>
  );
}

export function AIInsights() {
  const insights = [
    { title: 'Security Alert', desc: '3 sites in your history have known vulnerabilities. Enable Hardened Sandbox?', type: 'risk', icon: ShieldAlert },
    { title: 'Productivity Boost', desc: 'You spent 2h on documentation. Summarize key takeaways now?', type: 'opportunity', icon: BrainCircuit },
    { title: 'Contextual Search', desc: 'Based on your recent AWS tabs, here are 3 related whitepapers.', type: 'prediction', icon: Search },
  ];

  return (
    <Card title="AI Intelligence Hub">
      <div className="space-y-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
              <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                insight.type === 'risk' ? 'bg-red-500/10 text-red-500' : 
                insight.type === 'opportunity' ? 'bg-cyan-500/10 text-cyan-500' : 'bg-purple-500/10 text-purple-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">{insight.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{insight.desc}</p>
                <div className="mt-3 flex justify-end">
                  <Button 
                    className="text-[10px] py-1 px-3 bg-white/5 border-white/10 hover:bg-white/10 h-auto"
                    onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(insight.title + ' ' + insight.desc)}`, '_blank')}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function AIConfiguration() {
  const [mode, setMode] = useState('concise');
  const [summarizationDepth, setSummarizationDepth] = useState(3);
  const [telemetry, setTelemetry] = useState(false);

  return (
    <Card title="Assistant Settings">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-cyan-500" /> Assistant Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Concise', 'Detailed', 'Creative', 'Privacy-First'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m.toLowerCase())}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  mode === m.toLowerCase() ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-500" /> Summarization Depth
            </label>
            <span className="text-xs text-white bg-white/10 px-2 py-0.5 rounded italic">Level {summarizationDepth}</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="5" 
            value={summarizationDepth} 
            onChange={(e) => setSummarizationDepth(parseInt(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00d2ff]" 
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-white">Auto-Block Threats</p>
                <p className="text-[10px] text-gray-500">ML-driven threat prevention</p>
              </div>
            </div>
            <input type="checkbox" defaultChecked className="w-10 h-5 rounded-full bg-white/10 appearance-none checked:bg-green-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-5" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-white">Voice Selection</p>
                <p className="text-[10px] text-gray-500">Preferred AI synthesis voice</p>
              </div>
            </div>
            <select className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none">
              <option>Female 1</option>
              <option>Male 1</option>
              <option>Neutral 1</option>
            </select>
          </div>
        </div>
      </div>
    </Card>
  );
}
