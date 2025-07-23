<script setup>
import { Form, Field } from 'vee-validate';
import * as Yup from 'yup';
import { useRouter } from 'vue-router';
import { useUsersStore, useAlertStore } from '@renderer/stores';
import  UserRequest  from '@renderer/api/user';
import { Message } from '@arco-design/web-vue';
const router = useRouter();
const usersStore = useUsersStore();
const alertStore = useAlertStore();

const title = '创建用户';

// 表单校验规则
const schema = Yup.object().shape({
  username: Yup.string()
    .required('用户名是必填项'),
  password: Yup.string()
    .required('密码是必填项')
    .min(6, '密码至少为6个字符'),
});

// 表单提交
async function onSubmit(params) {
    UserRequest.postData(params).then(
        response => {
            if (response.data == null) {
                Message.error('注册失败，请重试！');
            } else {
                Message.success('注册新用户成功');
                router.push({
                    path:'/users'
                })
            }
        }
    )
}

// 新增页面初始值为空
const initialValues = {
  username: '',
  password: '',
};
</script>

<template>
  <h1>{{ title }}</h1>
  <Form
    @submit="onSubmit"
    :validation-schema="schema"
    :initial-values="initialValues"
    v-slot="{ errors, isSubmitting }"
  >
    <div class="form-row">
      <div class="form-group col">
        <label>用户名</label>
        <Field
          name="username"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.username }"
        />
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>

      <div class="form-group col">
        <label>密码</label>
        <Field
          name="password"
          type="password"
          class="form-control"
          :class="{ 'is-invalid': errors.password }"
        />
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
