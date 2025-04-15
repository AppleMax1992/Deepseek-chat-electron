import { defineStore } from 'pinia';

import { fetchWrapper } from '@renderer/helpers';
import { useAuthStore } from '@renderer/stores';

const baseUrl = `${import.meta.env.VITE_API_URL}/documents`;

export const useDocumentsStore = defineStore({
    id: 'documents',
    state: () => ({
        documents: {},
        document: {}
    }),
    actions: {
        async register(document) {
            await fetchWrapper.post(`${baseUrl}/document`, document);
        },
        async getAll() {
            this.documents = { loading: true };
            try {
                this.documents = await fetchWrapper.get(baseUrl);    
            } catch (error) {
                this.documents = { error };
            }
        },
        async getById(id) {
            this.document = { loading: true };
            try {
                this.document = await fetchWrapper.get(`${baseUrl}/${id}`);
            } catch (error) {
                this.document = { error };
            }
        },
        async update(id, params) {
            await fetchWrapper.put(`${baseUrl}/${id}`, params);

            // update stored document if the logged in document updated their own record
            const authStore = useAuthStore();
            if (id === authStore.document.id) {
                // update local storage
                const document = { ...authStore.document, ...params };
                localStorage.setItem('document', JSON.stringify(document));

                // update auth document in pinia state
                authStore.document = document;
            }
        },
        async delete(id) {
            // add isDeleting prop to document being deleted
            this.documents.find(x => x.id === id).isDeleting = true;

            await fetchWrapper.delete(`${baseUrl}/${id}`);

            // remove document from list after deleted
            this.documents = this.documents.filter(x => x.id !== id);

            // auto logout if the logged in document deleted their own record
            const authStore = useAuthStore();
            if (id === authStore.document.id) {
                authStore.logout();
            }
        }
    }
});
