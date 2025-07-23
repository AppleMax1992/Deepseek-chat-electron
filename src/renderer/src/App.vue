<script setup>
import { Nav, Alert } from '@renderer/components';
import { useAuthStore } from '@renderer/stores';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
const authStore = useAuthStore();
const showNav = computed(() => route.meta.showNav !== false) // 默认显示
</script>

<template>
    <div class="app-container" :class="authStore.user && 'bg-light'">
        <Nav v-if="showNav"/>
        <Alert />
        <router-view />
    </div>
</template>

<style>
@import '@renderer/assets/base.css';
</style>