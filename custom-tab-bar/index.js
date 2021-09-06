Component({
	data: {
		selected: 0,
		color: "#7A7E83",
		selectedColor: "#3cc51f",
		list: [{
			pagePath: "/pages/index/index",
			iconPath: "../assets/image/icon_component.png",
			selectedIconPath: "../assets/image/icon_component_HL.png",
			text: "首页"
		}, {
			pagePath: "/pages/addServer/addServer",
			iconPath: "../assets/image/icon_API.png",
			selectedIconPath: "../assets/image/icon_API_HL.png",
			text: "添加服务器"
		}]
	},
	attached() {
		var obj = this.createSelectorQuery();
		obj.select('.tab-bar').boundingClientRect(function(rect) {
			console.log('获取tabBar元素的高度', rect.height);
			wx.setStorageSync('tabBarHeight', rect.height) // 将获取到的高度设置缓存，以便之后使用
		}).exec();
	},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			const url = data.path
			wx.switchTab({
				url
			})
		}
	}
})
