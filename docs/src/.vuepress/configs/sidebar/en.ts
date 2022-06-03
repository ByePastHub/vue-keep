import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/guide/': [
    {
      text: 'Guide',
      children: [
        '/guide/README.md',
        '/guide/install.md',
      ],
    },
    {
      text: 'Basic use',
      children: [
        '/guide/getting-started.md',
        '/guide/destroy.md',
        '/guide/beforeEach.md'
      ],
    },
  ]
}
