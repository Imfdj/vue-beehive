<template>
  <div class="task-log">
    <div class="wrap-log">
      <div class="wrap-filter">
        <el-dropdown trigger="click" @command="dropdownCommand">
          <span class="el-dropdown-link"> {{ typeName }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="type in types" :key="type.command" :command="type.command"
              >{{ type.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="log-list color-light">
        <div v-if="btnShowAllText" class="btn-more" @click="showSwitchClick">
          <i class="el-icon-more"></i> {{ btnShowAllText }}
        </div>
        <div v-for="log in dataListFilter" :key="log.id" class="item">
          <div class="info">
            <div>
              <i :class="['icon', log.icon]"></i>
              <span class="username-and-remark">{{ log.operator && log.operator.username }} {{ log.remark }}</span>
            </div>
            <span class="create-date">
              <el-tooltip class="item" effect="dark" :content="log.created_at" :enterable="false" placement="top">
                <div>{{ log.created_at_humanize }}</div>
              </el-tooltip>
            </span>
          </div>
          <div v-if="log.content" class="content" v-html="log.content"></div>
        </div>
        <div v-if="dataListFilter.length === 0" class="no-data">
          <i class="el-icon-plus"></i>
          暂无该类型动态
        </div>
      </div>
    </div>
    <div class="wrap-comment"></div>
  </div>
</template>

<script>
  import { getList } from '@/api/taskLogManagement';
  import { dateHumanizeFormat } from '@/utils';

  export default {
    name: 'TaskLog',
    props: {
      taskId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        dataList: [],
        showAll: false,
        is_comment: '',
        types: [
          {
            command: '',
            label: '所有动态',
          },
          {
            command: 1,
            label: '仅评论',
          },
          {
            command: 0,
            label: '仅动态',
          },
        ],
      };
    },
    computed: {
      dataListFilter() {
        return this.showAll
          ? this.dataList
          : this.dataList.filter((item, index) => {
              return index > this.dataList.length - 5 - 1;
            });
      },
      btnShowAllText() {
        if (this.dataList.length <= 5) {
          return false;
        }
        return this.showAll ? '隐藏较早的动态' : `显示较早的 ${this.dataList.length - 5} 条动态`;
      },
      typeName() {
        return this.types.find(type => {
          return type.command === this.is_comment;
        }).label;
      },
    },
    created() {},
    methods: {
      async getList() {
        const {
          data: { rows },
        } = await getList({
          task_id: this.taskId,
          is_comment: this.is_comment,
        });
        this.dataList = rows.map(log => {
          return {
            ...log,
            created_at_humanize: dateHumanizeFormat(log.created_at).value,
          };
        });
      },
      showSwitchClick() {
        this.showAll = !this.showAll;
      },
      dropdownCommand(command) {
        this.is_comment = command;
        this.getList();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .task-log {
    height: 100%;
    .wrap-log {
      height: calc(100vh - 300px);
      padding: 20px 0 20px 20px;
      /*background-color: #ccc;*/
      .wrap-filter {
        padding-bottom: 10px;
        .el-dropdown-link {
          cursor: pointer;
        }
        .el-dropdown-link:hover {
          color: #1b9aee;
        }
      }
      .log-list {
        height: calc(100% - 30px);
        overflow-x: hidden;
        overflow-y: auto;
        .btn-more {
          display: flex;
          align-items: center;
          margin: 10px 0 15px 0;
          cursor: pointer;
          .el-icon-more {
            margin-right: 10px;
          }
        }
        .btn-more:hover {
          color: #1b9aee;
        }
        .no-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }
        .item {
          margin-bottom: 15px;
          font-size: 12px;
          .info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .icon {
              width: 16px;
              margin-right: 10px;
              font-size: 16px;
            }
            .username-and-remark {
              flex: 1;
            }
            .create-date {
              width: 130px;
              padding-right: 20px;
              text-align: right;
            }
          }
          .content {
            padding: 2px 0 2px 10px;
            margin: 3px 0 3px 26px;
            border-left: 5px solid #bfbfbf;
          }
        }
      }
    }
    .wrap-comment {
      height: 50px;
      border-top: 1px solid #ccc;
    }
  }
</style>
