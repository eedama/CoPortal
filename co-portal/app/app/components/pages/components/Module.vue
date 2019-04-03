<template>
  <page actionBarHidden="true">
    <GridLayout v-if="currentModule" rows="auto,*" columns="*">
      <StackLayout v-if="!isKeyboardShowing" row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label
            row="0"
            verticalAlignment="center"
            textAlignment="center"
            class="text-dark-black"
            fontSize="35%"
            :text="module.code"
          ></label>
          <label
            row="1"
            verticalAlignment="center"
            textAlignment="center"
            class="p-15 text-dark-black"
            fontSize="30%"
            :text="module.name + ' ' + isKeyboardShowing"
          ></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <TabView
          tabBackgroundColor="white"
          selectedTabTextColor="black"
          androidSelectedTabHighlightColor="black">
          <TabViewItem v-if="isLecture()" title="Announcements">
            <ScrollView>
              <StackLayout>
                <FlexboxLayout
                  class="m-10"
                  justifyContent="space-between"
                  width="100%"
                  alignSelf="center"
                  height="100%"
                  flexDirection="column"
                >
                  <GridLayout
                    v-if="notificationToSend.viewed"
                    class="m-10 text-dark-black"
                    rows="auto,auto"
                    columns="auto,*"
                  >
                    <label
                      row="0"
                      col="1"
                      class="h3 font-weight-bold text-mute text-dark-black"
                      text="Title"
                    ></label>
                    <TextField
                      row="1"
                      col="1"
                      keyboardType="text"
                      returnKeyType="next"
                      v-model="notificationToSend.title"
                      autocorrect="true"
                      autocapitalizationType="none"
                    ></TextField>
                  </GridLayout>

                  <GridLayout
                    v-if="notificationToSend.viewed"
                    class="m-10 text-dark-black"
                    rows="auto,auto"
                    columns="auto,*"
                  >
                    <label
                      row="0"
                      col="1"
                      class="h3 font-weight-bold text-mute text-dark-black"
                      text="Message"
                    ></label>
                    <TextField
                      row="1"
                      col="1"
                      returnKeyType="text"
                      v-model="notificationToSend.message"
                    ></TextField>
                  </GridLayout>
                  <StackLayout>
                    <Button
                      text="Send Announcement"
                      @tap="sendNotification()"
                      class="submit-button bg-light-black text-white p-5"
                    ></Button>
                  </StackLayout>
                </FlexboxLayout>

                <ActivityIndicator v-show="isLoading" :busy="isLoading"></ActivityIndicator>
                <CardView
                  v-for="notify in currentNotifications"
                  :key="notify._id"
                  :row="a-1"
                  elevation="15"
                  margin="5"
                >
                  <Ripple @tap="readMessage(notify.title,notify.message)" >
                    <GridLayout  class="p-15" rows="auto,auto" columns="auto,*,auto">
                      <Image row="0" col="0" rowSpan="2" verticalAlignment="center" src="res://ic_logo" width="60" height="60" borderRadius="50%"></Image>
                      <label row="0" col="1" class="font-weight-bold p-x-5" fontSize="16%" :text="notify.title"></label>
                      <label row="0" col="2" class="h4 text-dark-black" :text="getMoment(notify.date).fromNow()"></label>
                      <label row="1" col="2" class="h4 text-dark-black" v-if="notify.moduleId" :text="notify.moduleId.name"></label>
                      <label row="1" col="1" class="text-dark-black p-x-5" :text="notify.message"></label> 
                    </GridLayout>
                  </Ripple>
                </CardView>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem v-if="isLecture()" title="Students">
          <GridLayout rows="*,auto">
            <ScrollView>
              <StackLayout>
                <CardView
                  elevation="5"
                  margin="5" v-for="(student,i) in studentList" :key="i">
                <Ripple>
                  <GridLayout
                    class="text-dark-black p-15"
                    rows="auto,auto"
                    columns="auto,*,auto">
                  <label
                    row="0"
                    col="0"
                    class="mdi text-dark-black m-r-20"
                    rowSpan="2"
                    verticalAlignment="center"
                    textAlignment="left"
                    fontSize="35"
                    :text="'mdi-account-circle' | fonticon"
                  ></label>
                  <label
                    row="0"
                    col="1"
                    class="font-weight-bold"
                    fontSize="15"
                    textAlignment="left"
                    :text="student.lastname + ' ' + student.firstname"
                  ></label>
                  <label
                    v-if="student.gender"
                    row="0"
                    col="2"
                    class="font-weight-bold text-dark-black mdi p-x-10 p-b-2"
                    fontSize="30%"
                    rowSpan="2"
                    borderRadius="50"
                    verticalAlignment="center"
                    textAlignment="center"
                    :text="'mdi-human-' + student.gender.toLowerCase() | fonticon"
                  ></label>
                  <label row="1" col="1" fontSize="15" textAlignment="left" :text="student.username"></label>
                  </GridLayout>
                </Ripple>
                </CardView>
              </StackLayout>
            </ScrollView>
            <MDTextField row="1" class="m-5" fontSize="22" keyboardType="search" hint="Search" returnKeyType="search"></MDTextField>
          </GridLayout>
          </TabViewItem>
          <TabViewItem v-if="isLecture()" title="assessments">
            <ScrollView>
              <StackLayout>
                <CardView
                  elevation="15"
                  v-for="(assesment,i) in currentAssesments"
                  :key="i"
                  margin="5"
                >
                  <Ripple @tap="ViewMarks(assesment.id,assesment.title)">
                    <GridLayout
                      verticalAlignment="center"
                      class="p-10"
                      rows="auto,auto,auto,auto"
                      columns="*,*,*"
                    >
                      <label
                        row="0"
                        col="0"
                        verticalAlignment="center"
                        colspan="3"
                        textAlignment="center"
                        class="font-weight-bold text-light-black p-b-10"
                        :textWrap="true"
                        fontSize="19%"
                        :text="assesment.title"
                      ></label>

                      <label
                        row="1"
                        col="0"
                        verticalAlignment="center"
                        :color="colorLoaded(120)"
                        textAlignment="center"
                        class="text-light-black font-weight-bold"
                        :textWrap="true"
                        fontSize="22%"
                        :text="assesment.wrote"
                      ></label>
                      <label
                        row="1"
                        col="1"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="font-weight-bold"
                        :color="colorLoaded(60)"
                        :textWrap="true"
                        fontSize="22%"
                        :text="assesment.passed"
                      ></label>
                      <label
                        row="1"
                        col="2"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="font-weight-bold"
                        :color="colorLoaded(30)"
                        :textWrap="true"
                        fontSize="22%"
                        :text="assesment.failed"
                      ></label>

                      <label
                        row="2"
                        col="0"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="text-light-black font-weight-bold"
                        :textWrap="true"
                        fontSize="16%"
                        text="wrote"
                      ></label>
                      <label
                        row="2"
                        col="1"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="text-light-black font-weight-bold"
                        :textWrap="true"
                        fontSize="16%"
                        text="passed"
                      ></label>
                      <label
                        row="2"
                        col="2"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="text-light-black font-weight-bold"
                        :textWrap="true"
                        fontSize="16%"
                        text="failed"
                      ></label>

                      <label
                        row="3"
                        col="2"
                        verticalAlignment="bottom"
                        textAlignment="right"
                        fontSize="13%"
                        class="h4 text-light-black p-t-10"
                        :text="getMoment(assesment.date).fromNow()"
                      ></label>
                    </GridLayout>
                  </Ripple>
                </CardView>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem title="Notes">
            <ScrollView>
              <WrapLayout>
                <StackLayout width="50%" v-for="note in module.notes" :key="note._id">
                  <CardView elevation="15" margin="5">
                    <GridLayout class="p-10" rows="auto,auto,auto" columns="*,auto,auto">
                      <label
                        row="0"
                        col="0"
                        colspan="3"
                        :textWrap="true"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="font-weight-bold"
                        fontSize="16%"
                        :text="note.title"
                      ></label>
                      <label
                        row="1"
                        col="0"
                        colspan="3"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="font-weight-bold mdi p-15"
                        fontSize="75%"
                        :text="'mdi-file-pdf' | fonticon "
                      ></label>
                      <label
                        row="2"
                        col="0"
                        verticalAlignment="bottom"
                        class="h4 text-dark-black"
                        :text="getMoment(note.date).fromNow()"
                      ></label>
                      <Ripple row="2" col="1" verticalAlignment="bottom" textAlignment="right">
                        <label
                          class="font-weight-bold mdi p-x-5"
                          textAlignment="right"
                          fontSize="20%"
                          :text="'mdi-download' | fonticon "
                        ></label>
                      </Ripple>
                      <Ripple row="2" col="2" verticalAlignment="bottom" textAlignment="right">
                        <label
                          class="font-weight-bold mdi p-x-5"
                          textAlignment="right"
                          fontSize="20%"
                          :text="'mdi-share-variant' | fonticon "
                        ></label>
                      </Ripple>
                    </GridLayout>
                  </CardView>
                </StackLayout>
              </WrapLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem v-if="!isLecture()" title="Marks">
            <ScrollView>
              <StackLayout>
                <CardView v-for="(marked,i) in currentMarks" :key="i" elevation="15" margin="5">
                  <GridLayout
                    verticalAlignment="center"
                    class="p-10"
                    rows="auto,auto,auto"
                    columns="auto,auto,*"
                  >
                    <label
                      row="0"
                      rowspan="3"
                      verticalAlignment="center"
                      textAlignment="center"
                      class="font-weight-bold mdi p-15"
                      fontSize="54"
                      :text="'mdi-chart-pie' | fonticon "
                    ></label>
                    <label
                      row="0"
                      col="1"
                      verticalAlignment="center"
                      class="font-weight-bold"
                      :textWrap="true"
                      fontSize="17%"
                      :text="marked.title"
                    ></label>
                    <label
                      row="0"
                      col="3"
                      verticalAlignment="center"
                      textAlignment="right"
                      :color="colorLoaded(marked.mark)"
                      rowspan="2"
                      :textWrap="true"
                      fontSize="45"
                      :text="marked.mark"
                    ></label>
                    <label
                      row="2"
                      col="1"
                      verticalAlignment="center"
                      class="font-weight-bold p-x-10 p-b-2"
                      fontSize="13"
                      borderRadius="50"
                      color="white"
                      :style="{backgroundColor:colorLoaded(marked.mark)}"
                      textAlignment="center"
                      :text="marked.type.toLowerCase()"
                    ></label>
                    <label
                      row="2"
                      col="2"
                      verticalAlignment="center"
                      textAlignment="right"
                      class="h4 text-dark-black"
                      :text="getMoment(marked.date).fromNow()"
                    ></label>
                  </GridLayout>
                </CardView>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem v-if="!isLecture()" title="Tests">
            <ScrollView>
              <StackLayout>
                <CardView
                  v-for="(test,i) in currentModule.questionaires"
                  :key="i"
                  elevation="15"
                  margin="5"
                >
                  <Ripple @tap="TakeTest(test)">
                    <GridLayout
                      verticalAlignment="center"
                      class="p-10"
                      rows="auto,auto"
                      columns="auto,*,auto"
                    >
                      <label
                        row="0"
                        rowspan="2"
                        verticalAlignment="center"
                        textAlignment="center"
                        class="font-weight-bold mdi p-15"
                        fontSize="25%"
                        :text="'mdi-file-document-box-multiple' | fonticon "
                      ></label>
                      <label
                        row="0"
                        col="1"
                        verticalAlignment="center"
                        class="font-weight-bold"
                        :textWrap="true"
                        fontSize="17%"
                        :text="test.title"
                      ></label>
                      <label
                        row="1"
                        col="1"
                        verticalAlignment="center"
                        :textWrap="true"
                        fontSize="15%"
                        :text="test.questions.length + ' Questions'"
                      ></label>
                      <label
                        row="1"
                        col="2"
                        verticalAlignment="center"
                        class="h4 text-dark-black"
                        :text="getMoment(test.date).fromNow()"
                      ></label>
                    </GridLayout>
                  </Ripple>
                </CardView>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
        </TabView>
      </StackLayout>
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
      currentModule: null,
      studentList: [],
      currentMarks: [],
      lectures: [],
      currentNotifications: [],
      currentAssesments: [],
      notificationToSend: {
        viewed: false,
        title: "",
        message: "",
        isToAll: false
      }
    };
  },
  mounted() {
    this.pageLoaded();
    this.$api
      .getModuleMarks(
        this.$store.state.cache.cachedUser.user._id,
        this.module._id
      )
      .then(marks => {
        this.currentMarks = JSON.parse(JSON.stringify(marks));
        if (marks.length == 0) {
          this.$feedback.warning({
            title: "Marks",
            message: "No Marks to display yet",
            duration: 3000
          });
        }
      })
      .catch(err => {
        this.$feedback.error({
          title: "Error getting your marks",
          message: err.message,
          duration: 3000
        });
      });

    //NEW
    this.$api

      .getStudentList()

      .then(_students => {
        this.studentList = JSON.parse(JSON.stringify(_students));

        if (_students.length == 0) {
          this.$feedback.warning({
            title: "Students",

            message: "No Students Available",

            duration: 5000
          });
        }

        this.isLoading = false;
      })

      .catch(err => {
        this.$feedback.error({
          title: "Error in getting students",

          message: err.message,

          duration: 10000
        });
      });

    //NEW
    this.$api

      .getLectureList()

      .then(_Lectures => {
        this.lectures = JSON.parse(JSON.stringify(_Lectures));

        if (_Lectures.length == 0) {
          this.$feedback.warning({
            title: "Students",

            message: "Lectures might be unavailable",

            duration: 5000
          });
        }

        this.isLoading = false;
      })

      .catch(err => {
        this.$feedback.error({
          title: "Error in getting Lecturers",

          message: err.message,

          duration: 10000
        });
      });
    //NEW
    if (this.isLecture()) {
      this.isLoading = true;
      this.$api
        .getLectureNotificationModule(
          this.$store.state.cache.cachedUser.user._id,
          this.appSettings.getString("userType"),
          this.module._id
        )
        .then(notifications => {
          this.currentNotifications = JSON.parse(JSON.stringify(notifications));
          this.isLoading = false;
          if (notifications.length == 0) {
            this.$feedback.warning({
              title: "Notifications",
              message: "No notifications to display yet",
              duration: 3000
            });
          }
        })
        .catch(err => {
          this.$feedback.error({
            title: "Notifcations",
            message: err.message,
            duration: 3000
          });
        });

      this.$api
        .getModuleQuestions(this.module._id)
        .then(assesments => {
          this.currentAssesments = JSON.parse(JSON.stringify(assesments));
        })
        .catch(err => {
          this.$feedback.error({
            title: "Notifcations",
            message: err.message,
            duration: 3000
          });
        });
    }
  },
  props: ["module"],
  methods: {
    pageLoaded() {
      if (!this.module) {
        this.navigate(null);
      }
      this.currentModule = this.module;
    },
    sendNotification() {
      if (!this.notificationToSend.viewed) {
        this.notificationToSend.viewed = true;
      } else {
        if (
          this.notificationToSend.title.length < 1 ||
          this.notificationToSend.message.length < 1
        ) {
          this.$feedback.warning({
            title: "Notifcations",
            message: "Please Provide valid message or title",
            duration: 3000
          });
        } else {
          this.$api
            .sendNotification(
              this.$store.state.cache.cachedUser.user._id,
              this.appSettings.getString("userType"),
              this.module._id,
              this.notificationToSend
            )
            .then(notification => {
              this.currentNotifications.unshift(
                JSON.parse(JSON.stringify(notification))
              );
              this.notificationToSend.message = "";
              this.notificationToSend.title = "";
              this.$feedback.success({
                title: "Notifcations",
                message: "Announcement Added Succesfully",
                duration: 3000
              });
            })
            .catch(err => {
              this.$feedback.error({
                title: "Notifcations",
                message: err.message,
                duration: 3000
              });
            });
          this.notificationToSend.viewed = false;
        }
      }
    },
    //#endregion
    viewStudentProfile(studentID) {
      this.navigate("/student/profile/view");
    },

    TakeTest(test) {
      this.navigate("/take/test", {
        dbQuestionaire: test
      });
    },
    ViewMarks(questionaireId, questionaireName) {
      console.log("g50", questionaireId);
      let questionaire = {
        title: questionaireName,
        _id: questionaireId
      };
      console.log("k50", questionaire);
      this.navigate(
        "/questionaire/marks",
        {
          questionaire: questionaire
        },
        null
      );
    },
    colorLoaded(marked) {
      if (marked < 50) {
        return "darkred";
      } else if (marked >= 50 && marked <= 100) {
        return "darkgreen";
      } else if (marked > 100 && marked <= 150) {
        return "#428bca";
      }
    },
    isLecture() {
      let loggedInType = this.appSettings.getString("userType");
      if (loggedInType === "LECTURER") {
        return true;
      }

      return false;
    },
    readMessage(sender, Message) {
      alert({
        title: sender,
        message: Message,
        okButtonText: "close"
      });
    },
    handleSender(send) {
      return this.$store.state.cache.cachedUser.user.username.toUpperCase();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
