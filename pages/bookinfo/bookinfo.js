// pages/bookinfo/bookinfo.js
const app = getApp()
const api = require('../../libs/api.js');
const ut = require('../../util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		pass: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		this.setData({
			pass: wx.getStorageSync("sfz"),
			uinfo: wx.getStorageSync("info")
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {
		this.initList();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	initList: function() {
		let that = this;
		let sfz = that.data.pass;
		that.setData({
			refreshLoading: true
		})
		if (sfz == "") {
			that.setData({
				refreshLoading: false
			})
		} else {
			setTimeout(() => {
				this.loadmore()
			}, 300)
		}
	},
	loadmore: function() {
		let that = this;
		let data = {
			username: wx.getStorageSync("stuId"),
			password: wx.getStorageSync("sfz")
		};
		api.POST("https://wtbu.miuss.icu/library/info", data)
			.then(result => {
				console.log(result);
				that.setData({
					credit: result.credit,
					detail: result.detail,
					refreshLoading: false
				})
			}).catch(res => {
				console.log("error:" + res.errMsg);
				wx.showToast({
					title: '网络异常请重试',
					icon: 'error',
					duration: 1000,
					mask: true
				})
				that.setData({
					refreshLoading: false
				})
			})
	},
	bindStuBtnClick: function(e) {
		console.log(e)

		if (e.detail.value.username == "") {
			wx.showModal({
				title: '提示',
				content: '学号不能为空'
			})
		} else if (e.detail.value.password == "") {
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
				username: e.detail.value.username,
				password: e.detail.value.password
			};
			console.log(data);
			api.POST("https://wtbu.miuss.icu/library/login", data,).
			then(result => {
				wx.hideLoading()
				console.log(result)
				if (result.status == "error") {
					wx.showModal({
						title: '提示',
						content: result.msg
					})
				} else {
					this.setData({
						pass: e.detail.value.password
					})
					wx.setStorageSync('sfz', e.detail.value.password)
					wx.showToast({
						title: '绑定成功',
						icon: 'success',
						duration: 2000
					})
					this.initList();
				}
			}).catch(function(res) {
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

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	}
})
