/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const infoRouter = {
  path: '/info',
  component: Layout,
  redirect: 'noredirect',
  name: 'Info',
  meta: {
    title: 'info',
    icon: ''
  },
  children: [
    {
      path: 'merchant',
      component: () => import('@/views/charts/keyboard'),
      name: 'Merchant',
      meta: { title: 'merchant', noCache: true,icon:'' }
    },
    {
      path: 'service',
      component: () => import('@/views/charts/line'),
      name: 'Service',
      meta: { title: 'service', noCache: true,icon:'' }
    }
  ]
}

export default infoRouter
