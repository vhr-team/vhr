import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

/* ViewUI */
import ViewUI from 'view-design';
import iView from 'iview'
import 'view-design/dist/styles/iview.css';

/* 导入自定义的api get post delete put*/
import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";

import {initMenu} from "./utils/menus";

Vue.use(ElementUI);
Vue.use(ViewUI);
Vue.use(iView);


Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.config.productionTip = false;
Vue.prototype.$Message.config({
    top: 150,
    duration: 5
});
Vue.prototype.$Notice.config({
    top: 150,
    duration: 5
});

/* 路由守卫 */
router.beforeEach((to, from, next) => {
    /* 访问的是登录 */
    if (to.path == '/') {
        next();
    } else {
        // 访问的不是登录，就去window.sessionStorage获取用户信息，如果有就是登录状态
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store);
            next();
        } else {
            // 如果没有获取到，重新到登录页面进行登录,或者是输入的地址
            next('/?redirect=' + to.path);
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
