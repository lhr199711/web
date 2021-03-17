
<template>
    <div class="layout">
        <Layout>
            <Sider collapsible
                   class="menu-wrapper"
                   :collapsed-width="78"
                   v-model="isCollapsed">
                <div class="logo-wrapper">
                    <div class="logo">
                        <img src="../../assets/logo.png" alt="anodlink-logo" />
                    </div>
                    <!-- <Input v-model="menuSearch" prefix="ios-search" placeholder="输入需要查询的菜单项" /> -->
                </div>
                <Menu :active-name="menuActiveKey" @on-select="goTo" :class="menuitemClasses" width="auto" accordion>
                    <div v-for="(nav, index) in navList" :key="index">
                        <!-- 没有二级菜单 -->
                        <MenuItem :name="nav.menuCode" v-if="nav.menuRoute">
                            <div class="menu-name">
                                <svg class="iconfont" aria-hidden="true">
                                    <use :xlink:href="`#${nav.iconCode || 'icondian'}`"></use>
                                </svg>
                                {{ nav.menuName }}
                            </div>
                        </MenuItem>
                        <!-- 有二级菜单-->
                        <Submenu :name="nav.menuCode" v-else>
                            <template slot="title">
                                <div class="menu-name">
                                    <svg class="iconfont" aria-hidden="true">
                                        <use :xlink:href="`#${nav.iconCode || 'icondian'}`"></use>
                                    </svg>
                                    {{ nav.menuName }}
                                </div>
                            </template>
                            <MenuItem v-for="(subNav, subIndex) in nav.menuInfoList" :key="subIndex" :name="subNav.menuCode">
                                <!-- 没有三级菜单 -->
                                <div class="menu-name" v-if="subNav.menuRoute">
                                    <!-- <svg class="iconfont" aria-hidden="true">
                                        <use :xlink:href="`#${nav.iconCode || 'icondian'}`"></use>
                                    </svg> -->
                                    <span class="dot"></span>
                                    {{ subNav.menuName }}
                                </div>
                                <!-- 有三级菜单-->
                                <div class="has-third-menu" v-else>
                                    <Submenu :name="subNav.menuCode">
                                        <template slot="title">
                                            <div class="menu-name">
                                                <!-- <svg class="iconfont" aria-hidden="true">
                                                    <use :xlink:href="`#${subNav.iconCode || 'icondian'}`"></use>
                                                </svg> -->
                                                <span class="dot"></span>
                                                {{ subNav.menuName }}
                                            </div>
                                        </template>
                                        <MenuItem v-for="(thirdNav, thirdIndex) in subNav.menuInfoList" :key="thirdIndex" :name="thirdNav.menuCode" :class="{'third-menu-item-active': activeMenuCode === thirdNav.menuCode }">
                                            <div class="menu-name">
                                                <!-- <svg class="iconfont" aria-hidden="true">
                                                    <use :xlink:href="`#${nav.iconCode || 'icondian'}`"></use>
                                                </svg> -->
                                                <span class="dot"></span>
                                                {{ thirdNav.menuName }}
                                            </div>
                                        </MenuItem>
                                    </Submenu>
                                </div>
                            </MenuItem>
                        </Submenu>
                    </div>
                </Menu>
            </Sider>
            <Layout class="right-container">
                <Header class="header-wrapper">
                    <Tab ref="Tab" />
                    <div class="user-info">
                        <div class="user">
                            <img class="avator" src="" alt="" v-if="false">
                            <svg class="iconfont avator" aria-hidden="true" v-else>
                                <use xlink:href="#icon-andaotongcaidanICON_gerenzhongxin"></use>
                            </svg>
                            <span class="user-name">{{userData.accountName}}</span>
                            <div class="log-off">
                                <span @click="logOff()">退出登录</span>
                            </div>
                        </div>
                        <div class="role">
                            <svg class="iconfont" aria-hidden="true">
                                <use xlink:href="#icon-andaotongV3ICON_gongsichaxun"></use>
                            </svg>
                            <span>{{userData.roleName}}</span>
                        </div>
                    </div>
                </Header>
                <Content>
                    <router-view />
                    <!-- <iframe class="iframe" :src="`http://127.0.0.1:3003${route}`" frameborder="0"></iframe> -->
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
// import Tab from './components/scorll'
import Tab from './components/Tab'
import MRouter from '@/router/route/index'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// import { apiMenuInfoQueryByAppCode } from '@/api/menuPermission'

export default {
    components: {
        Tab
    },
    data () {
        return {
            activeMenuCode: '',
            menuActiveKey: 'authList',
            isCollapsed: false,
            menuSearch: '',
            MRouter: this.$router.options.routes,
            tabMenuArr: [],
            subMenuArr: [],
            navList: [],
            userData: {},
            route: this.$route.query.url ? decodeURIComponent(this.$route.query.url) : '/product-editor/transport-list/1' // 路由地址
        }
    },
    created () {
        // 动态改变有三级菜单的二级菜单的样式
        this.$nextTick(() => {
            const thirdMenus = document.querySelectorAll('.has-third-menu')
            for (const menu of thirdMenus) {
                menu.parentNode.style.padding = 0
            }
        })
        // if(!JSON.parse(window.localStorage.getItem('menu'))) {
            //     apiMenuInfoQueryByAppCode({ path: 'TEST' }).then(({ data }) => {
                //         this.navList = data
        //     })
        // } else {
            //     this.navList = JSON.parse(window.localStorage.getItem('menu'))
        // }
        // 从本地获取菜单列表
        this.navList = JSON.parse(window.localStorage.getItem('menu'))
        // 从本地获取用户信息
        this.userData = JSON.parse(window.localStorage.getItem('user')) || {}
        /**
         *  首次进入显示首页
         */
        if (sessionStorage.getItem('tabMenuArr') == null) {
            sessionStorage.setItem('tabMenuArr', JSON.stringify([{ key: 'HOME_FIRST_CODE', title: '首页', url: '/logisstics-commission/home' }]))
        }

        if (sessionStorage.getItem('routerTagName') == null) {
            sessionStorage.setItem('routerTagName', 'home')
        }

        this.tabMenuArr = JSON.parse(sessionStorage.getItem('tabMenuArr'))
    },
    computed: {
        menuitemClasses: function() {
            return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
        },
        ...mapGetters(['routerTags'])
    },

    methods: {
        ...mapMutations(['addTags', 'routerTagName']),

        /**
         *   点击菜单的方法
         *
         */
        goTo (val) {
            // 给三级菜单手动添加选中效果
            this.activeMenuCode = val
            let route = null
            let newArr = []
            recursion(this.navList)
            function recursion (data) {
                data.forEach(element => {
                    const menuInfoList = element.menuInfoList || []
                    if (element.menuRoute) {
                        newArr = [...newArr, element]
                    } else {
                        recursion(menuInfoList)
                    }
                })
            }
            newArr.forEach(item => {
                if (item.menuCode == val) {
                    route = {
                        title: item.menuName,
                        url: item.menuRoute,
                        key: item.menuCode
                    }
                }
            })

            /**
             *  判断页签数组是否有该项，如果有则不再添加，否则添加
             */
            let bool = this.tabMenuArr.some(item => item.key == route.key)
            if (!bool) {
                this.tabMenuArr = [...this.tabMenuArr, route]
            }
            sessionStorage.setItem('tabMenuArr', JSON.stringify(this.tabMenuArr))
            sessionStorage.setItem('routerTagName', route.key)
            this.routerTagName(route.key)
            this.addTags(this.tabMenuArr)
            // 如果打开的列表页是筛选过的，要将筛选条件提取出来，以便从其他页面回来的时候可以
            const routerQuery = JSON.parse(window.sessionStorage.getItem('routerQuery')) || {}
            const query = routerQuery[route.url] || {}
            this.$router.push({ path: route.url, ...query })
            // this.route = route.url
            // this.$router.push({ path: '', query: { url: route.url } })
        },
        // 退出登录
        logOff () {
            window.localStorage.clear()
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './styleOld.scss';
    /deep/ .ivu-layout-sider-trigger{
        display: none;
    }
    /deep/.has-third-menu /deep/ .ivu-menu-vertical .ivu-menu-submenu-title {
        padding: 0 !important;
    }
    .iframe {
        width: calc(100vw - 240px);
        height: calc(100vh - 130px);
    }
</style>
