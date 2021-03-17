<template>
    <!-- 使用示例
    <manay-image-uploader v-model="testImg" :maxlength="8" /> 
    v-model中的值应为数组[{id: '1', imageUrl: '',},{id: '2', imageUrl: '',}]
    支持disabled模式
    maxlength: 最大能上传的图片数量
    <manay-image-uploader v-model="testImg" disabled/> 
    -->
    <div>
        <div class="demo-upload-list" v-for="item in uploadList">
            <template v-if="canEdit !== true || item.status === 'finished'">
                <img :src="item.imageUrl" />
                <div class="demo-upload-list-cover" v-if="canEdit === true">
                    <Icon type="ios-eye-outline" @click.native="handleView(item.imageUrl)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <Upload v-show="isShowBtn" ref="upload" :headers="{'Auth-Token': token}" :show-upload-list="false"
            :default-file-list="defaultList" :on-success="handleSuccess" :format="['jpg','jpeg','png']" :max-size="2048"
            accept=".png, .jpg, .jpeg" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" multiple
            type="drag" :action="`${$baseUrl}file/upload`" style="display: inline-block;width:100px;">
            <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-add-circle-outline" size="30"></Icon>
            </div>
        </Upload>
        <span class="maxLengthWrap" v-if="(canEdit === true) && maxlength">共<span
                class="maxLengthRed">{{uploadList.length}}</span>张，还能上传<span
                class="maxLengthRed">{{maxlength - uploadList.length}}</span>张！</span>
        <Modal title="View Image" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%" />
        </Modal>
    </div>
</template>
<script>
    export default {
        name: 'manayImageUploader',
        props: {
            disabled: '',
            value: {
                default() {
                    return []
                }
            },
            maxlength: Number
        },
        model: {
            event: 'change',
            props: 'value'
        },
        mounted() {
            this.imgShow()
        },
        watch: {
            value(to, from) {
                // console.log(to)
                // if (this.canEdit !== true) {
                //     this.uploadList = to
                // } else {
                this.$refs.upload.fileList = []
                to.forEach(item => {
                    if (item.imageUrl) {

                        let tempObj = {
                            name: 'pic',
                            percentage: 0,
                            imageUrl: item.imageUrl,
                            showProgress: false,
                            status: 'finished'
                        }
                        tempObj = Object.assign(item, tempObj)
                        this.$refs.upload.fileList.push(tempObj)
                    } else if (item.imageUrls && item.imageUrls.length > 0) {
                        item.imageUrls.forEach(value => {
                            let tempObj = {
                                name: 'pic',
                                percentage: 0,
                                imageUrl: value,
                                showProgress: false,
                                status: 'finished'
                            }
                            let tempItem = JSON.parse(JSON.stringify(item))
                            tempObj = Object.assign(tempItem, tempObj)
                            this.$refs.upload.fileList.push(tempObj)
                        })
                    }
                })
                this.uploadList = this.$refs.upload.fileList
                this.imgShow()
            }
            // }
        },
        data() {
            return {
                isShowBtn: true,
                canEdit: (Object.keys(this.$attrs).length && ~Object.keys(this.$attrs).indexOf('disabled')) || true,
                token: window.localStorage.getItem('accessToken'),
                defaultList: [],
                imgName: '',
                visible: false,
                uploadList: []
            }
        },
        methods: {
            imgShow() {
                if (typeof this.disabled !== 'undefined') {
                    this.canEdit = this.disabled
                    if ((this.canEdit === true) && (this.maxlength && this.uploadList.length < this.maxlength)) {
                        this.isShowBtn = true
                    } else {
                        this.isShowBtn = false
                    }
                } else {
                    if ((this.canEdit === true) && (this.maxlength && this.uploadList.length < this.maxlength)) {
                        this.isShowBtn = true
                    } else {
                        this.isShowBtn = false
                    }
                }
                this.uploadList = this.canEdit === true ? this.$refs.upload.fileList : this.value
            },
            handleView(name) {
                this.imgName = name
                this.visible = true
            },
            handleRemove(file) {
                const fileList = this.$refs.upload.fileList
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
                this.$emit('change', this.handleBackData(this.uploadList))
            },
            handleSuccess(res, file) {
                // token过期
                if (res.code === '700') {
                    this.$Message.info(res.msg)
                    this.$router.push({ path: '/login' })
                }
                // 图片上传失败
                if (res.code === '81301') {
                    this.$Message.error(res.msg)
                    this.handleRemove(file)
                }
                // 上传成功
                if (res.code === '200') {
                    file.imageUrl = res.data.fileUrl
                    file.name = res.data.fileUrl
                    this.$emit('change', this.handleBackData(this.uploadList))
                }
            },
            handleFormatError(file) {
                this.$Message.info(this.$t('common.tipsImageFormat'))
            },
            handleMaxSize(file) {
                this.$Message.info(this.$t('common.tipsImageSize'))
            },
            handleBackData(data) {
                let list = []
                data.forEach(item => {
                    list.push(item)
                })
                return list
            }
        }
    }
</script>
<style>
    .demo-upload-list {
        display: inline-block;
        width: 133px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }

    .maxLengthWrap {
        line-height: 100px;
        vertical-align: top;
        margin-left: 15px;
    }

    .maxLengthRed {
        color: #E8374A;
        vertical-align: top;
    }
</style>