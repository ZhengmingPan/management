import Vue from 'vue';
import iView from 'iview';
import iViewArea from 'iview-area';
import VueRouter from 'vue-router';
import Routers from '@/routers/admin';
import Vuex from 'vuex';
import Util from './libs/util';
import App from './app.vue';
import Http from './libs/http.js';
import Cookie from './libs/cookie.js';
import Img from '@/static/js/image.js';
import homeApis from '@/apis/home.js';

//import 'iview/dist/styles/iview.css';
import '@/static/themes/default.less';
import 'font-awesome/css/font-awesome.css';

Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(iView);
Vue.use(iViewArea);
 

// 将API方法绑定到全局
Vue.prototype.$http = Http;

Vue.prototype.$cookie = Cookie;

Vue.prototype.$Img = Img;

Vue.prototype.$api = {home: homeApis}

// 路由配置
const router = new VueRouter({
    mode: 'history',
    routes: Routers
});



router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    if (to.path.substring(0, 6) == '/admin' && (!Cookie.exist('token') || !Cookie.exist('username'))) {
        let returnUrl= '';
        if(from.path.substring(0, 6) == '/admin') {
            returnUrl = "?returnUrl=" + from.path;
        }
        next('/login' + returnUrl);
    }
    else {
        Util.title(to.meta.title);
        next();
    }
});

router.afterEach((to, from, next) => {
    if (to.path.substring(0, 6) == '/admin' && (!Cookie.exist('token') || !Cookie.exist('username'))) {
        let returnUrl= '';
        if(from.path.substring(0, 6) == '/admin') {
            returnUrl = "?returnUrl=" + from.path;
        }
        next('/login' + returnUrl);
    }
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


Http.axios.interceptors.request.use(response => {   //请求前拦截
    return response;
}, error => {
    return Promise.reject(error);
});

Http.axios.interceptors.response.use(response => { // 响应成功拦截
    var code = response.data.code;
    if (code === 401) {
        Cookie.set('token', '');
        Cookie.set('username', '');
        router.replace("/login");
    }
    return response;
}, error => {
    return Promise.reject(error);
});


const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {}
});


new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App)
});
