<template>
<div>
</div>
</template>
<script>
export default {
    mounted () {
        const user = JSON.parse(window.localStorage.getItem('user')).roles[0].roleType
        switch (user) {
        case 'ENT':
            this.$router.push(`/freight-request/list-client/1`)
            break
        case 'SALE':
            this.$router.push(`/freight-request/sale-list/1`)
            break
        case 'DIS':
            this.$router.push(`/freight-request/dispatch-list/1`)
            break
        }
    }
}
</script>>