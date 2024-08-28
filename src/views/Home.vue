<template>
        <div class="centered-in-parent" style="margin-top:20px">
            <mdui-list class="notify-item">
                <mdui-collapse accordion v-if="notifysNum = notifys.length" v-for="( notify, index ) in notifys">
                    <mdui-divider v-if="index != 0"></mdui-divider>
                    <mdui-collapse-item>
                        <mdui-list-item slot="header" :icon=notify.type>{{ notify.title }}</mdui-list-item>
                        <mdui-list-item>{{ notify.content }}</mdui-list-item>
                    </mdui-collapse-item>
                </mdui-collapse>
            </mdui-list>
        </div>
</template>

<script setup>
import { exData } from "../data.js"
import { onMounted , ref } from "vue"

// 更新标题
onMounted(() => {
    exData.title.value = "主页"
})

const notifysNum = ref(0)
const notifys = ref([
    {
        "type": "info",
        "title": "Hi，欢迎加入 DZD！",
        "content": "请及时前往 “用户” 页面补全您的个人信息，以确保您的游戏体验为最佳！",
        "time": "2023-06-01 00:00:00"
    },
    {
        "type": "info",
        "title": "网站开发中...",
        "content": "由于事发仓促，网站其他功能还在编写中，李姐万岁！！！",
        "time": "2023-06-01 00:00:00"
    }
])

// 处理通知内容
notifys.value.forEach(notify => {
    if (notify.type == "info") {
        notify.type = "notifications_active"
    }
    if (notify.type == "warn") {
        notify.type = "warning"
    }

    notifysNum.value ++
})
</script>

<style scoped>
.centered-in-parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 小屏幕 */
@media (max-width: 767px) {
    .notify-item {
        width: 100%;
    }
}

/* 中屏幕 */
@media (min-width: 768px) and (max-width: 1199px) {
    .notify-item {
        width: 70%;
    }
}

/* 大屏幕 */
@media (min-width: 1200px) {
    .notify-item {
        width: 50%;
    }
}
</style>