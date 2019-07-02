<template>
  <div class="screen">
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="$router.back()" class="right">
          <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
    <div class="row valign-wrapper" style="height:80vh">
      <div class="col m6 offset-m3 col s12 center-align">
        <div class="card row z-depth-5">
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12">
            <img class="img-responsive" src="static/img/coPortalLogo.jpg" />
          </div>
          <div class="card-content">
            <div class="row">
              <div class="input-field col s8 offset-s2 m8 offset-m2 text-center">
                <i class="material-icons prefix">account_circle</i>
                <input
                  v-on:keypress.enter="SubmitLogin"
                  v-model="username"
                  id="Username"
                  name="Username"
                  type="text"
                />
                <label class="text-center" for="Username">Username</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s8 offset-s2 m8 offset-m2 text-center">
                <i class="material-icons prefix">lock</i>
                <input
                  v-on:keypress.enter="SubmitLogin"
                  v-model="password"
                  id="Password"
                  name="Password"
                  type="password"
                />
                <label class="text-center" for="Password">Password</label>
              </div>
            </div>
            <div @click="changeSchool()" class="row">
              <div class="input-field col s8 offset-s2 m8 offset-m2 text-center">
                <i class="material-icons prefix">school</i>
                <input
                  disabled
                  :value="$store.state.settings.school ? $store.state.settings.school : 'School not found' "
                  id="School"
                  name="School"
                  type="text"
                />
                <label class="text-center active" for="School">School</label>
              </div>
            </div>
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
            <div class="row">
              <div class="col s8 offset-s2 m6 offset-m3 center-align text-center">
                <input
                  v-if="!isLoading"
                  v-on:click="SubmitLogin()"
                  type="submit"
                  value="Login"
                  class="btn center-align tg-btn"
                />
                <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
              </div>
            </div>
            <div v-if="pastUsers && pastUsers.length > 0" class="row">
              <div class="col s12 left-align">
                <label>You can log in as :</label>
              </div>
              <div class="col s2" v-for="(user,i) in pastUsers" :key="i">
                <input
                  v-if="!isLoading"
                  v-on:click="LoginAsUser(user)"
                  type="submit"
                  :value="user.username"
                  class="btn-flat center-align tg-btn"
                />
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
      txtError: "",
      isLoading: false,
      pastUsers: []
    };
  },
  mounted() {
    this.pastUsers = this.$session.get("users");
  },
  methods: {
    SubmitLogin() {
      this.isLoading = true;
      this.txtError = "";
      if (this.password.length == 0)
        this.txtError = "Please enter a valid password";
      if (this.username.length == 0)
        this.txtError = "Please enter a valid user name";
      if (this.txtError.length != 0) {
        this.isLoading = false;
        return;
      }

      axios
        .post(this.$store.state.settings.baseLink + "/acc/login", {
          username: this.username,
          password: this.password
        })
        .then(results => {
          this.isLoading = false;
          this.Login(results);
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to log you in", "Try again later", "error");
          }
        });
    },
    LoginAsUser(user) {
      this.$store.commit("login", user);
      this.$router.push("/");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.screen {
  /* The image used */
  background-image: url("/static/img/cupOfCoffee.jpg");
  /* Full height */
  height: 100vh;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>

