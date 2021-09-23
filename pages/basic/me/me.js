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
			value: 'me'
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
		},
		modalName: {
			type: String,
			value: null
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
			console.log(this.data.uinfo)
			console.log(this.data.bindinfo)
		},
		moved: function() {},
		detached: function() {

		},
	},

	/* 组件的方法列表 */
	methods: {
		toAbout() {
			wx.vibrateShort();
			wx.navigateTo({
				url: '/pages/about/about',
			})
		},
		showQrcode() {
			wx.vibrateShort();
			wx.previewImage({
				urls: ['https://wtbu.miuss.icu/Pay.jpg'],
				current: 'https://wtbu.miuss.icu/Pay.jpg'
			})
		},
		showQQQrcode() {
			wx.vibrateShort();
			wx.previewImage({
				urls: ['https://tva1.sinaimg.cn/large/002ZE6Hrgy1gu62bz7vxdj606a082dgt02.jpg'],
				current: 'https://tva1.sinaimg.cn/large/002ZE6Hrgy1gu62bz7vxdj606a082dgt02.jpg'
			})
		},
		myServers(e) {
			wx.vibrateShort();
			wx.navigateTo({
				url: '/pages/me/myservers/myservers'
			})
		},
		followServers(e) {
			wx.vibrateShort();
			wx.navigateTo({
				url: '/pages/me/myfollowservers/myfollowservers'
			})
		},
		CopyLink(e) {
			wx.vibrateShort();
			wx.setClipboardData({
				data: e.currentTarget.dataset.link,
				success: res => {
					wx.showToast({
						title: '已复制',
						duration: 1000,
					})
				}
			})
		},
		showModal(e) {
			this.setData({
				modalName: e.currentTarget.dataset.target
			})
		},
		hideModal(e) {
			this.setData({
				modalName: null
			})
		},
		userLogin(e) {
			wx.vibrateShort();
			this.triggerEvent('userLogin')
		},
		userLogout(e) {
			wx.vibrateShort();
			this.triggerEvent('userLogout')
		},
		bindStuBtnClick(data) {
			wx.vibrateShort();
			this.triggerEvent('bindStuBtnClick',data.detail.value)
		},
		unbindStuBtnClick() {
			wx.vibrateShort();
			this.triggerEvent('unbindStuBtnClick')
		}
	}
})
