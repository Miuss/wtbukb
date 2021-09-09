let app = getApp()
const api = require('../../libs/api.js');
const ut = require('../../util.js');
Page({
	data: {
		currentTab: 0,
		items: [{
			"iconPath": "/assets/image/home.svg",
			"selectedIconPath": "/assets/image/home_active.svg",
			"text": "首页"
		}, {
			"iconPath": "/assets/image/home.svg",
			"selectedIconPath": "/assets/image/home_active.svg",
			"text": "课表"
		}, {
			"iconPath": "/assets/image/me.svg",
			"selectedIconPath": "/assets/image/me_active.svg",
			"text": "我的"
		}],
		uinfo: '',
		bindinfo: '',
		isLogin: 0
	},
	swichNav: function(e) {
		let that = this;
		if (that.data.currentTab === e.target.dataset.current) {
			return false;
		} else {
			let swichId;
			if (e.detail.swich != null) {
				swichId = e.detail.swich;
			} else {
				swichId = e.target.dataset.current;
			}
			that.setData({
				currentTab: swichId
			})
			let index = that.selectComponent("#index");
			if (index.data.wlist.length == 0 && that.data.bindinfo && swichId == 1) {
				index.getTimeTable(index.data.schoolYear.id.length-1)
			}
		}
	},
	userLogin: function(e) {
		let that = this;
		wx.getUserProfile({
			desc: '用于登录更新用户信息数据',
			success: (res) => {
				wx.showLoading({
					title: '登录中',
				})
				let userInfo = res.userInfo;
				that.setData({
					uinfo: userInfo
				})
				wx.setStorageSync('uinfo', userInfo)
				wx.hideLoading()
				wx.showToast({
					title: '登录成功',
					icon: 'none',
					duration: 1000
				})
			}
		})
	},
	userLogout: function(e) {
		wx.removeStorageSync('uinfo')
		this.setData({
			uinfo: ''
		})
		wx.showToast({
			title: '成功登出',
			icon: 'none',
			duration: 1000
		})
	},
	unbindStuBtnClick: function(e) {
		let that = this;
		wx.showModal({
			title: '账号解绑提示',
			content: '您确定解绑该学生教务账号？',
			success(res) {
				if (res.confirm) {
					wx.showToast({
						title: '解绑成功',
						icon: 'none',
						duration: 1000
					})
					that.setData({
						stuId: '',
						bindinfo: ''
					})
					wx.removeStorageSync('stuId')
					wx.removeStorageSync('pass')
					wx.removeStorageSync('info')
					wx.removeStorageSync('wlist')
					let index = that.selectComponent("#index");
					index.setData({
						wlist: '',
						week: 0,
						semester: 8
					})
				}
			}
		})
	},
	bindStuBtnClick: function(e) {
		console.log(e)

		if (e.detail.username == "") {
			wx.showModal({
				title: '提示',
				content: '学号不能为空'
			})
		} else if (e.detail.password == "") {
			wx.showModal({
				title: '提示',
				content: '密码不能为空'
			})
		} else {
			wx.showLoading({
				title: '绑定中',
			})
			let data = {
				username: e.detail.username,
				password: e.detail.password
			};
			console.log(data);
			api.POST("https://wtbukb.miuss.mcrealms.cn/api/?act=info", data, ).
			then(result => {
				wx.hideLoading()
				console.log(result)
				if (result.status == "error") {
					wx.showModal({
						title: '提示',
						content: result.msg
					})
				} else {
					//计算时间
					var date1 = new Date();
					var date2 = new Date(parseInt(result.info.grade) + parseInt(result.info
						.studyyears), 7, 1);
					var date = parseInt((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 *
						24)); /*不用考虑闰年否*/
					result.info.byts = date;
					this.setData({
						stuId: e.detail.username,
						bindinfo: {
							stuId: e.detail.username,
							pass: e.detail.password,
							info: result.info
						}
					})
					wx.setStorageSync('stuId', e.detail.username)
					wx.setStorageSync('pass', e.detail.password)
					wx.setStorageSync('info', result.info)
					wx.showToast({
						title: '绑定成功',
						icon: 'success',
						duration: 2000
					})
					this.setData({
						modalName: null
					})
				}
			})
		}
	},
	onLoad: function(option) {
		var obj = this.createSelectorQuery();
		obj.select('.nav-tabs').boundingClientRect(function(rect) {
			console.log('获取tabBar元素的高度', rect.height);
			wx.setStorageSync('tabBarHeight', rect.height) // 将获取到的高度设置缓存，以便之后使用
		}).exec();
	},
	onShow: function() {
		this.setData({
			uinfo: wx.getStorageSync("uinfo")
		})
		this.setData({
			bindinfo: {
				stuId: wx.getStorageSync("stuId"),
				pass: wx.getStorageSync("pass"),
				info: wx.getStorageSync("info")
			}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {
		return {
			title: '武工商课表',
			desc: '武工商非官网课表小程序',
			path: 'pages/index/index',
			imageUrl: "https://tva1.sinaimg.cn/large/002ZE6Hrgy1gu4x3ihsqjj60dw0b4myb02.jpg"
		}
	},
	onShareTimeline: function() {
		return {
			title: '武工商课表 - 学生查课助手',
			query: ''
		}
	}
})
