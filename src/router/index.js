import { createRouter, createWebHistory } from 'vue-router'
import CreatePoll from '../views/CreatePoll.vue'

const routes = [
  {
    path: '/',
    name: 'create',
    component: CreatePoll
  },
  {
    path: '/vote/:id',
    name: 'vote',
    component: () => import(/* webpackChunkName: "vote" */ '../views/ViewPoll.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
