<template>
    <div class="choose-role">
        <div class="content">
            <h3>选择机构</h3>
            <Select v-model="organization" clearable placeholder="请选择机构" @on-change="chooseOrganization">
                <Option v-for="option in orgList" :key="option.organId" :value="JSON.stringify(option)">
                    {{ option.organName }}
                </Option>
            </Select>
            <div class="role-list">
                <div v-for="role in roleList" :key="role.roleId" class="role" @click="chooseRole(role.roleId)">
                    <!-- <svg class="iconfont" aria-hidden="true">
                        <use :xlink:href="`#${role.iconCode || 'icondengluzhuceqietu_zhanghudenglu'}`"></use>
                    </svg> -->
                    {{ role.roleName }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import validateRules from '@/libs/validateRules'
    import { apiGetOrgRoleMenuTree } from '@/api/login'
    import { apiGetMenu } from '@/api/mock/mock'
    export default {
        props: {
            orgList: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                isSeparate: false, // 是否拆分项目，不拆分点击菜单就加载路由，拆分点击菜单使用iframe加载其他项目
                organization: '', // 选中的部门信息
                organizationId: '', // 选中的部门的id
                roleList: [] // 选中的部门的角色信息
            }
        },
        methods: {
            // 选择机构
            chooseOrganization (organization) {
                // 解析获取到的信息
                let organizationParse = JSON.parse(organization)
                this.organizationId = organizationParse.organId
                this.roleList = organizationParse.roles
            },
            // 选择角色
            chooseRole (roleId) {
                apiGetOrgRoleMenuTree({ data: { organId: this.organizationId, roleId } }).then(({ data }) => {
                // apiGetMenu().then(({ data }) => {
                    // window.localStorage.setItem('roleMenu', JSON.stringify(data.routes))
                    window.localStorage.setItem('roleMenu', JSON.stringify(data.routers))
                    // window.localStorage.setItem('roleMenu', JSON.stringify(data.routers[0].children))
                    window.localStorage.setItem('user', JSON.stringify(data.account))
                    // 登录成功、获取用户、菜单信息成功之后跳转页面
                    if (this.isSeparate) {
                        this.$router.push({ path: '/', query: { url: data.indexUrl } })
                    } else {
                        this.$router.push({ path: this.redirect ? window.decodeURIComponent(this.redirect) : data.indexUrl })
                        // this.$router.push({ path: this.redirect ? window.decodeURIComponent(this.redirect) : '/' })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .ivu-select-single .ivu-select-selection .ivu-select-placeholder {
        line-height: 40px;
    }
    .choose-role {
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 100px);
        .content {
            width: 1100px;
            height: 420px;
            padding: 110px 95px 0 95px;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0px 0px 27px 0px rgba(0, 0, 0, 0.06);
            h3 {
                font-size: 20px;
                margin-bottom: 20px;
            }
            .role-list {
                display: flex;
                margin-top: 60px;
                padding-bottom: 20px;
                width: 100%;
                overflow-x: auto;
                @extend %scrollbar-x;
                .role {
                    @include ellipsis();
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                    margin-right: 80px;
                    width: 150px;
                    height: 44px;
                    font-size: 18px;
                    color: $conventional-font-color;
                    background-color: $border-color;
                    border: 1px solid $border-color;
                    cursor: pointer;
                    &:hover, &.active {
                        color: $main-font-color;
                        background-color: #E8EFF5;
                        border-color: $light-color;
                    }
                }
            }
        }
    }
</style>
