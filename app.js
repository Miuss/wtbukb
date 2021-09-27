// app.js

const api = require('./libs/api')
App({
	onLaunch(options) {
		const updateManager = wx.getUpdateManager()
		updateManager.onCheckForUpdate(function(res) {
			// 请求完新版本信息的回调
			console.log(res.hasUpdate)
		})
		updateManager.onUpdateReady(function() {
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启小程序？',
				success: function(res) {
					if (res.confirm) {
						// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
						updateManager.applyUpdate()
					}
				}
			})
		})
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
	globalData: {}
})
