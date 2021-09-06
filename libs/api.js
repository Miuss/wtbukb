//引入Promise
var Promise = require('./es6-promise.auto.js');
//默认请求
function POST(url, params) {
	let promise = new Promise(function(resolve, reject) {
		let token = wx.getStorageSync("token");
		let headers;
		if (token) {
			headers = {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "Bearer " + token
			}
		} else {
			headers = {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
		wx.request({
			url: url,
			data: params,
			header: headers,
			method: 'POST',
			success: (res) => {
				resolve(res.data)
			},
			fail: (res) => {
				reject(res)
			}
		})
	});
	return promise;
}

function GET(url, params) {
	let promise = new Promise(function(resolve, reject) {
		let token = wx.getStorageSync("token");
		let headers;
		if (token) {
			headers = {
				"Content-Type": "application/x-www-form-urlencoded",
				"Authorization": "Bearer " + token
			}
		} else {
			headers = {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		}
		wx.request({
			url: url,
			data: params,
			header: headers,
			method: 'GET',
			success: (res) => {
				resolve(res.data)
			},
			fail: (res) => {
				reject(res)
			}
		})
	});
	return promise
}
module.exports = {
	POST: POST,
	GET: GET,
}
