import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/assets/styles'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'

// Добавление иконки в библиотеку
library.add(faFile)

const app = createApp(App)

// Регистрация компонента FontAwesomeIcon
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
