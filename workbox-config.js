module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{js,css,ttf,jpg,png,ico,mp3,html,json,md}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};