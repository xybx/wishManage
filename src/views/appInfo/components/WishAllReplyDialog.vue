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
  const emits = defineEmits(["getData"]);
  defineComponent({
    name: "WishreplyDialog",
  });
  const formRef = ref();
  const form: any = reactive({});
  
  
  
  const dialogVisible = defineModel<boolean>("dialogVisible");
  const dialogList = defineModel<DialogProps | any>("dialogList");
  
  
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
      form['url']='抽奖活动格式?action=cjhd&pid=  官方活动格式?action=gfhd&pid=  ';
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
            dp_title: "活动链接:",
            dp_name: "url",
            url: "抽奖活动格式?action=cjhd&pid=  官方活动格式?action=gfhd&pid=  ",
            dp_type: "text",
            dp_placeholder:"抽奖活动格式?action=cjhd&pid=  官方活动格式?action=gfhd&pid=  ",
        },
        {
        dp_title: "活动内容:",
        dp_name: "scontent",
          scontent: "",
          dp_type: "textArea",
          dp_placeholder:"请输入活动内容",
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
        form.title='活动消息'
          await allReplyActivityMessage(form)
            .then((result: any) => {
              if (result.code == 200) {
                ElMessage.success("消息回复成功");
                loadingInstance1.close();
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
  