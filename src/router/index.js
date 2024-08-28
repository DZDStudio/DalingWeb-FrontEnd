import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("../views/Home.vue")
        },
        {
            path: "/user",
            component: () => import("../views/User.vue")
        },
        {
            path: "/map",
            component: () => import("../views/Map.vue")
        },
        {
            path: "/qa",
            component: () => import("../views/QA.vue")
        },
        {
            path: "/login",
            component: () => import("../views/Login.vue")
        },
        {
            path: "/register",
            component: () => import("../views/Register.vue")
        },
        {
            path: "/retrieve",
            component: () => import("../views/Retrieve.vue")
        },
    ]
})

export default router
