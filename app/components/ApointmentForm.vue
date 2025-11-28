<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'

import {
  Card, CardHeader, CardContent, CardTitle, CardDescription
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem
} from '@/components/ui/select'
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Loader2Icon } from 'lucide-vue-next'
import {type HealthProfessional} from "../../shared/types/healthProfessional";
import { toast } from 'vue-sonner'

// --- Zod Validation Schema ---
// Defines the structure and validation rules for the form data
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

const initialForm = {
  service_id: '',
  health_professional_id: '',
  date: '',
  customer_email: '',
}
const form = reactive<AppointmentForm>(initialForm)

const { handleSubmit, isSubmitting, setFieldError, values } = useForm<AppointmentForm>({
  validationSchema: toTypedSchema(appointmentSchema),
  initialValues: initialForm
})

// --- Reactive State ---
const generalError = ref('')
const successMessage = ref('')


// Stores
const serviceStore = useServiceStore()
const healthProfessionalStore = useHeatherProfessionalStore()
const { fetchServices,fetchServiceProfessionals } = serviceStore
const { getServices:services,getServiceProfessionals : professional } = storeToRefs(serviceStore)
const { fetchHealthProfessionals,reset:resetHealthProfessional } = healthProfessionalStore
const {getServiceProfessionals:professionals} = storeToRefs(serviceStore)

const appointmentStore = useAppointmentStore()
// --- Data Fetching ---
onMounted(async () => {
  await Promise.all([
    fetchServices(),
  ])
})

// Watch the service_id field to trigger the professional fetch
watch(() => values.service_id, async (newServiceId) => {

  if (values.health_professional_id) {
    setFieldError('health_professional_id', undefined) // Clear potential previous error
  }
  values.health_professional_id = ''

  if(professionals?.value)
    resetHealthProfessional()

  generalError.value = '' // Clear general error

  if (!newServiceId) return

  await fetchServiceProfessionals(Number(newServiceId))
}, { immediate: false })



const displayProfessionalName = (p: HealthProfessional) => {
  if (p.name) return p.name
  return `Professional #${p.id}`
}

// --- HANDLE SUBMISSION ---
const {api} = useApi()
const submitForm = handleSubmit(async (formData) => {
  generalError.value = ''
  successMessage.value = ''
  try {
    await appointmentStore.bookAppointment({
      ...formData,
      service_id: Number(formData.service_id),
      health_professional_id: Number(formData.health_professional_id),
    })

    successMessage.value = 'Your appointment has been booked successfully!'
    toast.success(successMessage.value,{
          class: "success-toast",
    })
    // resetForm()
  } catch (error: any) {
    generalError.value = 'Failed to book appointment. Please try again.'
    toast.error(error.message ?? generalError.value,{
      class: "bg-red-600 text-white border border-red-700 shadow-lg",
    })
  }
})
</script>

<template>
  <Card class="max-w-xl mx-auto mt-10">
    <CardHeader>
      <CardTitle>📅 Book an Appointment</CardTitle>
      <CardDescription>
        Select a service first to see available health professionals.
      </CardDescription>
    </CardHeader>

    <CardContent>
      <form class="space-y-6" @submit.prevent="submitForm">

        <FormField name="service_id" v-slot="{ componentField, value }">
          <FormItem>
            <FormLabel>Service</FormLabel>
            <FormControl>
              <Select
                  v-bind="componentField"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                        v-for="service in services"
                        :key="service.id"
                        :value="String(service.id)"
                    >
                      {{ service.name }} — ${{ service.price }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField name="health_professional_id" v-slot="{ componentField, value }">
          <div v-if="values.service_id && professionals && professionals?.length > 0">
            <FormItem>
              <FormLabel>Health Professional</FormLabel>
              <FormControl>
                <Select v-bind="componentField" :model-value="value">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a health professional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                          v-for="item in professionals"
                          :key="item.id"
                          :value="String(item.id)"
                      >
                        {{ displayProfessionalName(item) }}
                        — ${{ item.pivot?.price ?? item.price }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </FormField>

        <FormField name="date" v-slot="{ componentField }">
          <div v-if="values.service_id &&  professionals && professionals?.length > 0">
            <FormItem>
              <FormLabel>Date & Time</FormLabel>
              <FormControl>
                <Input type="datetime-local" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </FormField>

        <FormField name="customer_email" v-slot="{ componentField }">
          <div v-if="values.service_id && professionals && professionals?.length > 0">
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input type="email" v-bind="componentField" placeholder="you@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
        </FormField>
        <Button
            v-if="values.service_id &&  professionals && professionals?.length > 0"
            type="submit"
            :disabled="isSubmitting"
        >
          <Loader2Icon v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin" />
          <span v-if="!isSubmitting">Book Appointment</span>
          <span v-else>Booking...</span>
        </Button>
      </form>
    </CardContent>
  </Card>
</template>

<style scoped>
</style>
