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
        <el-form-item
          :label="item.title"
          :prop="item.name"
          v-if="!(item.type == 'password' && type == 'edit')"
        >
          <!-- 输入框 -->
          <template v-if="item.type == 'text'">
            <el-input
              v-model="form[item.name]"
              :placeholder="item.placeholder"
            />
          </template>
          <!-- 密码框 -->
          <template v-if="item.type == 'password'">
            <el-input
              v-model="form[item.name]"
              :placeholder="item.placeholder"
              type="password"
              show-password
              autocomplete="new-password"
            />
          </template>
          <!-- 数字 -->
          <template v-if="item.type == 'number'">
            <el-input
              v-model.number="form[item.name]"
              type="text"
              :placeholder="item.placeholder"
            />
          </template>

          <!-- 下拉框 -->
          <template v-if="item.type == 'select'">
            <el-select
              v-model="form[item.name]"
              :placeholder="item.placeholder"
              size="large"
              :filterable="true"
            >
              <el-option
                v-for="itemChild in item.options"
                :key="itemChild.value"
                :label="itemChild.label"
                :value="itemChild.id"
              />
            </el-select>
          </template>
          <!-- 下拉框 -->
          <template v-if="item.type == 'selectTree'">
            <el-tree-select
              size="large"
              node-key="id"
              default-expand-all
              :prop="props"
              value-key="pid"
              :expand-on-click-node="false"
              v-model="form[item.name]"
              :data="item.options"
              :render-after-expand="false"
              :check-strictly="true"
              @change="riskPersonDeptChangeValue(item)"
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
          <!-- 上传图片 -->
          <template v-if="item.type == 'img'">
            <el-upload
              action="#"
              class="imgUpload"
              :show-file-list="false"
              :accept="item.file"
              :http-request="(params) => UploadFiles(params, item)"
              :disabled="uploadDisable"
            >
              <div class="box" v-if="imageUrl.length > 0">
                <i class="iconfont icon-chahao" @click="deleteImg(item)"></i>
                <el-image
                  :src="imageUrl"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  fit="cover"
                  class="imgOver"
                />
              </div>
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="tips">注：仅支持图片格式jpg、png</div>
          </template>

          <!-- 文本域 -->
          <template v-if="item.type == 'textArea'">
            <el-input
              v-model="form[item.name]"
              type="textarea"
              :placeholder="item.placeholder"
            />
          </template> </el-form-item
      ></template>
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
import { Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, FormRules, ElLoading } from "element-plus";
import type { DialogProps } from "/@/types/listTypes";
import {
  selectById,
  add,
  UploadFileApi,
  selectListApi,
  delSignImgApi,
} from "/@/api/organizStruct/UserDialogApi";
import { update } from "/@/api/organizStruct/updateNoDepartApi";

import {
  isPassword,
  isTruthName,
  isPhone,
  isEmail,
} from "~/src/utils/validate";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "UserDialog",
});
const formRef = ref();
const form: any = reactive({});
const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");
const imageUrl = ref("");

const props = {
  label: "deptname",
  value: "pid",
};

// 签名覆盖
const baseUrl = `${window.VITE_APP_BASE_URL}/auth-user/loadSignImg?pid=`;
// 文件上传
const uploadDisable = ref(false);
async function UploadFiles(option: any, item: any) {
  console.log(option, item);

  var data = new FormData(); //自定义 参数类型必须为 FormData格式 此为强制要求
  data.append("file", option.file);
  console.log(data, option.file);

  const res = (await UploadFileApi(data)) as any;
  if (res.code === 200) {
    console.log(res, res.data);

    //上传成功后保存uuid字段信息
    if (item[item.name] == "") {
      item[item.name] = res.data;
      form[item.name] = res.data;
    }
    imageUrl.value = baseUrl + res.data;
    console.log(imageUrl.value);

    uploadDisable.value = true;
  } else {
    ElMessage.error(res.msg);
  }
}
// 删除加载的图片/
const deleteImg = (item: any) => {
  console.log(item);

  ElMessageBox.confirm(`确定要删除这个文件嘛?`).then(
    async () => {
      await delSignImgApi({
        pid: item[item.name],
        userId: dialogList.value.pid,
      }).then((res: any) => {
        console.log(res);
        if (res.code == 200) {
          // 获得文件列表
          // getFileList(item);
          ElMessage.success("删除成功");
          imageUrl.value = "";
          form.imgsign = "";
          uploadDisable.value = false;
        }
      });
    },
    () => {
      ElMessage.info("取消删除");
    }
  );
};
// 监听获得弹出框内容
let type = ref("add");
watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    let loadingInstance1 = ElLoading.service({ fullscreen: true });
    getDialog();
    type.value = dialogList.value.modeType;
    detailsTitle.value.map(async (key: any) => {
      if (key.name == "gradeid") {
        await selectListApi({ pid: 0 }).then((result: any) => {
          if (result.code == 200) {
            console.log(result.data);
            key.options = result.data;
          }
        });
      }
    });

    if (type.value != "add") {
      await selectById({ userId: dialogList.value?.pid })
        .then((result: any) => {
          if (result.code == 200) {
            detailsTitle.value.map((key: any) => {
              key[key.name] = result.data[key.name];
              form[key.name] = key[key.name];
              if (key.type == "img") {
                getFileList(key);
              }
            });
            loadingInstance1.close();
          }
        })
        .catch(() => {
          loadingInstance1.close();
        });
    } else {
      form.sex = "男";
      form.status = "1";
      loadingInstance1.close();
    }
  }
});

// 获取文件列表
async function getFileList(item: any) {
  console.log(item);
  if (item[item.name] !== "") {
    imageUrl.value = baseUrl + item[item.name];
    uploadDisable.value = true;
    console.log(baseUrl + item[item.name]);
  }
}

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
    title: "姓名简拼:",
    name: "shortname",
    shortname: "",
    type: "text",
    value: "",
    placeholder: "请输入姓名简拼",
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
    title: "排序:",
    name: "ordernum",
    ordernum: "",
    type: "number",
    value: 0,
    placeholder: "请输入排序(数字小的排在前)",
  },
  {
    title: "邮箱:",
    name: "email",
    email: "",
    type: "text",
    value: "",
    placeholder: "请输入邮箱",
  },
  // {
  //   title: "级别:",
  //   name: "gradeid",
  //   gradeid: "",
  //   type: "selectTree",
  //   options: [],
  //   value: "",
  //   placeholder: "请选择级别",
  // },
  {
    title: "密码:",
    name: "password",
    password: "",
    type: "password",
  },
  {
    title: "确认密码:",
    name: "surepassword",
    surepassword: "",
    type: "password",
  },

  {
    title: "状态:",
    name: "status",
    status: "",
    type: "radio",
    options: [
      { label: "正常", value: "1" },
      { label: "停用", value: "0" },
    ],
    value: "",
    placeholder: "请选择状态",
  },
  {
    title: "性别:",
    name: "sex",
    sex: "男",
    type: "radio",
    options: [
      { label: "男", value: "男" },
      { label: "女", value: "女" },
    ],
    value: "",
    placeholder: "请选择性别",
  },
  {
    title: "签名:",
    name: "imgsign",
    imgsign: "",
    type: "img",
    value: "",
    fileList: [],
    file: ".jpg,.png",
  },
  {
    title: "个人简介:",
    name: "remark",
    remark: "",
    type: "textArea",
    value: "",
    placeholder: "请输入个人简介",
  },
]);
// 验证
const validateNew = (ruleFormRef: any) => {
  console.log(form.surepassword, "---form.surepassword");
  return (rule: any, value: any, callback: any) => {
    if (value === "") {
      callback("请输入新密码");
    } else if (!isPassword(value)) {
      callback("密码为8-20位字母和数字的组合");
    } else if (form.surepassword) {
      console.log(form.surepassword, "---form.surepassword");

      callback();
      // 触发一次确认密码项的校验。
      callback(ruleFormRef.value.validateField("surepassword"));
    } else {
      callback();
    }
  };
};
const validateConfirm = (rule: any, value: any, callback: any) => {
  console.log(form.surepassword, form.password, value, "---form.surepassword");
  if (form.password !== value && form.surepassword) {
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
const validateEmail = (rule: any, value: any, callback: any) => {
  if (value) {
    if (!isEmail(value) && value != "") {
      callback("请输入正确格式的邮箱");
    } else {
      callback();
    }
  } else {
    callback();
  }
};
const rules = reactive<FormRules>({
  truename: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { trigger: "blur", validator: validatetruthName },
  ],
  shortname: [{ required: true, message: "请输入姓名简拼", trigger: "blur" }],
  phonenumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { trigger: "blur", validator: validatePhone },
  ],
  ordernum: [
    { required: true, message: "请输入排序", trigger: "blur" },
    { type: "number", message: "请输入正整数", min: 1 },
  ],
  gradeid: [{ required: true, message: "请输入级别", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { trigger: "blur", validator: validateNew(formRef) },
  ],
  surepassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { trigger: "blur", validator: validateConfirm },
  ],
  status: [{ required: true, message: "请输入状态", trigger: "blur" }],
  sex: [{ required: true, message: "请输入性别", trigger: "blur" }],
  email: [{ required: false }, { trigger: "blur", validator: validateEmail }],
});
function riskPersonDeptChangeValue(item: any) {
  console.log(999);

  nextTick(() => {
    formRef.value.validateField(item.name);
  });
}
// 保存
const save = async (formEl: any) => {
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let loadingInstance1 = ElLoading.service({ fullscreen: true });
      form.depts = dialogList.value.depts;
      // return;
      if (imageUrl.value != "") {
        form.imgsign = imageUrl.value.split("=")[1];
      }
      // 编辑
      if (type.value == "edit") {
        form.pid = dialogList.value.pid;
        await update(form)
          .then(function (res: any) {
            if (res.code == 200) {
              ElMessage.success("编辑成功");
              dialogVisible.value = false;
              // 清空表单
              clearForm();
              loadingInstance1.close();
              emits("getData");
              imageUrl.value = "";
              uploadDisable.value = false;
            }
          })
          .catch((err) => {
            loadingInstance1.close();
          });
      } else if (type.value == "add") {
        await add(form)
          .then((result: any) => {
            if (result.code == 200) {
              ElMessage.success("保存成功");
              dialogVisible.value = false;
              // 清空表单
              clearForm();
              loadingInstance1.close();
              emits("getData");
              imageUrl.value = "";
              uploadDisable.value = false;
            }
          })
          .catch((err) => {
            loadingInstance1.close();
          });
      }
    } else {
      ElMessage.error("请输入必填项或正确格式的数据");
    }
  });
};
// 关闭
const handleClose = () => {
  ElMessageBox.confirm("编辑的内容未保存，确定要关闭页面吗？").then(
    async () => {
      formRef.value.clearValidate();
      if (dialogList.value.modeType == "add") {
        for (let i = 0; i < detailsTitle.value.length; i++) {
          const item = detailsTitle.value[i];
          if (item.type == "img" && item[item.name] != "") {
            console.log(item[item.name], dialogList.value.pid);

            await delSignImgApi({
              pid: item[item.name],
              userId: dialogList.value.pid,
            });
          }
        }
      }
      clearForm();
      dialogVisible.value = false;
      imageUrl.value = "";
      uploadDisable.value = false;
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
<style scoped lang="scss">
.tips {
  // width: 100%;
  color: rgb(158, 7, 7);
}
</style>
