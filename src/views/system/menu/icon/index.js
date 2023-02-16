import iconPicker from './iconPicker';
import '../../../../assets/styles/font-awesome-4.7.0/css/font-awesome.min.css';

const install = function (Vue) {
    Vue.component(iconPicker.name, iconPicker);
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export {iconPicker}

export default {
    version: '0.5.0',
    install:install,
    iconPicker: iconPicker
}

