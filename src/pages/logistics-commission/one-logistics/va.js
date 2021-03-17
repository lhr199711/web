export default {
    data () {
        return {
            userinfo: JSON.parse(window.localStorage.getItem('user'))
        }
    },
    created () {},
    watch: {},
    methods: {
        isRoles_m(arr = []) {
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
