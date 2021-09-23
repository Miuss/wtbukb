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
			"iconPath": "/assets/image/class.svg",
			"selectedIconPath": "/assets/image/class_active.svg",
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
			if (swichId == 0) {
				let home = that.selectComponent("#home");
				home.updateClassList();
			}
			if (swichId == 1) {
				if (!that.data.uinfo || !that.data.bindinfo.info) {
					that.setData({
						currentTab: 2
					})
					wx.showToast({
						title: '登录并绑定教务后才能查看课表',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				} else {
					let index = that.selectComponent("#index");
					if (index.data.wlist.length == 0 && that.data.bindinfo) {
						index.getTimeTable(index.data.schoolYear.id.length - 1)
					}
				}
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
					mask: true
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
					duration: 1000,
					mask: true
				})
			}
		})
	},
	userLogout: function(e) {
		let that = this;
		wx.showModal({
			title: '账号登出提示',
			content: '您确定要登出账号？',
			success(res) {
				if (res.confirm) {
					wx.removeStorageSync('uinfo')
					wx.removeStorageSync('stuId')
					wx.removeStorageSync('pass')
					wx.removeStorageSync('info')
					wx.removeStorageSync('wlist')
					that.setData({
						uinfo: '',
						stuId: '',
						bindinfo: {
							stuId: '',
							pass: '',
							info: '',
						}
					})
					let index = that.selectComponent("#index");
					index.setData({
						wlist: '',
						week: 0,
						semester: 8,
						weekArrays: []
					})
					wx.showToast({
						title: '成功登出',
						icon: 'none',
						duration: 1000,
						mask: true
					})
				}
			}
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
						duration: 1000,
						mask: true
					})
					that.setData({
						stuId: '',
						bindinfo: {
							stuId: '',
							pass: '',
							info: '',
						}
					})
					wx.removeStorageSync('stuId')
					wx.removeStorageSync('pass')
					wx.removeStorageSync('info')
					wx.removeStorageSync('wlist')
					let index = that.selectComponent("#index");
					index.setData({
						wlist: '',
						week: 0,
						semester: 8,
						weekArrays: []
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
				mask: true
			})
			let data = {
				username: e.detail.username,
				password: e.detail.password
			};
			console.log(data);
			api.POST("https://wtbu.miuss.icu/user/login", data, ).
			then(result => {
				wx.hideLoading()
				console.log(result)
				if (result.status == "error") {
					wx.showModal({
						title: '提示',
						content: result.msg
					})
					wx.reportEvent("getcourselist", {
					  "status": "error"
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
					wx.reportEvent("getcourselist", {
					  "status": "success"
					})
				}
			}).catch(function(res) {
				console.log("error:" + res.errMsg);
				wx.hideLoading()
				wx.showToast({
					title: '网络异常请重试',
					icon: 'error',
					duration: 1000,
					mask: true
				})
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
