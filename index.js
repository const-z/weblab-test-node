"use strict";

const hapi = require("hapi");
const inert = require("inert");
const vision = require("vision");
const hapijwt = require("hapi-auth-jwt2");
const config = require("./config");
const Security = require("./services/security.js");

const server = new hapi.Server(config.server.options);

server.connection(config.server.test);

server.register([inert, vision, hapijwt], (err) => {

	if (err) {
		throw err;
	}

	server.auth.strategy("jwt", "jwt", true, {
		key: config.tokens.secret,
		validateFunc: Security.validate,
		cookieKey: config.tokens.cookieKey,
		verifyOptions: {
			algorithms: ["HS256"]
		}
	});

	server.register(require("./routes"), (err) => {
		if (err) {
			throw err;
		}
	});
});

server.start((err) => {
	if (err) {
		throw err;
	}
	console.log("Server running at:" + server.info.uri);
});

const onResponse = function (request) {
	let date = new Date().toISOString();
	let from = request.info.remoteAddress + ": " + request.method.toUpperCase() + " " + request.url.path + " --> " + (request.response ? request.response.statusCode : null);
	if (request.response && request.response._error) {
		console.error("%s : %s\n%s", date, from, request.response._error.message);
	} else {
		console.log(date, " : ", request.server.info.uri, " : ", from);
	}
};

server.on("response", onResponse);