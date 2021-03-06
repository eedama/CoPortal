<template>
  <page actionBarHidden="true">
    <GridLayout v-if="currentModule" rows="auto,*" columns="*">
      <StackLayout row="0">
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
            :text="module.name"
          ></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <TabView
          tabBackgroundColor="white"
          selectedTabTextColor="#F96C5B"
          androidSelectedTabHighlightColor="#F96C5B"
        >
          <TabViewItem v-if="isLecture()" title="Announcements">
              <GridLayout rows="auto,*">
                  <FlexboxLayout
                    row="0"
                    class="m-10"
                    justifyContent="space-between"
                    width="100%"
                    alignSelf="center"
                    flexDirection="column"
                  >
                    <GridLayout
                      v-if="notificationToSend.viewed"
                      class="m-10 text-dark-black"
                      rows="auto,auto,auto"
                      columns="auto,*,auto"
                    >
                    <Ripple col="2" row="0" @tap="notificationToSend.viewed = false">
                      <label class="mdi p-10" fontSize="25%" :text="'mdi-close' | fonticon"></label>
                    </Ripple>
                      <label
                        row="1"
                        col="1"
                        colSpan="2"
                        class="h3 font-weight-bold text-mute text-dark-black"
                        text="Title"
                      ></label>
                      <TextField
                        row="2"
                        col="1"
                        colSpan="2"
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

                  <ActivityIndicator class="m-35" row="1" v-if="isLoading" :busy="isLoading"></ActivityIndicator>
                  <StackLayout row="1" verticalAlignment="center" textAlignment="center" v-if="!isLoading && (!currentNotifications || currentNotifications.length == 0)">
                    <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
                    <label verticalAlignment="center" textAlignment="center" class="m-x-10 font-weight-bold" fontSize="30%" text="No Announcements"></label>
                    <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" text="Get engaged and start sending announcements"></label>
                  </StackLayout>
                  <ScrollView row="1">
                    <StackLayout>
                      <CardView
                        v-for="notify in currentNotifications"
                        :key="notify._id"
                        :row="a-1"
                        elevation="15"
                        margin="5"
                      >
                        <Ripple @tap="readMessage(notify.title,notify.message)">
                          <GridLayout class="p-15" rows="auto,auto" columns="auto,*,auto">
                            <Image
                              row="0"
                              col="0"
                              rowSpan="2"
                              verticalAlignment="center"
                              src="res://ic_logo"
                              width="60"
                              height="60"
                              borderRadius="50%"
                            ></Image>
                            <label
                              row="0"
                              col="1"
                              class="font-weight-bold p-x-5"
                              fontSize="16%"
                              :text="notify.title"
                            ></label>
                            <label
                              row="0"
                              col="2"
                              class="h4 text-dark-black"
                              :text="getMoment(notify.date).fromNow()"
                            ></label>
                            <label
                              row="1"
                              col="2"
                              class="h4 text-dark-black"
                              v-if="notify.moduleId"
                              :text="notify.moduleId.name"
                            ></label>
                            <label row="1" col="1" class="text-dark-black p-x-5" :text="notify.message"></label>
                          </GridLayout>
                        </Ripple>
                      </CardView>
                    </StackLayout>
                </ScrollView>
             </GridLayout>
          </TabViewItem>
          <TabViewItem v-if="isLecture()" title="Students">
            <GridLayout rows="*">
              <StackLayout row="0" verticalAlignment="center" textAlignment="center" v-if="!isLoading && (!studentList || studentList.length == 0)">
                <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10 font-weight-bold" fontSize="30%" text="No Students"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" :text="`Start adding students who study ${module.name} today!`"></label>
              </StackLayout>
              <ScrollView row="0">
                <StackLayout>
                  <CardView elevation="5" margin="5" v-for="(student,i) in studentList" :key="i">
                    <Ripple>
                      <GridLayout
                        class="text-dark-black p-15"
                        rows="auto,auto"
                        columns="auto,*,auto"
                      >
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
                        <label
                          row="1"
                          col="1"
                          fontSize="15"
                          textAlignment="left"
                          :text="student.username"
                        ></label>
                      </GridLayout>
                    </Ripple>
                  </CardView>
                </StackLayout>
              </ScrollView>
            </GridLayout>
          </TabViewItem>
          <TabViewItem v-if="isLecture()" title="assessments">
            <GridLayout rows="*">
              <StackLayout row="0" verticalAlignment="center" textAlignment="center" v-if="!isLoading && (!currentAssesments || currentAssesments.length == 0)">
                <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10 font-weight-bold" fontSize="30%" text="No Assessments"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" text="Fill in the mark sheet to see student's performances here"></label>
              </StackLayout>
              <ScrollView row="0">
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
                          colSpan="3"
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
            </GridLayout> 
          </TabViewItem>
          <TabViewItem title="Notes">
            <GridLayout rows="*">
              <StackLayout row="0" verticalAlignment="center" textAlignment="center" v-if="!isLoading && (!module.notes || module.notes.length == 0)">
                <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10 font-weight-bold" fontSize="30%" text="No Notes"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" :text="`${module.name} (${module.code}) has no uploaded notes, just yet!`"></label>
              </StackLayout>
              <ScrollView row="0">
                <WrapLayout>
                  <StackLayout width="50%" v-for="note in module.notes" :key="note._id">
                    <CardView elevation="15" margin="5">
                      <Ripple @tap="DownloadNotes(note)">
                        <GridLayout class="p-10" rows="auto,auto,auto" columns="*,auto,auto">
                          <label
                            row="0"
                            col="0"
                            colSpan="3"
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
                            colSpan="3"
                            verticalAlignment="center"
                            textAlignment="center"
                            class="font-weight-bold mdi p-15"
                            fontSize="75%"
                            :text="'mdi-file-pdf' | fonticon "
                          ></label>
                          <label
                            col="0"
                            row="2"
                            colSpan="3"
                            :textWrap="true"
                            verticalAlignment="center"
                            textAlignment="center"
                            class="h4 text-dark-black"
                            :text="getMoment(note.date).fromNow()"
                          ></label>
                        </GridLayout>
                      </Ripple>
                    </CardView>
                  </StackLayout>
                </WrapLayout>
              </ScrollView>
            </GridLayout>
          </TabViewItem>
          <TabViewItem v-if="!isLecture()" title="Marks">
            <GridLayout rows="*">
              <StackLayout row="0" verticalAlignment="center" textAlignment="center" v-show="!isLoading && (!currentMarks || currentMarks.length == 0)">
                <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10 font-weight-bold" fontSize="30%" text="No Marks"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" text="Get engaged and write online tests, or remind your lecturer to fill in the marksheet"></label>
              </StackLayout>
              <ScrollView row="0">
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
                      rowSpan="3"
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
                      rowSpan="2"
                      :textWrap="true"
                      fontSize="40"
                      :text="marked.mark+'%'"
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
            </GridLayout>
          </TabViewItem>
          <TabViewItem v-if="!isLecture()" title="Tests">
            <GridLayout rows="*">
              <StackLayout row="0" verticalAlignment="center" textAlignment="center" v-if="!isLoading && (!currentModule.questionaires || currentModule.questionaires.length == 0)">
                <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10 font-weight-bold" fontSize="30%" text="No Tests"></label>
                <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" :text="`Remind your lecturer to set online tests frequently to boost your ${module.name} (${module.code}) skills`"></label>
              </StackLayout>
            <ScrollView row="0">
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
                        rowSpan="2"
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
                        :text="test.totalAttempts + '/' + test.attemptLimit + ' attempts'"
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
            </GridLayout>
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
      selectedNotes: null,
      currentModule: null,
      studentList: [],
      currentMarks: [],
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
        if(this.currentMarks)
        {
          this.currentMarks.forEach(mark =>
          {
            try{
              mark.mark = Math.floor((mark.mark/mark.total)*100);
            }catch(ex){
              mark.mark = '-';
            }
          });
        }
        console.log("tag",this.currentMarks)
        
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

    if (this.isLecture()) {
      this.isLoading = true;

      this.$api
        .getStudentsForModule(this.module._id)
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
    onLoad() {},
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
                title: "Notifications",
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
    viewStudentProfile(studentID) {
      this.navigate("/student/profile/view");
    },
    DownloadNotes(note) {
      this.navigate("/pdf/view", {
        noteId: note._id,
        fileName: note.title ? note.title.replace(/ /g,'-') + '.pdf' : 'untitled.pdf'
      });
    },
    TakeTest(test) {
      if(this.$store.state.cache.cachedUser && this.$store.state.cache.cachedUser.userType =='PARENT'){
        this.$feedback.warning({
          title:'Parents can not take tests',
          message: ''
        });
        return;
      }
      if(test.totalAttempts < test.attemptLimit){
        this.navigate("/take/test", {
          dbQuestionaire: JSON.parse(JSON.stringify(test))
        });
      }else{
        console.log('test ....',test);
        this.$api
        .getSolutionId(test._id,this.$store.state.cache.cachedUser.userType,this.$store.state.cache.cachedUser.user._id)
        .then(results => {
          console.log('results .... ',JSON.parse(JSON.stringify(results)));
          const solutionId = JSON.parse(JSON.stringify(results)).id;
          this.isLoading = false;
          if (solutionId) {
            this.navigate("/feedback/chat", {
              solutionId
            });
          } else {
            this.$feedback.warning({
              title:'Can not find the solution',
              message: 'The solution of this test is not available'
            });
          }
        })
        .catch(err => {
          this.isLoading = false;
          this.$feedback.error({
            title:'Can not find the solution',
            message: err.message
          });
        });
      }
    },
    ViewMarks(questionaireId, questionaireName) {
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
