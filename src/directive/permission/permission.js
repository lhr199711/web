const user = window.localStorage.getItem('user') && JSON.parse(window.localStorage.getItem('user'))
const userTypes = (user.roles || []).map((item) => item.roleType)
function checkPermission (el, binding) {
    const { value } = binding
    const roles = userTypes

    if (value && value instanceof Array) {
        if (value.length > 0) {
            const permissionRoles = value

            const hasPermission = roles.some((role) => {
                return permissionRoles.includes(role)
            })

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        }
    } else {
        throw new Error('need roles! Like v-permission="[\'DIS\',\'SALE\',...]"')
    }
}

export default {
    inserted (el, binding) {
        checkPermission(el, binding)
    },
    update (el, binding) {
        checkPermission(el, binding)
    }
}
