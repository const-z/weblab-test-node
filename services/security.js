"use strict";

const boom = require("boom");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const config = require("../config");

let _createToken = Symbol();

class Security {

	async [_createToken](data) {
		data.expiration = new Date().getTime() + config.tokens.expiration;
		return await jwt.sign(data, config.tokens.secret);
	}

	async login(params) {
		let response = await fetch(`${config.apiBaseUrl}/auth/login`, {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(params)
		});
		if (!response.ok) {
			let err = await response.json();
			throw boom.unauthorized(JSON.stringify(err));
		}
		try {
			let json = await response.json();
			return await this[_createToken](json);
		} catch (err) {
			console.error(err);
			throw boom.unauthorized();
		}
	}

	async validate(credentials, request, callback) {
		let response = await fetch(`${config.apiBaseUrl}/user/current`, {
			headers: {
				authorization: `Bearer ${credentials.token}`
			}
		});
		if (!response.ok) {
			callback(null, false);
			return;
		}
		let user = await response.json();
		user.secretKey = Buffer.from(user.secretKey, 'base64').toString("utf-8");
		callback(null, true, user);
		return;
	}

}

module.exports = new Security();
