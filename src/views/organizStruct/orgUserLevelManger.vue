<template>
  <div>
<el-card class="box-card">
  <el-container>
    <el-main>
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        v-loading="treeLoading"
        :expand-on-click-node="false"
        :default-checked-keys="[defaultChecked]"
      >
        <template #default="{ node, data }">
          <div class="custom-tree-node">
            <div class="label" @click="handleNodeClick(data)">
              {{ node.label }}
            </div>
            <div>
              <a @click="addorg(data)" style="color: #4484E8;"> 新增 </a>
              <a @click="editorg(data)" style="color: #4484E8;"> 编辑 </a>
              <a @click="delorg(data)" style="color: #E32E2E;"> 删除 </a>
            </div>
          </div>
        </template>
      </el-tree>
    </el-main>
  </el-container>
</el-card>
<DeptDialog
  v-model:dialogVisible="dialogVisible"
  @getDept="getDeptTree"
  v-model:dialogList="dialogList"
/>
  </div>
</template>

<script lang="ts" setup>
import { ref , onMounted } from "vue" 
import DeptDialog from "./components/orgUserLevelManger/addLevel.vue";
import type {
DialogProps,
} from "/@/types/appinfo/AppAssignTypes.ts";
import {
  getUserGradeTreeApi,
delDeptApi,
} from "/@/api/organizStruct/orgLevelApi.ts";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";


const treeLoading = ref<boolean>(true);


const customNodeClass = (data: any, node: Node) => {
if (data.isPenultimate) {
  return "is-penultimate";
}
return null;
};

const treeData: any = ref([]);
const defaultProps: any = {
children: "children",
label: "label",
class: customNodeClass,
};

let defaultChecked = "";
const depts: any = [];
// 获得部门信息
const getDeptTree = async () => {
await getUserGradeTreeApi({})
  .then((result: any) => {
    if (result.code == 200) {
      treeData.value = result.data;
      depts[0] = {
        deptname: result.data[0].label,
        pid: result.data[0].id,
      };

      defaultChecked = result.data[0].id;

      treeData.value[0].isPenultimate = true;
      treeLoading.value = false;
    }
  })
  .catch((err) => {
    treeData.value = [];
    treeLoading.value = false;
  });
};

const handleNodeClick = async (data: any) => {
console.log(data);
clearHightlight(treeData.value);
data.isPenultimate = true;
defaultChecked = data.id;
};
// 清除高亮
const clearHightlight = (data: any) => {
data.map((item: any) => {
  item.isPenultimate = false;
  if (item.children.length === 0) {
    return false;
  } else {
    clearHightlight(item.children);
  }
});
};


// 新增部门
const dialogVisible = ref<boolean>(false);
const dialogList = ref<DialogProps>({});
// 新增
const addorg = (data: any) => {
dialogVisible.value = true;
dialogList.value.modeType = "add";
dialogList.value.title = "新增";
dialogList.value.pid = data.id;
};
// 编辑
const editorg = (data: any) => {
dialogVisible.value = true;
dialogList.value.modeType = "edit";
dialogList.value.title = "编辑";
dialogList.value.pid = data.id;
};
// 删除
const delorg = (data: any) => {
ElMessageBox.confirm("确定要删除该级别吗？", "级别删除", {
  confirmButtonText: "确定",
  cancelButtonText: "取消",
  type: "warning",
})
  .then(async () => {
    let loadingInstance1 = ElLoading.service({ fullscreen: true });
    await delDeptApi({ pid: data.id })
      .then((result: any) => {
        if (result.code == 200) {
          loadingInstance1.close();
          getDeptTree();
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        }
      })
      .catch((err) => {
        loadingInstance1.close();
      });
  })
  .catch(() => {
    ElMessage({
      type: "info",
      message: "取消删除",
    });
  });
};



//生命周期hooks
onMounted(async () => {
await getDeptTree();
});

</script>


<style scoped lang="scss">
@use "/@/styles/base/base.scss";
</style>
<style scoped lang="scss">
.el-aside {
border-right: 1px solid gainsboro;
}
:deep(.el-tree) {
.is-penultimate > .el-tree-node__content .label {
  color: #409eff;
}

margin-top: 20px;
.el-tree-node__expand-icon {
  font-size: 0.9vw;
}
.custom-tree-node {
  display: flex;
  .label {
    &:hover {
      color: #409eff;
    }
  }

  a {
    margin-left: 8px;
    color: #606266;
    &:hover {
      color: #409eff;
    }
  }
}
}
</style>
