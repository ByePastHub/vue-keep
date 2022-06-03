import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/zh/guide/': [
    {
      text: '指南',
      children: [
        '/zh/guide/README.md',
        '/zh/guide/install.md',
      ],
    },
    {
      text: '基本使用',
      children: [
        '/zh/guide/getting-started.md',
        '/zh/guide/destroy.md',
        '/zh/guide/beforeEach.md'
      ],
    },
  ]
}
