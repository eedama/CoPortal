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
      <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
      </div>
      <md-list class="md-triple-line col s12">
        <md-list-item style="margin-bottom:15px" v-for="(announcement,i) in announcements" :key="i" class="hoverable col m6 offset-m3 s10 offset-s1 pointer white center-align waves-effect">
          <md-avatar>
            <img src="https://placeimg.com/40/40/people/1" alt="People">
          </md-avatar>
  
          <div class="md-list-item-text">
            <span>{{ announcement.lecturerId ?  announcement.lecturerId.lastname + " " + announcement.lecturerId.firstname : "Admin" }} &nbsp;&bull; {{ getMoment(announcement.date).fromNow() }}</span>
            <span>{{ announcement.title }}</span>
            <p>{{ announcement.message }}</p>
          </div>
  
          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">thumb_up</md-icon>
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
const axios = require("axios");
export default {
  name: "Home",
  data() {
    return {
      announcements: [],
      isLoading: false
    };
  },
  mounted() {
    this.isLoading = true;
    axios
      .post(
        this.$store.state.settings.baseLink +
          "/n/announcements/get/for/" +
          this.$store.state.user.id,
        {
          userType: this.$store.state.user.type,
          moduleID: null
        }
      )
      .then(results => {
        this.isLoading = false;
        console.log(results.data);
        this.announcements = results.data;
      })
      .catch(err => {
        this.isLoading = false;
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal(err.message, "Try again later", "error");
        }
      });
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
