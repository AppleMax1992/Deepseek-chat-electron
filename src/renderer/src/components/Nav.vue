<script setup>
import { useAuthStore } from '@renderer/stores';

const authStore = useAuthStore();
</script>

<template>
    <nav v-show="authStore.user" class="navbar navbar-expand navbar-dark bg-dark">
        <div class="navbar-nav">
            <router-link to="/" class="nav-item nav-link">主页</router-link>
            <router-link to="/users" class="nav-item nav-link">用户管理</router-link>
            <router-link to="/documents" class="nav-item nav-link">文档管理</router-link>
            <button @click="authStore.logout()" class="btn btn-link nav-item nav-link">注销</button>
        </div>
    </nav>
</template>