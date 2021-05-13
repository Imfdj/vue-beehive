import { getList as getProjectList } from '@/api/projectManagement';
import { getList as getTaskTypeList } from '@/api/taskTypeManagement';
import { getList as getTaskStateList } from '@/api/taskStateManagement';
import { getList as getTaskPriorityList } from '@/api/taskPriorityManagement';
import { getList as getTaskTagsList } from '@/api/taskTagManagement';
import { getList as getProjectMembers } from '@/api/user';

const state = {
  projectList: [],
  taskTypes: [],
  taskStates: [],
  taskPrioritys: [],
  taskTags: [],
  projectMembers: [], // 项目成员
  currentProjectId: null, // 当前项目ID
  indexTab: 0, // 项目导航栏的index
};

const getters = {
  currentProject: state => state.projectList.find(item => item.id === state.currentProjectId) || {},
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
  setProjectMembers(state, projectMembers) {
    state.projectMembers = projectMembers;
  },
  setIndexTab(state, indexTab) {
    state.indexTab = indexTab;
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
  async setProjectMembers({ commit, state }) {
    const {
      data: { rows },
    } = await getProjectMembers({ project_id: state.currentProjectId });
    commit('setProjectMembers', rows);
  },
};

export default { state, getters, mutations, actions };
