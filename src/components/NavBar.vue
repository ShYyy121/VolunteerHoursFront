<template>
  <v-app-bar app>
    <v-toolbar-title>志愿认证系统</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="logout">退出登录</v-btn>
  </v-app-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  fetch('http://localhost:5000/api/logout', {
    method: 'GET',
    credentials: 'include', // 确保请求中包含会话 cookie
  })
    .then(async response => {
      if (response.ok) {
        // 获取响应的 JSON 数据
        const data = await response.json();

        // 删除存储在 localStorage 中的 token
        localStorage.removeItem('access_token');

        // 打印返回的信息
        console.log('退出登录信息:', data);

        // 重定向到登录页面
        router.push({ name: 'Login' }).then(() => {
          // 跳转到登录页面后，刷新一下页面
          window.location.reload();
        });
      } else {
        alert('退出登录失败，请重试');
      }
    })
    .catch(error => {
      console.error('退出登录错误:', error);
    });
};
</script>
