<template>
  <el-dialog
    :modelValue="lookDialogVisible"
    title="查看"
    width="37%"
    class="dialogbox"
    :close-on-click-modal="false"
    :append-to-body="true"
    :align-Center="true"
    :center="true"
    :before-close="handleClose"
  >
    <!-- v-bind="lookDialogList?.parentOptions" -->
    <div class="lookForm">
      <div class="item" v-for="item in detailsTitle">
        <div class="label">{{ item.title }}</div>
        <!-- 图片 -->
        <template v-if="item.type == 'img'">
          <div class="file">
            {{ item.fileList.length == 0 ? "暂无" : "" }}
            <el-image
              v-for="file in item.fileList"
              :key="file.pid"
              :src="baseUrl + file.pid"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[baseUrl + file.pid]"
              fit="cover"
              class="imgOver"
            />
          </div>
        </template>
        <!-- 视频 -->
        <template v-else-if="item.type == 'video'">
          <div class="file">
            {{ item.fileList.length == 0 ? "暂无" : "" }}
            <video
              v-for="file in item.fileList"
              :key="file.pid"
              :src="baseUrl + file.pid"
              :autoplay="false"
              controls
            ></video>
          </div>
        </template>
        <!-- 文件 -->
        <template v-else-if="item.type == 'file'">
          {{ item.fileList.length == 0 ? "暂无" : "" }}
          <ul v-if="item.fileList.length != 0">
            <li v-for="file in item.fileList">
              <div class="text">{{ file.name }}</div>
              <i class="iconfont icon-xiazai" @click="downLoadFile(file)"></i>
            </li>
          </ul>
        </template>
        <!-- 下拉框 -->
        <template v-else-if="item.type == 'select' || item.type == 'radio'">
          <div class="value">
            {{
              item.value
                ? item.options.filter((val: any) => val.value == item.value)
                    .length > 0
                  ? item.options.filter(
                      (val: any) => val.value == item.value
                    )[0].label
                  : "暂未找到该条数据，或已删除"
                : "暂无"
            }}
          </div>
        </template>
        <template v-else>
          <div class="value">
            {{ !item.value ? "暂无" : item.value }}
          </div>
        </template>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { UploadProps, ElMessage, ElMessageBox, FormRules } from "element-plus";
import type { DialogProps } from "/@/types/listTypes.ts";

import {
  selectListByUuid,
  selectById,
  getInterSelected,
} from "../../api/editDialogApi";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "lookDialog",
});
const baseUrl = `${window.VITE_APP_BASE_URL}/globalfile/download?pid=`;

// 获取文件列表
async function getFileList(item: any) {
  // 获得文件列表
  let result = (await selectListByUuid({ uuid: item.value })) as any;
  if (result.code == 200) {
    item.fileList = result.data;
  }
}

const lookDialogVisible = defineModel<boolean>("lookDialogVisible");
const lookDialogList = defineModel<DialogProps | any>("lookDialogList");
// 监听获得弹出框内容
watch(lookDialogVisible, async (newValue, b) => {
  console.log(newValue, b);

  if (newValue) {
    // getDialog();

    // 获得下拉框数据
    let selectData = (await getInterSelected()) as any;
    detailsTitle.value.map((key: any) => {
      // key.value = selectData.data[key.name];
      if (
        key.type == "checkbox" ||
        key.type == "radio" ||
        key.type == "select"
      ) {
        key.options = selectData.data;
      }
    });

    let res = (await selectById({ pid: lookDialogList.value?.pid })) as any;
    if (res.code == 200) {
      detailsTitle.value.map((key: any) => {
        key.value = res.data[key.name];
        if (key.type == "file" || key.type == "img" || key.type == "video") {
          getFileList(key);
        }
      });
    } else {
      ElMessage.error(res.msg);
    }
    console.log(detailsTitle.value);
  }
});
const getDialog = () => {
  // 标签名
  lookDialogList.value.parentEleTag = "el-dialog";
  // 属性
  lookDialogList.value.parentOptions = {
    modelValue: lookDialogVisible.value,
    title: lookDialogList.value?.title,
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
    title: "项目名称：",
    name: "textform",
    type: "text",
    value: "",
  },
  {
    title: "数字：",
    name: "numberform",
    type: "number",
    value: 0,
  },
  {
    title: "规划项目图片：",
    name: "imageform",
    type: "img",
    value: "",
    fileList: [],
    file: "file",
  },
  {
    title: "规划项目视频：",
    name: "videoform",
    type: "video",
    value: "",
    fileList: [],
    file: "file",
  },
  {
    title: "规划编制相关规则方面说明：",
    name: "textareaform",
    type: "textArea",
    value: "",
  },
  {
    title: "项目规划文件：",
    name: "fileform",
    type: "file",
    value: "",
    fileList: [],
    file: "file",
  },
  // {
  //   title: "复选框",
  //   name: "checkboxform",
  //   type: "checkbox",
  //   value: [],
  //   options: [],
  // },
  {
    title: "下拉框",
    name: "selectform",
    type: "select",
    value: "",
    options: [],
  },
  {
    title: "单选",
    name: "radioform",
    type: "radio",
    value: "",
    options: [],
  },
  {
    title: "日期",
    name: "dateform",
    type: "date",
    date: "",
    time: "",
    format: "YYYY-MM-DD",
    dataType: "date",
  },
  {
    title: "时间",
    name: "timeform",
    type: "time",
    value: "",
    dataType: "datetime",
    format: "YYYY-MM-DD HH:mm:ss",
  },
  // {
  //   title: "时间段",
  //   name: "timequantum",
  //   type: "quantum",
  //   value: "",
  //   dataType: "daterange",
  //   format: "YYYY-MM-DD",
  // },
]);

// 关闭
const handleClose = () => {
  // console.log(lookDialogVisible.value);

  lookDialogVisible.value = false;
    for (let i = 0; i < detailsTitle.value.length; i++) {
      const item = detailsTitle.value[i];

      item.value = "";
      item.fileList = [];
  }
};
// 下载文件
const downLoadFile = (file: any) => {
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
