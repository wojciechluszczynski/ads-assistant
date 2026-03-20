import { useState } from 'react';
import TopNav from './components/TopNav';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Campaigns from './pages/Campaigns';
import Reports from './pages/Reports';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import Login from './pages/Login';
import type { Page, Account } from './lib/types';
import { MOCK_ACCOUNTS } from './lib/mockData';

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [page, setPage]     = useState<Page>('dashboard');
  const [activeAccount, setActiveAccount] = useState<Account>(MOCK_ACCOUNTS[0]);

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div>
      <TopNav
        page={page}
        onPage={setPage}
        accounts={MOCK_ACCOUNTS}
        activeAccount={activeAccount}
        onAccount={setActiveAccount}
        demoMode={true}
      />
      <main>
        {page === 'dashboard' && <Dashboard onPage={setPage} />}
        {page === 'chat'      && <Chat />}
        {page === 'campaigns' && <Campaigns />}
        {page === 'reports'   && <Reports />}
        {page === 'insights'  && <Insights onPage={setPage} />}
        {page === 'settings'  && <Settings />}
      </main>
    </div>
  );
}
