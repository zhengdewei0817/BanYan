import Emitter from '../lib/emitter';

const DEFAULT = {
    speed: 500,
    first: ()=>{},
    execution: ()=>{},
    finish: ()=>{}
};

class Countdown extends Emitter{
    constructor(){
        super();
        this.isBegin = false;
        this.__interval = null;
    }

    setConfig(config = {}){
        this.config = $.extend({}, DEFAULT, config);
        return this;
    }

    /**
     * 初始化
     */
    init() {
        this.base = this.config.base ? this.config.base : new Date();
        this.basenow = new Date();
        this.begin = this.config.begin || this.basenow;
        this.end = this.config.end || new Date(this.getSecond(this.begin + this.toMillisecond(60)) * 1000);

        // 获取精确的时间
        this.begin = new Date(this.preciseTime(this.begin));
        this.end = new Date(this.preciseTime(this.end));

        this.start();
    }

    /**
     * 开始倒计时
     * @returns {*}
     */
    start() {
        let now = new Date();
        if(this.check(now) === 'finish'){
            clearInterval(this.__interval);
            return;
        }
        this.__interval = setInterval(() => {
            this.start();
        }, this.config.speed);
        return this;
    }

    /**
     * 停止倒计时
     * @returns {Countdown}
     */
    stop() {
        clearInterval(this.__interval);
        return this;
    }

    /**
     * 检查倒计时状态
     * @param now
     * @returns {*}
     */
    check(now) {
        now = new Date(+now - (+this.basenow) + (+this.base));

        if(!this.isBegin && now >= this.begin && now < this.end){
            this.config.first();
            this.isBegin = true;
        }

        if(now >= this.begin && now < this.end){
            this.config.execution({
                // 开始多久了
                startLong: now - this.begin,
                // 还有多久结束
                endLong: this.end - now
            });

            return 'execution';
        }

        if (now >= this.end){
            this.config.finish({
                // 结束了多久
                endLong : now - this.end + 1000
            });
            return 'finish';
        }


        return 'before';
    }

    /**
     * 获取精确的时间
     * @param time
     * @returns {number}
     */
    preciseTime(time){
        return this.toMillisecond(this.getSecond(time));
    }

    /**
     * 秒转毫秒
     * @param s
     * @returns {number}
     */
    toMillisecond(s) {
        return s * 1000;
    }

    /**
     * 毫秒转秒
     * @param millisecond
     * @returns {number}
     */
    getSecond(millisecond) {
        return Math.floor(millisecond/1000);
    }
}

export default Countdown;