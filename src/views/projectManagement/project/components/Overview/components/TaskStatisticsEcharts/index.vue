<template>
  <div class="task-statistics-echarts">
    <v-chart class="chart" :option="option" />
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'TaskStatisticsEcharts',
    components: {},
    props: {
      statisticsData: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        option: {
          title: {
            text: '任务状态',
            left: 'center',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              name: '面积模式',
              type: 'pie',
              radius: '60%',
              data: [],
            },
          ],
        },
      };
    },
    computed: {
      ...mapState('project', ['taskStates']),
    },
    watch: {
      statisticsData(newValue, oldValue) {
        const data = [];
        const { taskState } = newValue;
        const taskStatesList = this.$baseLodash.groupBy(this.taskStates, 'id');
        for (const taskStateKey in taskState) {
          data.push({
            value: taskState[taskStateKey],
            name: taskStatesList[taskStateKey][0]?.name,
            itemStyle: {
              color: taskStatesList[taskStateKey][0]?.color,
            },
          });
        }
        this.option.series[0].data = data;
      },
    },
    created() {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .task-statistics-echarts {
    width: 100%;
    height: 300px;
    background-color: #fff;
    margin-bottom: 20px;
    border-radius: 8px;
    padding: 10px;
  }
</style>
