<template>
  <div class="list-group-item" :class="[{ 'list-group-item-done': element.is_done === 1 }]">
    <div class="state">
      <el-tooltip :content="element.state && element.state.name" :open-delay="600" placement="top">
        <i
          :class="element.state && element.state.icon"
          :style="`color: ${element.state && element.state.color};font-size: 18px;`"
        ></i>
      </el-tooltip>
    </div>
    <div class="wrap-done">
      <el-button
        type="text"
        :disabled="!isCurrentProjectMember || !$checkPermission(taskPermissions.doEdit)"
        @click.stop="changeDoneState(element)"
      >
        <i :class="`iconfont ${element.is_done === 1 ? 'icon-xuanzhong2' : 'icon-fangxing1'}`"></i>
      </el-button>
    </div>
    <div class="content">
      <div class="name">{{ element.name }}</div>
      <div class="info">
        <span
          v-if="element.date_tip && element.is_done !== 1"
          class="info-item task-date"
          :class="element.date_tip_class"
        >
          {{ element.date_tip }}
        </span>
        <el-tooltip v-if="element.type" :content="element.type.name" :open-delay="600" placement="top">
          <i class="info-item" :class="element.type.icon" :style="`color: ${element.type.color};`"></i>
        </el-tooltip>
        <i v-if="element.remark" class="info-item el-icon-document color-light"></i>
        <span v-if="element.likers && element.likers.length" class="info-item color-light">
          <i class="iconfont icon-zan" style="font-size: 14px"></i>
          <span style="padding-left: 5px; font-size: 12px">{{ element.likers.length }}</span>
        </span>
      </div>
    </div>
    <div class="executor">
      <el-tooltip v-if="element.executor" :content="element.executor.username" :open-delay="600" placement="top">
        <BImage
          class="user-avatar"
          :src="element.executor.avatar || ''"
          :width="26"
          :height="26"
          :borderRadius="26"
        ></BImage>
      </el-tooltip>
    </div>
    <div class="task-priority" :style="`background-color: ${element.priority && element.priority.color};`"></div>
  </div>
</template>

<script>
  import { doEdit, permissions as taskPermissions } from '@/api/taskManagement';
  import { mapGetters } from 'vuex';
  import BImage from '@/components/B-image';

  export default {
    name: 'TaskDraggableItem',
    components: {
      BImage,
    },
    props: {
      element: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        taskPermissions,
      };
    },
    computed: {
      ...mapGetters('project', ['isCurrentProjectMember']),
    },
    created() {},
    watch: {
      element: {
        handler: function (val, oldVal) {
          this.$forceUpdate();
        },
        deep: true,
      },
    },
    methods: {
      async changeDoneState(task) {
        task.is_done = task.is_done === 1 ? 0 : 1;
        await doEdit(task);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .list-group-item {
    position: relative;
    display: flex;
    width: 249px;
    min-height: 48px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 8px;
    overflow: hidden;
    cursor: pointer;
    padding: 10px;

    .state {
      position: absolute;
      bottom: 5px;
      right: 5px;
    }

    .wrap-done {
      width: 18px;
      padding: 0 4px;

      .iconfont {
        font-size: 18px;
        color: #969696;
      }

      .iconfont:hover {
        color: #414141;
      }

      ::v-deep {
        .el-button--small {
          padding: 0px;
        }
      }
    }

    .content {
      width: calc(259px - 77px);
      white-space: normal;
      word-break: break-all;
      padding-left: 5px;
      padding-right: 10px;

      .name {
        text-align: justify;
      }

      .info {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: 5px 0px;

        .info-item {
          font-size: 16px;
          margin-right: 6px;
          margin-bottom: 3px;
        }

        .task-date {
          line-height: 20px;
          font-size: 12px;
          background-color: #f7f7f7;
          padding: 0 6px;
          border-radius: 2px;
          white-space: nowrap;
        }

        .task-date-overdue {
          background-color: #e62412;
          color: #fff;
        }

        .task-date-intraday {
          background-color: #fa8c15;
          color: #fff;
        }

        .task-date-recently {
          background-color: #1b9aee;
          color: #fff;
        }

        .task-date-safety {
          background-color: #f7f7f7;
          color: #000;
        }
      }
    }

    .executor {
      width: 26px;
    }

    .task-priority {
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background-color: #2cc642;
      transition: width 200ms;
    }

    .task-state-success {
      filter: opacity(0.5);
    }
  }

  .list-group-item:hover {
    .task-priority {
      width: 8px;
    }
  }

  .list-group-item-done {
    .content,
    .executor,
    .task-priority,
    .state {
      filter: opacity(0.6);
    }

    .wrap-done {
      .iconfont {
        color: #ccc;
      }

      .iconfont:hover {
        color: #000000 !important;
      }
    }
  }

  .list-group-item-done:hover {
    .task-priority {
      width: 4px;
    }
  }
</style>
