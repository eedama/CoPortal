<template>
  <v-app>
    <v-card v-if="$route.meta.showNav" color="white" flat height="200px" tile>
      <v-toolbar color="primary" dark prominent extended>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-btn
          @click="changeSchool()"
          x-large
          v-if="$store.state.user.isLoggedIn"
          text
        >
          {{ $store.state.settings.school }}
        </v-btn>
        <v-toolbar-title class="my-auto center">
          <v-img center src="@/assets/logo_small.png" />
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn x-large v-if="$store.state.user.isLoggedIn" text>
          {{ $store.state.user.username }}
        </v-btn>
        <v-btn
          v-for="(navItem, i) in navItems.filter(
            v =>
              (v &&
                (v.auth.some(c => c == 'ANY') &&
                  $store.state.user.isLoggedIn)) ||
              (v.auth.some(c => c == 'STUDENT') &&
                $store.state.user.isLoggedIn &&
                $store.state.user.type == 'STUDENT') ||
              (v.auth.some(c => c == 'ADMIN') &&
                $store.state.user.isLoggedIn &&
                $store.state.user.type == 'ADMIN') ||
              (v.auth.some(c => c == 'LECTURER') &&
                $store.state.user.isLoggedIn &&
                $store.state.user.type == 'LECTURER')
          )"
          :key="i"
          icon
          @click="$router.push(navItem.link)"
        >
          <v-icon>{{ navItem.icon }}</v-icon>
        </v-btn>
        <v-btn
          v-on:click="confirmLogout()"
          x-large
          v-if="$store.state.user.isLoggedIn"
          text
        >
          Log out
        </v-btn>
      </v-toolbar>
    </v-card>

    <v-content>
      <router-view style="padding-top:15px" />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import swal from "sweetalert2";
import axios from "axios";

export default Vue.extend({
  name: "App",
  data() {
    return {
      navItems: [
        {
          icon: "mdi-library-books",
          link: "/module/list",
          auth: ["ANY"]
        },
        {
          icon: "mdi-account-multiple",
          link: "/student/list",
          auth: ["LECTURER"]
        },
        {
          icon: "mdi-account-group",
          link: "/lecturer/list",
          auth: ["ADMIN"]
        },
        {
          icon: "mdi-check-all",
          link: "/marks/all",
          auth: ["STUDENT"]
        },
        {
          icon: "mdi-check-all",
          link: "/marks/sheet",
          auth: ["ADMIN", "LECTURER"]
        }
      ]
    };
  },
  mounted() {
    if (!this.$store.state.settings.schoolAdded) {
      (this as any).changeSchool();
    }
  },
  methods: {
    confirmLogout() {
      swal
        .fire({
          title: "Are you sure?",
          text: "Your current session will be destroyed!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Log out",
          cancelButtonText: "Cancel"
        })
        .then(result => {
          if (result.value) {
            (this as any).logout();
          }
        });
    }
  }
});
</script>

<style>
#app {
  font-family: "lato", "Roboto";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.nav-wrapper {
  background-color: white;
}

.navFixed {
  position: fixed;
  z-index: 9999;
}

.pointer {
  cursor: pointer;
}

.v-active {
  background-color: transparent !important;
  border-bottom: 2px solid black !important;
}

.nice-border {
  border: 1px solid black;
}

.bg-blue {
  background-color: #2d5afd;
}

.bg-light-blue {
  background-color: rgba(45, 90, 253, 0.1);
}

.border-left-blue {
  border-left-width: 3;
  border-left-color: #2d5afd;
}

.border-top-blue {
  border-top-width: 1;
  border-top-color: #2d5afd;
}

.border-top-peach {
  border-top-width: 1;
  border-top-color: #f96c5b;
}

.bg-peach {
  background-color: #f96c5b;
}

.bg-white {
  background-color: rgb(255, 255, 255);
}

.bg-grey {
  background-color: #e9e9f0;
}

.outline-white {
  border: 12 solid white;
}

.text-blue {
  color: #2d5afd;
}

.text-white {
  color: rgb(255, 255, 255);
}

.text-red {
  color: #c4001d;
}

.text-peach {
  color: #f96c5b;
}

.text-black {
  color: black;
}
</style>
