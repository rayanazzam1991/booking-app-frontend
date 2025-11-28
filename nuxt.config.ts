import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr:true,
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css:['./app/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    'shadcn-nuxt',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },
  runtimeConfig: {
    // Public runtime config (exposed to client)
    public: {
      BASE_API_URL: process.env.VITE_API_BASE_URL,
      BASE_URL: process.env.VITE_BASE_URL,
      // you can put a default system prompt here if you want
      defaultSystemPrompt: ''
    }
  },
})
