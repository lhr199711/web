import permission from '@/directive/permission/index.js' // 权限判断指令
export default {
    directives: { permission },
    data () {
        return {
            userinfo: JSON.parse(window.localStorage.getItem('user'))
        }
    },
    watch: {},
    methods: {
        // v-指定指令要刷新页面才会更新，所以用这个函数
        isRoles_m (arr = []) {
            const roles = (this.userinfo.roles || []).map(
                (item) => item.roleType
            )
            const permissionRoles = arr
            const hasPermission = roles.some((role) => {
                return permissionRoles.includes(role)
            })
            if (!hasPermission) {
                return false
            } else {
                return true
            }
        }
    }
}
