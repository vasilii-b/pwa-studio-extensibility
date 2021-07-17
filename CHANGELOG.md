# Changelog

## v.1.1.0

Added an option to adjust Venia styles from `.scss` files instead of pure `.css`.

```js
function localIntercept(targets) {
    const { Targetables } = require('@magento/pwa-buildpack');
    const targetables = Targetables.using(targets);
    const { addExtensibilityTargetables } = require('@vasilii-burlacu/pwa-studio-extensibility/targets');
    
    addExtensibilityTargetables(
        targetables,
        {
            styles: {
                useScssOverCss: true
            }
        }
    );
}

module.exports = localIntercept;
```

## v.1.0.1

Initial release
