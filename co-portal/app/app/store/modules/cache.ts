const state = {
  lastUpdated: null,
  cachedUser: null,
  cachedUserString: "buyfeiowjefruhenijwfoepoobsenllnbsllsae"
};

const mutations = {
  refreshCache(state, obj) {
    var docId = obj.appSettings.getString(state.cachedUserString);
    if (docId != null) {
      state.cachedUser = obj.db.getDocument(docId);
    }
  },
  cacheUser(state, obj) {
    state.cachedUser = obj.user;
    var docId = obj.appSettings.getString(state.cachedUserString);
    if (docId != null) {
      obj.db.deleteDocument(docId);
    }
    docId = obj.db.createDocument(obj.user);
    obj.appSettings.setString(state.cachedUserString, docId);
  },
  clearCache(state, obj) {
    state.cachedUser = null;
    var docId = obj.appSettings.getString(state.cachedUserString);
    if (docId != null) {
      obj.db.deleteDocument(docId);
    }
  }
};

const actions = {};

export default {
  state,
  mutations,
  actions
};
