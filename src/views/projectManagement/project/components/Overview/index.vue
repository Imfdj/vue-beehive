<template>
  <div class="overview">
    <TaskStatisticsEcharts :statisticsData="statisticsData"></TaskStatisticsEcharts>
    <ProjectLog></ProjectLog>
    <ProjectInfo :statisticsData="statisticsData"></ProjectInfo>
  </div>
</template>

<script>
  import TaskStatisticsEcharts from './components/TaskStatisticsEcharts';
  import ProjectLog from './components/ProjectLog';
  import ProjectInfo from './components/ProjectInfo';
  import { getStatistics } from '@/api/projectManagement';
  import { mapState } from 'vuex';

  export default {
    name: 'Overview',
    components: {
      TaskStatisticsEcharts,
      ProjectLog,
      ProjectInfo,
    },
    data() {
      return {
        statisticsData: {},
      };
    },
    computed: {
      ...mapState('project', ['currentProjectId']),
    },
    created() {
      this.getStatistics();
    },
    methods: {
      async getStatistics() {
        const { data } = await getStatistics({ id: this.currentProjectId });
        this.statisticsData = data;
      },
    },
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
