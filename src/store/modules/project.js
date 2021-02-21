import { getList as getTaskTypeList } from '@/api/taskTypeManagement';
import { getList as getTaskStateList } from '@/api/taskStateManagement';
import { getList as getTaskPriorityList } from '@/api/taskPriorityManagement';
import { getList as getTaskTagsList } from '@/api/taskTagManagement';

const state = {
  taskTypes: [],
  taskStates: [],
  taskPrioritys: [],
  taskTags: [],
};
const mutations = {
  setTaskTypes(state, taskTypes) {
    state.taskTypes = taskTypes;
  },
  setTaskStates(state, taskStates) {
    state.taskStates = taskStates;
  },
  setTaskPrioritys(state, taskPrioritys) {
    state.taskPrioritys = taskPrioritys;
  },
  setTaskTags(state, taskTags) {
    state.taskTags = taskTags;
  },
};
const actions = {
  async setTaskTypes({ commit }) {
    const {
      data: { rows },
    } = await getTaskTypeList({
      prop_order: 'sort',
      order: 'desc',
    });
    commit('setTaskTypes', rows);
  },
  async setTaskStates({ commit }) {
    const {
      data: { rows },
    } = await getTaskStateList({
      prop_order: 'sort',
      order: 'desc',
    });
    commit('setTaskStates', rows);
  },
  async setTaskPrioritys({ commit }) {
    const {
      data: { rows },
    } = await getTaskPriorityList({
      prop_order: 'sort',
      order: 'desc',
    });
    commit('setTaskPrioritys', rows);
  },
  async setTaskTags({ commit }, payload) {
    console.log(333);
    console.log(333);
    console.log(333);
    console.log(payload);
    const {
      data: { rows },
    } = await getTaskTagsList(payload);
    commit('setTaskTags', rows);
  },
};

export default { state, mutations, actions };
