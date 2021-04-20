<template>
  <div>
    <canvas ref="canvas" class="canvas"></canvas>
    <img v-show="false" ref="logo" src="@/assets/logo.png" alt="" />
  </div>
</template>

<script>
  import S from './shape-shifter';
  import { title } from '@/config/settings';

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
      console.log(33);
      console.log(33);
      console.log(33);
      console.log(this.$refs.logo);
      console.log(this.$refs.logo.src);
      console.log(this.$refs.logo.target?.src);
      const src = this.$refs.logo.src || this.$refs.logo.target?.src || '';
      const publicPath = src.substring(0, src.indexOf('static/img'));
      console.log(publicPath);
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
