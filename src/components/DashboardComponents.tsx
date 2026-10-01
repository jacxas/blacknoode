import { Activity, Cpu, Database, Layout, ShieldCheck, Zap, ExternalLink, Search, Globe, Sparkles, Download, Monitor, Smartphone, CheckCircle2 } from 'lucide-react';
import { Card, Button } from './UI';
import { motion } from 'motion/react';
import { useState, FormEvent } from 'react';

export function QuickStats() {
  const stats = [
    { label: 'Compute Power', value: '1,250', unit: 'H/s', icon: Cpu, color: 'text-pink-accent', bg: 'bg-pink-accent/10', trend: '↑ 4.2%' },
    { label: 'Node Load', value: '42', unit: '%', icon: Database, color: 'text-cyan-accent', bg: 'bg-cyan-accent/10', trend: 'Stable' },
    { label: 'Neural Buffer', value: '142', unit: 'Tasks', icon: Layout, color: 'text-purple-accent', bg: 'bg-purple-accent/10', trend: '8.5 MB cached' },
    { label: 'Active Streams', value: '14', unit: 'Nodes', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10', trend: 'Secure' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-purple-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-accent/5 group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] uppercase tracking-widest text-text-secondary font-bold font-mono">{stat.label}</span>
                <div className={`p-1.5 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-primary tracking-tight">
                {stat.value} <span className="text-xs font-normal text-text-secondary font-mono">{stat.unit}</span>
              </div>
              <div className={`mt-2 text-[10px] font-mono font-medium flex items-center space-x-1 ${stat.trend.includes('↑') ? 'text-emerald-400' : 'text-text-secondary'}`}>
                {stat.trend.includes('↑') && <Zap className="w-2.5 h-2.5" />}
                <span>{stat.trend}</span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

export function SearchEngineWidget() {
  const [query, setQuery] = useState('');
  const [engine, setEngine] = useState('google');

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const url = engine === 'duckduckgo' 
      ? `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
      : engine === 'brave'
        ? `https://search.brave.com/search?q=${encodeURIComponent(query)}`
        : `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="relative overflow-hidden border-cyan-500/30">
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-accent/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center space-x-2">
          <Globe className="w-4 h-4 text-cyan-accent" />
          <span>Autonomous Search Engine</span>
        </h3>
        <div className="flex gap-1">
          {['google', 'duckduckgo', 'brave'].map(eng => (
            <button
              key={eng}
              onClick={() => setEngine(eng)}
              className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border transition-all ${
                engine === eng ? 'bg-cyan-accent/20 border-cyan-accent text-cyan-accent' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              {eng}
            </button>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search web securely or enter URL (e.g. privacy tools, AI models)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-bg-primary/60 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-gray-500 focus:outline-none focus:border-cyan-accent transition-all"
          />
        </div>
        <Button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-cyan-accent to-purple-accent text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Search</span>
        </Button>
      </form>
    </Card>
  );
}

export function BrowserDownloadCard() {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const handleDownload = (platform: string) => {
    setDownloading(platform);
    setTimeout(() => {
      setDownloading(null);
      setDownloaded(platform);
      setTimeout(() => setDownloaded(null), 4000);
    }, 1500);
  };

  const platforms = [
    { id: 'win', name: 'Windows x64', desc: '.exe installer (Win 10/11)', icon: Monitor },
    { id: 'mac', name: 'macOS Apple Silicon', desc: '.dmg universal build', icon: Monitor },
    { id: 'linux', name: 'Linux AppImage', desc: 'Universal binary package', icon: Monitor },
    { id: 'android', name: 'Android APK', desc: 'Mobile secure build v2.4', icon: Smartphone },
  ];

  return (
    <Card className="relative overflow-hidden border-purple-accent/30">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-accent/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
            <Download className="w-5 h-5 text-purple-accent" />
            <span>Download BlackNode Browser</span>
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Get the standalone native desktop & mobile browser client with built-in P2P VPN & AI agent core.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platforms.map((p) => {
          const Icon = p.icon;
          const isDownloading = downloading === p.id;
          const isDownloaded = downloaded === p.id;

          return (
            <div key={p.id} className="p-4 rounded-xl bg-bg-primary/60 border border-white/5 flex flex-col justify-between hover:border-purple-accent/30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-purple-accent">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-white/5 px-2 py-0.5 rounded text-gray-400">Stable v2.4</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{p.name}</h4>
                <p className="text-[11px] text-gray-400 mb-4">{p.desc}</p>
              </div>

              <Button
                onClick={() => handleDownload(p.id)}
                className={`w-full py-2 text-xs font-bold uppercase tracking-wider ${
                  isDownloaded ? 'bg-emerald-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {isDownloading ? (
                  <span className="animate-pulse">Downloading...</span>
                ) : isDownloaded ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Downloaded
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Download Client
                  </span>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export function ConnectionStatus({ 
  connected, 
  server, 
  protocol,
  onQuickConnect 
}: { 
  connected: boolean, 
  server?: string, 
  protocol?: string,
  onQuickConnect?: () => void
}) {
  return (
    <Card className="relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full transition-colors ${connected ? 'bg-emerald-500' : 'bg-pink-accent'}`} />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary flex items-center space-x-2">
          <ShieldCheck className={`w-4 h-4 ${connected ? 'text-emerald-400' : 'text-pink-accent'}`} />
          <span>Security Protocol</span>
        </h3>
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-[10px] font-bold border ${connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-pink-accent/10 text-pink-accent border-pink-accent/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-pink-accent'}`} />
          <span>{connected ? 'ENCRYPTED' : 'EXPOSED'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <p className="text-[10px] uppercase text-text-secondary font-mono mb-1">Active Gateway</p>
            <p className="text-sm font-bold text-text-primary underline decoration-purple-accent/30 underline-offset-4">{server || 'NONE'}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-[10px] uppercase text-text-secondary font-mono mb-1">Tunnel Status</p>
              <div className="flex items-center gap-3">
                <p className={`text-sm font-mono font-bold ${connected ? 'text-cyan-accent' : 'text-text-secondary'}`}>
                  {connected ? 'STABLE' : 'IDLE'}
                </p>
                {!connected && onQuickConnect && (
                  <button 
                    onClick={onQuickConnect}
                    className="text-[9px] uppercase tracking-tighter bg-purple-accent/20 text-purple-accent hover:bg-purple-accent hover:text-white px-2 py-0.5 rounded border border-purple-accent/30 transition-all font-bold"
                  >
                    Quick Connect
                  </button>
                )}
              </div>
            </div>
            {connected && protocol && (
              <div>
                <p className="text-[10px] uppercase text-text-secondary font-mono mb-1">Protocol</p>
                <p className="text-sm font-mono font-bold text-purple-accent capitalize">{protocol}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center p-4 bg-bg-primary/40 rounded-2xl border border-white/5 font-mono text-center">
          <div>
            <p className="text-[24px] font-bold text-text-primary leading-none">{connected ? '32' : '--'}<span className="text-xs ml-1 text-text-secondary">ms</span></p>
            <p className="text-[10px] uppercase text-text-secondary mt-1">Latency</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function ThreatProtection() {
  const threats = [
    { type: 'Data Harvester', target: 'tr.analytics.pub', status: 'PURGED', color: 'text-emerald-400' },
    { type: 'Injection Vector', target: 'proxy.shadow.io', status: 'NEUTRALIZED', color: 'text-purple-accent' },
    { type: 'Canvas Fingerprint', target: 'fingerprintjs.com', status: 'MASKED', color: 'text-cyan-accent' },
  ];

  return (
    <Card className="border-l-4 border-l-purple-accent">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Threat Matrix</h3>
        <span className="text-[10px] font-mono text-text-secondary flex items-center space-x-1">
          <Activity className="w-3 h-3 text-purple-accent animate-pulse" />
          <span>REAL-TIME SCAN</span>
        </span>
      </div>
      <div className="space-y-3">
        {threats.map((threat, i) => (
          <div key={i} className="group p-3 rounded-xl bg-bg-primary/40 border border-white/5 hover:border-purple-accent/20 transition-all">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-text-primary">{threat.type}</p>
              <span className={`text-[9px] font-mono font-black ${threat.color}`}>{threat.status}</span>
            </div>
            <p className="text-[10px] text-text-secondary font-mono truncate">{threat.target}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AIActivityFeed() {
  const activities = [
    { time: '2m ago', text: 'Anomalous node detected in peer list. Auto-masked identity.', type: 'warning', boldText: 'Neural Guard:' },
    { time: '15m ago', text: 'Optimized workspace memory by offloading 4 background nodes to cold storage.', type: 'summary' },
  ];

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-pink-accent via-purple-accent to-cyan-accent opacity-50"></div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">System Activity</h3>
        <Layout className="w-4 h-4 text-purple-accent/50" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex space-x-3 group">
            <div className="relative mt-1">
              <div className={`w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-purple-accent ring-4 ring-purple-accent/10' : 'bg-slate-700'}`}></div>
              {i < activities.length - 1 && <div className="absolute top-2 left-[3px] w-[2px] h-8 bg-white/5"></div>}
            </div>
            <div className="pb-4">
              <p className="text-xs text-text-primary leading-relaxed">
                {activity.boldText && <span className="font-bold text-purple-accent mr-1 uppercase tracking-tighter">{activity.boldText}</span>}
                {activity.text}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-[10px] text-text-secondary font-mono block">{activity.time}</span>
                <button 
                  className="text-[9px] uppercase tracking-widest font-bold text-cyan-accent hover:text-white flex items-center space-x-1 transition-colors group/btn"
                  onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(activity.boldText || '')} ${encodeURIComponent(activity.text)}`, '_blank')}
                >
                  <span>Learn More</span>
                  <ExternalLink className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
