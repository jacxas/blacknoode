import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Server, Database, Activity, AlertTriangle, ShieldCheck, Terminal, Trash2, Edit, RefreshCw } from 'lucide-react';
import { Card, Button } from './UI';

export function AdminPanel() {
  const [stats] = useState({
    totalUsers: 1284,
    activeNodes: 42,
    threatsBlocked: 15403,
    uptime: '99.98%'
  });

  const [users] = useState([
    { id: 'usr_1', email: 'user1@node.net', status: 'compliant', flags: 0 },
    { id: 'usr_2', email: 'shady_operator@void.me', status: 'warning', flags: 2 },
    { id: 'usr_3', email: 'alpha_dev@terminal.io', status: 'compliant', flags: 0 },
  ]);

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tighter flex items-center gap-3">
            <Terminal className="text-purple-accent w-8 h-8" />
            GLOBAL <span className="text-purple-accent">CORE_MODERATOR</span>
          </h2>
          <p className="text-text-secondary text-sm mt-1 uppercase tracking-widest font-mono">Operator: jacxas@gmail.com // Level: ROOT (99)</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-bg-secondary border-white/5 text-xs font-bold py-2">
            <RefreshCw className="w-3 h-3 mr-2" /> SYNC_POLICIES
          </Button>
          <Button className="gradient-accent text-xs font-bold py-2 shadow-lg shadow-purple-500/20">
            FORCE_GLOBAL_MAINTENANCE
          </Button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-2 border-t-cyan-accent">
          <div className="flex justify-between items-center mb-2">
            <Users className="w-5 h-5 text-cyan-accent" />
            <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">System Users</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.totalUsers}</p>
        </Card>
        <Card className="border-t-2 border-t-purple-accent">
          <div className="flex justify-between items-center mb-2">
            <Server className="w-5 h-5 text-purple-accent" />
            <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Nodes Online</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.activeNodes}</p>
        </Card>
        <Card className="border-t-2 border-t-pink-accent">
          <div className="flex justify-between items-center mb-2">
            <ShieldCheck className="w-5 h-5 text-pink-accent" />
            <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Rules Enforcement</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">ACTIVE</p>
        </Card>
        <Card className="border-t-2 border-t-emerald-400">
          <div className="flex justify-between items-center mb-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Network Integrity</span>
          </div>
          <p className="text-2xl font-bold text-white font-mono">{stats.uptime}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Rule Management */}
        <Card className="lg:col-span-2" title="USER_COMPLIANCE_WATCH">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[10px] text-text-secondary uppercase tracking-widest font-mono border-b border-white/5">
                <tr>
                  <th className="pb-3">User Node</th>
                  <th className="pb-3">Compliance</th>
                  <th className="pb-3">Flags</th>
                  <th className="pb-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.id} className="group transition-colors hover:bg-white/5">
                    <td className="py-4 font-mono text-xs text-text-primary capitalize">{user.email}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.status === 'compliant' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-pink-accent/10 text-pink-accent'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 font-mono text-xs text-text-secondary">{user.flags} Warnings</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-[10px] font-bold text-cyan-accent hover:underline uppercase">Inspect</button>
                        <button className="text-[10px] font-bold text-pink-accent hover:underline uppercase">Sanction</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Global Rules Configuration */}
        <div className="space-y-6">
          <Card title="GLOBAL_POLICY_ENGINE">
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Mining Limit (%)</span>
                  <span className="text-xs font-bold text-cyan-accent">45%</span>
                </div>
                <input type="range" className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-accent" />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[10px] text-text-secondary font-mono tracking-widest uppercase">Neural Bandwidth</span>
                  <span className="text-xs font-bold text-purple-accent">High</span>
                </div>
                <input type="range" className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-purple-accent" />
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-mono">Auto-ban malicious IPs</span>
                  <div className="w-8 h-4 bg-purple-accent/40 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-secondary font-mono">Neural net sanitization</span>
                  <div className="w-8 h-4 bg-purple-accent/40 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                </div>
              </div>
              <Button className="w-full mt-2 text-[10px] tracking-widest font-bold border-purple-accent/30 text-purple-accent hover:bg-purple-accent/10">COMMIT_GLOBAL_CHANGES</Button>
            </div>
          </Card>

          <Card className="bg-purple-accent/5 border-purple-accent/20">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-xl bg-purple-accent/10">
                <ShieldCheck className="w-6 h-6 text-purple-accent" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">RULE ENFORCER</h4>
                <p className="text-xs text-text-secondary mt-1">Rule #81 activated: Automatically throttling nodes with abnormal traffic patterns.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
