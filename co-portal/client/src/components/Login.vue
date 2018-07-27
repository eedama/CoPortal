<template>
<div>
    <div class="row valign-wrapper" style="height:80vh">
        <div class="col m6 offset-m3 col s12 center-align">
            <div class="card row">
                <div class="card-image col l8 offset-l2 m6 offset-m3 s12">
                    <img class="img-responsive" src="static/img/coPortalLogo.jpg">
                </div>
                <div class="card-content">
                    <div class="row">
                        <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                            <input v-on:keypress.enter="SubmitLogin" v-model="username" id="Username" name="Username" type="text" />
                            <label class="text-center" for="Username">Username</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                            <input v-on:keypress.enter="SubmitLogin" v-model="password" id="Password" name="Password" type="password" />
                            <label class="text-center" for="Password">Password</label>
                        </div>
                    </div>
                    <div class="row" v-show="txtError.length > 0">
                        <div class="col s8 offset-s2 m6 offset-m3 text-center">
                            <label class="text-center red-text">{{ txtError }}</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s8 offset-s2 m6 offset-m3 text-center">
                            <input v-on:click="SubmitLogin()" type="submit" value="Login" class="btn center-align tg-btn" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>

<script>
import swal from "sweetalert";

const axios = require("axios");

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      txtError: ""
    };
  },
  mounted() {
    var elems = document.querySelectorAll(".datepicker");
    var instances = this.$materialize.Datepicker.init(elems);
  },
  methods: {
    SubmitLogin() {
      this.txtError = "";
      if (this.password.length == 0)
        this.txtError = "Please enter a valid password";
      if (this.username.length == 0)
        this.txtError = "Please enter a valid user name";
      if (this.txtError.length != 0) return;

      axios
        .post(this.$store.state.settings.baseLink + "/acc/login", {
          username: this.username,
          password: this.password
        })
        .then(results => {
          switch (results.data.userType) {
            case "ADMIN":
              this.$store.commit("login", {
                id: results.data.user._id,
                username: results.data.user.username,
                password: results.data.user.password,
                type: "ADMIN",
                isLoggedIn: true
              });
              break;
            case "LECTURER":
              this.$store.commit("login", {
                id: results.data.user._id,
                username: results.data.user.username,
                password: results.data.user.password,
                type: "LECTURER",
                isLoggedIn: true
              });
              this.$router.push("/");
              break;
            case "STUDENT":
              this.$store.commit("login", {
                id: results.data.user._id,
                username: results.data.user.username,
                password: results.data.user.password,
                type: "STUDENT",
                isLoggedIn: true
              });
              break;
          }
          alert(this.$store.state.user.type);
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to log you in", "Try again later", "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.p-10 {
  padding: 10px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.pointer {
  cursor: pointer;
}

.selectedTag {
  background-color: #42b983 !important;
}
</style>

