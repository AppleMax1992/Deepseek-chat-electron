import { Layout, List, AddEdit } from '@renderer/views/documents';

export default {
    path: '/documents',
    component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit }
    ]
};
