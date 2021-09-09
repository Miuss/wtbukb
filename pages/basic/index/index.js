//index.js
//获取应用实例
const app = getApp()
const api = require('../../../libs/api.js');
const ut = require('../../../util.js');
Component({

	/* 开启全局样式设置 */
	options: {
		addGlobalClass: false,
	},

	/* 组件的属性列表 */
	properties: {
		name: {
			type: String,
			value: 'index'
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
		week: 1,
		semester: 8,
		tabbarHeight: 0,
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
		weekArrays: [],
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
		wlist: []
	},

	/* 组件声明周期函数 */
	lifetimes: {
		created: function() {},
		attached: function() {
			let wlist = wx.getStorageSync("wlist")
			if (!wlist) {
				this.getTimeTable(this.data.semester);
			} else {
				this.setData({
					wlist: wlist,
					semester: wx.getStorageSync("semester")
				})
			}
			this.setData({
				tabBarHeight: wx.getStorageSync("tabBarHeight"),
				wlistItemWidth: (app.globalData.windowWidth - 32) / 7
			})
		},
		ready: function() {
			if (!this.data.bindinfo.info || !this.data.uinfo) {
				this.setData({
					week: 0
				})
			} else {
				console.log(this.data.semester)
				var starttime = this.data.schoolYear.time[this.data.semester];
				var now = new Date();
				var nowweek = (now / 1000 - starttime) / 7 / 86400 > 0 && (now / 1000 - starttime) / 7 /
					86400 + 1 <= this.data.wlist.length ? parseInt((now / 1000 - starttime) / 7 / 86400) +
					1 : 1;
				this.setData({
					weekArrays: this.getWeekArrays(this.data.semester, nowweek),
					week: nowweek
				})
			}
		},
		moved: function() {},
		detached: function() {},
	},

	/* 组件的方法列表 */
	methods: {
		getWeekArrays(semeter, week) {
			var starttime = this.data.schoolYear.time[semeter];
			var now = new Date();
			var nowweek = (now / 1000 - starttime) / 7 / 86400 > 0 && (now / 1000 - starttime) / 7 / 86400 +
				1 <= this.data.wlist.length ? parseInt((now / 1000 - starttime) / 7 / 86400) + 1 : 1;
			var arr = [
				[ut.formatTime(starttime + 7 * (week - nowweek) * 86400, "M"), 0, "月"],
				["周一", 0, ut.formatTime(starttime + 7 * (week - nowweek) * 86400, "M/D")],
				["周二", 0, ut.formatTime(starttime + 7 * (week - nowweek) * 86400 + 86400, "M/D")],
				["周三", 0, ut.formatTime(starttime + 7 * (week - nowweek) * 86400 + 86400 * 2, "M/D")],
				["周四", 0, ut.formatTime(starttime + 7 * (week - nowweek) * 86400 + 86400 * 3, "M/D")],
				["周五", 0, ut.formatTime(starttime + 7 * (week - nowweek) * 86400 + 86400 * 4, "M/D")],
				["周六", 0, ut.formatTime(starttime + 7 * (week - nowweek) * 86400 + 86400 * 5, "M/D")],
				["周日", 0, ut.formatTime(starttime + 7 * (week - nowweek) * 86400 + 86400 * 6, "M/D")]
			];
			if (week == nowweek) {
				var day = now.getDay();
				if (day == 0) {
					arr[7][1] = 1;
				} else {
					arr[day][1] = 1;
				}
			}
			return arr;
		},
		showCardView(e) {
			var info = e.currentTarget.dataset;
			wx.showModal({
				title: info.kcmc,
				content: info.room + "\n" + info.teachers,
				confirmText: "知道了",
				showCancel: false
			})
		},
		switchSemester(e) {
			this.getTimeTable(e.detail.semester)
		},
		changeWeek(e) {
			this.setData({
				week: e.detail.current + 1
			})
			this.setData({
				weekArrays: this.getWeekArrays(this.data.semester, e.detail.current + 1)
			})
		},
		getTimeTable(semester) {
			let that = this;
			let data = {
				username: wx.getStorageSync("stuId"),
				password: wx.getStorageSync("pass")
			};
			if (data.username != "" && data.password != "") {
				wx.showLoading({
					title: '课表载入中',
				})
				api.POST("https://wtbukb.miuss.mcrealms.cn/api/?act=wxcourse&semesterid=" + that.data
					.schoolYear.id[semester], data, ).
				then(result => {
					if (result.status != "error") {
						var starttime = that.data.schoolYear.time[semester];
						var now = new Date();
						var nowweek = (now / 1000 - starttime) / 7 / 86400 > 0 && (now / 1000 -
							starttime) / 7 / 86400 + 1 <= this.data.wlist.length ? parseInt((
							now / 1000 - starttime) / 7 / 86400) + 1 : 1;
						wx.setStorageSync("wlist", that.conform(result.data));
						wx.setStorageSync("week", nowweek);
						wx.setStorageSync("semester", semester);
						that.setData({
							wlist: that.conform(result.data),
							week: nowweek,
							semester: semester,
							weekArrays: that.getWeekArrays(semester, nowweek)
						})
						console.log(that.data)
						wx.hideLoading();
						wx.showToast({
							title: "获取课表成功",
							icon: 'success',
							duration: 1000
						})
					} else {
						wx.hideLoading()
						wx.showToast({
							title: result.msg,
							icon: 'error',
							duration: 1000
						})
					}
				})
			}
		},
		conform(timeTable) {
			let len = timeTable.length;
			var newCourses = []; //整合后的数组数据
			let temp = 1;
			let skcd = 1;
			for (let j = 0; j < len; j++) {
				var weekCourses = []; //整合后的数组数据
				for (let i = 0; i < timeTable[j].length;) {
					if (timeTable[j][i + temp] && timeTable[j][i].xqj == timeTable[j][i + temp].xqj &&
						timeTable[j][i].kcmc == timeTable[j][i + temp].kcmc && timeTable[j][i + temp].skjc -
						1 == timeTable[j][i + temp - 1].skjc && timeTable[j][i].room == timeTable[j][i + temp]
						.room) {
						temp++; //外层循环跳过重复的数据
						skcd++; //节点数增加
						continue;
					}
					var newCourse = {
						"xqj": timeTable[j][i].xqj,
						"skjc": timeTable[j][i].skjc,
						"skcd": skcd,
						"kcmc": timeTable[j][i].kcmc,
						"room": timeTable[j][i].room,
						"teachers": timeTable[j][i].teachers
					}
					weekCourses.push(newCourse);
					i += temp; //跳过后面连续且相同的课程
					temp = 1;
					skcd = 1;
				}
				newCourses.push(weekCourses);
			}
			return newCourses;
		}
	}
})
