<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout rows="*">
      <StackLayout verticalAlignment="center" row="0" class="m-y-10">
        <Image
          src="~/assets/images/coPortalLogo.png"
          stretch="aspectFit"
          verticalAlignment="bottom"
          textAlignment="center"
          class="m-10 bottomLogo"
        ></Image>
        <ScrollView width="100%">
          <CardView
            verticalAlignment="center"
            padding="10"
            margin="25"
            elevation="10"
            shadowOffsetHeight="10"
            shadowOpacity="0.2"
            shadowRadius="50"
          >
            <GridLayout width="100%">
              <FlexboxLayout
                class="m-10"
                justifyContent="space-between"
                width="100%"
                alignSelf="center"
                height="100%"
                flexDirection="column"
              >
                <GridLayout class="m-10 text-dark-black" rows="auto,auto" columns="auto,*">
                  <label
                    row="0"
                    rowSpan="2"
                    col="0"
                    verticalAlignment="center"
                    textAlignment="center"
                    class="mdi m-10"
                    fontSize="25%"
                    :text="'mdi-email' | fonticon"
                  ></label>
                  <label
                    row="0"
                    col="1"
                    class="h3 font-weight-bold text-mute text-dark-black"
                    text="Email"
                  ></label>
                  <TextField
                    row="1"
                    col="1"
                    keyboardType="email"
                    returnKeyType="next"
                    v-model="username"
                    autocorrect="true"
                    autocapitalizationType="none"
                  ></TextField>
                </GridLayout>
                <ActivityIndicator v-show="isLoading" :busy="isLoading"></ActivityIndicator>

                <StackLayout v-show="!isLoading">
                  <Button
                    text="Reset Password"
                    :isEnabled="!isLoading"
                    class="submit-button bg-dark-black text-white"
                    @tap="GoToLogin()"
                  ></Button>
                </StackLayout>
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
  mounted() {},
  beforeDestroy() {
    this.isLoading = false;
  },
  Destroy() {
    this.isLoading = false;
  },
  methods: {
    GoToLogin() {
        this.navigate("/login");
    },
    isEmpty(obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) return false;
      }
      return true;
    },
    submit() {
      if (this.username.length == 0) {
        this.$feedback.error({
          title: "Password Reset",
          message: "Link to reset password sent to email",
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
          this.$store.commit("cacheUser", {
            db: this.$db,
            api: this.$api,
            appSettings: this.appSettings,
            user: currentUser
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.$feedback.error({
            title: "An error has occured",
            message: err.message
          });
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
