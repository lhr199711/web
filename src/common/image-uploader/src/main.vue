<template>
    <div class="image-uploader" :style="{width: width + 'px'}">
        <div
            class="image-holder"
            :style="{height: height + 'px', lineHeight: height + 'px'}"
            v-if="!imgList.length"
        ></div>
        <div
            class="image-holder"
            :style="{height: height + 'px', lineHeight: height + 'px'}"
            v-for="(item, index) in imgList"
            :key="index"
        >
            <template v-if="item.status === 'finished'">
                <img :src="item.imageUrls" class="img">
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload
            :disabled="disabled"
            :headers="{'Auth-Token': token}"
            ref="imgUpload"
            accept=".png, .jpg, .jpeg"
            :show-upload-list="false"
            :action="url"
            :before-upload="handleBefore"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            v-if="isShowBtn"
        >
            <p class="sizeP" v-if="imgList.length === 0">图片在2M以内</p>
            <Button
                :class="{cursor:disabled}"
                :disabled="disabled"
                icon="ios-cloud-upload-outline"
                size="small"
            >{{btnName}}</Button>
        </Upload>

        <Upload
            :headers="{'Auth-Token': token}"
            :disabled="disabled"
            ref="imgUpload"
            accept=".png, .jpg, .jpeg"
            :show-upload-list="false"
            :action="url"
            :before-upload="handleBefore"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            class="addFile"
            :style="{width: width + 'px', height: height + 'px',}"
            v-else
        >
            <p class="sizeP" v-if="imgList.length === 0">200KB以内</p>
            <Button
                icon="ios-cloud-upload-outline"
                size="small"
                :style="{width: width + 'px', height: height + 'px',}"
            ></Button>
        </Upload>
        <div class="isNotChange" :style="{height: height + 'px'}" v-if="isModal"></div>
    </div>
</template>

<script>
import axios from 'axios'
import CONFIG from '@/libs/http-config.js'
export default {
    name: 'imageUploader',
    props: {
        isModal: {
            default: false
        },
        isShowBtn: {
            default: true
        },
        width: {
            default: '80'
        },
        height: {
            default: '100'
        },
        btnName: {
            default: '上传图片'
        },
        // 是否只上传一张图片
        single: {
            default: true,
            type: Boolean
        },
        value: {
            default() {
                return []
            },
            type: Array,
            required: true
        },
        url: {
            default: ''
        },
        disabled: Boolean
    },
    model: {
        event: 'change',
        props: 'value'
    },
    mounted() {
        this.imgList = this.$refs.imgUpload.fileList
    },
    watch: {
        value(to, from) {
            this.$refs.imgUpload.fileList = []
            if (this.value.length) {
                if (this.single) {
                    let item = {
                        name: 'pic',
                        imageUrls: to[0].imageUrls,
                        percentage: 0,
                        showProgress: false,
                        status: 'finished'
                    }
                    // item = Object.assign(item, to)
                    this.$refs.imgUpload.fileList.push(item)
                } else {
                    // 暂时没空开发多张图片的。。。。打我呀
                }
            }
            this.imgList = this.$refs.imgUpload.fileList
        }
    },
    data() {
        return {
            token: window.localStorage.getItem('accessToken'),
            imgList: []
        }
    },
    methods: {
        /**
         *  图片上传   操作
         */
        handleFormatError(file) {
            this.$Notice.warning({
                title: this.$t('common.systemHint'),
                desc: this.$t('common.tipsImageFormat')
            })
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: this.$t('common.systemHint'),
                desc: this.$t('common.tipsImageSize')
            })
        },

        /////////////////////////
        handleBefore() {
            if (this.single) {
                this.$refs.imgUpload.fileList = []
            }
            this.imgList = this.$refs.imgUpload.fileList
        },
        handleSuccess(response, file, fileList) {
            if (response.code === '200') {
                if (this.single) {
                    file.imageUrls = file.response.data.fileUrl
                    this.$refs.imgUpload.fileList = [file]
                } else {
                    // 暂时没空开发多张图片的。。。。打我呀
                }
                this.$emit('change', this.handleBackData(this.imgList))
            } else if (response.code === '700') {
                this.getNewToken()
            } else {
                this.$Message.info({
                    content: response.msg,
                    duration: 1.2,
                    closable: true
                })
            }
        },
        handleBackData(data) {
            let list = []
            let unit
            data.forEach(item => {
                unit = {
                    imageUrls: item.imageUrls
                }
                list.push(unit)
            })
            return list
        },
        getNewToken() {
            let baseURL = ''
            switch (process.env.NODE_ENV) {
                case 'production':
                    baseURL = CONFIG.proBaseUrl
                    break
                case 'test':
                    baseURL = CONFIG.testBaseUrl
                    break
                default:
                    baseURL = CONFIG.devBaseUrl
            }
            let url = `${baseURL}auth/refresh`
            return axios
                .post(url, '', {
                    headers: {
                        'Auth-RefreshToken': window.localStorage.getItem('refreshToken')
                    }
                })
                .then(res => {
                    let r = res.data
                    if (r.code === '200') {
                        window.localStorage.setItem('accessToken', r.data.accessToken)
                        window.localStorage.setItem('refreshToken', r.data.refreshToken)
                        window.location.reload()
                    } else {
                        // refreshToken过期，重新登录
                        window.location.href = `${window.location.origin}/login`
                    }
                })
                .catch(err => {
                    this.$Message.info({
                        content: err.msg + '请重新登录',
                        duration: 1.2
                    })
                })
        }
    }
}
</script>

<style scoped lang="scss">
@import './style.scss';
.cursor {
    cursor: not-allowed;
}
</style>
