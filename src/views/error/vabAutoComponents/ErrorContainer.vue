<template>
  <div class="error-container">
    <div class="error-content">
      <div class="pic-error">
        <vab-icon class="error-svg" icon="403" is-custom-svg />
      </div>
      <div class="bullshit">
        <div class="bullshit-oops">{{ oops }}</div>
        <div class="bullshit-headline">{{ headline }}</div>
        <div class="bullshit-info">{{ info }}</div>
        <router-link v-slot="{ navigate }" custom to="/">
          <el-button type="primary" @click="navigate">{{ btn }}</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'ErrorContainer',
})

defineProps({
  oops: {
    type: String,
    default: '',
  },
  headline: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    default: '',
  },
  btn: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss">
.error-container {
  @media (max-width: 768px) {
    .error-content {
      flex-direction: column !important;
      padding-top: 6.5vh;

      .pic-error {
        height: 200px !important;
      }
    }
  }

  .error-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    max-width: 1000px;
    height: calc(var(--el-container-height) - 40px);
    margin: auto;

    .pic-error {
      flex-basis: 60%;
      height: 300px;

      .error-svg {
        width: 100%;
        height: 100%;
      }
    }

    .bullshit {
      flex-basis: 40%;

      &-oops {
        margin-bottom: 20px;
        font-size: 24px;
        font-weight: bold;
        line-height: 40px;
        color: var(--el-color-primary);
        opacity: 0;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }

      &-headline {
        margin-bottom: 10px;
        font-size: 20px;
        font-weight: bold;
        line-height: 24px;
        color: var(--el-color-grey);
        opacity: 0;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }

      &-info {
        margin-bottom: 30px;
        font-size: 13px;
        line-height: 21px;
        color: var(--el-color-grey);
        opacity: 0;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }

      .el-button {
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }

      @keyframes slideUp {
        0% {
          opacity: 0;
          transform: translateY(60px);
        }

        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
}

#app {
  > .error-container {
    > .error-content {
      height: calc(var(--vh, 1vh) * 100);
    }
  }
}
</style>
