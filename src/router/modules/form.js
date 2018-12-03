/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const formRouter = {
  path: '/form',
  component: Layout,
  redirect: 'noredirect',
  name: 'Form',
  meta: {
    title: 'form',
    icon: ''
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
      children:[
        {
            path: 'operationinfo',
            component: () => import('@/views/charts/keyboard'),
            name: 'Operationinfo',
            meta: {
              title: 'operationinfo',
              noCache: true,
              icon: ''
            }
          }
      ]
    },
    {
      path: 'advance',
      component: () => import('@/views/charts/line'),
      name: 'Advance',
      meta: {
        title: 'advance',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'amount',
      component: () => import('@/views/charts/line'),
      name: 'Amount',
      meta: {
        title: 'amount',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'risk',
      component: () => import('@/views/charts/line'),
      name: 'Risk',
      meta: {
        title: 'risk',
        noCache: true,
        icon: ''
      }
    }
  ]
}

export default formRouter
