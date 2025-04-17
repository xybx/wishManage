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
              :key="itemChild.value"
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
              :key="itemChild.value"
              :value="itemChild.value"
              :label="itemChild.label"
            ></el-radio>
          </el-radio-group>
        </template>
        <!-- 上传图片 -->
        <template v-if="item.dp_type == 'img'">
          <el-upload
            action="#"
            list-type="picture-card"
            class="imgUpload"
            :accept="item.dp_file"
            v-model:file-list="item.dp_fileList"
            :http-request="(params) => UploadFiles(params, item)"
          >
            <i class="iconfont icon-jietutupian"></i>
            <div class="desc">上传图片</div>
            <template #file="{ file }">
              <i
                class="iconfont icon-chahao"
                @click="deleteImg(file, item)"
              ></i>
              <el-image
                :src="file.url"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[baseUrl + file.pid]"
                fit="cover"
                class="imgOver"
              />
            </template>
          </el-upload>
        </template>
        <!-- 上传视频 -->
        <template v-if="item.dp_type == 'video'">
          <el-upload
            :accept="item.dp_file"
            class="videoUpload"
            id="video_kp"
            action=""
            list-type="picture-card"
            :name="item.dp_name"
            v-model:file-list="item.dp_fileList"
            :http-request="(params) => UploadFiles(params, item)"
          >
            <i class="iconfont icon-shipin"></i>
            <div class="desc">上传视频</div>
            <template #file="{ file }">
              <div>
                <i
                  class="iconfont icon-chahao"
                  @click="deleteImg(file, item)"
                ></i>
                <video
                  ref="videoRef"
                  :src="file.url"
                  :autoplay="false"
                  controls
                ></video>
              </div>
            </template>
          </el-upload>
        </template>
        <!-- 文本域 -->
        <template v-if="item.dp_type == 'textArea'">
          <el-input
            v-model="form[item.dp_name]"
            type="textarea"
            :placeholder="item.dp_dp_placeholder"
          />
        </template>
        <!-- 上传文件 -->
        <template v-if="item.dp_type == 'file'">
          <el-upload
            :accept="item.dp_file"
            v-model:file-list="item.dp_fileList"
            class="fileUpload"
            action="#"
            :http-request="(params) => UploadFiles(params, item)"
          >
            <el-button type="primary">上传文件</el-button>
            <template #file="file">
              <div class="text">{{ file.file.name }}</div>
              <div class="operate">
                <i
                  class="iconfont icon-xiazai"
                  @click="downLoadFile(file.file)"
                ></i>
                <i
                  class="iconfont icon-shanchu"
                  @click="deleteImg(file.file, item)"
                ></i>
              </div>
            </template>
          </el-upload>
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
import type { DialogProps } from "/@/types/gisServer/SysdictableTypes";
import { selectById, add, update } from "/@/api/gisServer/SysdictableDialogApi";
import {
  UploadFile,
  selectListByUuid,
  deleteFile,
  delByUuids,
  baseUrl,
} from "/@/api/fileApi";
const emits = defineEmits(["getData"]);
defineComponent({
  name: "SysdictableDialog",
});
const formRef = ref();
const form: any = reactive({});

// 删除加载的图片/
const deleteImg = (file: any, item: any) => {
  console.log(file, item);

  ElMessageBox.confirm(`确定要删除这个文件嘛?`).then(
    async () => {
      let res = (await deleteFile({ pid: file.pid })) as any;
      console.log(res);
      if (res.code == 200) {
        // 获得文件列表
        getFileList(item);
        ElMessage.success("删除成功");
      } else {
        ElMessage.error(res.msg);
      }
    },
    () => {
      ElMessage.info("取消删除");
    }
  );
};

// 文件上传
async function UploadFiles(option: any, item: any) {
  console.log(item.dp_fileList, option);

  var data = new FormData(); //自定义 参数类型必须为 FormData格式 此为强制要求
  data.append("file", option.file);
  data.append("uuid", item[item.dp_name]);
  const res = (await UploadFile(data)) as any;
  if (res.code === 200) {
    console.log(res, res.data.filePid);

    //上传成功后保存uuid字段信息
    if (item[item.dp_name] == "") {
      item[item.dp_name] = res.data.uuid;
      form[item.dp_name] = res.data.uuid;
    }

    item.dp_fileList[item.dp_fileList.length - 1] = {
      url: baseUrl + res.data.filePid,
      pid: res.data.filePid,
      name: option.file.name.split(".")[0],
    };
  } else {
    ElMessage.error(res.msg);
  }
}
// 获取文件列表
async function getFileList(item: any) {
  // 获得文件列表
  let result = (await selectListByUuid({ uuid: item[item.dp_name] })) as any;

  if (result.code == 200) {
    console.log(result);
    // let arr = result.data.reverse();
    item.dp_fileList = [];
    for (let i = 0; i < result.data.length; i++) {
      const element = result.data[i];
      item.dp_fileList.push({ ...element, url: baseUrl + element.pid });
    }

    console.log(item.dp_fileList);
  }
}

const dialogVisible = defineModel<boolean>("dialogVisible");
const dialogList = defineModel<DialogProps | any>("dialogList");

// 监听获得弹出框内容
let type = ref("add");
watch(dialogVisible, async (newValue, b) => {
  if (newValue) {
    getDialog();
    type.value = dialogList.value.modeType;
    detailsTitle.value.map(async (key: any) => {
      if (
        key.dp_type == "checkbox" ||
        key.dp_type == "radio" ||
        key.dp_type == "select"
      ) {
        // 获得下拉框数据
        let arr: any[] = [];
        key.dp_options = arr;
      }
    });

    if (type.value != "add") {
      let res = (await selectById({ pid: dialogList.value?.pid })) as any;
      if (res.code == 200) {
        detailsTitle.value.map((key: any) => {
          key[key.dp_name] = res.data[key.dp_name];
          form[key.dp_name] = key[key.dp_name];
          if (
            key.dp_type == "file" ||
            key.dp_type == "img" ||
            key.dp_type == "video"
          ) {
            getFileList(key);
          }
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
    dp_title: "表名称:",
    dp_name: "tablename",
    tablename: "",
    dp_type: "text",
    dp_placeholder: "请输入表名称",
  },
  {
    dp_title: "描述:",
    dp_name: "remark",
    remark: "",
    dp_type: "textArea",
    dp_placeholder: "请输入描述",
  },
]);

const rules = reactive<FormRules>({
  tablename: [{ required: true, message: "请输入表名称", trigger: "blur" }],
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
        form.drivermsgpid = 1;
        await add(form)
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
      formRef.value.clearValidate();
      if (dialogList.value.modeType == "add") {
        let deleteStr = "";
        for (let i = 0; i < detailsTitle.value.length; i++) {
          const item = detailsTitle.value[i];
          if (
            (item.dp_type == "img" ||
              item.dp_type == "video" ||
              item.dp_type == "file") &&
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
