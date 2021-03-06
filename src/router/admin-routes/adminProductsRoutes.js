export const adminProductRoutes = {
    path: 'products',
    component: () => import('@/views/admin/products/Products'),
    children: [
        {
            path: '',
            name: 'products-admin',
            component: () => import('@/views/admin/products/ProductHome')
        },
        {
            path: 'insert',
            name: 'insert-product',
            component: () => import('@/views/admin/products/ProductInsert')
        },
        {
            path: 'product/:id/details',
            name: 'product-details',
            component: () => import('@/views/admin/products/ProductDetails')
        },
        {
            path: 'product/:id/edit',
            name: 'product-edit',
            component: () => import('@/views/admin/products/ProductEdit')
        },
        {
            path: 'category-view',
            name: 'admin-category-view',
            component: () => import('@/views/admin/products/CategoryView')
        },
        {
            path: 'search',
            name: 'admin-search-view',
            component: () => import('@/views/admin/products/SearchProducts')
        },
        {
            path: '*',
            redirect: '/admin/products'
        }
    ]
};
