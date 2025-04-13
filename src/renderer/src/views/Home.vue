<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@renderer/stores';
import ChatWebSocket from '../views/ChatWebSocket.vue'
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
    <div v-if="user">
        <!-- <h1>Hi {{user.firstName}}!</h1> -->
        <ChatWebSocket></ChatWebSocket>
        <!-- <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
        <p><router-link to="/users">Manage Users</router-link></p> -->
    </div>
</template>
