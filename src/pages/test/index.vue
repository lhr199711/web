<template>
    <div style="padding:50px 100px; margin: 0 auto">
        <div class="books">
            <span>{{ $t('test.fresh') }}</span>;
            <span>{{ $t('test.chilled') }}</span>;
        </div>
        <Button @click="tryone('index')">点一下</Button>
        <image-uploader :width="200" :value = value :url="`${$baseUrl}file/upload`" />
        <div>
            <Form ref="formValidate" :model="formValidate" :label-width="120">
                <FormItem prop="paymentImages" :label-width="0">
                    <manay-ImageUploader v-model="formValidate.paymentImages" :maxlength="3" :disabled="true" :value="formValidate.paymentImages"   />
                </FormItem>
            </Form>
        </div>
        <router-link :to="{ name: 'order' }">去订单页</router-link>
        <p>{{ this.state.child }}</p>
        <!-- <paginator :currentPage="~~page" :total="~~total" class="line-margin-bottom" /> -->
        <Button type="primary">Primary</Button>
        <Button type="primary" ghost>Primary</Button>
        <Button type="error" ghost>Error</Button>
        <Button type="primary" disabled>Primary(Disabled)</Button>
        <Button shape="circle" icon="ios-search">Search</Button>
        <Form :model="formItem" :label-width="80">
            <FormItem label="Switch">
                <i-switch v-model="formItem.switch" size="large">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
        </Form>
        <Radio v-model="single">Radio</Radio>
        <Checkbox v-model="single">Checkbox</Checkbox>
        <Form ref="formInline" :model="formInline" inline>
            <FormItem prop="user">
                <Input type="text" v-model="formInline.user" placeholder="Username">
                </Input>
            </FormItem>
            <FormItem prop="password">
                <Input type="password" v-model="formInline.password" placeholder="Password">
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formInline')">Signin</Button>
            </FormItem>
        </Form>
        <Select v-model="model1" style="width:160px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="model15" prefix="ios-home" style="width:200px">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="model1" style="width:200px">
            <OptionGroup label="Hot Cities">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </OptionGroup>
            <OptionGroup label="Other Cities">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </OptionGroup>
        </Select>
         <Input v-model="value5" type="textarea" placeholder="Enter something..." />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { apiGetDictionary } from '@/api/dictionary.js'
import { toTimestamp } from '@/libs/utils.js'
// import manayImageUploader from '@/pages/common/manay-image-uploader/index.vue'
export default {
    // components: {
    //     manayImageUploader
    // },
    data() {
        return {
            value: [],
            formItem: {
                switch: true,
            },
            formValidate: {
                paymentImages: []
            },
            single: true,
            formInline: {
                user: '',
                password: ''
            },
            cityList: [
                {
                    value: 'New York',
                    label: '纽约'
                },
                {
                    value: 'London',
                    label: 'London'
                },
                {
                    value: 'Sydney',
                    label: 'Sydney'
                },
                {
                    value: 'Ottawa',
                    label: 'Ottawa'
                },
                {
                    value: 'Paris',
                    label: 'Paris'
                },
                {
                    value: 'Canberra',
                    label: 'Canberra'
                }
            ],
            model1: '',
            model15: '',
            value5: ''
        }
    },
    computed: {
        ...mapState(['showMainComponent', 'state']),
    },
    mounted () {
        this.test()
    },
    methods: {
        test () {
            // console.log(this.formValidate.paymentImages)
        },
        tryone (id) {
            console.log(this.showMainComponent)
            console.log(toTimestamp('2020-04-02 20:07'))
            apiGetDictionary().then( res => {
            })
        }
    },
}
</script>

<style lang="scss" scoped>
@mixin one {
    width: 200px;
    height: 200px;
    background-color: red;
}
.books {
    @include one;
    background-color: cadetblue;
}
</style>
