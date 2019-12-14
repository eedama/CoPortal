import { ActionTree, MutationTree } from 'vuex';

const state: UserStateType = {
  username: "admin",
  id: "",
  password: "admin",
  email: "admin@gmail.com",
  numbers: "0760487292",
  type: null,
  profilePic: null,
  isLoggedIn: false,
  isAdmin: false,
  isParent: false,
  parent: {},
  parentStudents: []
};

const mutations: MutationTree<UserStateType> = {
  setParent(state, isParrent) {
    state.isParent = isParrent;
  },
  setStudentParent(state, parent) {
    state.parent = parent;
  },
  setParentStudents(state, students) {
    state.parentStudents = students;
  },
  login(state, user) {
    state.id = user.id;
    state.username = user.username;
    state.password = user.password;
    state.email = user.email;
    state.numbers = user.numbers;
    state.profilePic = user.profilePic;
    state.type = user.type;
    state.isLoggedIn = user.isLoggedIn;
  },
  logout(state, self) {
    state.id = null;
    state.username = null;
    state.password = null;
    state.email = null;
    state.numbers = null;
    state.profilePic = null;
    state.type = null;
    state.isLoggedIn = false;
    state.isAdmin = false;
    state.parent = {};
    state.isParent = false;
    state.parentStudents = [];
  }
};

const actions: ActionTree<any, any> = {
  login: ({ commit }) => commit("login"),
  logout: ({ commit }) => commit("logout")
};

export default {
  state,
  mutations,
  actions
};
