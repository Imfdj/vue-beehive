<template>
  <div class="task-controller">
    <BtnTooltip
      icon="iconfont icon-lianjie"
      tooltipContent="复制任务链接"
      type="text"
      btnClass="normal-btn"
      @click="handleCopyTaskLink"
    ></BtnTooltip>
    <span>
      <BtnTooltip
        icon="iconfont icon-zan"
        tooltipContent="点个赞"
        type="text"
        :disabled="!$checkPermission(userTaskLikePermissions.doChange)"
        :btnClass="btnClassLike"
        @click="handleDoLike"
      >
        <span v-if="task.likers && task.likers.length" style="padding: 0px 5px; font-size: 14px">
          {{ task.likers && task.likers.length }}
        </span>
      </BtnTooltip>
    </span>
    <Dropdown :selectList="SelectListAuth" @command="command">
      <BtnTooltip icon="el-icon-more" tooltipContent="打开菜单" btnClass="normal-btn" type="text"></BtnTooltip>
    </Dropdown>
  </div>
</template>

<script>
  import BtnTooltip from '@/components/Btn-tooltip';
  import Dropdown from '@/components/Dropdown';
  import { doEdit, permissions as taskPermissions } from '@/api/taskManagement';
  import { doChange, permissions as userTaskLikePermissions } from '@/api/userTaskLikeManagement';
  import mixin from '@/mixins';
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'TaskController',
    components: {
      BtnTooltip,
      Dropdown,
    },
    mixins: [mixin],
    props: {
      task: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        taskPermissions,
        userTaskLikePermissions,
        selectList: [
          {
            id: 0,
            name: '复制任务 *',
            icon: 'el-icon-document-copy',
          },
          {
            id: 1,
            name: '移动任务 *',
            icon: 'el-icon-copy-document',
          },
          {
            id: 2,
            name: '移到回收站',
            icon: 'el-icon-delete',
          },
          {
            id: 3,
            name: '以新标签页打开',
            icon: 'el-icon-tickets',
          },
        ],
      };
    },
    computed: {
      ...mapGetters('project', ['isCurrentProjectMember']),
      ...mapState('user', ['userInfo']),
      SelectListAuth() {
        return this.selectList.map(item => {
          if (item.id !== 3) {
            item.disabled = !this.isCurrentProjectMember || !this.$checkPermission(taskPermissions.doEdit);
          }
          return item;
        });
      },
      btnClassLike() {
        const self = this.task.likers?.find(item => item.id === this.userInfo.id);
        return self ? '' : 'normal-btn';
      },
    },
    sockets: {
      sync: function (data) {
        const { params, action } = data;
        switch (action) {
          case 'create:user_task_like':
            if (this.task.id === params.task_id) {
              if (!this.task.likers) {
                this.task.likers = [];
              }
              const taskExisting = this.task.likers?.find(item => item.id === params.user_id);
              // 如果不存在，则添加
              if (!taskExisting) {
                this.task.likers?.push({
                  id: params.user_id,
                });
              }
            }
            break;
          case 'delete:user_task_like':
            this.task.likers = this.task.likers?.filter(item => item.id !== params.user_id);
            break;
          default:
            break;
        }
      },
    },
    methods: {
      handleCopyTaskLink() {
        const { project_id, id } = this.task;
        this.doCopy(`${window.location.origin}${this.$configSettings.project_path}/${project_id}?taskId=${id}`);
        this.$baseNotify('可粘贴到地址栏中，快速打开此任务', '复制链接成功');
      },
      handleDoLike() {
        doChange({
          project_id: this.task.project_id,
          task_id: this.task.id,
        });
      },
      async command(item) {
        switch (item.id) {
          case 0:
            // 复制任务

            break;
          case 1:
            // 移动任务

            break;
          case 2:
            // 移到回收站
            this.$confirm('您确定要把该任务移到回收站吗？', '移到回收站', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }).then(async () => {
              await doEdit({
                ...this.task,
                is_recycle: 1,
              });
            });
            break;
          case 3:
            {
              // 以新标签页打开
              const { project_id, id } = this.task;
              window.open(
                `${window.location.origin}${this.$configSettings.project_path}/${project_id}?taskId=${id}`,
                '_blank'
              );
            }
            break;
          default:
            break;
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .task-controller {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 108px;
    .normal-btn {
      color: #757575;
    }
  }
</style>
