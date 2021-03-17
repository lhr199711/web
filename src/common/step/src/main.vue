<template>
    <div>
        <ul class="stepUl">
            <li v-for="(value, index) in nav" :key="index" :class="{action:action == index}">
                <div class="circle">
                    {{value.name}}
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'step',
    props: {
        action: ''
    },
    data () {
        const vm = this
        return {
            nav: [
                {name: this.$t('commonStep.company')},
                {name: this.$t('commonStep.business')},
                {name: this.$t('commonStep.wait')},
                {name: this.$t('commonStep.open')}
            ]
        }
    },
    methods: {
    }
}
</script>

<style>
.stepUl{
    display: flex;
    justify-content: space-between;
    list-style: none;
    width: 100%;
    background: url(../../../assets/images/step-bg.png) repeat-x center;
}
.circle{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #b2d0e9;
    color: #fff;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    font-size: 16px;
    padding: 13px;
    font-weight: 600;
}
.action .circle{
    background-color: #66a1d4;
}
</style>
