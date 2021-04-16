<template>
  <el-popover
    placement="top-start"
    title=""
    width="360"
    :offset="-190"
    trigger="click"
    popper-class="message-box-popover"
    :open-delay="200"
  >
    <div class="message-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="@我" name="mention">
          <template slot="label">
            <el-badge
              :hidden="!(data.mention && data.mention.length)"
              :value="data.mention && data.mention.length"
              class="item"
              >@我
            </el-badge>
          </template>
          <div class="wrap-pane">@我</div>
        </el-tab-pane>
        <el-tab-pane label="通知" name="inform">
          <template slot="label">
            <el-badge
              :hidden="!(data.inform && data.inform.length)"
              :value="data.inform && data.inform.length"
              class="item"
              >通知
            </el-badge>
          </template>
          <div class="wrap-pane">
            <InformList :data="data.inform || []"></InformList>
          </div>
        </el-tab-pane>
        <el-tab-pane label="私信" name="personal">
          <template slot="label">
            <el-badge
              :hidden="!(data.personal && data.personal.length)"
              :value="data.personal && data.personal.length"
              class="item"
              >私信
            </el-badge>
          </template>
          <div class="wrap-pane"> 私信</div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>

<script>
  import mixin from '@/mixins';
  import { getList } from '@/api/messageManagement';
  import InformList from './components/InformList';
  import { mapState } from 'vuex';

  export default {
    name: 'MessageBox',
    components: {
      InformList,
    },
    mixins: [mixin],
    data() {
      return {
        activeName: 'inform',
        data: {},
        count: 0,
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
    },
    created() {
      this.getList();
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      async getList() {
        const {
          data: { rows, count },
        } = await getList({ receiver_id: this.userInfo.id });
        console.log(rows);
        console.log(count);
        console.log(this.$baseLodash.groupBy(rows, 'type'));
        this.data = this.$baseLodash.groupBy(rows, 'type');
        this.count = count;
        this.$emit('getCount', count);
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
        min-height: 300px;
        max-height: 500px;
        color: $color333;
        overflow: auto;
      }
      .el-badge__content.is-fixed {
        top: 12px !important;
      }
      .el-tabs__header {
        margin: 0;
      }
    }
  }
</style>
