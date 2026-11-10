import { useMemo, useState } from 'react'
import LaunchDrilldown from '../LaunchDrilldown/LaunchDrilldown'
import { sortLaunches } from '../../utils/sortLaunches'
import LaunchRow from './LaunchRow'
import SortButton from './SortButton'

const initialSort = { field: 'date', direction: 'desc' }

export default function LaunchesTable({ launches }) {
  const [sort, setSort] = useState(initialSort)
  const [selectedId, setSelectedId] = useState(null)

  const visibleLaunches = useMemo(
    () => sortLaunches(launches, sort),
    [launches, sort],
  )

  const selectedLaunch =
    launches.find((launch) => launch.id === selectedId) ?? null

  const handleSort = (field) => {
    setSort((current) => {
      if (current.field === field) {
        return {
          field,
          direction: current.direction === 'asc' ? 'desc' : 'asc',
        }
      }

      return { field, direction: field === 'date' ? 'desc' : 'asc' }
    })
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h2 className="text-lg font-semibold">Launches</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {visibleLaunches.length} launches in the current selection
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[54rem] text-left text-sm">
          <thead className="text-xs text-slate-500 dark:text-slate-400">
            <tr>
              <SortButton
                field="name"
                label="Launch"
                sort={sort}
                onSort={handleSort}
              />
              <SortButton
                field="agency"
                label="Agency"
                sort={sort}
                onSort={handleSort}
              />
              <th className="px-4 py-2 font-semibold uppercase">Rocket</th>
              <th className="px-4 py-2 font-semibold uppercase">Pad</th>
              <SortButton
                field="date"
                label="Date"
                sort={sort}
                onSort={handleSort}
              />
              <th className="px-4 py-2 font-semibold uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleLaunches.map((launch) => (
              <LaunchRow
                key={launch.id}
                launch={launch}
                isSelected={launch.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </tbody>
        </table>
      </div>

      {visibleLaunches.length === 0 ? (
        <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
          No launches match the current filters.
        </p>
      ) : null}

      <LaunchDrilldown
        launch={selectedLaunch}
        onClose={() => setSelectedId(null)}
      />
    </section>
  )
}
