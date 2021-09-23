const app = getApp();
const api = require('../../libs/api.js');
Component({
	/**
	 * 组件的一些选项
	 */
	options: {
		addGlobalClass: true,
		multipleSlots: true
	},
	/**
	 * 组件的对外属性
	 */
	properties: {
		bgColor: {
			type: String,
			default: ''
		},
		isHome: {
			type: [Boolean, String],
			default: false
		},
		isSwitchBar: {
			type: [Boolean, String],
			default: false
		},
		isCustom: {
			type: [Boolean, String],
			default: false
		},
		hideAction: {
			type: [Boolean, String],
			default: false
		},
		isBack: {
			type: [Boolean, String],
			default: false
		},
		semester: {
			type: Number,
			default: 0
		},
		timeTable: {
			type: Number,
			default: 0
		},
		bgImage: {
			type: String,
			default: ''
		},
		ServerInfo: {
			type: [Boolean, String, Object],
			default: {}
		},
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		Custom: app.globalData.Custom,
		SchoolYear: {"year":["2017-2018年上学期","2017-2018年下学期","2018-2019年上学期","2018-2019年下学期","2019-2020年上学期","2019-2020年下学期","2020-2021年上学期","2020-2021年下学期","2021-2022年上学期"],"id":[10,29,11,30,12,31,47,48,62],"time":[1630684800,1614787200,1630684800,1614787200,1630684800,1614787200,1630684800,1614787200,1630684800]},
		weekPicker: ["第一周", "第二周","第三周","第四周","第五周","第六周","第七周","第八周","第九周","第十周","第十一周","第十二周","第十三周","第十四周","第十五周","第十六周","第十七周","第十八周","第十九周","第二十周"],
	},
	/**
	 * 组件的方法列表
	 */
	methods: {
		BackPage() {
			wx.vibrateShort();
			wx.navigateBack({
				delta: 1
			});
		},
		toHome() {
			wx.vibrateShort();
			wx.reLaunch({
				url: '/pages/index/index',
			})
		},
		toMsg() {
			wx.vibrateShort();
			wx.navigateTo({
				url: '/pages/message/message',
			})
		},
		switchWeek(e) {
			wx.vibrateShort();
			this.setData({
				semester: e.detail.value
			})
			wx.setStorage({
				key: "semester",
				data: e.detail.value
			})
			this.triggerEvent('switchSemester',{semester: e.detail.value})
		}
	}
})
