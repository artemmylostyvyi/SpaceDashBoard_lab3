import { fetchLaunches } from '../api/launches'
import { useFetch } from './useFetch'

const currentYear = new Date().getUTCFullYear()

const emptyMeta = {
  year: currentYear,
  completedThisYear: 0,
  upcomingThisYear: 0,
}

export function useLaunches(params) {
  const { data, loading, error, retry } = useFetch(fetchLaunches, params)

  const launches = data?.launches ?? []
  const upcomingLaunches = data?.upcomingLaunches ?? []
  const previousLaunches = data?.previousLaunches ?? []
  const meta = data?.meta ?? emptyMeta

  let status = 'loading'

  if (error) {
    status = 'error'
  } else if (!loading) {
    status = launches.length === 0 ? 'empty' : 'success'
  }

  return {
    status,
    launches,
    upcomingLaunches,
    previousLaunches,
    meta,
    error,
    retry,
  }
}
