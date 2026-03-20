import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatBubble from './components/ChatBubble';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Login from './pages/Login';
import type { Page, Account } from './lib/types';
import { MOCK_ACCOUNTS } from './lib/mockData';

export default function App() {
  const [authed, setAuthed]             = useState(false);
  const [page, setPage]                 = useState<Page>('dashboard');
  const [activeAccount, setActiveAccount] = useState<Account>(MOCK_ACCOUNTS[0]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F7F8FA' }}>
      <Sidebar
        page={page}
        onPage={setPage}
        accounts={MOCK_ACCOUNTS}
        activeAccount={activeAccount}
        onAccount={setActiveAccount}
        demoMode={true}
      />
      <main className="main-content" style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: '#F7F8FA' }}>
        {page === 'dashboard' && <Dashboard onPage={setPage} />}
        {page === 'campaigns' && <Campaigns />}
        {page === 'reports'   && <Reports />}
        {page === 'insights'  && <Insights onPage={setPage} />}
        {page === 'settings'  && <Settings />}
      </main>
      <ChatBubble />
    </div>
  );
}
