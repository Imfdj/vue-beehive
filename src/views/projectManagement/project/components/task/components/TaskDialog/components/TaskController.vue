<template>
  <div class="task-controller">
    <BtnTooltip
      icon="iconfont icon-lianjie"
      tooltipContent="复制任务链接"
      type="text"
      @click="handleCopyTaskLink"
    ></BtnTooltip>
    <span>
      <BtnTooltip icon="iconfont icon-zan" tooltipContent="点个赞" type="text" @click="handleDoLike"></BtnTooltip>
    </span>
    <Dropdown :selectList="selectList" @command="command">
      <BtnTooltip icon="el-icon-more" tooltipContent="打开菜单" type="text"></BtnTooltip>
    </Dropdown>
  </div>
</template>

<script>
  import BtnTooltip from '@/components/Btn-tooltip';
  import Dropdown from '@/components/Dropdown';
  import { doEdit } from '@/api/taskManagement';
  import mixin from '@/mixins';

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
    methods: {
      handleCopyTaskLink() {
        const { project_id, id } = this.task;
        this.doCopy(`${window.location.origin}/pojectManagement/Project/${project_id}?taskId=${id}`);
        this.$baseNotify('可粘贴到地址栏中，快速打开此任务', '复制链接成功');
      },
      handleDoLike() {},
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
              window.open(`${window.location.origin}/pojectManagement/Project/${project_id}?taskId=${id}`, '_blank');
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
    width: 108px;
  }
</style>
