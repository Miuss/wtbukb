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
		uid: 0
	},

	/* 组件声明周期函数 */
	lifetimes: {
		created: function() {},
		attached: function() {},
		ready: function() {
		},
		moved: function() {},
		detached: function() {

		},
	},

	/* 组件的方法列表 */
	methods: {
		
	}
})
