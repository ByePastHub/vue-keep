# Introduce

**VueKeep** is an extension based on `keep-alive` and `Router`, which can automatically help you cache page components in route. In order to better use the cache to optimize the program, it is not intended to be destroyed immediately when you return. Of course, you can also destroy it manually. When you return to the page again, the default is in the form of a new page. VueKeep provides more convenient and flexible control over whether the page destroys your page components.

## How It Works?

Extending on the basis of the `keep-alive` component, rewriting some methods of `vue-router` and `history`, 1:1 re-engraving the browser history stack, so as to accurately judge whether to go forward or backward, use Whether to cache page components or destroy page components.

In order to make it easier for developers to use, VueKeep will overwrite the `name` in the page component in routes with `route.name` to avoid some users who do not have components without exporting the name, or write mistakes, resulting in no cache to Changed page components, while making it easier to optimize old projects.
