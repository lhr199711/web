<!--  -->
<template>
    <div>
        <p v-if="isConnected">We're connected to the server!</p>
        <p>Message from server: "{{socketMessage}}"</p>
        <button @click="pingServer()">Ping Server</button>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            isConnected: false,
            socketMessage: ''
        }
    },
    computed: {},
    watch: {},
    methods: {
        pingServer() {
            // Send the "pingServer" event to the server.
            this.$socket.emit('pingServer', 'PING!')
        }
    },
    sockets: {
        connect() {
            // Fired when the socket connects.
            this.isConnected = true
        },

        disconnect() {
            this.isConnected = false
        },

        // Fired when the server sends something on the "messageChannel" channel.
        messageChannel(data) {
            this.socketMessage = data
        }
    }
}
</script>
<style lang='scss' scoped>
</style>