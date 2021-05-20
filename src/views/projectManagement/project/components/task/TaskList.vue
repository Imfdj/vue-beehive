<template>
  <div class="task-list">
    <draggable
      class="list-group"
      :list="listData"
      :disabled="!isCurrentProjectMember"
      group="task_lists"
      @change="taskListDraggableChange"
    >
      <div v-for="(itemList, indexList) in listData" :key="indexList" class="wrap-item">
        <div class="task-list-info">
          <div class="name"
            >{{ itemList.name }}<span class="name-point"></span>{{ itemList.tasks && itemList.tasks.length }}
          </div>
          <div class="more">
            <Dropdown
              :selectList="selectListMoreFilter"
              @command="
                selector => {
                  commandMore(selector, itemList);
                }
              "
            >
              <i class="el-icon-more"></i>
            </Dropdown>
          </div>
        </div>
        <div v-loading="itemList.loading" class="wrap-draggable">
          <draggable
            class="list-group"
            :list="itemList.tasks"
            :disabled="!isCurrentProjectMember"
            group="tasks"
            @change="taskDraggableChange"
          >
            <div
              v-for="element in itemList.tasks"
              v-show="element.is_recycle === 0"
              :key="element.id"
              class="list-group-item"
              :class="[{ 'list-group-item-done': element.is_done === 1 }]"
              @click="taskOpen(element)"
            >
              <div class="state">
                <el-tooltip :content="element.state && element.state.name" :open-delay="600" placement="top">
                  <i
                    :class="element.state && element.state.icon"
                    :style="`color: ${element.state && element.state.color};font-size: 18px;`"
                  ></i>
                </el-tooltip>
              </div>
              <div class="wrap-done">
                <el-button type="text" :disabled="!isCurrentProjectMember" @click.stop="changeDoneState(element)">
                  <i :class="`iconfont ${element.is_done === 1 ? 'icon-xuanzhong2' : 'icon-fangxing1'}`"></i>
                </el-button>
              </div>
              <div class="content" :class="[{ 'task-state-success': (element.state && element.state.is_done) === 1 }]">
                <div class="name">{{ element.name }}</div>
                <div class="info">
                  <span v-if="element.date_tip" class="info-item task-date" :class="element.date_tip_class">
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
                <el-tooltip
                  v-if="element.executor"
                  :content="element.executor.username"
                  :open-delay="600"
                  placement="top"
                >
                  <BImage
                    class="user-avatar"
                    :src="element.executor.avatar || ''"
                    :width="26"
                    :height="26"
                    :borderRadius="26"
                  ></BImage>
                </el-tooltip>
              </div>
              <div
                v-if="(element.state && element.state.is_done) !== 1"
                class="task-priority"
                :style="`background-color: ${element.priority && element.priority.color};`"
              ></div>
            </div>
          </draggable>
          <el-button
            v-if="indexListCreate !== indexList"
            :disabled="!isCurrentProjectMember"
            type="text"
            class="btn-createTask"
            @click="CreateTaskClick(itemList, indexList)"
          >
            <i class="el-icon-plus color-light"></i>
          </el-button>
          <div v-else class="wrap-create-task">
            <CreateTask
              :itemListCreate="itemListCreate"
              @cancelClick="cancelClick"
              @createSuccess="createSuccess"
            ></CreateTask>
          </div>
        </div>
      </div>
    </draggable>
    <CreateTaskList v-permission="taskListPermissions.doCreate"></CreateTaskList>
    <TaskDialog ref="TaskDialog" @close="taskDialogClose"></TaskDialog>
    <EditorTaskListDialog ref="EditorTaskListDialog"></EditorTaskListDialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import BImage from '@/components/B-image';
  import Dropdown from '@/components/Dropdown';
  import TaskDialog from './components/TaskDialog/index';
  import EditorTaskListDialog from './components/EditorTaskListDialog';
  import CreateTask from './components/CreateTask';
  import CreateTaskList from './components/CreateTaskList';
  import { getList, doDelete, permissions as taskListPermissions } from '@/api/taskListManagement';
  import {
    doEditSort,
    doEdit,
    getList as getTaskList,
    doRecycleAllTaskOfTaskList,
    permissions as taskPermissions,
  } from '@/api/taskManagement';
  import { doEditSort as doTaskListEditSort } from '@/api/taskListManagement';
  import { mapGetters, mapState } from 'vuex';
  import mixin from '@/mixins';
  import { dateHumanizeFormat } from '@/utils';

  export default {
    name: 'TaskList',
    components: {
      draggable,
      BImage,
      Dropdown,
      TaskDialog,
      CreateTask,
      EditorTaskListDialog,
      CreateTaskList,
    },
    mixins: [mixin],
    data() {
      return {
        taskListPermissions,
        taskPermissions,
        listData: [],
        indexListCreate: -1,
        itemListCreate: {},
        selectListMore: [
          {
            id: 0,
            name: '编辑列表',
            icon: 'el-icon-edit',
            color: '#606266',
          },
          {
            id: 1,
            name: '本列所有任务移至回收站',
            icon: 'el-icon-delete',
            color: '#606266',
          },
          {
            id: 2,
            name: '删除列表',
            icon: 'el-icon-delete',
            color: '#606266',
          },
        ],
      };
    },
    computed: {
      ...mapState('project', ['taskStates', 'taskPrioritys', 'taskTypes', 'projectMembers', 'currentProjectId']),
      ...mapGetters('project', ['isCurrentProjectMember']),
      selectListMoreFilter() {
        const selectListMore = this.selectListMore.filter((item, index) => {
          if (index === 0) {
            return this.checkPermission(this.taskListPermissions.doEdit);
          }
          if (index === 1) {
            return this.checkPermission(this.taskPermissions.doRecycleAllTaskOfTaskList);
          }
          if (index === 2) {
            return this.checkPermission(this.taskListPermissions.doDelete);
          }
          return true;
        });
        // 业务权限，非项目成员不可操作任务列表
        selectListMore.forEach(item => (item.disabled = !this.isCurrentProjectMember));
        return selectListMore;
      },
    },
    watch: {
      $route(newValue, oldValue) {
        // 如果路由是项目切换
        if (newValue.params.id !== oldValue.params.id) {
          this.init();
        }
        // 如果路由中有taskId参数，则打开任务弹窗
        if (newValue.query.taskId) {
          this.$refs.TaskDialog.show(parseInt(newValue.query.taskId));
        }
      },
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'create:task':
            this.listData.forEach(itemList => {
              if (itemList.id === params.task_list_id) {
                const taskExisting = itemList.tasks?.find(task => task.id === params.id);
                // 如果不存在，则添加
                if (!taskExisting) {
                  this.taskItemInit(params);
                  itemList.tasks?.push(params);
                  itemList.tasks = this.$baseLodash.sortBy(itemList.tasks, task => task.sort);
                }
              }
            });
            break;
          case 'update:task': {
            let oldTask = null;
            let currrentItemList = null;
            this.listData.forEach(itemList => {
              itemList.tasks?.forEach(task => {
                if (task.id === params.id) {
                  oldTask = task;
                  currrentItemList = itemList;
                }
              });
            });
            if (!oldTask) return;
            // 如果新params的任务列表id和原先id相同，则为同列表 更新，否则为新列表中添加，久列表中删除
            if (oldTask.task_list_id === params.task_list_id) {
              Object.assign(oldTask, params);
              currrentItemList.tasks = this.$baseLodash.sortBy(currrentItemList.tasks, function (o) {
                return o.sort;
              });
              this.taskItemInit(oldTask);
            } else {
              // 删除
              const oldTaskList = this.listData.find(itemList => itemList.id === oldTask.task_list_id);
              const oldTaskListIndex = oldTaskList.tasks?.findIndex(task => task.id === oldTask.id);
              if (oldTaskListIndex !== -1) {
                oldTaskList.tasks?.splice(oldTaskListIndex, 1);
              }
              // 添加
              const newTaskList = this.listData.find(itemList => itemList.id === params.task_list_id);
              const taskExisting = newTaskList.tasks?.find(task => task.id === params.id);
              // 如果不存在，则添加，存在则更新
              if (!taskExisting) {
                newTaskList.tasks?.push(params);
                this.taskItemInit(params);
              } else {
                Object.assign(taskExisting, params);
                this.taskItemInit(taskExisting);
              }
              newTaskList.tasks = this.$baseLodash.sortBy(newTaskList.tasks, function (o) {
                return o.sort;
              });
            }
            break;
          }
          case 'delete:task':
            this.listData.forEach(itemList => {
              if (itemList.id === params.task_list_id) {
                itemList.tasks = itemList.tasks?.filter(task => task.id !== params.id);
              }
            });
            break;
          case 'create:task_list': {
            const taskExisting = this.listData?.find(item => item.id === params.id);
            // 如果不存在，则添加
            if (!taskExisting) {
              params.tasks = [];
              this.listData?.push(params);
              this.listData = this.$baseLodash.sortBy(this.listData, item => item.sort);
            }
            break;
          }
          case 'update:task_list':
            this.listData.forEach(item => {
              if (item.id === params.id) {
                Object.assign(item, { sort: params.sort, name: params.name });
                return false;
              }
            });
            this.listData = this.$baseLodash.sortBy(this.listData, 'sort');
            break;
          case 'delete:task_list':
            this.listData = this.listData?.filter(item => item.id !== params.id);
            break;
          default:
            break;
        }
      },
    },
    created() {
      this.init();
    },
    mounted() {
      // 如果当前路径中存在taskId，则打开任务弹窗
      if (this.$route.query && this.$route.query.taskId) {
        this.$refs.TaskDialog.show(parseInt(this.$route.query.taskId));
      }
    },
    methods: {
      init() {
        this.getList();
      },
      commandMore(selector, itemList) {
        switch (selector.id) {
          case 0: // 编辑
            this.$refs.EditorTaskListDialog.show(itemList);
            break;
          case 1: // 移至回收站
            this.$confirm('您确定要把列表下的所有任务移到回收站吗？', '移到回收站', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.doRecycleAllTaskOfTaskList(itemList.id);
            });
            break;
          case 2: // 删除列表
            this.$confirm('删除列表将彻底清空此列表上的所有任务，请确认是否要删除整个列表？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(() => {
              this.doDelete(itemList.id);
            });
            break;
        }
      },
      taskItemInit(task) {
        this.getItem(task);
        this.setTaskDateTip(task);
      },
      // 根据id获取相关项
      getItem(task) {
        task.type = this.taskTypes?.find(item => {
          return item.id === task.task_type_id;
        });
        task.state = this.taskStates?.find(item => {
          return item.id === task.task_state_id;
        });
        task.priority = this.taskPrioritys?.find(item => {
          return item.id === task.task_priority_id;
        });
        task.executor = this.projectMembers?.find(item => {
          return item.id === task.executor_id;
        });
      },
      // 根据任务的开始时间和结束时间，增加任务的处理时间状态提示
      setTaskDateTip(task) {
        // 如果存在结束时间，则需要根据结束时间相对当前时间做不同提示状态
        if (task.end_date) {
          switch (true) {
            case this.$baseDayjs().isAfter(task.end_date):
              // 如果结束时间小于当前时间，则为逾期状态
              task.date_tip_class = 'task-date-overdue';
              break;
            case this.$baseDayjs().isSame(task.end_date, 'day') && this.$baseDayjs().isBefore(task.end_date):
              // 如果结束时间是当天，则为当天状态
              task.date_tip_class = 'task-date-intraday';
              break;
            case this.$baseDayjs().isBefore(task.end_date, 'day') &&
              this.$baseDayjs().add(8, 'day').isAfter(this.$baseDayjs(task.end_date), 'day'):
              // 如果结束时间大于今天，且在往后的7天内则为近期状态
              task.date_tip_class = 'task-date-recently';
              break;
            default:
              // 如果结束时间超过往后7天，则为安全状态
              task.date_tip_class = 'task-date-safety';
              break;
          }
        }
        // 提示时间文本处理
        if (task.start_date && !task.end_date) {
          task.date_tip = `${
            dateHumanizeFormat(task.start_date, {
              coarsness: true,
            }).value
          } 开始`;
        }
        if (!task.start_date && task.end_date) {
          task.date_tip = `${dateHumanizeFormat(task.end_date, { coarsness: true }).value} 截止`;
        }
        if (task.start_date && task.end_date) {
          const start_date = dateHumanizeFormat(task.start_date, { coarsness: true }).value;
          const end_date = dateHumanizeFormat(task.end_date, { coarsness: true }).value;
          if (this.$baseDayjs(task.start_date).isSame(task.end_date, 'day')) {
            task.date_tip = `${start_date} - ${end_date.split(' ')[1]}`;
          } else {
            task.date_tip = `${start_date} - ${end_date}`;
          }
        }
      },
      searchTask(params = {}) {
        this.listData.forEach(taskListItem => {
          taskListItem.loading = true;
          getTaskList({
            task_list_id: taskListItem.id,
            prop_order: 'sort',
            order: 'asc',
            ...params,
          }).then(res => {
            taskListItem.loading = false;
            taskListItem.tasks = res.data?.rows;
            taskListItem.tasks?.forEach(task => {
              this.taskItemInit(task);
            });
          });
        });
      },
      async getList() {
        const {
          data: { rows, count },
        } = await getList({ project_id: this.currentProjectId, prop_order: 'sort', order: 'asc' });
        this.listData = rows.map(item => {
          item.tasks = [];
          return item;
        });
        this.searchTask();
      },
      async taskDraggableChange(evt) {
        if (evt.removed) return;
        const id = (evt.moved && evt.moved.element.id) || (evt.added && evt.added.element.id);
        const newIndex = evt.moved ? evt.moved.newIndex : evt.added && evt.added.newIndex;
        let listItem = null;
        for (let i = 0; i < this.listData.length; i++) {
          if (listItem) break;
          for (let j = 0; j < this.listData[i].tasks.length; j++) {
            if (this.listData[i].tasks[j].id === id) {
              listItem = this.listData[i];
              break;
            }
          }
        }
        if (!listItem) return;
        const { id: task_list_id, tasks } = listItem;
        const preId = tasks && tasks[newIndex - 1] && tasks[newIndex - 1].id;
        const nextId = tasks && tasks[newIndex + 1] && tasks[newIndex + 1].id;
        await doEditSort({
          task_list_id,
          id,
          preId,
          nextId,
        });
      },
      async taskListDraggableChange(evt) {
        const id = (evt.moved && evt.moved.element.id) || (evt.added && evt.added.element.id);
        const newIndex = evt.moved ? evt.moved.newIndex : evt.added && evt.added.newIndex;
        const preId = this.listData && this.listData[newIndex - 1] && this.listData[newIndex - 1].id;
        const nextId = this.listData && this.listData[newIndex + 1] && this.listData[newIndex + 1].id;
        await doTaskListEditSort({
          id,
          preId,
          nextId,
        });
      },
      CreateTaskClick(itemList, indexList) {
        this.itemListCreate = itemList;
        this.indexListCreate = indexList;
      },
      cancelClick() {
        this.indexListCreate = -1;
      },
      createSuccess() {
        // this.getList();
        this.indexListCreate = -1;
      },
      taskOpen(task) {
        this.$refs.TaskDialog.show(task.id);
        this.$router.replace(`${this.$route.path}?taskId=${task.id}`);
      },
      taskDialogClose(isEdited) {
        if (isEdited) {
          // this.getList();
        }
      },
      async changeDoneState(task) {
        task.is_done = task.is_done === 1 ? 0 : 1;
        await doEdit(task);
      },
      async doDelete(id) {
        await doDelete({ ids: [id] });
      },
      async doRecycleAllTaskOfTaskList(task_list_id) {
        await doRecycleAllTaskOfTaskList({ task_list_id });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .task-list {
    display: flex;
    height: 100%;
    .task-state-success {
      filter: opacity(0.5);
    }

    .wrap-item {
      display: inline-block;
      margin: 0px 0px 0px 4px;
      padding: 0px 3px;

      .task-list-info {
        display: flex;
        justify-content: space-between;
        padding: 0 15px 20px 0;
        cursor: move;

        .name {
          display: flex;
          align-items: center;
          font-size: 14px;
          font-weight: 600;

          .name-point {
            display: inline-block;
            width: 2px;
            height: 2px;
            background-color: #000;
            border-radius: 2px;
            margin: 0 3px;
          }
        }

        .more {
          cursor: pointer;
          padding: 2px;
        }
      }

      .wrap-draggable {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100vh - 185px - 49px);
        width: 269px;
        padding-right: 15px;

        .list-group {
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
        }

        .btn-createTask {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          width: 269px;
          background-color: #fff;
          border-radius: 4px;
          margin-bottom: 20px;
          box-shadow: 0 1px 2px 0 rgb(0 0 0 / 10%);

          .el-icon-plus {
            font-size: 18px;
            font-weight: 600;
          }
        }
      }

      .wrap-draggable::-webkit-scrollbar {
        background-color: #f1f1f1;
      }
    }
  }
</style>
