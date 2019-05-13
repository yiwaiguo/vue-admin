/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const infoRouter = {
  path: '/basic',
  component: Layout,
  redirect: 'noredirect',
  name: 'Basic',
  meta: {
    title: 'basic',
    icon: 'info'
  },
  children: [
    {
      path: 'merchant',
      component: () => import('@/views/charts/keyboard'),
      name: 'Merchant',
      meta: { title: 'merchant', noCache: true, icon: 'merchant' }
    },
    {
      path: 'dealer',
      component: () => import('@/views/charts/line'),
      name: 'Service',
      meta: { title: 'dealer', noCache: true, icon: 'service' }
    },
    {
      path: 'org',
      component: () => import('@/views/modules/info/org'),
      name: 'Org',
      meta: { title: 'org', noCache: true, icon: 'org' },
      children:[
        {
          path: 'orglist',
          component: () => import('@/views/modules/info/org/orglist'),
          name: 'Orglist',
          meta: { title: 'orglist', noCache: true, icon: 'orglist' }
        },
        {
          path: 'bmdealer',
          component: () => import('@/views/modules/info/org/bmdealer'),
          name: 'Bmdealer',
          meta: { title: 'bmdealer', noCache: true, icon: '' }
        },
        {
          path: 'facilitator',
          component: () => import('@/views/modules/info/org/facilitator'),
          name: 'Facilitator',
          meta: { title: 'facilitator', noCache: true, icon: '' }
        },
        {
          path: 'orderdealer',
          component: () => import('@/views/modules/info/org/orderdealer'),
          name: 'Orderdealer',
          meta: { title: 'orderdealer', noCache: true, icon: '' }
        },
        {
          path: 'orginfoinquire',
          component: () => import('@/views/modules/info/org/orginfoinquire'),
          name: 'Orginfoinquire',
          meta: { title: 'orginfoinquire', noCache: true, icon: '' }
        },
      ]
    }
  ]
}

export default infoRouter
