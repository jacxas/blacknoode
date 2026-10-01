import { MapPin, Zap, ShieldCheck, Globe, Search, RefreshCw, Smartphone } from 'lucide-react';
import { Card, Button } from './UI';
import { useState, useEffect } from 'react';
import { VPNServer } from '../types';

export function ServerList({ servers, onSelect, activeId }: { servers: VPNServer[], onSelect: (s: VPNServer) => void, activeId?: string }) {
  const [search, setSearch] = useState('');
  
  const filtered = servers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.country.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col" title="Select Location">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by country or city..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-accent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {filtered.map((server) => (
          <button
            key={server.id}
            onClick={() => onSelect(server)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
              activeId === server.id ? 'bg-white/10 border-cyan-accent/50' : 'bg-white/5 border-transparent hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{server.name}</p>
                <p className="text-xs text-gray-500">{server.city}, {server.country}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-xs font-mono font-medium ${server.latencyMs < 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                {server.latencyMs}ms
              </p>
              {server.priceTier === 'premium' && (
                <span className="text-[10px] px-1 bg-yellow-500/10 text-yellow-500 rounded border border-yellow-500/20 uppercase font-bold">Premium</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

export function ConnectionPanel({ 
  server, 
  onConnect, 
  onDisconnect, 
  connected,
  protocol,
  onProtocolChange
}: { 
  server?: VPNServer, 
  onConnect: () => void, 
  onDisconnect: () => void, 
  connected: boolean,
  protocol: string,
  onProtocolChange: (p: string) => void
}) {
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // Simulate auto-reconnect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!connected && autoReconnect && !isReconnecting) {
      // Small delay before "auto-reconnecting"
      setIsReconnecting(true);
      timer = setTimeout(() => {
        onConnect();
        setIsReconnecting(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [connected, autoReconnect, onConnect, isReconnecting]);

  return (
    <Card className="relative overflow-hidden" title="TUNNEL_CONFIGURATION">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold mb-1 text-white">
            {connected ? 'STABLE_TUNNEL' : isReconnecting ? 'RECONNECTING...' : 'READY_TO_CONNECT'}
          </h3>
          {connected && <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />}
        </div>
        <p className="text-gray-400 text-sm">
          {connected 
            ? 'End-to-end encryption active via node edge' 
            : isReconnecting 
              ? 'Attempting to re-establish secure gateway...' 
              : 'Secure gateway initialized and standing by'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase text-text-secondary font-mono tracking-widest mb-2">Masked IP</p>
          <p className="text-sm font-mono text-cyan-accent">{connected ? server?.ip : '84.12.192.33'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
          <p className="text-[10px] uppercase text-text-secondary font-mono tracking-widest mb-2">Session Uptime</p>
          <p className="text-sm font-mono text-white tracking-widest">{connected ? '01:22:45' : '--:--:--'}</p>
        </div>
      </div>

      <div className="space-y-6 mb-8 bg-bg-primary/30 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-widest">Auto-Reconnect</p>
            <p className="text-[10px] text-gray-500 uppercase mt-1">Maintain steady tunnel state</p>
          </div>
          <input 
            type="checkbox" 
            className="w-10 h-5 rounded-full bg-white/10 appearance-none checked:bg-cyan-accent transition-all cursor-pointer relative shadow-inner after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-5"
            checked={autoReconnect}
            onChange={(e) => setAutoReconnect(e.target.checked)}
          />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">Protocol Engine</p>
          <div className="grid grid-cols-3 gap-2">
            {['WireGuard', 'OpenVPN', 'IKEv2'].map((p) => (
              <button
                key={p}
                onClick={() => onProtocolChange(p)}
                className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  protocol === p ? 'bg-cyan-accent/20 border-cyan-accent/50 text-cyan-accent shadow-lg shadow-cyan-500/10' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        variant={connected ? 'danger' : 'primary'}
        onClick={() => {
          if (connected) {
            onDisconnect();
            setIsReconnecting(false); // Stop auto-reconnect if manually disconnected
          } else {
            onConnect();
          }
        }}
        className="w-full py-6 flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
      >
        <div className={`absolute inset-0 bg-white/10 transition-transform duration-500 translate-y-full group-hover:translate-y-0`} />
        <span className="relative z-10 text-lg font-bold tracking-tighter">{connected ? 'DISCONNECT_NODE' : 'ESTABLISH_LINK'}</span>
        <span className="relative z-10 text-[10px] uppercase tracking-widest opacity-60 font-mono">
          {connected ? 'Kill Switch Armed' : server ? `to ${server.city}_${server.country}` : 'Smart Location Search'}
        </span>
      </Button>

      <div className="mt-8 flex items-center justify-center gap-8">
        <div className="flex flex-col items-center group cursor-pointer">
          <RefreshCw className="w-4 h-4 text-gray-500 mb-1 group-hover:text-cyan-accent transition-colors" />
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest group-hover:text-cyan-accent">Rescan</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer">
          <Zap className="w-4 h-4 text-gray-500 mb-1 group-hover:text-yellow-500 transition-colors" />
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest group-hover:text-yellow-500 font-mono">Speed</span>
        </div>
        <div className="flex flex-col items-center group cursor-pointer">
          <Smartphone className="w-4 h-4 text-gray-500 mb-1 group-hover:text-purple-accent transition-colors" />
          <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest group-hover:text-purple-accent">Sync</span>
        </div>
      </div>
    </Card>
  );
}

export function SpeedTestResult() {
  return (
    <Card title="Latest Speed Test">
      <div className="flex items-center justify-around py-4">
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-cyan-accent">84.2</div>
          <div className="text-[10px] text-gray-500 uppercase font-bold">Mbps Down</div>
        </div>
        <div className="w-px h-12 bg-white/5" />
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-pink-accent">12.5</div>
          <div className="text-[10px] text-gray-500 uppercase font-bold">Mbps Up</div>
        </div>
        <div className="w-px h-12 bg-white/5" />
        <div className="text-center">
          <div className="text-3xl font-bold font-mono text-green-500">22</div>
          <div className="text-[10px] text-gray-500 uppercase font-bold">Ping ms</div>
        </div>
      </div>
    </Card>
  );
}

export function VPNStats({ connected }: { connected: boolean }) {
  const [metrics, setMetrics] = useState({
    download: 0,
    upload: 0,
    ping: 0,
    totalData: 1.2
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connected) {
      interval = setInterval(() => {
        setMetrics(prev => ({
          download: Math.floor(Math.random() * 50) + 30,
          upload: Math.floor(Math.random() * 10) + 5,
          ping: Math.floor(Math.random() * 10) + 20,
          totalData: parseFloat((prev.totalData + 0.001).toFixed(3))
        }));
      }, 2000);
    } else {
      setMetrics({ download: 0, upload: 0, ping: 0, totalData: 1.2 });
    }
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <Card title="REAL_TIME_NODE_METRICS">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Downlink</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold font-mono ${connected ? 'text-cyan-accent' : 'text-gray-600'}`}>{metrics.download.toFixed(1)}</span>
            <span className="text-[10px] text-gray-500 font-mono">Mb/s</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Uplink</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold font-mono ${connected ? 'text-pink-accent' : 'text-gray-600'}`}>{metrics.upload.toFixed(1)}</span>
            <span className="text-[10px] text-gray-500 font-mono">Mb/s</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Latency</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold font-mono ${connected ? 'text-green-500' : 'text-gray-600'}`}>{metrics.ping}</span>
            <span className="text-[10px] text-gray-500 font-mono">ms</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Traffic</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold font-mono ${connected ? 'text-white' : 'text-gray-600'}`}>{metrics.totalData.toFixed(2)}</span>
            <span className="text-[10px] text-gray-500 font-mono">GB</span>
          </div>
        </div>
      </div>
      
      {/* Small visual graph simulation */}
      <div className="mt-6 flex items-end gap-[2px] h-8">
        {Array.from({ length: 48 }).map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-t-sm transition-all duration-500 ${connected ? 'bg-cyan-accent/20' : 'bg-gray-800'}`}
            style={{ 
              height: connected ? `${Math.random() * 100}%` : '10%',
              opacity: connected ? 1 : 0.3
            }}
          />
        ))}
      </div>
    </Card>
  );
}
