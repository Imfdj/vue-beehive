<template>
  <div class="task-list">
    <draggable class="list-group" :list="listData" group="task_lists" @change="taskListDraggableChange">
      <div v-for="(itemList, indexList) in listData" :key="indexList" class="wrap-item">
        <div class="task-list-info">
          <div class="name"
            >{{ itemList.name }}<span class="name-point"></span>{{ itemList.tasks && itemList.tasks.length }}
          </div>
          <div class="more">
            <Dropdown
              :selectList="selectListMore"
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
          <draggable class="list-group" :list="itemList.tasks" group="tasks" @change="taskDraggableChange">
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
          <div
            v-if="indexListCreate !== indexList"
            class="btn-createTask"
            @click="CreateTaskClick(itemList, indexList)"
          >
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
    </draggable>
    <CreateTaskList></CreateTaskList>
    <TaskDialog ref="TaskDialog" :projectId="projectId" @close="taskDialogClose"></TaskDialog>
    <EditorTaskListDialog ref="EditorTaskListDialog"></EditorTaskListDialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import BImage from '@/components/B-image';
  import Dropdown from '@/components/Dropdown';
  import TaskDialog from './components/TaskDialog';
  import EditorTaskListDialog from './components/EditorTaskListDialog';
  import CreateTask from './components/CreateTask';
  import CreateTaskList from './components/CreateTaskList';
  import { getList, doDelete } from '@/api/taskListManagement';
  import { doEditSort, doEdit, getList as getTaskList, doRecycleAllTaskOfTaskList } from '@/api/taskManagement';
  import { doEditSort as doTaskListEditSort } from '@/api/taskListManagement';
  import { mapState } from 'vuex';

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
    data() {
      return {
        projectId: parseInt(this.$route.params.id),
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
      ...mapState('project', ['taskStates', 'taskPrioritys', 'taskTypes', 'projectMembers']),
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
                  this.getItem(params);
                  itemList.tasks?.push(params);
                  itemList.tasks = this.$baseLodash.sortBy(itemList.tasks, task => task.sort);
                }
              }
            });
            break;
          case 'update:task':
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
              // 筛去回收站的
              currrentItemList.tasks = currrentItemList.tasks.filter(item => item.is_recycle !== 1);
              currrentItemList.tasks = this.$baseLodash.sortBy(currrentItemList.tasks, function (o) {
                return o.sort;
              });
              this.getItem(oldTask);
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
                this.getItem(params);
              } else {
                Object.assign(taskExisting, params);
                this.getItem(taskExisting);
              }
              newTaskList.tasks = this.$baseLodash.sortBy(newTaskList.tasks, function (o) {
                return o.sort;
              });
            }
            break;
          case 'delete:task':
            this.listData.forEach(itemList => {
              if (itemList.id === params.task_list_id) {
                itemList.tasks = itemList.tasks?.filter(task => task.id !== params.id);
              }
            });
            break;
          case 'create:task_list':
            const taskExisting = this.listData?.find(item => item.id === params.id);
            // 如果不存在，则添加
            if (!taskExisting) {
              params.tasks = [];
              this.listData?.push(params);
              this.listData = this.$baseLodash.sortBy(this.listData, item => item.sort);
            }
            break;
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
      this.getList();
    },
    mounted() {
      // 如果当前路径中存在taskId，则打开任务弹窗
      if (this.$route.query && this.$route.query.taskId) {
        this.$refs.TaskDialog.show(parseInt(this.$route.query.taskId));
      }
    },
    methods: {
      commandMore(selector, itemList) {
        console.log(itemList);
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
      searchTask(params = {}) {
        this.listData.forEach(taskListItem => {
          taskListItem.loading = true;
          getTaskList({
            task_list_id: taskListItem.id,
            is_recycle: 0,
            prop_order: 'sort',
            order: 'asc',
            ...params,
          }).then(res => {
            taskListItem.loading = false;
            taskListItem.tasks = res.data?.rows;
            taskListItem.tasks?.forEach(task => {
              this.getItem(task);
            });
          });
        });
      },
      async getList() {
        const {
          data: { rows, count },
        } = await getList({ project_id: this.projectId, prop_order: 'sort', order: 'asc' });
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
