import  {createRouter, createWebHistory } from 'vue-router';
import CategoriasView from '../views/categorias/CategoriasView.vue';
import ProductosView from '../views/productos/ProductosView.vue';


const routes =[

    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/categorias' ,
        name: 'Categorias',
        component: CategoriasView
    },
    {
        path: '/productos' ,
        name: 'Productos',
        component: ProductosView
    }
];

const router  = createRouter({
    history: createWebHistory(),
    routes
})

export default router;