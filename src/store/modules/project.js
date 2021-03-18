import { getList as getProjectList } from '@/api/projectManagement';
import { getList as getTaskTypeList } from '@/api/taskTypeManagement';
import { getList as getTaskStateList } from '@/api/taskStateManagement';
import { getList as getTaskPriorityList } from '@/api/taskPriorityManagement';
import { getList as getTaskTagsList } from '@/api/taskTagManagement';
import { getList as getParticipators } from '@/api/userManagement';

const state = {
  projectList: [],
  taskTypes: [],
  taskStates: [],
  taskPrioritys: [],
  taskTags: [],
  participators: [],
  currentProjectId: null,
};
const mutations = {
  setProjectList(state, projectList) {
    state.projectList = projectList;
  },
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
  setCurrentProjectId(state, currentProjectId) {
    state.currentProjectId = currentProjectId;
  },
  setParticipators(state, participators) {
    state.participators = participators;
  },
};
const actions = {
  async setProjectList({ commit }) {
    const {
      data: { rows },
    } = await getProjectList({
      limit: 1000,
      is_recycle: 0,
    });
    commit('setProjectList', rows);
  },
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
  async setTaskTags({ commit, state }) {
    const {
      data: { rows },
    } = await getTaskTagsList({ project_id: state.currentProjectId });
    commit('setTaskTags', rows);
  },
  async setParticipators({ commit, state }) {
    const {
      data: { rows },
    } = await getParticipators({ project_id: state.currentProjectId });
    commit('setParticipators', rows);
  },
};

export default { state, mutations, actions };
