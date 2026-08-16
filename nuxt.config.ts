import { resolve } from 'node:path'
import { cwd, env } from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    'nuxt-gtag',
    '@nuxtjs/sitemap',
    'nuxt-simple-robots',
  ],

  css: [
    '@unocss/reset/tailwind.css',
    '~/styles/base.css',
  ],

  nitro: {
    serverAssets: [{
      baseName: 'archive',
      dir: resolve(cwd(), 'archive'),
    }],
    // ========== 预渲染配置 ==========
    prerender: {
      routes: [
        // 年份路由 2010-2026
        '/year/2010', '/year/2011', '/year/2012', '/year/2013', '/year/2014',
        '/year/2015', '/year/2016', '/year/2017', '/year/2018', '/year/2019',
        '/year/2020', '/year/2021', '/year/2022', '/year/2023', '/year/2024',
        '/year/2025', '/year/2026',
        // 年月路由 2010-2026
        '/year-month/201001', '/year-month/201002', '/year-month/201003',
        '/year-month/201004', '/year-month/201005', '/year-month/201006',
        '/year-month/201007', '/year-month/201008', '/year-month/201009',
        '/year-month/201010', '/year-month/201011', '/year-month/201012',
        '/year-month/201101', '/year-month/201102', '/year-month/201103',
        '/year-month/201104', '/year-month/201105', '/year-month/201106',
        '/year-month/201107', '/year-month/201108', '/year-month/201109',
        '/year-month/201110', '/year-month/201111', '/year-month/201112',
        '/year-month/201201', '/year-month/201202', '/year-month/201203',
        '/year-month/201204', '/year-month/201205', '/year-month/201206',
        '/year-month/201207', '/year-month/201208', '/year-month/201209',
        '/year-month/201210', '/year-month/201211', '/year-month/201212',
        '/year-month/201301', '/year-month/201302', '/year-month/201303',
        '/year-month/201304', '/year-month/201305', '/year-month/201306',
        '/year-month/201307', '/year-month/201308', '/year-month/201309',
        '/year-month/201310', '/year-month/201311', '/year-month/201312',
        '/year-month/201401', '/year-month/201402', '/year-month/201403',
        '/year-month/201404', '/year-month/201405', '/year-month/201406',
        '/year-month/201407', '/year-month/201408', '/year-month/201409',
        '/year-month/201410', '/year-month/201411', '/year-month/201412',
        '/year-month/201501', '/year-month/201502', '/year-month/201503',
        '/year-month/201504', '/year-month/201505', '/year-month/201506',
        '/year-month/201507', '/year-month/201508', '/year-month/201509',
        '/year-month/201510', '/year-month/201511', '/year-month/201512',
        '/year-month/201601', '/year-month/201602', '/year-month/201603',
        '/year-month/201604', '/year-month/201605', '/year-month/201606',
        '/year-month/201607', '/year-month/201608', '/year-month/201609',
        '/year-month/201610', '/year-month/201611', '/year-month/201612',
        '/year-month/201701', '/year-month/201702', '/year-month/201703',
        '/year-month/201704', '/year-month/201705', '/year-month/201706',
        '/year-month/201707', '/year-month/201708', '/year-month/201709',
        '/year-month/201710', '/year-month/201711', '/year-month/201712',
        '/year-month/201801', '/year-month/201802', '/year-month/201803',
        '/year-month/201804', '/year-month/201805', '/year-month/201806',
        '/year-month/201807', '/year-month/201808', '/year-month/201809',
        '/year-month/201810', '/year-month/201811', '/year-month/201812',
        '/year-month/201901', '/year-month/201902', '/year-month/201903',
        '/year-month/201904', '/year-month/201905', '/year-month/201906',
        '/year-month/201907', '/year-month/201908', '/year-month/201909',
        '/year-month/201910', '/year-month/201911', '/year-month/201912',
        '/year-month/202001', '/year-month/202002', '/year-month/202003',
        '/year-month/202004', '/year-month/202005', '/year-month/202006',
        '/year-month/202007', '/year-month/202008', '/year-month/202009',
        '/year-month/202010', '/year-month/202011', '/year-month/202012',
        '/year-month/202101', '/year-month/202102', '/year-month/202103',
        '/year-month/202104', '/year-month/202105', '/year-month/202106',
        '/year-month/202107', '/year-month/202108', '/year-month/202109',
        '/year-month/202110', '/year-month/202111', '/year-month/202112',
        '/year-month/202201', '/year-month/202202', '/year-month/202203',
        '/year-month/202204', '/year-month/202205', '/year-month/202206',
        '/year-month/202207', '/year-month/202208', '/year-month/202209',
        '/year-month/202210', '/year-month/202211', '/year-month/202212',
        '/year-month/202301', '/year-month/202302', '/year-month/202303',
        '/year-month/202304', '/year-month/202305', '/year-month/202306',
        '/year-month/202307', '/year-month/202308', '/year-month/202309',
        '/year-month/202310', '/year-month/202311', '/year-month/202312',
        '/year-month/202401', '/year-month/202402', '/year-month/202403',
        '/year-month/202404', '/year-month/202405', '/year-month/202406',
        '/year-month/202407', '/year-month/202408', '/year-month/202409',
        '/year-month/202410', '/year-month/202411', '/year-month/202412',
        '/year-month/202501', '/year-month/202502', '/year-month/202503',
        '/year-month/202504', '/year-month/202505', '/year-month/202506',
        '/year-month/202507', '/year-month/202508', '/year-month/202509',
        '/year-month/202510', '/year-month/202511', '/year-month/202512',
        '/year-month/202601', '/year-month/202602', '/year-month/202603',
        '/year-month/202604', '/year-month/202605', '/year-month/202606',
        '/year-month/202607', '/year-month/202608', '/year-month/202609',
        '/year-month/202610', '/year-month/202611', '/year-month/202612',
      ],
    },
  },

  gtag: {
    id: 'G-YR2YHJVK0Q',
  },

  site: {
    url: `${env.NUXT_SITE_URL}`,
  },

  sitemap: {
    debug: true,
    sources: ['/api/sitemap'],
    defaultSitemapsChunkSize: 1000,
  },

  robots: {
    sitemap: [
      `/sitemap.xml`,
    ],
  },

  compatibilityDate: '2024-10-10',
})
