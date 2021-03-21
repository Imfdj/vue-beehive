<template>
  <div class="task-list">
    <div v-for="(itemList, indexList) in listData" :key="indexList" class="wrap-item">
      <div class="task-list-info">
        <div class="name">{{ itemList.name }}<span class="name-point"></span>{{ itemList.tasks.length }}</div>
        <div class="more">
          <i class="el-icon-more" @click="handleMore(itemList)"></i>
        </div>
      </div>
      <div class="wrap-draggable">
        <draggable class="list-group" :list="itemList.tasks" group="people" @change="change">
          <div
            v-for="element in itemList.tasks"
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
              <i
                :class="`iconfont ${element.is_done === 1 ? 'icon-xuanzhong2' : 'icon-fangxing1'}`"
                @click.stop="changeDoneState(element)"
              ></i>
            </div>
            <div class="content" :class="[{ 'task-state-success': (element.state && element.state.is_done) === 1 }]">
              <div class="name">{{ element.name }}</div>
              <div class="info">
                <el-tooltip :content="element.type && element.type.name" :open-delay="600" placement="top">
                  <i
                    :class="element.type && element.type.icon"
                    :style="`color: ${element.type && element.type.color};font-size: 18px;`"
                  ></i>
                </el-tooltip>
              </div>
            </div>
            <div class="executor">
              <BImage
                v-if="element.executor"
                class="user-avatar"
                :src="(element.executor && element.executor.avatar) || ''"
                :width="32"
                :height="32"
                :borderRadius="32"
              ></BImage>
            </div>
            <div
              v-if="(element.state && element.state.is_done) !== 1"
              class="task-priority"
              :style="`background-color: ${element.priority && element.priority.color};`"
            ></div>
          </div>
        </draggable>
        <div v-if="indexListCreate !== indexList" class="btn-createTask" @click="CreateTaskClick(itemList, indexList)">
          <i class="el-icon-plus color-light"></i>
        </div>
        <div v-else class="wrap-create-task">
          <CreateTask
            :itemListCreate="itemListCreate"
            @cancelClick="cancelClick"
            @createSuccess="createSuccess"
          ></CreateTask>
        </div>
      </div>
    </div>
    <TaskDialog ref="TaskDialog" :projectId="projectId" @close="taskDialogClose"></TaskDialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import BImage from '@/components/B-image';
  import TaskDialog from './components/TaskDialog';
  import CreateTask from './components/CreateTask';
  import { getList } from '@/api/taskListManagement';
  import { doEditSort, doEdit } from '@/api/taskManagement';
  import { mapState } from 'vuex';

  export default {
    name: 'TaskList',
    components: {
      draggable,
      BImage,
      TaskDialog,
      CreateTask,
    },
    data() {
      return {
        projectId: parseInt(this.$route.params.id),
        listData: [],
        indexListCreate: -1,
        itemListCreate: {},
      };
    },
    computed: {
      ...mapState('project', ['taskStates', 'taskPrioritys', 'taskTypes', 'participators']),
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        if (/.*:task$/.test(action)) {
          switch (action) {
            case 'create:task':
              this.listData.forEach(itemList => {
                if (itemList.id === params.task_list_id) {
                  const taskExisting = itemList.tasks?.find(task => task.id === params.id);
                  // 如果不存在，则添加
                  if (!taskExisting) {
                    this.getItem(params);
                    itemList.tasks?.push(params);
                    itemList.tasks = this.$baseLodash.sortBy(itemList.tasks, task => task.sort);
                  }
                }
              });
              break;
            case 'update:task':
              this.listData.forEach(itemList => {
                itemList.tasks?.forEach(task => {
                  if (task.id === params.id) {
                    Object.assign(task, params);
                    itemList.tasks = this.$baseLodash.sortBy(itemList.tasks, function (o) {
                      return o.sort;
                    });
                    this.getItem(task);
                    return false;
                  }
                });
              });
              break;
            case 'delete:task':
              this.listData.forEach(itemList => {
                if (itemList.id === params.task_list_id) {
                  itemList.tasks = itemList.tasks?.filter(task => task.id !== params.id);
                }
              });
              break;
            default:
              break;
          }
        }
      },
    },
    created() {
      this.getList();
    },
    mounted() {
      // 如果当前路径中存在taskId，则打开任务弹窗
      if (this.$route.query && this.$route.query.taskId) {
        this.$refs.TaskDialog.show(parseInt(this.$route.query.taskId));
      }
    },
    methods: {
      handleMore(item) {
        console.log(item);
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
        task.executor = this.participators?.find(item => {
          return item.id === task.executor_id;
        });
      },
      async getList() {
        const {
          data: { rows, count },
        } = await getList({ project_id: this.projectId });
        this.listData = rows;
        this.listData.forEach(tasklistItem => {
          tasklistItem.tasks.forEach(task => {
            this.getItem(task);
          });
        });
      },
      async change(evt) {
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
        this.$router.push(`${this.$route.path}?taskId=${task.id}`);
      },
      taskDialogClose(isEdited) {
        if (isEdited) {
          // this.getList();
        }
        this.$router.replace(this.$route.path);
      },
      async changeDoneState(task) {
        task.is_done = task.is_done === 1 ? 0 : 1;
        await doEdit(task);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .task-list {
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
        margin-bottom: 20px;
        padding-right: 15px;

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
            }

            .content {
              width: calc(259px - 88px);
              white-space: normal;
              word-break: break-all;
              padding-left: 5px;
              padding-right: 15px;

              .name {
              }

              .info {
                padding: 5px 0px;
              }
            }

            .executor {
              width: 32px;
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
          cursor: pointer;
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
