/**
 * Created by lidongyue on 2015/11/30.
 *
 * 懒加载主要分为两部分：①图片懒加载 ②数据懒加载
 * <img img-lazyload='*.jpg'/>
 * <textarea class='area-lazyload'><p>some text</p></textarea>
 */
import Emitter from '../lib/emitter';
const DEFAULT_CONFIG = {
    imgTag: 'img-lazyload',
    areaTag: 'area-lazyload',
    //延迟加载类型 0全部 1img 2area
    lazyType: 0
};
let imgArray = [];
let areaArray = [];
class Lazyload extends Emitter {
    constructor() {
        super();
        this.config = DEFAULT_CONFIG;
    }

    init() {
        switch (this.config.lazyType) {
            case 0:
                this.imgManage();
                this.areaManage();
                break;
            case 1:
                this.imgManage();
                break;
            case 2:
                this.areaManage();
                break;
        }
        this.onEvent();
    }

    //配置
    setConfig(config = {}) {
        this.config = $.extend({}, this.config, config);
        return this;
    }

    //管理img
    imgManage() {
        let $imgs = $(`img[${this.config.imgTag}]`);
        $.each($imgs, function () {
            this.top = this.getTargetTop($(this));
            imgArray.push(this);
        });
        return this;
    }

    //管理Area
    areaManage() {
        let $area = $(`textarea[class=${this.config.areaTag}]`);
        $.each($area, function () {
            this.top = this.getTargetTop($(this));
            areaArray.push(this);
        });
        return this;
    }

    contentLoad(){
        imgLoad();
        areaLoad();
    }
    imgLoad(){
        $.each(imgArray,(n,el) => {
            let $img = $(el);
            if($img && this.checkVisiable($img)){
                $img.attr('src',$img.attr(this.config.imgTag));
                imgArray.splice(n,1);
            }
        });
        return this;
    }
    areaLoad(){
        $.each(areaArray,(n,el) => {
            let $area = $(el);
            if($area && this.checkVisiable($area)){
                $area.removeClass(this.config.areaTag).css('display','none');
                let $div = $('<div></div>');
                $div.insertBefore($area);
                $div.html($area.val());
                areaArray.splice(n,1);
            }
        });
        return this;
    }
    //事件
    onEvent() {
        $(window).on('scroll', () => {
            this.contentLoad();
        });
        $(window).on('resize', () => {
            this.contentLoad();
        });
        this.contentLoad();
        return this;
    }

    checkVisiable(el){
        let scrollT = document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0;//页面滚动条高度
        let clientH = window.innerHeight || document.documentElement.clientHeight;//浏览器可视区域高度
        if(el.top && Math.abs(el.top - scrollT) < clientH){
            return true;
        } else {
            return false;
        }
    }
    //计算元素的top
    getTargetTop(el) {
        let top = el.offset().top;
        return top;
    }
}
export default Lazyload;