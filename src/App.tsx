import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, db } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { Sidebar } from './components/Sidebar';
import { TelemetryBar } from './components/TelemetryBar';
import { FloatingWidgets } from './components/FloatingWidgets';
import { Button, Card, Modal } from './components/UI';
import { QuickStats, ConnectionStatus, ThreatProtection, AIActivityFeed, SearchEngineWidget, BrowserDownloadCard } from './components/DashboardComponents';
import { ServerList, ConnectionPanel, SpeedTestResult, VPNStats } from './components/VPNComponents';
import { AIFeatureCard, AIInsights, AIConfiguration } from './components/AIComponents';
import { MiningControl } from './components/MiningComponents';
import { AdminPanel } from './components/AdminPanel';
import { UserSettings } from './components/UserSettings';
import { GitHubSync } from './components/GitHubSync';
import { VPNServer } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FileText, Code, Globe, ShieldAlert, Loader2, Network } from 'lucide-react';
import { summarizeContent } from './services/geminiService';
import { handleFirestoreError, OperationType } from './lib/firestoreUtils';

const SEED_SERVERS: VPNServer[] = [
  {"id":"vpn_us_01","name":"US East - New York","country":"USA","city":"New York","ip":"34.203.12.11","regionCode":"US-NE","latencyMs":32,"loadPercent":42,"protocols":["wireguard","openvpn"],"supportsP2P":true,"priceTier":"free"},
  {"id":"vpn_us_02","name":"US West - Los Angeles","country":"USA","city":"Los Angeles","ip":"3.216.45.22","regionCode":"US-WE","latencyMs":78,"loadPercent":27,"protocols":["wireguard","openvpn"],"supportsP2P":true,"priceTier":"premium"},
  {"id":"vpn_nl_01","name":"Europe - Amsterdam","country":"Netherlands","city":"Amsterdam","ip":"51.15.23.101","regionCode":"NL","latencyMs":54,"loadPercent":31,"protocols":["wireguard"],"supportsP2P":false,"priceTier":"free"},
  {"id":"vpn_sg_01","name":"Asia - Singapore","country":"Singapore","city":"Singapore","ip":"13.250.34.12","regionCode":"SG","latencyMs":120,"loadPercent":55,"protocols":["openvpn","wireguard"],"supportsP2P":false,"priceTier":"premium"},
  {"id":"vpn_br_01","name":"South America - São Paulo","country":"Brazil","city":"São Paulo","ip":"191.102.11.21","regionCode":"BR","latencyMs":98,"loadPercent":20,"protocols":["wireguard"],"supportsP2P":true,"priceTier":"free"},
  {"id":"vpn_uk_01","name":"Europe - London","country":"UK","city":"London","ip":"52.56.34.33","regionCode":"GB","latencyMs":46,"loadPercent":60,"protocols":["openvpn"],"supportsP2P":false,"priceTier":"premium"},
  {"id":"vpn_de_01","name":"Europe - Frankfurt","country":"Germany","city":"Frankfurt","ip":"18.194.12.44","regionCode":"DE","latencyMs":50,"loadPercent":38,"protocols":["wireguard","openvpn"],"supportsP2P":true,"priceTier":"free"},
  {"id":"vpn_jp_01","name":"Asia - Tokyo","country":"Japan","city":"Tokyo","ip":"54.95.22.55","regionCode":"JP","latencyMs":110,"loadPercent":29,"protocols":["wireguard"],"supportsP2P":false,"priceTier":"premium"}
];

const MOCK_TABS_CONTENT = `
Tab 1: React 19 Release Notes - Actions, Use, and Document Metadata support.
Tab 2: Tailwind CSS v4.0 Alpha - A modern engine for the modern web. High performance, zero configuration.
Tab 3: MDN: Web Workers API - How to run script operations in background threads separate from the main execution thread.
Tab 4: Anthropic: Introducing Claude 3.5 Sonnet - Our most intelligent model yet.
`;

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vpnConnected, setVpnConnected] = useState(false);
  const [vpnProtocol, setVpnProtocol] = useState('WireGuard');
  const [selectedServer, setSelectedServer] = useState<VPNServer | undefined>(SEED_SERVERS[2]);

  // AI State
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        seedInitialData();
      }
    });
    return () => unsubscribe();
  }, []);

  const seedInitialData = async () => {
    try {
      const serversSnap = await getDocs(collection(db, 'vpn_servers'));
      if (serversSnap.empty) {
        console.log('Seeding VPN servers...');
        const batch = writeBatch(db);
        SEED_SERVERS.forEach(server => {
          batch.set(doc(db, 'vpn_servers', server.id), server);
        });
        try {
          await batch.commit();
        } catch (e) {
          handleFirestoreError(e, OperationType.WRITE, 'vpn_servers (batch)');
        }
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('authInfo')) {
        // Already handled by handleFirestoreError
        console.error('Handled Firestore Error:', e.message);
      } else {
        console.error('Error seeding data:', e);
      }
    }
  };

  const handleSummarizeTabs = async () => {
    setIsSummarizing(true);
    setSummary(null);
    try {
      const result = await summarizeContent(MOCK_TABS_CONTENT);
      setSummary(result);
    } catch (error) {
      console.error("Summarization failed:", error);
      setSummary("Error: Could not generate summary. Please check your AI configuration.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleQuickConnect = () => {
    const fastest = [...SEED_SERVERS].sort((a, b) => a.latencyMs - b.latencyMs)[0];
    setSelectedServer(fastest);
    setVpnConnected(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0b0f14]">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f14] p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="w-20 h-20 rounded-3xl gradient-accent mx-auto flex items-center justify-center shadow-2xl shadow-purple-500/20">
            <Network className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">BLACK<span className="text-purple-accent">NODE</span></h1>
            <p className="text-gray-400">Autonomous AI Browser Platform</p>
          </div>
          <Card className="p-8">
            <h2 className="text-xl font-bold mb-6">Welcome Back</h2>
            <Button onClick={signInWithGoogle} className="w-full py-4 text-lg">
              Sign In with Google
            </Button>
            <p className="mt-6 text-xs text-gray-500">
              Access your VPN settings, AI assistant, and crypto-mining rewards from any device.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <QuickStats />
            <SearchEngineWidget />
            <BrowserDownloadCard />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ConnectionStatus 
                  connected={vpnConnected} 
                  server={selectedServer?.name} 
                  protocol={vpnProtocol}
                  onQuickConnect={handleQuickConnect}
                />
                <AIActivityFeed />
              </div>
              <ThreatProtection />
            </div>
          </div>
        );
      case 'vpn':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
            <div className="lg:col-span-1 h-full overflow-hidden">
              <ServerList 
                servers={SEED_SERVERS} 
                activeId={selectedServer?.id} 
                onSelect={setSelectedServer} 
              />
            </div>
            <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
              <ConnectionPanel 
                server={selectedServer} 
                connected={vpnConnected}
                protocol={vpnProtocol}
                onProtocolChange={setVpnProtocol}
                onConnect={() => setVpnConnected(true)}
                onDisconnect={() => setVpnConnected(false)}
              />
              <VPNStats connected={vpnConnected} />
              <SpeedTestResult />
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AIFeatureCard 
                  title="Summarize Active Tabs" 
                  description="Get a concise overview of all currently open browser tabs." 
                  icon={FileText} 
                  onClick={handleSummarizeTabs} 
                />
                <AIFeatureCard 
                  title="Smart Code Explainer" 
                  description="Analyze and explain code snippets found on any page." 
                  icon={Code} 
                  onClick={() => {}} 
                />
                <AIFeatureCard 
                  title="Global Translator" 
                  description="Instant, context-aware translation for any language." 
                  icon={Globe} 
                  onClick={() => {}} 
                />
                <AIFeatureCard 
                  title="Threat Analysis" 
                  description="Deep scan for hidden trackers and phishing patterns." 
                  icon={ShieldAlert} 
                  onClick={() => {}} 
                />
              </div>
              <AIInsights />
            </div>
            <AIConfiguration />
          </div>
        );
      case 'miner':
        return <MiningControl />;
      case 'github':
        return <GitHubSync />;
      case 'admin':
        return <AdminPanel />;
      case 'settings':
        return <UserSettings />;
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden relative">
      {/* Ambient background effect */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-accent/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-cyan-accent/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-300 mb-10">
        <header className="px-6 pt-4 space-y-3 z-30">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center px-4 py-2 rounded-t-xl border-t border-x border-white/5 min-w-[180px] ${activeTab === 'dashboard' ? 'bg-bg-secondary/80 backdrop-blur-md' : 'bg-white/5 opacity-60'}`}>
              <span className="text-xs font-medium truncate capitalize">{activeTab} - BLACKNODE</span>
              <button className="ml-auto text-slate-500 hover:text-white" onClick={() => setActiveTab('dashboard')}>&times;</button>
            </div>
            <div className="flex items-center bg-white/5 px-4 py-2 rounded-t-xl min-w-[180px] opacity-60">
              <span className="text-xs">Session: {vpnConnected ? selectedServer?.name : 'Local Only'}</span>
              <button className="ml-auto text-slate-500">&times;</button>
            </div>
            <button className="p-2 text-slate-500 hover:text-white transition-colors">+</button>
          </div>
          <div className="flex items-center space-x-4 bg-panel/60 backdrop-blur-xl rounded-2xl p-2 border border-white/5 shadow-sm">
            <div className="flex space-x-2 px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-pink-accent animate-pulse"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-purple-accent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <div className="flex-1 flex items-center bg-bg-primary/50 rounded-xl px-4 py-1.5 border border-white/10 group overflow-hidden">
              <Network className={`w-4 h-4 mr-3 shrink-0 ${vpnConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
              <div className="flex items-center text-sm font-mono whitespace-nowrap overflow-hidden">
                <span className="text-purple-accent/80">node@blacknode:</span>
                <span className="text-cyan-accent/80 ml-1">~/{activeTab}</span>
                <span className="ml-2 text-slate-500">$ _</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-3 px-2">
              <div className={`flex items-center px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                vpnConnected 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
              }`}>
                VPN {vpnConnected ? 'ON' : 'OFF'}
              </div>
              <div className="flex items-center bg-pink-accent/10 text-pink-accent px-2 py-0.5 rounded text-[10px] font-bold border border-pink-accent/20">
                AI_SYNC
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="mb-8 pl-1 border-l-2 border-purple-accent/30">
                  <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{activeTab}</h2>
                  <p className="text-text-secondary text-xs mt-1 uppercase tracking-widest font-mono">Terminal Protocol Layer // Active Session</p>
                </div>
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      <FloatingWidgets />
      <TelemetryBar />

      {/* AI Summary Modal */}
      <Modal 
        isOpen={isSummarizing || !!summary} 
        onClose={() => { setSummary(null); setIsSummarizing(false); }} 
        title="AI Tab Summary"
      >
        {isSummarizing ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-[#00d2ff] animate-spin" />
            <p className="text-sm text-gray-400 animate-pulse">Gathering content and generating summary...</p>
          </div>
        ) : (
          <div className="space-y-4 text-slate-300 translate-z-0">
            <p className="text-sm border-l-2 border-[#00d2ff] pl-4 italic text-slate-500 mb-6">
              Analyzed {MOCK_TABS_CONTENT.split('Tab').length - 1} active tabs for high-level insights.
            </p>
            <div className="prose prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
            <div className="pt-6 flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold border-t border-white/5">
              <span>Model: Gemini 3 Flash</span>
              <span>Context: Multi-Tab Analytics</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
