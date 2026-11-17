# React 19 / 18 Cheatsheet

## Zustand State Slice
```typescript
import { create } from 'zustand';

interface SessionState {
  user: string | null;
  login: (u: string) => void;
  logout: () => void;
}

export const useSession = create<SessionState>((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}));
```

## TanStack Query Hook
```typescript
import { useQuery } from '@tanstack/react-query';

export function useClusterHealth() {
  return useQuery({
    queryKey: ['cluster-health'],
    queryFn: async () => {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
    refetchInterval: 10000
  });
}
```
