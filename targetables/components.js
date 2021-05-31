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
 * Simplifying Targetables
 *
 * "..file naming convention and structure to automatically detect and load
 * relevant intercept files for specific modules".
 * @see https://dev.to/chrisbrabender/simplifying-targetables-in-pwa-studio-p8b
 *
 * @param targetables
 */

module.exports = targetables => {
    const globby = require('globby');
    const fs = require('fs');
    const path = require('path');
    const magentoPath = path.resolve(__dirname, '..', '..', '..', '@magento');

    // Context loader allows us to execute functions in the targeted file
    const requireContextLoader = require('babel-plugin-require-context-hook/register')();

    // Find our .targetables.js files
    (async () => {
        const componentsPath = path.resolve(__dirname, '..', '..', '..', '..', 'src', 'components');
        const paths = await globby(componentsPath, {
            expandDirectories: {
                files: ['*.targetables.js']
            }
        });

        paths.forEach((myPath) => {
            const absolutePath = myPath.replace(
                componentsPath,
                path.resolve(magentoPath, 'venia-ui', 'lib', 'components')
            ).replace('.targetables', '');

            fs.stat(absolutePath, (err, stat) => {
                if (!err && stat && stat.isFile()) {
                    // Retrieve the react component from our cache (so we can use it more than once if necessary)
                    const component = getReactComponent(absolutePath);

                    /**
                     * Load the targetables file for the component and execute the interceptComponent function
                     * We also pass in the component itself so we don't need to load it in the file
                     */
                    const componentInterceptor = require(myPath);
                    componentInterceptor.interceptComponent(component);
                }
            });
        });
    })();

    // Create a cache of components so our styling and intercepts can use the same object
    let componentsCache = [];
    function getReactComponent(modulePath) {
        if (componentsCache[modulePath] !== undefined) {
            return componentsCache[modulePath];
        }

        return componentsCache[modulePath] = targetables.reactComponent(modulePath);
    }
}
