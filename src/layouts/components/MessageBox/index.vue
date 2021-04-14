<template>
  <el-popover
    placement="top-start"
    title=""
    width="330"
    :offset="-160"
    trigger="hover"
    popper-class="message-box-popover"
    :open-delay="200"
  >
    <div class="message-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="@我" name="first">
          <div class="wrap-pane"> @我 </div>
        </el-tab-pane>
        <el-tab-pane label="通知" name="second">
          <div class="wrap-pane"> 通知 </div>
        </el-tab-pane>
        <el-tab-pane label="私信" name="third">
          <div class="wrap-pane"> 私信 </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>

<script>
  import mixin from '@/mixins';

  export default {
    name: 'MessageBox',
    components: {},
    mixins: [mixin],
    data() {
      return {
        activeName: 'second',
      };
    },
    created() {},
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
    },
  };
</script>

<style lang="scss">
  .message-box-popover {
    padding: 0 !important;
    .message-box {
      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;
      }
      .wrap-pane {
        padding: 0 10px;
        min-height: 300px;
      }
    }
  }
</style>
