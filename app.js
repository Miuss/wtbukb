// app.js

const api = require('./libs/api')
App({
	onLaunch(options) {
		console.log(options)
		wx.getSystemInfo({
			success: e => {
				this.globalData.StatusBar = e.statusBarHeight;
				let capsule = wx.getMenuButtonBoundingClientRect();
				if (capsule) {
					this.globalData.Custom = capsule;
					this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
				} else {
					this.globalData.CustomBar = e.statusBarHeight + 50;
				}
				this.globalData.windowWidth = e.windowWidth;
				this.globalData.CustomScrollBox = e.windowHeight - this.globalData.CustomBar;
			}
		})
	},
	onShow(options) {
	},
	watch: function(ctx, obj) {
		Object.keys(obj).forEach(key => {
			this.observer(ctx.data, key, ctx.data[key], function(value) {
				obj[key].call(ctx, value)
			})
		})
	},
	// 监听属性，并执行监听函数
	observer: function(data, key, val, fn) {
		Object.defineProperty(data, key, {
			configurable: true,
			enumerable: true,
			get: function() {
				return val
			},
			set: function(newVal) {
				if (newVal === val) return
				fn && fn(newVal)
				val = newVal
			},
		})
	},
	globalData: {
	}
})
