/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const reserveRouter = {
  path: '/reserve',
  component: Layout,
  redirect: 'noredirect',
  name: 'Reserve',
  meta: {
    title: 'reserve',
    icon: 'reserve'
  },
  children: [{
    path: 'riskparams',
    component: () => import('@/views/modules/reserve/riskparams'),
    name: 'Riskparams',
    meta: {
      title: 'riskparams',
      noCache: true,
      icon: 'modify'
    }
  },
  {
    path: 'advancecoupon',
    component: () => import('@/views/modules/reserve/advancecoupon'),
    name: 'Advancecoupon',
    meta: {
      title: 'advancecoupon',
      noCache: true,
      icon: 'coupon'
    },
    children: [
      {
        path: 'coupondetail',
        component: () => import('@/views/modules/reserve/advancecoupon/coupondetail'),
        name: 'Coupondetail',
        meta: {
          title: 'coupondetail',
          noCache: true,
          icon: ''
        }
      }, {
        path: 'couponcheck',
        component: () => import('@/views/modules/reserve/advancecoupon/couponcheck'),
        name: 'Couponcheck',
        meta: {
          title: 'couponcheck',
          noCache: true,
          icon: ''
        }
      }
    ]
  },
  {
    path: 'transfer',
    component: () => import('@/views/modules/reserve/transfer'),
    name: 'Transfer',
    meta: {
      title: 'transfer',
      noCache: true,
      icon: 'org'
    },
    children: [
      {
        path: 'shiftorgrecord',
        component: () => import('@/views/modules/reserve/transfer/shiftorgrecord'),
        name: 'Shiftorgrecord',
        meta: {
          title: 'shiftorgrecord',
          noCache: true,
          icon: ''
        }
      },
      {
        path: 'shiftorgverify',
        component: () => import('@/views/modules/reserve/transfer/shiftorgverify'),
        name: 'Shiftorgverify',
        meta: {
          title: 'shiftorgverify',
          noCache: true,
          icon: ''
        }
      }
    ]
  },
  {
    path: 'towardpublic',
    component: () => import('@/views/modules/reserve/public'),
    name: 'Public',
    meta: {
      title: 'public',
      noCache: true,
      icon: 'public'
    },
    children: [
      {
        path: 'corporatebankcard',
        component: () => import('@/views/modules/reserve/public/corporatebankcard'),
        name: 'corporatebankcard',
        meta: {
          title: 'corporatebankcard',
          noCache: true,
          icon: ''
        }
      },
      {
        path: 'withdrawalandapproval',
        component: () => import('@/views/modules/reserve/public/withdrawalandapproval'),
        name: 'Withdrawalandapproval',
        meta: {
          title: 'withdrawalandapproval',
          noCache: true,
          icon: ''
        }
      }
    ]
  },
  {
    path: 'grade',
    component: () => import('@/views/modules/reserve/grade'),
    name: 'Grade',
    meta: {
      title: 'grade',
      noCache: true,
      icon: 'rank'
    },
    children: [{
      path: 'paramsetting',
      component: () => import('@/views/modules/reserve/grade/paramsetting'),
      name: 'Paramsetting',
      meta: {
        title: 'paramsetting',
        noCache: true,
        icon: ''
      }
    },
    {
      path: 'gradeapplication',
      component: () => import('@/views/modules/reserve/grade/gradeapplication'),
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
