/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const sysRouter = {
  path: '/sys',
  component: Layout,
  redirect: 'noredirect',
  name: 'Sys',
  meta: {
    title: 'sys',
    icon: ''
  },
  children: [{
      path: 'admin',
      component: () => import('@/views/modules/sys/admin'),
      name: 'Admin',
      meta: {
        title: 'admin',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'role',
      component: () => import('@/views/modules/sys/role'),
      name: 'Role',
      meta: {
        title: 'role',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'menu',
      component: () => import('@/views/modules/sys/menu'),
      name: 'Menu',
      meta: {
        title: 'menu',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'config',
      component: () => import('@/views/modules/sys/config'),
      name: 'Config',
      meta: {
        title: 'config',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'log',
      component: () => import('@/views/modules/sys/log'),
      name: 'Log',
      meta: {
        title: 'log',
        noCache: true,
        icon: ''
      }
    },
  ]
}

export default sysRouter
