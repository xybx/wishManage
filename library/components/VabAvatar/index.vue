<template>
  <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" :src="avatar" />
      <div class="username">
        <span class="hidden-xs-only">{{ username }}</span>
        <vab-icon
          class="vab-dropdown"
          :class="{ 'vab-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item command="userinfo">
          <vab-icon icon="user-3-line" />
          <span>{{ translate("个人信息") }}</span>
        </el-dropdown-item>
        <el-dropdown-item command="editpwd">
          <vab-icon icon="edit-circle-line" />
          <span>{{ translate("修改密码") }}</span>
        </el-dropdown-item> -->
        <el-dropdown-item command="logout">
          <vab-icon icon="logout-circle-r-line" />
          <span>{{ translate("退出登录") }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { translate } from "/@/i18n";
import { useUserStore } from "/@/store/modules/user";
import { toLoginRoute } from "/@/utils/routes";

defineOptions({
  name: "VabAvatar",
});

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { avatar, username } = storeToRefs(userStore);
const { logout } = userStore;
const active = ref<boolean>(false);
const emits = defineEmits<{ getUser: any; getPass: any }>();

const handleVisibleChange = (value: boolean) => {
  active.value = value;
};
const handleCommand = async (command: any) => {
  switch (command) {
    case "logout": {
      await logout();
      await router.push(toLoginRoute(route.fullPath));
      break;
    }
    case "userinfo":
      emits("getUser");
      break;
    case "editpwd":
      emits("getPass");
      break;
  }
};
</script>

<style lang="scss" scoped>
.avatar-dropdown {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;

  .user-avatar {
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    padding: 8px;
    margin-left: 15px;
    cursor: pointer;
    border-radius: 50%;
  }

  .username {
    position: relative;
    display: flex;
    align-content: center;
    align-items: center;
    width: max-content;
    height: 40px;
    margin-left: 6px;
    line-height: 40px;
    cursor: pointer;

    [class*="ri-"] {
      margin-left: 0 !important;
    }
  }
}
</style>
