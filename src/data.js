import { ref } from "vue"

/**
 * 设置cookie
 * @param { String } key 键
 * @param { * } value 值
 * @param { Number } seconds 时间（天）
 */
function setCookie(key, value, seconds = 0) {
    let expires = ""
    if (seconds) {
        const date = new Date()
        date.setTime(date.getTime() + (seconds * 1000 * 60 * 60 * 24))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = key + "=" + (value || "")  + expires + "; path=/"
}

/**
 * 获取cookie
 * @param { * } key 键
 * @returns 值
 */
function getCookie(key) {
    const nameEQ = key + "="
    const ca = document.cookie.split(';')
    for(let i=0;i < ca.length;i++) {
        let c = ca[i]
        while (c.charAt(0)==' ') c = c.substring(1,c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
}

// 共享数据
let exData = {
    token: ref(getCookie("token")),
    isLogin: ref(getCookie("isLogin")),
    title: ref("主页"),
    apiHost: "https://tj.node.dzdstudo.cn:1923"
}

// 开发环境识别
if (window.location.href.indexOf("localhost") !== -1) {
    exData.apiHost = "http://127.0.0.1:1923"
}

export { exData , setCookie , getCookie }