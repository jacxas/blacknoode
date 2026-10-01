import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, Zap, Wifi } from 'lucide-react';

export function TelemetryBar() {
  const [metrics, setMetrics] = useState({
    cpu: 24,
    latency: 32,
    traffic: 1.2,
    load: 15
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(Math.random() * 20) + 15,
        latency: Math.floor(Math.random() * 40) + 20,
        traffic: (Math.random() * 2 + 0.5).toFixed(1) as unknown as number,
        load: Math.floor(Math.random() * 10) + 10
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-20 md:left-24 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 h-10 flex items-center px-6 justify-between z-50 text-[10px] font-mono tracking-wider transition-all duration-300">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-purple-accent">
          <Activity className="w-3 h-3" />
          <span className="uppercase">Uplink: Active</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-4 text-text-secondary">
          <div className="flex items-center space-x-1.5">
            <Cpu className="w-3 h-3" />
            <span>CPU: {metrics.cpu}%</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Wifi className="w-3 h-3" />
            <span>LAT: {metrics.latency}ms</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Zap className="w-3 h-3" />
            <span>IO: {metrics.traffic} MB/s</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-4 ring-emerald-500/10" />
          <span className="text-emerald-400">ENCRYPTION: AES-256-GCM</span>
        </div>
        <div className="text-text-secondary">
          SYS_LOAD: {metrics.load}%
        </div>
      </div>
    </div>
  );
}
