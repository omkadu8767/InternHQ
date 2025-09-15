import AppLogin from '@/components/AppLogin.vue';
import AppSignup from '@/components/AppSignup.vue';
import DashboardAdmin from '@/components/DashboardAdmin.vue';
import DashboardIntern from '@/components/DashboardIntern.vue';
import InternList from '@/components/InternList.vue';
import LeaderboardIntern from '@/components/LeaderboardIntern.vue';
import ProfileIntern from '@/components/ProfileIntern.vue';
import HomePage from '@/views/HomePage.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/login', name: 'Login', component: AppLogin },
    { path: '/signup', name: 'Signup', component: AppSignup },
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
    },
    {
        path: '/leaderboard',
        component: LeaderboardIntern,
        meta: { requiresAuth: true, isAdmin: false }
    },
    { path: '*', redirect: '/' }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

// Navigation guard for auth
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth-token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login');
        } else if (to.meta.isAdmin !== undefined && to.meta.isAdmin !== isAdmin) {
            // Redirect to appropriate dashboard instead of login
            if (isAdmin) {
                next('/admin');
            } else {
                next('/intern');
            }
        } else {
            next();
        }
    } else {
        // If user is already authenticated and tries to access login/signup
        if ((to.path === '/login' || to.path === '/signup') && token) {
            if (isAdmin) {
                next('/admin');
            } else {
                next('/intern');
            }
        } else {
            next();
        }
    }
});

export default router;