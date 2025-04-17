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
          <span style="color: red" v-if="item.dp_name == 'name'"
            >注：首字母必须大写，尽量跟组件名一致</span
          >
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
  <!-- </el-dialog> -->
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, FormRules, ElLoading } from "element-plus";
import type { DialogProps } from "/@/types/listTypes.ts";
import {
  getMenuListId,
  putMenuAdd,
  putMenuUp,
} from "/@/api/appinfo/VuemenuApi.ts";
const emits = defineEmits(["getData"]);
defineComponent({
  name: "VuemenuDialog",
});
const formRef = ref();
const form: any = reactive({});
const baseUrl = `${window.VITE_APP_BASE_URL}/globalfile/download?pid=`;
const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");
let parentpid = ref<string>("");

// 监听获得弹出框内容
let type = ref("add");
watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getDialog();
    type.value = dialogList.value.modeType;
    detailsTitle.value.map((key: any)=>{
      if (key.dp_type == "checkbox" || key.dp_type == "radio" || key.dp_type == "select"){
        if (key.dp_name == "isroot") {
          form[key.dp_name] = false
        }
        if (key.dp_name == "hidden") {
          form[key.dp_name] = false
        }
        if (key.dp_name == "breadcrumbhidden") {
          form[key.dp_name] = false
        }
      }
    })

    if (type.value != "add") {
      let res = (await getMenuListId({ pid: dialogList.value?.pid })) as any;
      if (res.code == 200) {
        detailsTitle.value.map((key: any) => {
          key[key.dp_name] = res.data[key.dp_name];
          form[key.dp_name] = key[key.dp_name];
        });
        parentpid.value = res.data.parentpid;
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
    dp_title: "菜单名称:",
    dp_name: "title",
    title: "",
    dp_type: "text",
    dp_placeholder: "请输入菜单名称",
  },
  {
    dp_title: "路由路径:",
    dp_name: "path",
    path: "",
    dp_type: "text",
    dp_placeholder: "请输入路由路径",
  },
  {
    dp_title: "路由名称:",
    dp_name: "name",
    name: "",
    dp_type: "text",
    dp_placeholder: "请输入路由名称",
  },
  {
    dp_title: "重定向:",
    dp_name: "redirect",
    redirect: "",
    dp_type: "text",
    dp_placeholder: "请输入重定向",
  },
  {
    dp_title: "组件:",
    dp_name: "component",
    component: "",
    dp_type: "text",
    dp_placeholder: "请输入组件",
  },
  {
    dp_title: "是否根组件:",
    dp_name: "isroot",
    isroot: false,
    dp_type: "select",
    dp_options: [
      { label: "否", value: false },
      { label: "是", value: true },
    ],
    dp_placeholder: "请输入是否根组件",
  },
  {
    dp_title: "图标:",
    dp_name: "icon",
    icon: "",
    dp_type: "text",
    dp_placeholder: "请输入图标",
  },
  {
    dp_title: "是否隐藏:",
    dp_name: "hidden",
    hidden: false,
    dp_type: "select",
    dp_options: [
      { label: "否", value: false },
      { label: "是", value: true },
    ],
    dp_placeholder: "请输入是否隐藏",
  },
  {
    dp_title: "面包屑导航是否显示:",
    dp_name: "breadcrumbhidden",
    breadcrumbhidden: false,
    dp_type: "select",
    dp_options: [
      { label: "不显示", value: true },
      { label: "显示", value: false },
    ],
    dp_placeholder: "请输入面包屑导航是否显示",
  },
  {
    dp_title: "排序:",
    dp_name: "sort",
    sort: "",
    dp_type: "text",
    dp_placeholder: "请输入排序",
  },
]);

const rules = reactive<FormRules>({
  title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  name: [{ required: true, message: "请输入路由名称", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件", trigger: "blur" }],
  isroot: [{ required: true, message: "请选择是否根组件", trigger: "change" }],
  hidden: [{ required: true, message: "请选择是否隐藏", trigger: "change" }],
  breadcrumbhidden: [
    { required: true, message: "请选择面包屑导航是否显示", trigger: "change" },
  ],
  sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
});

// 保存
const save = async (formEl: any) => {
  await formEl.validate(async (valid: any, fields: any) => {
    if (valid) {
      let loadingInstance1 = ElLoading.service({ fullscreen: true });
      // 编辑
      if (type.value == "edit") {
        form.pid = dialogList.value.pid;
        form.parentpid = parentpid.value;
        await putMenuUp(form)
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
          .catch((err) => {
            loadingInstance1.close();
          });
      } else if (type.value == "add") {
        form.parentpid = dialogList.value.pid;
        await putMenuAdd(form)
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
          .catch((err) => {
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
      formRef.value.resetFields();
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
</script>

<style scoped lang="scss">
@import "/@/styles/dialog/dialog.scss";
</style>
