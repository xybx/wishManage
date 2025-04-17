<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
    <el-form
      :model="form"
      label-width="auto"
      :rules="rules"
      label-position="left"
      ref="formRef"
    >
      <el-form-item
        v-for="item in detailsTitle"
        :label="item.title"
        :prop="item.name"
      >
        <!-- 输入框 -->
        <template v-if="item.type == 'text'">
          <el-input v-model="form[item.name]" :placeholder="item.placeholder" />
        </template>
        <!-- 数字 -->
        <template v-if="item.type == 'number'">
          <el-input
            v-model.number="form[item.name]"
            type="text"
            :placeholder="item.placeholder"
          />
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="save" @click="save(formRef)"
          >保存</el-button
        >
        <el-button type="primary" plain @click="handleClose">关闭</el-button>
      </el-form-item>
    </el-form>
  </component>
  <!-- </el-dialog> -->
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox, FormRules, ElLoading } from "element-plus";
import type { DialogProps } from "/@/types/listTypes";
import { selectById, add, update } from "/@/api/organizStruct/orgLevelApi";

const emits = defineEmits(["getData"]);

const formRef = ref();
const form: any = reactive({});
const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");
// 监听获得弹出框内容
let type = ref("add");
watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getDialog();
    type.value = dialogList.value.modeType;

    if (type.value != "add") {
      let res = (await selectById({ pid: dialogList.value?.pid })) as any;
      if (res.code == 200) {
        detailsTitle.value.map((key: any) => {
          key[key.name] = res.data[key.name];
          form[key.name] = key[key.name];
        });
      } else {
        ElMessage.error(res.msg);
      }
    } else {
      form.status = "1";
      form.depttype = "0";
    }
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

const detailsTitle = ref<any>([
  {
    title: "名称:",
    name: "gradename",
    gradename: "",
    type: "text",
    value: "",
    placeholder: "请输入名称",
  },
  {
    title: "排序:",
    name: "sortnum",
    ordernum: "",
    type: "number",
    value: 0,
    placeholder: "请输入排序",
  },
  {
    title: "标识:",
    name: "value",
    ordernum: "",
    type: "number",
    value: 0,
    placeholder: "请输入标识",
  },

  {
    title: "说明:",
    name: "remark",
    remark: "",
    type: "text",
    value: "",
    placeholder: "请输入说明",
  },
]);
const rules = reactive<FormRules>({
  gradename: [{ required: true, message: "请输入名称", trigger: "blur" },
    {  max: 20, trigger: "blur" , message: "级别名称过长，请修改"},
 
  ],
  sortnum: [
    { required: true, message: "请输入排序", trigger: "blur" },
    { type: "number", message: "请输入正整数", min: 1 },
  ],
  value: [
    { required: true, message: "请输入标识", trigger: "blur" },
    { type: "number", message: "请输入1-9之间的正整数", min: 1, max: 9 },
  ],
});
// 保存
const save = async (formEl: any) => {
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let loadingInstance1 = ElLoading.service({ fullscreen: true });
      // 编辑
      if (type.value == "edit") {
        form.pid = dialogList.value.pid;
        await update(form)
          .then((result: any) => {
            if (result.code == 200) {
              ElMessage.success("编辑成功");
              // 清空表单
              clearForm();
              dialogVisible.value = false;
              loadingInstance1.close();
              emits("getData");
            }
          })
          .catch((err) => {
            loadingInstance1.close();
          });
      } else if (type.value == "add") {
        form.parentpid = dialogList.value.pid;
        await add(form)
          .then((result: any) => {
            if (result.code == 200) {
              ElMessage.success("保存成功");
              // 清空表单
              clearForm();
              dialogVisible.value = false;
              loadingInstance1.close();
              emits("getData");
            }
          })
          .catch(() => {
            loadingInstance1.close();
          });
      }
    } else {
      ElMessage.error("请输入必填项");
    }
  });
};
// 关闭
const handleClose = () => {
  ElMessageBox.confirm("编辑的内容未保存，确定要关闭页面吗？").then(
    async () => {
      formRef.value.clearValidate();

      clearForm();
      dialogVisible.value = false;
    },
    () => {
      ElMessage.info("取消关闭");
    }
  );
};

// 清空表单
const clearForm = () => {
  for (let i = 0; i < detailsTitle.value.length; i++) {
    const item = detailsTitle.value[i];
    item[item.name] = "";
    item.fileList = [];
  }
  for (const key in form) {
    form[key] = "";
  }
};
</script>

<style scoped lang="scss">
@import "/@/styles/dialog/dialog.scss";
</style>
