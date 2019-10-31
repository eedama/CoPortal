<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout rows="*">
      <StackLayout verticalAlignment="center" row="0" class="m-y-10">
        <Image
          src="~/assets/images/coPortalLogo.png"
          stretch="aspectFit"
          verticalAlignment="bottom"
          textAlignment="center"
          class="m-x-5 bottomLogo"
        ></Image>
        <label
          textAlignment="center"
          class="text-mute  text-blue p-15"
          fontSize="18%"
          :text="
            isParent
              ? 'Pick a student'
              : currentSchoolName
              ? currentSchoolName
              : 'Pick a school'
          "
        ></label>
        <CardView
          verticalAlignment="center"
          padding="10"
          margin="20"
          elevation="1"
          shadowOffsetHeight="10"
          shadowOpacity="0.2"
          shadowRadius="50"
        >
          <ScrollView width="100%">
            <StackLayout>
              <FlexboxLayout
                v-if="isParent"
                class="m-10"
                justifyContent="space-between"
                width="100%"
                alignSelf="center"
                height="100%"
                flexDirection="column"
              >
                <GridLayout rows="*" columns="*,auto">
                  <StackLayout colSpan="2">
                    <ActivityIndicator
                      verticalAlignment="center"
                      textAlignment="center"
                      v-show="isLoading"
                      :busy="isLoading"
                    ></ActivityIndicator>
                    <CardView v-for="(student, i) in students" :key="i">
                      <Ripple @tap="manageStudent(student)">
                        <GridLayout
                          class="m-10 text-dark-black"
                          rows="auto,auto"
                          columns="auto,*"
                        >
                          <label
                            row="0"
                            rowSpan="2"
                            col="0"
                            verticalAlignment="center"
                            textAlignment="center"
                            class="mdi m-10"
                            fontSize="25%"
                            :text="'mdi-account-circle' | fonticon"
                          ></label>
                          <label
                            row="0"
                            col="1"
                            class="h3 font-weight-bold text-mute text-dark-black"
                            :text="`${student.firstname} ${student.lastname}`"
                          ></label>
                          <label
                            row="1"
                            col="1"
                            class="h4 font-weight-bold text-mute text-dark-black"
                            :text="student.username"
                          ></label>
                        </GridLayout>
                      </Ripple>
                    </CardView>
                  </StackLayout>
                </GridLayout>
              </FlexboxLayout>
              <FlexboxLayout
                v-if="currentSchoolName && !isParent"
                class="m-10"
                justifyContent="space-between"
                width="100%"
                alignSelf="center"
                height="100%"
                flexDirection="column"
              >
                <GridLayout
                  class="m-10 text-dark-black"
                  rows="auto,auto"
                  columns="auto,*"
                >
                  <label
                    row="0"
                    rowSpan="2"
                    col="0"
                    verticalAlignment="center"
                    textAlignment="center"
                    class="mdi m-10 text-blue"
                    fontSize="25%"
                    :text="'mdi-account-circle' | fonticon"
                  ></label>
                  <label
                    row="0"
                    col="1"
                    class="h3 font-weight-bold text-mute text-blue"
                    text="Username"
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

                <GridLayout
                  class="m-10 text-dark-black"
                  rows="auto,auto"
                  columns="auto,*"
                >
                  <label
                    row="0"
                    rowSpan="2"
                    col="0"
                    verticalAlignment="center"
                    textAlignment="center"
                    class="mdi m-10 text-blue"
                    fontSize="25%"
                    :text="'mdi-lock' | fonticon"
                  ></label>
                  <label
                    row="0"
                    col="1"
                    class="h3 font-weight-bold text-mute text-blue"
                    text="Password"
                  ></label>
                  <TextField
                    row="1"
                    col="1"
                    ref="password"
                    secure="true"
                    returnKeyType="done"
                    v-model="password"
                    @returnPress="submit()"
                    :class="{ light: !isLoading }"
                  ></TextField>
                </GridLayout>

                <ActivityIndicator
                  v-show="isLoading"
                  :busy="isLoading"
                ></ActivityIndicator>

                <StackLayout v-show="!isLoading">
                  <Button
                    text="Login"
                    :isEnabled="!isLoading"
                    class="submit-button bg-peach text-white"
                    @tap="submit()"
                  ></Button>
                </StackLayout>

                <GridLayout columns="*,*" class="m-10">
                  <Ripple @tap="GoToResetPassword()">
                    <label
                      textAlignment="center"
                      class="text-mute text-light-black p-15"
                      fontSize="14%"
                      text="Forgot Password?"
                    ></label>
                  </Ripple>
                  <Ripple col="1" @tap="changeSchool(null, null)">
                    <label
                      textAlignment="center"
                      class="text-mute text-light-black p-15"
                      fontSize="14%"
                      text="Change school"
                    ></label>
                  </Ripple>
                </GridLayout>
              </FlexboxLayout>
              <FlexboxLayout
                v-if="!currentSchoolName && !isParent"
                class="m-10"
                justifyContent="space-between"
                width="100%"
                alignSelf="center"
                height="100%"
                flexDirection="column"
              >
                <GridLayout rows="auto,*" columns="*,auto">
                  <Ripple
                    col="1"
                    @tap="refresh"
                    verticalAlignment="center"
                    textAlignment="right"
                  >
                    <label
                      class="mdi m-10 text-peach"
                      fontSize="25%"
                      :text="'mdi-refresh' | fonticon"
                    ></label>
                  </Ripple>
                  <StackLayout colSpan="2" row="1">
                    <ActivityIndicator
                      verticalAlignment="center"
                      textAlignment="center"
                      v-show="isLoading"
                      :busy="isLoading"
                    ></ActivityIndicator>
                    <CardView v-for="(school, i) in schools" :key="i">
                      <Ripple @tap="changeSchool(school.name, school.url)">
                        <GridLayout
                          class="m-10 text-dark-black"
                          rows="auto,auto"
                          columns="auto,*"
                        >
                          <label
                            row="0"
                            rowSpan="2"
                            col="0"
                            verticalAlignment="center"
                            textAlignment="center"
                            class="mdi m-10 text-peach"
                            fontSize="25%"
                            :text="'mdi-school' | fonticon"
                          ></label>
                          <label
                            row="0"
                            col="1"
                            fontSize="16%"
                            class="font-weight-bold text-mute text-dark-black"
                            :text="school.name"
                          ></label>
                          <label
                            row="1"
                            col="1"
                            fontSize="14%"
                            class="text-mute text-blue"
                            :text="school.description"
                          ></label>
                        </GridLayout>
                      </Ripple>
                    </CardView>
                  </StackLayout>
                </GridLayout>
              </FlexboxLayout>
            </StackLayout>
          </ScrollView>
        </CardView>
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
      username: "",
      currentSchoolName: null,
      currentSchoolUrl: null,
      schools: [],
      students: [],
      isParent: false
    };
  },
  mounted() {
    this.refresh(false);
  },
  beforeDestroy() {
    this.isLoading = false;
  },
  Destroy() {
    this.isLoading = false;
  },
  methods: {
    manageStudent(student) {
      if (
        this.$store.state.cache.cachedUser &&
        this.$store.state.cache.cachedUser.userType == "PARENT"
      ) {
        let currentUser = JSON.parse(
          JSON.stringify(this.$store.state.cache.cachedUser)
        );

        this.appSettings.remove("isLoggedInUserId");
        this.appSettings.remove("userType");
        this.appSettings.remove("device_token");
        this.$store.commit("clearCache", {
          db: this.$db,
          appSettings: this.appSettings,
          api: this.$api
        });

        currentUser.user = student;
        this.$store.commit("cacheUser", {
          db: this.$db,
          api: this.$api,
          appSettings: this.appSettings,
          user: currentUser,
          type: currentUser.userType
        });

        console.log("currentUser", JSON.stringify(currentUser));
        console.log(
          "currentUser-session",
          JSON.stringify(this.$store.state.cache.cachedUser)
        );
        this.appSettings.setBoolean("isLoggedInUserId", true);
        this.appSettings.setString("userType", currentUser.userType);
        this.navigate("/student/profile/view", null, {
          clearHistory: true
        });
      } else {
        this.$feedback.error({
          title: "Current User is ",
          message: this.$store.state.cache.cachedUser
        });
      }
    },
    refresh(clean = false) {
      if (
        this.$store.state.cache.cachedUser &&
        this.$store.state.cache.cachedUser.userType == "PARENT"
      ) {
        this.isParent = true;
        this.students = this.$store.state.cache.cachedUser.students;
      }
      this.currentSchoolName = clean
        ? null
        : appSettings.getString("CurrentSchoolName");
      this.currentSchoolUrl = clean
        ? null
        : appSettings.getString("CurrentSchoolURL");
      if (clean) {
        appSettings.remove("CurrentSchoolName");
        appSettings.remove("CurrentSchoolURL");
      }
      if (!this.currentSchoolUrl) {
        this.isLoading = true;
        this.$api
          .getAllSchools()
          .then(schools => {
            this.isLoading = false;
            this.schools = JSON.parse(JSON.stringify(schools));
          })
          .catch(err => {
            this.isLoading = false;
            this.$feedback.error({
              title: err.message
            });
          });
      }
    },
    changeSchool(name, url) {
      if (name != null) {
        this.currentSchoolName = name;
        this.currentSchoolUrl = url;
        appSettings.setString("CurrentSchoolName", name);
        appSettings.setString("CurrentSchoolURL", url);
      } else {
        this.refresh(true);
      }
    },

    GoToResetPassword() {
      this.navigate("/reset/Password");
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
          this.isParent = false;
          var currentUser = JSON.parse(JSON.stringify(results));
          if (
            currentUser &&
            currentUser.user &&
            currentUser.userType == "PARENT"
          ) {
            currentUser.parent = currentUser.user;
            currentUser.user = currentUser.students[0];
          }
          this.$store.commit("cacheUser", {
            db: this.$db,
            api: this.$api,
            appSettings: this.appSettings,
            user: currentUser,
            type: currentUser.userType
          });
          this.appSettings.setBoolean("isLoggedInUserId", true);
          this.appSettings.setString("userType", currentUser.userType);
          switch (currentUser.userType) {
            case "ADMIN":
              alert("You are an admin and we are not ready for you");
              return;
            case "LECTURER": {
              this.navigate("/module/list", null, {
                clearHistory: true
              });
              break;
            }
            case "STUDENT":
              this.navigate("/notifications/list", null, {
                clearHistory: true
              });
              break;
            case "PARENT":
              this.isParent = true;
              this.students = currentUser.students;
              break;
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.isParent = false;
          this.$feedback.error({
            title: err.message
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
