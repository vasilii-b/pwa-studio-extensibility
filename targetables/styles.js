/**
 * Simplifying styling
 *
 * Makes it easier to adjust the styles of the Venia storefront.
 * This is a customization of the solution from the web.
 * @see https://dev.to/chrisbrabender/simplifying-styling-in-pwa-studio-1ki1
 *
 * @param targetables
 */
module.exports = targetables => {
    const globby = require('globby');
    const fs = require('fs');
    const path = require('path');
    const magentoPath = path.resolve(__dirname, '..', '..', '..', 'node_modules', '@magento');

    (async () => {
        // Load CSS files from src/components
        const componentsPath = path.resolve(__dirname, '..', '..', '..', 'src', 'components');
        const paths = await globby([
            componentsPath,
        ], {
            expandDirectories: {
                extensions: ['css']
            }
        });

        paths.forEach((myPath) => {
            const absolutePath = myPath.replace(
                componentsPath,
                path.resolve(magentoPath, 'venia-ui', 'lib', 'components')
            );

           // Identify if local component maps to 'venia-ui' component
            fs.stat(absolutePath, (err, stat) => {
                if (!err && stat && stat.isFile()) {
                    /**
                     * This means we matched a local file to something in venia-ui
                     * Next: find the JS component from our CSS file name
                     */
                    const jsComponent = absolutePath.replace('.css', '.js');

                    // Load the relevant 'venia-ui' component
                    const componentEsModule = targetables.reactComponent(jsComponent);
                    const module = targetables.module(jsComponent);
                    // Add import to for the custom CSS classes
                    componentEsModule.addImport(`import customClasses from "${myPath}"`);
                    // Update the `mergeClasses()` method to inject the additional custom css
                    module.insertAfterSource(
                        'const classes = mergeClasses(defaultClasses, ',
                        'customClasses, '
                    );
                }
            });
        });
    })();

    // TODO: override Venia index.css if in the project is an index.css file
}
