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
} from "/@/api/appinfo/ProductDetailApi";
import { selectListByUuid,baseUrl } from "/@/api/fileApi";
import Utils from "~/src/utils/base64";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "ProductDetail",
});

const detailVisible = defineModel<boolean>("detailVisible");
const detailList = defineModel<DialogProps | any>("detailList");
let baseUtil = new Utils();
// 获取文件列表
async function getFileList(item: any,simgs: any) {
  // 获得文件列表
  
   // 获得文件列表
   let result = simgs.split(',');
  if (result.length>0) {
    console.log(result);
    // let arr = result.data.reverse();
    item.fileList = [];
    for (let i = 0; i < result.length; i++) {
      const element =result[i] ;
      if(result[i]!="")
    {
      item.fileList.push({pid:element, url: baseUrl + element });
    }
      
    }

    console.log(item.fileList);
  }
}

// 监听获得弹出框内容
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
          getFileList(key,res.data["imgs"]);
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
      title: "名称:",
              name: "sname",
              type: "text",
              value: "",
              placeholder:"请输入名称",
    },
    {
      title: "兑换数量:",
              name: "exchangenum",
              type: "text",
              value: "",
              placeholder:"请输入兑换数量",
    },
    {
      title: "价格:",
              name: "price",
              type: "text",
              value: "",
              placeholder:"请输入价格",
    },
    {
      title: "截止兑换时间:",
              name: "endtime",
              type: "time",
              dataType: "datetime",
              date: "",
              time: "",
              format: "YYYY-MM-DD HH:mm:ss",
              placeholder:"请选择截止兑换时间",
    },
    {
      title: "领取方式:",
              name: "getway",
              type: "textArea",
              value: "",
              placeholder:"请输入领取方式",
    },
    {
      title: "图片:",
              name: "imgs",
              type: "img",
              value: "",
              fileList: [],
                file: "$column.fileformat",
    },
    {
      title: "简介:",
              name: "scontent",
              type: "textArea",
              value: "",
              placeholder:"请输入简介",
    },
    {
      title: "添加时间:",
              name: "addtime",
              type: "time",
              dataType: "datetime",
              date: "",
              time: "",
              format: "YYYY-MM-DD HH:mm:ss",
              placeholder:"请选择添加时间",
    },
    {
      title: "添加人:",
              name: "adduser",
              type: "text",
              value: "",
              placeholder:"请输入添加人",
    },
    {
      title: "更新时间:",
              name: "updatetime",
              type: "time",
              dataType: "datetime",
              date: "",
              time: "",
              format: "YYYY-MM-DD HH:mm:ss",
              placeholder:"请选择更新时间",
    },
    {
      title: "更新人:",
              name: "updateuser",
              type: "text",
              value: "",
              placeholder:"请输入更新人",
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
