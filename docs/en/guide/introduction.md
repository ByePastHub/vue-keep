# Introduction

## What is Vue Keep

Vue Keep is a Vue 3 page caching library that replicates the WeChat Mini Program page stack experience. It takes over Vue Router's navigation behavior to achieve **forward refresh, backward state & scroll preservation** — the mobile interaction pattern.

Replace `<router-view>` with `<KeepRouterView>` to get full page caching capabilities.

## The Problem

In traditional SPAs, page transitions destroy component instances:

- Returning from a detail page to a list page loses scroll position
- Navigating away from a half-filled form clears all data
- A long list that loaded lots of data needs to re-fetch on return

Vue Keep solves these with page stack management:

| Action         | Behavior                                    |
| -------------- | ------------------------------------------- |
| Forward (push) | Create new page, cache current page         |
| Back           | Restore cached page, destroy current page   |
| Replace        | Destroy current page, create new page       |
| ReLaunch       | Clear all caches, create new page           |
| SwitchTab      | Switch to tab page, preserve tab sub-stacks |

## vs Native KeepAlive

| Feature             | KeepAlive                  | Vue Keep                         |
| ------------------- | -------------------------- | -------------------------------- |
| Cache strategy      | name-based include/exclude | Automatic page stack management  |
| Direction awareness | None                       | Auto-detect forward/back/replace |
| Scroll restoration  | Manual                     | Automatic                        |
| LRU eviction        | Simple max limit           | constCache protection            |
| Page communication  | None                       | EventChannel                     |
| Transitions         | Manual config              | Direction-aware built-in presets |

## vs WeChat Mini Program

| WeChat Mini Program | Vue Keep                    |
| ------------------- | --------------------------- |
| `wx.navigateTo`     | `keepRouter.push`           |
| `wx.redirectTo`     | `keepRouter.replace`        |
| `wx.navigateBack`   | `keepRouter.back`           |
| `wx.reLaunch`       | `keepRouter.reLaunch`       |
| `wx.switchTab`      | `keepRouter.switchTab`      |
| `onShow` / `onHide` | `onPageShow` / `onPageHide` |
| `EventChannel`      | `useEventChannel`           |

## Features

- Page stack management — 5 navigation methods for precise cache lifecycle control
- Scroll restoration — Auto-detect containers, multi-container and lazy-load support
- Direction-aware transitions — slide / fade / zoom presets
- Page communication — EventChannel for cross-page data passing
- constCache — Persistent cache protection from LRU eviction
- Nested routes — Independent multi-level KeepRouterView management
- TypeScript — Full type definitions with declaration merging
- Lightweight — < 5KB gzipped, tree-shakable
- DevTools — Vue DevTools integration
