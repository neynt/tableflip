import Vue from 'vue';
import Router from 'vue-router';
import IndexPage from '@/components/pages/IndexPage';
import GamePage from '@/components/pages/GamePage';
import LoginPage from '@/components/pages/LoginPage';

Vue.use(Router);

export default new Router({
  mode: 'history', // no # in URL
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/game/:id',
      name: 'GamePage',
      component: GamePage,
    },
  ],
});
