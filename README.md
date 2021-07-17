# PWA Studio Extensibility

The goal is to simplify the developer's life while working on
projects based on [Magento's PWA Studio](https://github.com/magento/pwa-studio).

[Overriding](https://github.com/fooman/venia-ui-override-resolver) [Venia]'s
components and styles is not always the case. There must be other solutions
to customize the UI. Fortunately, [Chris Brabender] shared ideas on
simplifying [styling] and [targetables].

Those have been adjusted in such a way to make it easier to apply on the
projects and keep the `local-intercept.js` file as clean as possible.

See below how to apply and use.

## Installation

1. Add the package as a dependency to the project.

```sh
yarn add https://github.com/vasilii-b/pwa-studio-extensibility#1.1.0
````
   
2. Adjust the `local-intercept.js` file to make the package's changes apply on
the project
```js
function localIntercept(targets) {
    const { Targetables } = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);
    const { addExtensibilityTargetables } = require('@vasilii-burlacu/pwa-studio-extensibility/targets');
    
    addExtensibilityTargetables(targetables);
}

module.exports = localIntercept;
```

3. Proceed with adjusting styles and components. See [Usage](#usage)

## Options

Starting with v.1.1.0 it's possible to adjust styles using `.scss` files instead
of `.css`.

This means you can use SCSS Modules to customise Venia's look&feel.

```js
addExtensibilityTargetables(
    targetables,
    {
        styles: {
            useScssOverCss: true
        }
    }
);
```

## Usage

### Simplified Styling

The idea is the following.

In the project root, under `src` folder, create the file with the exact name
and path as the one you need to adjust from the `@magento/venia-ui` package and
add the required adjustments in it.

<details>
<summary>Example</summary>

Saying you want to adjust the styles for the header's background color. Header
styles are located in
`@magento/venia-ui/lib/components/Header/header.css`.

Create the file 
`{project-root}/src/components/Header/header.css` and add inside it the changes
you need to tweak Venia's default look&feel.

```css
/* {project-root}/src/components/Header/header.css */

.toolbar {
  composes: toolbar from '~@magento/venia-ui/lib/components/Header/header.css';
  background-color: red;
}
```
</details>

⚠️ When adding new files or removing existing ones need to re-run `yarn watch` so
the changes take place.

### Simplified Targetables

As with styles, the idea is to have the same path in the `components` folder for
the components you need to adjust. With one minor adjustment: the filename must
end in `.targetables.js`.

The initial content of such a file needs to be

```js
const interceptComponent = (component) => {
  /**
   * `component` is the component required to be adjusted.
   */
}

exports.interceptComponent = interceptComponent;
```

<details>
<summary>Example</summary>

Saying you want to adjust the Header and remove the main navigation.

Header's component is located at
`@magento/venia-ui/lib/components/Header/header.js`. This means a file
`{project-root}/src/components/Header/header.targetables.js`
has to be created.

The file content will be

```js
const interceptComponent = (component) => {
    component.removeJSX('MegaMenu');
}

exports.interceptComponent = interceptComponent;
```
</details>

⚠️ When adding new files or removing existing ones need to re-run `yarn watch` so
the changes take place.

⚠️ Changes done in the `*.targetables.js` files are not applied during
`yarn watch` running.

## PWA Studio Compatibility

* v10.0.0 - ✅
* v9.0.1 - 🥁 (_to be tested)_

## Credits

Huge shout out to [Chris Brabender] for the
[shared approaches](https://dev.to/chrisbrabender) on adjusting the PWA Studio.

## License

See the [LICENSE.txt](./LICENSE.txt) file.

[Chris Brabender]: https://github.com/chris-brabender
[styling]: https://dev.to/chrisbrabender/simplifying-styling-in-pwa-studio-1ki1
[targetables]: https://dev.to/chrisbrabender/simplifying-targetables-in-pwa-studio-p8b
[Venia]: https://venia.magento.com/
