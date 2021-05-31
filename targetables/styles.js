/**
 * Copyright (C) 2021 Vasilii Burlacu & Contributors

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in the
 Software without restriction, including without limitation the rights to use,
 modify, merge the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */


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
    const magentoPath = path.resolve(__dirname, '..', '..', '..', '@magento');

    (async () => {
        // Load CSS files from src/components
        const componentsPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'components');
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

    // TODO: override Venia index.css once in the project is an index.css file
}
