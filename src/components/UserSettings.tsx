import React, { useState } from 'react';
import { User, Shield, Bell, Zap, Sliders, Lock } from 'lucide-react';
import { Card, Button } from './UI';
import { auth } from '../lib/firebase';

export function UserSettings() {
  const [notifications, setNotifications] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          {auth.currentUser?.photoURL ? (
            <img src={auth.currentUser.photoURL} alt="User" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <User className="w-8 h-8 text-gray-500" />
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{auth.currentUser?.displayName || 'Node Operator'}</h2>
          <p className="text-text-secondary text-xs font-mono uppercase tracking-widest">{auth.currentUser?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="ACCOUNT PREFERENCES">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center space-x-3">
                <Bell className="w-4 h-4 text-purple-accent" />
                <span className="text-sm text-text-primary">System Notifications</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-10 h-5 rounded-full bg-white/10 appearance-none checked:bg-purple-accent transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-5" 
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-cyan-accent" />
                <span className="text-sm text-text-primary">Stealth Identity Mask</span>
              </div>
              <input 
                type="checkbox" 
                checked={stealthMode}
                onChange={(e) => setStealthMode(e.target.checked)}
                className="w-10 h-5 rounded-full bg-white/10 appearance-none checked:bg-cyan-accent transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-5" 
              />
            </div>
          </div>
        </Card>

        <Card title="NODE OPTIMIZATION">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-mono tracking-widest">Protocol Version</span>
              <span className="text-xs font-bold text-emerald-400">v4.2.0-STABLE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-mono tracking-widest">Encryption Level</span>
              <span className="text-xs font-bold text-white">AES-256-GCM</span>
            </div>
            <Button className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-xs py-2">
              <Zap className="w-3 h-3 mr-2" /> RUN DIAGNOSTICS
            </Button>
          </div>
        </Card>

        <Card className="md:col-span-2 border-dashed border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-pink-accent/10 border border-pink-accent/20">
                <Lock className="w-6 h-6 text-pink-accent" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">SECURITY CLEARANCE</h4>
                <p className="text-xs text-text-secondary mt-1">Your node is currently operating under standard protocol. No violations detected.</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 font-mono">STATUS: COMPLIANT</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
