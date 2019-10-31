<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,auto,auto,*" columns="*">
      <Image
        src="~/assets/images/backgrounds/education.jpg"
        stretch="aspectFit"
        row="1"
        rowSpan="2"
      />
      <label
        row="0"
        verticalAlignment="center"
        textAlignment="center"
        class="p-t-5 text-blue"
        fontSize="30%"
        fontWeight="bold"
        text="Modules"
      ></label>
      <ActivityIndicator
        verticalAlignment="center"
        textAlignment="center"
        row="3"
        v-show="isLoading"
        :busy="isLoading"
      ></ActivityIndicator>
      <StackLayout
        row="0"
        rowSpan="2"
        verticalAlignment="center"
        textAlignment="center"
        v-if="!isLoading && (!modules || modules.length == 0)"
      >
        <label
          verticalAlignment="center"
          textAlignment="center"
          class="mdi m-x-10"
          fontSize="50%"
          :text="'mdi-alert' | fonticon"
        ></label>
        <label
          verticalAlignment="center"
          textAlignment="center"
          class="m-10 font-weight-bold"
          fontSize="30%"
          text="No Modules"
        ></label>
        <label
          verticalAlignment="center"
          textAlignment="center"
          class="m-x-10"
          fontSize="20%"
          :textWrap="true"
          text="You currently do not have any modules linked to you"
        ></label>
      </StackLayout>
      <ScrollView v-if="!isLoading" row="3">
        <WrapLayout>
          <StackLayout v-for="(_module, i) in modules" :key="i" width="50%">
            <CardView
              height="80"
              textAlignment="center"
              elevation="5"
              margin="10"
            >
              <Ripple class="border-left-blue" @tap="goToModule(_module)">
                <GridLayout
                  rows="auto,auto"
                  columns="*"
                  class="p-5"
                  verticalAlignment="center"
                  textAlignment="center"
                >
                  <label
                    row="0"
                    :textWrap="true"
                    class="font-weight-bold"
                    fontSize="14%"
                    verticalAlignment="center"
                    textAlignment="center"
                    :text="_module.name"
                  ></label>
                  <label
                    row="1"
                    :textWrap="true"
                    class="text-dark-black"
                    verticalAlignment="center"
                    fontSize="14%"
                    textAlignment="center"
                    :text="_module.code"
                  ></label>
                </GridLayout>
              </Ripple>
            </CardView>
          </StackLayout>
        </WrapLayout>
      </ScrollView>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      introTxt: "Digitalize your business and keep track of all your earnings.",
      modules: [],
      adKeywords: [
        "school",
        "study",
        "university",
        "college",
        "job",
        "work",
        "money",
        "free"
      ]
    };
  },
  props: ["attendance", "survey"],
  mounted() {
    this.pageLoaded();
    if (!this.$store.state.cache.cachedUser) {
      this.navigate("/login", null, {
        clearHistory: true
      });
    }
    const testing = this.TNS_ENV !== "production";

    this.isLoading = true;

    this.$api
      .getModuleInformation(this.$store.state.cache.cachedUser.user._id)
      .then(_modules => {
        _modules = JSON.parse(JSON.stringify(_modules));
        if (_modules.length == 0) {
          this.$feedback.warning({
            title: "Modules",
            message: "Not Currently registered with any module",
            duration: 5000
          });
        }
        this.modules = _modules;
        this.isLoading = false;
      })
      .catch(err => {
        this.$feedback.error({
          title: "Error in getting modules",
          message: err.message,
          duration: 10000
        });
        this.isLoading = false;
      });
  },
  methods: {
    isStudent() {
      let loggedInType = this.appSettings.getString("userType");
      if (loggedInType === "STUDENT") {
        return true;
      }

      return false;
    },
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: this.appSettings,
        doc: "admin"
      });
    },
    goToModule(_module) {
      if (this.attendance) {
        this.navigate(
          "/module/attendance",
          {
            module: _module
          },
          null
        );
      } else if (this.survey) {
        if (this.isStudent()) {
          this.navigate(
            "/module/survey/take",
            {
              module: _module
            },
            null
          );
          return;
        }
        this.navigate(
          "/module/survey",
          {
            module: _module
          },
          null
        );
      } else {
        this.navigate(
          "/module/view",
          {
            module: _module
          },
          null
        );
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
