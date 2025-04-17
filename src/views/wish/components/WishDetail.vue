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
} from "/@/api/wish/WishDetailApi";
import { selectListByUuid,baseUrl } from "/@/api/fileApi";
import Utils from "~/src/utils/base64";


let baseUtil = new Utils();
const emits = defineEmits(["getData"]);
defineComponent({
  name: "WishDetail",
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
      if (key.type == "checkbox" || key.type == "radio" || key.type == "select") {
        // 获得下拉框数据
        let arr=[]
        key.options = arr;
      }
    });

    let res = (await selectById({ pid: detailList.value?.pid })) as any;
    if (res.code == 200) {
      detailsTitle.value.map((key: any) => {
       
        key.value = res.data[key.name];
        if(key.name=="wishcontent")
      {
        key.value = baseUtil.base64_decode(res.data[key.name]);
        
      }
       else  
       {
       if(key.name=="wishtype")
        {
         if(key.value=="0")
         {
          key.value="为自己";
         }
         else{
          key.value="为他人";
         }
        }
        if(key.name=="receivereply"||key.name=="ownreply"||key.name=="complete"||key.name=="ispublic"||key.name=="receivestatue")
        {
          if(key.value=="0")
         {
          key.value="否";
         }
         else{
          key.value="是";
         }
        }
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
      title: "许愿人编号:",
              name: "pid",
              type: "text",
              value: "",
              placeholder:"许愿人编号",
    },
  {
      title: "许愿昵称:",
              name: "usernickname",
              type: "text",
              value: "",
              placeholder:"请输入许愿时的昵称",
    },
  {
      title: "许愿编号:",
              name: "wishnum",
              type: "text",
              value: "",
              placeholder:"请输入许愿编号",
    },
    {
      title: "许愿的ip:",
              name: "wiship",
              type: "text",
              value: "",
              placeholder:"请输入许愿的ip",
    },
    {
      title: "许愿的人所在位置:",
              name: "wishaddress",
              type: "text",
              value: "",
              placeholder:"请输入许愿的人所在位置",
    },
    {
      title: "许愿类型:",
              name: "wishtype",
              type: "text",
              value: "",
              placeholder:"请输入许愿类型 0-为自己  1-为他人",
    },
    {
      title: "许愿内容:",
              name: "wishcontent",
              type: "text",
              value: "",
              placeholder:"请输入许愿内容",
    },
    
  
    {
      title: "是否有新的他人回复:",
              name: "receivereply",
              type: "text",
              value: "",
              placeholder:"请输入是否有新的他人回复 0-无 1-有",
    },
    
    {
      title: "愿望接收状态:",
              name: "receivestatue",
              type: "text",
              value: "",
              placeholder:"请输入愿望接收状态 0-未接收 1-已接收",
    },
    {
      title: "是否有新的自己回复:",
              name: "ownreply",
              type: "text",
              value: "",
              placeholder:"请输入是否有新的自己回复 0-无 1-有",
    },
    {
      title: "愿望是否完成:",
              name: "complete",
              type: "text",
              value: "",
              placeholder:"请输入愿望是否完成 0-未完成 1-完成",
    },
    {
      title: "是否公开:",
              name: "ispublic",
              type: "text",
              value: "",
              placeholder:"请输入是否公开 1-公开 0-不公开",
    },
    {
      title: "助力次数:",
              name: "assist",
              type: "text",
              value: "",
              placeholder:"请输入助力次数",
    },
    {
      title: "许愿日期:",
              name: "wishtime",
              type: "time",
              dataType: "datetime",
              date: "",
              time: "",
              format: "YYYY-MM-DD HH:mm:ss",
              placeholder:"请选择许愿日期",
    },
     
    {
      title: "愿望接收人:",
              name: "receiveuserid",
              type: "text",
              value: "",
              placeholder:"请输入愿望接收人",
    },
    {
      title: "愿望接收人手机号:",
              name: "receivemobile",
              type: "text",
              value: "",
              placeholder:"请输入愿望接收人手机号",
    },
    {
      title: "愿望查看验证码:",
              name: "receivecode",
              type: "text",
              value: "",
              placeholder:"请输入愿望查看验证码",
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
