<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>
export default {
    name: "AdtSvgIcon",
    props: {
        iconClass: {
            type: String,
            required: true
        }
    },
    computed: {
        iconName () {
            return `${this.iconClass}`;
        },
        svgClass () {
            if (this.iconClass) {
                return "svg-icon icon-" + this.iconClass.split("_").pop();
            } else {
                return "svg-icon";
            }
        }
    },
    data () {
        return {};
    },
    watch: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
