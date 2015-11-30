import '../../less/lib/reset.less';
import '../../less/slider/slider.less';

import Slider from '../component/Slider';

new Slider('.my-slider').setConfig({
    autoplay: true,
    arrows: false
}).run();