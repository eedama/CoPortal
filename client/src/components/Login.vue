<template>
  <div class="screen">
    <v-row class="fill-height">
      <v-col cols="12" md="6" md-offset="3" class="mx-auto">
        <v-card :loading="isLoading" class="px-5 py-5">
          <v-content>
            <v-row>
              <v-col cols="12" md="8" offset-md="3" class="mx-auto">
                <v-text-field
                  prepend-inner-icon="mdi-account"
                  v-on:keypress.enter="SubmitLogin"
                  v-model="username"
                  label="Username"
                  type="email"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="8" offset-md="3" class="mx-auto">
                <v-text-field
                  v-on:keypress.enter="SubmitLogin"
                  v-model="password"
                  prepend-inner-icon="mdi-lock"
                  label="Password"
                  @click:append="showPassword = !showPassword"
                  :append-icon="
                    showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
                  "
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="8" offset-md="3" class="mx-auto">
                <v-text-field
                  prepend-inner-icon="mdi-google-classroom"
                  :value="
                    $store.state.settings.school
                      ? $store.state.settings.school
                      : 'School not found'
                  "
                  id="School"
                  label="School"
                  type="text"
                  outlined
                  append-icon="mdi-refresh"
                  @click:append="changeSchool()"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="8" offset-md="3" class="mx-auto">
                <p class="text-center text-red">{{ txtError }}</p>
              </v-col>

              <v-col cols="12" md="8" offset-md="3" class="mx-auto">
                <v-btn
                  :loading="isLoading"
                  v-on:click="SubmitLogin()"
                  block
                  color="secondary"
                >
                  Login
                </v-btn>
              </v-col>
            </v-row>
          </v-content>
          <v-content>
            <v-row v-if="pastUsers && pastUsers.length > 0">
              <v-col cols="12" md="12">
                <label>You can log in as :</label>
              </v-col>
              <v-col cols="12" md="2" v-for="(user, i) in pastUsers" :key="i">
                <input
                  v-if="!isLoading"
                  v-on:click="LoginAsUser(user)"
                  type="submit"
                  :value="user.username"
                  class="btn-flat center-align tg-btn"
                />
              </v-col>
            </v-row>
          </v-content>
        </v-card>
      </v-col>
    </v-row>
    <div class="row valign-wrapper" style="height:80vh">
      <div class="col m6 offset-m3 col s12 center-align">
        <div class="card row z-depth-5">
          <div class="card-image col l8 offset-l2 m6 offset-m3 s12">
            <img class="img-responsive" src="static/img/coPortalLogo.jpg" />
          </div>
          <div class="card-content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";

const axios = require("axios");

export default {
  name: "Login",
  data() {
    return {
      showPassword: false,
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
            swal.fire("Unable to log you in", "Try again later", "error");
          }
        });
    },
    LoginAsUser(user) {
      if (user.type === "PARENT") {
        user.type = "STUDENT";
      }
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

