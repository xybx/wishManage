<template>
  <vab-query-form>
    <vab-query-form-top-panel>
      <el-form
        inline
        :label-width="labelwidth"
        :model="queryForm"
        @submit.prevent
      >
        <template v-if="queryList1 && queryList1.length > 0">
          <template v-for="items in queryList1.slice(0, 1)">
            <component
              v-for="(item,index) in items as any[]"
              :key="index"
              :is="item.parentEleTag"
              v-bind="item.parentOptions"
            >
              <component
                :is="item.curEleTag"
                v-model="queryForm[item.bindVal]"
                v-bind="item.curOptions"
              >
                <template v-if="item?.childEleTag">
                  <component
                    v-for="(val, keys) in item.childOptions"
                    :key="keys"
                    :is="item.childEleTag"
                    :label="val.label"
                    :value="val.value"
                  ></component>
                </template>
              </component>
            </component>
          </template>
          <template v-for="items in queryList1.slice(1, queryList1.length)">
            <div class="overrow" v-if="!fold">
              <component
                v-for="(item,index) in items as any[]"
                :key="index"
                :is="item.parentEleTag"
                v-bind="item.parentOptions"
              >
                <component
                  :is="item.curEleTag"
                  v-model="queryForm[item.bindVal]"
                  v-bind="item.curOptions"
                >
                  <template v-if="item?.childEleTag">
                    <component
                      v-for="(val, keys) in item.childOptions"
                      :key="keys"
                      :is="item.childEleTag"
                      :label="val.label"
                      :value="val.value"
                    ></component>
                  </template>
                </component>
              </component>
            </div>
          </template>
          <template v-if="queryList1.length > 1">
            <el-button
              class="hidden-xs-only"
              text
              type="primary"
              @click="handleFold"
            >
              <span v-if="fold">展开</span>
              <span v-else>合并</span>
              <vab-icon
                class="vab-dropdown"
                :class="{ 'vab-dropdown-active': fold }"
                icon="arrow-up-s-line"
              />
            </el-button>
          </template>
        </template>
      </el-form>
    </vab-query-form-top-panel>
  </vab-query-form>
</template>

<script setup lang="ts">
defineComponent({
  name: "queryRef",
});
const queryForm = defineModel<any>("queryForm");
const fold = ref<boolean>(true);
const labelwidth = defineModel<string>("labelwidth");
const props = defineProps<{ queryData: any[] | [] }>();

const getQueryData = (array: any[], chunkSize: number) => {
  if (chunkSize <= 0 || !Array.isArray(array)) return [];
  const chunks = [];
  let index = 0;
  for (let i = 0; i < Math.ceil(array.length / chunkSize); i++) {
    chunks[i] = array.slice(index, index + chunkSize);
    index += chunkSize;
  }

  return chunks;
};

const queryList1 = computed(() => {
  return getQueryData(props.queryData, 4);
});

// 展开合并事件
const handleFold = () => {
  fold.value = !fold.value;
};

</script>

<style scoped lang="scss">
@use "/@/styles/query/query.scss";
</style>
