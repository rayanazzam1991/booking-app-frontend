// src/composables/useAppointmentForm.ts
import { ref, onMounted, watch } from 'vue'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { storeToRefs } from 'pinia'
import { useToast } from './useToast' // Adjust path

// --- Zod Validation Schema ---
const appointmentSchema = z.object({
    service_id: z.string().min(1, 'Please select a service.'),
    health_professional_id: z.string().min(1, 'Please select a health professional.'),
    date: z.string().min(1, 'Please choose a date and time.').refine(
        (val) => !isNaN(new Date(val).getTime()),
        { message: "Invalid date format." }
    ),
    customer_email: z.string().min(1, 'Email is required.').email('Invalid email format.'),
})

type AppointmentForm = z.infer<typeof appointmentSchema>

export function useAppointmentForm() {
    const serviceStore = useServiceStore()
    const appointmentStore = useAppointmentStore()
    const { successToast, errorToast } = useToast()

    const initialForm: AppointmentForm = {
        service_id: '',
        health_professional_id: '',
        date: '',
        customer_email: '',
    }

    const { handleSubmit, isSubmitting, setFieldError, values, resetForm } = useForm<AppointmentForm>({
        validationSchema: toTypedSchema(appointmentSchema),
        initialValues: initialForm
    })

    // Store State
    const { getServices: services, getServiceProfessionals: professionals } = storeToRefs(serviceStore)
    const { fetchServices, fetchServiceProfessionals, setServiceProfessionals } = serviceStore


    // Component State
    const generalError = ref<string>('')
    const showSuccessState = ref<boolean>(false)
    const isCelebrating = ref<boolean>(false)

    // --- Data Fetching ---
    onMounted(async () => {
        await fetchServices()
    })

    // Watch the service_id field to trigger the professional fetch
    watch(() => values.service_id, async (newServiceId) => {
        // Reset dependent fields and state
        setFieldError('health_professional_id', undefined)
        values.health_professional_id = ''
        values.date = ''
        values.customer_email = ''
        setServiceProfessionals([]) // Immediately reset for cleaner UI update
        generalError.value = ''

        if (!newServiceId) return

        try {
            await fetchServiceProfessionals(Number(newServiceId))
        } catch (error) {
            console.error('Error fetching professionals:', error)
            setServiceProfessionals([])
            errorToast('Failed to load professionals for this service.')
        }
    }, { immediate: false })

    // Enhanced reset function with animation and delay
    const resetFormWithAnimation = async () => {
        showSuccessState.value = true
        isCelebrating.value = true // If you use isCelebrating, keep it here

        // Timeout 1: Stop celebration animation (if used)
        setTimeout(() => {
            isCelebrating.value = false
        }, 2000)

        // Timeout 2: Reset form and state after success message display
        setTimeout(() => {
            resetForm()
            showSuccessState.value = false
            generalError.value = ''
            setServiceProfessionals([])
        }, 2000)
    }

    // --- HANDLE SUBMISSION ---
    const submitForm = handleSubmit(async (formData) => {
        generalError.value = ''
        try {
            await appointmentStore.bookAppointment({
                ...formData,
                service_id: Number(formData.service_id),
                health_professional_id: Number(formData.health_professional_id),
            })

            successToast('Your appointment has been booked successfully!')
            await resetFormWithAnimation()
        } catch (error: any) {
            const errorMessage = error.message ?? 'Failed to book appointment. Please try again.'
            generalError.value = errorMessage
            console.error('Appointment booking error:', error)
            errorToast(errorMessage)
        }
    })

    return {
        // Form properties
        handleSubmit: submitForm, // Rename for clarity in component
        isSubmitting,
        values,
        // State
        generalError,
        showSuccessState,
        isCelebrating,
        // Data
        services,
        professionals,
    }
}
