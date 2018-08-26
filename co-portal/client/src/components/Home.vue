<template>
  <div class="screen">    
    <div class="row">
     <div class="col s6 offset-s3 center-align">
        <h5 class="center-align">
          <vue-typer v-if="!$store.state.user.isLoggedIn" class="center-align" :text='titleText' erase-style='backspace'></vue-typer>
          <span v-if="$store.state.user.isLoggedIn">Welcome back <a class="pointer waves-effect">{{ $store.state.user.username }}</a></span>
        </h5>
      </div> <div class="col s10 offset-s1 m8 offset-m2 center-align">
        <img src="../assets/logo.png" class="responsive-img"> 
      </div>
      
    </div>
    <div class="row">
      <div v-if="!$store.state.user.isLoggedIn" v-on:click="$router.push('/login')" class="col m6 offset-m3 s12 pointer bigButton center-align waves-effect">
        <div class="card-panel hoverable">
          <h5 class="center-align"><i style="font-size:100%" class="material-icons left">lock</i> <span>Login</span></h5>
        </div>
      </div>
    </div>
    <div v-if="$store.state.user.isLoggedIn" class="row">
      <div v-for="(option,i) in options.filter(o => o.auth == null || o.auth.indexOf($store.state.user.type) >= 0)" :key="i" v-on:click="$router.push(option.link)" class="col m4 offset-m1 s6 pointer bigButton center-align waves-effect">
        <div class="card-panel hoverable">
          <h5 class="center-align"><i style="font-size:100%" class="material-icons left">{{ option.icon }}</i> <span>{{ option.text }}</span></h5>
        </div>
      </div>
    </div>
    <div v-if="$store.state.user.isLoggedIn" class="row">
      <div v-on:click="Logout()" class="col m2 offset-m5 s12 pointer center-align waves-effect">
        <div class="card-panel hoverable red">
          <h5 class="text-xs-center">Log out <i class="material-icons right">exit_to_app</i> </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      showEmoji: false,
      txtSearch: "",
      titleText: [
        "Welcome to Co-Portal.",
        "Please login",
        "Contact admin for your login info"
      ],
      options: [
        {
          text: "Profile",
          icon: "account_circle",
          link:
            this.$store.state.user.type +
            "/dashboard/for/" +
            this.$store.state.user.id,
          auth: ["STUDENT", "LECTURER", "ADMIN"]
        },
        {
          text: "Students",
          icon: "people",
          link: "/student/list",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Lecturers",
          icon: "supervised_user_circle",
          link: "/lecturer/list",
          auth: ["ADMIN"]
        },
        {
          text: "Modules",
          icon: "books",
          link: "/module/list",
          auth: ["ADMIN", "LECTURER", "STUDENT"]
        },
        {
          text: "Test list",
          icon: "file_copy",
          link: "/test/list",
          auth: ["STUDENT", "LECTURER", "ADMIN"]
        }
      ]
    };
  },
  methods: {
    Logout() {
      this.$store.commit("logout");
    },
    addEmoji(emoji) {
      alert(this.$emoji);
      this.txtSearch += emoji.native;
      this.showEmoji = !this.showEmoji;
    },
    OpenEmojis(emoji) {
      this.showEmoji = !this.showEmoji;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bigButton :hover {
  background: black;
  color: white;
}

.screen {
  /* The image used */
  background-image: url("../assets/img/plain-white.png");

  /* Full height */
  height: 100vh;
  padding-top: 200px;

  /* Center and scale the image nicely */
  background-position: top;
  background-repeat: no-repeat;
  background-size: fit;
}
</style>
