<template>
  <el-menu-item :index="handlePath(routeChildren.path)" @click.native="handleLink">
    <i v-if="routeChildren.meta.icon" :class="routeChildren.meta.icon" style="margin-right: 5px"></i>
    <span slot="title">{{ routeChildren.meta.title }} </span>
    <el-tag v-if="routeChildren.meta && routeChildren.meta.badge" type="danger" effect="dark"
      >{{ routeChildren.meta.badge }}
    </el-tag>
  </el-menu-item>
</template>

<script>
  import { isExternal } from '@/utils/validate';
  import path from 'path';

  export default {
    name: 'MenuItem',
    props: {
      routeChildren: {
        type: Object,
        default() {
          return null;
        },
      },
      item: {
        type: Object,
        default() {
          return null;
        },
      },
      fullPath: {
        type: String,
        default: '',
      },
    },
    methods: {
      handlePath(routePath) {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(this.fullPath)) {
          return this.fullPath;
        }
        console.log(666);
        console.log(this.fullPath, routePath);
        return path.resolve(this.fullPath, routePath);
      },
      handleLink() {
        const routePath = this.routeChildren.path;
        const target = this.routeChildren.meta.target;

        if (target === '_blank') {
          if (isExternal(routePath)) {
            window.open(routePath);
          } else if (isExternal(this.fullPath)) {
            window.open(this.fullPath);
          } else if (this.$route.path !== path.resolve(this.fullPath, routePath)) {
            let routeData = this.$router.resolve(path.resolve(this.fullPath, routePath));
            window.open(routeData.href);
          }
        } else {
          if (isExternal(routePath)) {
            window.location.href = routePath;
          } else if (isExternal(this.fullPath)) {
            window.location.href = this.fullPath;
          } else if (this.$route.path !== path.resolve(this.fullPath, routePath)) {
            console.log(999);
            console.log(this.fullPath);
            console.log(routePath);
            console.log(path.resolve(this.fullPath, routePath));
            this.$router.push(path.resolve(this.fullPath, routePath));
          }
        }
      },
    },
  };
</script>
