<template>
    <div style="margin-top:20px">
        <mdui-tabs value="tab-1" full-width>
            <mdui-tab value="tab-1">用户信息</mdui-tab>
            <mdui-tab value="tab-2">登陆设备</mdui-tab>

            <mdui-tab-panel slot="panel" value="tab-1">
                <mdui-list>
                    <mdui-list-item icon="supervised_user_circle" nonclickable headline="昵称" :description=userData.name>
                        <mdui-button-icon slot="end-icon" icon="edit_note" @click="onName()"></mdui-button-icon>
                    </mdui-list-item>
                    <mdui-divider></mdui-divider>
                    <mdui-list-item icon="recent_actors" nonclickable headline="JavaID" :description=userData.javaid>
                        <mdui-button-icon slot="end-icon" icon="edit_note" @click="onJavaId()"></mdui-button-icon>
                    </mdui-list-item>
                    <mdui-divider></mdui-divider>
                    <mdui-list-item icon="videogame_asset" nonclickable headline="XboxID" :description=userData.xboxid>
                        <mdui-button-icon slot="end-icon" icon="edit_note" @click="onXboxid()"></mdui-button-icon>
                    </mdui-list-item>
                    <mdui-divider></mdui-divider>
                    <mdui-list-item icon="chat" nonclickable headline="QQ号" :description=userData.qq>
                        <mdui-button-icon slot="end-icon" icon="edit_note" @click="onQQ()"></mdui-button-icon>
                    </mdui-list-item>
                    <mdui-divider></mdui-divider>
                    <mdui-list-item icon="mail" nonclickable headline="邮箱" :description=userData.mail></mdui-list-item>
                    <mdui-divider></mdui-divider>
                    <mdui-list-item icon="password" nonclickable headline="密码" description="********">
                        <mdui-button-icon slot="end-icon" icon="edit_note" @click="onPwd()"></mdui-button-icon>
                    </mdui-list-item>
                </mdui-list>
            </mdui-tab-panel>

            <mdui-tab-panel slot="panel" value="tab-2">
                <mdui-list v-for="(session, index) in userData.session">
                    <mdui-list-item 
                        icon="devices_other"
                        nonclickable
                        :headline="getHeadline(session)"
                        :description="getDescription(session)">
                        
                        <mdui-button slot="end-icon" icon="download_for_offline" variant="outlined" @click="onOffline(session.sessionId)">下线</mdui-button>
                    </mdui-list-item>
                    <mdui-divider></mdui-divider>
                </mdui-list>
            </mdui-tab-panel>
        </mdui-tabs>
    </div>
</template>

<script setup>
import { exData } from "../data.js"
import { onMounted , ref } from "vue"
import { prompt } from 'mdui/functions/prompt.js'
import { alert } from 'mdui/functions/alert.js'
import axios from "axios"
import { ElNotification } from 'element-plus'

// 更新标题
onMounted(() => {
    exData.title.value = "用户"
})

const userData = ref({
    name: "---",
    javaid: "---",
    xboxid: "---",
    qq: "---",
    mail: "---",
})

// 获取用户信息
function getUserData() {
    axios.post(exData.apiHost + "/user/info", {
        "token": exData.token.value
    }).then(res => {
        userData.value = res.data.data
    }).catch(err => {
        ElNotification({
            title: '获取用户信息失败!',
            message: err,
            type: 'error',
        })
    })
}
getUserData()

// 获取时间字符串
function getTimeString(time) {
    const date = new Date(time)
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
}

// 获取标题
function getHeadline(session) {
    if (userData.value.currentSession == session.sessionId) {
        return `[本机] ${session.platform}(${session.browser})`
    } else {
        return `${session.platform}(${session.browser})`
    }
}

// 获取描述
function getDescription(session) {
    return `${getTimeString(session.loginTime)}  IP: ${session.ip}`;
}

// 下线设备
function onOffline(session) {
    axios.post(exData.apiHost + "/user/offline", {
        "token": exData.token.value,
        "sessionId": session
    }).then(res => {
        if (res.data.code == 200) {
            if (res.data.data.isCurrentDevice) {
                // 刷新网页
                location.reload()
            } else {
                ElNotification({
                    title: '下线成功!',
                    message: "已将目标设备下线!",
                    type: 'success',
                })
                getUserData()
            }
        } else {
            ElNotification({
                title: '下线失败!',
                message: res.data.msg,
                type: 'error',
            })
        }
    }).catch(err => {
        ElNotification({
            title: '网络错误',
            message: err,
            type: 'error',
        })
    })
}

// 设置昵称
function onName() {
    prompt({
        headline: "更新昵称",
        description: "请输入您的新昵称：",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            axios.post(exData.apiHost + "/user/name", {
                "token": exData.token.value,
                name: value
            }).then(res => {
                if (res.data.code == 200) {
                    ElNotification({
                        title: '更新昵称成功!',
                        message: "更新昵称成功!",
                        type: 'success',
                    })
                    getUserData()
                } else {
                    ElNotification({
                        title: '更新昵称失败!',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            }).catch(err => {
                ElNotification({
                    title: '网络错误',
                    message: err,
                    type: 'error',
                })
            })
        }
    })
}

// 更新JavaId
function onJavaId() {
    prompt({
        headline: "更新 JavaID",
        description: "请输入您的新 JavaID：",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            axios.post(exData.apiHost + "/user/javaid", {
                "token": exData.token.value,
                javaid: value
            }).then(res => {
                if (res.data.code == 200) {
                    ElNotification({
                        title: '更新 JavaID 成功!',
                        message: "更新 JavaID 成功!",
                        type: 'success',
                    })
                    getUserData()
                } else {
                    ElNotification({
                        title: '更新 JavaID 失败!',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            }).catch(err => {
                ElNotification({
                    title: '网络错误',
                    message: err,
                    type: 'error',
                })
            })
        }
    })
}

// 更新 XboxID
function onXboxid() {
    prompt({
        headline: "更新 XboxID",
        description: "请输入您的新 XboxID：",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            // 空格替换成_
            value = value.replace(/\s/g, "_")
            
            axios.post(exData.apiHost + "/user/xboxid", {
                "token": exData.token.value,
                "xboxid": value
            }).then(res => {
                if (res.data.code == 200) {
                    ElNotification({
                        title: '更新 XboxID 成功!',
                        message: "更新 XboxID 成功!",
                        type: 'success',
                    })
                    getUserData()
                } else {
                    ElNotification({
                        title: '更新 XboxID 失败!',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            }).catch(err => {
                ElNotification({
                    title: '网络错误',
                    message: err,
                    type: 'error',
                })
            })
        }
    })
}

// 更新 QQ 号
function isQQNumber(str) {
  // QQ 号码必须是纯数字,并且长度在5到12位之间
  const qqNumberRegex = /^[1-9]\d{4,11}$/;
  return qqNumberRegex.test(str);
}
function onQQ() {
    prompt({
        headline: "更新 QQ 号",
        description: "请输入您的新 QQ 号：",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {
            value = Number(value)
            if (!isQQNumber(value)) {
                ElNotification({
                    title: "更新 QQ 号失败!",
                    message: "QQ 号必须是纯数字，并且长度在5到12位之间。",
                    type: 'error',
                })
                return
            }
            axios.post(exData.apiHost + "/user/qq", {
                "token": exData.token.value,
                "qq": value
            }).then(res => {
                if (res.data.code == 200) {
                    ElNotification({
                        title: '更新 QQ 号成功!',
                        message: "更新 QQ 号成功!",
                        type: 'success',
                    })
                    getUserData()
                } else {
                    ElNotification({
                        title: '更新 QQ 号失败!',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            }).catch(err => {
                ElNotification({
                    title: '网络错误',
                    message: err,
                    type: 'error',
                })
            })
        }
    })
}

// 更新密码
function onPwd() {
    prompt({
        headline: "更新密码",
        description: "请输入您的新密码：",
        confirmText: "确认",
        cancelText: "取消",
        onConfirm: (value) => {            
            axios.post(exData.apiHost + "/user/pwd", {
                "token": exData.token.value,
                "pwd": value
            }).then(res => {
                if (res.data.code == 200) {
                    ElNotification({
                        title: '更新密码成功!',
                        message: "更新密码成功!",
                        type: 'success',
                    })
                    // 刷新页面
                    location.reload()
                } else {
                    ElNotification({
                        title: '更新密码失败!',
                        message: res.data.msg,
                        type: 'error',
                    })
                }
            }).catch(err => {
                ElNotification({
                    title: '网络错误',
                    message: err,
                    type: 'error',
                })
            })
        }
    })
}
</script>

<style scoped>
</style>