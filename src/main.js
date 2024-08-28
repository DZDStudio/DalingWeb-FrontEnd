import { createApp } from 'vue'

// MDUI
import 'mdui/mdui.css'
import 'mdui'

// ElementPlus
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from './router'
import App from './App.vue'

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})

app.config.compilerOptions.isCustomElement = (tag) => tag === 'load_text'

app.mount('#app')