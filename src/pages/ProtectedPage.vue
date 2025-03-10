<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>受限页面</h1>
        <p>如果您看到此页面，说明您已成功登录。</p>
        <v-btn @click="getProtectedData" color="primary">获取受限数据</v-btn>
        <v-alert v-if="message" :type="alertType" class="mt-3">{{ message }}</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('');
const alertType = ref('info');

const getProtectedData = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:5000/api/protected', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      message.value = data.message;
      alertType.value = 'success';
    } else {
      message.value = data.message || '获取受限数据失败';
      alertType.value = 'error';
    }
  } catch (error) {
    console.error('获取受限数据错误:', error);
    message.value = '获取数据时发生错误，请稍后再试';
    alertType.value = 'error';
  }
};
</script>
