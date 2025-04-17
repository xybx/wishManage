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
          <template v-if="item.dp_type == 'text'" >
            <el-input
              v-model="form[item.dp_name]"
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
          <!-- 文本域 -->
          <template v-if="item.dp_type == 'textArea'">
            <el-input
              v-model="form[item.dp_name]"
              type="textarea"
              :placeholder="item.dp_dp_placeholder"
            />
          </template>
          <template v-if="item.dp_type == 'editor'">
          <Toolbar
            class="editor-tool"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
          />
          <Editor
            class="editor-box"
            v-model="form[item.dp_name]"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"
            @customPaste="customPaste"
          />
        </template>
         
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save" @click="save(formRef)"
            >发送</el-button
          >
          <el-button type="primary" plain @click="handleClose">关闭</el-button>
        </el-form-item>
      </el-form>
    </component>
    <!-- </el-dialog> -->
  </template>
  
  <script setup lang="ts">
  import {ElMessage, ElMessageBox, FormRules,ElLoading  } from "element-plus";
  import type { DialogProps } from "/@/types/listTypes";
  import {allReplyActivityMessage
  } from "/@/api/appinfo/WishreplyDialogApi";
  import {UploadFile, selectListByUuid, deleteFile, delByUuids, baseUrl
  } from "/@/api/fileApi";
  import type {IDomEditor} from '@wangeditor/editor'
  import {Editor,Toolbar} from '@wangeditor/editor-for-vue'
  import '@wangeditor/editor/dist/css/style.css'
  const emits = defineEmits(["getData"]);
  defineComponent({
    name: "WishreplyDialog",
  });
  const formRef = ref();
  const form: any = reactive({});
  
  
  
  const dialogVisible = defineModel<boolean>("noticedialogVisible");
  const dialogList = defineModel<DialogProps | any>("noticedialogList");
    const editorRef = shallowRef<IDomEditor | undefined>();
// 内容 HTML
const toolbarConfig = {
  toolbarKeys: [
    "headerSelect",
    "bold",
    "italic",
    "underline",
    "through",
    "color",
    "bgColor",
    "insertLink",
    "bulletedList",
    {
      key: "group-justify",
      title: "对齐",
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
      menuKeys: [
        "justifyLeft",
        "justifyRight",
        "justifyCenter",
        "justifyJustify",
      ],
    },
    "blockquote",
    "emotion",
    // "uploadImage",
    // "insertTable",
    // {
    //   key: "group-more-style",
    //   title: "更多",
    //   iconSvg:
    //     '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
    //   menuKeys: ["codeBlock", "code", "clearStyle"],
    // },
    "undo",
    "redo",
  ],
};
//自定义粘贴中带图片
const customPaste = (editor:IDomEditor, event:any, callback:any) => {
  let html = event.clipboardData.getData("text/html");
  // TODO:可以将粘贴的图片进行保存
  //let srcArray = html.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/g);
  //let urlArray = []
  // if(srcArray){
  //   srcArray.map(item=>{
  //     urlArray.push(item.match(/src=['"]([^'"]+)/)[1])
  //   })
  // }
  editor.dangerouslyInsertHtml(html);
  // 返回 false ，阻止默认粘贴行为
  event.preventDefault();
  callback(true);
};

const editorConfig = reactive<any>({
  placeholder: "请输入正文...",
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      // fieldName: 'file',
      // base64LimitSize: 10 * 1024 * 1024, // 10M 以下插入 base64
      // server: '/api/common/uploadFile', // 自定义的接口地址
      // headers: {
      //     'Content-Type': 'multipart/form-data',
      //     'Authorization': getToken()
      // },
      // 跨域是否传递 cookie ，默认为 false
      withCredentials: true,
      // customUpload: UploadImage
    },
  },
});


const handleCreated = (editor:IDomEditor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

  
  // 监听获得弹出框内容
  let type = ref("add");
  let userid="";
  watch(dialogVisible, async (newValue, b) => {
    if (newValue) {
      getDialog();
      debugger;
      type.value = dialogList.value.modeType;
      userid=dialogList.value.subData;
      detailsTitle.value.map(async (key: any) => {
        if (key.dp_type == "checkbox" || key.dp_type == "radio" || key.dp_type == "select") {
          // 获得下拉框数据
          let arr=[]
              if(key.dp_name=="stype"){
                  let tempSelectData=[{label:"否",value:0},{label:"是",value:1}]
                  for(let i=0;i<tempSelectData.length;i++){
                    arr.push({
                      label:tempSelectData[i].label,
                      value:tempSelectData[i].value
                    })
                  }
              }
          key.dp_options = arr;
        }
      });
      form['url']='?action=tzxx&pid=';
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
            dp_title: "接收人:",
            dp_name: "userid",
            userid: "",
            dp_type: "text",
            dp_placeholder:"请输入接收人，无接收人，发送给所有人",
        },
        {
            dp_title: "通知链接:",
            dp_name: "url",
            url: "?action=tzxx&pid=",
            dp_type: "text",
            dp_placeholder:"通知链接格式?action=tzxx&pid=*",
        },
        {
        dp_title: "通知内容:",
        dp_name: "scontent",
          scontent: "",
          dp_type: "textArea",
          dp_placeholder:"请输入通知内容",
      }
  ]);
  
  const rules = reactive<FormRules>({
  });
  
  // 保存
  const save = async (formEl: any) => {
    await formEl.validate(async (valid: any, fields: any) => {
      debugger;
      if (valid) {
        let loadingInstance1 = ElLoading.service({ fullscreen: true });
        // 编辑
        //form.userid = userid;
        form.stype = '文本';
        form.title='通知消息'
          await allReplyActivityMessage(form)
            .then((result: any) => {
              if (result.code == 200) {
                ElMessage.success("通知发送成功");
                loadingInstance1.close();
              }
              else
              {
                loadingInstance1.close();
                ElMessage.error(result.msg);
              }
            })
            .catch((err) => {
              loadingInstance1.close();
            });
      } else {
        ElMessage.error("请输入必填项");
      }
    });
  };
  // 关闭
  const handleClose = () => {
    ElMessageBox.confirm("编辑的内容未保存，确定要关闭页面吗？").then(
      async () => {
      debugger;
        formRef.value.clearValidate();
        clearForm();
        dialogVisible.value = false;
      },
      () => {
        ElMessage.info("取消关闭");
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
  