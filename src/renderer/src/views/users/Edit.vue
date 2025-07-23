<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { useUsersStore, useAlertStore } from '@renderer/stores';
import router from '@renderer/router';


import  usersRequest  from '@renderer/api/user';
import { reactive,ref,onMounted } from 'vue';


const usersStore = useUsersStore();
const alertStore = useAlertStore();
const route = useRoute();
const id = route.query.id;
const user = ref(null)
const username = ref()
let title = '创建用户';
if (id) {
    // edit mode
    title = '编辑用户';

}

const init = async () => {
    const param = {
        id: id
    }
    const res =  await usersRequest.getUser(param)
    user.value = res.data 
}

onMounted(() => {
  init()
})


const schema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required'),
    password: Yup.string()
        .transform(x => x === '' ? undefined : x)
        // password optional in edit mode
        .concat(user ? null : Yup.string().required('Password is required'))
        .min(6, 'Password must be at least 6 characters')
});

async function onSubmit(values) {
    try {
        let message;
        if (user) {
            await usersRequest.update(user.value.id, values)
            message = 'User updated';
        } else {
            await usersStore.register(values);
            message = 'User added';
        }
        await router.push('/users');
        alertStore.success(message);
    } catch (error) {
        alertStore.error(error);
    }
}
</script>

<template>
    <h1>{{title}}</h1>
    <template v-if="user">
        <Form @submit="onSubmit" :validation-schema="schema" :initial-values="user" v-slot="{ errors, isSubmitting }">
            <div class="form-row">
                <div class="form-group col">
                    <label>用户名</label>
                    <Field name="username" type="text"  class="form-control" :value="user.username" :class="{ 'is-invalid': errors.username }" />
                    <div class="invalid-feedback">{{ errors.username }}</div>
                </div>
                <div class="form-group col">
                    <label>
                        重置密码
                        <em v-if="user">(如不更新则无需填充)</em>
                    </label>
                    <Field name="password" type="text" class="form-control" :class="{ 'is-invalid': errors.password }" />
                    <div class="invalid-feedback">{{ errors.password }}</div>
                </div>
            </div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="isSubmitting">
                    <span v-show="isSubmitting" class="spinner-border spinner-border-sm mr-1"></span>
                    保存
                </button>
                <router-link to="/users" class="btn btn-link">取消</router-link>
            </div>
        </Form>
    </template>
    <template v-if="user?.loading">
        <div class="text-center m-5">
            <span class="spinner-border spinner-border-lg align-center"></span>
        </div>
    </template>
    <template v-if="user?.error">
        <div class="text-center m-5">
            <div class="text-danger">Error loading user: {{user.error}}</div>
        </div>
    </template>
</template>
