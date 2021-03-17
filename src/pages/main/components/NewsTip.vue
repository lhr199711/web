<template>
    <div class="newsTip">
        <div class="icon-box">
            <div @click="showhandel">
                <Badge :count="count" overflow-count="99" size="small">
                    <svg class="iconfont xiao-xi" aria-hidden="true">
                        <use xlink:href="#iconicon_huaban1"></use>
                    </svg>
                </Badge>
            </div>
            <!-- 消息 -->
            <div v-show="isShow && count" class="my-info">
                <div class="btn" @click="seeMore"></div>
                <div class="list">
                    <div class="list-item" v-for="(item, index) in MessageList">
                        <div class="text" @click="seeMore()">
                            <span class="unread" :title="item.messageContent">
                                {{ item.messageContent }}
                            </span>
                            <!-- <span class="unread">
                                货代公司拒绝了您的订单HSAJ220bbcdbchdbhh胡海
                            </span> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        apiMessageRecordList
    } from '@/api/base-platform/signalCommunication'
    export default {
        name: "newsTip",
        data () {
            return {
                count: 3,
                isShow: false,
                MessageList: [],
                // websock的
                websock: null,
                lockReconnect: false,//是否真正建立连接
                timeout: 28 * 1000,//30秒一次心跳
                timeoutObj: null,//心跳心跳倒计时
                serverTimeoutObj: null,//心跳倒计时
                timeoutnum: null,//断开 重连倒计时
                token: window.localStorage.getItem('accessToken')
            };
        },
        created () {
            // 刘兴回来后把这个开启
            // this.initWebSocket();
        },
        // destroyed () {
        //     this.websock.close() //离开路由之后断开websocket连接
        // },
        mounted () {
        },
        watch: {
            $route (to, from) {
                this.isShow = false
            }
        },
        methods: {
            // 点击显示
            showhandel () {
                this.isShow = !this.isShow
                this.getinfoList()
            },
            seeMore (item) {
                this.$router.push({
                    path: '/newsList',
                    query: {
                        appCode: item.appCode,
                    },
                })
            },
            // 获取消息列表
            getinfoList () {
                const data = {
                    messageStatus: '0',// 未读
                }
                apiMessageRecordList({ data }).then((res) => {
                    if (res.code == 200) {
                        let { content = [] } = res.data
                        this.MessageList = content.map(item => item.messageContent).slice(0, 3)
                    }
                })
            },
            initWebSocket () { //初始化weosocket
                // 刘兴本地
                // const wsuri = "ws://192.168.1.152:19001?token=test";
                // 线上
                const wsuri = "ws://120.78.7.241:19001?token=test";
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            reconnect () {//重新连接
                var that = this;
                if (that.lockReconnect) {
                    return;
                };
                that.lockReconnect = true;
                //没连接上会一直重连，设置延迟避免请求过多
                that.timeoutnum && clearTimeout(that.timeoutnum);
                that.timeoutnum = setTimeout(function () {
                    //新连接
                    that.initWebSocket();
                    that.lockReconnect = false;
                }, 5000);
            },
            reset () {//重置心跳
                var that = this;
                //清除时间
                clearTimeout(that.timeoutObj);
                clearTimeout(that.serverTimeoutObj);
                //重启心跳
                that.start();
            },
            start () {//开启心跳
                var self = this;
                self.timeoutObj && clearTimeout(self.timeoutObj);
                self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj);
                self.timeoutObj = setTimeout(function () {
                    //这里发送一个心跳，后端收到后，返回一个心跳消息，
                    if (self.websock.readyState == 1) {//如果连接正常
                        self.websock.send("heartCheck");
                    } else {//否则重连
                        self.reconnect();
                    }
                    self.serverTimeoutObj = setTimeout(function () {
                        //超时关闭
                        self.websock.close();
                    }, self.timeout);

                }, self.timeout)
            },

            websocketonopen () {//连接成功事件
                //开启心跳
                this.start();
            },

            websocketonerror (e) {//连接失败事件
                //错误
                console.log("WebSocket连接发生错误");
                //重连
                this.reconnect();
            },
            websocketclose (e) {//连接关闭事件
                //关闭
                console.log("connection closed (" + e.code + ")");
                //重连
                this.reconnect();
            },
            websocketonmessage (event) {//接收服务器推送的信息
                //打印收到服务器的内容
                // console.log(event.data);
                this.count = JSON.parse(event.data)
                //收到服务器信息，心跳重置
                this.reset();
            },
            websocketsend (msg) {//向服务器发送信息
                //数据发送
                this.websock.send(msg);
            },
        }
    };
</script>

<style scoped lang="scss">
    .newsTip {
        .icon-box {
            margin-top: 7px;
            position: relative;
            cursor: pointer;
            .xiao-xi {
                font-size: 24px;
                font-weight: 800;
            }
            .my-info {
                position: absolute;
                width: 306px;
                height: 316px;
                top: 30px;
                left: -243px;
                z-index: 999;
                background: url('../../../assets/images/my-info-bg.png') no-repeat;
                padding: 36px 20px 20px 20px;
                .list {
                    padding-top: 30px;
                }
                .list-item {
                    border-bottom: 1px solid #e5e5e5;
                    padding-top: 22px;
                }
                .btn {
                    height: 16px;
                }
                .unread {
                    position: relative;
                    padding-left: 10px;
                    width: 240px;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &::before {
                        content: ' ';
                        position: absolute;
                        left: 0px;
                        top: 11px;
                        width: 4px;
                        height: 4px;
                        background-color: $error-color;
                        border-radius: 2px;
                    }
                }
            }
        }
    }
</style>
