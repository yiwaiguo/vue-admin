/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const reserveRouter = {
  path: '/reserve',
  component: Layout,
  redirect: 'noredirect',
  name: 'Reserve',
  meta: {
    title: 'reserve',
    icon: ''
  },
  children: [{
      path: 'riskparams',
      component: () => import('@/views/charts/keyboard'),
      name: 'Riskparams',
      meta: {
        title: 'riskparams',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'advancecoupon',
      component: () => import('@/views/charts/line'),
      name: 'Advancecoupon',
      meta: {
        title: 'advancecoupon',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'transfer',
      component: () => import('@/views/charts/line'),
      name: 'Transfer',
      meta: {
        title: 'transfer',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'public',
      component: () => import('@/views/charts/line'),
      name: 'Public',
      meta: {
        title: 'public',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'grade',
      component: () => import('@/views/charts/line'),
      name: 'Grade',
      meta: {
        title: 'grade',
        noCache: true,
        icon: ''
      },
      children: [{
          path: 'paramsetting',
          component: () => import('@/views/charts/line'),
          name: 'Paramsetting',
          meta: {
            title: 'paramsetting',
            noCache: true,
            icon: ''
          }
        },
        {
          path: 'gradeapplication',
          component: () => import('@/views/charts/line'),
          name: 'Gradeapplication',
          meta: {
            title: 'gradeapplication',
            noCache: true,
            icon: ''
          }
        }
      ]
    }
  ]
}

export default reserveRouter
