module.exports = {
	description: 'uses arrow functions',
	options: {
		external: [
			'external',
			'externalAuto',
			'externalDefault',
			'externalDefaultOnly',
			'externalNoImport'
		],
		strictDeprecations: false,
		output: {
			compact: true,
			generatedCode: { arrowFunctions: true },
			interop(id) {
				if (id === 'externalDefault') {
					return 'default';
				}
				if (id === 'externalDefaultOnly') {
					return 'defaultOnly';
				}
				if (id === 'externalAuto') {
					return 'auto';
				}
				return 'compat';
			},
			name: 'bundle',
			noConflict: true
		}
	},
	expectedWarnings: ['DEPRECATED_FEATURE']
};
