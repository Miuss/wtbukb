const app = getApp()
const api = require('../../libs/api.js');
const ut = require('../../util.js');
Page({

	data: {
		list: [],
		pageIndex: 0,
		pageSize: 20,
		noData: false, //上拉加载更多的loading
		refreshLoading: false //下拉刷新页面的loading
	},
	onLoad: function() {
		this.initList()

		//用来试验主动触发
		// setTimeout(() => {
		//   this.selectComponent('.list').forceRefresh()
		// }, 4000)
	},
	initList: function() {
		this.setData({
			refreshLoading: true,
		})
		setTimeout(() => {
			this.setData({
				list: [],
				pageIndex: 0,
				refreshLoading: false,
			})
			this.loadmore()
		}, 500)
	},
	loadmore: function() {
		//过长的list需要做二维数组，因为setData一次只能设置1024kb的数据量，如果过大的时候，就会报错
		//二维数组每次只设置其中一维，所以没有这个问题
		let nowList = `list[${this.data.list.length}]`
		let page = ++this.data.pageIndex;
		let num = this.data.pageSize;
		api.GET("https://wtbu.miuss.icu/system/getNotices?page=" + page +
			"&pagenum=" + num, {}, ).
		then(result => {
			console.log(result)
			if (result.code == 1000) {
				result.data.forEach(function(item, index) {
					result.data[index].updatetime = ut.formatTime(item.updatetime,
						"M月D日 h:m")
				});
				this.setData({
					[nowList]: result.data,
					noData: result.data.length != this.data.pageSize
				})
			}
		}).catch(res => {
			console.log("error:" + res.errMsg);
			this.setData({
				refreshLoading: false,
			})
			wx.hideLoading()
			wx.showToast({
				title: '网络异常请重试',
				icon: 'error',
				duration: 1000,
				mask: true
			})
		}).catch(function(res) {
			console.log("error:" + res.errMsg);
			this.setData({
				refreshLoading: false,
			})
			wx.hideLoading()
			wx.showToast({
				title: '网络异常请重试',
				icon: 'error',
				duration: 1000,
				mask: true
			})
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

	}
})
