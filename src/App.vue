<template>
    <div class="app-container">
        <mdui-navigation-rail divider>
            <mdui-avatar src="img/logo-1024.jpg" style="margin-bottom:20px;margin-top:20px;--shape-corner: 10px" onclick="window.location.href='/'"></mdui-avatar>
            <mdui-button-icon icon="refresh" slot="bottom" id="loading" loading @click="reloadPath"></mdui-button-icon>
    
            <mdui-navigation-rail-item v-if="exData.isLogin.value" @click="goHome" icon="home">主页</mdui-navigation-rail-item>
            <mdui-navigation-rail-item v-if="exData.isLogin.value" @click="goUser" icon="supervised_user_circle">用户</mdui-navigation-rail-item>
            <mdui-navigation-rail-item v-if="exData.isLogin.value" @click="goMap" icon="map">地图</mdui-navigation-rail-item>
            <mdui-navigation-rail-item v-if="exData.isLogin.value" @click="goQA" icon="question_answer">Q&A</mdui-navigation-rail-item>
            <mdui-navigation-rail-item v-if="!exData.isLogin.value" @click="goLogin" icon="login">登录</mdui-navigation-rail-item>
            <mdui-navigation-rail-item v-if="!exData.isLogin.value" @click="goRegister" icon="fingerprint">注册</mdui-navigation-rail-item>
            <mdui-navigation-rail-item v-if="!exData.isLogin.value" @click="goRetrieve" icon="crop_free">找回</mdui-navigation-rail-item>
        </mdui-navigation-rail>
        
        <div class="content-container">
            <el-page-header @back="goBack">
            <template #content>
                <span>{{ exData.title }}</span>
            </template>
            </el-page-header>
    
            <RouterView class="router-view"></RouterView>
        </div>
    
        <el-backtop :right="100" :bottom="100" />
    </div>
</template>

<script setup>
import { $ } from "mdui/jq.js"
import { onMounted , watch } from "vue"
import { exData , setCookie } from "./data.js"
import { useRouter , RouterView } from "vue-router"
import { setColorScheme } from 'mdui/functions/setColorScheme.js'
import axios from "axios"
import { ElNotification } from 'element-plus'

// 配色
setColorScheme("#40EDED")

// 页面跳转、路由
const router = useRouter()
const goHome = () => {
    router.push("/")
}
function goUser() {
    router.push("/user")
}
function goMap() {
    router.push("/map")
}
function goQA() {
    router.push("/qa")
}
function goLogin() {
    router.push("/login")
}
function goRegister() {
    router.push("/register")
}
function goRetrieve() {
    router.push("/retrieve")
}
function goBack() {
  router.go(-1)
}
function reloadPath() {
    location.reload()
}

// 加载、刷新
onMounted(() => {
    $("#loading").prop("loading", false)
})

// 验证登录
function checkLogin() {
    axios.post(exData.apiHost + "/login/verify", {
        "token": exData.token.value
    }).then(res => {
        if(res.data.code != 200) {
            if (exData.isLogin.value) ElNotification({
                title: '登录验证失败!',
                message: res.data.msg,
                type: 'error',
            })
        } else if (res.data.data.isLogin) {
            exData.isLogin.value = true
            setCookie("isLogin", true, 100)
        } else {
            if (exData.isLogin.value) {
                exData.isLogin.value = false
                setCookie("isLogin", false, 100)
                ElNotification({
                    title: "登录状态变更",
                    message: "您的账户已被下线，请重新登录。",
                    type: 'error',
                })
            }
        }

        // 更新路由
        // 页面跳转、路由
        if (!exData.isLogin.value) {
            router.push("/login")
        }
    }).catch(err => {
        ElNotification({
            title: '登录验证失败!',
            message: "请求服务器失败：" + err,
            type: 'error',
        })
    })
}
checkLogin()
</script>

<style>
.app-container {
  display: flex;
  height: 100vh;
}

.mdui-navigation-rail {
  flex-shrink: 0;
}

.content-container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.router-view {
  flex-grow: 1;
  overflow: auto;
}
</style>
