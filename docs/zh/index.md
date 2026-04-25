---
layout: home
hero:
  name: Vue Keep
  text: 页面缓存库
  tagline: 复刻微信小程序页面栈体验，前进刷新、返回保留状态和滚动位置
  actions:
    - theme: brand
      text: 快速上手
      link: /zh/guide/getting-started
    - theme: alt
      text: 在线体验
      link: https://stackblitz.com/edit/vue-keep-basic
features:
  - title: 页面栈管理
    details: 5 种导航方法（push / replace / back / reLaunch / switchTab），精确控制页面缓存生命周期
  - title: 滚动恢复
    details: 自动检测滚动容器，返回时精确恢复滚动位置，支持多容器和懒加载场景
  - title: 方向感知动画
    details: 内置 slide / fade / zoom 预设，根据导航方向自动切换进出动画
  - title: 页面通信
    details: EventChannel 机制，类似微信小程序 wx.navigateTo 的 events 参数
  - title: TypeScript 优先
    details: 完整的类型定义，支持声明合并扩展 RouteMeta 和 PageEventMap
  - title: 轻量高效
    details: gzip 后 < 5KB，Tree-shakable，零运行时依赖
---
