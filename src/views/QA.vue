<template>
    <div class="centered-in-parent" style="margin-top:20px">
        <mdui-list class="notify-item">
            <mdui-collapse accordion>

                <mdui-collapse-item>
                    <mdui-list-item slot="header" icon="videogame_asset">如何使用基岩版客户端进入服务器?</mdui-list-item>
                    <mdui-list-item class="mdui-prose">
                        1. 您需要在 “用户” 页面设定您的 “XboxID”。<br>
                        2. 使用您设定的 “XboxID” 通过下方信息进入服务器。<br><br>
                        服务器信息：<br>
                        IP地址：go.dzdgame.cn<br>
                        端口：19132<br><br>
                        <el-image src="https://motdbe.blackbe.work/status_img?host=go.dzdgame.cn:19132">
                            <template #error><div class="image-slot"></div></template>
                        </el-image>
                    </mdui-list-item>
                </mdui-collapse-item>

                <mdui-divider></mdui-divider>

                <mdui-collapse-item>
                    <mdui-list-item slot="header" icon="computer">如何使用Java版客户端进入服务器?</mdui-list-item>
                    <mdui-list-item class="mdui-prose">
                        1. 您需要在 “用户” 页面设定您的 “JavaID”。<br>
                        2. 准备好 “>=1.21” 的 MinecraftJava 客户端。<br>
                        3. 使用您设定的 “JavaID” 通过下方信息进入服务器。<br><br>
                        服务器信息：<br>
                        IP地址：go.dzdgame.cn<br><br>
                        <el-image src="https://motdbe.blackbe.work/status_img/java?host=go.dzdgame.cn:25565">
                            <template #error><div class="image-slot"></div></template>
                        </el-image>
                    </mdui-list-item>
                </mdui-collapse-item>

                <mdui-divider></mdui-divider>

                <mdui-collapse-item>
                    <mdui-list-item slot="header" icon="mark_chat_unread">如何进行游戏内语音聊天?</mdui-list-item>
                    <mdui-list-item class="mdui-prose">
                        1. 准本 Java 模组客户端<br>
                        2. 前往 <a href="https://cloud.dzdstudo.cn/s/jRfM?path=%2F">https://cloud.dzdstudo.cn/s/jRfM</a> 下载对应模组注入框架的 Mod。<br>
                        3. 将下载好的 Mod 放入 “mods“ 文件夹中，启动游戏后按 “V” 打开控制面板。<br><br>
                    </mdui-list-item>
                </mdui-collapse-item>

                <mdui-divider></mdui-divider>

                <mdui-collapse-item>
                    <mdui-list-item slot="header" icon="nearby_error">绑定 QQ 号时，为什么提示 “该QQ号不存在。” ？</mdui-list-item>
                    <mdui-list-item class="mdui-prose">
                        在您绑定 QQ 号时， “罗玉丹” 会检测您是否位于我们的玩家交流群中，如果您不在我们的玩家交流群中，则会提示您 “该QQ号不存在。”，请使用下方 QQ 群号加入我们的玩家交流群后重试。<br><br>
                        DZD 玩家交流群：747121127
                    </mdui-list-item>
                </mdui-collapse-item>

                <mdui-divider></mdui-divider>

                <mdui-collapse-item>
                    <mdui-list-item slot="header" icon="no_adult_content">为什么 “JavaID” 和 “XboxID” 不能相同？</mdui-list-item>
                    <mdui-list-item class="mdui-prose">
                        由于互通服的一些特性，如果使用相同的 “JavaID” 和 “XboxID”进入服务器，会造成背包丢失等错误。
                    </mdui-list-item>
                </mdui-collapse-item>
                
            </mdui-collapse>
        </mdui-list>
    </div>
</template>

<script setup>
import { exData } from "../data.js"
import { onMounted } from "vue"

// 更新标题
onMounted(() => {
    exData.title.value = "Q&A"
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