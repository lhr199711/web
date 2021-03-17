<template>
    <div>
        <div class="spacing">监控:</div>
        <div class="monitor">
            <div class="monitor-abnormal">
                <Row>
                    <Col span="4">异常1</Col>
                    <Col span="6">异常通知方式：{{}}</Col>
                    <Col span="14">异常通知内容：{{}}</Col>
                </Row>
            </div>
            <div class="monitor-notice">
                <span>异常通知企业：</span>
            </div>
        </div>
        <div class="monitor">
            <div class="monitor-abnormal">
                <Row>
                    <Col span="4">异常1</Col>
                    <Col span="6">异常通知方式：{{}}</Col>
                    <Col span="14">异常通知内容：{{}}</Col>
                </Row>
            </div>
            <div class="monitor-notice">
                <span>异常通知企业：</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Monitor',
        data() {
            return {
            }
        },
    }
</script>

<style lang="scss" scoped>
    // 通用间距顶部和底部10px
    .spacing {
        margin: 10px 0;
    }
    // 监控
    .monitor {
        background-color: white;
        .monitor-abnormal {
            padding: 10px 0;
            margin: 0 20px;
            border-bottom: 1px dashed  $border-color;
        }
        .monitor-notice {
            padding: 10px 20px;
            border-bottom: 1px solid $light-color;
            .monitor-notice-people{
                padding: 3px;
                color: $main-font-color;
                border: 1px solid $placeholder-font-color;
                border-radius: 5px;
            }
            .monitor-company {
                padding: 10px 50px;
            }
        }
        &:last-child {
            .monitor-notice {
                border-bottom: none;
            }
        }
    }
</style>