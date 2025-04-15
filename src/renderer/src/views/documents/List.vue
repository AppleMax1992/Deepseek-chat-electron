<script setup>
import { storeToRefs } from 'pinia';

import { useDocumentsStore } from '@renderer/stores';

const documentsStore = useDocumentsStore();
const { documents } = storeToRefs(documentsStore);

documentsStore.getAll();
</script>

<template>
    <h1>Documents</h1>
    <!-- <router-link to="/documents/add" class="btn btn-sm btn-success mb-2">上传文档</router-link> -->
    <router-link to="" class="btn btn-sm btn-success mb-2">上传文档</router-link>
    <table class="table table-striped">
        <thead>
            <tr>
                <th style="width: 30%">名称</th>
                <th style="width: 30%">大小</th>
                <th style="width: 30%">上传时间</th>
                <th style="width: 10%"></th>
            </tr>
        </thead>
        <tbody>
            <template v-if="documents.length">
                <tr v-for="document in documents" :key="document.id">
                    <td>{{ document.firstName }}</td>
                    <td>{{ document.lastName }}</td>
                    <td>{{ document.documentname }}</td>
                    <td style="white-space: nowrap">
                        <router-link :to="`/documents/edit/${document.id}`" class="btn btn-sm btn-primary mr-1">Edit</router-link>
                        <button @click="documentsStore.delete(document.id)" class="btn btn-sm btn-danger btn-delete-document" :disabled="document.isDeleting">
                            <span v-if="document.isDeleting" class="spinner-border spinner-border-sm"></span>
                            <span v-else>Delete</span>
                        </button>
                    </td>
                </tr>
            </template>
            <tr v-if="documents.loading">
                <td colspan="4" class="text-center">
                    <span class="spinner-border spinner-border-lg align-center"></span>
                </td>
            </tr>
            <tr v-if="documents.error">
                <td colspan="4">
                    <div class="text-danger">Error loading documents: {{documents.error}}</div>
                </td>
            </tr>            
        </tbody>
    </table>
</template>
