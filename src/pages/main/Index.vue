<template>
    <div class="public-main">
        <header>
            <div class="header-content">
                <img class="logo" src="../../assets/anod-logo.png" alt="anodlink-logo">
                <!-- 展开在头部的menu -->
                <div class="spread-menu">
                    <div v-for="(firstMenu, index) in spreadMenu" :key="index" :class="['first-menu', { active: spreadMenuActiveIndex === index }]" @click="clickFirstMenu(firstMenu, index)">
                        {{ firstMenu.name }}
                        <div class="second-menu-content">
                            <div v-for="(secondMenu, idx) in firstMenu.children" :key="idx" class="second-menu" @click.stop="goToPage(secondMenu.path, firstMenu)">
                                {{ secondMenu.name }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-top-content">
                    <!-- 消息通知 -->
                    <news-tip />
                    <div class="user">
                        <svg class="iconfont avator" aria-hidden="true">
                            <use xlink:href="#icon-andaotongcaidanICON_gerenzhongxin"></use>
                        </svg>
                        <!-- <span class="user-name">{{ }}</span> -->
                        <div class="log-off">
                            <span @click="logOff()">退出登录</span>
                        </div>
                    </div>
                    <svg :class="['iconfont', 'menu-icon', { active: menuIconActive }]" aria-hidden="true" @click="clickMenuIcon">
                        <use xlink:href="#icon-caidan" />
                    </svg>
                </div>
            </div>
        </header>
        <div v-if="displayMenu" class="center-container">
            <!-- 点击右上角的菜单，要展示菜单 -->
            <div class="menu-container">
                <div class="first-menu-name">
                    {{ displayMenu.name }}
                </div>
                <div class="second-menu-lists">
                    <div v-for="(secondMenu, idx) in displayMenu.children" :key="idx" :class="['second-menu-name', { active: displaySecondMenuActiveIndex === idx }]" @click="goToPage(secondMenu.path, displayMenu, idx)">
                        {{ secondMenu.name }}
                    </div>
                </div>
            </div>
        </div>
        <div class="center-container">
            <div :class="['main-body', { 'is-separate': isSeparate, 'display-menu': displayMenu }]">
                <!-- 项目不分离，在一个项目里开发 -->
                <router-view v-if="!isSeparate" />
                <!-- 项目分离，用iframe加载 -->
                <iframe v-else class="iframe" :src="route" frameborder="0"></iframe>
            </div>
        </div>
        <Drawer
            v-model="menuIconActive"
            width="910"
        >
            <div class="shrink-menu">
                <!-- 一列放四个菜单 -->
                <div v-for="(column, key) in Math.ceil(shrinkMenu.length / menuNumber)" :key="key" class="column">
                    <div v-for="(firstMenu, index) in shrinkMenu.slice(key * menuNumber, key * menuNumber + menuNumber)" :key="index" class="menu">
                        <span class="first-menu" @click="clickFirstMenu(firstMenu)">
                            {{ firstMenu.name }}
                        </span>
                        <div v-for="(secondMenu, idx) in firstMenu.children" :key="idx" class="second-menu" @click.stop="goToPage(secondMenu.path, firstMenu, idx)">
                            {{ secondMenu.name }}
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import newsTip from './components/NewsTip'
    export default {
        components:{
            newsTip
        },
        data () {
            return {
                isSeparate: false, // 是否拆分项目，不拆分点击菜单就加载路由，拆分点击菜单使用iframe加载其他项目
                spreadMenuActiveIndex: '', //选中的spreadMenu菜单下标
                displaySecondMenuActiveIndex: '', //选中的displayMenu菜单下标
                spreadMenu: [], // 头部直接展开展示的menu（取前5个）
                shrinkMenu: [], // 右上角收缩起来的menu
                menuIconActive: false, // 触发icon
                displayMenu: null, // 点击shrinkMenu二级菜单显示的菜单
                menuNumber: 4, // shrinkMenu一列显示的菜单个数
                secondMenuList: [], // 选择右上角收缩起来的二级菜单，得到的所有的二级菜单
                route: this.$route.query.url ? decodeURIComponent(this.$route.query.url) : '' // 路由地址
            }
        },
        created () {
            let roleMenu = JSON.parse(localStorage.getItem('roleMenu'))
            // this.spreadMenu = roleMenu.splice(0, 5)
            // console.log(roleMenu,'roleMenu')1950
            this.shrinkMenu = roleMenu
            this.displayMenu = JSON.parse(sessionStorage.getItem('displayMenu'))
        },
        methods: {
            // 点击spreadMenu一级菜单
            clickFirstMenu (firstMenu, index) {
                // 有路由，说明没有二级菜单，点击直接跳转
                if (firstMenu.path) {
                    if (index === undefined) {
                        this.menuIconActive = false
                    }
                    this.goToPage(firstMenu.path, firstMenu)
                } else if (index !== undefined) {
                    this.spreadMenuActiveIndex === index ? this.spreadMenuActiveIndex = '' : this.spreadMenuActiveIndex = index
                }
            },
            // spreadMenu跳转
            // route: 路由， realmName: 域名， idx有值，说明是从shrinkMenu点击的
            goToPage (route, firstMenu, idx) {
                if (idx !== undefined) {
                    this.menuIconActive = false
                    this.displayMenu = firstMenu
                    this.displaySecondMenuActiveIndex = idx
                    sessionStorage.setItem('displayMenu', JSON.stringify(this.displayMenu))

                } else {
                    // 隐藏页面上展示的菜单
                    this.displayMenu = null
                    sessionStorage.removeItem('displayMenu')
                    // 隐藏二级菜单
                    this.spreadMenuActiveIndex = ''
                }

                if (this.isSeparate) {
                    // 在iframe里显示对应的页面
                    this.route = firstMenu.realmName + route
                    this.$router.push({ path: '', query: { url: firstMenu.realmName + route } })
                } else {
                    // 如果打开的列表页是筛选过的，要将筛选条件提取出来，以便从其他页面回来的时候可以
                    const routerQuery = JSON.parse(window.sessionStorage.getItem('routerQuery')) || {}
                    const query = routerQuery[route] || {}
                    this.$router.push({ path: route, ...query })
                }
            },
            // 点击menuIcon
            clickMenuIcon () {
                this.menuIconActive = !this.menuIconActive
                // 可能spreadMenu的二级菜单还没收起来就点击了icon
                this.spreadMenuActiveIndex = ''
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
    @import './style.scss';
</style>
