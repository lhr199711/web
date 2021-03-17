import { isRepeat } from '@/libs/utils'
import {
    apiTransportAddCode,
    apiStationAddCode,
    apiQueryScene,
    apiQueryTaskBySceneCode
} from '@/api/productEditor'
import { apiChangJing } from '@/api/logisticsCommission'
export default {
    data () {
        return {
            isSceneModalShow: false,
            titleNames: ['设置基础任务费用时长', '设置附加任务费用时长'],
            curSceneName: '',
            tabIndex: 1,
            isBasicTask: true,
            // chosenScene: [],
            curCollapse: '',
            curProductIndex: 0,
            // 所有产品的参数信息、场景、每个场景对应的基础任务（附加任务）、产品截止时间都放在一起
            // 因为新增页面可以新增多个产品
            productAllInfo: [],
            selectList: [],
            // 展开所有场景
            isSceneSpread: false,
            // 字典数据
            dictionary: {},
            sceneName: '',
            sceneTableData: [
                {
                    sceneCode: 1,
                    sceneName: '场景1'
                },
                {
                    sceneCode: 2,
                    sceneName: '场景2'
                }
            ],
            sceneColumns: [
                {
                    title: '选择',
                    align: 'center',
                    type: 'selection',
                    width: 100
                },
                {
                    title: '场景名称',
                    align: 'center',
                    key: 'sceneName'
                },
                {
                    title: '排序值',
                    align: 'center',
                    slot: 'sort',
                    width: 150
                }
            ],
            previewTableData: [],
            previewColumns: [
                {
                    title: '序号',
                    align: 'center',
                    type: 'index',
                    width: 100
                },
                {
                    title: '场景名称',
                    align: 'center',
                    key: 'sceneName'
                },
                {
                    title: '排序值',
                    align: 'center',
                    key: 'sort',
                    sortType: 'asc',
                    width: 150
                }
            ],
            selectedData: [],
            // 还有产品没有保存
            hasPendingProduct: false
        }
    },
    methods: {
        sceneVisibleChange (changeStatus) {
            this.isSceneModalShow = changeStatus
        },
        // 切换任务
        handleBtn (index) {
            this.tabIndex = index + 1
            // 基础任务
            if (index === 0) {
                this.isBasicTask = true
            } else {
                // 附加任务
                this.isBasicTask = false
            }
        },
        // 重置
        handleReset () {
            this.$refs.parameterFormValidate.resetFields()
        },
        // 保存参数生成产品
        saveParameter () {
            const vm = this
            if (this.hasPendingProduct) {
                this.$Message.warning('请先保存产品！')
                return
            }
            let [siteValid, parameterValid] = [true, true]
            // 路线场所form
            if (this.$refs.formValidate) {
                this.$refs.formValidate.validate(valid => {
                    valid ? siteValid = true : siteValid = false
                })
            }
            // 参数form
            if (this.$refs.parameterFormValidate) {
                this.$refs.parameterFormValidate.validate(valid => {
                    valid ? parameterValid = true : parameterValid = false
                })
            }
            // 所有的表单验证都通过
            if (siteValid && parameterValid) {
                // 运输产品 && 运输类型为集装箱（C）
                if (this.productType === 'T' && this.parameterData.trspType.split('~')[0] === 'C' && (!this.parameterData.contaSizeType || !this.parameterData.contaSource)) {
                    this.$Message.warning('运输类型为集装箱，集装箱尺寸类型和集装箱来源必填')
                    return
                }
                const parameters = Object.values(this.parameterData)
                // 判断是否选择了参数
                const hasParameter = parameters.some(item => item)
                if (!hasParameter) {
                    this.$Message.warning('请先选择参数！')
                    return
                }
                // 判断参数是否完全重复，需要发送ajax请求让后端来判断
                // 因为有的产品已经提前新增过了，这里拿不到其他产品的参数信息
                // 将参数value从数据中提取出来
                // 后续保存产品的时候还要发送这些数据
                const postData = {}
                for (const key in this.parameterData) {
                    // 点击重置后，this.parameterData[key]为undefined
                    postData[key] = this.parameterData[key] && this.parameterData[key].split('~')[0]
                }
                for (const key in this.siteData) {
                    postData[key] = this.siteData[key] && this.siteData[key].split('~')[0]
                }
                // 运输产品：整合启运地、场所，目的地、场所
                if (this.productType === 'T') {
                    postData.departurePort = `${postData.dispatchCity};${postData.dispatchSite}`
                    postData.destinationPort = `${postData.destinationCity};${postData.destinationSite}`
                    delete postData.dispatchCity
                    delete postData.dispatchSite
                    delete postData.destinationCity
                    delete postData.destinationSite
                } else if (this.productType === 'Y') {
                    // 场所产品：整合国家城市、场所
                    postData.sttnCode = `${postData.dispatchCity};${postData.dispatchSite}`
                    delete postData.dispatchCity
                    delete postData.dispatchSite
                }

                // 获取产品编号
                if (this.productType === 'T') {
                    // 运输产品
                    apiTransportAddCode().then(({ data }) => {
                        successCallback(data)
                    })
                } else if (this.productType === 'Y') {
                    // 场所产品
                    apiStationAddCode().then(({ data }) => {
                        successCallback(data)
                    })
                }
                // eslint-disable-next-line
                function successCallback (data) {
                    vm.curCollapse = '0'
                    vm.hasPendingProduct = true
                    const showParameters = []
                    const showSites = []
                    for (const val of parameters) {
                        // 点击重置后，vm.parameterData[key]为undefined
                        // 去除undefined
                        if (val) {
                            showParameters.push(val.split('~')[1])
                        }
                    }

                    for (const key in vm.siteData) {
                        showSites[key] = vm.siteData[key].split('~')[1]
                    }
                    vm.productAllInfo.unshift({
                        serverCode: data,
                        sceneTabIndex: -1,
                        parameters: showParameters.join('+'),
                        sites: showSites,
                        ...postData
                    })
                }
            }
        },
        selectionChange (selectedData) {
            this.selectedData = selectedData
        },
        // 数据项发生改变
        changeRowData (row, index, key) {
            // 将改行改变后的数据更新到accountData，后续选中才有数据
            this.sceneTableData[index] = row
            // 先选中，再选择帐户类型，需要手动改变选中的帐户的帐户类型
            for (const scene of this.selectedData) {
                if (scene.sceneName === row.sceneName) {
                    // 排序值在后面的排序要用到，要转换成Number类型，不然字符串之间比较大小会出错
                    if (key === 'sort') {
                        // Number(row[key])可能会被转换成NaN
                        scene[key] = Number(row[key])
                    } else {
                        scene[key] = row[key]
                    }
                    break
                }
            }
        },
        // 排序预览
        previewSort () {
            if (!this.verifyItem()) return
            this.previewTableData = this.selectedData
        },
        // 新增场景、预览排序校验
        verifyItem () {
            // 至少选择一个场景
            if (!this.selectedData.length) {
                this.$Message.warning('请至少选择一个场景！')
                return false
            }
            const sort = []
            for (const item of this.selectedData) {
                // 勾选的场景的排序值必填
                // 排序值可能会被转换成NaN
                if (!item.sort && !Number.isNaN(item.sort)) {
                    this.$Message.warning('选中的场景的排序值必填！')
                    return false
                }
                // 排序值只能是正整数
                if (!/^\d+$/.test(item.sort)) {
                    this.$Message.warning('排序值只能是整数！')
                    return
                }
                sort.push(item.sort)
            }
            // 勾选的场景的排序值不能重复
            if (isRepeat(sort)) {
                this.$Message.warning('选中的场景的排序值不能重复！')
                return false
            }
            return true
        },
        // 查询场景
        async searchScene () {
            this.apiGetScene()
        },
        // 选择场景
        async chooseScene (index) {
            this.sceneName = ''
            this.previewTableData = []
            const success = await this.apiGetScene()
            if (success) {
                this.curProductIndex = index
                this.isSceneModalShow = true
            }
        },
        apiGetScene (index = this.curProductIndex) {
            const data = {
                sceneName: this.sceneName,
                serverType: this.productType,
                trspType: this.productAllInfo[index].trspType.split('~')[0],
                logisticsType: this.productAllInfo[index].logisticsType.split('~')[0]
            }
            return new Promise(resolve => {
                apiQueryScene({ data }).then(({ data }) => {
                    this.sceneTableData = data
                    resolve(true)
                })
            })
        },
        // 确认选择场景
        confirmChooseScene () {
            if (!this.verifyItem()) return
            // 将参数名称从数据中提取出来
            const [scenesList, sceneNames] = [[], []]
            for (const scene of this.selectedData) {
                // 判断场景的共生、互斥
                if (scene.mutexScene) {
                    // 所有互斥的场景依次循环判断
                    for (const mSceneCode of scene.mutexScene.split(';')) {
                        // 判断选择的场景是不是该场景的与互斥场景
                        for (const oScene of this.selectedData) {
                            if (mSceneCode === oScene.sceneCode) {
                                this.$Message.warning({
                                    content: `${scene.sceneName}不能与${oScene.sceneName}同时选择，否则无法创建！`,
                                    duration: 10,
                                    closable: true
                                })
                                return
                            }
                        }
                    }
                }
                // 共生场景
                if (scene.symbiosisScene) {
                    // 所有共生的场景依次循环判断
                    for (const sSceneCode of scene.symbiosisScene.split(';')) {
                        let hasSymbiosisScene = false
                        // 判断选择的场景是不是该场景的与共生场景
                        for (const oScene of this.selectedData) {
                            // 选择了共生的场景
                            if (sSceneCode === oScene.sceneCode) {
                                hasSymbiosisScene = true
                            }
                        }
                        if (!hasSymbiosisScene) {
                            // 获取共生场景的场景名称（后端只返回了sceneCode）
                            let symbiosisSceneName = ''
                            for (const symbiosisScene of this.sceneTableData) {
                                if (sSceneCode === symbiosisScene.sceneCode) {
                                    symbiosisSceneName = symbiosisScene.sceneName
                                    break
                                }
                            }
                            this.$Message.warning({
                                content: `${scene.sceneName}必须要选择${symbiosisSceneName}，否则无法创建！`,
                                duration: 10,
                                closable: true
                            })
                            return
                        }
                    }
                }
                // 组装后端需要的格式
                const { sceneName, sceneCode, sort } = scene
                sceneNames.push(sceneName)
                scenesList.push({
                    sceneName,
                    sceneCode,
                    sort,
                    taskBasesList: {},
                    taskAffixesList: []
                })
            }
            this.$set(this.productAllInfo[this.curProductIndex], 'scenesList', scenesList)
            this.$set(this.productAllInfo[this.curProductIndex], 'sceneNames', sceneNames)
            this.$set(this.productAllInfo[this.curProductIndex], 'sceneTabIndex', -1)
            this.curSceneName = ''
            this.isSceneModalShow = false
        },
        // 切换场景
        handleSceneBtn (index, sceneName, productIndex) {
            this.$set(this.productAllInfo[productIndex], 'sceneTabIndex', index + 1)
            this.curSceneName = sceneName
            this.curProductIndex = productIndex
            // 点击的场景信息
            const scenesList = this.productAllInfo[productIndex].scenesList[index]
            // 如果已经获取过该场景下的任务，就不再次获取该场景下的任务
            if (scenesList.taskBasesList.lists) {
                return
            }
            // 获取场景下的任务
            apiQueryTaskBySceneCode({ sceneCode: scenesList.sceneCode }).then(({ data }) => {
                // 将获取到的任务放到对应的场景
                scenesList.taskBasesList.lists = []
                scenesList.taskAffixesList = []
                for (const baseTask of data.baseTaskQueryRes) {
                    scenesList.taskBasesList.lists.push({
                        taskCode: baseTask.taskCode,
                        taskName: baseTask.taskName
                    })
                }
                for (const affixTask of data.affixTaskQueryRes) {
                    scenesList.taskAffixesList.push({
                        taskCode: affixTask.taskCode,
                        taskName: affixTask.taskName,
                        isChecked: false
                    })
                }
            })
        },
        // 选择产品（用于删除）
        chooseProduct (code, status) {
            // 选中
            if (status) {
                this.selectList.push(code)
            } else {
                // 取消选中
                const index = this.selectList.indexOf(code)
                this.selectList.splice(index, 1)
            }
        },
        // 选择服务产品类型
        // 跳转到对应的新增页面
        goToAddProduct (val) {
            let type = ''
            switch (val) {
            case 'T':
                type = 'transport'
                break
            case 'Y':
                type = 'site'
                break
            case 'C':
                type = 'customs'
                break
            case 'B':
                type = 'cpa'
                break
            }
            this.$router.push(`/product-editor/add-${type}-product`)
        },
        // 根据城市获取场所
        _handelDir (val) {
            return new Promise(resolve => {
                const code = val[val.length - 1]
                apiChangJing({ city: code }).then(({ data }) => {
                    const arr = (data && data.length) ? data[0] : []
                    const newArr = arr.map(item => {
                        return {
                            value: item.sttnCode,
                            label: item.sttnName
                        }
                    })
                    resolve(newArr)
                })
            })
        }
    }
}
