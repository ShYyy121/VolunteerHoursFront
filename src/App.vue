<template>
  <v-app>
    <!-- 动态显示导航栏：只有在用户登录时显示 -->
    <NavBar v-if="isLoggedIn" />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import NavBar from '@/components/NavBar.vue';

// 使用 `computed` 来判断用户是否已登录
const isLoggedIn = computed(() => {
  // 检查 localStorage 中是否有有效的 token
  return !!localStorage.getItem('access_token');
});
</script>

<style scoped>
/* 如果需要减少默认的边距和填充，可以调整这些值 */
v-container {
  padding-top: 16px; /* 控制内容距顶部的距离，根据需要调整 */
}
</style>
