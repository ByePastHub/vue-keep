# Introduce

**VueKeep** is an extension based on `keep-alive` and `Router`, which can automatically help you cache page components in route. In order to better use the cache to optimize the program, it is not intended to be destroyed immediately when you return. Of course, you can also destroy it manually. When you return to the page again, the default is in the form of a new page. VueKeep provides more convenient and flexible control over whether the page destroys your page components.

## How It Works?

Extending on the basis of the `keep-alive` component, rewriting some methods of `vue-router` and `history` to achieve 100% accurate judgment of forward or backward, used for caching page components or destroying page components. At the same time, the browser history is copied 1:1. When there is no route change, like `go(n)`, you can also know the jump path in advance.

In order to make it easier for developers to use, VueKeep will overwrite the `name` in the page component in routes with `route.name` to avoid some users who do not have components without exporting the name, or write mistakes, resulting in no cache to Changed page components, while making it easier to optimize old projects.
