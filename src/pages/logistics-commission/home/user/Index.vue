<template>
    <div class="info">
        <div>
            <div class="avatar">
                <img :src="cptAvatar" alt="头像" />
            </div>
            <div class="name">{{ cptUser.accountName }}</div>
            <div class="sole">
                <adt-svg-icon iconClass="#icon-andaotongV3ICON_zhiwei" />
                {{ cptUser.roleName }}
            </div>
            <div class="sole">
                <adt-svg-icon iconClass="#icon-andaotongV3ICON_gongsi" />
                {{ cptUser.organizationName }}
            </div>
            <Button class="problem" type="primary">
                <adt-svg-icon iconClass="#icon-andaotongV3ICON_caozuo-bianji" />
                我有问题
            </Button>
        </div>
    </div>
</template>

<script>
    import authMixin from '../../../../mixins/authMixin'
    export default {
        name: "",
        mixins: [authMixin],
        data () {
            return {

            };
        },
        created () {

        },
        computed: {
            // 用户信息
            cptUser () {
                const user = window.localStorage.getItem('user') && JSON.parse(window.localStorage.getItem('user'))
                return user
            },
            cptAvatar () {
                let avatar = ''
                if (this.isRoles_m(['DIS'])) {
                    avatar = require('../../../../assets/images/disAvatar.png')
                }
                if (this.isRoles_m(['SALE'])) {
                    avatar = require('../../../../assets/images/saleAvatar.png')
                }
                if (this.isRoles_m(['ENT'])) {
                    avatar = require('../../../../assets/images/entAvatar.png')
                }
                return avatar
            }
        },
        mounted () {

        },
        methods: {

        }
    };
</script>

<style scoped lang="scss">
    .svg-icon {
        font-size: 16px;
    }
    .info {
        width: 300px;
        height: 370px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // padding: 30px 60px;
        margin-right: 10px;
        @include shadow;
    }
    .avatar {
        img {
            width: 65px;
            height: 65px;
            border-radius: 50%;
        }
    }
    .name {
        font-size: 16px;
        line-height: 16px;
        padding: 20px 0 40px 0px;
        font-weight: 400;
        color: #343434;
    }
    .sole {
        height: 14px;
        line-height: 14px;
        font-size: 14px;
        font-weight: 400;
        color: $conventional-font-color;
        margin-bottom: 20px;
        // overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .problem {
        background: $border-color;
        border-color: $border-color;
        color: $light-color;
        font-size: 12px;
        .icon-caozuo-bianji {
            font-size: 14px;
        }
    }
</style>
