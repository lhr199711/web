export default [
    {
        path: '/product-editor/transport-list/:page',
        name: 'transport_list',
        props: route => ({
            page: route.params.page,
            dispatchCity: route.query.dispatchCity,
            dispatchSite: route.query.dispatchSite,
            destinationCity: route.query.destinationCity,
            destinationSite: route.query.destinationSite,
            serverStatus: route.query.serverStatus,
            serverCode: route.query.serverCode
        }),
        meta: {
            name: '运输产品',
            authCode: null
        },
        component: () => import('@/pages/product-editor/TransportList')
    },
    {
        path: '/product-editor/site-list/:page',
        name: 'product_site_list',
        props: route => ({
            page: route.params.page,
            city: route.query.city,
            site: route.query.site,
            serverStatus: route.query.serverStatus,
            serverCode: route.query.serverCode
        }),
        meta: {
            name: '场所产品',
            authCode: null
        },
        component: () => import('@/pages/product-editor/SiteList')
    },
    {
        path: '/product-editor/customs-list/:page',
        name: 'customs_list',
        props: true,
        meta: {
            name: '关务产品',
            authCode: null
        },
        component: () => import('@/pages/product-editor/CustomsList')
    },
    {
        path: '/product-editor/add-transport-product',
        name: 'add_transport_product',
        meta: {
            name: '新建运输产品',
            authCode: null
        },
        component: () => import('@/pages/product-editor/AddTransportProduct')
    },
    {
        path: '/product-editor/add-site-product',
        name: 'add_site_product',
        meta: {
            name: '新建场所产品',
            authCode: null
        },
        component: () => import('@/pages/product-editor/AddSiteProduct')
    },
    {
        path: '/product-editor/add-customs-product',
        name: 'add_customs_product',
        meta: {
            name: '新建关务产品',
            authCode: null
        },
        component: () => import('@/pages/product-editor/AddCustomsProduct')
    },
    {
        path: '/product-editor/edit-product',
        name: 'edit_product',
        props: route => ({
            type: route.query.type
        }),
        meta: {
            name: '编辑产品',
            authCode: null
        },
        component: () => import('@/pages/product-editor/EditProduct')
    },
    {
        path: '/product-editor/product-detail/:serverCode',
        name: 'product_detail',
        props: route => ({
            serverCode: route.params.serverCode,
            type: route.query.type
        }),
        meta: {
            name: '产品详情',
            authCode: null
        },
        component: () => import('@/pages/product-editor/ProductDetail')
    }
]
