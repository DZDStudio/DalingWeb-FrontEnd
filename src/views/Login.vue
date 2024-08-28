<template>
    <el-steps :active="steps" finish-status="success" simple>
        <el-step title="填写" />
        <el-step title="提交" />
        <el-step title="完成" />
    </el-steps>

    <div v-if="steps == 0" class="Width-limit centered-e">
        <div class="centered-in-parent">
            <img src="/img/logo.svg" icon="fingerprint" class="avatar"></img>
        </div>

        <mdui-text-field label="邮箱" maxlength="30" counter variant="outlined" @input="mailInput" type="email"></mdui-text-field>
        <mdui-text-field label="密码" counter variant="outlined" @input="pwdInput" type="password" toggle-password></mdui-text-field>

        <mdui-button full-width @click="nextBtn">下一步</mdui-button>
    </div>

    <div v-if="steps == 1" class="Width-limit centered-e">
        <div class="centered-in-parent" style="margin-top: 10%;">
            <img src="/img/logo.svg" icon="fingerprint" class="avatar"></img>
        </div>

        <div class="centered-in-parent">
            <P>等待服务器执行请求</p>
        </div>

        <el-progress class="progress" :percentage="100" :indeterminate="true" :stroke-width="15" striped><span></span></el-progress>
    </div>

    <div v-if="steps == 3" class="centered-in-parent">
        <el-result
            icon="error"
            title="登录失败"
            :sub-title=failMsg
            class="margin-top-auto"
        >
            <template #extra>
                <el-button type="primary" @click="steps = 0">重试</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup>
import axios from "axios"
import { ElNotification, useTimeout } from 'element-plus'
import { exData , setCookie } from "../data.js"
import { useRouter , RouterView } from "vue-router"
import { onMounted , ref , computed, watch } from "vue"

// 页面跳转、路由
const router = useRouter()
const goHome = () => {
    router.push("/")
}

// 初始化
const steps = ref(0)
const pwd = ref("")
const mail = ref("")
const failMsg = ref("未知原因")

// 更新标题
onMounted(() => {
    exData.title.value = "登录"
})

// 更新输入
const mailInput = (event) => {
    mail.value = event.target.value
}
const pwdInput = (event) => {
    pwd.value = event.target.value
}

// 判断是否为邮件
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// 下一步
function nextBtn() {
    if (pwd.value == "" || mail.value == "") {
        ElNotification({
            title: '错误',
            message: '请输入全部信息！',
            type: 'error',
        })
    } if (isValidEmail(mail.value) == false) {
        ElNotification({
            title: '错误',
            message: '邮箱格式错误！',
            type: 'error',
        })
    } else {
        login()
    }
}

// 登录
function login () {
    steps.value = 1

    axios.post(exData.apiHost + "/login", {
        pwd: pwd.value,
        mail: mail.value,
    }).then(res => {
        if (res.data.code == 200) {
            setCookie("token", res.data.data.token, 100)
            exData.token.value = res.data.data.token
            setCookie("isLogin", true, 100)
            exData.isLogin.value = true
            goHome()
        } else {
            failMsg.value = res.data.msg
            steps.value = 3
        }
    }).catch((err) => {
        failMsg.value = `请求服务器失败，原因：${err}`
        steps.value = 3
    })
}
</script>

<style scoped>
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.centered-in-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

mdui-text-field {
    margin-top: 10px;
}

mdui-button {
    margin-top:20px;
}

.progress {
    margin-left: 60px;
}

/* 小屏幕 */
@media (max-width: 767px) {
    .avatar {
        width: 60%;

        margin-top: 20px;
    }

    .margin-top-auto {
        margin-top: 20%;
    }

    .Width-limit {
        width: auto;
    }
}

/* 中屏幕 */
@media (min-width: 768px) and (max-width: 1199px) {
    .avatar {
        width: 50%;

        margin-top: 20px;
    }

    .margin-top-auto {
        margin-top: 15%;
    }

    .Width-limit {
        width: 50%;
    }

    .centered-e {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-40%, -50%);
    }
}

/* 大屏幕 */
@media (min-width: 1200px) {
    .avatar {
        width: 60%;

        margin-top: 20px;
    }

    .margin-top-auto {
        margin-top: 10%;
    }

    .Width-limit {
        width: 30%;
    }

    .centered-e {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-45%, -50%);
    }
}
</style>