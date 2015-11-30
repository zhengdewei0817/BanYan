/**
 * @author Charles TCZC
 *
 * @example
 *
 * <input type="text" id="calendar" />
 *
 *
 *
 *	new Calendar('#calendar').setConfig({
 *		format: 'YYYY-MM',
 *		min: '2015-11-25',
 *	    max: '2099-06-16 23:59:59',
 *	    eventType: 'focus',
 *	    choose: (d) => {this.debug(d)}
 *	}).run();
 *
 */
import Emitter from '../lib/emitter';
const DEFAULT = {
    // 日期的格式
    format: 'YYYY-MM-DD',
    //最小日期
    min: '1900-01-01 00:00:00',
    //最大日期
    max: '2099-12-31 23:59:59',
    eventType: 'focus',
    template: `
    <div class="tc-calendar">
        <div class="tc-range-switcher">
            <div class="tc-switcher tc-year-switcher">
                <i class="tc-left" data-type="1"></i>
                <input type="text" name="month" readonly value="<%= year %>"/>
                <ul class="tc-year">
                    <%=years%>
                </ul>
                <i class="tc-right"></i>
            </div>
            <div class="tc-switcher tc-month-switcher">
                <i class="tc-left" data-type="1"></i>
                <input type="text" name="month" readonly value="<%= month+1 %>"/>
                <div class="tc-month">
                    <%=monthTmp%>
                </div>
                <i class="tc-right"></i>
            </div>
        </div>
        <ul class="tc-days-of-week-list">
            <li class="tc-day-of-week">日</li>
            <li class="tc-day-of-week">一</li>
            <li class="tc-day-of-week">二</li>
            <li class="tc-day-of-week">三</li>
            <li class="tc-day-of-week">四</li>
            <li class="tc-day-of-week">五</li>
            <li class="tc-day-of-week">六</li>
        </ul>
        <ul class="tc-day-list">
            <%= dayTmp %>
        </ul>
    </div>
    `,
    choose: ()=>{}
};

class Calendar extends Emitter {
    constructor(el) {
        super(el);
        this.el = $(el);
        this.elValue = /textarea|input/.test(el[0].tagName.toLocaleLowerCase()) ? 'value' : 'innerHTML';

        this.now = new Date();
        this.today = this.util.dates.format(this.now);
        this.nowHMS = this.today.split(/\s/)[1];

        this.data = {
            today: this.today,
            nowYear: this.now.getFullYear(),
            nowMonth: this.now.getMonth(),
            nowDate: this.now.getDate(),
            nowHMS: this.nowHMS
        };

        this.config = DEFAULT;
    }

    /**
     * 改配置
     * @param config
     * @returns {Calendar}
     */
    setConfig(config) {
        this.config = $.extend({}, DEFAULT, config);
        return this;
    }

    /**
     * 获取默认参数的值
     */
    getDefaultVal() {
        let value = this.getElementVal();
        let now = this.now;
        let ymd = !value ? [now.getFullYear(), now.getMonth() + 1, now.getDate()] : this.getNumber(this.getElementVal().match(/\d+/g) || []);
        if (ymd.length < 3) {
            ymd = this.config.start.match(/\d+/g) || [];
            if (ymd.length < 3) {
                ymd = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
            }
        }
        ymd[1] && (ymd[1] = ymd[1] - 1);
        this.defaultVal = ymd;
    }

    /**
     * 初始化
     */
    init() {
        this.mins = this.getNumber(this.config.min.match(/\d+/g));
        this.maxs = this.getNumber(this.config.max.match(/\d+/g));
        // 事件绑定
        this.events[this.config.eventType] = 'onElement';
    }

    /**
     * 事件绑定
     */
    onEvent() {
        // 点击空白消失
        $(document).on('click', (evt) => {
            const node = $(evt.target);
            if(evt.target !== this.el[0] && !node.parents('.tc-calendar').length){
                const $this = this.box;
                if($this && !$this.is(':hidden')){
                    this.hide();
                }
            }
        });

        this.box.on('click', '.tc-day-list li', (evt) => {
            evt.stopPropagation();
            const $this = $(evt.target);
            if ($this.hasClass('tc-disabled')) return;
            let _date = $this.data('date');
            let hms = $this.data('hms') || '00:00:00';
            this.creation(_date, hms);
            this.setElementVal(this.valueData);
            this.hide();
            return false;
        });

        this.box.on('click', '.tc-year-switcher i', (evt) => {
            evt.stopPropagation();
            const $this = $(evt.target);
            let type = $this.data('type');
            this.tabYear(type).reRender();
            return false;
        });

        this.box.on('focus', '.tc-year-switcher input', (evt) => {
            evt.stopPropagation();
            let yearNode = $(evt.target).siblings('.tc-year');
            yearNode.show();
            return this;
        });
        this.box.on('click', '.tc-year-switcher li', (evt) => {
            evt.stopPropagation();
            const $this = $(evt.target);
            if ($this.hasClass('tc-disabled')) return;
            this.data.year = $this.data('year');
            this.reRender();
            return false;
        });

        this.box.on('click', '.tc-month-switcher i', (evt) => {
            evt.stopPropagation();
            let type = $(evt.target).data('type');
            this.tabMonth(type).reRender();
            return false;
        });
        this.box.on('focus', '.tc-month-switcher input', (evt) => {
            evt.stopPropagation();
            let yearNode = $(evt.target).siblings('.tc-month');
            yearNode.show();
            return false;
        });
        this.box.on('click', '.tc-month-switcher span', (evt) => {
            evt.stopPropagation();
            const $this = $(evt.target);
            if ($this.hasClass('tc-disabled')) return;
            this.data.month = $this.data('month');
            this.reRender();
            return false;
        });
    }

    /**
     * 元素触发后，显示日历控件
     * @param event
     */
    onElement(event) {
        event.stopPropagation();
        this.getDefaultVal();
        this.viewDate(this.defaultVal[0], this.defaultVal[1], this.defaultVal[2]);
        this.viewMonth();
        this.viewYear(this.defaultVal[0]);
        this.view().show();
        // 事件绑定只绑定一次
        if(!this.flag){
            this.onEvent();
        }
        this.flag = true;
    }

    /**
     * 重写渲染
     * @returns {Calendar}
     */
    reRender() {
        this.viewDate(this.data.year, this.data.month, this.data.day).view();
        return this;
    }

    /**
     * 切换年
     * @param type
     */
    tabYear(type) {
        if (!type) {
            this.data.year++;
        } else {
            this.data.year--;
        }
        return this;
    }

    /**
     * 切换月
     */
    tabMonth(type) {
        if (!type) {
            this.data.month++;
            if (this.data.month === 12) {
                this.data.year++;
                this.data.month = 0;
            }
        } else {
            this.data.month--;
            if (this.data.month === -1) {
                this.data.year--;
                this.data.month = 11;
            }
        }
        return this;
    }

    /**
     * 渲染日历
     * @returns {Calendar}
     */
    view() {
        const box = this.box;
        let calendarTmp = this.tpl(this.config.template, this.data);
        if (!box) {
            this.debug(this.data);
            this.box = $('<div></div>');
            this.box.html(calendarTmp);
            $('body').append(this.box);
        } else{
            this.box.html(calendarTmp);
        }
        this.follow();
        return this;
    }

    /**
     * 日期渲染
     * @param Y
     * @param M
     * @param D
     * @returns {Calendar}
     */
    viewDate(Y, M, D) {
        let now = new Date();
        // 如果超过阀值不渲染
        Y < (this.mins[0] | 0) && (Y = (this.mins[0] | 0));
        Y > (this.maxs[0] | 0) && (Y = (this.maxs[0] | 0));

        now.setFullYear(Y, M, D);
        let ymd = [now.getFullYear(), now.getMonth(), now.getDate()];
        let monthDays = this.util.dates.daysInMonth(ymd[1], ymd[0]);

        now.setFullYear(ymd[0], ymd[1], 1);
        // 获取当前月1号是星期几
        let FDay = now.getDay();
        // 获取当前月天数
        let PDay = monthDays;
        // 补全缺失的格子
        let empty = PDay;
        while (empty > 7) {
            empty -= 7;
        }
        // TODO: 这里需要对时间进行校验所以需要写到这里
        this.data.daysNum = PDay + 7 - empty;
        let dayTmpArr = [];
        for (let i = 0; i < this.data.daysNum; i++) {
            let d = 1 + (i - FDay);
            // 当前日期和天数要对上
            // 当前循环的数要小于当前月1一天的星期
            if (d > PDay || i < FDay) {
                dayTmpArr.push(`<li class="tc-day tc-diabled tc-fade"></li>`);
            } else {
                let isDisabled = this.checkValidity(ymd[0], ymd[1] + 1, d)[0];
                if (isDisabled) {
                    dayTmpArr.push(`<li class="tc-day tc-diabled tc-fade">${d}</li>`);
                } else if (this.defaultVal[0] === ymd[0] && this.defaultVal[1] === ymd[1] && this.defaultVal[2] === d) {
                    dayTmpArr.push(`<li data-date="${ymd[0]}-${ymd[1] + 1}-${d}" class="tc-day tc-selected">${d}</li>`);
                } else if (this.data.nowYear === ymd[0] && this.data.nowMonth === ymd[1] && this.data.nowDate === d) {
                    dayTmpArr.push(`<li data-date="${ymd[0]}-${ymd[1] + 1}-${d}" class="tc-day tc-current">${d}</li>`);
                } else {
                    dayTmpArr.push(`<li data-date="${ymd[0]}-${ymd[1] + 1}-${d}" class="tc-day">${d}</li>`);
                }
            }
        }

        this.data.dayTmp = dayTmpArr.join('');
        this.data.PDay = PDay;
        this.data.FDay = FDay;
        this.data.year = ymd[0] | 0;
        this.data.month = ymd[1] | 0;
        this.data.day = ymd[2] | 0;
        return this;
    }

    /**
     * 获取年份
     * @param YY
     * @returns {Calendar}
     */
    viewMonth() {
        let months = [];
        for (var i = 0; i < 12; i++) {
            let isDisabled = this.checkValidity(this.data.year, i + 1)[0];
            if(isDisabled === 'y' || isDisabled === 'm'){
                months.push(`<span data-month="${i}" class="tc-disabled">${i+1}</span>`);
            } else if(this.data.month === i){
                months.push(`<span data-month="${i}" class="tc-selected">${i+1}</span>`);
            } else {
                months.push(`<span data-month="${i}">${i+1}</span>`);
            }
        }
        this.data.monthTmp = months.join('');
        return this;
    }

    /**
     * 获取年份
     * @param YY
     * @returns {Calendar}
     */
    viewYear(YY) {
        let years = [];
        for (var i = 0; i < 14; i++) {
            let year = i === 7 ? (YY | 0) : (YY - 7 + i);
            let isDisabled = this.checkValidity(year)[0];
            if(isDisabled === 'y'){
                years.push(`<li data-year="${year}" class="tc-disabled">${year}</li>`);
            } else if(this.data.year === year){
                years.push(`<li data-year="${year}" class="tc-selected">${year}</li>`);
            } else{
                years.push(`<li data-year="${year}">${year}</li>`);
            }
        }
        this.data.years = years.join('');
        return this;
    }

    /**
     * 显示日历控件
     * @returns {Calendar}
     */
    show() {
        this.box.removeClass('hide');
        return this;
    }

    /**
     * 隐藏日历控件
     * @returns {Calendar}
     */
    hide() {
        this.box.addClass('hide');
        return this;
    }

    /**
     * 获取元素的值
     * @returns {*}
     */
    getElementVal() {
        return this.elValue === 'value' ? this.el.val() : this.el.text();
    }

    /**
     * 给el写入日期
     * @param str
     * @returns {Calendar}
     */
    setElementVal(str) {
        this.elValue === 'value' ? this.el.val(str) : this.el.text(str);
        return this;
    }

    /**
     * 检查日期有效性
     * @param YY
     * @param MM
     * @param DD
     * @returns {*}
     */
    checkValidity(YY, MM, DD) {
        YY = YY | 0;
        MM = MM | 0;
        DD = DD | 0;

        let back = [];
        if (YY < this.mins[0]) {
            return back = ['y'];
        }

        if (YY > this.maxs[0]) {
            return back = ['y', 1];
        }

        if (YY >= this.mins[0] && YY <= this.maxs[0]) {
            if (YY === this.mins[0]) {
                if (MM < this.mins[1]) {
                    back = ['m'];
                } else if (MM === this.mins[1]) {
                    if (DD < this.mins[2]) {
                        back = ['d'];
                    }
                }
            }
            if (YY === this.maxs[0]) {
                if (MM > this.maxs[1]) {
                    back = ['m', 1];
                } else if (MM === this.maxs[1]) {
                    if (DD > this.maxs[2]) {
                        back = ['d', 1];
                    }
                }
            }
        }
        return back;

    }

    /**
     * 最终返回的值
     * @param ymd
     * @param hms
     * @returns {*}
     */
    creation(ymd, hms) {
        let value = this.valueData = this.util.dates.parse(ymd, hms, this.config.format);
        this.config.choose.call(this, value);
    }

    /**
     * 时间戳转日期
     * @returns {*}
     */
    timestampToDate(timestamp, format) {
        let d = new Date((timestamp|0) ? function(tamp){
            return tamp < 86400000 ? (+new Date + tamp*86400000) : tamp;
        }(parseInt(timestamp)) : +new Date);
        return this.util.dates.parse(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`, `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`, format);
    }

    /**
     * input跟随
     * @returns {Calendar}
     */
    follow() {
        const el = this.box.find('.tc-calendar');
        const offset = this.el.offset();
        el.css({
            top: offset.top + this.el.innerHeight(),
            left: offset.left
        });
        return this;
    }

    /**
     * 数组项转换为数字
     * @param arr
     * @returns {Array.<T>}
     */
    getNumber(arr = []) {
        var newArr = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            newArr.push(arr[i]|0);
        }

        return newArr.reverse();
    }
}

export default Calendar;