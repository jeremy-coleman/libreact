# Route

Routing components that allow you to implement single page app routing functionality.

  - Provide *dynamic* routing, [just like `react-router`](https://reacttraining.com/react-router/core/guides/philosophy/dynamic-routing)
  - Use [any state container](#use-any-state-container)
  - [Multiple routers](#multiple-routers) on one page

Reference:

  - [`<Router>`](#router)
  - [`<Route>`](#route)
  - [`go()`](#go)
  - [`withRoute()`](#withroute)


## Use any state container

With libreact's `<Router>` you can choose to store the current route in your state continer (like Redux or MobX) of
choice, or not bother about it at all, in which case the `<Router>` will just use the current browser location out-of-the-box.

The "problem-of-all-routers" is that they all want to keep the state of the route. For example, [`react-router`](https://reacttraining.com/react-router/) uses
its internal history objects to store route information, and [it does not give you good access to that data structure](http://formidable.com/blog/2016/07/11/let-the-url-do-the-talking-part-1-the-pain-of-react-router-in-redux/).

So, if you wanted to store the state of the route in Redux, there was no good way for you to do that using `react-router`, that is why
[`redux-little-router`](https://github.com/FormidableLabs/redux-little-router) was born, however, `redux-little-router` itself hoards the
state of the route in Redux, so you cannot use it if you use any other state container, say MobX.

Libreact is completely orthogonal to where you store the *current route*, all you have to do is provide the current route to the `<Router>`
component using the `route` prop.

```jsx
<Router route={currentRoute}>
  {/* ... */}
</Router>
```

You can store it in Redux or MobX, or really anywhere you want. And if you don't want to bother, don't! Just use the current location of the browser:

```jsx
<LocationSensor>{({pathname}) =>
  <Router route={pathname}>
    {/* ... */}
  </Router>
}</LocationSensor>
```

Actually, you don't even have to do that, if you don't explicitly specify the `route` prop, the `<Router>` component will do exactly that for you under-the-hood,
so, simply use:

```jsx
<Router>
  {/* ... */}
</Router>
```


## Multiple routers

You can have many routers operating on the same page in parallel. All you have to do is specify a *namespace* using the `ns` prop.

```jsx
<Router ns='secret'>
  <Route ns='secret' />
</Router>
```

This allows you to route by basically anything, not just the current page location. You can have *app-inside-app* that has its
own routing logic.


## Reference

### `<Router>`

`Router` is a root component that provides routing to your application. It should be placed above all other components
that use routing. It uses React's context [`Provider`](./context.md#provider) component to provide route information to
its children.

#### Props

  - `route` - optional, string, route to use for routing. If not specified, `<Router>` will use
  [`<LocationSensor>`](./LocationSensor.md) internally to track any changes to `window.location`.
  - `ns` - optional, string, namespaces of the router. This allows you to have many different routers
  on one page, each in a separate namespace.

Unlike other routing libraries `<Router>` component lets you specify the current route manually using the `route` property,
this way you can use Redux or MobX, or any other state container library to store your route, if you want to.


### `<Route>`

`Route` tries to match a fragment in a route. If it does match, the contents of the route is rendered. The contents of the route
can be either regular JSX children or a FaCC or a React component specified in the `comp` prop.


#### Props

  - `match`, optional, matching condition, defaults to `/.+/`, see discussion below.

The props object has the following TypeScript signature

```ts
interface IRouteMatch {
  children?: React.ReactElement<any> | ((params) => React.ReactElement<any>);
  cnt?: number;
  comp?: React.ComponentClass<{}> | React.StatelessComponent<{}>;
  exact?: boolean;
  match?: TRouteMatcher | RegExp | string;
  ns?: string;
  preserve?: boolean;
}
```


As you can see the `match` prop has the following signature

```ts
TRouteMatcher | RegExp | string;
```

where

```ts
type TRouteMatcher = (route: string) => TRouteMatchResult;

interface TRouteMatchResult {
  length: number; // Length how many characters to truncate from route.
  matches?: RegExpMatchArray; // RegExp matches, if any.
}
```

  - if `string`, it is converted to a regular expression with `^` prepended, which means it has to match the route starting from
  the very first character. For example, `/users` -> `/^(\/users)/`. If the `exact` prop is on, also `$` appended to the regular
  expression, which means the regular expression has to match the route exactly. For example, `/users` -> `/^(\/users)$`.
  - if `RegExp`, the specified regular expression will be used to match the current `route`, the resulting matches array will be
  returned, if any.
  - if `function` is provided, it will be treated as if it has type of `TRouteMatcher`, it is given a `route` string as a
  single argument. If it does not match the route, it has to return `null`. If it matches the `route`, it has to return an object
  with the following properties:
     - `length` - required, number of characters to truncate from the start of the route, for the inner routes, basically this should be
     equal to the length of the matched fragment of the path.
     - `matches` - optional, array of matches returned by `String.prototype.match()` function.


### `go()`

Utility function that changes the current browser location. Has the following signature:

```ts
go: (url: string, params?: IGoParams) => void;

interface IGoParams {
  replace?: boolean;
  title?: string;
  state?: any;
}
```

  - `url` - required, string, URL where to navigate the browser. Usually you want to use a relative route with leading slash, like `/users`.
  - `replace` - whether to to use [`.replaceState()`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_replaceState()_method)
  rather than default [`.pushState()`](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method) when invoking History API.
  - `title` - title to specify in `.pushState()` or `.replaceState()` methods.
  - `state` - any serializable JavaScript object to store with the current history state. Useful, for example, to store current scroll position.


## Example

### With Redux

```jsx
import {Router, Route} from 'libreact/lib/route';
import {connect} from 'react-redux';

const App = ({route}) =>
  <Router route={route}>
    <div>
      <Route match='/home' comp={Home} />
      <Route match='/users' comp={Users} />
    </div>
  </Router>;

const mapStateToProps = ({route}) => ({
  route
});

export default connect(mapStateToProps)(App);
```
