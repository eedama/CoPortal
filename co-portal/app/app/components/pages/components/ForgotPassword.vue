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
  name: "resetPassWord",
  data() {
    return {
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
      if (this.username.length == 0) {
        this.$feedback.error({
          title: "Password Reset",
          message: "Enter a valid email Address",
          duration: 3000
        });
        return;
      }
      this.$api
        .sendLinkToResetPassword(this.username)
        .then(results => {
<<<<<<< HEAD
          Alert("okay");
=======
>>>>>>> fixed Timetable error
          this.$feedback.error({
            title: "Password Reset",
            message: "Link sent to Email Address",
            duration: 3000
          });

          this.navigate("/login");
          return;
        })
        .catch(err => {
<<<<<<< HEAD
          Alert("okay3");
=======
>>>>>>> fixed Timetable error
          this.$feedback.error({
            title: "Your Email Was Not Found",
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
