// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-06-28',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ['@nuxt/content'],
  css: ['@picocss/pico/css/pico.fluid.classless.pumpkin.min.css', '~/assets/css/main.css'],
  typescript: {
    strict: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'zh-Hant-TW' },
      meta: [
        {
          name: 'description',
          content: '臺灣 TSCII 一級法學期刊共同制定的引註格式查詢（非官方）。',
        },
      ],
      title: 'TSCII 法律學一級期刊統一引註格式',
    },
  },
})
