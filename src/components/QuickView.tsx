import { useEffect, useRef, useState } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { PreviewStage, DEFAULT_STAGE, type StageState } from './PreviewStage';
import type { SectionMeta } from '../registry/types';

/** Modal live preview: use a section's real interaction without leaving the gallery. */
export function QuickView({ meta, onClose }: { meta: SectionMeta | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<StageState>(DEFAULT_STAGE);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (meta && !d.open) { setState(DEFAULT_STAGE); d.showModal(); }
    if (!meta && d.open) d.close();
  }, [meta]);

  return (
    <dialog ref={ref} className="qv" aria-labelledby="qv-title" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {meta && (
        <>
          <div className="qv__head">
            <h2 id="qv-title">{meta.name}</h2>
            <a className="btn btn--sm btn--primary" href={`#/section/${meta.id}`} onClick={onClose}>Open playground <ExternalLink size={14} aria-hidden="true" /></a>
            <button className="btn btn--sm btn--icon" type="button" onClick={onClose} aria-label="Close preview"><X size={16} aria-hidden="true" /></button>
          </div>
          <div style={{ padding: 16 }}>
            <PreviewStage meta={meta} config={meta.defaults as never} state={state} onState={setState} />
          </div>
        </>
      )}
    </dialog>
  );
}
