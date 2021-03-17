<template>
    <div>
        <div>
            <p class="spacing">协同协作1:</p>
            <div class="cooperation">
                <div class="cooperation-notice">
                    <span>协同协作方：</span>
                </div>
                <Row class="cooperation-description">
                    <Col span="8">协同协作方式：{{1122}}</Col>
                    <Col span="16">协同协作内容：{{3344}}</Col>
                </Row>
            </div>
        </div>
        <div>
            <p class="spacing">协同协作2:</p>
            <div class="cooperation">
                <div class="cooperation-notice">
                    <span>协同协作方：</span>
                </div>
                <Row class="cooperation-description">
                    <Col span="8">协同协作方式：{{1122}}</Col>
                    <Col span="16">协同协作内容：{{3344}}</Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Collaboration',
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
    // 协同协作
    .cooperation {
        padding: 0 20px;
        background-color: white;
        .cooperation-notice {
            padding: 10px 0;
            border-bottom: 1px dashed  $border-color;
            .cooperation-notice-people{
                border: 1px solid $placeholder-font-color;
                border-radius: 5px;
                padding: 3px;
                color: $main-font-color;
            }
            .cooperation-company {
                padding: 10px 50px;
            }
        }
        .cooperation-description {
            padding: 10px 0;
        }
    }
</style>