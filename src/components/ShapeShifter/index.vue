<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script>
  import S from './shape-shifter';
  import { title, publicPath } from '@/config/settings';

  export default {
    name: 'index',
    data() {
      return {};
    },
    computed: {
      logoTitle() {
        return title.charAt(0).toUpperCase() + title.slice(1);
      },
    },
    mounted() {
      // 设置icon图片前缀路径
      S.ShapeBuilder.setPublicPath(publicPath);
      S.init(this.$refs.canvas);

      // S.UI.simulate('Shape|Shifter|Type|to start|#icon thumbs-up|#countdown 3||');

      S.Drawing.loop(function () {
        S.Shape.render();
      });
    },
    destroyed() {
      S.Drawing.cancelAnimationFrame();
    },
    methods: {
      simulate(string) {
        S.UI.simulate(string);
      },
    },
  };
</script>

<style scoped></style>
