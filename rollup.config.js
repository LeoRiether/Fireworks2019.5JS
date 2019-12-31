import pkg from './package.json';

const config = {
	input: 'app.js',
	output: [
		{
			file: 'bundle.js',
			format: 'iife',
		},
	],
};

export default config;