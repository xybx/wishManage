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
        :label="item.dp_title"
        :prop="item.dp_name"
      >
        <!-- 输入框 -->
        <template v-if="item.dp_type == 'text'">
          <el-input
            v-model="form[item.dp_name]"
            :placeholder="item.dp_placeholder"
          />
        </template>
        <template v-if="item.dp_type == 'phone'">
          <el-input
            v-model="form[item.dp_name]"
            :placeholder="item.dp_placeholder"
            maxlength="11"
          />
        </template>
        <!-- 密码框 -->
        <template v-if="item.dp_type == 'password'">
          <el-input
            v-model="form[item.dp_name]"
            :placeholder="item.dp_placeholder"
            type="password"
            show-password
          />
        </template>
        <!-- 数字 -->
        <template v-if="item.dp_type == 'number'">
          <el-input
            v-model="form[item.dp_name]"
            type="number"
            :placeholder="item.dp_placeholder"
          />
        </template>
        <!-- 日期 -->
        <template v-if="item.dp_type == 'date'">
          <el-date-picker
            v-model="form[item.dp_name]"
            :type="item.dp_dataType"
            :placeholder="item.dp_placeholder"
            style="width: 100%"
            :format="item.dp_format"
            :value-format="item.dp_format"
          />
        </template>
        <!-- 时间 -->
        <template v-if="item.dp_type == 'time'">
          <el-date-picker
            v-model="form[item.dp_name]"
            :type="item.dp_dataType"
            :placeholder="item.dp_placeholder"
            :format="item.dp_format"
            :value-format="item.dp_format"
          />
        </template>
        <!-- 时间段 -->
        <template v-if="item.dp_type == 'quantum'">
          <el-date-picker
            v-model="form[item.dp_name]"
            :type="item.dp_dataType"
            range-separator="To"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :format="item.dp_format"
            :value-format="item.dp_format"
          />
        </template>
        <!-- 下拉框 -->
        <template v-if="item.dp_type == 'select'">
          <el-select
            v-model="form[item.dp_name]"
            :placeholder="item.dp_placeholder"
            size="large"
            :filterable="true"
          >
            <el-option
              v-for="itemChild in item.dp_options"
              :key="itemChild.value"
              :label="itemChild.label"
              :value="itemChild.value"
            />
          </el-select>
        </template>
        <!-- 复选框 -->
        <template v-if="item.dp_type == 'checkbox'">
          <el-checkbox-group v-model="form[item.dp_name]">
            <el-checkbox
              v-for="itemChild in item.dp_options"
              :value="itemChild.value"
              :label="itemChild.label"
            >
            </el-checkbox>
          </el-checkbox-group>
        </template>

        <template v-if="item.dp_type == 'selectTree'">
          <el-tree-select
            :render-after-expand="false"
            default-expand-all
            :expand-on-click-node="false"
            node-key="id"
            v-model="form[item.dp_name]"
            :data="item.dp_options"
            :check-strictly="true"
            :multiple="item.dp_multiple"
            @node-click="setDepts"
            @change="riskPersonDeptChangeValue(item)"
          />
        </template>
        <!-- 单选框 -->
        <template v-if="item.dp_type == 'radio'">
          <el-radio-group v-model="form[item.dp_name]">
            <el-radio
              v-for="itemChild in item.dp_options"
              :value="itemChild.value"
              :label="itemChild.label"
            ></el-radio>
          </el-radio-group>
        </template>
        <!-- 文本域 -->
        <template v-if="item.dp_type == 'textArea'">
          <el-input
            v-model="form[item.dp_name]"
            type="textarea"
            :placeholder="item.dp_dp_placeholder"
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
</template>

<script setup lang="ts">
import {ElMessage, ElMessageBox, FormRules,ElLoading  } from "element-plus";
import type { DialogProps } from "/@/types/listTypes.ts";
import {getDeptheadSelectById, getSelectListApi, putDeptheadAdd, putDeptheadUp} from "/@/api/organizStruct/DeptheadApi";
import {isPhone} from "/@/utils/validate.ts";
const emits = defineEmits(["getData"]);
defineComponent({
  name: "DeptheadDialog",
});
const formRef = ref();
const form: any = reactive({});
const deptpid = defineModel<string | number>('deptpid')
const baseUrl = `${window.VITE_APP_BASE_URL}/globalfile/download?pid=`;

const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");
let depts = <any[]>[];
// 监听获得弹出框内容
let type = ref("add");
watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getDialog();
    type.value = dialogList.value.modeType;
    detailsTitle.value.map(async (key: any) => {
      console.log(123)
      if (key.dp_name == "usergradepid") {
        await getSelectListApi({ pid: 0 }).then((result: any) => {
          if (result.code == 200) {
            key.dp_options = result.data;
          }
        });
      }
    });

    if (type.value != "add") {
      let res = (await getDeptheadSelectById({ pid: dialogList.value?.pid })) as any;
      if (res.code == 200) {
        detailsTitle.value.map((key: any) => {
          key[key.dp_name] = res.data[key.dp_name];
          form[key.dp_name] = key[key.dp_name];
        });
      } else {
        ElMessage.error(res.msg);
      }
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
  // 方法
  // dialogList.value.parentEvent = {};
};

const detailsTitle = ref<any>([
      {
        dp_title: "级别",
        dp_name: "usergradepid",
        usergradepid: "",
        dp_type: "selectTree",
        dp_options: [],
        dp_placeholder:"请选择级别",
        dp_multiple: false,
      },
      {
        dp_title: "手机号:",
        dp_name: "phonenumber",
        phonenumber: "",
        dp_type: "phone",
        dp_placeholder:"请输入手机号",
      },
]);

const validatePhone = (rule: any, value: any, callback: any) => {
  if (!isPhone(value)) {
    callback("请输入正确格式的手机号");
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  usergradepid: [{ required: true, message: "请选择级别", trigger: "blur" }],
  phonenumber: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { trigger: "blur", validator: validatePhone },
  ],
});

function setDepts(value: any) {
  if (depts.some((e: any) => e.pid == value.id) == false) {
    depts.push({ deptname: value.label, pid: value.id });
  }
}
function riskPersonDeptChangeValue(item: any) {
  console.log(item);
  nextTick(() => {
    formRef.value.validateField(item.name);
  });
}
// 保存
const save = async (formEl: any) => {
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let loadingInstance1 = ElLoading.service({ fullscreen: true });
      // 编辑
      if (type.value == "edit") {
        form.deptpid = deptpid.value;
        await putDeptheadUp(form)
          .then((result: any) => {
            if (result.code == 200) {
              ElMessage.success("编辑成功");
              dialogVisible.value = false;
              loadingInstance1.close();
              // 清空表单
              clearForm();
              emits("getData");
            }
          })
          .catch((err:any) => {
            loadingInstance1.close();
          });
      } else if (type.value == "add") {
        form.deptpid = deptpid.value;
        await putDeptheadAdd(form)
          .then((result: any) => {
            if (result.code == 200) {
              ElMessage.success("保存成功");
              dialogVisible.value = false;
              loadingInstance1.close();
              // 清空表单
              clearForm();
              emits("getData");
            }
          })
          .catch((err:any) => {
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
      formRef.value!.resetFields();
      clearForm();
      dialogVisible.value = false;
    },
    () => {
      ElMessage.info("取消删除");
    }
  );
};

// 清空表单
const clearForm = () => {
  for (let i = 0; i < detailsTitle.value.length; i++) {
    const item = detailsTitle.value[i];
    item[item.dp_name] = "";
    item.dp_fileList = [];
  }

  for (const key in form) {
    form[key] = "";
  }
};
// 下载文件
const downLoadFile = (file: any) => {
  console.log(file);
  console.log(baseUrl + file.pid);

  let a = document.createElement("a") as any;
  a.style = "display: none"; // 创建一个隐藏的a标签
  a.download = file.name;
  a.href = baseUrl + file.pid;
  document.body.appendChild(a);
  a.click(); // 触发a标签的click事件
  document.body.removeChild(a);
};
</script>

<style scoped lang="scss">
@import "/@/styles/dialog/dialog.scss";
</style>
