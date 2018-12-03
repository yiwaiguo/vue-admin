/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const mallRouter = {
  path: '/mall',
  component: Layout,
  redirect: 'noredirect',
  name: 'Mall',
  meta: {
    title: 'mall',
    icon: ''
  },
  children: [{
      path: 'order',
      component: () => import('@/views/modules/mall/order'),
      name: 'Order',
      meta: {
        title: 'order',
        noCache: true,
        icon: ''
      },
      children: [{
          path: 'orderinfo',
          component: () => import('@/views/modules/mall/order/orderinfo.vue'),
          name: 'Orderinfo',
          meta: {
            title: 'orderinfo',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'deliveryapply',
          component: () => import('@/views/charts/keyboard'),
          name: 'Deliveryapply',
          meta: {
            title: 'deliveryapply',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'sellapply',
          component: () => import('@/views/charts/keyboard'),
          name: 'Sellapply',
          meta: {
            title: 'sellapply',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'fullbill',
          component: () => import('@/views/charts/keyboard'),
          name: 'Fullbill',
          meta: {
            title: 'fullbill',
            noCache: true,
            icon: ''
          }
        }
      ]
    },
    {
      path: 'refund',
      component: () => import('@/views/charts/line'),
      name: 'Refund ',
      meta: {
        title: 'refund ',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'buyback',
      component: () => import('@/views/charts/line'),
      name: 'Buyback',
      meta: {
        title: 'buyback',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'user',
      component: () => import('@/views/charts/line'),
      name: 'User',
      meta: {
        title: 'user',
        noCache: true,
        icon: ''
      },
      children: [{
          path: 'userinfo',
          component: () => import('@/views/charts/line'),
          name: 'Userinfo',
          meta: {
            title: 'userinfo',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'modifyphone',
          component: () => import('@/views/charts/line'),
          name: 'Modifyphone',
          meta: {
            title: 'modifyphone',
            noCache: true,
            icon: ''
          }
        }
      ]
    }
  ]
}

export default mallRouter
