<template>
  <div class="participator">
    <div class="title">参与者 <span class="point"></span>{{ 1 }}</div>
    <div class="user-list">
      <div v-for="user in users" :key="user.id" class="item">
        <BImage class="user-avatar" :src="user.avatar || ''" :width="24" :height="24" :borderRadius="24"></BImage>
      </div>
      <i class="el-icon-circle-plus"></i>
    </div>
  </div>
</template>

<script>
  import BImage from '@/components/B-image';

  export default {
    name: 'Participator',
    components: {
      BImage,
    },
    props: {
      users: {
        type: Array,
        required: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .participator {
    padding: 5px 20px 10px 20px;
    border-bottom: 1px solid #e5e5e5;
    .title {
      display: flex;
      align-items: center;
      .point {
        display: inline-block;
        width: 2px;
        height: 2px;
        margin: 0 4px;
        background-color: #606266;
        border-radius: 2px;
      }
    }
    .user-list {
      display: flex;
      align-items: center;
      padding: 10px 0;
      .item {
        margin-right: 8px;
        cursor: pointer;
      }
      .el-icon-circle-plus {
        font-size: 28px;
        color: #1890ff;
        cursor: pointer;
      }
    }
  }
</style>
