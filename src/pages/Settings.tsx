import { C, card } from '../lib/theme';
import { Key, Shield, Zap, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SettingRow {
  key: string;
  label: string;
  description: string;
  placeholder: string;
  isSecret?: boolean;
  docUrl?: string;
}

const SETTINGS: SettingRow[] = [
  {
    key: 'ANTHROPIC_API_KEY',
    label: 'Anthropic API Key',
    description: 'Klucz API do Claude (Opus/Sonnet). Pobierz na console.anthropic.com',
    placeholder: 'sk-ant-api03-...',
    isSecret: true,
    docUrl: 'https://console.anthropic.com/keys',
  },
  {
    key: 'GOOGLE_ADS_DEVELOPER_TOKEN',
    label: 'Google Ads Developer Token',
    description: 'Token dewelopera z Twojego konta Google Ads → Narzędzia → API Center',
    placeholder: 'ABcDefGhIjKlMnOpQr...',
    isSecret: true,
    docUrl: 'https://developers.google.com/google-ads/api/docs/first-call/dev-token',
  },
  {
    key: 'GOOGLE_CLIENT_ID',
    label: 'Google OAuth Client ID',
    description: 'Z Google Cloud Console → APIs & Services → Credentials',
    placeholder: '123456789-abc.apps.googleusercontent.com',
    docUrl: 'https://console.cloud.google.com/apis/credentials',
  },
  {
    key: 'GOOGLE_CLIENT_SECRET',
    label: 'Google OAuth Client Secret',
    description: 'Client Secret z tych samych credentials co Client ID',
    placeholder: 'GOCSPX-...',
    isSecret: true,
  },
  {
    key: 'GOOGLE_REFRESH_TOKEN',
    label: 'Google Refresh Token',
    description: 'Refresh Token uzyskany przez OAuth flow. Uruchom skrypt w projekcie: npm run get-token',
    placeholder: '1//04...',
    isSecret: true,
  },
  {
    key: 'GOOGLE_ADS_CUSTOMER_ID',
    label: 'Google Ads Customer ID',
    description: 'Numer klienta bez myślników (np. 1234567890)',
    placeholder: '1234567890',
  },
  {
    key: 'APP_PASSWORD',
    label: 'Hasło do aplikacji',
    description: 'Hasło do logowania do panelu AdsAI',
    placeholder: '••••••••',
    isSecret: true,
  },
];

const SETUP_STEPS = [
  {
    num: 1,
    title: 'Utwórz projekt w Google Cloud Console',
    steps: [
      'Wejdź na console.cloud.google.com',
      'Kliknij "Nowy projekt" → nazwij go np. "AdsAI"',
      'Włącz API: wyszukaj "Google Ads API" → Enable',
    ],
    url: 'https://console.cloud.google.com',
  },
  {
    num: 2,
    title: 'Utwórz OAuth 2.0 Credentials',
    steps: [
      'APIs & Services → Credentials → + Create Credentials → OAuth 2.0 Client ID',
      'Application type: "Desktop app"',
      'Skopiuj Client ID i Client Secret',
    ],
    url: 'https://console.cloud.google.com/apis/credentials',
  },
  {
    num: 3,
    title: 'Pobierz Developer Token z Google Ads',
    steps: [
      'Zaloguj się do Google Ads (konto Manager lub standardowe)',
      'Narzędzia i ustawienia → Konfiguracja → API Center',
      'Skopiuj Developer Token (lub złóż wniosek o Basic Access)',
    ],
    url: 'https://ads.google.com/aw/apicenter',
  },
  {
    num: 4,
    title: 'Wygeneruj Refresh Token',
    steps: [
      'W terminalu projektu: npm run get-token',
      'Zaloguj się na konto Google Ads w przeglądarce',
      'Skopiuj Refresh Token z konsoli',
    ],
  },
  {
    num: 5,
    title: 'Dodaj zmienne w Netlify',
    steps: [
      'Netlify → Site Configuration → Environment Variables',
      'Dodaj wszystkie klucze z tabeli poniżej',
      'Kliknij "Trigger deploy" — aplikacja połączy się z prawdziwymi danymi',
    ],
    url: 'https://app.netlify.com',
  },
];

export default function Settings() {
  const [copied, setCopied] = useState('');

  function copyKey(key: string) {
    navigator.clipboard.writeText(key).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(''), 2000);
    });
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>Ustawienia</h1>
        <p style={{ color: C.text3, fontSize: 13, margin: '4px 0 0' }}>Konfiguracja połączeń z Google Ads API i Claude</p>
      </div>

      {/* Demo mode banner */}
      <div style={{
        ...card, marginBottom: 24,
        padding: '14px 18px',
        background: C.orangeBg,
        border: `1px solid rgba(245,158,11,0.30)`,
        display: 'flex', alignItems: 'center', gap: 12,
        borderRadius: 12,
      }}>
        <AlertCircle size={18} color={C.orange} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#92400E' }}>Tryb DEMO aktywny</div>
          <div style={{ fontSize: 12, color: '#78350F' }}>
            Aplikacja działa na mock danych. Aby połączyć z prawdziwym kontem Google Ads, dodaj zmienne środowiskowe w Netlify.
          </div>
        </div>
      </div>

      {/* Setup guide */}
      <div style={{ ...card, marginBottom: 24, padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Zap size={18} color={C.accent} />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Przewodnik konfiguracji (5 kroków)
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SETUP_STEPS.map(step => (
            <div key={step.num} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: C.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 12, color: '#fff',
                boxShadow: `0 2px 6px ${C.glow}`,
              }}>{step.num}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {step.title}
                  {step.url && (
                    <a href={step.url} target="_blank" rel="noreferrer" style={{
                      fontSize: 11, color: C.accent, display: 'flex', alignItems: 'center', gap: 3,
                      fontWeight: 600,
                    }}>
                      Otwórz <ExternalLink size={11} />
                    </a>
                  )}
                </div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {step.steps.map((s, i) => (
                    <li key={i} style={{ fontSize: 13, color: C.text2, marginBottom: 3 }}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Env vars table */}
      <div style={{ ...card, padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <Key size={18} color={C.navy} />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Zmienne środowiskowe (Netlify)
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SETTINGS.map(s => (
            <div key={s.key} style={{
              padding: '14px 16px', borderRadius: 10,
              background: C.subtle, border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 12, fontWeight: 700, color: C.accent, fontFamily: 'monospace' }}>{s.key}</code>
                  {s.isSecret && <Shield size={12} color={C.text3} />}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {s.docUrl && (
                    <a href={s.docUrl} target="_blank" rel="noreferrer" style={{
                      fontSize: 11, color: C.navyLight, display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600,
                    }}>
                      Docs <ExternalLink size={10} />
                    </a>
                  )}
                  <button onClick={() => copyKey(s.key)} style={{
                    background: 'none', border: 'none',
                    color: copied === s.key ? C.accent : C.text3,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 600,
                  }}>
                    {copied === s.key ? <CheckCircle size={12} /> : <Copy size={12} />}
                    {copied === s.key ? 'Skopiowano' : 'Kopiuj'}
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 6 }}>{s.description}</div>
              <code style={{ fontSize: 11, color: C.text3, fontFamily: 'monospace' }}>{s.placeholder}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
