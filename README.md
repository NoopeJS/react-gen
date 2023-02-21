# React Gen
React is one of the most popular libraries for building User Interfaces. React community has been increasing rapidly in the recent time, which has opened the doors for modern frontend developers to build rich web applications.


  <img src="https://obaid-qatan.vercel.app/things/react-gen.svg"/>

## Problem Statement
React has so many adventages and such an amazing tool, however the React team have not set specific pattern or convention for the development process, but let them opened to the developers to choose freely whichever approach or pattern is prefered for them. This resulted on different problems to come up for software developers to deal with, and in this article, we will cover the ones that we wish to solve through React Gen. These problems can be listed as follows:

#### - Missy root component in semi-large to large applications that require a number of providers.
#### - Multiple steps to provide states in a particluar context.
#### - No built-in tool for state management.
#### - No conventional pattern to follow for development.
#### - Components can be rendered with no registry required.

## Solution Overview
Below, we will have a look at how the regular React App looks and how it is intended to be like.
The idea is to instantiate a modular structure for React app, where the single app comprises of different sub-apps or Modules. It was determined that using Dependency Injection pattern can be quite helpful to achieve the goal. Every module of the app will be pluggable, this will be very convenient for testing and mocking each part of the app. Every module will be registred to the RootModule to be used, otherwise it won't be visible for the app.

We can make adventage of the MVC pattern to split each module into many managable and pluggable units, where a Component Module will consist of module, component and service. This can be helpful to share resources over a particular context or over the entire application.

### Example of missy root component:
```tsx
const App = () => {
  return (
    <div>
      <ColorSchemeProvider>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
          >
            <ModalsProvider>
              <NotificationsProvider
              >
                <RecoilRoot>
                  <ReactTooltip />
                  <Toaster />
                  <Component {...pageProps} />
                </RecoilRoot>
              </NotificationsProvider>
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </div>
    );
  }
```

In React Gen, providers will wrap the root component before it's returnred, in a class oriented approach:
```tsx
// index.tsx
//...

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Only modules which are registred to RootModule will be resolved.
const modules = getRegisteredToRootModules(RootModule);

root.render(
  <React.StrictMode>
    <RootComponent modules={modules} />
  </React.StrictMode>
);
```
This is how `RootModule` may look like
```ts
import HomeModule from "./home/home.module";
import { Module } from "./moduleRegistry";
import RootComponent from "./root/root.component";

@Module({
  imports: [HomeModule],
  declarations: [RootComponent],
  providers: [],
  exports: [],
})
export default class RootModule {}
```
Here, we have registred `HomeModule` to our application, hence it's resolved and its component will be added to the tree. Generating a new component module will result on generating the following:
```
src/
-- home/
---- home.module.ts
---- home.service.ts
---- home.component.tsx
```
Let's have a look at what each may look like. In `HomeModule`, components involved under this module will have to be registred within the `imports` list, if not registred then it won't be rendered. `homeService` and `homeComponent` will have to be registred in `providers` and `declarations` lists, otherwise `this.homeService` will be `undefined` and `this.homeComponent()` will not render a component. `HomeService` will be injected automatically to `HomeModule` if registred within its `providers`.

#### HomeModule
```ts
import { Module, View } from "../moduleRegistry";
import RootModule from "../root/root.module";
import HomeComponent from "./home.component";
import { HomeService } from "./home.service";

@Module({
  declarations: [HomeComponent],
  providers: [HomeService],
  exports: [],
  parent: () => RootModule,
})
export default class HomeModule {
  constructor(
    private homeService: HomeService,
    @View() private homeComponent: HomeComponent
  ) {}

  renderComponent() {
    return this.homeComponent({ message: this.homeService.getMessage() });
  }
}
```
As we can see, `renderComponent` function will render the module component when called. However, the component may not nesseserily to be the exact same component as `HomeComponent`, it can be wrapped with required functional providers which return the manipulated React component.

### Example of a regular react component that is wrapped by `RecoilRoot`:
```tsx
const App = () => {
  return (
    <RecoilRoot>
      <Component />
    </RecoilRoot />
  );
}
```
The following code will be the React Gen representaion of the above component:

```ts
// ...

renderComponent() {
  const WrappedComponent = RecoilRoot({ children: this.moduleComponent() });
  return WrappedComponent;
}
```
We can observe that this approach will keep the nested tree component clean and well-organized. Cool, let's have a look at `HomeComponent`:

```tsx
import React from "react";
import { ModuleComponent } from '../moduleRegistry';

@ModuleComponent('HomeModule')
function HomeComponent({ message }: { message?: string }) {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      {message}: {count} bla bla bla
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default HomeComponent;
```
`@ModuleComponent('HomeModule')` will make the React component registerable only to `HomeModule`. Let's understand the difference between a React component and a ModuleComponent that's decorated with `@ModuleComponent`. The main point is that ModuleComponent will be the parent component of other React components, and once it's registred to a module, there's no need to register its children, as the entire ModuleComponent is now pluggable. As every module will have only zero or one ModuleComponent, mocking the view of the module will be way easier, all we need to do is mocking the ModuleComponent returned by `renderComponent` function.

```ts
// ...

renderComponent() {
  // return this.moduleComponent();
  return MockComponent;
}
```
Finally, we are defining our injectable service in `home.service.ts`:

```ts
import { injectable } from "../modelRegistry";

@injectable(['HomeService'])
export class HomeService {
  private message: string = "Hello Mama I'm Home";
  public getMessage(): string {
    return this.message;
  }
}
```
The `HomeService` will be valid as an injectable resource. `@injectable` will make the service to be injectable only to the modules assigned to it like in `['HomeModule']`. This can be a neat solution to work as a shared resource among multiple modules, for example, if we wanted to define `CommonService` as a shared resource, it can be decorated with `@injectable(['Module1', 'Module2', ...])`.

## Tools
We have changed the way React usually starts its applications, this will cause the Fast Refresh of React to fail in updating the UI in development, hence, `Vite` can be used along with `@vitejs/plugin-react-refresh` plugin to achive the HMR for any changes in React components. In addition, Vite also uses `Rollup` as bundler under the hood with a fast server reload. Vite expects an entry point `index.html`, so `src/index.html` will have the root html div that will contain our application. Therefore, the directory description with `HomeModule` can be displayed as follows:

```
public/
src/
-- index.html
-- index.tsx
-- root/
---- root.module.ts
---- root.component.tsx
-- home/
---- home.module.ts
---- home.service.ts
---- home.component.tsx
-- moduleRegistry.ts
.gitignore
package-lock.json
package.json
tsconfig.json
vite.config.js
```
Decorators will be defined locally, however, decorators from `tsyringe` with the help of `reflect-metadata` can be used or even replaced in later implementation with local versions as fits.

## CLI
We will have our plan directed to build a basic CLI that helps initialize React Gen projects, generate a new ComponentModule or to separately generate Module, Service and ModuleComponent. For example, to generate the above `HomeModule` using the React Gen CLI, we will only need to do the following:

```bash
re-gen -t cm Home
// or
re-gen --type ComponentModule Home
```