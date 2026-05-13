import { apiPath } from '../config/api'

export async function requestJson(path, options = {}) {
  const response = await fetch(apiPath(path), options)
  const contentType = response.headers.get('content-type') || ''

  let payload = null
  if (contentType.includes('application/json')) {
    payload = await response.json()
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return payload
}