/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const mallRouter = {
  path: '/mall',
  component: Layout,
  redirect: 'noredirect',
  name: 'Mall',
  meta: {
    title: 'mall',
    icon: 'mall'
  },
  children: [{
      path: 'order',
      component: () => import('@/views/modules/mall/order'),
      name: 'Order',
      meta: {
        title: 'order',
        noCache: true,
        icon: 'order'
      },
      children: [{
          path: 'orderinfo',
          component: () => import('@/views/modules/mall/order/orderinfo'),
          name: 'Orderinfo',
          meta: {
            title: 'orderinfo',
            noCache: true,
            icon: ''
          }
        },
        // {
        //   path: 'deliveryapply',
        //   component: () => import('@/views/modules/mall/order/deliveryapply'),
        //   name: 'Deliveryapply',
        //   meta: {
        //     title: 'deliveryapply',
        //     noCache: true,
        //     icon: ''
        //   }
        // },
        // {
        //   path: 'sellapply',
        //   component: () => import('@/views/modules/mall/order/sellapply'),
        //   name: 'Sellapply',
        //   meta: {
        //     title: 'sellapply',
        //     noCache: true,
        //     icon: ''
        //   }
        // },
        {
          path: 'fullbill',
          component: () => import('@/views/modules/mall/order/fullbill'),
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
      component: () => import('@/views/modules/mall/refund'),
      name: 'Refund ',
      meta: {
        title: 'refund ',
        noCache: true,
        icon: 'refund'
      },
      children: [{
          path: 'refundapply',
          component: () => import('@/views/modules/mall/refund/refundapply'),
          name: 'Refundapply ',
          meta: {
            title: 'refundapply ',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'refundRecheck',
          component: () => import('@/views/modules/mall/refund/refundRecheck'),
          name: 'RefundRecheck ',
          meta: {
            title: 'refundRecheck ',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'refundThirdCheck',
          component: () => import('@/views/modules/mall/refund/refundThirdCheck'),
          name: 'RefundThirdCheck ',
          meta: {
            title: 'refundThirdCheck ',
            noCache: true,
            icon: ''
          }
        }
      ]
    },
    {
      // path: 'buyback',
      // component: () => import('@/views/modules/mall/buyback'),
      // name: 'Buyback',
      // meta: {
      //   title: 'buyback',
      //   noCache: true,
      //   icon: 'buyback'
      // },
      // children: [{
        path: 'auditOrder',
        component: () => import('@/views/modules/mall/buyback/auditOrder'),
        name: 'AuditOrder ',
        meta: {
          title: 'auditOrder',
          noCache: true,
          icon: ''
        }
      // }]
    },
    {
      path: 'user',
      component: () => import('@/views/modules/mall/user'),
      name: 'User',
      meta: {
        title: 'user',
        noCache: true,
        icon: 'user'
      },
      children: [{
          path: 'userinfo',
          component: () => import('@/views/modules/mall/user/userinfo'),
          name: 'Userinfo',
          meta: {
            title: 'userinfo',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'modifyphone',
          component: () => import('@/views/modules/mall/user/modifyphone'),
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
