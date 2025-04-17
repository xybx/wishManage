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
import {ElMessage} from "element-plus";
import type { DialogProps } from "/@/types/listTypes";
import {
  selectById
} from "/@/api/appinfo/WishmessageDetailApi";
import { selectListByUuid,baseUrl } from "/@/api/fileApi";
import Utils from "~/src/utils/base64";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "WishmessageDetail",
});
let baseUtil = new Utils();
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
      if (key.type == "checkbox" || key.type == "radio" || key.type == "select") {
        // 获得下拉框数据
        let arr=[]
        key.options = arr;
      }
    });

    let res = (await selectById({ pid: detailList.value?.pid })) as any;
    if (res.code == 200) {
      detailsTitle.value.map((key: any) => {
        if(key.name=="scontent")
      {
        key.value = baseUtil.base64_decode(res.data[key.name]);
        
      }
      else
      {

     
        key.value = res.data[key.name];
        if (key.type == "file" || key.type == "img" || key.type == "video") {
          getFileList(key);
        }
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
      title: "留言人:",
              name: "nickname",
              type: "textArea",
              value: "",
              placeholder:"请输入留言人",
    },
    {
      title: "留言时间:",
              name: "addtime",
              type: "textArea",
              value: "",
              placeholder:"请输入留言时间",
    },
    {
      title: "地址:",
              name: "ip",
              type: "textArea",
              value: "",
              placeholder:"请输入地址",
    },
    {
      title: "地址:",
              name: "address",
              type: "textArea",
              value: "",
              placeholder:"请输入地址",
    },
    {
      title: "联系方式:",
              name: "mobile",
              type: "textArea",
              value: "",
              placeholder:"请输入联系方式",
    },
    {
      title: "留言内容:",
              name: "scontent",
              type: "textArea",
              value: "",
              placeholder:"请输入留言内容",
    },
    {
      title: "处理情况",
              name: "isused",
              type: "textArea",
              value: "",
              placeholder:"",
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

</script>

<style scoped lang="scss">
@import "/@/styles/dialog/dialog.scss";
</style>
