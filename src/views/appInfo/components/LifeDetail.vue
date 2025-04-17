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
} from "/@/api/appinfo/LifeDetailApi";
import { selectListByUuid,baseUrl } from "/@/api/fileApi";
import Utils from "~/src/utils/base64";


let baseUtil = new Utils();
const emits = defineEmits(["getData"]);
defineComponent({
  name: "LifeDetail",
});

const detailVisible = defineModel<boolean>("detailVisible");
const detailList = defineModel<DialogProps | any>("detailList");

// 获取文件列表
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
watch(detailVisible, async (newValue, b) => {
  if (newValue) {
    detailsTitle.value.map(async (key: any) => {
      if (key.type == "checkbox" || key.type == "radio" || key.type == "select") {
        debugger;
         // 获得下拉框数据
         let arr=[]
            if(key.name=="ischeck"||key.name=="isdel"){
                let tempSelectData=[{label:"否",value:0},{label:"是",value:1}]
                for(let i=0;i<tempSelectData.length;i++){
                  arr.push({
                    label:tempSelectData[i].label,
                    value:tempSelectData[i].value
                  })
                }
            }
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
      else{
        key.value = res.data[key.name];
        if (key.type == "file" || key.type == "img" || key.type == "video") {
          getFileList(key,res.data["fileindexs"]);
        }
      }
      });
    } else {
      ElMessage.error(res.msg);
    }
  }
  console.log("detailsTitle"+detailsTitle.value);
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
      title: "发布人:",
              name: "nickname",
              type: "text",
              value: "",
              placeholder:"请输入发布人",
    },
    {
      title: "发布时间:",
              name: "addtime",
              type: "time",
              dataType: "datetime",
              date: "",
              time: "",
              format: "YYYY-MM-DD HH:mm:ss",
              placeholder:"请选择发布时间",
    },
    {
      title: "发布内容:",
              name: "scontent",
              type: "text",
              value: "",
              placeholder:"请输入发布内容",
    },
    {
      title: "图片:",
              name: "fileindexs",
              type: "img",
              value: "",
              fileList: [],
                file: "$column.fileformat",
    },
    {
      title: "点赞数量:",
              name: "likes",
              type: "text",
              value: "",
              placeholder:"请输入点赞数量",
    },
    {
      title: "评论数量:",
              name: "comments",
              type: "text",
              value: "",
              placeholder:"请输入评论数量",
    },
    {
      title: "审核状态:",
              name: "ischeck",
              type: "select",
              options: [],
              value: "",
              placeholder:"请选择审核 1-审核通过 0-未审核 2-审核不通过",
    },
    {
      title: "删除状态",
              name: "isdel",
              type: "select",
              options: [],
              value: "",
              placeholder:"请输入删除标识 0-未删除 1-已删除",
    }
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
