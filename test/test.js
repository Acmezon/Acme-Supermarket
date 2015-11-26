exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: [
		'e2e/TC01-getProducts.js',
		'backend/TC01-getProducts.js',
	]
};