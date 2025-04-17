<template>
  <div class="login-container animate__animated animate__backInLeft">
    <el-row>
      <el-col :span="24">
        <div class="top-container">
          <h2
            class="animate__animated animate__backInDown animate__delay-1s"
            :title="loginBigTit"
          >
            {{ loginBigTit }}
          </h2>
          <span
            class="enbox animate__animated animate__fadeInLeft animate__delay-1s"
            >{{ loginEnTit }}</span
          >
        </div>
        <el-card
          class="formbox animate__animated animate__pulse animate__delay-2s"
        >
          <h3>{{ FormTitle }}</h3>
          <el-form
            ref="loginFormRef"
            :model="loginData"
            :rules="loginRules"
            class="login-form"
          >
            <el-form-item prop="phone">
              <div class="itembox">
                <span class="leftbox"
                  ><i class="iconfont icon-shoujihao"></i
                ></span>
                <el-input
                  v-model="loginData.phone"
                  :placeholder="translate('请输入手机号')"
                  name="phone"
                />
                <!-- <div class="rember" v-show="remberPhone">
                  <div
                    class="item"
                    v-for="item in loginedPhone"
                    @click="getPhone(item)"
                  >
                    {{ item }}
                  </div>
                </div> -->
                <!-- 下拉按钮 -->
                <!-- <vab-icon
                  class="vab-dropdown"
                  :class="{ 'vab-dropdown-active': !remberPhone }"
                  icon="arrow-up-s-line"
                  @click="handleRember"
                /> -->
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <div class="itembox">
                <span class="leftbox"
                  ><i class="iconfont icon-ziyuanxhdpi"></i
                ></span>
                <el-input
                  v-model="loginData.password"
                  :placeholder="translate('请输入密码')"
                  type="password"
                  @keyup="checkCapslock"
                  show-password
                />
              </div>
            </el-form-item>
            <div class="recdoe">
              <el-form-item prop="code" style="flex: 1">
                <div class="itembox">
                  <span class="leftbox"
                    ><i class="iconfont icon-yanzhengma"></i
                  ></span>
                  <el-input
                    v-model="loginData.code"
                    auto-complete="off"
                    :placeholder="translate('请输入验证码')"
                    @keyup.enter="handleLogin"
                  />
                </div>
              </el-form-item>
              <div class="code" @click="reLoadCode">
                <img :src="captchaImg" alt="验证码" />
              </div>
            </div>
            <el-button
              :loading="loading"
              type="primary"
              size="large"
              class="logbtn"
              @click.prevent="handleLogin"
              >登 录</el-button
            >
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules, InputInstance } from "element-plus";
import type { OptionProps, LoginData } from "/@/types/loginTypes.ts";
import { translate } from "/@/i18n";
import { useUserStore } from "/@/store/modules/user";
import { getImageCode } from "/@/api/user.ts";
import { isPassword, isPhone } from "/@/utils/validate";
import * as crypto from "sm-crypto";
import { publicKeyStore } from "/@/store/modules/publicKey";
defineOptions({
  name: "Login",
});

const keyStore = publicKeyStore();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const login = (form: any) => userStore.login(form);
const loading = ref<boolean>(false);
const redirect = ref<any>(undefined);
let timer: ReturnType<typeof setInterval>;
const isCapslock = ref<boolean>(false); // 是否大写锁定
const loginFormRef = ref(ElForm); // 登录表单ref
const loginBigTit = ref<string>("");
const loginEnTit = ref<string>("");
const FormTitle = ref<string>("");
const loginData = ref<LoginData>({
  phone: "",
  password: "",
  code: "",
});
const sm2 = crypto.sm2;
const cipherMode = 1;
let captchaImg: any = ref("");
let captchaKey: any = ref("");

const validatePhone = (rule: any, value: any, callback: any) => {
  if (!isPhone(value)) callback(new Error(translate("请输入正确的手机号格式")));
  else callback();
};
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!isPassword(value))
    callback(new Error(translate("密码为8-20位字母和数字的组合")));
  else callback();
};

const getLoginTitle = () => {
  let str = "weizhongtaiguanlizhongxin";
  loginBigTit.value = "心愿秘境管理中心";
  loginEnTit.value = str.toUpperCase();
  FormTitle.value = "系统登录";
};

function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

const loginRules = reactive<FormRules>({
  phone: [
    {
      required: true,
      trigger: "blur",
      message: "请输入手机号",
    },
    {
      min: 11,
      message: "请输入正确的手机号格式",
      trigger: "blur",
      validator: validatePhone,
    },
  ],
  password: [
    { required: true, trigger: "blur", message: "请输入密码" },
    {
      trigger: "blur",
      validator: validatePassword,
    },
  ],
  code: [
    { required: true, trigger: "blur", message: "请输入验证码" },
    {
      min: 5,
      max: 5,
      trigger: "blur",
      message: "请输入正确格式的验证码",
    },
  ],
});

const handleRoute = () => {
  return redirect.value === "/404" || redirect.value === "/403"
    ? "/"
    : redirect.value;
};

const handleLogin = async () => {
  if (loginFormRef.value)
    loginFormRef.value?.validate(async (valid: any) => {
      if (valid)
        try {
          loading.value = true;
          let phsm = sm2.doEncrypt(
            loginData.value.phone,
            keyStore.publicKeyQ,
            cipherMode
          );
          let passsm = sm2.doEncrypt(
            loginData.value.password,
            keyStore.publicKeyQ,
            cipherMode
          );
          let json: string = JSON.stringify({
            phone: phsm,
            password: passsm,
            code: loginData.value.code,
            codeid: captchaKey.value,
          });
          await login(json).catch(async () => {
            loading.value = false;
            await reLoadCode();
            loginData.value.code = "";
          });

          // let noArr: any = [];
          // init(res);
          // let localPhone = JSON.parse(localStorage.getItem("phone") as any);
          // if (localPhone) {
          //   // 判断是否已有xxx查询记录的localStorage
          //   if (localPhone.length > 0) {
          //     if (localPhone.indexOf(loginData.value.phone) > -1) {
          //       // 判断是否已有此条查询记录，若已存在，则不需再存储
          //       console.log("已存在");

          //       return;
          //     }
          //   }
          //   localStorage.setItem(
          //     "phone",
          //     JSON.stringify(localPhone.concat([loginData.value.phone]))
          //   );
          //   console.log("cunle");
          // } else {
          //   // 首次创建
          //   localStorage.setItem(
          //     "phone",
          //     JSON.stringify(loginData.value.phone)
          //   );
          // }
          // }

          localStorage.setItem("phone", loginData.value.phone);
          await router.push(handleRoute());
        } finally {
          loading.value = false;
        }
    });
};

onMounted(async () => {
  getLoginTitle();
  await reLoadCode();
  loginData.value.phone = localStorage.getItem("phone") as any;
});
// 刷新验证码
const reLoadCode = async () => {
  let res = (await getImageCode()) as any;
  captchaImg.value = res.captchaImg;
  captchaKey.value = res.captchaKey;
};

watchEffect(() => {
  redirect.value = (route.query && route.query.redirect) || "/";
});

onBeforeRouteLeave((to, from, next) => {
  try {
    if (timer) clearTimeout(timer);
  } catch {
    /* empty */
  }
  next();
});
</script>
<style scoped lang="scss">
@use "/@/styles/login/loginst.scss";
</style>
