<template>
  <div class="task-list">
    <div class="wrap-item">
      <draggable class="list-group" :list="list1" group="people" @change="log">
        <div v-for="(element, index) in list1" :key="element.name" class="list-group-item">
          {{ element.name }} {{ index }}
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';

  export default {
    name: 'TaskList',
    components: {
      draggable,
    },
    data() {
      return {
        list1: [
          { name: 'John', id: 1 },
          { name: 'Joao', id: 2 },
          { name: 'Jean', id: 3 },
          { name: 'Gerard', id: 4 },
        ],
      };
    },
  };
</script>

<style lang="scss" scoped>
  .task-list {
    .list-group {
      .list-group-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 200px;
        height: 30px;
        box-shadow: 0px 0px 3px #ccc;
      }
    }
  }
</style>
