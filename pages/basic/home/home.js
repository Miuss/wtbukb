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
			value: 'home'
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
		colorArrays: ["#f05261", "#48a8e4", "#ffd061", "#52db9a", "#70d3e6", "#52db9a", "#3f51b5", "#f3d147",
			"#4adbc3", "#673ab7", "#f3db49", "#76bfcd", "#b495e1", "#ff9800", "#8bc34a"
		],
		schoolYear: {
			"year": ["2017-2018年上学期", "2017-2018年下学期", "2018-2019年上学期", "2018-2019年下学期", "2019-2020年上学期",
				"2019-2020年下学期", "2020-2021年上学期", "2020-2021年下学期", "2021-2022年上学期"
			],
			"id": [10, 29, 11, 30, 12, 31, 47, 48, 62],
			"time": [1630857600, 1614787200, 1630857600, 1614787200, 1630857600, 1614787200, 1630857600,
				1614787200, 1630857600
			]
		},
		timeArrays: [
			[1, "8:20"],
			[2, "9:15"],
			[3, "10:20"],
			[4, "11:15"],
			[5, "12:10"],
			[6, "13:05"],
			[7, "14:10"],
			[8, "15:05"],
			[9, "16:10"],
			[10, "17:05"],
			[11, "18:30"],
			[12, "19:25"],
			[13, "20:20"]
		],
		adDisplay: true,
	},

	/* 组件声明周期函数 */
	lifetimes: {
		created: function() {},
		attached: function() {},
		ready: function() {
			this.updateClassList();
		},
		moved: function() {},
		detached: function() {},
	},

	/* 组件的方法列表 */
	methods: {
		updateClassList() {
			let wlist = wx.getStorageSync("wlist")
			if (wlist) {
				this.setData({
					wlist: wlist,
					semester: wx.getStorageSync("semester")
				})
			}
			if (!this.data.bindinfo.info || !this.data.uinfo || wlist.length == 0) {
				this.setData({
					week: 0,
					classArr: []
				})
			} else {
				var starttime = this.data.schoolYear.time[this.data.semester];
				var now = new Date();
				var nowweek = (now / 1000 - starttime) / 7 / 86400 > 0 && (now / 1000 - starttime) / 7 / 86400 +
					1 <= this.data.wlist.length ? parseInt((now / 1000 - starttime) / 7 / 86400) + 1 : 1;
				let classArr = [];
				let nowtimeline = (now / 1000) % 86400
				this.data.wlist[nowweek - 1].forEach((val, key) => {
					if (val.xqj == this.getNowDay()) {
						classArr.push({
							class: val,
							index: key
						});
					}
				})
				classArr.sort((a, b)=>{
					return a.class.skjc - b.class.skjc
				});
				this.setData({
					classArr: classArr,
					week: nowweek
				})
			}
		},
		getNowDay() {
			let now = new Date();
			let day = now.getDay();
			if (day == 0) {
				return 7;
			} else {
				return day;
			}
		},
		swichNav: function(e) {
			wx.vibrateShort();
			this.triggerEvent('swichNav', {
				swich: 2
			})
		},
		showCardView(e) {
			wx.vibrateShort();
			var info = e.currentTarget.dataset;
			wx.showModal({
				title: info.kcmc,
				content: info.room + "\n" + info.teachers,
				confirmText: "知道了",
				showCancel: false
			})
		},
	}
})
