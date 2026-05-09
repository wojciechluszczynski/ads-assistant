# Ads Assistant

Dashboard do zarządzania kampaniami Google Ads z wbudowanym systemem oceny jakości ruchu (ICP scoring). Zaprojektowany dla performance marketerów prowadzących konta dla wielu klientów jednocześnie.

---

## Co to jest

Aplikacja React, która łączy dane kampanii z oceną dopasowania do profilu idealnego klienta (ICP Fit Score). Zamiast przeglądać surowe metryki w Google Ads, widzisz od razu które kampanie przyciągają właściwy ruch, a które przepalają budżet na słabej jakości leadach. Wbudowany asystent pozwala zadawać pytania o dane bez wychodzenia z panelu.

---

## Funkcje

- **Dashboard** — przegląd kluczowych metryk (impressions, CTR, ROAS, conversions) dla wszystkich kont
- **Kampanie** — lista z ICP Fit Score, statusem zmęczenia kreacji (Fatigue Score) i trendem CTR
- **Raporty** — performance w czasie, segmentacja wg etapu lejka (awareness / consideration / conversion)
- **Insights** — analiza segmentów ICP, identyfikacja kampanii poza targetem
- **Multi-account** — przełączanie między kontami klientów z jednego miejsca
- **Chat** — asystent do analizy danych kampanii bez wychodzenia z dashboardu

---

## Stack

| Warstwa | Technologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Style | CSS inline + własne klasy |

---

## Lokalne uruchomienie

```bash
npm install
npm run dev
```

Aplikacja startuje pod [http://localhost:5173](http://localhost:5173) z przykładowymi danymi kampanii.

---

## Struktura

```
src/
  components/    Sidebar, Chat, komponenty wspólne
  pages/         Dashboard, Campaigns, Reports, Insights, Settings, Login
  lib/           Typy TypeScript, dane demo, helpery
```
