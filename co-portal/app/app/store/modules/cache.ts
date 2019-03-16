const state = {
  lastUpdated: null,
  cachedUser: null,
  deviceToken: null,
  cachedUserString: "buyfeiowjefruhenijwfoepoobsenllnbsllsae"
};

const mutations = {
  refreshCache(state, obj) {
    var docId = obj.appSettings.getString(state.cachedUserString);
    if (docId != null) {
      state.cachedUser = obj.db.getDocument(docId);
      try {
        alert(obj.appSettings.getString("device_token"));
        if (
          state.cachedUser &&
          state.cachedUser.user &&
          obj.appSettings.getString("device_token") &&
          state.deviceToken != obj.appSettings.getString("device_token")
        ) {
          state.deviceToken = obj.appSettings.getString("device_token");
          obj.api
            .addUserDeviceToken(state.cachedUser.user._id, state.deviceToken)
            .then(response => {
              var statusCode = response.statusCode;
              if (statusCode != 200) {
                var error = response.content;
                throw new Error(error);
              } else {
                console.log(
                  "device_token_response",
                  response.content.toString()
                );
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
        state.deviceToken != obj.appSettings.getString("device_token")
      ) {
        state.deviceToken = obj.appSettings.getString("device_token");
        obj.api
          .addUserDeviceToken(state.cachedUser.user._id, state.deviceToken)
          .then(response => {
            var statusCode = response.statusCode;
            if (statusCode != 200) {
              var error = response.content;
              throw new Error(error);
            } else {
              console.log(
                "device_token_response_2",
                response.content.toString()
              );
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
