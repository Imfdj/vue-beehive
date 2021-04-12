<template>
  <div class="overview">
    <ProjectLog></ProjectLog>
    <ProjectInfo></ProjectInfo>
  </div>
</template>

<script>
  import ProjectLog from './components/ProjectLog';
  import ProjectInfo from './components/ProjectInfo';

  export default {
    name: 'Overview',
    components: {
      ProjectLog,
      ProjectInfo,
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .overview {
    display: flex;
    flex-wrap: wrap;
    width: 1076px;
    min-height: 100%;
    margin: 0 auto;
  }
</style>
