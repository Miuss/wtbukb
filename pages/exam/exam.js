// pages/eaxm/eaxm.js
const app = getApp()
const api = require('../../libs/api.js');
const ut = require('../../util.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		got: false,
		semester: 8,
		colorArrays: ["#f05261", "#48a8e4", "#ffd061", "#52db9a", "#70d3e6", "#52db9a", "#3f51b5", "#f3d147",
			"#4adbc3", "#673ab7", "#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a"
		],
		SchoolYear: {
			"year": ["2017-2018年上学期", "2017-2018年下学期", "2018-2019年上学期", "2018-2019年下学期", "2019-2020年上学期",
				"2019-2020年下学期", "2020-2021年上学期", "2020-2021年下学期", "2021-2022年上学期(本学期)"
			],
			"id": [10, 29, 11, 30, 12, 31, 47, 48, 62],
			"time": [1630684800, 1614787200, 1630684800, 1614787200, 1630684800, 1614787200, 1630684800,
				1614787200, 1630684800
			]
		},
		list: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

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

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	getExamList(e) {
		let that = this;
		let data = {
			username: wx.getStorageSync("stuId"),
			password: wx.getStorageSync("pass")
		};
		if (data.username != "" && data.password != "") {
			wx.showLoading({
				title: '考试查询中',
				mask: true
			})
			api.POST("https://wtbu.miuss.icu/eams/getExamList?semesterid=" + that.data
				.SchoolYear.id[e.detail.value], data, ).
			then(result => {
				if (result.status != "error") {
					that.setData({
						got: true,
						semester: e.detail.value,
						list: result.data
					})
					wx.hideLoading();
					wx.showToast({
						title: "查询成功",
						icon: 'success',
						duration: 1000,
						mask: true
					})
				} else {
					wx.hideLoading()
					wx.showToast({
						title: result.msg,
						icon: 'error',
						duration: 1000,
						mask: true
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
	}
})
