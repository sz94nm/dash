require('./bootstrap');
window.Vue = require('vue');
import VueRouter from 'vue-router';
import {Form,HasError,AlertError}from 'vform';
import swal from 'sweetalert2';
window.swal=swal;
window.Form=Form;
Vue.component (HasError.name,HasError);
Vue.component(AlertError.name,AlertError);
window.myEvent =new Vue;

Vue.use(VueRouter); 

let routes=[
    {path: '/dashboard', component:require('./components/Dashboard.vue').default},
    {path: '/profile', component:require('./components/Profile.vue').default},
    {path: '/users', component:require('./components/Users.vue').default},

]
const router = new VueRouter({
    mode:'history',
    routes
});

Vue.component('example-component', require('./components/ExampleComponent.vue').default);


const Toast = swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  })
window.toast =Toast;
const app = new Vue({
    el: '#app',
    router,
});
