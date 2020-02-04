<template>
  <GridLayout v-if="$store.state.cache.cachedUser" rows="auto,*,auto">
    <CardView
      v-if="$store.state.cache.cachedUser.user"
      row="0"
      class="p-x-10 "
      :elevation="15"
    >
      <GridLayout verticalAlignment="center" rows="auto,auto" columns="auto,*">
        <Image
          src="~/assets/images/backgrounds/pexels-photo-509922.jpeg"
          stretch="aspectFit"
          rowSpan="2"
          colSpan="2"
        />
        <Image
          row="0"
          col="0"
          rowSpan="2"
          textAlignment="left"
          verticalAlignment="center"
          stretch="aspectFit"
          width="65"
          height="65"
          class="p-l-5"
          borderRadius="100%"
          :src="
            $store.state.cache.cachedUser.user.profilePic
              ? $store.state.cache.cachedUser.user.profilePic
              : $store.state.settings.defaultProfilePic
          "
        ></Image>
        <Label
          row="0"
          colSpan="2"
          fontSize="17%"
          textAlignment="center"
          verticalAlignment="center"
          class="font-weight-bold text-blue m-y-5 p-10"
          :textWrap="true"
          :text="
            `${$store.state.cache.cachedUser.user.firstname} ${$store.state.cache.cachedUser.user.lastname}`
          "
        />
      </GridLayout>
    </CardView>
    <Image
      row="1"
      src="~/assets/images/coPortalLogo.png"
      stretch="aspectFit"
      verticalAlignment="bottom"
      opacity="0.1"
      textAlignment="right"
      class="m-x-15 bottomLogo"
    ></Image>
    <ScrollView row="1">
      <StackLayout>
        <Ripple
          @tap="goTo(layout)"
          v-for="(layout, i) in drawerLayouts.filter(
            d =>
              d.auth == null ||
              ($store.state.cache.cachedUser &&
                d.auth.some(
                  auth => auth == $store.state.cache.cachedUser.userType
                ))
          )"
          :key="i"
        >
          <GridLayout
            class="drawer-item p-y-10"
            rows="auto,auto"
            columns="auto,*"
          >
            <label
              row="0"
              col="0"
              textAlignment="center"
              verticalAlignment="center"
              class="mdi p-5 m-x-10 text-blue"
              fontSize="25%"
              :text="('mdi-' + layout.icon) | fonticon"
            ></label>
            <label
              row="0"
              col="1"
              verticalAlignment="center"
              class="text-dark-black p-5 m-l-10"
              fontSize="16%"
              :text="layout.text"
            ></label>
          </GridLayout>
        </Ripple>
      </StackLayout>
    </ScrollView>
    <StackLayout textAlignment="center" row="2">
      <CardView v-if="isShowAdVideoButton && adIsReady">
        <Ripple @tap="showAdVideo()">
          <GridLayout
            class="drawer-item p-y-10"
            rows="auto,auto"
            columns="auto,*"
          >
            <label
              row="0"
              col="0"
              textAlignment="center"
              verticalAlignment="center"
              class="mdi p-5 m-x-10 text-blue"
              fontSize="25%"
              :text="'mdi-video' | fonticon"
            ></label>
            <label
              row="0"
              col="1"
              verticalAlignment="center"
              class="text-dark-black p-5 m-l-10"
              fontSize="16%"
              text="Watch a short video"
            ></label>
          </GridLayout>
        </Ripple>
      </CardView>
    </StackLayout>
  </GridLayout>
</template>

<script>
var dialogs = require("ui/dialogs");
export default {
  data() {
    return {
      isShowAdVideoButton: true,
      adIsReady: false,
      drawerLayouts: [
        {
          text: "My profile",
          icon: "account",
          link: "/student/profile/view",
          description: "View and edit personal information",
          auth: ["STUDENT", "ADMIN", "PARENT"]
        },
        {
          text: "Lecturers",
          icon: "account-supervisor-circle",
          link: "/lecturer/list",
          description: "Lecturers registered to the system",
          auth: ["ADMIN"]
        },
        {
          text: "Modules",
          icon: "book-open-page-variant",
          link: "/module/list",
          description: "Modules you are registered for",
          auth: ["ADMIN", "LECTURER", "STUDENT", "PARENT"]
        },
        {
          text: "Attendance",
          icon: "calendar-check",
          link: "/student/attendance",
          description: "Students class Attendance",
          auth: ["STUDENT"]
        },
        {
          text: "Attendance",
          icon: "calendar-check",
          link: "/module/list/attend",
          description: "Students class Attendance",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Survey",
          icon: "comment-question-outline",
          link: "/module/list/survey",
          description: "View Surveys",
          auth: ["LECTURER", "ADMIN", "STUDENT"]
        },
        {
          text: "Timetable",
          icon: "table",
          link: "/timetable/view",
          description: "View Your Table",
          auth: ["STUDENT", "PARENT"]
        },
        {
          text: "Settings",
          icon: "settings",
          link: "/settings",
          description: "Customize your portal",
          auth: ["STUDENT", "LECTURER", "ADMIN", "PARENT"]
        },
        /* 
        {
          text: "Switch student",
          icon: "account-convert",
          link: "/login",
          description: "Switch user",
          auth: ["PARENT"]
        }, */
        {
          text: "Log out",
          icon: "exit-run",
          link: "/logout",
          description: "Leave the system",
          auth: ["STUDENT", "LECTURER", "ADMIN", "PARENT"]
        }
      ],
      adKeywords: [
        "school",
        "university",
        "college",
        "degree",
        "work",
        "loans",
        "insurance",
        "trading"
      ]
    };
  },
  mounted() {
    this.pageLoaded();
  },
  methods: {
    showAdVideo() {
      this.$firebase.admob
        .showInterstitial()
        .then(v => {
          console.log("We are done seeing the advert", v);
        })
        .catch(err => {
          console.log("An error occured while watching the video", err);
        });
    },
    pageLoaded() {
      const testing = this.TNS_ENV !== "production";
      this.isShowAdVideoButton = true; //(Math.random() * 2).toFixed() != 1;
      if (
        this.$store.state.cache.cachedUser &&
        this.$store.state.cache.cachedUser.user &&
        this.$store.state.cache.cachedUser.user.modules
      ) {
        this.$store.state.cache.cachedUser.user.modules.forEach(m => {
          this.adKeywords.unshift(m.name);
        });
      }

      this.adKeywords = this.adKeywords
        .filter(v => v)
        .map(v => v.toLowerCase())
        .filter((v, i, a) => a.indexOf(v) == i);

      setTimeout(() => {
        if (this.isShowAdVideoButton) {
          this.$firebase.admob
            .preloadInterstitial({
              iosInterstitialId: "ca-app-pub-4924835910036108/7694317065",
              androidInterstitialId: "ca-app-pub-4924835910036108/7694317065",
              testing: testing, // when not running in production set this to true, Google doesn't like it any other way
              iosTestDeviceIds: [],
              keywords: this.adKeywords,
              onClosed: () => console.log("Interstitial closed"),
              onClicked: () => console.log("Interstitial clicked"),
              onOpened: () => console.log("Interstitial opened"),
              onLeftApplication: () =>
                console.log("Interstitial left application")
            })
            .then(
              () => {
                this.adIsReady = true;
                console.log(
                  "AdMob interstitial preloaded, you can now call 'showInterstitial' at any time to show it without delay."
                );
              },
              errorMessage => {
                console.log("AdMob interstitial error", errorMessage);
              }
            );
        } else {
          this.$firebase.admob
            .showBanner({
              size: this.$firebase.admob.AD_SIZE.FLUID, // see firebase.admob.AD_SIZE for all options
              margins: {
                bottom: 0
              },
              androidBannerId: "ca-app-pub-4924835910036108/9510636040",
              iosBannerId: "ca-app-pub-4924835910036108/9510636040",
              testing: testing, // when not running in production set this to true, Google doesn't like it any other way
              iosTestDeviceIds: [],
              keywords: this.adKeywords,
              onClosed: () => console.log("Banner closed"),
              onClicked: () => console.log("Banner clicked"),
              onOpened: () => console.log("Banner opened"),
              onLeftApplication: () => console.log("Banner left application")
            })
            .then(
              function() {
                console.log("AdMob banner showing");
              },
              function(errorMessage) {
                console.log("Admob banner error", errorMessage);
              }
            );
        }
      }, 2000);
    },
    goTo(item) {
      this.$emit("closeSideNav", true);
      if (item.link == "/logout") {
        dialogs
          .confirm({
            title: "Log out",
            message: "Are you sure you want to log out?",
            okButtonText: "Yes",
            cancelButtonText: "No"
          })
          .then(result => {
            if (result) {
              this.appSettings.remove("isLoggedInUserId");
              this.appSettings.remove("userType");
              this.appSettings.remove("device_token");

              this.$store.commit("clearCache", {
                db: this.$db,
                appSettings: this.appSettings,
                api: this.$api
              });

              this.navigate("/login", null, {
                clearHistory: true
              });
            }
          });
      } else if (item.link == "/module/list/attend") {
        this.navigate(item.link, { attendance: true });
      } else if (item.link == "/module/list/survey") {
        this.navigate(item.link, { survey: true });
      } else {
        this.navigate(item.link);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.topMainText {
  color: white;
  background-color: linear-gradient(
    top bottom,
    rgba(255, 0, 0, 0.5),
    rgba(255, 20, 0, 0.7),
    rgba(255, 0, 30, 0.5),
    rgba(255, 20, 30, 0.7)
  );
}

.backgroundImage {
  background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center
    center;
  background-size: cover;
  padding-top: 3%;
  padding-bottom: 3%;
}

.backgroundImageOverlay {
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
}

.bg-dark-blue-overlay {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
