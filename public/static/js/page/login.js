import Validate from '../component/Validate';
import Tab from '../component/Tab';
import '../../less/forms/forms.less';
//import '../../less/tab/tab.less';

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