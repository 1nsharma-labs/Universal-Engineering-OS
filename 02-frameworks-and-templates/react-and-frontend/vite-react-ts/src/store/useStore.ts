import { create } from 'zustand';

export type ConsoleTab =
  | 'overview'
  | 'factory'
  | 'intelligence'
  | 'execution'
  | 'events-obs'
  | 'identity-secrets'
  | 'universe';

interface HubState {
  activeTab: ConsoleTab;
  activeProfile: 'Local-Dev' | 'Staging' | 'Production';
  activeRole: 'admin' | 'architect' | 'coder-agent' | 'qa-agent' | 'viewer';
  commandPaletteOpen: boolean;
  connectedNodes: string[];
  setActiveTab: (tab: ConsoleTab) => void;
  setProfile: (profile: 'Local-Dev' | 'Staging' | 'Production') => void;
  setActiveRole: (role: 'admin' | 'architect' | 'coder-agent' | 'qa-agent' | 'viewer') => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleNode: (nodeId: string) => void;
}

export const useHubStore = create<HubState>((set) => ({
  activeTab: 'overview',
  activeProfile: 'Local-Dev',
  activeRole: 'admin',
  commandPaletteOpen: false,
  connectedNodes: ['studio-api', 'event-bus', 'shared-db', 'identity-rbac', 'observability'],
  setActiveTab: (activeTab) => set({ activeTab }),
  setProfile: (activeProfile) => set({ activeProfile }),
  setActiveRole: (activeRole) => set({ activeRole }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  toggleNode: (nodeId) =>
    set((state) => ({
      connectedNodes: state.connectedNodes.includes(nodeId)
        ? state.connectedNodes.filter((id) => id !== nodeId)
        : [...state.connectedNodes, nodeId],
    })),
}));
