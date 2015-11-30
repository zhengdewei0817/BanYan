import '../../less/lib/reset.less';
import '../../less/slider/slider.less';

import Slider from '../component/Slider';
import Countdown from '../component/Countdown';

new Slider('.my-slider').setConfig({
    autoplay: true,
    arrows: false
}).run();

new Countdown().setConfig({
    speed: 1000,
    end: new Date(+new Date() + 12000),
    execution: (data) => {
        $('.count-down').text(Math.floor(data.endLong/1000) + '秒后重试');
    },
    finish: ()=>{
        $('.count-down').text('获取短信验证码');
    }
}).run();