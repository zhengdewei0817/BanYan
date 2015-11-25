import Validate from '../component/Validate';
import '../../less/forms/forms.less';

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