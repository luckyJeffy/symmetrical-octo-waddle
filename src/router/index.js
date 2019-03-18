import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    redirect: '/documentation/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'documentation', icon: 'documentation', noCache: true }
      }
    ]
  }
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// icon color #BFCBD9
export const asyncRouterMap = [
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/system',
  //   alwaysShow: true,
  //   meta: {
  //     title: '系统管理',
  //     icon: 'nested',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'userManagement',
  //       component: () => import('@/views/system/userManagement'),
  //       name: 'userManagement',
  //       meta: {
  //         title: '系统用户管理',
  //         roles: ['admin']
  //       }
  //     },
  //     {
  //       path: 'empowerManagement',
  //       component: () => import('@/views/system/empowerManagement'),
  //       name: 'empowerManagement',
  //       meta: {
  //         title: '角色/授权管理',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/product',
  //   component: Layout,
  //   redirect: '/product/list',
  //   alwaysShow: true,
  //   meta: {
  //     title: '商品',
  //     icon: 'goods',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/product/list'),
  //       name: 'productList',
  //       meta: {
  //         title: '商品列表',
  //         roles: ['admin']
  //       }
  //     },
  //     {
  //       path: 'create',
  //       component: () => import('@/views/product/create'),
  //       name: 'productCreate',
  //       meta: {
  //         title: '发布商品',
  //         roles: ['admin']
  //       }
  //     },
  //     {
  //       path: 'edit/:id',
  //       component: () => import('@/views/product/edit'),
  //       name: 'ProductEdit',
  //       hidden: true,
  //       meta: {
  //         title: 'productEdit',
  //         roles: ['admin'],
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'create',
  //       component: () => import('@/views/product/create'),
  //       name: 'ProductCreate',
  //       hidden: true,
  //       meta: {
  //         title: 'productCreate',
  //         roles: ['admin'],
  //         noCache: true
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/catalog',
  //   component: Layout,
  //   redirect: '/catalog/index',
  //   alwaysShow: true,
  //   meta: {
  //     title: '分类',
  //     icon: 'nested',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/catalog/index'),
  //       name: 'catalogList',
  //       meta: {
  //         title: '分类列表',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/order',
  //   component: Layout,
  //   redirect: '/order/index',
  //   alwaysShow: true,
  //   meta: {
  //     title: '订单',
  //     icon: 'nested',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/order/index'),
  //       name: 'orderList',
  //       meta: {
  //         title: '订单列表',
  //         roles: ['admin']
  //       }
  //     },
  //     {
  //       path: 'edit/:id',
  //       component: () => import('@/views/order/edit'),
  //       name: 'OrderDetail',
  //       hidden: true,
  //       meta: {
  //         title: '订单详情',
  //         roles: ['admin'],
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/vip',
  //   component: Layout,
  //   redirect: '/vip/recharge',
  //   alwaysShow: true,
  //   meta: {
  //     title: '会员',
  //     icon: 'nested',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'recharge',
  //       component: () => import('@/views/vip/recharge'),
  //       name: 'vipRecharge',
  //       meta: {
  //         title: '会员充值',
  //         roles: ['admin']
  //       }
  //     }

  //   ]
  // },
  // {
  //   path: '/user',
  //   component: Layout,
  //   // redirect: '/user/index',
  //   alwaysShow: true,
  //   meta: {
  //     title: '会员',
  //     icon: 'nested',
  //     roles: ['admin']
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/user/index'),
  //       name: 'userList',
  //       meta: {
  //         title: '会员列表',
  //         roles: ['admin']
  //       }
  //     }

  //   ]
  // },
  {
    path: '/integral',
    component: Layout,
    // redirect: '/user/index',
    alwaysShow: true,
    meta: {
      title: '积分管理',
      icon: 'nested',
      roles: ['admin']
    },
    children: [
      {
        path: 'integralList',
        component: () => import('@/views/integral/integralList'),
        name: 'integralList',
        meta: {
          title: '积分商品列表',
          roles: ['admin']
        }
      }

    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
