<template>
  <el-dialog
    :modelValue="dialogVisible"
    title="转移人员"
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
      <el-form-item label="新部门" prop="depart">
        <el-tree-select
          :render-after-expand="false"
          default-expand-all
          :expand-on-click-node="false"
          node-key="id"
          v-model="form.depart"
          :data="dialogList.depts"
          :check-strictly="true"
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
import {
  FormInstance,
  ElMessage,
  FormRules,
  ElMessageBox,
  ElLoading,
} from "element-plus";
import { ref, onMounted } from "vue";
import { changeUserDeptApi } from "/@/api/organizStruct/transerDeptsApi";

const emits = defineEmits(["getData"]);
const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<any>("dialogList");
let ruleFormRef: any = ref<FormInstance>();

interface RuleForm {
  depart: any;
}
const form: any = reactive<RuleForm>({
  depart: "",
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid: any, fields: any) => {
    console.log(valid);
    if (valid) {
      let loadingInstance1 = ElLoading.service({ fullscreen: true });
      await changeUserDeptApi({
        userPids: dialogList.value.userPids,
        deptPid: dialogList.value.deptPid,
        deptPidNew: form.depart,
      })
        .then((res: any) => {
          if (res.code == 200) {
            ElMessage({ message: "修改成功", type: "success", plain: true });
            dialogVisible.value = false;
            emits("getData");
            loadingInstance1.close();
            clearForm();
          }
        })
        .catch((error) => {
          loadingInstance1.close();
        });
    } else {
      console.log("验证失败");
    }
  });
};

const rules = reactive<FormRules<RuleForm>>({
  depart: [
    {
      required: true,
      message: "请选择新部门。",
      trigger: "blur",
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
