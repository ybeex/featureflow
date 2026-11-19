import { createContext, useContext, useState, type ReactNode } from 'react';
import { QuickView } from '../components/QuickView';
import type { SectionMeta } from '../registry/types';

const Ctx = createContext<(m: SectionMeta) => void>(() => {});
export const useQuickView = () => useContext(Ctx);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [meta, setMeta] = useState<SectionMeta | null>(null);
  return (
    <Ctx.Provider value={setMeta}>
      {children}
      <QuickView meta={meta} onClose={() => setMeta(null)} />
    </Ctx.Provider>
  );
}
