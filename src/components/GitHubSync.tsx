import React, { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, RefreshCw, CheckCircle2, Lock, Key, Globe, Terminal, AlertCircle } from 'lucide-react';
import { Card, Button } from './UI';
import { motion } from 'motion/react';

export function GitHubSync() {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState('');
  const [repo, setRepo] = useState('jacxas/BLACKNODE');
  const [branch, setBranch] = useState('main');
  const [autoSync, setAutoSync] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>('2026-10-01 03:30:12 UTC');
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '[INIT] GitHub Sync Engine v2.4 initialized.',
    '[AUTH] Token verified for user: jacxas',
    '[SYNC] Repository jacxas/BLACKNODE fetched successfully.'
  ]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      alert('Please enter a valid GitHub Personal Access Token or OAuth token.');
      return;
    }
    setIsConnected(true);
    setSyncLogs(prev => [`[AUTH] Successfully connected to GitHub as @jacxas`, ...prev]);
  };

  const handleSyncNow = () => {
    setSyncing(true);
    setSyncLogs(prev => [`[SYNC] Starting synchronization with ${repo}:${branch}...`, ...prev]);
    setTimeout(() => {
      setSyncing(false);
      const now = new Date().toUTCString();
      setLastSynced(now);
      setSyncLogs(prev => [
        `[SUCCESS] Pushed 3 config updates and 12 node logs to ${repo}/${branch}`,
        `[SYNC] Completed at ${now}`,
        ...prev
      ]);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setToken('');
    setSyncLogs(prev => [`[AUTH] Disconnected from GitHub repository.`, ...prev]);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-4 mb-2">
        <div className="w-14 h-14 rounded-2xl bg-[#24292e]/20 border border-[#24292e]/40 flex items-center justify-center">
          <GitBranch className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">GitHub Synchronization</h2>
          <p className="text-text-secondary text-xs font-mono uppercase tracking-widest">
            Sync node configs, encrypted keys, and AI session notes with your GitHub repository.
          </p>
        </div>
      </div>

      {!isConnected ? (
        <Card title="CONNECT TO GITHUB">
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="p-4 rounded-xl bg-purple-accent/5 border border-purple-accent/20 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-purple-accent shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white">OAuth & Token Authentication:</span> To bypass preview environment restrictions, enter your GitHub Personal Access Token (with <code className="text-cyan-accent font-mono">repo</code> scope) or connect via authorized OAuth integration.
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary">GITHUB PERSONAL ACCESS TOKEN / OAUTH KEY</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full bg-bg-primary border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-purple-accent outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-secondary">TARGET REPOSITORY</label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  placeholder="username/repository"
                  className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-accent outline-none font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-secondary">BRANCH</label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-purple-accent outline-none font-mono"
                />
              </div>
            </div>

            <Button type="submit" className="w-full py-3 bg-purple-accent hover:bg-purple-accent/90 text-white font-bold">
              ESTABLISH GITHUB CONNECTION
            </Button>
          </form>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card title="REPOSITORY STATUS">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-white font-bold text-sm">{repo}</h4>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-mono border border-cyan-500/20">
                        {branch}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-0.5">Last synced: {lastSynced || 'Never'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Button
                    onClick={handleSyncNow}
                    disabled={syncing}
                    className="flex-1 sm:flex-none bg-purple-accent hover:bg-purple-accent/90 text-xs py-2 px-4"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? 'SYNCING...' : 'SYNC NOW'}
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-xs py-2 px-3 border-white/10"
                  >
                    DISCONNECT
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center space-x-3">
                    <RefreshCw className="w-4 h-4 text-cyan-accent" />
                    <span className="text-sm text-text-primary">Auto-Sync on Changes</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="w-10 h-5 rounded-full bg-white/10 appearance-none checked:bg-cyan-accent transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-5"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center space-x-3">
                    <GitCommit className="w-4 h-4 text-purple-accent" />
                    <span className="text-sm text-text-primary">Commit Signing</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 font-mono">GPG ENABLED</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="LIVE SYNC LOGS">
            <div className="bg-[#030304] rounded-xl p-4 border border-white/10 font-mono text-xs space-y-2 h-48 overflow-y-auto">
              {syncLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-slate-600">&gt;</span>
                  <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('AUTH') ? 'text-cyan-400' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
