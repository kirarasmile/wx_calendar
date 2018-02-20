const conf = {
	/**
	 * 计算指定月份共多少天
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
	getThisMonthDays(year, month) {
		return new Date(year, month, 0).getDate();
	},
	/**
	 * 计算指定月份第一天星期几
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
	getFirstDayOfWeek(year, month) {
		return new Date(Date.UTC(year, month - 1, 1)).getDay();
	},
	/**
	 * 计算日历第一排应该空多少格子
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
	calculateEmptyGrids(year, month) {
		const firstDayOfWeek = conf.getFirstDayOfWeek(year, month);
		let empytGrids = [];
		if (firstDayOfWeek > 0) {
			for (let i = 0; i < firstDayOfWeek; i++) {
				empytGrids.push(i);
			}
			this.setData({
				'calendar.hasEmptyGrid': true,
				'calendar.empytGrids': empytGrids,
			});
		} else {
			this.setData({
				'calendar.hasEmptyGrid': false,
				'calendar.empytGrids': [],
			});
		}
	},
	/**
	 * 设置日历面板数据
	 * @param {number} year 年份
	 * @param {number} month  月份
	 */
	calculateDays(year, month) {
		let days = [];

		const thisMonthDays = conf.getThisMonthDays(year, month);

		for (let i = 1; i <= thisMonthDays; i++) {
			days.push({
				day: i,
				choosed: false
			});
		}

		this.setData({
			'calendar.days': days,
		});
	},
	/**
	 * 切换月份
	 * @param {!object} e 事件对象
	 */
	handleCalendar(e) {
		const handle = e.currentTarget.dataset.handle;
		const curYear = this.data.calendar.curYear;
		const curMonth = this.data.calendar.curMonth;
		if (handle === 'prev') {
			let newMonth = curMonth - 1;
			let newYear = curYear;
			if (newMonth < 1) {
				newYear = curYear - 1;
				newMonth = 12;
			}

			conf.calculateDays.call(this, newYear, newMonth);
			conf.calculateEmptyGrids.call(this, newYear, newMonth);

			this.setData({
				'calendar.curYear': newYear,
				'calendar.curMonth': newMonth,
			});
		} else {
			let newMonth = curMonth + 1;
			let newYear = curYear;
			if (newMonth > 12) {
				newYear = curYear + 1;
				newMonth = 1;
			}

			conf.calculateDays.call(this, newYear, newMonth);
			conf.calculateEmptyGrids.call(this, newYear, newMonth);

			this.setData({
				'calendar.curYear': newYear,
				'calendar.curMonth': newMonth
			});
		}
	},
	/**
	 * 选择具体日期
	 * @param {!object} e  事件对象
	 */
	tapDayItem(e) {
		const idx = e.currentTarget.dataset.idx;
		const days = this.data.calendar.days;
		days[ idx ].choosed = !days[ idx ].choosed;
		this.setData({
			'calendar.days': days,
		});
	},
	/**
	 * 唤起年月选择器
	 */
	chooseYearAndMonth() {
		let pickerYear = [];
		let pickerMonth = [];
		for (let i = 1900; i <= 2100; i++) {
			pickerYear.push(i);
		}
		for (let i = 1; i <= 12; i++) {
			pickerMonth.push(i);
		}
		this.setData({
			'calendar.showPicker': true,
		});
	},
};

function _getCurrentPage() {
	const pages = getCurrentPages();
	const last = pages.length - 1;
	return pages[ last ];
}

export default () => {
	const self = _getCurrentPage();
	const date = new Date();
	const curYear = date.getFullYear();
	const curMonth = date.getMonth() + 1;
	const weeksCh = [ '日', '一', '二', '三', '四', '五', '六' ];
	self.setData({
		calendar: {
			curYear,
			curMonth,
			weeksCh,
			hasEmptyGrid: false,
		}
	});
	conf.calculateEmptyGrids.call(self, curYear, curMonth);
	conf.calculateDays.call(self, curYear, curMonth);
	self.tapDayItem = conf.tapDayItem.bind(self);
	self.handleCalendar = conf.handleCalendar.bind(self);
	self.chooseYearAndMonth = conf.chooseYearAndMonth.bind(self);
};