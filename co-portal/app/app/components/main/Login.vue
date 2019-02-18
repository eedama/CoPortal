<template>
  <page class="bg-white" actionBarHidden="true" @loaded="pageLoaded()">
    <GridLayout rows="*">
      <StackLayout verticalAlignment="center" row="0" class="m-y-10">
        <Image src="~/assets/images/coPortalLogo.png" stretch="aspectFit" verticalAlignment="bottom" textAlignment="center" class="m-10 bottomLogo"></Image>
        <ScrollView width="100%">
          <CardView verticalAlignment="center" padding="10" margin="25" elevation="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
            <GridLayout width="100%">
              <FlexboxLayout class="m-10" justifyContent="space-between" width="100%" alignSelf="center" height="100%" flexDirection="column">
  
                <GridLayout class="m-10 text-dark-black" rows="auto,auto" columns="auto,*">
                  <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-email' | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-mute text-dark-black" text="Email"></label>
                  <TextField row="1" col="1" keyboardType="email" returnKeyType="next" v-model="user.email" autocorrect="true" autocapitalizationType="none"></TextField>
                </GridLayout>
  
                <GridLayout class="m-10 text-dark-black" rows="auto,auto" columns="auto,*">
                  <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-mute text-dark-black" text="Password"></label>
                  <TextField row="1" col="1" ref="password" secure="true" returnKeyType="done" v-model="user.password" @returnPress="submit()" :class="{ light: !isLoading }"></TextField>
                </GridLayout>
  
                <ActivityIndicator v-show="isLoading" :busy="isLoading"></ActivityIndicator>
  
                <StackLayout v-show="!isLoading">
                  <Button text="Login" :isEnabled="!isLoading" class="submit-button bg-dark-black text-white" @tap="submit()"></Button>
                </StackLayout>
  
                <GridLayout class="m-10">
                  <Ripple @tap="GoToRegister()">
                    <label textAlignment="center" class="text-mute text-light-black p-15" fontSize="13%" text="Don't have an account? Register today."></label>
                  </Ripple>
                </GridLayout>
              </FlexboxLayout>
            </GridLayout>
          </CardView>
        </ScrollView>
      </StackLayout>
  
    </GridLayout>
  </page>
</template>

<script>
  const dialogs = require("ui/dialogs");
  import * as Toast from "nativescript-toast";
  var appSettings = require("application-settings");
  
  import * as connectivity from "tns-core-modules/connectivity";
  
  export default {
    name: "login",
    data() {
      return {
        user: {
          password: "",
          email: ""
        }
      };
    },
    mounted() {
      this.pageLoaded();
    },
    created() {
      this.pageLoaded();
    },
    beforeDestroy() {
      this.isLoading = false;
    },
    Destroy() {
      this.isLoading = false;
    },
    methods: {
      GoToRegister() {
        this.navigate("/register");
      },
      pageLoaded() {
        this.$store.commit("refreshCache", {
          db: this.$db,
          api: this.$api,
          appSettings: appSettings,
          doc: "admin"
        });
      },
      submit() {
        this.navigate('/home');
        return;
        var self = this;
        this.isLoading = true;
        this.$api
          .adminLogin({
            numbers: this.user.numbers,
            email: this.user.email,
            pass: this.user.password
          })
          .then(response => {
            var statusCode = response.statusCode;
            if (statusCode == 200) {
              var result = response.content.toJSON();
              this.appSettings.setString("CurrentUserID", result._id);
              this.$api
                .getAuthToken()
                .then(answer => {
                  console.log("tag getting auth after login", answer);
                  this.loginAdmin(self, result);
                  this.isLoading = false;
                  this.navigate("/admin/dashboard", null, {
                    clearHistory: true,
                    transition: {
                      name: "slideTop",
                      duration: 1000,
                      curve: "spring"
                    }
                  });
                })
                .catch(err => {
                  this.$feedback.warning({
                    title: "Access denied!",
                    duration: 40000,
                    message: err.message
                  });
                  this.isLoading = false;
                  this.navigate("/home", null, {
                    clearHistory: true
                  });
                });
            } else if (statusCode == 512) {
              throw new Error(response.content.toString());
            } else if (statusCode == 500) {
              throw new Error("Internal server error");
            } else {
              throw new Error("Try again later");
            }
          })
          .catch(err => {
            if (err.message.indexOf("Failed to connect") >= 0) {
              err.message = "Please check your internet connection";
            }
            if (err.message.indexOf("position") >= 0) {
              err.message = "We are current having issues,please contact admin";
            }
            this.$feedback.error({
              title: "Unable to log in",
              message: err.message
            });
            this.isLoading = false;
          });
      }
    }
  };
</script>

<style scoped>
  .bottomLogo {
    height: 15%;
  }
</style>
