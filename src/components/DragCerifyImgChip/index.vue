<template>
  <div v-loading="loading" v-show="visible" class="wrap-drag-verify-img-chip" @click.stop="doClick">
    <drag-verify-img-chip
      ref="dragVerify"
      :imgsrc="imgsrcArr[imgsrcIndex]"
      :isPassing.sync="isPassing"
      :showRefresh="false"
      :width="300"
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
    <img v-show="false" :src="imgsrcArr[imgsrcIndex]" @load="onload" alt="" />
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
        isPassing: false,
        imgsrcIndexBox: [],
        imgsrcIndex: 0,
        imgsrcArr: [
          'static/img/dragChipImgs/1.jpg',
          'static/img/dragChipImgs/2.jpg',
          'static/img/dragChipImgs/3.jpg',
          'static/img/dragChipImgs/4.jpg',
          'static/img/dragChipImgs/5.jpg',
          'static/img/dragChipImgs/6.jpg',
          'static/img/dragChipImgs/7.jpg',
          'static/img/dragChipImgs/8.jpg',
          'static/img/dragChipImgs/9.jpg',
        ],
      };
    },
    async created() {
      this.setImgsrcIndexBox();
      this.doRefresh();
    },
    methods: {
      show() {
        this.visible = true;
        const ref = this.$refs.dragVerify;
        if (ref) ref.reset();
      },
      close() {
        this.visible = false;
      },
      setImgsrcIndexBox() {
        this.imgsrcIndexBox = this.imgsrcArr.map((item, index) => index);
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
        // this.loading = true;
        const index = parseInt(Math.random() * 1000) % this.imgsrcIndexBox.length;
        this.imgsrcIndex = this.imgsrcIndexBox[index];
        this.imgsrcIndexBox.splice(index, 1);
        if (this.imgsrcIndexBox.length === 0) {
          this.setImgsrcIndexBox();
        }
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
