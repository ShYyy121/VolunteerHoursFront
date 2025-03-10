<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="10">
          <v-toolbar flat color="primary">
            <v-toolbar-title class="white--text">用户登录</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="studentId"
                label="学号"
                prepend-icon="mdi-account"
                :rules="[rules.required]"
                color="primary"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                label="密码"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="[rules.required]"
                color="primary"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="submit" :disabled="!valid">登录</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter(); // 使用 useRouter 获取路由实例
import {da} from "vuetify/locale";

const studentId = ref('')
const password = ref('')
const showPassword = ref(false)
const valid = ref(false)
const form = ref(null)

const rules = {
  required: value => !!value || '此项为必填项',
}

const submit = () => {
  if (form.value.validate()) {
    // 发送请求到后端进行验证
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: studentId.value,
        password: password.value,
      }),
    })
      .then(async response => {
        const data = await response.json()
        if (response.ok) {
          // 登录成功，保存 JWT token
          localStorage.setItem('access_token', data.token);
          localStorage.setItem('user_role', data.role);  // 保存用户角色信息
          console.log('登录成功', data)
          // 重定向到首页或受限页面
          if (data.role === 'admin'){
                      setTimeout(() => {
            router.push({ name: 'UploadRecords' }).then(
              ()=>{
                 window.location.reload();
              }
            );
          }, 1000);
          }else if (data.role === 'level2'){
            setTimeout(() => {router.push({ name: 'fileupload' }).then(
              ()=>{
                 window.location.reload();
              }
            );;
          }, 1000);
            }

        } else {
          // 显示错误信息
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('登录错误:', error);
      });
  }
}

</script>

<style scoped>
.v-card {
  margin-top: 100px;
}
</style>
