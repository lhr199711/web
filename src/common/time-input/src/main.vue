<template>
    <span>
        <Input v-model="hour" placeholder style="width: 70px" type="number" number/>时
        <Input v-model="mins" placeholder style="width: 70px" type="number" number :maxlength="2"/>分
    </span>
</template>

<script>
export default {
    name: 'time-input',
    props: {
        value: [Number]
    },
    data() {
        return {
            hour: this.value ? Math.floor(this.value / 60) : 0,
            mins: this.value ? this.value % 60 : 0,
            val: 0
        }
    },
    model: {
        event: 'change',
        props: 'value'
    },
    watch: {
        hour(to, from) {
            this.$emit('change', Number(to * 60 + this.mins))
        },
        mins(to, from) {
            this.$emit('change', Number(this.hour * 60 + to))
        },
        value(to, from) {
            this.hour = this.value ? Math.floor(this.value / 60) : 0
            this.mins = this.value ? this.value % 60 : 0
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
</style>
