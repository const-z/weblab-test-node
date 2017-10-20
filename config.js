"use strict";


let config = {
	tokens: {
		secret: "secret_key_string",
		ignoreExpiration: true,
		expiration: 24 * 60 * 60 * 1000,
		cookie: {
			ttl: 24 * 60 * 60 * 1000,
			encoding: "none",
			isSecure: false,
			isHttpOnly: false,
			clearInvalid: true,
			strictHeader: true,
			path: "/"
		},
		cookieKey: "weblab_test"
	},
	server: {
		test: {
			host: "0.0.0.0",
			port: 3000,
			labels: "test"
		},
		options: {
			debug: { request: ["error"] }
		}
	},
	routes: {
		prefix: "/api"
	},
	apiBaseUrl: "https://api.shamandev.com"
};

try {
	let customConfig = require("./config-custom.js");
	let hoek = require("hoek");
	config = hoek.applyToDefaults(config, customConfig);
	console.log("Use custom config");
} catch (err) {
	console.log("Use default config");
}

module.exports = config;
