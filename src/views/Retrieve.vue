<template>
    <el-steps :active="steps" finish-status="success" simple>
        <el-step title="填写" />
        <el-step title="验证" />
        <el-step title="完成" />
    </el-steps>

    <div v-if="steps == 0" class="Width-limit centered-e">
        <div class="centered-in-parent">
            <img src="/img/logo.svg" icon="fingerprint" class="avatar"></img>
        </div>
        
        <mdui-text-field label="邮箱" maxlength="30" counter variant="outlined" @input="mailInput" type="email"></mdui-text-field>
        <mdui-text-field label="新密码" counter variant="outlined" @input="pwdInput" type="password" toggle-password></mdui-text-field>

        <mdui-button full-width @click="nextBtn">下一步</mdui-button>
    </div>

    <div v-if="steps == 1" class="centered-e">
        <div class="centered-in-parent" style="margin-top: 10%;">
            <img src="/img/logo.svg" icon="fingerprint" class="avatar"></img>
        </div>

        <div class="centered-in-parent" v-if="!turnstile_state">
            <vue-turnstile v-if="steps == 1" site-key="0x4AAAAAAAPSqmnSEqdmquJb" theme="light" v-model="turnstile_token" @error="turnstile_error" @unsupported="turnstile_unsupported" />
        </div>

        <div v-if="turnstile_state">
            <mdui-text-field label="验证码" maxlength="6" counter variant="outlined" @input="codeInput" type="number"></mdui-text-field>
            <p style="color: brown;font-size: 80%;">如果您没有收到验证码，请检查垃圾邮件列表<br>验证码有效时间为 5 分钟</p>
            <mdui-button full-width @click="verificationBtn">验证</mdui-button>
        </div>
    </div>

    <div v-if="steps == 2" class="Width-limit centered-e">
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
            icon="success"
            title="密码更新成功"
            :sub-title="computedName"
            class="margin-top-auto"
        >
            <template #extra>
                <el-button type="primary" @click="goLogin">登录</el-button>
            </template>
        </el-result>
    </div>

    <div v-if="steps == 4" class="centered-in-parent">
        <el-result
            icon="error"
            title="密码更新失败"
            :sub-title=failMsg
            class="margin-top-auto"
        >
            <template #extra>
                <el-button type="primary" @click="reloadPath">重试</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup>
import axios from "axios"
import VueTurnstile from "vue-turnstile"
import { ElNotification, useTimeout } from 'element-plus'
import { exData , setCookie } from "../data.js"
import { useRouter , RouterView } from "vue-router"
import { onMounted , ref , computed, watch } from "vue"

// 页面跳转、路由
const router = useRouter()
const goLogin = () => {
    router.push("/login")
}
function reloadPath() {
    location.reload()
}

// 初始化
const steps = ref(0)
const pwd = ref("")
const mail = ref("")
const code = ref("")
const failMsg = ref("未知原因")
const turnstile_token = ref("")
const turnstile_state = ref(false)
const computedName = computed(() => `欢迎回来！`)

// 获取验证码
function getVerificationCode () {
    if (mail.value == "") {
        ElNotification({
            title: '错误',
            message: '请输入邮箱！',
            type: 'error',
        })
    } else if (isValidEmail(mail.value) == false) {
        ElNotification({
            title: '错误',
            message: '邮箱格式错误！',
            type: 'error',
        })
    } else {
        axios.get(exData.apiHost + "/retrieve/getVerificationCode", {
            "params": {
                mail: mail.value,
                name: name.value,
                CFToken: turnstile_token.value
            }
        }).then(res => {
            if (res.data.code == 200) {
                ElNotification({
                    title: '成功',
                    message: '验证码已发送至您的邮箱！',
                    type: 'info',
                })
            } else {
                failMsg.value = res.data.msg
                steps.value = 4
            }
        })
    }
}

// 更新标题
onMounted(() => {
    exData.title.value = "找回"
})

// 更新输入
const mailInput = (event) => {
    mail.value = event.target.value
}
const pwdInput = (event) => {
    pwd.value = event.target.value
}
const codeInput = (event) => {
    code.value = event.target.value
}

// 判断是否为邮件
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// 人机验证
watch(turnstile_token, () => {
    if (turnstile_token.value != "") {
        turnstile_state.value = true
        // 发送验证码
        getVerificationCode()
    }
})
function turnstile_error(err) {
    failMsg.value = `人机验证失败，由于：${err}`
    steps.value = 4
}
function turnstile_unsupported() {
    failMsg.value = `您的浏览器不支持人机验证，请使用其他浏览器`
    steps.value = 4
}

// 下一步
function nextBtn() {
    if (pwd.value == "" || mail.value == "") {
        ElNotification({
            title: '错误',
            message: '请输入全部信息！',
            type: 'error',
        })
    } else if (isValidEmail(mail.value) == false) {
        ElNotification({
            title: '错误',
            message: '邮箱格式错误！',
            type: 'error',
        })
    } else {
        // 验证用户名邮箱是否重复
        axios.post(exData.apiHost + "/retrieve/checkMail", {
            mail: mail.value,
        }).then(res => {
            if (res.data.code == 200) {
                if (!res.data.data.isExist) {
                    ElNotification({
                        title: '错误',
                        message: res.data.msg,
                        type: 'error',
                    })
                } else {
                    steps.value = 1
                }
            } else {
                ElNotification({
                    title: '验证用昵称邮箱有效性时出错',
                    message: res.data.msg,
                    type: 'error',
                })
            }
        }).catch((err) => {
            ElNotification({
                title: `验证用昵称邮箱有效性时出错`,
                message: `原因：${err}`,
                type: 'error',
            })
        })
    }
}

// 验证
function verificationBtn() {
    if (code.value == "") {
        ElNotification({
            title: '错误',
            message: '请输入验证码！',
            type: 'error',
        })
    } else {
        retrieve()
    }
}

// 注册
function retrieve () {
    steps.value = 2

    axios.post(exData.apiHost + "/retrieve", {
        pwd: pwd.value,
        mail: mail.value,
        code: code.value
    }).then(res => {
        if (res.data.code == 200) {
            steps.value = 3
        } else {
            failMsg.value = res.data.msg
            steps.value = 4
        }
    }).catch((err) => {
        failMsg.value = `请求服务器失败，原因：${err}`
        steps.value = 4
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