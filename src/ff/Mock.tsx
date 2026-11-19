import type { CSSProperties, ReactNode } from 'react';
import './mock.css';

export type MockVariant = 'dashboard' | 'editor' | 'chat' | 'analytics' | 'kanban';

export function BrowserFrame({ title = 'app.example.com', children, className, style }: { title?: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`ff-mock-frame ${className ?? ''}`} style={style}>
      <div className="ff-mock-bar" aria-hidden="true">
        <span /><span /><span />
        <em>{title}</em>
      </div>
      <div className="ff-mock-body">{children}</div>
    </div>
  );
}

const bars = [38, 64, 46, 82, 58, 90, 72, 100, 66, 84];

function Dashboard() {
  return (
    <div className="ff-mock ff-mock--dashboard">
      <aside>{[0, 1, 2, 3, 4].map((i) => <i key={i} data-on={i === 1 || undefined} />)}</aside>
      <main>
        <div className="ff-mock-stats">
          {['Revenue', 'Active', 'Churn'].map((t, i) => (
            <div key={t}><small>{t}</small><b>{['$48.2k', '2,914', '1.8%'][i]}</b></div>
          ))}
        </div>
        <div className="ff-mock-chart">
          <svg viewBox="0 0 200 60" preserveAspectRatio="none"><path d="M0 48 C20 40 30 52 50 34 S90 30 110 22 S160 28 200 6" fill="none" stroke="var(--ff-accent,#ff6a3d)" strokeWidth="2" /><path d="M0 48 C20 40 30 52 50 34 S90 30 110 22 S160 28 200 6 L200 60 L0 60Z" fill="var(--ff-accent,#ff6a3d)" opacity=".12" /></svg>
        </div>
        <div className="ff-mock-rows">{[0, 1, 2].map((i) => <p key={i}><i /><span /><em /></p>)}</div>
      </main>
    </div>
  );
}

function Editor() {
  const lines = [30, 55, 42, 70, 36, 62, 48, 26, 58, 40];
  return (
    <div className="ff-mock ff-mock--editor">
      <aside>{[0, 1, 2, 3, 4, 5].map((i) => <p key={i} style={{ width: `${50 + ((i * 17) % 40)}%` }} />)}</aside>
      <main>{lines.map((w, i) => <p key={i}><b>{i + 1}</b><span style={{ width: `${w}%`, background: i % 3 === 0 ? 'var(--ff-accent,#ff6a3d)' : undefined }} /><span style={{ width: `${(w * 0.6) | 0}%` }} /></p>)}</main>
    </div>
  );
}

function Chat() {
  return (
    <div className="ff-mock ff-mock--chat">
      {[false, true, false, true].map((mine, i) => (
        <p key={i} data-mine={mine || undefined} style={{ width: `${38 + ((i * 19) % 34)}%` }} />
      ))}
      <footer><span /></footer>
    </div>
  );
}

function Analytics() {
  return (
    <div className="ff-mock ff-mock--analytics">
      <div className="ff-mock-cols">{bars.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
      <svg viewBox="0 0 42 42" className="ff-mock-donut"><circle cx="21" cy="21" r="15.9" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="6" /><circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--ff-accent,#ff6a3d)" strokeWidth="6" strokeDasharray="64 36" transform="rotate(-90 21 21)" /></svg>
    </div>
  );
}

function Kanban() {
  return (
    <div className="ff-mock ff-mock--kanban">
      {[3, 2, 4].map((n, c) => (
        <div key={c}><small /> {Array.from({ length: n }, (_, i) => <p key={i} style={{ height: `${26 + ((i * 11 + c * 7) % 20)}px` }} />)}</div>
      ))}
    </div>
  );
}

const MAP: Record<MockVariant, () => ReactNode> = { dashboard: Dashboard, editor: Editor, chat: Chat, analytics: Analytics, kanban: Kanban };

/** A stylised product screenshot built from markup, so it scales crisply and never fails to load. */
export function MockUI({ variant = 'dashboard', label, className, style }: { variant?: MockVariant; label?: string; className?: string; style?: CSSProperties }) {
  const Body = MAP[variant];
  return (
    <div className={`ff-mock-root ${className ?? ''}`} style={style} role="img" aria-label={label ?? `Illustration of a ${variant} interface`}>
      <Body />
    </div>
  );
}
