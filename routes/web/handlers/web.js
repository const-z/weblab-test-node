"use strict";

const boom = require("boom");
const joi = require("joi");
const fetch = require("node-fetch");
const Security = require("../../../services/security");
const config = require("../../../config");

module.exports.css = {
	auth: false,
	handler: {
		directory: {
			path: "public/build/css"
		}
	}
};

module.exports.js = {
	auth: false,
	handler: {
		directory: {
			path: "public/build/js"
		}
	}
};

module.exports.images = {
	auth: false,
	handler: {
		directory: {
			path: "public/build/images"
		}
	}
};

module.exports.libs = {
	auth: false,
	handler: {
		directory: {
			path: "node_modules"
		}
	}
};

module.exports.index = {
	auth: {
		mode: "try"
	},
	handler: function (request, reply) {
		if (!request.auth.isAuthenticated) {
			return reply.redirect("/login");
		}
		reply.view("index", { user: request.auth.credentials });
	}
};

module.exports.loginForm = {
	auth: {
		mode: "try"
	},
	handler: function (request, reply) {
		if (request.auth.isAuthenticated) {
			return reply.redirect("/");
		}
		reply.view("login");
	}
};

module.exports.login = {
	auth: false,
	validate: {
		payload: joi.object({
			email: joi.string().required(),
			password: joi.string().required(),
			curlname: joi.string().required()
		}).unknown(false)
	},
	handler: async (request, reply) => {
		try {
			let token = await Security.login(request.payload)
			reply().header("authorization", token).state(config.tokens.cookieKey, token, config.tokens.cookie).redirect("/");
		} catch (err) {
			const error = err.isBoom ? err : boom.badRequest(err.message, err);
			reply.view("login", { error: error.message });
		}
	}
};

module.exports.logout = {
	auth: "jwt",
	handler: async (request, reply) => {
		reply().header("authorization", "---").state(config.tokens.cookieKey, "---", config.tokens.cookie).redirect("/");
	}
};
