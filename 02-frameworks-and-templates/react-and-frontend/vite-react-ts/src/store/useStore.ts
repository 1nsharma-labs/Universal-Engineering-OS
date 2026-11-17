import { create } from 'zustand';

interface HubState {
  connectedNodes: string[];
  activeProfile: string;
  toggleNode: (nodeId: string) => void;
  setProfile: (profile: string) => void;
}

export const useHubStore = create<HubState>((set) => ({
  connectedNodes: ['spring-api', 'fastapi', 'postgres'],
  activeProfile: 'Local-Dev',
  toggleNode: (nodeId) =>
    set((state) => ({
      connectedNodes: state.connectedNodes.includes(nodeId)
        ? state.connectedNodes.filter((id) => id !== nodeId)
        : [...state.connectedNodes, nodeId]
    })),
  setProfile: (activeProfile) => set({ activeProfile })
}));
