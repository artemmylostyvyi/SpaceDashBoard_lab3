# Space Launches Dashboard

Lab 3 for the KOP course: a React + Vite dashboard that loads real launch data
from [The Space Devs Launch Library 2](https://thespacedevs.com/llapi) API.

## Features

- Controlled filter form built with `react-hook-form`
- Search plus status, agency, date range and limit filters
- Debounced API requests through a reusable `useDebounce` hook
- Reusable `useFetch` hook with `data` / `loading` / `error` / `retry`
- Explicit `loading` / `error` / `empty` states, with a retry button
- Sortable table (launch name, agency, date) and launch drilldown
- KPI cards derived from the current selection (nearest launch, launches this
  year, success rate)
- Agency chart derived from the current selection
- Dark / light theme

## API

The base URL is configured through `VITE_API_BASE_URL` and defaults to the
development endpoint:

```
https://lldev.thespacedevs.com/2.3.0
```

To use production, create `.env` from `.env.example` and set:

```
VITE_API_BASE_URL=https://ll.thespacedevs.com/2.3.0
```

Production is rate-limited to 15 anonymous requests per hour; development has
no rate limits but may return limited or stale data.

Filters are sent to the LL2 API using `search`, `status__ids`, `lsp__name`,
`net__gte`, `net__lte`, `ordering` and `limit`.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Structure

```
src/
  api/launches.js             # API requests, filter query params, normalization
  hooks/useDebounce.js        # reusable input delay
  hooks/useFetch.js           # reusable request lifecycle
  hooks/useLaunches.js        # useFetch + launch-specific state mapping
  utils/                      # KPI/agency/sort/date helpers
  components/FilterPanel/     # controlled filter form
  components/                 # presentational widgets
  App.jsx                     # container: form, debounced params, data, theme
```
