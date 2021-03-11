<template>
  <el-dialog
    class="task-dialog"
    :visible.sync="dialogTableVisible"
    :destroy-on-close="false"
    top="50px"
    width="70%"
    @close="close"
  >
    <template slot="title">
      <el-dropdown trigger="click" placement="bottom-start" @command="commandTaskType">
        <span class="el-dropdown-link-type">
          <i :class="taskTypeSelect.icon" :style="`color: ${taskTypeSelect.color};margin-right: 5px;`"></i
          >{{ taskTypeSelect.name }}
        </span>
        <el-dropdown-menu slot="dropdown" style="width: 200px;">
          <el-dropdown-item v-for="item in taskTypes" :key="item.id" :command="item">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0px;">
              <div><i :class="item.icon" :style="`color: ${item.color};font-size: 16px;`"></i>{{ item.name }}</div>
              <i v-if="taskTypeSelect.id === item.id" class="el-icon-check" style="font-size: 16px;"></i>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
    <el-row v-loading="loading">
      <el-col :span="14">
        <div class="wrap-task">
          <div class="wrap-name" :class="[{ 'wrap-name-done': taskInfo.is_done === 1 }]">
            <el-input v-model="taskInfo.name" type="textarea" autosize @blur="doEditExec"></el-input>
          </div>
          <div class="wrap-item wrap-state">
            <div class="label"><i class="iconfont icon-xuanzhong2"></i> 完成状态</div>
            <div class="content">
              <el-dropdown trigger="click" placement="bottom-start" @command="commandTaskDoneState">
                <span class="el-dropdown-link-state">
                  <i
                    :class="taskDoneStateSelect.icon"
                    :style="`color: ${taskDoneStateSelect.color};margin-right: 5px;font-size: 16px;`"
                  ></i
                  >{{ taskDoneStateSelect.name }}
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 200px;">
                  <el-dropdown-item v-for="item in taskDoneStates" :key="item.id" :command="item">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0px;">
                      <div style="display: flex; align-items: center;">
                        <i :class="item.icon" :style="`color: ${item.color};font-size: 16px;`"></i>{{ item.name }}
                      </div>
                      <i v-if="taskDoneStateSelect.id === item.id" class="el-icon-check" style="font-size: 16px;"></i>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="wrap-item wrap-state">
            <div class="label"><i class="el-icon-pie-chart"></i> 执行状态</div>
            <div class="content">
              <el-dropdown trigger="click" placement="bottom-start" @command="commandTaskState">
                <span class="el-dropdown-link-state">
                  <i
                    :class="taskStateSelect.icon"
                    :style="`color: ${taskStateSelect.color};margin-right: 5px;font-size: 16px;`"
                  ></i
                  >{{ taskStateSelect.name }}
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 200px;">
                  <el-dropdown-item v-for="item in taskStates" :key="item.id" :command="item">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 5px 0px;">
                      <div style="display: flex; align-items: center;">
                        <i :class="item.icon" :style="`color: ${item.color};font-size: 16px;`"></i>{{ item.name }}
                      </div>
                      <i v-if="taskStateSelect.id === item.id" class="el-icon-check" style="font-size: 16px;"></i>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="wrap-item">
            <div class="label"><i class="el-icon-user"></i> 执行者</div>
            <div class="content">
              <ExecutorSelect
                ref="ExecutorSelect"
                :executorId="taskInfo.executor_id"
                @select="executorSelect"
              ></ExecutorSelect>
            </div>
          </div>
          <div class="wrap-item wrap-date">
            <div class="label"><i class="el-icon-date"></i> 时间</div>
            <div class="content">
              <el-date-picker
                v-model="taskInfo.start_date"
                type="datetime"
                placeholder="设置开始时间"
                style="width: 183px;"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="startDatePickerChange"
              >
              </el-date-picker>
              <i class="el-icon-minus"></i>
              <el-date-picker
                v-model="taskInfo.end_date"
                type="datetime"
                placeholder="设置截止时间"
                style="width: 183px;"
                size="mini"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="endDatePickerChange"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="wrap-item">
            <div class="label"><i class="iconfont icon-i"></i> 优先级</div>
            <div class="content">
              <el-dropdown trigger="click" placement="bottom-start" @command="commandTaskPriority">
                <el-tag
                  effect="plain"
                  size="medium"
                  :style="`color: ${taskPrioritySelect.color};border-color: ${taskPrioritySelect.color};cursor: pointer;`"
                  >{{ taskPrioritySelect.name }}
                </el-tag>
                <el-dropdown-menu slot="dropdown" style="width: 200px;">
                  <el-dropdown-item v-for="item in taskPrioritys" :key="item.id" :command="item">
                    <div style="padding: 5px 0px; display: flex; justify-content: space-between; align-items: center;">
                      <el-tag effect="plain" size="medium" :style="`color: ${item.color};border-color: ${item.color};`">
                        {{ item.name }}
                      </el-tag>
                      <i v-if="taskPrioritySelect.id === item.id" class="el-icon-check" style="font-size: 16px;"></i>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="wrap-item wrap-remark">
            <div class="label"><i class="el-icon-document"></i> 备注</div>
            <div class="content">
              <div v-show="!showRichText" class="btn-remark" @click="showRichTextClick">
                <div v-if="taskInfo.remark" class="wrap-remark-html" v-html="taskInfo.remark"></div>
                <div v-else class="btn">添加备注</div>
              </div>
              <div v-if="showRichText" class="wrap-rich-text">
                <RichText ref="RichText" :value="taskInfo.remark" @changeValue="richTextChangeValue"></RichText>
                <div class="wrap-btn-remark">
                  <el-button @click="showRichText = false">取消</el-button>
                  <el-button type="primary" @click="saveRichTextValue">保存</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="wrap-item wrap-tag">
            <div class="label"><i class="el-icon-collection-tag"></i> 标签</div>
            <div class="content">
              <el-tag
                v-for="tag in task_tags_selected"
                :key="tag.id"
                closable
                effect="plain"
                :style="`color: ${tag.color};border-color: ${tag.color};`"
                @close="closeTaskTag(tag)"
              >
                {{ tag.name }}
              </el-tag>
              <el-popover placement="right" width="230" trigger="click" @hide="hideTaskTag">
                <div class="wrap-task-tags">
                  <TaskTag ref="TaskTag" :taskInfo="taskInfo" @change="taskTagChange"></TaskTag>
                </div>
                <div slot="reference" class="btn-add-tag">
                  <span v-if="!task_tags_selected.length">添加标签</span>
                  <i v-else class="el-icon-circle-plus"></i>
                </div>
              </el-popover>
            </div>
          </div>
          <WorkingHour :task="taskInfo"></WorkingHour>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="wrap-dynamic">
          <Participator
            v-if="taskInfo.participators"
            :users="taskInfo.participators"
            :taskId="taskId"
            :creatorId="taskInfo.creator_id"
            @change="participatorChange"
          ></Participator>
          <TaskLog ref="TaskLog" :projectId="projectId" :taskId="taskId"></TaskLog>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
  import { getInfo, doEdit } from '@/api/taskManagement';
  import Participator from './Participator';
  import TaskLog from './TaskLog';
  import WorkingHour from './WorkingHour';
  import { mapState } from 'vuex';
  import ExecutorSelect from '@/components/ExecutorSelect';
  import RichText from './RichText';
  import TaskTag from './TaskTag';

  export default {
    name: 'TaskDialog',
    components: {
      ExecutorSelect,
      RichText,
      TaskTag,
      Participator,
      TaskLog,
      WorkingHour,
    },
    props: {
      projectId: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        dialogTableVisible: false,
        isEdited: false,
        loading: false,
        taskId: null,
        taskInfo: {
          name: '',
          start_date: '',
          end_date: '',
          remark: '',
        },
        taskInfoOrigin: {}, // 用于记录改动后的task数据
        taskTypeSelect: {},
        taskStateSelect: {},
        taskDoneStateSelect: {},
        taskPrioritySelect: {},
        showRichText: false,
        task_tags_selected: [],
        taskDoneStates: [
          {
            id: 0,
            color: '#7c7c7c',
            icon: 'iconfont icon-fangxing1',
            name: '未完成',
          },
          {
            id: 1,
            color: '#1ae54d',
            icon: 'iconfont icon-xuanzhong2',
            name: '已完成',
          },
        ],
      };
    },
    computed: {
      ...mapState('project', ['taskStates', 'taskPrioritys', 'taskTypes']),
    },
    watch: {
      'taskInfo.is_done'(newValue, oldValue) {
        this.taskDoneStateSelect = this.taskDoneStates.find(item => {
          return item.id === newValue;
        });
      },
      'taskInfo.task_type_id'(newValue, oldValue) {
        this.taskTypeSelect = this.taskTypes.find(item => {
          return item.id === newValue;
        });
      },
      'taskInfo.task_state_id'(newValue, oldValue) {
        this.taskStateSelect = this.taskStates.find(item => {
          return item.id === newValue;
        });
      },
      'taskInfo.task_priority_id'(newValue, oldValue) {
        this.taskPrioritySelect = this.taskPrioritys.find(item => {
          return item.id === newValue;
        });
      },
    },
    sockets: {
      message: function (data) {
        console.log(data);
        if (/.*:task$/.test(data.action)) {
          switch (data.action) {
            case 'update:task':
              Object.assign(this.taskInfo, data.params);
              break;
            default:
              break;
          }
        }
      },
    },
    methods: {
      show(taskId) {
        this.dialogTableVisible = true;
        this.isEdited = false;
        this.showRichText = false;
        this.taskId = taskId;
        this.getInfoExec();
        this.$nextTick(() => {
          this.$refs.TaskLog && this.$refs.TaskLog.getList();
        });
      },
      async getInfoExec() {
        this.loading = true;
        const { data } = await getInfo({ id: this.taskId });
        this.taskInfo = data;
        if (this.taskInfo.remark === null) this.taskInfo.remark = '';
        this.setTaskInfoOrigin();
        this.loading = false;
      },
      setTaskInfoOrigin() {
        this.taskInfoOrigin = this.$baseLodash.cloneDeep(this.taskInfo);
      },
      close() {
        this.dialogTableVisible = false;
        this.$emit('close', this.isEdited);
      },
      commandTaskType(type) {
        this.taskTypeSelect = type;
        this.doEditExec();
      },
      commandTaskState(state) {
        this.taskStateSelect = state;
        this.doEditExec();
      },
      commandTaskDoneState(state) {
        this.taskDoneStateSelect = state;
        this.doEditExec();
      },
      commandTaskPriority(priority) {
        this.taskPrioritySelect = priority;
        this.doEditExec();
      },
      startDatePickerChange(date) {
        if (date === null) {
          this.taskInfo.start_date = '';
        }
        this.doEditExec();
      },
      endDatePickerChange(date) {
        if (date === null) {
          this.taskInfo.end_date = '';
        }
        this.doEditExec();
      },
      async doEditExec() {
        this.taskInfo.task_type_id = this.taskTypeSelect.id;
        this.taskInfo.task_state_id = this.taskStateSelect.id;
        this.taskInfo.is_done = this.taskDoneStateSelect.id;
        this.taskInfo.task_priority_id = this.taskPrioritySelect.id;
        const diff = {};
        // 获取改动数据到diff
        for (let taskInfoKey in this.taskInfo) {
          if (!this.$baseLodash.isEqual(this.taskInfo[taskInfoKey], this.taskInfoOrigin[taskInfoKey])) {
            diff[taskInfoKey] = this.taskInfo[taskInfoKey];
          }
        }
        if (Object.keys(diff).length) {
          await doEdit({
            id: this.taskInfo.id,
            ...diff,
          });
          this.isEdited = true;
          this.setTaskInfoOrigin();
          this.$refs.TaskLog.getList();
        }
      },
      showRichTextClick() {
        this.showRichText = true;
      },
      richTextChangeValue(value) {
        this.taskInfo.remark = value;
        this.doEditExec();
      },
      saveRichTextValue() {
        this.$refs.RichText.save();
        this.showRichText = false;
      },
      taskTagChange(task_tags_selected) {
        this.task_tags_selected = task_tags_selected;
      },
      closeTaskTag(tag) {
        this.$refs.TaskTag.tagClick(tag);
      },
      hideTaskTag() {
        this.$refs.TaskTag.closeEdit();
      },
      executorSelect(user) {
        this.taskInfo.executor_id = user.id;
        this.doEditExec();
      },
      participatorChange(users) {
        this.taskInfo.participators = users;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import 'src/styles/custom';
  $min-height: calc(100vh - 170px);
  .task-dialog {
    white-space: normal;

    ::v-deep .el-dialog__body {
      padding: 0px 20px;
    }

    .el-dropdown-link-type {
      cursor: pointer;
      user-select: none;
      padding: 5px;
      background-color: #e1f3fc;
      border-radius: 4px;
      color: #1b9aee;
    }

    .wrap-task {
      height: $min-height;
      padding: 10px 10px 0 0;
      overflow-x: hidden;
      overflow-y: auto;
      color: $colorLight;

      .wrap-name {
        ::v-deep .el-textarea__inner {
          border: none;
          font-size: 18px;
        }

        ::v-deep .el-textarea__inner:hover {
          background-color: #f7f7f7;
        }
      }

      .wrap-name-done {
        ::v-deep .el-textarea__inner {
          color: #bfbfbf;
        }
      }

      .wrap-item {
        display: flex;
        align-items: center;
        min-height: 36px;
        padding: 5px 0;

        .iconfont {
          font-size: 14px;
        }

        .label {
          width: 132px;

          & i {
            font-size: 16px;
            margin-right: 3px;
          }
        }

        .content {
          flex: 1;
        }
      }

      .wrap-state {
        .el-dropdown-link-state {
          cursor: pointer;
          user-select: none;
          padding: 3px;
          border: 1px solid transparent;
          border-radius: 4px;
        }

        .el-dropdown-link-state:hover {
          border: 1px solid #1b9aee;
        }
      }

      .wrap-date {
        .el-icon-minus {
          padding: 0px 5px;
        }
      }

      .wrap-remark {
        align-items: normal;
        .label {
          margin-top: 8px;
        }
        .btn-remark {
          cursor: pointer;

          .wrap-remark-html {
            min-height: 36px;
          }

          .btn {
            line-height: 36px;
            padding-left: 10px;
          }
        }

        .btn-remark:hover {
          background-color: #f5f5f5;
        }

        .wrap-rich-text {
          min-height: 200px;

          .wrap-btn-remark {
            margin-top: 5px;
            text-align: right;
          }
        }
      }

      .wrap-tag {
        .content {
          display: flex;
          align-items: center;

          .btn-add-tag {
            display: inline-block;
            cursor: pointer;

            .el-icon-circle-plus {
              font-size: 18px;
              margin-left: 10px;
            }

            .el-icon-circle-plus:hover {
              color: #3da8f5;
            }
          }

          .btn-add-tag:hover {
            color: #3da8f5;
          }
        }
      }
    }

    .wrap-dynamic {
      min-height: $min-height;
      padding: 10px 0 0 0;
      border-left: 1px solid #ccc;
    }
  }
</style>
