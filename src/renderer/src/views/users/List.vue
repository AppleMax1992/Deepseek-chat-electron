<script setup>
import { storeToRefs } from 'pinia';

import  usersRequest  from '@renderer/api/user';
import { reactive,ref,onMounted } from 'vue';
const users = ref([])

const init = () => {
  usersRequest.getUserList().then(response => {
    if (response.code === 200) {
      users.value = response.data.result
    }
  }).catch(err => {
    window.$Message?.error?.(`出错：${err || '请稍后再试！'}`)
  })
}

onMounted(() => {
  init()
})
</script>

<template>
    <h1>用户管理</h1>
    <!-- {{ users.data }} -->
    <router-link to="/users/add" class="btn btn-sm btn-success mb-2">Add User</router-link>
    <table class="table table-striped">
        <thead>
            <tr>

                <th style="width: 30%">用户名</th>
                <th style="width: 30%">用户权限</th>
                <th style="width: 30%">用户创建日期</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="users">
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.username }}</td>
                    <td>{{ user.permissionEnum }}</td>
                    <td>{{ user.createDate }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/users/edit?id=${user.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="usersStore.delete(user.id)" class="btn btn-sm btn-danger btn-delete-user" :disabled="user.isDeleting">
                            <span v-if="user.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="users.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="users.error">
                <td colspan="4">
                    <div class="text-danger">Error loading users: {{users.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>  

  
