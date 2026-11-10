import { useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import DashboardView from './components/DashboardView/DashboardView'
import FilterPanel from './components/FilterPanel/FilterPanel'
import DashboardLayout from './components/layout/DashboardLayout'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import { useDebounce } from './hooks/useDebounce'
import { useLaunches } from './hooks/useLaunches'
import { deriveAgencies } from './utils/deriveAgencies'
import { deriveKpis } from './utils/deriveKpis'

const currentYear = new Date().getUTCFullYear()

const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  agency: 'all',
  from: `${currentYear}-01-01`,
  to: `${currentYear}-12-31`,
  limit: '50',
}

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const { control, reset } = useForm({ defaultValues: DEFAULT_FILTERS })
  const formValues = useWatch({ control }) ?? {}

  const search = formValues.search ?? DEFAULT_FILTERS.search
  const statusFilter = formValues.status ?? DEFAULT_FILTERS.status
  const agency = formValues.agency ?? DEFAULT_FILTERS.agency
  const from = formValues.from ?? DEFAULT_FILTERS.from
  const to = formValues.to ?? DEFAULT_FILTERS.to
  const limit = formValues.limit ?? DEFAULT_FILTERS.limit

  const params = useMemo(
    () => ({
      search: search.trim(),
      status: statusFilter,
      agency,
      from,
      to,
      limit: Number(limit),
    }),
    [search, statusFilter, agency, from, to, limit],
  )

  const debouncedParams = useDebounce(params, 400)

  const {
    status,
    launches,
    upcomingLaunches,
    previousLaunches,
    meta,
    error,
    retry,
  } = useLaunches(debouncedParams)

  const kpis = useMemo(
    () => deriveKpis({ upcomingLaunches, previousLaunches, meta }),
    [upcomingLaunches, previousLaunches, meta],
  )

  const agencies = useMemo(() => deriveAgencies(launches), [launches])

  return (
    <div className={isDark ? 'dark' : ''}>
      <DashboardLayout
        title="Space Launches Dashboard"
        subtitle="Lab 3 — controlled filters with debounced API requests"
        actions={
          <ThemeToggle
            isDark={isDark}
            onToggle={() => setIsDark((current) => !current)}
          />
        }
      >
        <FilterPanel control={control} onReset={() => reset(DEFAULT_FILTERS)} />

        <DashboardView
          status={status}
          launches={launches}
          kpis={kpis}
          agencies={agencies}
          error={error}
          onRetry={retry}
        />
      </DashboardLayout>
    </div>
  )
}
