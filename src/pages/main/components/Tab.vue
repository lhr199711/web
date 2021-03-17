<!-- davhoon 2020-5-30  -->
<template>
    <div class='tab-warpper' ref="bscroll">
        <div class="tab-scroll-warpper" :style="{width: tabMenuArr.length * 126 + 'px'}">
            <div class="tab-item"
                 v-for='(item,index) in tabMenuArr'
                 @click.stop="handleTabItem(item)"
                 :class="{'tab-item-active':tabIndex == item.key}"
                 :key="item.key">
                 <div class="title" :title="item.title">
                    {{item.title}}
                 </div>
                <Icon type="ios-close"
                      class="tab-item-icon"
                      v-if="item.key !== 'HOME_FIRST_CODE'"
                      @click.stop="handleColse(item,index)" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
    data () {
        return {
            tabMenuArr: [],
            tabIndex: ''
        }
    },
    computed: {
        ...mapGetters(['routerTags', 'routerTagName'])
    },
    mounted () {
        this.tabMenuArr = JSON.parse(sessionStorage.getItem('tabMenuArr'))
        this.tabIndex = sessionStorage.getItem('routerTagName')
        this.$nextTick(() => {
            let bscrollDom = this.$refs.bscroll
            this.aBScroll = new BScroll(bscrollDom, {
                scrollX: true
            })
        })
    },
    watch: {
        routerTags (newVal) {
            this.tabMenuArr = newVal
            // 重新实例化better-scroll，不然如果一开始进入页面的时候无法滚动的话，添加足够多的页签的时候，也无法滚动
            this.$nextTick(() => {
                let bscrollDom = this.$refs.bscroll
                this.aBScroll = new BScroll(bscrollDom, {
                    scrollX: true
                })
            })
        },
        routerTagName (newVal) {
            this.tabIndex = newVal
        }
    },
    methods: {
        // 点击页签
        handleTabItem (item) {
            this.tabIndex = item.key
            sessionStorage.setItem('routerTagName', item.key)

            if (this.$route.path !== item.url) {
                // 跳转页面
                // 如果打开的列表页是筛选过的，要将筛选条件提取出来
                const routerQuery = JSON.parse(window.sessionStorage.getItem('routerQuery')) || {}
                const query = routerQuery[item.url] || {}
                this.$router.push({ path: item.url, ...query })
                // this.$router.push(item.url)
            }
        },
        // 关闭页签
        handleColse (item, index) {
            /**
             * 关闭标签分为关闭当前标签  和  关闭非当前标签
             * 关闭当前标签路由跳转至当前标签的上一个标签
             * 关闭非当前标签  显示的标签页不变
             */
            if (item.key === this.tabIndex) {
                sessionStorage.setItem('routerTagName', this.tabMenuArr[index - 1].key)
                this.tabIndex = this.tabMenuArr[index - 1].key
                this.$router.push(this.tabMenuArr[index - 1].url)
            }
            // 关闭页签，要将当前路由下保存在sessionStorage里的筛选条件清除
            const routerQuery = JSON.parse(window.sessionStorage.getItem('routerQuery')) || {}
            routerQuery[this.tabMenuArr[index].url] = null
            window.sessionStorage.setItem('routerQuery', JSON.stringify(routerQuery))
            this.tabMenuArr.splice(index, 1)
            sessionStorage.setItem('tabMenuArr', JSON.stringify(this.tabMenuArr))
        }
    }
}
</script>
<style lang='scss' scoped>
    .tab-warpper {
        height: 32px;
        width: calc(100% - 430px);
        margin-top: 48px;
        position: relative;
        overflow: hidden;
        .tab-scroll-warpper {
            display: flex;
            position: absolute;
            top: 0px;
            left: 0px;
            height: 32px;
            .tab-item {
                .title {
                    @include ellipsis();
                    text-align: center;
                    width: 60%;
                }
                display: flex;
                justify-content: center;
                align-items: center;
                width: 126px;
                height: 32px;
                font-size: 12px;
                color: $main-font-color;
                background: url('./images/tab.png');
                cursor: pointer;
                & + .tab-item {
                    margin-left: -5px;
                }
                .tab-item-icon {
                    font-size: 18px;
                    margin-left: 2px;
                    &:hover {
                        background-color: #ccc;
                        border-radius: 100%;
                    }
                }
            }
            .tab-item-active {
                background: url('./images/tab_active.png');
            }
        }
    }
    // .clearfix:after {
    //     visibility: hidden;
    //     display: block;
    //     font-size: 0;
    //     content: ' ';
    //     clear: both;
    //     height: 0;
    // }
</style>
