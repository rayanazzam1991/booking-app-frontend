/**
 * Booking Feature — Appointment Store
 *
 * Canonical implementation moved from `app/stores/appointmentStore.ts` as
 * part of Step 4 (migrate-booking-logic).  The legacy file is now a re-export
 * shim.
 */
import type { ApiResponse } from '../../../../shared/types/api'
import { useApi } from '../../../composables/useApi'

export const useAppointmentStore = defineStore('appointment-store', () => {
  const { directApi } = useApi()
  const config = useRuntimeConfig().public

  async function bookAppointment(request: any) {
    console.log(`${config.BASE_API_URL}/appointment`)
    await directApi.post<ApiResponse<any>>('/appointment', { ...request })
  }

  return {
    bookAppointment,
  }
})

