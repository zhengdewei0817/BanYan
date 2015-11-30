import Emitter from '../lib/emitter';

const DEFAULT = {
    //  是否自动播放
    autoplay: false,

    //  延迟3秒播放
    delay: 3000,

    //  动画切换速度
    speed: 750,

    // 动画效果
    easing: 'swing', // [.42, 0, .58, 1],

    //  是否显示menu
    nav: true,

    //  左右按钮
    arrows: {
        prev: '<a class="tc-slider-arrow prev">←</a>',
        next: '<a class="tc-slider-arrow next">→</a>'
    },

    //  动画执行的方法 fade|horizontal|vertical
    animation: 'horizontal',
    // slider结构
    selectors: {
        container: 'ul:first',
        slides: 'li'
    },

    //  Active class for the nav
    activeClass: 'tc-slider-active',

    //  initSwipe/destroySwipe later on.
    swipe: true
};

class Slider extends Emitter {
    constructor(el) {
        super(el);
        this.el = $(el);

        this.total = 0;
        this.current = 0;
        this.arrowsArr = [];
        this.__interval = null;
        this.events = {
            'click .tc-slider-nav-li': 'onNav'
        };
    }
    // 增加配置
    setConfig(config) {
        this.config = $.extend({}, DEFAULT, config);
        return this;
    }

    init() {
        this.container = this.el.find(this.config.selectors.container).addClass('tc-slider-wrap');
        this.slides = this.container.find(this.config.selectors.slides);
        this.width = this.config.width || this.slides.eq(0).width();
        this.total = this.slides.length;

        this.el.addClass(`tc-slider-${this.config.animation}`);

        this.config.nav && this.initNav();
        this.config.arrows && this.initArrows();

        this.config.autoplay && this.play();

        if(this.config.animation !== 'fade') {
            let prop = 'width';

            if(this.config.animation === 'vertical') {
                prop = 'height';
            }

            this.container.css(prop, (this.total * this.width)).addClass('tc-slider-carousel');
            this.slides.css(prop, this.width);
        }

        return this.animate(this.config.index || this.current, 'init');
    }

    initNav() {
        const nav = $('<div class="tc-slider-nav"><ol /></div>');
        this.slides.each(function(index){
            const $this = $(this);
            let label = $this.data('nav') || index + 1;
            nav.children('ol').append(`<li class="tc-slider-nav-li" data-slide="${index}">${label}</li>`);
        });

        this.nav = nav.insertAfter(this.el);
    }

    onNav(evt) {
        const $this = $(evt.target);
        $this.addClass(this.config.activeClass).siblings().removeClass(this.config.activeClass);
        this.animate($this.data('slide'));
    }

    initArrows() {
        $.each(this.config.arrows, (key, val) => {
            //  Add our arrow HTML and bind it
            this.arrowsArr.push(
                $(val).insertAfter(this.el).on('click.slider_arrows', this[key])
            );
        });
    }

    /**
     * 下一张
     * @returns {Slider}
     */
    next() {
        let index = this.current - 1;
        if(index >= this.total){
            index = 0;
        }

        return this.animate(index, 'next');
    }

    /**
     * 上一张
     * @returns {Slider}
     */
    prev() {
        return this.animate(this.current - 1, 'prev');
    }

    /**
     * 设置样式
     * @param el
     * @param activeClass
     * @returns {Slider}
     */
    toggleActive(el, activeClass) {
        el.addClass(activeClass).siblings().removeClass(activeClass);
        return this;
    }

    /**
     * 索引
     * @param index
     * @returns {Slider}
     */
    setIndex(index) {
        if(index < 0){
            index = this.total - 1;
        }

        this.current = Math.min(Math.max(0, index), this.total - 1);

        if(this.config.nav) {
            this.toggleActive(this.nav.find(`[data-slide="${this.current}"]`), this.config.activeClass);
        }

        this.toggleActive(this.slides.eq(this.current), this.config.activeClass);
        return this;
    }

    /**
     * 自动播放
     * @returns {Object}
     */
    play() {
        this.__interval = setTimeout(() => {
            //  Move on to the next slide
            this.next();
        }, this.config.delay);

        return this;
    }

    /**
     * 停止播放
     * @returns {Slider}
     */
    stop() {
        clearInterval(this.__interval);
        return this;
    }

    /**
     * 动画
     * @param to
     * @param dir
     * @returns {Slider}
     */
    animate(to, dir) {
        if(to === 'first')
            to = 0;

        if(to === 'last')
            to = this.total;
        // 非数字不执行动画
        if(isNaN(to))
            return this;

        this.config.autoplay && this.play();

        this.setIndex(to);
        let animation = this.config.animation;
        this[animation] && this[animation](this.current, dir);
        return this;
    }

    /**
     * 透明度切换
     * @param to
     * @returns {Slider}
     */
    fade(to) {
        const activeElement = this.slides.eq(to).addClass(this.config.activeClass);
        activeElement.stop(true, true).fadeIn(500).siblings().removeClass(this.config.activeClass).fadeOut(500);
        return this;
    }

    /**
     * 切换
     * @param to
     * @returns {*}
     */
    horizontal(to) {
        let prop = 'left';
        if(this.el.attr('dir') === 'rtl') {
            prop = 'right';
        }
        return this.slide(prop, to);
    }

    /**
     * 滚动
     * @param prop
     * @param to
     * @returns {Slider}
     */
    slide(prop, to) {
        let propObj = {};
        propObj[prop] = -to * this.width;
        this.container.stop().animate(propObj, this.config.speed, this.config.easing);
    }
}

export default Slider;