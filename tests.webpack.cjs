const path = require('path');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

/* need to install:

npm i --save-dev webpack-cli node-polyfill-webpack-plugin

*/


let buildTargets = []

let browserTarget = 
{
	entry: './filter-log.js',
	mode: 'production',
	"devtool": 'source-map',
	experiments: {
		outputModule: true,
	},
	output: {
		filename: 'browser.js',
		path: path.resolve(__dirname, 'tmp'),
		library: {
			type: 'module',
		}
	},
	module: {
		rules: [
			{ test: /\.tmpl$/, use: 'tripartite/webpack-loader.mjs' }
			, { test: /\.tri$/, use: 'tripartite/webpack-loader.mjs' }
		],
	},
	resolve: {
		fallback: {
			// stream: require.resolve('stream-browserify'),
		}
	},
	plugins: [
		new NodePolyfillPlugin()
	],
	stats: {
		colors: true,
		reasons: true
	},

}

let testsTarget = 
{
	entry: './test-src/tests.js',
	mode: 'development',
	"devtool": 'source-map',
	// experiments: {
	// 	outputModule: true,
	// },
	output: {
		filename: 'tests.js',
		path: path.resolve(__dirname, 'tmp'),
		// library: {
		// 	type: 'module',
		// }
	},
	module: {
		rules: [
			{ test: /\.tmpl$/, use: 'tripartite/webpack-loader.mjs' }
			, { test: /\.tri$/, use: 'tripartite/webpack-loader.mjs' }
		],
	},
	resolve: {
		fallback: {
			// stream: require.resolve('stream-browserify'),
		}
	},
	plugins: [
		new NodePolyfillPlugin()
	],
	stats: {
		colors: true,
		reasons: true
	},

}
buildTargets.push(browserTarget)
buildTargets.push(testsTarget)

module.exports = buildTargets
