<template>
  <el-dialog
    :modelValue="detailVisible"
    title="查看"
    width="37%"
    class="dialogbox"
    :close-on-click-modal="false"
    :append-to-body="true"
    :align-Center="true"
    :center="true"
    :before-close="handleClose"
  >
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
              item.value !== null
                ? item.options.filter((val: any) => val.value == item.value)
                    .length > 0
                  ? item.options.filter(
                      (val: any) => val.value == item.value
                    )[0].label
                  : "暂未找到该条数据，或已删除"
                : "暂无1"
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
import { ElMessage } from "element-plus";
import type { DialogProps } from "/@/types/listTypes";
import { selectById } from "/@/api/quartz/SysjoblogDetailApi";
import { selectListByUuid, baseUrl } from "/@/api/fileApi";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "SysjoblogDetail",
});

const detailVisible = defineModel<boolean>("detailVisible");
const detailList = defineModel<DialogProps | any>("detailList");

// 获取文件列表
async function getFileList(item: any) {
  // 获得文件列表
  let result = (await selectListByUuid({ uuid: item.value })) as any;
  if (result.code == 200) {
    item.fileList = result.data;
  }
}

// 监听获得弹出框内容
watch(detailVisible, async (newValue, b) => {
  if (newValue) {
    detailsTitle.value.map(async (key: any) => {
      if (
        key.type == "checkbox" ||
        key.type == "radio" ||
        key.type == "select"
      ) {
        // 获得下拉框数据
        let arr = [];
        if (key.name == "status") {
          let tempSelectData = [
            { label: "正常", value: 0 },
            { label: "失败", value: 1 },
          ];
          for (let i = 0; i < tempSelectData.length; i++) {
            arr.push({
              label: tempSelectData[i].label,
              value: tempSelectData[i].value,
            });
          }
        }
        key.options = arr;
      }
    });

    let res = (await selectById({ pid: detailList.value?.pid })) as any;
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
  }
});
const getDialog = () => {
  // 标签名
  detailList.value.parentEleTag = "el-dialog";
  // 属性
  detailList.value.parentOptions = {
    modelValue: detailVisible.value,
    title: detailList.value?.title,
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
    title: "任务组名:",
    name: "jobgroup",
    type: "text",
    value: "",
    placeholder: "请输入任务组名",
  },
  {
    title: "任务名称:",
    name: "jobname",
    type: "text",
    value: "",
    placeholder: "请输入任务名称",
  },
  {
    title: "创建时间:",
    name: "createtime",
    type: "time",
    dataType: "datetime",
    date: "",
    time: "",
    format: "YYYY-MM-DD HH:mm:ss",
    placeholder: "请选择创建时间",
  },
  {
    title: "开始时间:",
    name: "starttime",
    type: "time",
    dataType: "datetime",
    date: "",
    time: "",
    format: "YYYY-MM-DD HH:mm:ss",
    placeholder: "请选择开始时间",
  },
  {
    title: "结束时间:",
    name: "endtime",
    type: "time",
    dataType: "datetime",
    date: "",
    time: "",
    format: "YYYY-MM-DD HH:mm:ss",
    placeholder: "请选择结束时间",
  },
  {
    title: "调用目标字符串:",
    name: "invoketarget",
    type: "text",
    value: "",
    placeholder: "请输入调用目标字符串",
  },
  {
    title: "执行状态:",
    name: "status",
    type: "select",
    options: [],
    value: "",
    placeholder: "请选择执行状态",
  },
  {
    title: "日志信息:",
    name: "jobmessage",
    type: "text",
    value: "",
    placeholder: "请输入日志信息",
  },
  {
    title: "异常信息:",
    name: "exceptioninfo",
    type: "text",
    value: "",
    placeholder: "请输入异常信息",
  },
]);

// 关闭
const handleClose = () => {
  detailVisible.value = false;
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
