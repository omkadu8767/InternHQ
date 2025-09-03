import Vue from 'vue';
export const auth = Vue.observable({
    token: localStorage.getItem('auth-token'),
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    setToken(token, isAdmin) {
        this.token = token;
        this.isAdmin = isAdmin;
        localStorage.setItem('auth-token', token);
        localStorage.setItem('isAdmin', isAdmin);
    },
    clear() {
        this.token = null;
        this.isAdmin = false;
        localStorage.removeItem('auth-token');
        localStorage.removeItem('isAdmin');
    }
});
