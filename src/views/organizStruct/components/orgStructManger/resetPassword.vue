<template>
    <el-dialog
      :modelValue="dialogVisible"
      title="修改密码"
      width="500"
      :before-close="handleClose"
      align-center
      center
      class="dialogbox"
    >
      <el-form
        :model="form"
        label-width="auto"
        :rules="rules"
        label-position="left"
        ref="ruleFormRef"
      >
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            v-model="form.newPwd"
            show-password
            placeholder="8-20位字母/数字组成"
            autocomplete="new-password"
            clearable
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="sureNewPwd">
          <el-input
            type="password"
            v-model="form.sureNewPwd"
            show-password
            placeholder="8-20位字母/数字组成"
            autocomplete="new-password"
            clearable
          />
        </el-form-item>
        <el-form-item label="当前用户密码" prop="userPwd">
          <el-input
            type="password"
            v-model="form.userPwd"
            show-password
            placeholder="8-20位字母/数字组成"
            autocomplete="new-password"
            clearable
          />
        </el-form-item>
        <el-form-item class="button">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="onSubmit(ruleFormRef)">
            确定修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </template>

  <script lang="ts" setup>
  import { FormInstance, ElMessage, FormRules, ElMessageBox, ElLoading } from "element-plus";
  import { ref, onMounted } from "vue";
  // import { changePassword } from "/@/api/organizStruct/resetPassword";
  import { isPassword } from "/@/utils/validate";
import { changePassword } from "/@/api/organizStruct/resetpassword";

  const dialogVisible = defineModel<boolean>("dialogVisible");
  const pid = defineModel("pid");
  let ruleFormRef:any = ref<FormInstance>();

  defineOptions({
    name: "VabAvatar",
  });

  interface RuleForm {
    userPwd: any;
    newPwd: any;
    sureNewPwd: any;
  }
  const form: any = reactive<RuleForm>({
    userPwd: "",
    newPwd: "",
    sureNewPwd: "",
  });

  const onSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    console.log(99);

    await formEl.validate(async (valid: any, fields: any) => {
      console.log(valid);
      if (valid) {
        let loadingInstance1 = ElLoading.service({ fullscreen: true });
        await changePassword({
          userId: pid.value,
          userPwd: form.userPwd,
          newPwd: form.newPwd,
          sureNewPwd: form.newPwd,
        }).then((res:any)=>{
          if (res.code == 200) {
          ElMessage({ message: "修改成功", type: "success", plain: true });
          dialogVisible.value = false;
          loadingInstance1.close();
          clearForm();
        }
        }).catch((error)=>{
          loadingInstance1.close();
          //  ElMessage({ message: error, type: "error" });
        })

      } else {
        console.log("验证失败");
      }
    });
  };
  // const resetForm = (formEl: FormInstance | undefined) => {
  //   if (!formEl) return;
  //   formEl.resetFields();
  //   dialogVisible.value = false;
  //   form.userPwd = "";
  //   form.newPwd = "";
  //   form.sureNewPwd = "";
  // };
  const validateOld = (rule: any, value: any, callback: any) => {
    if (!isPassword(value)) {
      callback("密码为8-20位字母和数字的组合");
    } else {
      callback();
    }
  };
  const validateNew = (ruleFormRef: any) => {
    return (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback("请输入新密码");
      } else if (!isPassword(value)) {
        callback("密码为8-20位字母和数字的组合");
      } else if (form.sureNewPwd ) {
        callback();
        // 触发一次确认密码项的校验。
        callback(ruleFormRef.value.validateField("sureNewPwd"));
      } else {
        callback();
      }
    };
  };
  const validateConfirm = (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback("确认密码不可为空");
    } else if (form.newPwd !== value && form.sureNewPwd !== "") {
      callback("新密码与确认密码不一致");
    } else {
      callback();
    }
  };

  const rules = reactive<FormRules<RuleForm>>({
    userPwd: [
      {
        required: true,
        message: "请输入原始密码",
        trigger: "blur",
      },
      {
        min: 8,
        trigger: "blur",
        validator: validateOld,
      },
    ],
    newPwd: [
      {
        required: true,
        message: "请输入新密码，不少于6位。",
        trigger: "blur",
      },
      {
        min: 8,
        max: 20,
        trigger: "blur",
        validator: validateNew(ruleFormRef),
      },
    ],
    sureNewPwd: [
      {
        required: true,
        message: "请确认密码，要与新密码一致。",
        trigger: "blur",
      },
      {
        trigger: "blur",
        validator: validateConfirm,
      },
    ],
  });
  // 清空表单
  const clearForm = () => {
    for (const key in form) {
      form[key] = "";
    }
  };
  const handleClose = () => {
    ElMessageBox.confirm("你确定要关闭吗？", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      dialogVisible.value = false;
      ruleFormRef.value.clearValidate();
      clearForm();
    });
  };
  onMounted(() => {});
  </script>

  <style lang="scss" scoped></style>
