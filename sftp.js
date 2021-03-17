const Client = require('ssh2-sftp-client')
const fs = require('fs')
const path = require('path')

let remoteServePath = ''
let remoteServer = null
let FORMAT_NODE_ENV = process.env.NODE_ENV.trim() //  windows系统传递过来的值默认会在尾部加空格
switch (FORMAT_NODE_ENV) {
case 'production':
    remoteServePath = ''
    remoteServer = {}
    break
case 'testing':
    remoteServePath = '/home/test/server/front-end/tms/'
    remoteServer = {
        host: '192.168.1.22',
        port: '',
        username: 'test',
        password: 'test123456',
        privateKey: '',
        passphrase: ''
    }
    break
case 'development':
    remoteServePath = '/home/develop/server/frontend/fresh/'
    remoteServer = {
        host: '192.168.1.36',
        port: '',
        username: 'develop',
        password: '123456',
        privateKey: '',
        passphrase: ''
    }
    break
default:
    remoteServePath = '/home/develop/server/frontend/tms/'
    remoteServer = {}
}

const staticFilesPath = [
    {
        type: 'index.html',
        local: path.resolve(__dirname, './dist/index.html'),
        remote: `${remoteServePath}index.html`
    },
    {
        type: 'js',
        local: path.resolve(__dirname, './dist/js'),
        remote: `${remoteServePath}/js`,
    },
    {
        type: 'css',
        local: path.resolve(__dirname, './dist/css'),
        remote: `${remoteServePath}/css`,
    },
    {
        type: 'img',
        local: path.resolve(__dirname, './dist/img'),
        remote: `${remoteServePath}/img`,
    },
    {
        type: 'fonts',
        local: path.resolve(__dirname, './dist/fonts'),
        remote: `${remoteServePath}/fonts`
    }
]

let isExit = {
    'index.html': 0,
    'css': 0,
    'js': 0,
    'img': 0,
    'fonts': 0
}

function isFileExit () {
    let task1 = new Promise((resolve, reject) => {
        sftp.list(remoteServePath).then(res => {
            if (res.length) {
                res.forEach(file => {
                    let exit = JSON.stringify(file).match(`type":"-","name":"index.html`)
                    if (exit) {
                        isExit['index.html'] = 1
                        return
                    }
                })
            }
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
    let task2 = new Promise((resolve, reject) => {
        sftp.list(`${remoteServePath}/`).then(res => {
            if (res.length) {
                res.forEach(file => {
                    if (JSON.stringify(file).match(`type":"d","name":"js`)) {
                        isExit.js = 1
                    }
                    if (JSON.stringify(file).match(`type":"d","name":"css`)) {
                        isExit.css = 1
                    }
                    if (JSON.stringify(file).match(`type":"d","name":"img`)) {
                        isExit.img = 1
                    }
                    if (JSON.stringify(file).match(`type":"d","name":"fonts`)) {
                        isExit.fonts = 1
                    }
                })
            }
            resolve()
        }).catch(err => {
            reject()
        })
    })
    return Promise.all([task1, task2])
}

function deleteFile () {
    const tasks = staticFilesPath.map(item => {
        return new Promise((resolve, reject) => {
            if (/\.html/.test(item.remote) && isExit[item.type]) {
                sftp.delete(item.remote).then(() => {
                    // console.log(`${item.type}文件删除成功`)
                    resolve()
                })
                .catch(err => {
                    console.log(`${item.type}文件删除失败`)
                    reject(err)
                })
            } else if (isExit[item.type]) {
                sftp.rmdir(item.remote, true).then(() => {
                    // console.log(`${item.type}文件夹删除成功`)
                    resolve()
                })
                .catch(err => {
                    console.log(`${item.type}文件夹删除失败`)
                    reject(err)
                })
            } else {
                resolve()
                reject()
            }
        })
    })
    return Promise.all(tasks)
}

function makeFileDir () {
    const tasks = staticFilesPath.map(item => {
        return new Promise((resolve, reject) => {
            if (!/\.html/.test(item.remote)) {
                sftp.mkdir(item.remote, true)
                .then(() => {
                    // console.log(`${item.type}文件夹添加成功`)
                    resolve()
                })
                .catch(err => {
                    console.log(`${item.type}文件夹添加失败`)
                    reject(err)
                })
            } else {
                resolve()
            }
        })
    })
    return Promise.all(tasks)
}

function handleFilePath (path) {
    const { type, local, remote } = path
    const files = fs.readdirSync(local)
    return files.map(file => {
        const _lp = `${local}/${file}`
        return {
            type: type,
            file: file,
            localPath: type !== 'img' ? _lp : fs.readFileSync(_lp),
            remotePath: `${remote}/${file}`
        }
    })
}

function uploadFile () {
    let files = []
    staticFilesPath.forEach(item => {
        if (item.type === 'index.html') {
            files.push({
                file: 'index.html',
                localPath: item.local,
                remotePath: item.remote
            })
        } else {
            files = files.concat(handleFilePath(item))
        }
    })
    const tasks = files.map(item => {
        return new Promise((resolve, reject) => {
            sftp.put(item.localPath, item.remotePath)
            .then(() => {
                console.log(`${item.file} uploaded ✓`)
                resolve()
            })
            .catch(err => {
                console.log(`${item.file}上传失败`)
                reject(err)
            })
        })
    })
    return Promise.all(tasks)
}

const sftp = new Client()
sftp.connect(remoteServer).then(() => {
    console.log(remoteServer.username, '服务器连接成功')
    isFileExit().then(() => {
        deleteFile().then(res => {
            console.log('旧文件删除成功')
            makeFileDir().then(res => {
                console.log('✨ ✨ ✨ 开始上传.....')
                uploadFile().then(res => {
                    sftp.end()
                    console.log('🍺 🍺 🍺  上传完毕 ！！')
                }).catch(err => {
                    sftp.end()
                    console.log('文件上传失败', err)
                })
            }).catch(err => {
                sftp.end()
                console.log('文件创建失败', err)
            })
        }).catch(err => {
            sftp.end()
            console.log('文件删除失败', err)
        })
    }).catch(err => {
        sftp.end()
        console.log('文件连接出错了', err)
    })
}).catch(err => {
    sftp.end()
    console.log('服务器连接失败', err)
  })
