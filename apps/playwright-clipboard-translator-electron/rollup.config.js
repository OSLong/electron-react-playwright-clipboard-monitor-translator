const rollup = require('rollup')
const typescriptPlugin = require('@rollup/plugin-typescript')
const path = require('path')

console.log("Pritn Dir Nam ", __dirname)

exports.default = rollup.defineConfig([
    {
        input: path.join(__dirname,  'src/app.ts'),
        output: {
            dir:  path.join(__dirname, 'js-electron/'),
            format: 'cjs'
        },
        plugins: [
            typescriptPlugin({
                compilerOptions: {
                    target: 'es2015',
                    module: 'esnext',
                },
                
            })
        ]
    },
    {
        input: path.join(__dirname,  'src/preload/preload.ts'),
        output: {
            dir: path.join(__dirname,  'js-electron/preload' ),
            format: 'cjs'
        },
        plugins: [
            typescriptPlugin({
                compilerOptions: {
                    target: 'es2015',
                    module: 'esnext',
                    declaration: false,
                    outDir: 'js-electron/preload',
                },
                
            })
        ]
    },

 
    // {
    //     input: path.join(__dirname,  'app.ts'),
    //     output: {
    //         dir: path.join(__dirname, './')
    //     },
    //     plugins: [
    //         typescriptPlugin()
    //     ]
    // }
])