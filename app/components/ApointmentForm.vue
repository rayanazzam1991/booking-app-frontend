<script setup lang="ts">

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
import { Loader2Icon, CalendarIcon, UserIcon, MailIcon, StethoscopeIcon } from 'lucide-vue-next'
import {type HealthProfessional} from "../../shared/types/healthProfessional";

const {
  handleSubmit: submitForm,
  isSubmitting,
  values,
  showSuccessState,
  services,
  professionals,
} = useAppointmentForm()

const displayProfessionalName = (p: HealthProfessional) => {
  if (p.name) return p.name
  return `Professional #${p.id}`
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-4xl mx-auto">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
          Book Your Appointment
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Experience premium healthcare with our expert professionals.
          Simple, fast, and tailored to your needs.
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <!-- Info Cards -->
        <div class="space-y-6">
          <Card class="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent class="p-6">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-blue-100 rounded-xl">
                  <StethoscopeIcon class="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Expert Professionals</h3>
                  <p class="text-gray-600 text-sm">Certified healthcare providers dedicated to your well-being</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="bg-white/80 backdrop-blur-sm border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105 delay-75">
            <CardContent class="p-6">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-green-100 rounded-xl">
                  <CalendarIcon class="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
                  <p class="text-gray-600 text-sm">Book appointments that fit your busy lifestyle</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card class="bg-white/80 backdrop-blur-sm border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105 delay-150">
            <CardContent class="p-6">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-purple-100 rounded-xl">
                  <MailIcon class="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Instant Confirmation</h3>
                  <p class="text-gray-600 text-sm">Receive immediate booking confirmation and reminders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Booking Form -->
        <div class="lg:col-span-2">
          <Card
              ref="formCardRef"
              class="bg-white/90 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden relative"
              :class="{
              'success-state': showSuccessState
            }"
          >
            <!-- Success Overlay -->
            <div
                v-if="showSuccessState"
                class="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center z-10 transition-all duration-1000"
            >
              <div class="text-center text-white p-8 animate-fade-in">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 class="text-2xl font-bold mb-2">Appointment Confirmed!</h3>
                <p class="text-green-100">We've sent a confirmation to your email</p>
                <p class="text-green-200 text-sm mt-2 animate-pulse">Returning to booking form...</p>
              </div>
            </div>

            <CardHeader class="pb-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white/20 rounded-lg">
                  <CalendarIcon class="h-6 w-6" />
                </div>
                <div>
                  <CardTitle class="text-2xl font-bold">Schedule Your Visit</CardTitle>
                  <CardDescription class="text-blue-100 mt-1">
                    Select a service first to see available health professionals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent class="p-8">
              <form class="space-y-6" @submit.prevent="submitForm">
                <!-- Service Selection -->
                <FormField name="service_id" v-slot="{ componentField, value }">
                  <FormItem class="space-y-3">
                    <FormLabel class="text-sm font-semibold text-gray-700 flex items-center">
                      <StethoscopeIcon class="h-4 w-4 mr-2 text-blue-500" />
                      Service Type
                    </FormLabel>
                    <FormControl>
                      <Select v-bind="componentField">
                        <SelectTrigger class="h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors duration-200">
                          <SelectValue placeholder="Choose a service..." />
                        </SelectTrigger>
                        <SelectContent class="bg-white border border-gray-200 shadow-lg">
                          <SelectGroup>
                            <SelectItem
                                v-for="service in services"
                                :key="service.id"
                                :value="String(service.id)"
                                class="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
                            >
                              <div class="flex justify-between items-center w-full">
                                <span class="font-medium text-gray-900">{{ service.name }}</span>
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage class="text-red-500 text-sm font-medium" />
                  </FormItem>
                </FormField>

                <!-- Dynamic Fields - Animated Entrance -->
                <transition-group name="stagger-fade" tag="div" class="space-y-6">
                  <!-- Health Professional -->
                  <FormField
                      v-if="values.service_id && professionals && professionals.length > 0"
                      key="professional"
                      name="health_professional_id"
                      v-slot="{ componentField, value }"
                  >
                    <FormItem class="space-y-3">
                      <FormLabel class="text-sm font-semibold text-gray-700 flex items-center">
                        <UserIcon class="h-4 w-4 mr-2 text-green-500" />
                        Health Professional
                      </FormLabel>
                      <FormControl>
                        <Select v-bind="componentField" :model-value="value">
                          <SelectTrigger class="h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors duration-200">
                            <SelectValue placeholder="Select your professional..." />
                          </SelectTrigger>
                          <SelectContent class="bg-white border border-gray-200 shadow-lg">
                            <SelectGroup>
                              <SelectItem
                                  v-for="item in professionals"
                                  :key="item.id"
                                  :value="String(item.id)"
                                  class="px-4 py-3 hover:bg-green-50 cursor-pointer transition-colors duration-150"
                              >
                                <div class="flex justify-between items-center w-full">
                                  <span class="font-medium text-gray-900">{{ displayProfessionalName(item) }}</span>
                                  <span class="text-green-600 font-semibold"> ${{ item.pivot?.price }}</span>
                                </div>
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage class="text-red-500 text-sm font-medium" />
                    </FormItem>
                  </FormField>

                  <!-- Loading state for professionals -->
                  <div
                      v-if="values.service_id && professionals && professionals.length === 0"
                      key="loading"
                      class="flex items-center justify-center py-8"
                  >
                    <Loader2Icon class="h-6 w-6 animate-spin text-blue-500 mr-2" />
                    <span class="text-gray-600">Loading available professionals...</span>
                  </div>

                  <!-- Date & Time -->
                  <FormField
                      v-if="values.service_id && professionals && professionals.length > 0"
                      key="date"
                      name="date"
                      v-slot="{ componentField }"
                  >
                    <FormItem class="space-y-3">
                      <FormLabel class="text-sm font-semibold text-gray-700 flex items-center">
                        <CalendarIcon class="h-4 w-4 mr-2 text-purple-500" />
                        Preferred Date & Time
                      </FormLabel>
                      <FormControl>
                        <Input
                            type="datetime-local"
                            v-bind="componentField"
                            class="h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage class="text-red-500 text-sm font-medium" />
                    </FormItem>
                  </FormField>

                  <!-- Email -->
                  <FormField
                      v-if="values.service_id && professionals && professionals.length > 0"
                      key="email"
                      name="customer_email"
                      v-slot="{ componentField }"
                  >
                    <FormItem class="space-y-3">
                      <FormLabel class="text-sm font-semibold text-gray-700 flex items-center">
                        <MailIcon class="h-4 w-4 mr-2 text-indigo-500" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                            type="email"
                            v-bind="componentField"
                            placeholder="your.email@example.com"
                            class="h-12 bg-gray-50 border-gray-200 hover:bg-white transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage class="text-red-500 text-sm font-medium" />
                    </FormItem>
                  </FormField>
                </transition-group>

                <!-- Submit Button -->
                <Button
                    v-if="values.service_id && professionals && professionals.length > 0"
                    type="submit"
                    :disabled="isSubmitting"
                    class="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  <Loader2Icon v-if="isSubmitting" class="mr-2 h-5 w-5 animate-spin" />
                  <span v-if="!isSubmitting" class="flex items-center justify-center">
                    <CalendarIcon class="mr-2 h-5 w-5" />
                    Book Appointment Now
                  </span>
                  <span v-else>Processing Your Booking...</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Staggered animations for form fields */
.stagger-fade-enter-active,
.stagger-fade-leave-active {
  transition: all 0.5s ease;
}

.stagger-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.stagger-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.stagger-fade-move {
  transition: transform 0.5s ease;
}

/* Success state animation */
.success-state {
  animation: successPulse 2s ease-in-out;
}

.celebrate::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
  animation: celebrate 2s ease-out;
  z-index: 5;
}

/* Fade in animation for success message */
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes successPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

@keyframes celebrate {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Custom scrollbar for select dropdowns */
::v-deep(.select-content) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

::v-deep(.select-content)::-webkit-scrollbar {
  width: 6px;
}

::v-deep(.select-content)::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::v-deep(.select-content)::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::v-deep(.select-content)::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
