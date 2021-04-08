<template>
  <div class="working-hour">
    <div class="label">
      <i class="el-icon-time"></i> 工时<span v-if="task.plan_work_hours"
        >· 预估工时 {{ task.plan_work_hours }} 小时</span
      >
      <i class="el-icon-edit-outline" @click="setWorkingHour"></i>
    </div>
    <div class="content">
      <div class="btn-add-working-hour" @click="createWorkingHour"><i class="el-icon-plus"></i>添加实际工时</div>
      <div class="wrap-working-hour-list">
        <div v-for="item in workingHourList" :key="item.id" class="item">
          <div class="wrap-working-hour-content" @click="editClick(item)">
            <BImage
              class="user-avatar"
              :src="(item.executor && item.executor.avatar) || ''"
              :width="24"
              :height="24"
              :borderRadius="24"
            ></BImage>
            <div>
              <div class="wrap-info">
                <span class="name">{{ item.executor && item.executor.username }}</span>
                <span class="start-date">
                  {{ startDateFormat(item.start_date) }}
                </span>
                实际工时为 {{ item.work_time }} 小时
              </div>
              <div v-if="item.description" class="description color-light">
                {{ item.description }}
              </div>
            </div>
          </div>
          <div class="ctrl">
            <i class="el-icon-edit" @click="editClick(item)"></i>
            <i class="el-icon-delete" @click="deleteClick(item)"></i>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="设置计划工时" :visible.sync="dialogVisible" width="300px" append-to-body>
      <el-form v-if="task" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label-width="0px" prop="plan_work_hours">
          <el-input-number
            v-model="form.plan_work_hours"
            controls-position="right"
            :min="0"
            :max="10000"
            placeholder="请输入计划工时(小时)"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
    <EditorWorkingHourDialog ref="EditorWorkingHourDialog" :task="task"></EditorWorkingHourDialog>
  </div>
</template>

<script>
  import { doEdit } from '@/api/taskManagement';
  import { getList, doDelete } from '@/api/taskWorkingHourManagement';
  import EditorWorkingHourDialog from './components/EditorWorkingHourDialog';
  import BImage from '@/components/B-image';
  import dayjs from 'dayjs';
  import { mapState } from 'vuex';

  export default {
    name: 'WorkingHour',
    components: {
      EditorWorkingHourDialog,
      BImage,
    },
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        dialogVisible: false,
        workingHourList: [],
        form: {},
        rules: {
          plan_work_hours: [{ required: true, message: '请输入计划工时', trigger: 'blur' }],
        },
      };
    },
    computed: {
      ...mapState('project', ['projectMembers']),
    },
    watch: {
      'task.id'(newValue, oldValue) {
        this.getList();
      },
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'create:task_working_hour': {
            const userExisting = this.workingHourList?.find(item => item.id === params.id);
            // 如果不存在，则添加
            if (!userExisting) {
              this.projectMembers.forEach(item => {
                if (params.executor_id === item.id) params.executor = item;
              });
              this.workingHourList?.push(params);
            }
            break;
          }
          case 'update:task_working_hour':
            this.workingHourList.forEach(item => {
              if (item.id === params.id) {
                this.projectMembers.forEach(item => {
                  if (params.executor_id === item.id) params.executor = item;
                });
                Object.assign(item, params);
              }
            });
            break;
          case 'delete:task_working_hour':
            this.workingHourList = this.workingHourList?.filter(item => item.id !== params.id);
            break;
          default:
            break;
        }
      },
    },
    methods: {
      setWorkingHour() {
        this.dialogVisible = true;
        this.form = Object.assign({}, this.task);
      },
      createWorkingHour() {
        this.$refs.EditorWorkingHourDialog.show();
      },
      submitForm(formName) {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            await this.commitPlanWorkHours();
            this.dialogVisible = false;
          } else {
            return false;
          }
        });
      },
      async commitPlanWorkHours() {
        const { msg } = await doEdit(this.form);
      },
      async getList() {
        const {
          data: { rows },
        } = await getList({
          task_id: this.task.id,
        });
        console.log(rows);
        this.workingHourList = rows;
      },
      startDateFormat(work_time) {
        if (new Date(work_time).getFullYear() === new Date().getFullYear()) {
          return dayjs(work_time).format('M月D日');
        }
        return dayjs(work_time).format('YYYY年M月D日');
      },
      editClick(row) {
        this.$refs.EditorWorkingHourDialog.show(row);
      },
      deleteClick(row) {
        this.$baseConfirm('你确定要删除当前项吗', null, async () => {
          await doDelete({ ids: [row.id] });
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .working-hour {
    display: block;
    margin-bottom: 20px;

    .label {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 36px;
      padding: 5px 0;

      .el-icon-edit-outline {
        margin-left: 10px;
        color: #3da8f5;
        cursor: pointer;
      }
    }

    .content {
      padding: 5px 10px;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      margin-top: 15px;

      .btn-add-working-hour {
        padding: 10px 0 10px 10px;
        cursor: pointer;
        color: #409eff;

        .el-icon-plus {
          margin-right: 5px;
        }
      }

      .wrap-working-hour-list {
        color: #262626;

        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;

          .wrap-working-hour-content {
            display: flex;
            flex: 1;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;

            .wrap-info {
              display: flex;
              align-items: center;

              .name {
                margin-left: 8px;
              }

              .start-date {
                margin-left: 8px;
              }
            }

            .description {
              padding: 8px 0 8px 8px;
            }
          }

          .wrap-working-hour-content:hover {
            background-color: #f7f7f7;
          }

          .ctrl {
            display: flex;
            align-items: center;
            justify-content: space-around;
            width: 60px;
            padding: 0px 5px;

            & i {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>
