/**
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
export function filterAllRoutes(constantRoutes) {
  return constantRoutes.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = resolve => require(['@/layouts'], resolve);
      } else if (route.component === 'EmptyLayout') {
        route.component = resolve => require(['@/layouts/EmptyLayout'], resolve);
      } else {
        let path = 'views/' + route.component;
        if (new RegExp('^/views/.*$').test(route.component) || new RegExp('^views/.*$').test(route.component)) {
          path = route.component;
        } else if (new RegExp('^/.*$').test(route.component)) {
          path = 'views' + route.component;
        } else if (new RegExp('^@views/.*$').test(route.component)) {
          path = route.component.str.slice(2);
        } else {
          path = 'views/' + route.component;
        }
        route.component = resolve => require([`@/${path}`], resolve);
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAllRoutes(route.children);
    }
    if (route.children && route.children.length === 0) {
      delete route.children;
    }
    // hide
    route.hidden = route.hidden === 1 ? true : false;
    return true;
  });
}

/**
 * @description 判断当前路由是否包含权限
 * @param permissions
 * @param route
 * @returns {boolean|*}
 */
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permissions) {
    return permissions.some(role => route.meta.permissions.includes(role));
  } else {
    return true;
  }
}

/**
 * @description intelligence模式根据permissions数组拦截路由
 * @param routes
 * @param permissions
 * @returns {[]}
 */
export function filterAsyncRoutes(routes, permissions) {
  const finallyRoutes = [];
  routes.forEach(route => {
    const item = { ...route };
    if (hasPermission(permissions, item)) {
      if (item.children) {
        item.children = filterAsyncRoutes(item.children, permissions);
      }
      finallyRoutes.push(item);
    }
  });
  return finallyRoutes;
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
export function listToTree(list, tree, parentId) {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parent_id === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: [],
        meta: {
          title: item.title,
          icon: item.icon,
        },
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id);
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children;
      }
      // 加入到树中
      tree.push(child);
    }
  });
}
