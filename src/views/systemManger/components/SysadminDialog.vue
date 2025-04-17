<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
    <el-form
      :model="form"
      label-width="auto"
      :rules="rules"
      label-position="left"
      ref="formRef"
    >
      <template v-for="item in detailsTitle">
        <el-form-item :label="item.title" :prop="item.name"   v-if="!(item.type == 'password' && type == 'edit')">
          <!-- 输入框 -->
          <template v-if="item.type == 'text'">
            <el-input
              v-model="form[item.name]"
              :placeholder="item.placeholder"
            />
          </template>
          <!-- 密码框 -->
          <template
            v-if="item.type == 'password' && dialogList.modeType == 'add'"
          >
            <el-input
              v-model="form[item.name]"
              :placeholder="item.placeholder"
              type="password"
              autocomplete="new-password"
              show-password
            />
          </template>

          <!-- 单选框 -->
          <template v-if="item.type == 'radio'">
            <el-radio-group v-model="form[item.name]">
              <el-radio
                v-for="itemChild in item.options"
                :value="itemChild.value"
                :label="itemChild.label"
              ></el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" class="save" @click="save(formRef)">保存</el-button>
        <el-button type="primary" plain @click="handleClose">关闭</el-button>
      </el-form-item>
    </el-form>
  </component>
  <!-- </el-dialog> -->
</template>
<script setup lang="ts">
import { ElMessage, ElMessageBox, FormRules, ElLoading } from "element-plus";
import type { DialogProps } from "/@/types/listTypes";
import { selectById, add, update } from "/@/api/sysManger/SysadminDialogApi";
import { delByUuids, baseUrl } from "/@/api/fileApi";
import { isName, isPassword, isPhone, isTruthName } from "/@/utils/validate";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "SysadminDialog",
});
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
      console.log(res);

      if (res.code == 200) {
      //  detailsTitle.value =  detailsTitle.value.filter((item:any)=>{
      //     return item.name!='spassword'&&item.name!='surePassword'
      //   })
        detailsTitle.value.map((key: any) => {
          // if(key.name!='spassword'&&key.name!='surePassword')
          key[key.name] = res.data[key.name];
          form[key.name] = key[key.name];
        });
      } else {
        ElMessage.error(res.msg);
      }
    }
    else{
      form.status='1'
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
    title: "姓名:",
    name: "truename",
    truename: "",
    type: "text",
    value: "",
    placeholder: "请输入姓名",
  },
  {
    title: "手机号:",
    name: "phonenumber",
    phonenumber: "",
    type: "text",
    value: "",
    placeholder: "请输入手机号",
  },
  {
    title: "登录密码:",
    name: "spassword",
    spassword: "",
    type: "password",
    placeholder: "请输入密码",
  },
  {
    title: "确认密码:",
    name: "surePassword",
    surePassword: "",
    type: "password",
    placeholder: "请输入确认密码",
  },
  {
    title: "状态:",
    name: "status",
    status: '1',
    type: "radio",
    options: [
      { label: "正常", value: '1' },
      { label: "停用", value: '0' },
    ],
  },
  {
    title: "备注:",
    name: "remark",
    remark: "",
    type: "text",
    value: "",
    placeholder: "请输入备注",
  },
]);
const validateNew = (ruleFormRef: any) => {
  return (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback("请输入新密码");
    } else if (!isPassword(value)) {
      callback("密码为8-20位字母和数字的组合");
    } else if (form.surePassword) {
      callback();
      // 触发一次确认密码项的校验。
      callback(ruleFormRef.value.validateField("surePassword"));
    } else {
      callback();
    }
  };
};
const validateConfirm = (rule: any, value: any, callback: any) => {
  if (form.spassword !== value && form.surePassword !== "") {
    callback("新密码与确认密码不一致");
  } else {
    callback();
  }
};
const validatetruthName = (rule: any, value: any, callback: any) => {
  if (!isTruthName(value)) {
    callback("请输入正确姓名");
  } else {
    callback();
  }
};
const validatePhone = (rule: any, value: any, callback: any) => {
  if (!isPhone(value)) {
    callback("请输入正确格式的手机号");
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  truename: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { trigger: "blur", validator: validatetruthName },
  ],
  phonenumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { trigger: "blur", validator: validatePhone },
  ],
  spassword: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 8, max: 20, trigger: "blur", validator: validateNew(formRef) },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "blur" }],
  surePassword: [
    {
      required: true,
      message: "请输入确认密码。",
      trigger: "blur",
    },
    { trigger: "blur", validator: validateConfirm },
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
          .then((res: any) => {
            if (res.code == 200) {
              ElMessage.success("编辑成功");
              dialogVisible.value = false;
              // 清空表单
              clearForm();
              loadingInstance1.close();
              emits("getData");
            }
          })
          .catch((error) => {
            loadingInstance1.close();
          });
      } else if (type.value == "add") {
        form.drivermsgpid = 1;
        await add(form)
          .then((res: any) => {
            if (res.code == 200) {
              ElMessage.success("保存成功");
              dialogVisible.value = false;
              // 清空表单
              clearForm();
              loadingInstance1.close();
              emits("getData");
            }
          })
          .catch((error) => {
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
      if (dialogList.value.modeType == "add") {
        let deleteStr = "";
        for (let i = 0; i < detailsTitle.value.length; i++) {
          const item = detailsTitle.value[i];
          if (
            (item.type == "img" ||
              item.type == "video" ||
              item.type == "file") &&
            item.value != ""
          ) {
            deleteStr += item.value + ",";
          }
        }
        if (deleteStr != "") {
          let res = (await delByUuids({ uuids: deleteStr })) as any;
          if (res.code == 200) {
            dialogVisible.value = false;
          }
        } else {
          dialogVisible.value = false;
        }
      }
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
