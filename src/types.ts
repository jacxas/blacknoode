export interface BrowsingSession {
  id: string;
  userId: string;
  startAt: string;
  endAt?: string;
  pagesVisited: string[];
  dataUsedMB: number;
  minerEnabled: boolean;
  minerStats?: {
    hashRateHps: number;
    cpuPercent: number;
    gpuPercent: number;
  };
  vpnServerId: string | null;
  notes?: string;
}

export interface VPNServer {
  id: string;
  name: string;
  country: string;
  city: string;
  ip: string;
  regionCode: string;
  latencyMs: number;
  loadPercent: number;
  protocols: string[];
  supportsP2P: boolean;
  priceTier: 'free' | 'premium';
}

export interface AIPreference {
  id: string;
  userId: string;
  assistantMode: 'concise' | 'detailed' | 'creative' | 'privacy-first';
  summarizationDepth: number;
  autoBlockRisky: boolean;
  allowTelemetry: boolean;
  preferredVoice: string;
  createdAt: string;
}
