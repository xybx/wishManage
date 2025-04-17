<template>
  <div class="vab-lock">
    <vab-icon icon="lock-line" @click="handleLock" />
    <el-drawer
      v-model="lock"
      append-to-body
      class="vab-lock-drawer"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      direction="ttb"
      :show-close="false"
      size="100%"
      :with-header="false"
    >
      <div class="vab-screen-lock">
        <div id="vab-screen-lock-background" class="vab-screen-lock-background" :style="style"></div>
        <div class="vab-screen-lock-content">
          <div class="vab-screen-lock-content-title">
            <el-avatar :size="180" :src="avatar" />
            <vab-icon icon="lock-line" />
            {{ title }} {{ translate('屏幕已锁定') }}
          </div>
          <div class="vab-screen-lock-content-form">
            <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent>
              <el-form-item prop="password">
                <el-input v-model="form.password" v-focus autocomplete="off" :placeholder="translate('请输入密码123456')" type="password" />
                <el-button native-type="submit" type="primary" @click="handleUnLock">
                  <vab-icon icon="lock-line" />
                  <span>{{ translate('解锁') }}</span>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <span @click="randomBackground">{{ translate('切换壁纸') }}</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { translate } from '/@/i18n'
import { useSettingsStore } from '/@/store/modules/settings'
import { useUserStore } from '/@/store/modules/user'

defineOptions({
  name: 'VabLock',
})

const userStore = useUserStore()
const { avatar } = storeToRefs(userStore)
const settingsStore = useSettingsStore()
const { lock, title } = storeToRefs(settingsStore)
const { handleLock: _handleLock, handleUnLock: _handleUnLock } = settingsStore
const url = 'https://gcore.jsdelivr.net/gh/zxwk1998/image/vab-image-lock/'
const background = ref(`${url}${Math.round(Math.random() * 31)}.jpg`)
const style = reactive<any>({
  background: `var(--el-color-primary-light-5) fixed url(${background.value}) center`,
  backgroundSize: '100% 100%',
  filter: 'blur(10px)',
  transform: 'scale(1.05)',
  transition: 'all 3s',
})

const randomBackground = () => {
  style.transform = 'scale(1.05)'
  style.transition = 'none'
  background.value = `${url}${Math.round(Math.random() * 31)}.jpg`
  style.background = `var(--el-color-primary-light-5) fixed url(${background.value}) center`

  setTimeout(() => {
    style.transform = 'scale(1.2)'
    style.transition = 'all 3s'
  }, 500)
}

const validatePass = (rule: any, value: string, callback: any) => {
  if (value === '' || value !== '123456') {
    callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}

const formRef = ref()
const form = reactive({
  password: '123456',
})
const rules = {
  password: [{ validator: validatePass, trigger: 'blur' }],
}

const handleUnLock = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) await _handleUnLock()
  })
}

const handleLock = () => {
  _handleLock()
}

watch(
  lock,
  () => {
    setTimeout(() => {
      lock.value ? (style.transform = 'scale(1.2)') : (style.transform = 'scale(1.05)')
    }, 500)
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss">
.el-overlay:has(.vab-lock-drawer) {
  backdrop-filter: none;

  .vab-lock-drawer {
    .el-drawer__body {
      padding: 0 !important;
      overflow: hidden !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.vab-lock-drawer {
  .vab-screen-lock {
    position: relative;
    z-index: var(--el-z-index);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: calc(var(--vh, 1vh) * 100);
    font-weight: bold;
    background: var(--el-mask-color);
    opacity: var(--opacity-value);

    &-background {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: calc(var(--el-z-index) - 1);
    }

    &-content {
      z-index: var(--el-z-index);
      width: 400px;
      padding: 40px 55px 40px 55px;
      color: var(--el-color-grey);
      text-align: center;
      background: var(--el-mask-color);
      backdrop-filter: blur(10px);
      border: 1px solid var(--el-border-color);
      border-radius: 15px;

      > span {
        font-size: var(--el-font-size-small);
        cursor: pointer;
      }

      &-title {
        line-height: 50px;
        color: var(--el-color-grey);
        text-align: center;

        :deep() {
          .el-avatar {
            width: 150px;
            height: 150px;

            img {
              padding: 30px;
              cursor: pointer;
            }
          }

          .ri-lock-line {
            display: block;
            margin: auto !important;
            font-size: 30px;
            color: var(--el-color-grey) !important;
          }
        }
      }

      &-form {
        :deep() {
          .el-input {
            position: relative;
            width: 100%;
            height: 40px;
            line-height: 40px;

            &__wrapper {
              padding-right: 0;
              border: 1px solid var(--el-color-primary);
              box-shadow: none;
            }

            &__inner {
              width: 180px;
            }

            &__suffix {
              .el-input__validateIcon {
                display: none;
              }
            }
          }

          .el-button {
            position: absolute;
            right: -1px;
            z-index: 999;
            height: 40px;
            margin-left: 0 !important;
            line-height: 40px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;

            .ri-lock-line {
              margin-left: 0 !important;
            }
          }
        }
      }
    }

    @media (max-width: 768px) {
      .vab-screen-lock-content {
        width: 100% !important;
        padding: 40px 35px 40px 35px;
        margin: 5vw;
      }
    }
  }
}
</style>
