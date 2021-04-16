<template>
  <div v-if="data.length" class="list-inform">
    <div v-for="item in data" :key="item.id" class="item" @click="select(item)">
      <div class="main">
        <span class="username">{{ item.actor && item.actor.username }}</span>
        <span class="content" v-html="item.content"></span>
      </div>
      <div class="created_at">
        {{ item.created_at }}
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins';

  export default {
    name: 'InformList',
    components: {},
    props: {
      data: {
        type: Array,
        required: true,
      },
    },
    mixins: [mixin],
    data() {
      return {};
    },
    created() {},
    methods: {
      select(item) {
        if (item.url) {
          this.$router.push(item.url);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .list-inform {
    .item {
      padding: 8px 10px;
      border-bottom: 1px solid $colorE5;
      .main {
        padding-bottom: 5px;
        .username {
          display: inline-block;
          margin-right: 5px;
        }
        .content {
          ::v-deep {
            .task-name {
              color: $colorBlue;
              /*display: inline-flex;*/
              /*flex-wrap: wrap;*/
              /*align-items: center;*/
              /*max-width: 200px;*/
              /*overflow: hidden;*/
              /*text-overflow: ellipsis;*/
              /*white-space: nowrap;*/
            }
            .state {
              padding: 0 5px;
            }
          }
        }
      }
      .created_at {
        color: $colorLight;
      }
      &:hover {
        background-color: $colorF5;
        cursor: pointer;
      }
    }
  }
</style>
