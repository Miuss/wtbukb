// pages/addServer/addServer.js
const app = getApp()
const api = require('../../../libs/api.js');
const ut = require('../../../util.js');
Component({

	/* 开启全局样式设置 */
	options: {
		addGlobalClass: true,
	},

	/* 组件的属性列表 */
	properties: {
		name: {
			type: String,
			value: 'box'
		},
		isLogin: {
			type: Number,
			value: 0
		},
		uinfo: {
			type: Object,
			value: ''
		},
		bindinfo: {
			type: Object,
			value: ''
		}
	},

	/* 组件的初始数据 */
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
	},

	/* 组件声明周期函数 */
	lifetimes: {
		created: function() {},
		attached: function() {},
		ready: function() {
			let HitoTime = wx.getStorageSync("HitoTime");
			console.log(HitoTime);
			if (HitoTime==""||HitoTime>parseInt(new Date()/86400000)*86400) {
				this.getHitokoto();
			}else {
				this.setData({
					HitoData: wx.getStorageSync("HitoData")
				})
			}
			
		},
		moved: function() {},
		detached: function() {},
	},

	/* 组件的方法列表 */
	methods: {
		toExam() {
			wx.vibrateShort();
			wx.navigateTo({
				url: '/pages/exam/exam',
			})
		},
		getHitokoto() {
			api.GET("https://wtbu.miuss.icu/system/getHitokoto?c=j&time=0", ).
			then(result => {
				if (result.status != "error") {
					console.log(result);
					this.setData({
						HitoData: result.data
					})
					wx.setStorageSync("HitoTime", parseInt(new Date()/86400000)*86400);
					wx.setStorageSync("HitoData", result.data);
				}
			}).catch(function(res) {
				console.log("error:" + res.errMsg);
			})
		}
	}
})
