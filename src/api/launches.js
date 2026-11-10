const DEFAULT_API_BASE_URL = 'https://lldev.thespacedevs.com/2.3.0'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, '')

const STATUS_CATEGORY_IDS = {
  upcoming: [1, 2, 5, 6, 8],
  success: [3],
  failure: [4, 7],
}

function getStatusCategory(status) {
  const label = `${status?.name ?? ''} ${status?.abbrev ?? ''}`.toLowerCase()

  if (label.includes('success')) return 'success'
  if (label.includes('fail')) return 'failure'
  if (
    label.includes('go') ||
    label.includes('flight') ||
    label.includes('confirm') ||
    label.includes('determin') ||
    label.includes('hold') ||
    label.includes('preparation')
  ) {
    return 'upcoming'
  }

  return 'unknown'
}

function normalizeLaunch(raw) {
  return {
    id: raw.id,
    name: raw.name ?? 'Unknown launch',
    date: raw.net ?? null,
    agency: raw.launch_service_provider?.name ?? 'Unknown agency',
    rocket:
      raw.rocket?.configuration?.full_name ??
      raw.rocket?.configuration?.name ??
      'Unknown rocket',
    pad: raw.pad?.name ?? 'Unknown pad',
    location: raw.pad?.location?.name ?? 'Unknown location',
    status: raw.status?.name ?? 'Unknown status',
    statusCategory: getStatusCategory(raw.status),
    missionType: raw.mission?.type ?? 'Unknown type',
    orbit: raw.mission?.orbit?.name ?? 'Unknown orbit',
    description: raw.mission?.description ?? '',
    windowStart: raw.window_start ?? null,
    windowEnd: raw.window_end ?? null,
  }
}

async function requestJson(path, signal) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error(
      'Could not reach the launch API. Check your connection and try again.',
    )
  }

  if (!response.ok) {
    throw new Error(`The launch API responded with status ${response.status}.`)
  }

  return response.json()
}

function dedupeById(launches) {
  return [...new Map(launches.map((launch) => [launch.id, launch])).values()]
}

function buildQuery(params, ordering) {
  const query = new URLSearchParams({
    limit: String(params.limit ?? 50),
    mode: 'normal',
    ordering,
  })

  const search = params.search?.trim()
  if (search) query.set('search', search)

  if (params.agency && params.agency !== 'all') {
    query.set('lsp__name', params.agency)
  }

  const statusIds = STATUS_CATEGORY_IDS[params.status]
  if (statusIds) query.set('status__ids', statusIds.join(','))

  if (params.from) query.set('net__gte', `${params.from}T00:00:00Z`)
  if (params.to) query.set('net__lte', `${params.to}T23:59:59Z`)

  return query
}

export async function fetchLaunches(params = {}, { signal } = {}) {
  const year = new Date().getUTCFullYear()
  const upcomingQuery = buildQuery(params, 'net')
  const previousQuery = buildQuery(params, '-net')

  const [upcomingPayload, previousPayload] = await Promise.all([
    requestJson(`/launches/upcoming/?${upcomingQuery}`, signal),
    requestJson(`/launches/previous/?${previousQuery}`, signal),
  ])

  const upcomingLaunches = (upcomingPayload.results ?? []).map(normalizeLaunch)
  const previousLaunches = (previousPayload.results ?? []).map(normalizeLaunch)

  return {
    launches: dedupeById([...previousLaunches, ...upcomingLaunches]),
    upcomingLaunches,
    previousLaunches,
    meta: {
      year,
      completedThisYear: previousPayload.count ?? previousLaunches.length,
      upcomingThisYear: upcomingPayload.count ?? upcomingLaunches.length,
    },
  }
}
