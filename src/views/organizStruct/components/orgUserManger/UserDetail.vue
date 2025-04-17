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
            {{ item.value.length == 0 ? "暂无" : "" }}
            <el-image
                
                :src="item.value"
                :zoom-rate="1.2"
                :max-scale="7"
                :min-scale="0.2"
                :preview-src-list="[item.value]"
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
} from "/@/api/organizStruct/UserDetailApi";
import { selectListByUuid,baseUrl } from "/@/api/fileApi";

const emits = defineEmits(["getData"]);
defineComponent({
  name: "UserDetail",
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
      title: "头像:",
              name: "headpic",
              type: "img",
              value: "",
              placeholder:"请输入头像",
    },
    {
      title: "昵称:",
              name: "nickname",
              type: "text",
              value: "",
              placeholder:"请输入昵称",
    }, 
    {
      title: "心愿力:",
              name: "wishpower",
              type: "text",
              value: "",
              placeholder:"请输入心愿力",
    },
    {
      title: "城市:",
              name: "city",
              type: "text",
              value: "",
              placeholder:"请输入城市",
    },
    {
      title: "省份:",
              name: "province",
              type: "text",
              value: "",
              placeholder:"请输入省份",
    },
    {
      title: "手机号:",
              name: "phonenumber",
              type: "text",
              value: "",
              placeholder:"请输入手机号",
    },
    {
      title: "openid:",
              name: "openid",
              type: "text",
              value: "",
              placeholder:"请输入openid",
    },
    
    {
      title: "登录ip:",
              name: "loginip",
              type: "text",
              value: "",
              placeholder:"请输入登录ip",
    },
    {
      title: "登录时间:",
              name: "logindate",
              type: "date",
              dataType: "date",
              date: "",
              time: "",
              format: "YYYY-MM-DD",
              placeholder:"请选择登录时间",
    },
    {
      title: "登录地点:",
              name: "loginaddress",
              type: "text",
              value: "",
              placeholder:"请输入登录地点",
    },
    {
      title: "头像存储id:",
              name: "headpicmid",
              type: "text",
              value: "",
              placeholder:"请输入头像存储id",
    },
    
    {
      title: "创建时间:",
              name: "createdtime",
              type: "date",
              dataType: "date",
              date: "",
              time: "",
              format: "YYYY-MM-DD",
              placeholder:"请选择创建时间",
    },
    {
      title: "创建人:",
              name: "createdby",
              type: "text",
              value: "",
              placeholder:"请输入创建人",
    },
    
    {
      title: "更新时间:",
              name: "updatedtime",
              type: "date",
              dataType: "date",
              date: "",
              time: "",
              format: "YYYY-MM-DD",
              placeholder:"请选择更新时间",
    },
    {
      title: "更新人:",
              name: "updatedby",
              type: "text",
              value: "",
              placeholder:"请输入更新人",
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
