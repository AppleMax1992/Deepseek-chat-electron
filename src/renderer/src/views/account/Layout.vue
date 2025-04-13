<script setup>
import { useAuthStore } from '@renderer/stores';
import router from '@renderer/router';

// redirect home if already logged in
const authStore = useAuthStore();
if (authStore.user) {
    router.push('/');
}
</script>

<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-8 offset-sm-2 mt-5">
                <router-view />
            </div>
        </div>
    </div>
</template>
