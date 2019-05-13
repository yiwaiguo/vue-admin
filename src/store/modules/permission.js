import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  Layout,admin,role,menu,config,log,
  order,orderinfo,fullbill,refund,refundapply,refundRecheck,refundThirdCheck,auditOrder,user,userinfo,modifyphone,
  riskparams,advancecoupon,coupondetail,couponcheck,transfer,shiftorgrecord,shiftorgverify,towardpublic,corporatebankcard,
  withdrawalandapproval,grade,paramsetting,gradeapplication,
  advance,couponamountlog,couponcompareaccount,couponorder,amount,dealercount,orgcount,singlecount,
  org,orglist,bmdealer,facilitator,orderdealer,orginfoinquire
} from './import.js'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// function formatRouter(asyncRouterMap) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     if (route.component) {
//       if (route.component === 'Layout') {
//         route.component = Layout
//       } else {
//         route.component = window[route.component]
//       }
//     }
//     if (route.children && route.children.length) {
//       route.children = formatRouter(route.children)
//     }
//     return true
//   })
//   return accessedRouters
// }
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters
        if (roles.includes('admin')) {
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
