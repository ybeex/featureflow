import { useId } from 'react';
import type { ConfigRecord, ConfigValue, ControlDef, ControlGroup } from '../registry/types';

const GROUP_LABEL: Record<ControlGroup, string> = { layout: 'Layout', style: 'Style', motion: 'Motion' };
const fmt = (v: number, step: number) => (step < 1 ? v.toFixed(String(step).split('.')[1]?.length ?? 2) : String(v));

function Control({ def, value, onChange }: { def: ControlDef; value: ConfigValue; onChange: (v: ConfigValue) => void }) {
  const id = useId();
  const hint = def.hint ? <p className="ctl__hint" id={`${id}-h`}>{def.hint}</p> : null;
  const describedBy = def.hint ? `${id}-h` : undefined;

  if (def.type === 'range') {
    const n = Number(value);
    return (
      <div className="ctl">
        <label className="ctl__row" htmlFor={id}><span>{def.label}</span><output className="ctl__val" htmlFor={id}>{fmt(n, def.step)}{def.unit ?? ''}</output></label>
        <input id={id} type="range" min={def.min} max={def.max} step={def.step} value={n} aria-describedby={describedBy} onChange={(e) => onChange(Number(e.target.value))} />
        {hint}
      </div>
    );
  }
  if (def.type === 'color') {
    const s = String(value);
    return (
      <div className="ctl">
        <label className="ctl__row" htmlFor={id}><span>{def.label}</span></label>
        <div className="ctl__color">
          <input id={id} type="color" value={s} onChange={(e) => onChange(e.target.value)} aria-label={`${def.label} picker`} />
          <input type="text" value={s} spellCheck={false} aria-label={`${def.label} hex value`} onChange={(e) => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) onChange(e.target.value.toLowerCase()); }} />
        </div>
        {hint}
      </div>
    );
  }
  if (def.type === 'select') {
    return (
      <div className="ctl">
        <label className="ctl__row" htmlFor={id}><span>{def.label}</span></label>
        <select id={id} value={String(value)} aria-describedby={describedBy} onChange={(e) => onChange(e.target.value)}>
          {def.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {hint}
      </div>
    );
  }
  return (
    <div className="ctl">
      <div className="switch">
        <span id={`${id}-l`}>{def.label}</span>
        <button type="button" role="switch" aria-checked={Boolean(value)} aria-labelledby={`${id}-l`} aria-describedby={describedBy} onClick={() => onChange(!value)} />
      </div>
      {hint}
    </div>
  );
}

export interface ControlsProps { controls: ControlDef[]; values: ConfigRecord; onChange: (key: string, v: ConfigValue) => void }

/** Renders only the controls the section declares, grouped Layout / Style / Motion. */
export function Controls({ controls, values, onChange }: ControlsProps) {
  const groups = (['layout', 'style', 'motion'] as ControlGroup[]).map((g) => ({ g, items: controls.filter((c) => c.group === g) })).filter((x) => x.items.length);
  return (
    <>
      {groups.map(({ g, items }) => (
        <div className="panel__sec" key={g} role="group" aria-label={`${GROUP_LABEL[g]} controls`}>
          <div className="panel__h">{GROUP_LABEL[g]}</div>
          {items.map((def) => <Control key={def.key} def={def} value={values[def.key]} onChange={(v) => onChange(def.key, v)} />)}
        </div>
      ))}
    </>
  );
}
