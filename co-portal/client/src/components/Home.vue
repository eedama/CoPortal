<template>
  <div class="screen">
  
    <md-dialog v-if="$store.state.user.isLoggedIn && ($store.state.user.type=='LECTUERE' || $store.state.user.type=='ADMIN')" style="position:absolute;top:25%;width:100%" class="card" :md-active.sync="isAddingAnnouncements">
      <md-card class="col s12">
        <md-card-header>
          <div class="md-title">Send a announcement</div>
          <md-button v-on:click="isAddingAnnouncements = false" class="right">
            <md-icon>close</md-icon>
          </md-button>
        </md-card-header>
        <md-content>
          <div class="row">
            <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
              <input v-model="announcement.title" id="ModuleDescription" name="ModuleDescription" type="text" />
              <label class="text-center" for="ModuleDescription">Title</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
              <input v-model="announcement.message" id="ModuleDescription" name="ModuleDescription" type="text" />
              <label class="text-center" for="ModuleDescription">Message</label>
            </div>
          </div>
          <div class="row">
            <div class="col s8 offset-s2 m6 offset-m3 text-center">
              <label>Send to : </label>
            </div>
            <div class="col s8 offset-s2 m6 offset-m3 text-center">
              <form action="#">
                <p v-for="(module,i) in modules" :key="i">
                  <label>
                               <input v-model="announcement.module" :value="module._id" class="with-gap" name="group1" type="radio" />
                               <span>{{ module.name }} ({{ module.code }}) students</span>
                             </label>
                </p>
                <p>
                  <label>
                                 <input v-model="announcement.module" :value="null" class="with-gap" name="group1" type="radio" checked />
                                 <span>All Students</span>
                               </label>
                </p>
              </form>
            </div>
          </div>
        </md-content>
      </md-card>
      <md-card-actions>
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
        <md-button v-if="!isLoading" v-on:click="SendAnnouncement()" class="md-primary">Send announcement</md-button>
      </md-card-actions>
    </md-dialog>
  
    <div class="row">
      <div class="col s6 offset-s3 m8 offset-m2 center-align">
        <h5 class="center-align">
          <vue-typer v-if="!$store.state.user.isLoggedIn" class="center-align" :text='titleText' erase-style='backspace'></vue-typer>
          <span v-if="$store.state.user.isLoggedIn">Welcome back <a class="pointer waves-effect">{{ $store.state.user.username }}</a></span>
        </h5>
      </div>
      <div class="col s10 offset-s1 m8 offset-m2 center-align">
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
      <div class="col s12 m6 xl4 push-xl2">
  
        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <md-card-header class="left">Annnouncements</md-card-header>
        </div>
        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
        </div>
        <md-list class="md-triple-line col s12 center-align">
          <div class="Scroll-first-four">
            <md-list-item v-if="$store.state.user.type == 'LECTURER' || $store.state.user.type == 'ADMIN'" v-on:click="isAddingAnnouncements = true" style="margin-bottom:15px" class="hoverable col s12 m10 pointer white center-align waves-effect">
              <md-avatar>
                <md-icon>add</md-icon>
              </md-avatar>
  
              <div class="md-list-item-text center-align">
                <span>Add new Announcement</span>
              </div>
            </md-list-item>
            <md-list-item v-on:click="AnnouncementClick(announcement)" style="margin-bottom:15px;" v-for="(announcement,i) in announcements" :key="i" class="hoverable col s12 m10 pointer white center-align waves-effect">
              <md-avatar>
                <img src="https://placeimg.com/40/40/people/1" alt="People">
              </md-avatar>
  
              <div class="md-list-item-text">
                <span>{{ announcement.lecturerId ?  announcement.lecturerId.lastname + " " + announcement.lecturerId.firstname : "Admin" }} &nbsp;&bull; {{ getMoment(announcement.date).fromNow() }}</span>
                <span>{{ announcement.title }}</span>
                <p>{{ announcement.message }}</p>
              </div>
              
            </md-list-item>
          </div>
        </md-list>
      </div>
      <div class="col s12 m6 xl4 push-xl2 row" style="margin-top:-6px;">
        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <md-card-header class="left">Portal</md-card-header>
        </div>
        <div v-for="(option,i) in options.filter(o => o.auth == null || o.auth.indexOf($store.state.user.type) >= 0)" :key="i" v-on:click="$router.push(option.link)" class="col s12 l8 pointer bigButton waves-effect">
          <div class="card-panel hoverable">
            <h5 class="center-align">
              <i style="font-size:100%" class="material-icons left">{{ option.icon }}</i>
              <span>{{ option.text }}</span></h5>
          </div>
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
import swal from "sweetalert";
const axios = require("axios");
export default {
  name: "Home",
  data() {
    return {
      announcement: {
        title: "",
        message: "",
        isToAll: true,
        moduleID: null
      },
      announcements: [],
      modules: [],
      isAddingAnnouncements: false,
      showEmoji: false,
      isLoading: false,
      txtSearch: "",
      titleText: [
        "Welcome to Co-Portal.",
        "Please login",
        "Contact admin for your login info"
      ],
      options: [
        {
          text: "My profile",
          icon: "person",
          link: "/",
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
          text: "Marks",
          icon: "done_all",
          link: "/marks/all",
          auth: ["STUDENT"]
        },
        {
          text: "Assessment results",
          icon: "done_all",
          link: "/marks/sheet",
          auth: ["LECTURER", "ADMIN"]
        }
      ]
    };
  },
  mounted() {
    if (this.$store.state.user.isLoggedIn) {
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
          this.announcements = results.data.reverse();
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal(err.message, "Try again later", "error");
          }
        });
      if (
        this.$store.state.user.type == "LECTURER" ||
        this.$store.state.user.type == "ADMIN"
      ) {
        this.isLoading = true;
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/m/modules/all/for/" +
              this.$store.state.user.id +
              "/" +
              this.$store.state.user.type
          )
          .then(results => {
            this.isLoading = false;
            this.modules = results.data;
            this.modules.map(s => {
              s.show = true;
            });
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal(err.response.data, "error");
            } else {
              swal("Unable to load modules", "Try again later", "error");
            }
          });
      }
    }
  },
  methods: {
    AnnouncementClick(announcement) {
      swal({
        title: announcement.title,
        text: announcement.message
      });
    },
    SendAnnouncement() {
      this.isLoading = true;
      this.announcement.isToAll = this.announcement.module == null;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/n/announcements/add/for/" +
            this.announcement.module +
            "/by/" +
            this.$store.state.user.type +
            "/of/id/" +
            this.$store.state.user.id,
          {
            announcement: this.announcement
          }
        )
        .then(results => {
          this.isLoading = false;
          this.isAddingAnnouncements = false;
          swal("Success", "Announcement successfully sent.", "success");
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "Try again later", "error");
          } else {
            swal("Unable to send announcement", "Try again later", "error");
          }
        });
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
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: auto;
  margin: auto;
}

.notificationRing {
  -webkit-animation: ring 2s infinite;
  animation: ring 2s infinite;
}

.Scroll-first-four {
  overflow: hidden;
  overflow-y: scroll;
  height: 400px;
}

.Scroll-first-four::-webkit-scrollbar {
  display: none;
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
