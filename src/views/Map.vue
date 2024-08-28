<template>
    <div class="map-container">
        <iframe :src="iframeSrc" width="100%" height="100%" frameborder="0"></iframe>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const iframeSrc = ref('https://tj.node.dzdstudo.cn:8293/');

// 更新标题
import { exData } from "../data.js"
import { onMounted } from "vue"

onMounted(() => {
    exData.title.value = "地图"
})
</script>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
    overflow: hidden; /* 防止内容溢出 */
}
</style>