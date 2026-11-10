import { Controller } from 'react-hook-form'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'success', label: 'Successful' },
  { value: 'failure', label: 'Failed' },
]

const AGENCY_OPTIONS = [
  { value: 'all', label: 'All agencies' },
  { value: 'SpaceX', label: 'SpaceX' },
  { value: 'National Aeronautics and Space Administration', label: 'NASA' },
  { value: 'Russian Federal Space Agency (ROSCOSMOS)', label: 'Roscosmos' },
  { value: 'China National Space Administration', label: 'CNSA' },
  { value: 'European Space Agency', label: 'ESA' },
  { value: 'Japan Aerospace Exploration Agency', label: 'JAXA' },
  { value: 'United Launch Alliance', label: 'ULA' },
  { value: 'Rocket Lab', label: 'Rocket Lab' },
  { value: 'Blue Origin', label: 'Blue Origin' },
  { value: 'Indian Space Research Organization', label: 'ISRO' },
]

const LIMIT_OPTIONS = [
  { value: '10', label: '10 results' },
  { value: '25', label: '25 results' },
  { value: '50', label: '50 results' },
  { value: '100', label: '100 results' },
]

const inputClassName =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

const labelClassName =
  'text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400'

function TextField({ control, name, label, type = 'text', placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <input
            {...field}
            type={type}
            placeholder={placeholder}
            autoComplete="off"
            className={inputClassName}
          />
        )}
      />
    </label>
  )
}

function SelectField({ control, name, label, options }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClassName}>{label}</span>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select {...field} className={inputClassName}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </label>
  )
}

export default function FilterPanel({ control, onReset }) {
  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Filters & search</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Changes are applied automatically after a short delay.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Reset filters
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <TextField
          control={control}
          name="search"
          label="Search"
          placeholder="Launch, rocket, pad, mission..."
        />
        <SelectField
          control={control}
          name="status"
          label="Status"
          options={STATUS_OPTIONS}
        />
        <SelectField
          control={control}
          name="agency"
          label="Agency"
          options={AGENCY_OPTIONS}
        />
        <TextField control={control} name="from" label="Date from" type="date" />
        <TextField control={control} name="to" label="Date to" type="date" />
        <SelectField
          control={control}
          name="limit"
          label="Limit"
          options={LIMIT_OPTIONS}
        />
      </div>
    </form>
  )
}
