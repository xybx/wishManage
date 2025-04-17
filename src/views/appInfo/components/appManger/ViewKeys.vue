<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
    <el-form
      :model="form"
      label-width="auto"
      :rules="rules"
      label-position="left"
      ref="formRef"
      class="keyForm"
    >
      <el-form-item label="当前用户密码" prop="password" class="password">
        <el-input
          type="password"
          v-model="form.password"
          autocomplete="new-password"
          placeholder="请输入当前用户密码"
          style="width: 69%; margin-right: 10px"
        />
        <div>
          <el-button type="primary" class="save" @click="save(formRef)"
            >确定
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="appId">
        <el-input v-model="appId" readonly />
      </el-form-item>
      <el-form-item label="appSecret">
        <el-input v-model="appSecret" readonly />
      </el-form-item>
    </el-form>
  </component>
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox, FormRules, ElLoading } from "element-plus";
import type { DialogProps } from "/@/types/listTypes";
import { getAppsecretApi } from "/@/api/appinfo/ViewKey.ts";
import { isPassword } from "/@/utils/validate";
import { publicKeyStore } from "/@/store/modules/publicKey.ts";

import * as crypto from "sm-crypto";
const emits = defineEmits(["getData"]);
defineComponent({
  name: "ApplicationDialog",
});
const keyStore = publicKeyStore();
const formRef = ref();
const appId = ref();
const appSecret = ref();
const form: any = reactive({});
const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");

// 监听获得弹出框内容
watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getDialog();
  }
});
const getDialog = () => {
  // 标签名
  dialogList.value.parentEleTag = "el-dialog";
  // 属性
  dialogList.value.parentOptions = {
    modelValue: dialogVisible,
    title: dialogList.value?.title,
    width: "37%",
    class: "dialogbox",
    "close-on-click-modal": false,
    appendToBody: true,
    "align-Center": true,
    center: true,
    "before-close": handleClose,
  };
  // 配置Dialog对应方法
  // dialogList.value.parentEvent = {};
};

const validatePassword = (rule: any, value: any, callback: any) => {
  if (!isPassword(value)) {
    callback("密码为8-20位字母和数字的组合");
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { trigger: "blur", validator: validatePassword },
  ],
});

const sm2 = crypto.sm2;
// 确认
const save = async (formEl: any) => {
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let loadingInstance1 = ElLoading.service({ fullscreen: true });

      let passm = sm2.doEncrypt(form.password, keyStore.publicKeyQ, 1);
      await getAppsecretApi({
        pid: dialogList.value.pid,
        password: passm,
      })
        .then((result: any) => {
          if (result.code == 200) {
            appId.value = result.data.appid;
            appSecret.value = result.data.appsecret;
            loadingInstance1.close();
          }
        })
        .catch((err) => {
          loadingInstance1.close();
        });
    } else {
      ElMessage.error("请输入必填项");
    }
  });
};
// 关闭
const handleClose = () => {
  ElMessageBox.confirm("确定要关闭页面吗？").then(
    async () => {
      formRef.value.clearValidate();
      clearForm();
      dialogVisible.value = false;
      appId.value = '';
      appSecret.value = '';
    },
    () => {
      ElMessage.info("取消关闭");
    }
  );
};

// 清空表单
const clearForm = () => {
  for (const key in form) {
    form[key] = "";
  }
};
</script>

<style scoped lang="scss">
@import "/@/styles/dialog/dialog.scss";
</style>
<style scoped lang="scss">
.keyForm {
  .el-form-item {
    .el-form-item__content {
      width: 50%;
    }
  }
}
</style>
