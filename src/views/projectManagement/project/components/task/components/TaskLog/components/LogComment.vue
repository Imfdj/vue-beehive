<template>
  <div class="log-comment">
    <div
      v-if="log.content && showMore"
      :class="['content', { 'content-comment': log.is_comment === 1 }]"
      @click="commentClick"
      v-html="log.content"
    >
    </div>
    <div
      v-else
      :class="[
        'content',
        { 'content-comment': log.is_comment === 1, 'ellipsis-content': !showMore && log.is_comment !== 1 },
      ]"
      @click="commentClick"
      v-text="log.content"
    >
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LogComment',
    props: {
      log: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showMore: false,
      };
    },
    methods: {
      commentClick() {
        this.showMore = !this.showMore;
      },
    },
  };
</script>

<style lang="scss">
  .log-comment {
    .content {
      width: calc(100% - 50px);
      padding: 2px 15px 2px 10px;
      margin: 3px 0 3px 26px;
      border-left: 5px solid #6f6f6f;
      cursor: pointer;
    }

    .ellipsis-content {
      border-left: 5px solid #bfbfbf;
      line-height: 30px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .content-comment {
      width: calc(100% - 50px);
      border-left: none;
    }
  }
</style>
