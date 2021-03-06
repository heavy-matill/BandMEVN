import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../components/ViewComponent'),
  },
  /*{
    path: '/view',
    name: 'view',
    component: () => import('../components/ListComponent'),
  },*/
  {
    path: '/view',
    name: 'view',
    component: () => import('../components/ViewComponent'),
  },
  {
    path: '/view/:id',
    name: 'view-by-id',
    component: () => import('../components/ViewComponent'),
  },
  {
    path: '/parse',
    name: 'parse',
    component: () => import('../components/ParseComponent'),
  },
  {
    path: '/edit/:id',
    name: 'edit',
    component: () => import('../components/EditComponent'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
