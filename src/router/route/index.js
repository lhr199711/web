import login from './login'
import templateManage from './templateManage'
import authorityManage from './authorityManage'
import dictionaryManage from './dictionaryManage'
import standardMapper from './standardMapper'
import logisticsSolutions from './logisticsSolutions'
import freightRequest from './freightRequest'
import executionViewer from './executionViewer'
import logisticsCommission from './logisticsCommission'
import dispatchCenter from './dispatchCenter'
import productEditor from './productEditor'
import logisticsWholeJourneyPlay from './logisticsWholeJourneyPlay'
import home from './home'
import basePlatform from './basePlatform'
import logisticsEntrust from './logisticsEntrust'
import freightRequirement from './freightRequirement'
import userCenterManage from './userCenterManage'
import logisticsPlan from './logisticsPlan'
export default [
    {
        path: '/register',
        name: 'register',
        component: () => import('@/pages/register/Index')
    },
    {
        path: '/map-home',
        name: 'map_home',
        props: route => ({
            redirect: route.query.redirect
        }),
        meta: {
            title: '地图首页',
            authCode: null
        },
        component: () => import('@/pages/home/map-home/Index')
    },
    {
        path: '/',
        name: 'home',
        props: route => ({
            redirect: route.query.redirect
        }),
        meta: {
            name: '首页',
            authCode: null
        },
        component: () => import('@/pages/main/Index.vue'),
        children: [
            ...templateManage,
            ...authorityManage,
            ...dictionaryManage,
            ...standardMapper,
            ...logisticsSolutions,
            ...freightRequest,
            ...executionViewer,
            ...logisticsCommission,
            ...dispatchCenter,
            ...productEditor,
            ...logisticsWholeJourneyPlay,
            ...home,
            ...basePlatform,
            ...logisticsEntrust,
            ...freightRequirement,
            ...userCenterManage,
            ...logisticsPlan
        ]
    },
    ...login
]
