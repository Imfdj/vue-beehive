<template>
  <div v-loading="loading" v-show="visible" class="wrap-drag-verify-img-chip" @click.stop="doClick">
    <drag-verify-img-chip
      ref="dragVerify"
      :imgsrc="imgsrc"
      :isPassing.sync="isPassing"
      :showRefresh="false"
      :width="290"
      :diffWidth="5"
      text="请按住滑块拖动"
      progressBarBg="#FED88A"
      completedBg="#FED88A"
      successText="验证通过"
      handlerIcon="el-icon-d-arrow-right"
      successIcon="el-icon-circle-check"
      refreshIcon="el-icon-refresh-right"
      @refresh="refreshChip"
      @passcallback="passcallback"
      @passfail="passfail"
    >
    </drag-verify-img-chip>
    <img v-show="false" :src="imgsrc" @load="onload" alt="" />
    <div class="wrap-btn">
      <el-tooltip :enterable="false" class="item" effect="light" content="关闭验证" placement="bottom-start">
        <el-button type="text" size="small" icon="el-icon-circle-close" @click="close"></el-button>
      </el-tooltip>
      <el-tooltip :enterable="false" class="item" effect="light" content="刷新验证" placement="bottom-start">
        <el-button type="text" size="small" icon="el-icon-refresh" @click="doRefresh"></el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import dragVerifyImgChip from 'vue-drag-verify-img-chip';
  import mixins from '@/mixins';

  export default {
    name: 'DragCerifyImgChip',
    components: {
      dragVerifyImgChip,
    },
    mixins: [mixins],
    data() {
      return {
        loading: false,
        visible: false,
        imgsrc: '',
        isPassing: false,
      };
    },
    async created() {
      this.imgsrc = await this.getRandomImgPath('https://picsum.photos/290/160');
    },
    methods: {
      show() {
        this.visible = true;
      },
      close() {
        this.visible = false;
      },
      refreshChip() {
        console.log('refreshChip');
      },
      passcallback() {
        this.$emit('passcallback');
      },
      passfail() {
        this.$emit('passfail');
      },
      async doRefresh() {
        this.loading = true;
        this.imgsrc = await this.getRandomImgPath('https://picsum.photos/290/160');
      },
      onload() {
        this.loading = false;
      },
      doClick() {},
    },
  };
</script>

<style lang="scss" scoped>
  .wrap-drag-verify-img-chip {
    width: fit-content;
    background-color: #fff;
    box-shadow: 0px 0px 20px #6d6d6d;
    animation: 500ms example;
    animation-iteration-count: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    user-select: none;
    .wrap-btn {
      border-top: 1px solid #ededed;
      padding: 0px 10px;
      ::v-deep .el-button {
        font-size: 20px;
        color: #858585;
      }
    }
  }
  @keyframes example {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
