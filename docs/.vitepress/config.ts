import { defineConfig } from 'vitepress'

const zhSidebar = {
  '/zh/guide/': [
    {
      text: '入门',
      items: [
        { text: '简介', link: '/zh/guide/introduction' },
        { text: '快速上手', link: '/zh/guide/getting-started' },
        { text: '核心概念', link: '/zh/guide/core-concepts' },
      ],
    },
    {
      text: '进阶',
      items: [
        { text: '导航方法', link: '/zh/guide/navigation-methods' },
        { text: '页面缓存控制', link: '/zh/guide/cache-control' },
        { text: '嵌套路由', link: '/zh/guide/nested-routes' },
        { text: '动画', link: '/zh/guide/transitions' },
        { text: '滚动恢复', link: '/zh/guide/scroll-restoration' },
        { text: '页面通信', link: '/zh/guide/event-channel' },
        { text: 'SSR', link: '/zh/guide/ssr' },
        { text: '从 v1 迁移', link: '/zh/guide/migration' },
      ],
    },
  ],
  '/zh/api/': [
    {
      text: '核心',
      items: [
        { text: 'createKeepRouter', link: '/zh/api/create-keep-router' },
        { text: 'KeepRouterView', link: '/zh/api/keep-router-view' },
      ],
    },
    {
      text: 'Composables',
      items: [
        { text: 'useKeepRouter', link: '/zh/api/use-keep-router' },
        { text: 'usePageCache', link: '/zh/api/use-page-cache' },
        { text: 'usePageStack', link: '/zh/api/use-page-stack' },
        { text: 'useNavigationDirection', link: '/zh/api/use-navigation-direction' },
        { text: 'useEventChannel', link: '/zh/api/use-event-channel' },
        { text: 'useScrollRestoration', link: '/zh/api/use-scroll-restoration' },
        { text: 'onPageShow / onPageHide', link: '/zh/api/lifecycle-hooks' },
      ],
    },
    {
      text: '类型',
      items: [{ text: '类型参考', link: '/zh/api/types' }],
    },
  ],
  '/zh/cookbook/': [
    {
      text: 'Cookbook',
      items: [
        { text: '滚动恢复最佳实践', link: '/zh/cookbook/scroll-restoration' },
        { text: '表单页面通信', link: '/zh/cookbook/form-communication' },
        { text: 'Tab 切换保持', link: '/zh/cookbook/tab-switching' },
        { text: '条件缓存', link: '/zh/cookbook/conditional-cache' },
        { text: '与 UI 库集成', link: '/zh/cookbook/ui-library-integration' },
      ],
    },
  ],
}

const enSidebar = {
  '/en/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/en/guide/introduction' },
        { text: 'Quick Start', link: '/en/guide/getting-started' },
        { text: 'Core Concepts', link: '/en/guide/core-concepts' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Navigation Methods', link: '/en/guide/navigation-methods' },
        { text: 'Cache Control', link: '/en/guide/cache-control' },
        { text: 'Nested Routes', link: '/en/guide/nested-routes' },
        { text: 'Transitions', link: '/en/guide/transitions' },
        { text: 'Scroll Restoration', link: '/en/guide/scroll-restoration' },
        { text: 'Event Channel', link: '/en/guide/event-channel' },
        { text: 'SSR', link: '/en/guide/ssr' },
        { text: 'Migration from v1', link: '/en/guide/migration' },
      ],
    },
  ],
  '/en/api/': [
    {
      text: 'Core',
      items: [
        { text: 'createKeepRouter', link: '/en/api/create-keep-router' },
        { text: 'KeepRouterView', link: '/en/api/keep-router-view' },
      ],
    },
    {
      text: 'Composables',
      items: [
        { text: 'useKeepRouter', link: '/en/api/use-keep-router' },
        { text: 'usePageCache', link: '/en/api/use-page-cache' },
        { text: 'usePageStack', link: '/en/api/use-page-stack' },
        { text: 'useNavigationDirection', link: '/en/api/use-navigation-direction' },
        { text: 'useEventChannel', link: '/en/api/use-event-channel' },
        { text: 'useScrollRestoration', link: '/en/api/use-scroll-restoration' },
        { text: 'onPageShow / onPageHide', link: '/en/api/lifecycle-hooks' },
      ],
    },
    {
      text: 'Types',
      items: [{ text: 'Type Reference', link: '/en/api/types' }],
    },
  ],
  '/en/cookbook/': [
    {
      text: 'Cookbook',
      items: [
        { text: 'Scroll Restoration', link: '/en/cookbook/scroll-restoration' },
        { text: 'Form Communication', link: '/en/cookbook/form-communication' },
        { text: 'Tab Switching', link: '/en/cookbook/tab-switching' },
        { text: 'Conditional Cache', link: '/en/cookbook/conditional-cache' },
        { text: 'UI Library Integration', link: '/en/cookbook/ui-library-integration' },
      ],
    },
  ],
}

export default defineConfig({
  title: 'Vue Keep',
  description: 'Vue 页面缓存库，复刻微信小程序页面栈体验',

  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/getting-started' },
          { text: 'API', link: '/zh/api/create-keep-router' },
          { text: 'Cookbook', link: '/zh/cookbook/scroll-restoration' },
        ],
        sidebar: zhSidebar,
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'API', link: '/en/api/create-keep-router' },
          { text: 'Cookbook', link: '/en/cookbook/scroll-restoration' },
        ],
        sidebar: enSidebar,
      },
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/user/vue-keep' }],
    search: {
      provider: 'local',
    },
  },
})
