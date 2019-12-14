import { ActionTree, MutationTree } from 'vuex';

const state: CollectionStateType = {
  notifications: {
    all: [],
    lastUpdated: null
  },
  transactions: {
    all: [],
    lastUpdated: null
  },
  documents: {
    all: [],
    lastUpdated: null
  },
  tasks: {
    all: [],
    lastUpdated: null
  },
  lastUpdated: null
};

const mutations: MutationTree<CollectionStateType> = {
  PopulateNotifications(state, obj: any) {
    state.notifications.all = obj.notifications;
    state.notifications.lastUpdated = new Date();
  },
  PopulateTransactions(state, obj: any) {
    state.transactions.all = obj.transactions;
    state.transactions.lastUpdated = new Date();
  },
  PopulateTasks(state, obj: any) {
    state.tasks.all = obj.tasks;
    state.tasks.lastUpdated = new Date();
  }
};

const actions: ActionTree<CollectionStateType, any> = {
  PopulateNotifications: ({ commit, state }, obj) => commit('PopulateNotifications', obj),
  PopulateTransactions: ({ commit, state }, obj) => commit('PopulateTransactions', obj),
  PopulateTasks: ({ commit, state }, obj) => commit('PopulateTasks', obj),
};

export default {
  state,
  mutations,
  actions
};
