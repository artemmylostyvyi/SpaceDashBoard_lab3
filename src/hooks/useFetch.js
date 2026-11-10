import { useCallback, useEffect, useState } from 'react'

export function useFetch(fetcher, params = {}, { enabled = true } = {}) {
  const [requestKey, setRequestKey] = useState(0)
  const [result, setResult] = useState({
    key: null,
    data: null,
    error: null,
  })

  const paramsKey = JSON.stringify(params)
  const requestId = `${paramsKey}::${requestKey}`
  const loading = enabled && result.key !== requestId
  const error = loading ? null : result.error

  const retry = useCallback(() => {
    setRequestKey((current) => current + 1)
  }, [])

  useEffect(() => {
    if (!enabled) return undefined

    const controller = new AbortController()
    let isActive = true

    async function load() {
      try {
        const data = await fetcher(params, { signal: controller.signal })
        if (!isActive) return
        setResult({ key: requestId, data, error: null })
      } catch (error) {
        if (!isActive || error?.name === 'AbortError') return
        setResult({
          key: requestId,
          data: null,
          error: error?.message ?? 'Unknown request error',
        })
      }
    }

    load()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [fetcher, params, requestId, enabled])

  return {
    data: result.data,
    loading,
    error,
    retry,
  }
}
