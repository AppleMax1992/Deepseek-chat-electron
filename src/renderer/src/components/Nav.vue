<script setup>
import { useAuthStore } from '@renderer/stores';
import { useRoute } from 'vue-router'
const route = useRoute()
console.log("==============",route.meta)
const authStore = useAuthStore();
</script>

<!-- <template>
    <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
        <div class="navbar-nav">
            <router-link to="/" class="nav-item nav-link">主页</router-link>
            <router-link to="/users" class="nav-item nav-link">用户管理</router-link>
            <router-link to="/documents" class="nav-item nav-link">文档管理</router-link>
            <button @click="authStore.logout()" class="btn btn-link nav-item nav-link">注销</button>
        </div>
    </nav>
</template> -->


<template>
    <div class="menu-demo">
      <a-menu mode="horizontal" theme="dark" :selectedKeys="[route.meta.index]">
        <a-menu-item key="1"><router-link to="/" class="nav-item nav-link">主页</router-link></a-menu-item>
        <a-menu-item key="2"><router-link to="/users" class="nav-item nav-link">用户管理</router-link></a-menu-item>
        <a-menu-item key="3"><router-link to="/documents" class="nav-item nav-link">文档管理</router-link></a-menu-item>
        <a-menu-item key="4"><button @click="authStore.logout()" style="color: white;" class="btn btn-link nav-item nav-link">注销</button></a-menu-item>
      </a-menu>
    </div>
  </template>
  <style scoped>
  .menu-demo {
    box-sizing: border-box;
    width: 100%;
    /* padding: 40px; */
    background-color: var(--color-neutral-2);
  }
  </style>