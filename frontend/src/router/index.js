import Login from '@/components/AppLogin.vue';
import Signup from '@/components/AppSignup.vue';
import DashboardAdmin from '@/components/DashboardAdmin.vue';
import DashboardIntern from '@/components/DashboardIntern.vue';
import InternList from '@/components/InternList.vue';
import ProfileIntern from '@/components/ProfileIntern.vue';
// import AppHome from '@/views/AppHome.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routes = [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/signup', component: Signup },
    {
        path: '/admin',
        component: DashboardAdmin,
        meta: { requiresAuth: true, isAdmin: true }
    },
    {
        path: '/admin-list',
        component: InternList,
        meta: { requiresAuth: true, isAdmin: true }
    },
    {
        path: '/intern',
        component: DashboardIntern,
        meta: { requiresAuth: true, isAdmin: false }
    },
    {
        path: '/profile',
        component: ProfileIntern,
        meta: { requiresAuth: true, isAdmin: false }
    }
];

const router = new VueRouter({ mode: 'history', routes });

// Navigation guard for auth
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth-token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login');
        } else if (to.meta.isAdmin !== undefined && to.meta.isAdmin !== isAdmin) {
            next('/login'); // redirect to home if role not matching
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
