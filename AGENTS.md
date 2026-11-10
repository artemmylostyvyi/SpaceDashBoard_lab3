# AGENTS.md

## Project

Space Launches Dashboard — lab 3 (KOP course). React + Vite SPA that loads real
launch data from The Space Devs Launch Library 2 (LL2) API. Continues lab 2 by
adding a controlled filter/search form, debounced requests and reusable custom
hooks.

## Domain

- Launch: name, date (NET), agency, rocket, launch pad, location, status,
  mission type, orbit
- Agency: name, launch count (derived from the current selection)
- KPIs: nearest launch, launches this year, success rate
- Drilldown: launch -> rocket, pad, location, status, mission details

## API

- Base URL comes from `VITE_API_BASE_URL`, default
  `https://lldev.thespacedevs.com/2.3.0` (development endpoint, no rate limits).
- Production `https://ll.thespacedevs.com/2.3.0` is rate-limited to 15
  anonymous requests per hour and allows CORS (`*`).
- Endpoints used:
  - `GET /launches/upcoming/?<filters>`
  - `GET /launches/previous/?<filters>`
- Server-side filters: `search`, `status__ids`, `lsp__name`, `net__gte`,
  `net__lte`, `ordering`, `limit`.
- All data access lives in `src/api/launches.js`; request lifecycle lives in
  `src/hooks/useFetch.js` and `src/hooks/useLaunches.js`. Never fetch inside
  presentational components.

## Stack

- Vite + React (JavaScript, no TypeScript)
- Tailwind CSS
- react-hook-form
- No chart library; simple CSS bar chart

## Commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Structure

```
src/
  main.jsx
  App.jsx
  index.css
  api/launches.js
  hooks/useDebounce.js
  hooks/useFetch.js
  hooks/useLaunches.js
  utils/formatDate.js
  utils/deriveKpis.js
  utils/deriveAgencies.js
  utils/sortLaunches.js
  components/
    layout/DashboardLayout.jsx
    DashboardView/DashboardView.jsx
    FilterPanel/FilterPanel.jsx
    KpiCard/KpiCard.jsx
    ThemeToggle/ThemeToggle.jsx
    QueryState/QueryState.jsx
    LaunchesTable/LaunchesTable.jsx
    LaunchesTable/SortButton.jsx
    LaunchesTable/LaunchRow.jsx
    LaunchDrilldown/LaunchDrilldown.jsx
    AgencyChart/AgencyChart.jsx
```

## Conventions

- Container / presentational split: `App.jsx` wires the form and hooks; widgets
  receive plain props and never fetch.
- All form fields are controlled through `react-hook-form` `Controller`
  (`value + onChange`); form state is the single source of truth.
- `useDebounce(value, delay)` is generic and returns the delayed value.
- `useFetch(fetcher, params)` is generic and returns `{ data, loading, error,
  retry }`.
- Side effects only in `useEffect`; every request uses `AbortController` and
  ignores `AbortError` so StrictMode remounts are safe.
- Request state is explicit: `loading` / `error` / `empty` / `success`.
- Derived state via `useMemo`: filtering and sorting never mutate the original
  array (`filter`, `[...launches].sort`).
- Sorting supports at least `name`, `date`, `agency` with a direction toggle.
- Stable `key` from `launch.id`, never array index.
- Immutable updates only (`map`/`filter`/`spread`), never mutate arrays/objects.
- Reset returns the form to its initial values and triggers a debounced request.
- Callbacks passed as props (`onSelect`, `onSort`, `onReset`, `onRetry`).
- All UI labels in English; Tailwind utilities only; no design system.

## Widgets

- `FilterPanel` — controlled search/status/agency/date/limit form
- `KpiCard` — reusable, rendered 3x with derived KPI props
- `QueryState` — loading / error / empty states with retry
- `LaunchesTable` + `SortButton` + `LaunchRow` + `LaunchDrilldown`
- `AgencyChart` — launches per agency (CSS bars)
- `ThemeToggle` — local theme state + conditional rendering

## Non-goals (lab 3)

- Auth, routing, persistence, tests
- Premature abstraction or global state libraries
- Chart libraries
