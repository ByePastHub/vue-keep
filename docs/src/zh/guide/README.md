# 介绍

**VueKeep** 是一个以`keep-alive`、`Router`的基础上做扩展，它可以自动的帮助你缓存 route 中的页面组件。为了更好的利用缓存来优化程序，所以并不打算返回时马上销毁，当然你也可以手动销毁，当你再次回到该页面时，默认是以新页面的形式。VueKeep提供更方便、更灵活的掌控页面是否销毁你的页面组件。

## 它是如何工作的？

以`keep-alive`组件基础上做扩展，对`vue-router`、`history`的部分方法进行重写，实现100%精准无误判断前进还是后退，用作于缓存页面组件还是销毁页面组件。同时1:1复刻浏览器历史记录，在未发生路由变化时，像`go(n)`这种可以也可以提前知道跳转路径。

为了开发者使用更加简便，VueKeep会对 routes 中的页面组件中的`name`， 会使用 `route.name` 进行覆盖，避免部分用户没有组件没有导出 name，或者写错，导致没有缓存到改页面组件，同时使得优化旧项目上更加便捷。

