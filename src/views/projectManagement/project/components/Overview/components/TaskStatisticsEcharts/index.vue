<template>
  <div class="task-statistics-echarts">
    <div>
      <v-chart class="chart" :option="optionTaskState" />
    </div>
    <div>
      <v-chart class="chart" :option="optionTaskPriority" />
    </div>
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
        optionTaskState: {
          title: {
            text: '任务执行状态',
            left: 'center',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          tooltip: {
            trigger: 'item',
            showDelay: 10,
          },
          series: [
            {
              name: '任务执行状态',
              type: 'pie',
              radius: '60%',
              itemStyle: {
                borderRadius: 3,
                borderColor: '#fff',
                borderWidth: 1,
              },
              data: [],
            },
          ],
        },
        optionTaskPriority: {
          title: {
            text: '任务优先级',
            left: 'center',
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          tooltip: {
            trigger: 'item',
            showDelay: 10,
          },
          series: [
            {
              name: '任务优先级',
              type: 'pie',
              radius: ['30%', '60%'],
              itemStyle: {
                borderRadius: 3,
                borderColor: '#fff',
                borderWidth: 2,
              },
              data: [],
            },
          ],
        },
      };
    },
    computed: {
      ...mapState('project', ['taskStates', 'taskPrioritys']),
    },
    watch: {
      statisticsData(newValue, oldValue) {
        const optionTaskStateData = [];
        const { taskState, taskPriority } = newValue;
        const taskStatesList = this.$baseLodash.groupBy(this.taskStates, 'id');
        for (const taskStateKey in taskState) {
          optionTaskStateData.push({
            value: taskState[taskStateKey],
            name: taskStatesList[taskStateKey][0]?.name,
            itemStyle: {
              color: taskStatesList[taskStateKey][0]?.color,
            },
          });
        }
        this.optionTaskState.series[0].data = optionTaskStateData;

        const optionTaskPriorityData = [];
        const taskPrioritysList = this.$baseLodash.groupBy(this.taskPrioritys, 'id');
        for (const taskPriorityKey in taskPriority) {
          optionTaskPriorityData.push({
            value: taskPriority[taskPriorityKey],
            name: taskPrioritysList[taskPriorityKey][0]?.name,
            itemStyle: {
              color: taskPrioritysList[taskPriorityKey][0]?.color,
            },
          });
        }
        this.optionTaskPriority.series[0].data = optionTaskPriorityData;
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
    display: flex;
    & div {
      flex: 1;
    }
  }
</style>
