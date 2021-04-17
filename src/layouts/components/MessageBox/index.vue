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
          <div class="wrap-pane">
            <InformList :data="data.mention || []"></InformList>
            <div v-if="!(data.mention && data.mention.length)" class="no-message-tip">
              <i class="iconfont icon-xiaoxi"></i>
              你已查看所有@我
            </div>
          </div>
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
            <div v-if="!(data.inform && data.inform.length)" class="no-message-tip">
              <i class="iconfont icon-tongzhi"></i>
              你已查看所有通知
            </div>
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
          <div class="wrap-pane">
            <div v-if="!(data.personal && data.personal.length)" class="no-message-tip">
              <i class="iconfont icon-icon--"></i>
              你已查看所有私信
            </div>
          </div>
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
  import { dateHumanizeFormat } from '@/utils';

  export default {
    name: 'MessageBox',
    components: {
      InformList,
    },
    mixins: [mixin],
    data() {
      return {
        activeName: 'inform',
        dataList: [],
        count: 0,
      };
    },
    computed: {
      ...mapState('user', ['userInfo']),
      data() {
        return this.$baseLodash.groupBy(this.dataList, 'type') || {};
      },
    },
    watch: {
      count(newValue, oldValue) {
        this.$emit('getCount', newValue);
      },
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'create:message': {
            const existing = this.dataList?.find(item => item.id === params.id);
            // 如果不存在，则添加
            if (!existing) {
              this.dataList?.push(params);
              this.dataList = this.$baseLodash.reverse(this.$baseLodash.sortBy(this.dataList, 'id'));
              this.dataListFilter();
              this.count++;
            }
            break;
          }
          case 'update:message':
            this.dataList.forEach(item => {
              if (item.id === params.id) {
                // 如果需要更新的item的已读状态重0改为1，则将总信息数减一
                if (item.is_read === 0 && params.is_read === 1) {
                  this.count--;
                }
                Object.assign(item, params);
              }
            });
            this.dataListFilter();
            break;
          // case 'delete:message':
          //   this.dataList = this.dataList?.filter(item => item.id !== params.id);
          //   break;
          default:
            break;
        }
      },
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
        } = await getList({
          receiver_id: this.userInfo.id,
          prop_order: 'id',
          order: 'desc',
          is_read: 0,
        });
        this.dataList = rows;
        this.count = count;
        this.dataListFilter();
      },
      dataListFilter() {
        this.dataList = this.dataList.filter(item => {
          item.created_at = this.$baseDayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss');
          item.created_at_humanize = dateHumanizeFormat(item.created_at).value;
          return item.is_read === 0;
        });
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
        color: $colorLight3;
        overflow: auto;
        .no-message-tip {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: $colorLight;
          height: 300px;
          line-height: 50px;
          .iconfont {
            font-size: 50px;
          }
        }
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
