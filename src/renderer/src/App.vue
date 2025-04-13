<script setup>
import { Nav, Alert } from '@renderer/components';
import { useAuthStore } from '@renderer/stores';

const authStore = useAuthStore();
</script>

<template>
    <div class="app-container" :class="authStore.user && 'bg-light'">
        <Nav />
        <Alert />
        <router-view />
    </div>
</template>

<style>
@import '@renderer/assets/base.css';
</style>