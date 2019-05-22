<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="mdi text-dark-black" fontSize="50%" :text="'mdi-book-open-page-variant' | fonticon"></label>
          <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Modules"></label>
        </GridLayout>
      </StackLayout>
      <ActivityIndicator verticalAlignment="center" textAlignment="center" row="1" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
      <StackLayout row="0" rowSpan="2" verticalAlignment="center" textAlignment="center" v-if="!isLoading && (!modules || modules.length == 0)">
        <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
        <label verticalAlignment="center" textAlignment="center" class="m-10 font-weight-bold" fontSize="30%" text="No Modules"></label>
        <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" text="You currently do not have any modules linked to you"></label>
      </StackLayout>
      <ScrollView v-if="!isLoading" row="1">
        <WrapLayout>
          <StackLayout v-for="(_module,i) in modules" :key="i" width="50%">
            <CardView height="100" textAlignment="center" elevation="5" margin="10">
              <Ripple class="p-y-20" @tap="goToModule(_module)">
                <GridLayout rows="auto,auto" columns="*" class="p-10" verticalAlignment="center" textAlignment="center">
                  <label row="0" :textWrap="true" class="font-weight-bold" fontSize="16%" verticalAlignment="center" textAlignment="center" :text="_module.name"></label>
                  <label row="1" :textWrap="true" class="text-dark-black" verticalAlignment="center" fontSize="14%" textAlignment="center" :text="_module.code"></label>
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
        adKeywords: ["school", "study", "university", "college", "job", "work","money","free"]
      };
    },
    mounted() {
      this.pageLoaded();
      if (!this.$store.state.cache.cachedUser) {
        this.navigate("/login", null, {
          clearHistory: true
        });
      }
      const testing = this.TNS_ENV !== "production";

      this.isLoading = true;
      try{
          this.$store.state.cache.cachedUser.user.modules.forEach(m => {
              this.adKeywords.unshift(m.name);
          });
          this.$nextTick(() =>{
            this.$firebase.admob
                .showBanner({
                  size: this.$firebase.admob.AD_SIZE.SMART_BANNER, // see firebase.admob.AD_SIZE for all options
                  margins: {
                    bottom: 10
                  },
                  androidBannerId: "ca-app-pub-4924835910036108/9510636040",
                  iosBannerId: "ca-app-pub-4924835910036108/9510636040",
                  testing: testing, // when not running in production set this to true, Google doesn't like it any other way
                  iosTestDeviceIds: [],
                  keywords: this.adKeywords // add keywords for ad targeting
                });
          });
      }catch(err){
        console.error(err)
      }
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
      pageLoaded() {
        this.$store.commit("refreshCache", {
          db: this.$db,
          api: this.$api,
          appSettings: this.appSettings,
          doc: "admin"
        });
      },
      goToModule(_module) {
        this.navigate(
          "/module/view", {
            module: _module
          },
          null
        );
      }
    }
  };
</script>

<style lang="scss" scoped>
  .topMainText {
    color: white;
    background-color: linear-gradient( top bottom, rgba(255, 0, 0, 0.5), rgba(255, 20, 0, 0.7), rgba(255, 0, 30, 0.5), rgba(255, 20, 30, 0.7));
  }
  
  .backgroundImage {
    background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center center;
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