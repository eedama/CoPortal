const state = {
  lastUpdated: null,
  cachedUser: null,
  cachedUserString: "buyfeiowjefruhenijwfoepoobsenllnbsllsae"
};

const mutations = {
  refreshCache(state, obj) {
    console.log("Testing....");
    var docId = obj.appSettings.getString(state.cachedUserString);
    if (docId != null) {
      state.cachedUser = obj.db.getDocument(docId);
      console.log("adminid", state.cachedUser.user._id);
      try {
        alert(obj.appSettings.getString("device_token"));
        if (
          state.cachedUser &&
          state.cachedUser.user &&
          obj.appSettings.getString("device_token") &&
          (state.cachedUser.device_token !=
            obj.appSettings.getString("device_token") ||
            !state.cachedUser.device_token)
        ) {
          state.cachedUser.device_token = obj.appSettings.getString(
            "device_token"
          );
          obj.api
            .addUserDeviceToken(
              state.cachedUser.user._id,
              state.cachedUser.device_token
            )
            .then(response => {
              var statusCode = response.statusCode;
              if (statusCode != 200) {
                var error = response.content;
                throw new Error(error);
              }
            })
            .catch(err => {
              console.log("ADDTOKEN-error", err);
            });
        }
      } catch (errr) {
        console.log("errr", errr);
      }
    }
  },
  cacheUser(state, obj) {
    console.log("adminid in.....");
    state.cachedUser = obj.user;
    var docId = obj.appSettings.getString(state.cachedUserString);
    if (docId != null) {
      obj.db.deleteDocument(docId);
    }
    docId = obj.db.createDocument(obj.user);
    obj.appSettings.setString(state.cachedUserString, docId);
    try {
      if (
        state.cachedUser &&
        state.cachedUser.user &&
        obj.appSettings.getString("device_token") &&
        (state.cachedUser.device_token !=
          obj.appSettings.getString("device_token") ||
          !state.cachedUser.device_token)
      ) {
        state.cachedUser.device_token = obj.appSettings.getString(
          "device_token"
        );
        alert("Inside");
        obj.api
          .addUserDeviceToken(
            state.cachedUser.user._id,
            state.cachedUser.device_token
          )
          .then(response => {
            var statusCode = response.statusCode;
            if (statusCode != 200) {
              var error = response.content;
              throw new Error(error);
            }
          })
          .catch(err => {
            console.log("ADDTOKEN-error", err);
          });
      }
    } catch (errr) {
      console.log("errr", errr);
    }
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
