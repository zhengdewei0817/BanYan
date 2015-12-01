import '../../less/lib/reset.less';

import '../../less/forms/forms.less';
import Validate from '../component/Validate';
//import '../../less/tab/tab.less';
import Tab from '../component/Tab';
import '../../less/calendar/calendar.less';
import Calendar from '../component/Calendar';
import Pagenav from '../component/Pagenav';

//
const form = $('form');
new Validate(form).setConfig({
    rules: {
        username: {
            required: true
        }
    },
    message: {
        username: {
            required: 'username为必填号'
        }
    }
}).run();

new Tab('.tc-tab').setConfig({
    childNode: '.tab-item',
    contentNode: '.tc-tab-content',
    active: 1,
    eventType: 'click',
    activeClass: 'active'
}).run();

new Calendar($('[name="date"]')).setConfig({
    format: 'YYYY/MM',
    min: '2015-11-26 23:00:00'
}).run();

new Pagenav('#pageBox').setConfig({
    childNode: 'a',
    currClass: 'active',
    defPage: 2,
    total: 5,
    onAfter: ()=> {
        this.debug(this.current);
    }
}).run();