<template>
  <component :is="dialogList?.parentEleTag" v-bind="dialogList?.parentOptions">
    <template v-if="modeType =='pass'">
      <el-form ref="formDataRef" :model="formData" label-width="auto" :rules="rules" label-position="left">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input type="password" v-model="formData.oldPassword" placeholder="请输入原密码" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="formData.newPassword" placeholder="请输入新密码" show-password />
          <span style="color:red">(注：密码必须为8-20位字母和数字的组合)</span>
        </el-form-item>
        <el-form-item label="确认密码" prop="surePassword">
          <el-input type="password" v-model="formData.surePassword" placeholder="请输入确认密码" show-password />
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <div class="lookForm">
        <div class="item" v-for="item in detailsTitle">
          <div class="label">{{ item.title }}</div>
          <div class="value">{{ !item.value ? "暂无" : item.value }}</div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer" style="margin-bottom:25px">
        <el-button v-if="modeType =='pass'" size="large" type="primary" @click="saveData(formDataRef)">保 存</el-button>
        <el-button size="large" @click="handleClose">关 闭</el-button>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
import {ElLoading, ElMessage, ElMessageBox, FormRules,FormInstance} from "element-plus";
import type {DialogProps} from "/@/types/listTypes.ts";
import {getUserData, putEditPass} from "/@/api/user.ts";
import {isPassword} from "/@/utils/validate.ts";
import {useUserStore} from "/@/store/modules/user.ts";
import {toLoginRoute} from "/@/utils/routes.ts";

  defineOptions({
    name: 'VabOther',
  })
  const dialogVisible = defineModel<boolean>("dialogVisible");
  const dialogList = defineModel<DialogProps | any>("dialogList");
  const title = ref<string>('')
  let formData = reactive<any>({})
  const formDataRef = ref<FormInstance>()
  const modeType = ref<string>('');
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const { logout } = userStore;

  watch(dialogVisible,async (newValue,e)=>{
    if(newValue){
      console.log(newValue)
      getDialog()
      modeType.value = dialogList.value.modeType
      let res = (await getUserData()) as any;
      if(res.code == 200){
        detailsTitle.value.map((key: any) => {
          key.value = res.data[key.name];
        });
      }else {
        ElMessage.error(res.msg);
      }
    }
  })

const detailsTitle = ref<any>([
  {
    title: "姓名:",
    name: "truename",
    type: "text",
    value: "",
  },
  {
    title: "简称:",
    name: "shortname",
    type: "text",
    value: "",
  },
  {
    title: "手机号码:",
    name: "phonenumber",
    type: "text",
    value: "",
  },
  {
    title: "简介:",
    name: "remark",
    type: "text",
    value: "",
  },
  {
    title: "所在部门:",
    name: "deptname",
    type: "text",
    value: "",
  },
]);

const getDialog = () => {
  // 标签名
  dialogList.value.parentEleTag = "el-dialog";
  // 属性
  dialogList.value.parentOptions = {
    modelValue: dialogVisible,
    title: dialogList.value?.title,
    width: "32%",
    class: "dialogbox",
    "close-on-click-modal": false,
    appendToBody: true,
    "align-Center": true,
    center: true,
    "before-close": handleClose,
  };
}

  const validatePassword = (rule: any, value: any, callback: any) => {
    if (!isPassword(value)) {
      callback("密码为8-20位字母和数字的组合");
    } else {
      callback();
    }
  }

  const validateSurePass = (rule: any, value: any, callback: any)=>{
    if(value !== formData.newPassword){
      callback("两次密码输入不一致");
    }else {
      callback();
    }
  }

  const rules = reactive<FormRules>({
    oldPassword:[{required: true, message: "请输入原密码", trigger: "blur"}],
    newPassword:[{required: true, message: "请输入新密码", trigger: "blur"},{ trigger: "blur", validator: validatePassword }],
    surePassword:[{required: true, message: "请输入确认密码", trigger: "blur"},{trigger: "blur", validator: validateSurePass}]
  })

  const saveData = async (formEl:any)=>{
    if(!formEl) return
    await formEl.validate(async(valid: boolean, fields: any)=>{
      if(valid){
        console.log(valid)
        let loadingInstance1 = ElLoading.service({ fullscreen: true });
        let params = Object.assign({},formData)
        delete params.surePassword
        let res = (await putEditPass(params).catch((err) => {loadingInstance1.close()})) as any
        if(res.code == 200){
          loadingInstance1.close();
          ElMessage.success("密码修改成功");
          formData = {}
          dialogVisible.value = false;
          await logout();
          await router.push(toLoginRoute(route.fullPath));
        }
      }else {
        ElMessage.error("请输入必填项");
      }
    })
  }

  const handleClose = ()=>{
    if(modeType.value == 'pass'){
      ElMessageBox.confirm("编辑的内容未保存，确定要关闭页面吗？").then(
        async () => {
          formDataRef.value!.resetFields();
          formData = {}
          dialogVisible.value = false;
        }, () => {
          ElMessage.info("取消删除");
        }
      )
    }else {
      clearData()
      dialogVisible.value = false;
    }
  }

const clearData = ()=>{
  for (let i = 0; i < detailsTitle.value.length; i++) {
    const item = detailsTitle.value[i];
    item.value = "";
  }
}


</script>

<style scoped lang="scss">

</style>
