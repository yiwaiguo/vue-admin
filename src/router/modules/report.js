/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const reportRouter = {
  path: '/report',
  component: Layout,
  redirect: 'noredirect',
  name: 'Report',
  meta: {
    title: 'report',
    icon: 'report'
  },
  children: [{
      path: 'malldata',
      component: () => import('@/views/charts/keyboard'),
      name: 'Malldata',
      meta: {
        title: 'malldata',
        noCache: true,
        icon: ''
      },
      children: [{
        path: 'operationinfo',
        component: () => import('@/views/charts/keyboard'),
        name: 'Operationinfo',
        meta: {
          title: 'operationinfo',
          noCache: true,
          icon: 'operation'
        }
      }]
    },
    {
      path: 'advance',
      component: () => import('@/views/modules/report/advance'),
      name: 'Advance',
      meta: {
        title: 'advance',
        noCache: true,
        icon: 'coupon'
      },
      children: [{
          path: 'couponamountlog',
          component: () => import('@/views/modules/report/advance/couponamountlog'),
          name: 'couponamountlog',
          meta: {
            title: 'couponamountlog',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'couponcompareaccount',
          component: () => import('@/views/modules/report/advance/couponcompareaccount'),
          name: 'couponcompareaccount',
          meta: {
            title: 'couponcompareaccount',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'couponorder',
          component: () => import('@/views/modules/report/advance/couponorder'),
          name: 'Couponorder',
          meta: {
            title: 'couponorder',
            noCache: true,
            icon: ''
          }
        }
      ]
    },
    {
      path: 'amount',
      component: () => import('@/views/modules/report/amount'),
      name: 'Amount',
      meta: {
        title: 'amount',
        noCache: true,
        icon: 'count'
      },
      children: [{
          path: 'dealercount',
          component: () => import('@/views/modules/report/amount/dealercount'),
          name: 'dealercount',
          meta: {
            title: 'dealercount',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'orgcount',
          component: () => import('@/views/modules/report/amount/orgcount'),
          name: 'orgcount',
          meta: {
            title: 'orgcount',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'singlecount',
          component: () => import('@/views/modules/report/amount/singlecount'),
          name: 'Singlecount',
          meta: {
            title: 'singlecount',
            noCache: true,
            icon: ''
          }
        }
      ]
    },
    {
      path: 'monitor',
      component: () => import('@/views/charts/line'),
      name: 'Monitor',
      meta: {
        title: 'monitor',
        noCache: true,
        icon: 'monitor'
      }
    },
    {
      path: 'nightorder',
      component: () => import('@/views/modules/report/nightorder/children'),
      name: 'Nightorder',
      meta: {
        title: 'nightorder',
        noCache: true,
        icon: 'nightorder'
      }
    },
  ]
}

export default reportRouter
