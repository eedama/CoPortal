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
                  <label row="0" rowspan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-email' | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-mute text-dark-black" text="Email"></label>
                  <TextField row="1" col="1" keyboardType="email" returnKeyType="next" v-model="username" autocorrect="true" autocapitalizationType="none"></TextField>
                </GridLayout>
  
                <GridLayout class="m-10 text-dark-black" rows="auto,auto" columns="auto,*">
                  <label row="0" rowspan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
                  <label row="0" col="1" class="h3 font-weight-bold text-mute text-dark-black" text="Password"></label>
                  <TextField row="1" col="1" ref="password" secure="true" returnKeyType="done" v-model="password" @returnPress="submit()" :class="{ light: !isLoading }"></TextField>
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
import {
  Feedback,
  FeedbackType,
  FeedbackPosition
} from "nativescript-feedback";
import { Color } from "tns-core-modules/color";

export default {
  name: "login",
  data() {
    return {
      password: "",
      username: ""
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
      if (this.username.length == 0) {
        this.$feedback.error({
          title: "Incorrect email",
          message: "Please Enter a valid email",
          duration: 3000
        });
        return;
      }

      if (this.password.length == 0) {
        this.$feedback.error({
          title: "Invalid password",
          message: "Please Enter a valid password",
          duration: 3000
        });
        return;
      }
      this.isLoading = true;
      this.$api
        .loginUser(this.username, this.password)
        .then(results => {
          this.isLoading = false;
          var currentUser = JSON.parse(JSON.stringify(results.content));
          switch (currentUser.userType) {
            case "ADMIN":
              alert("You are an admin and we are not ready for you");
              return;
            case "LECTURER":
              alert("You are an lecturer and we are not ready for you");
              return;
            case "STUDENT":
              this.$store.commit("login", {
                id: currentUser.user._id,
                username: currentUser.user.username,
                fullName:
                  currentUser.user.lastname + " " + currentUser.user.firstname,
                type: currentUser.userType,
                isLoggedIn: true
              });
              this.navigate("/home", null, {
                clearHistory: true
              });
              break;
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$feedback.error({
            title: "An error has occured",
            message: err.message
          });
          console.log(err);
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
