/**
 * Shared in-memory fixtures for the booking-flow test suite.
 *
 * These are pure data objects — no framework imports. Each test file
 * imports what it needs from here so fixtures stay consistent across suites.
 */
import type { Service } from '../../shared/types/service'
import type { HealthProfessional } from '../../shared/types/healthProfessional'
import type { ApiResponse } from '../../shared/types/api'

// ---------------------------------------------------------------------------
// Domain fixtures
// ---------------------------------------------------------------------------

export const SERVICES: Service[] = [
  { id: 1, name: 'General Consultation', price: 100 },
  { id: 2, name: 'Dental Checkup', price: 80 },
]

export const PROFESSIONALS: HealthProfessional[] = [
  {
    id: 10,
    name: 'Dr. Jane Smith',
    license_number: 'LIC-001',
    speciality: 'General Practice',
    pivot: { duration_minutes: 30, price: 100, notes: '', status: 'active' },
  },
]

// ---------------------------------------------------------------------------
// Response builders
// ---------------------------------------------------------------------------

/** Wrap arbitrary data in the API envelope. */
export function apiOk<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    error_code: 0,
    message: 'OK',
    data,
    pagination: { total: 1, count: 1, per_page: 10, page: 1, max_page: 1 },
  }
}

/** Build a successful fetch Response with JSON body. */
export function okResponse(data: unknown): Response {
  return new Response(JSON.stringify(apiOk(data)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** Build a failed fetch Response (non-2xx) — HttpClient will throw the body. */
export function errorResponse(message: string, status = 422): Response {
  return new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

