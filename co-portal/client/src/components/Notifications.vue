<template>
  <div class="screen">
    <div class="row">
      <div class="col s6 offset-s3 center-align">
        <h5 class="center-align">
          <vue-typer v-if="!$store.state.user.isLoggedIn" class="center-align" :text='titleText' erase-style='backspace'></vue-typer>
          <span v-if="$store.state.user.isLoggedIn">Welcome back <a class="pointer waves-effect">{{ $store.state.user.username }}</a></span>
        </h5>
      </div>
      <div class="col s10 offset-s1 m8 offset-m2 center-align">
        <img src="../assets/logo.png" class="responsive-img">
      </div>
    </div>
    <div v-if="$store.state.user.isLoggedIn" class="row">
      <div class="col s6 offset-s3 row center-align">
          <div class="card-panel switch">
    <label>
      Show new notifications only
      <input type="checkbox">
      <span class="lever"></span>
      Include seen notifications
    </label>
  </div>
      </div>
      <md-list class="md-triple-line col s12">
        <md-list-item style="margin-bottom:15px" v-for="(announcement,i) in announcements" :key="i" class="hoverable col m6 offset-m3 s10 offset-s1 pointer white center-align waves-effect">
          <md-avatar>
            <img src="https://placeimg.com/40/40/people/1" alt="People">
          </md-avatar>
  
          <div class="md-list-item-text">
            <span>Sirwali Joseph &nbsp;&bull; {{ i + 1 }} hrs ago</span>
            <span>Test reminder</span>
            <p class="flow-text">Do not forget that you are going to be writing a test next week Tuesday</p>
          </div>
  
          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">close</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </div>
        <div v-if="$store.state.user.isLoggedIn" class="row">
      <div v-on:click="$router.push('/')" class="col m2 offset-m5 s12 pointer center-align waves-effect">
        <div class="card-panel hoverable">
          <h5 class="text-xs-center"><i class="material-icons center">home</i> <span>Home</span></h5>
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
        announcements: ['', '', ''],
        showEmoji: false,
        txtSearch: "",
        titleText: [
          "Welcome to Co-Portal.",
          "Please login",
          "Contact admin for your login info"
        ],
        options: [{
            text: "Notifications",
            icon: "notifications",
            link: "/notifications/all",
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
    background-image: url("/static/img/plain-white.png");
    /* Full height */
    height: 200vh;
    padding-top: 200px;
    /* Center and scale the image nicely */
    background-position: top;
    background-repeat: no-repeat;
    background-size: fit;
  }
  
  .notificationRing {
    -webkit-animation: ring 2s infinite;
    animation: ring 2s infinite;
  }
  
  @-webkit-keyframes ring {
    0% {
      -webkit-transform: rotate(35deg);
    }
    12.5% {
      -webkit-transform: rotate(-30deg);
    }
    25% {
      -webkit-transform: rotate(25deg);
    }
    37.5% {
      -webkit-transform: rotate(-20deg);
    }
    50% {
      -webkit-transform: rotate(15deg);
    }
    62.5% {
      -webkit-transform: rotate(-10deg);
    }
    75% {
      -webkit-transform: rotate(5deg);
    }
    100% {
      -webkit-transform: rotate(0deg);
    }
  }
  
  @keyframes ring {
    0% {
      -webkit-transform: rotate(35deg);
      transform: rotate(35deg);
    }
    12.5% {
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }
    25% {
      -webkit-transform: rotate(25deg);
      transform: rotate(25deg);
    }
    37.5% {
      -webkit-transform: rotate(-20deg);
      transform: rotate(-20deg);
    }
    50% {
      -webkit-transform: rotate(15deg);
      transform: rotate(15deg);
    }
    62.5% {
      -webkit-transform: rotate(-10deg);
      transform: rotate(-10deg);
    }
    75% {
      -webkit-transform: rotate(5deg);
      transform: rotate(5deg);
    }
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
  }
</style>
