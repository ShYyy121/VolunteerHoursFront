import { createRouter, createWebHistory } from 'vue-router';

// 导入你需要的组件
import fileupload from '../pages/FileUpload.vue';
import UploadRecords from '../pages/UploadRecords.vue';
import Login from '@/pages/Login.vue';
import ProtectedPage from '@/pages/ProtectedPage.vue';

// 配置路由规则
const routes = [
  {
    path: '/fileupload',
    name: 'fileupload',
    component: fileupload,
     meta: {
      requiresAuth: true
    }
  },
  {
    path: '/upload-records',
    name: 'UploadRecords',
    component: UploadRecords,
     meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/protected',
    name: 'ProtectedPage',
    component: ProtectedPage,
    meta: {
      requiresAuth: true  // 此页面需要登录权限
    }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token');  // 获取存储在 localStorage 中的 JWT token
  const role = localStorage.getItem('user_role');  // 获取存储在 localStorage 中的用户角色

  if (to.meta.requiresAuth && !token) {
    // 如果目标页面需要认证，但没有 token，重定向到登录页面
    next({ name: 'Login' });
  } else if (to.meta.requiresAuth && token) {
    // 如果有 token，检查用户角色权限
    if (to.name === 'fileupload' && role !== 'admin' && role !== 'level2') {
      alert('您没有权限访问此页面');
      next(from);  // 返回上一级
    } else if (to.name === 'UploadRecords' && role !== 'admin') {
      alert('您没有权限访问此页面');
      next(from);  // 返回上一级
    } else if (to.name === 'ProtectedPage' && role !== 'admin' && role !== 'level2') {
      alert('您没有权限访问此页面');
      next(from);  // 返回上一级
    } else {
      next();  // 通过导航
    }
  } else {
    next();  // 不需要认证的页面，允许访问
  }
});


export default router;
