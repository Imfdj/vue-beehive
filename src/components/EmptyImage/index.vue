<template>
  <div class="empty-image" :style="`height: ${height}px;`">
    <img class="empty" src="../../assets/imgs/empty.png" :height="heightImg" alt="" />
    <div v-if="text" class="text">{{ text }}</div>
  </div>
</template>

<script>
  import mixin from '@/mixins';

  export default {
    name: 'EmptyImage',
    components: {},
    mixins: [mixin],
    props: {
      height: {
        type: Number,
        default: 339,
      },
      heightImg: {
        type: Number,
        default: 339,
      },
      text: {
        type: String,
        default: '空空如也...',
      },
    },
    data() {
      return {};
    },
    created() {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .empty-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .text {
      line-height: 40px;
      font-size: 16px;
      padding-left: 20px;
      color: $colorLight;
    }
  }
</style>
