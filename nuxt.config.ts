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
    // Only available on the server (good for secrets)
    openaiApiKey: process.env.OPENAI_API_KEY,

    // Public runtime config (exposed to client)
    public: {
      // you can put a default system prompt here if you want
      defaultSystemPrompt: ''
    }
  },
})
