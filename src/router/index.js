import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
    }, {
        path: '/home',
        name: 'Home',
        component: Home,
    }
]

const router = new VueRouter({
    routes
})

/* 配置浏览器显示的title */
const defaultTitle = '微人事管理系统';
router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? to.meta.title : defaultTitle;
    next();
});

export default router
