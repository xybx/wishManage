import { setupVab } from '~/library'
import App from './App.vue'
import { setupI18n } from '/@/i18n'
import { setupRouter } from '/@/router'
import { setupStore } from '/@/store'
import 'animate.css'
import '/@/assets/diyfonts/DinBold.css'
import '/@/assets/diyfonts/DinBlack.css'
import '/@/assets/diyfonts/hanyiJT.css'
import '/@/assets/diyfonts/fangzht.css'
import '/@/assets/fonts/iconfont.css'
import '/@/assets/fonts/iconfont'

const app = createApp(App)

setupVab(app)
setupI18n(app)
setupStore(app)
setupRouter(app)

app.mount('#app')
