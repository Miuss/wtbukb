//index.js
//获取应用实例
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
				knowguide: 0,
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
					[1, "8:20", "9:05"],
					[2, "9:15", "10:00"],
					[3, "10:20", "11:05"],
					[4, "11:15", "12:00"],
					[5, "12:10", "12:55"],
					[6, "13:05", "13:50"],
					[7, "14:10", "14:55"],
					[8, "15:05", "15:50"],
					[9, "16:10", "16:55"],
					[10, "17:05", "17:50"],
					[11, "18:30", "19:15"],
					[12, "19:25", "20:10"],
					[13, "20:20", "21:05"]
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
						knowguide: wx.getStorageSync("knowguide")==1?1:0,
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
						console.log(this.data.wlist.length)
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
				knowGuide() {
					this.setData({
						knowguide: 1
					})
					wx.setStorageSync("knowguide", 1);
				},
				getWeekArrays(semester, week) {
					var starttime = this.data.schoolYear.time[semester];
					var now = new Date();
					var nowweek = (now / 1000 - starttime) / 7 / 86400 > 0 && (now / 1000 - starttime) / 7 / 86400 +
						1 <= this.data.wlist.length ? parseInt((now / 1000 - starttime) / 7 / 86400) + 1 : 1;
					var arr = [
						[ut.formatTime(starttime + 7 * (week - 1) * 86400, "M"), 0, "月"],
						["周一", 0, ut.formatTime(starttime + 7 * (week - 1) * 86400, "M/D")],
						["周二", 0, ut.formatTime(starttime + 7 * (week - 1) * 86400 + 86400, "M/D")],
						["周三", 0, ut.formatTime(starttime + 7 * (week - 1) * 86400 + 86400 * 2, "M/D")],
						["周四", 0, ut.formatTime(starttime + 7 * (week - 1) * 86400 + 86400 * 3, "M/D")],
						["周五", 0, ut.formatTime(starttime + 7 * (week - 1) * 86400 + 86400 * 4, "M/D")],
						["周六", 0, ut.formatTime(starttime + 7 * (week - 1) * 86400 + 86400 * 5, "M/D")],
						["周日", 0, ut.formatTime(starttime + 7 * (week - 1) * 86400 + 86400 * 6, "M/D")]
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
					wx.vibrateShort();
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
							mask: true
						})
						api.POST("https://wtbu.miuss.icu/eams/getCourseList?semesterid=" + that.data
							.schoolYear.id[semester], data, ).
						then(result => {
								if (result.status != "error") {
									that.setData({
										wlist: result.data
									})
									var starttime = that.data.schoolYear.time[semester];
									var now = new Date();
									var nowweek = (now / 1000 - starttime) / 7 / 86400 > 0 && (now / 1000 -
											starttime) / 7 / 86400 +
										1 <= result.data.length ? parseInt((now / 1000 - starttime) / 7 /
											86400) + 1 : 1;
									console.log(result);
									wx.setStorageSync("wlist", result.data);
									wx.setStorageSync("week", nowweek);
									wx.setStorageSync("semester", semester);
									that.setData({
										week: nowweek,
										semester: semester,
										weekArrays: that.getWeekArrays(semester, nowweek)
									})
									wx.hideLoading();
									wx.showToast({
										title: "获取课表成功",
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
				}
			})
