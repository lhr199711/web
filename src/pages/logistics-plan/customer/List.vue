<template>
    <div>
        <div class="public-search-condition search-padding">
            <span class="search-title">查询条件</span>
            <Row>
                <Col span="8">
                    <input type="text">
                </Col>
                <Col span="8">
                    <input type="text">
                </Col>
                <Col span="8">
                    <button>搜索</button>
                </Col>
            </Row>
            <Form ref="formValidate" :model="itemData" :rules="ruleValidate">
                <FormItem label="启运地" prop="organName">
                    <Input v-model="itemData.organName" />
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                itemData: {},
                ruleValidate: {}
            }
        },
    }
</script>

<style lang="scss" scoped>
.search-padding {
    padding: 100px 200px;
}
</style>