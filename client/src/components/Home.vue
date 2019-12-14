<template>
  <div class="screen">
    <v-dialog
      v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'STUDENT'"
      class="card"
      max-width="600"
      color="white"
      v-model="signAttendanceRegister"
    >
      <v-card color="secondary">
        <v-row>
          <v-col cols="10">
        <v-card-title class="headline text-white">Attendance register</v-card-title>
        <v-card-text><span class="text-white">Enter the code to sign your attendance.</span></v-card-text>
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
<v-btn icon v-on:click="signAttendanceRegister = false" right class="right">
            <v-icon style="color:ghostwhite">mdi-close</v-icon>
          </v-btn>
          </v-col>
        </v-row>
      </v-card>
        <v-row class="bg-white mx-auto">
        <v-col cols="8" class=" text-center" offset-md="2">
            <h5 class="display-1 text-xs-center mx-auto my-5">{{ getMoment().format("Do MMMM YYYY") }}</h5>
            <h3 class="display-2 text-xs-center mx-auto my-5">{{ getMoment().format("hh:mm A") }}</h3>
        </v-col>
          <v-col cols="12" mx-auto right class="mx-auto right">
              <v-text-field
                class="text-center mx-auto text-xs-center"
                color="secondary"
                size="40"
                placeholder="Attendance code"
                @keyup.enter="submitAttendanceCode"
            solo
                v-model="currentAttendanceCode"
              >
            </v-text-field>
          <p class="red-text text-red text-center">{{ currentAttendanceCodeError }}</p>
          <ball-pulse-loader class="col s12 text-center" v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
          <v-btn
            v-if="!isLoading"
            block
            x-large
            v-on:click="submitAttendanceCode"
            color="primary"
          >Submit</v-btn>
          </v-col>
        </v-row>
    </v-dialog>
    <v-dialog
      v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'LECTURER'"
      style="position:fixed;max-width:100%;max-height:60%;min-height:20%;min-width:40%;"
      class="card"
      v-model="isCreatingAttendanceRegister"
    >
      <v-card class="col s12" style="background-color:#006064;">
        <v-list-item-title>
          <div class="v-title" style="color:ghostwhite">Creating attendance register</div>
          <v-button v-on:click="isCreatingAttendanceRegister = false" class="right">
            <v-icon style="color:ghostwhite">close</v-icon>
          </v-button>
        </v-list-item-title>
      </v-card>
      <v-content style="overflow-y:scroll" class="row">
        <v-field class="col s8 offset-s2">
          <label>Select a module</label>
          <v-select @v-selected="setStudentsForModule" v-model="selectedAttendanceModule">
            <v-option
              v-for="(_module,i) in modules"
              :key="i"
              style="background-color:white"
              :value="_module._id"
            >{{ _module.name }} {{ _module.code }}</v-option>
          </v-select>
        </v-field>
        <v-tabs v-if="selectedAttendanceModule" class="col s12" @v-changed="changeAttendanceTab">
          <v-tab id="tab-home" label="New">
            <div class="row">
              <v-content v-show="createAttendanceIndex == 0" class="col s12">
                <v-field>
                  <label>Select a duration</label>
                  <v-select v-model="selectedAttendanceDuration">
                    <v-option
                      v-for="(duration,i) in ['5 minutes','10 minutes','15 minutes','30 minutes']"
                      :key="i"
                      style="background-color:white"
                      :value="duration"
                    >{{ duration }}</v-option>
                  </v-select>
                </v-field>
                <v-field>
                  <p
                    class="red-text text-red text-xs-center"
                    v-if="attendanceError"
                  >{{ attendanceError }}</p>
                </v-field>
              </v-content>
              <v-content v-if="createAttendanceIndex == 1 && attendanceRegister" class="col s12">
                <div class="row">
                  <h5 class="col s12">The attendance code is</h5>
                  <h2 class="col s12 text-xs-center center">{{ attendanceRegister.code }}</h2>
                  <h4
                    class="col s12 text-xs-center center"
                    v-if="getMoment()"
                  >Expires {{ getMoment(attendanceRegister.expiryDate).fromNow() }}</h4>
                </div>
              </v-content>
              <v-button
                v-if="createAttendanceIndex == 0 && !isLoading"
                v-on:click="createAttendance()"
                class="v-primary col s12"
                style="background-color:#006064;color:ghostwhite"
              >Create attendance register</v-button>
            </div>
          </v-tab>
          <v-tab id="tab-home-history" label="History">
            <div v-if="!selectedAttendanceDate" class="row">
              <v-button
                v-for="(time,i) in attendanceRegisterHistoryTimes"
                :key="i"
                @click="selectAttendanceDate(time)"
                class="col s4 offset-s1"
              >{{ getMoment(time.date).format("Do MMMM") }}</v-button>
            </div>
            <div v-if="selectedAttendanceDate" class="row">
              <v-button v-on:click="selectedAttendanceDate = false">
                <v-icon>arrow_back</v-icon>
              </v-button>
              <v-list class="v-triple-line col s12 center-align">
                <div class="Scroll-first-four">
                  <v-list-item
                    style="margin-bottom:15px;"
                    v-for="(student,i) in attendanceRegisterHistoryStudents.filter(v => v && v.studentId)"
                    :key="i"
                    class="hoverable col s12 m10 pointer white center-align waves-effect"
                  >
                    <v-avatar>
                      <img src="https://placeimg.com/40/40/people/1" alt="People" />
                    </v-avatar>

                    <div class="v-list-item-text">
                      <span>{{ student.studentId.lastname + " " + student.studentId.firstname }} &nbsp;&bull; {{ getMoment(student.date).fromNow() }}</span>
                      <span>{{ student.studentId.username }}</span>
                    </div>
                  </v-list-item>
                </div>
              </v-list>
              <ball-pulse-loader
                class="text-xs-center center col s12"
                v-if="attendanceRegisterHistoryStudentsLoading"
                color="#000000"
                size="20px"
              ></ball-pulse-loader>
            </div>
          </v-tab>
          <v-tab v-if="attendanceRegister" id="tab-home-manual" label="Sign manually">
            <div class="row">
              <v-list class="v-triple-line col s12 center-align">
                <h6>Mark all the present students</h6>
                <div class="Scroll-first-four">
                  <v-list-item
                    style="margin-bottom:15px;"
                    v-for="(student,i) in selectedAttendanceModuleStudents"
                    :key="i"
                    @click="student.selected = !student.selected"
                    class="col s12 m10 pointer center-align waves-effect"
                    :class="{'white':student.selected}"
                  >
                    <v-avatar>
                      <v-icon
                        v-show="!student.selected"
                        class="black-text"
                        style="color:ghostwhite;width:100%;height:100%"
                      >close</v-icon>
                      <v-icon
                        v-show="student.selected"
                        class="black-text"
                        style="color:ghostwhite;width:100%;height:100%"
                      >done</v-icon>
                    </v-avatar>

                    <div class="v-list-item-text">
                      <span>{{ student.lastname + " " + student.firstname }} &nbsp;&bull;</span>
                      <span>{{ student.username }}</span>
                    </div>
                  </v-list-item>
                </div>
              </v-list>
              <div class="col s12">
                <ball-pulse-loader class="col s12 center" v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
              </div>
              <div class="col s12">
                <v-button
                  v-if="!isLoading"
                  v-on:click="submitBulkAttendance"
                  class="v-primary col s12"
                  style="background-color:#006064;color:ghostwhite"
                >Submit</v-button>
              </div>
            </div>
          </v-tab>
        </v-tabs>

        <ball-pulse-loader
          class="text-xs-center center col s12"
          v-if="isLoading"
          color="#000000"
          size="20px"
        ></ball-pulse-loader>
      </v-content>
    </v-dialog>
    <v-dialog
      v-if="isParent"
      style="position:fixed;max-width:100%;max-height:60%;min-height:20%;min-width:40%;"
      class="card"
      v-model="isChangingStudent"
    >
      <v-card class="col s12" style="background-color:#006064;">
        <v-list-item-title>
          <div class="v-title" style="color:ghostwhite">Change Student</div>
          <v-button v-on:click="isChangingStudent = false" class="right">
            <v-icon style="color:ghostwhite">close</v-icon>
          </v-button>
        </v-list-item-title>
      </v-card>
      <v-card-actions>
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
        <div class="row">
          <v-content class="col s12">
            <v-field>
              <label>Select Student</label>
              <v-select v-model="currentStudent">
                <v-option
                  v-for="(student,i) in students"
                  :key="i"
                  style="background-color:white"
                  :value="student._id"
                >{{ student.username }}</v-option>
              </v-select>
            </v-field>
          </v-content>
          <v-button
            v-if="!isLoading"
            v-on:click="changeStudent()"
            class="v-primary col s12"
            style="background-color:#006064;color:ghostwhite"
          >Change student</v-button>
        </div>
      </v-card-actions>
    </v-dialog>
    <v-dialog
      v-if="$store.state.user.isLoggedIn && ($store.state.user.type=='LECTURER' || $store.state.user.type=='ADMIN')"
      style="position:fixed;max-height:100vh;min-height:20%;width:100%;"
      class="card"
      v-model="isAddingAnnouncements"
    >
      <v-card class="col s12">
        <v-list-item-title style="background-color:#006064;" class="row">
          <div class="col s12 m10 offset-m1 text-center">
            <span style="color:ghostwhite" class="v-title">Send an announcement</span>
            <v-button class="right" v-on:click="isAddingAnnouncements = false">
              <v-icon style="color:ghostwhite">close</v-icon>
            </v-button>
          </div>
        </v-list-item-title>
        <v-content>
          <div class="row">
            <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
              <input
                v-model="announcement.title"
                id="ModuleDescription"
                name="ModuleDescription"
                type="text"
              />
              <label class="text-center" style="color:#006064" for="ModuleDescription">Title</label>
            </div>
          </div>
          <div class="row">
            <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
              <input
                v-model="announcement.message"
                id="ModuleDescription"
                name="ModuleDescription"
                type="text"
              />
              <label class="text-center" style="color:#006064" for="ModuleDescription">Message</label>
            </div>
            <div style="padding:10px" class="input-field col s8 offset-s2 m6 offset-m3 text-center">
              <label>
                <input
                  v-model="announcement.isParent"
                  class="with-gap"
                  name="group1"
                  type="checkbox"
                />
                <span :style="{'color:#006064':announcement.isParent}">Send announcement to parents</span>
              </label>
            </div>
          </div>
          <div class="row">
            <div class="col s8 offset-s2 m6 offset-m3 text-center p-20">
              <label style="color:#006064">Send to :</label>
            </div>
            <div
              style="position:relative;top:0%;max-height:40vh;overflow-y:scroll;width:60%"
              class="col s8 offset-s2 m6 offset-m3 text-center"
            >
              <form style="max-height:60vh">
                <p v-for="(_module,i) in modules" :key="i">
                  <label>
                    <input
                      v-model="announcement.module"
                      :value="_module._id"
                      class="with-gap"
                      name="group1"
                      type="radio"
                    />
                    <span>{{ _module.name }} ({{ _module.code }}) students</span>
                  </label>
                </p>
                <p>
                  <label>
                    <input
                      v-model="announcement.module"
                      :value="null"
                      class="with-gap"
                      name="group1"
                      type="radio"
                      :checked="true"
                    />
                    <span>All Students</span>
                  </label>
                </p>
              </form>
            </div>
            <div class="col s8 offset-s2 m6 offset-m3 text-center p-20"></div>
          </div>
        </v-content>
        <v-card-actions style="background-color:#006064;padding:10px">
          <span
            v-if="!isLoading"
            style="float:left;left:0;position:absolute;padding-left:30px;color:ghostwhite;max-width:100%"
          >The announcement will be sent to {{ modules.some(v => v && v._id == announcement.module) ? `${modules.find(v => v && v._id == announcement.module).name} ${modules.find(v => v && v._id == announcement.module).code}` : 'All' }} students {{ announcement.isParent ? ' and SMSs to thier parents as well' : ''}}</span>
          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
          <v-button
            v-if="!isLoading"
            v-on:click="SendAnnouncement()"
            style="color:ghostwhite;max-width:40%"
            class="v-secondary"
          >Send announcement</v-button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row v-if="!$store.state.user.isLoggedIn" class="row">
              <v-col cols="12">
        <h4
          class="title text-blue px-5"
        >We offer the following services</h4>
      </v-col>
      <v-col cols="12">
        <v-row class="px-10">
            <v-col cols="4">
        <v-card>
          <v-card-title class="mx-auto" center>
            <span class="text-center title mx-auto mb-n4 text-peach center">Digital attendance register</span>
          </v-card-title>
        <v-img src="../assets/images/backgrounds/family_2x.png" />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title class="mx-auto" center>
            <span class="text-center title mx-auto mb-n4 text-peach center">Study materials of all modules/subjects</span>
          </v-card-title>
        <v-img src="../assets/images/backgrounds/coderdojo.png" />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title class="mx-auto" center>
            <span class="text-center title mx-auto mb-n4 text-peach center">Online tests and assesments</span>
          </v-card-title>
        <v-img src="../assets/images/backgrounds/invoice_maker_2x.jpg" />
        </v-card>
      </v-col>
            <v-col cols="4">
        <v-card>
          <v-card-title class="mx-auto" center>
            <span class="text-center title mx-auto mb-n4 text-blue center">Real time notifications to parents and students</span>
          </v-card-title>
        <v-img src="../assets/images/backgrounds/notification.png" />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title class="mx-auto" center>
            <span class="text-center title mx-auto mb-n4 text-blue center">Access to marksheets and assessment results</span>
          </v-card-title>
        <v-img src="../assets/images/backgrounds/education.jpg" />
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title class="mx-auto" center>
            <span class="text-center title mx-auto mb-n4 text-blue center">Digitalized administrative system roles</span>
          </v-card-title>
        <v-img src="../assets/images/backgrounds/seating.png" />
        </v-card>
      </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <h4
          class="title text-blue px-5"
        >Meet some of our cool friends that might help boost your career life</h4>
      </v-col>
      <v-col 
        v-for="(partner,i) in partners"
        :key="i" cols="4">
      <v-card
          class="mx-5 mb-5"
          shaped
          outlined
        v-on:click="GotoExternal(partner.link)"
        > 
        <v-img class="mx-10 my-5" max-width="200" max-height="100" :src="partner.img" />
        </v-card>
        </v-col>
    </v-row>

    <v-row v-if="$store.state.user.isLoggedIn" class="row">
      <v-col cols="4">
        <v-row>
          <v-col cols="10" offset-md="1">
            <v-list-item-title>
              <v-btn class="my-auto" v-if="$store.state.user.type == 'LECTURER' || $store.state.user.type == 'ADMIN'"
              icon v-on:click="isAddingAnnouncements = true">
                <v-icon size="40">
                  mdi-plus
                </v-icon>
              </v-btn>
              <span class="title mx-5 my-auto text-blue">Annnouncements</span>
            </v-list-item-title>
          </v-col>
          <v-col>
        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
        </div>
          </v-col>
          <v-col style="overflow-y:scroll;max-height:50vh" cols="12">
        <v-card
          class="mx-10 mb-5"
          shaped
          outlined
          v-on:click="AnnouncementClick(announcement)"
          v-for="(announcement,i) in announcements"
          :key="i"
        >
          <v-list-item three-line>
            <v-list-item-avatar
              tile
              size="80"
            >
            <v-icon class="text-peach" size="50">mdi-bell</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <div class="overline mb-4">{{ announcement.lecturerId ? announcement.lecturerId.lastname + " " + announcement.lecturerId.firstname : "Admin" }} &nbsp;&bull; <span class="text-peach">{{ getMoment(announcement.date).fromNow() }}</span></div>
              <v-list-item-title class="subtitle-1 mb-1">{{ announcement.title }}</v-list-item-title>
              <v-list-item-subtitle><span class="text-blue">{{ announcement.message }}</span></v-list-item-subtitle>
            </v-list-item-content>

          </v-list-item>
        </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col class="px-10" cols="8">
        <v-row>
          <v-col cols="6" offset-md="3">
            <v-img src="../assets/images/backgrounds/education.jpg" />
          </v-col>
        <v-col 
        v-for="(option,i) in options.filter(o => o.auth == null || o.auth.indexOf($store.state.user.type) >= 0)"
          :key="i"
        cols="6">
          <v-card
          v-on:click="goToRoute(option)" outlined class="border-top-blue">
            <v-row class="mx-auto my-auto px-2">
              <v-col cols="2" class="mx-auto my-auto">
                <v-icon color="primary" class="text-peach mx-auto my-auto" size="30">{{ option.icon }}</v-icon>
              </v-col>
              <v-col cols="10">
                <v-list-item-content>
              <v-list-item-title class="title mb-1">
                   {{ option.text }}</v-list-item-title>
              <v-list-item-subtitle><span class="text-blue">
                   {{ option.description }}</span></v-list-item-subtitle>
            </v-list-item-content>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import swal from "sweetalert2";
const axios = require("axios");
export default {
  name: "Home",
  data() {
    return {
      /// lecturer attendance
      createAttendanceIndex: 0,
      selectedAttendanceModule: null,
      selectedAttendanceModuleStudents: [],
      selectedAttendanceDuration: "5 minutes",
      selectedAttendanceDate: null,
      attendanceRegister: null,
      attendanceRegisterHistoryTimes: [],
      attendanceRegisterHistoryStudents: [],
      attendanceRegisterHistoryStudentsLoading: false,
      attendanceError: "",
      /// student attendance
      signAttendanceRegister: false,
      currentAttendanceCodeError: "",
      currentAttendanceCode: "",
      ///
      isParent: false,
      partners: [
        {
          link: "https://www.onlinecareerguidance.co.za",
          img: "https://www.onlinecareerguidance.co.za/images_2014/Banner.jpg",
          name: "Online career guidance",
          description: "Online career guidance"
        },
        {
          link: "http://www.zabursaries.co.za",
          img:
            "http://www.zabursaries.co.za/wp-content/uploads/2016/09/bursaries2017-south-africa-logo.png",
          name: "ZA Bursaries",
          description: "ZA Bursaries"
        }
      ],
      announcement: {
        title: "",
        message: "",
        isToAll: true,
        isParent: false,
        moduleID: null,
        module: null
      },
      announcements: [],
      modules: [],
      isAddingAnnouncements: false,
      isCreatingAttendanceRegister: false,
      showEmoji: false,
      isLoading: false,
      isChangingStudent: false,
      parentRelationship: "Mother",
      students: [],
      currentStudent: "",
      txtSearch: "",
      titleText: [
        "Welcome to Co-Portal.",
        "Please login",
        "Contact admin for your login info"
      ],
      options: [
        {
          text: "Attendance Register",
          description: "Create and view registers",
          icon: "mdi-calendar-check",
          link: "/module/list/attend",
          attendanceRegister: true,
          auth: ["LECTURER"]
        },
        {
          text: "Sign Attendance Register",
          description: "Mark that you are in class",
          icon: "mdi-calendar-check",
          link: "/module/list/attend",
          signAttendanceRegister: true,
          auth: ["STUDENT"]
        },
        {
          text: "Survey",
          description: "Rate the level of the lecturer",
          icon: "mdi-forum",
          link: "/survey/list",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Students",
          description: "List of registered students",
          icon: "mdi-account-supervisor",
          link: "/student/list",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: this.$store.state.user.isParent
            ? "Student Profile"
            : "Edit profile",
          description: "Student's profile in detail",
          icon: "mdi-account-circle",
          link: "/student/update",
          auth: ["STUDENT"]
        },
        {
          text: "Lecturers",
          description: "List of registered lecturers",
          icon: "mdi-account-supervised-circle",
          link: "/lecturer/list",
          auth: ["ADMIN"]
        },
        {
          text: this.$store.state.user.isParent ? "Student Modules" : "Modules",
          description: "List of modules",
          icon: "mdi-book-open-page-variant",
          link: "/module/list",
          auth: ["ADMIN", "LECTURER", "STUDENT"]
        },
        {
          text: this.$store.state.user.isParent ? "Student Marks" : "Marks",
          description: "All results from past tests",
          icon: "mdi-check-all",
          link: "/marks/all",
          auth: ["STUDENT"]
        },
        {
          text: "Assessment results",
          description: "All results from past assessments",
          icon: "mdi-check-all",
          link: "/marks/sheet",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Report a student",
          description: "Send a note to a student's parent",
          icon: "mdi-bullhorn-outline",
          link: "/Student/Report",
          auth: ["LECTURER", "ADMIN"]
        }
      ]
    };
  },
  mounted() {
    if (this.$store.state.user.isLoggedIn) {
      this.isLoading = true;
      this.isParent = this.$store.state.user.isParent;
      if (this.isParent) {
        this.options.push({
          text: "Change a student",
          icon: "people",
          link: "/",
          auth: ["STUDENT"],
          showStudents: true
        });
        this.students = this.$store.state.user.parentStudents;
        this.parentRelationship = this.capitalize(
          this.$store.state.user.parent.relationship
        );
      }
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/n/announcements/get/for/" +
            this.$store.state.user.id,
          {
            userType: this.$store.state.user.type,
            moduleID: null
          }
        )
        .then(results => {
          this.isLoading = false;
          console.log(results.data);
          this.announcements = results.data.reverse();
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire(err.message, "Try again later", "error");
          }
        });
      if (
        this.$store.state.user.type == "LECTURER" ||
        this.$store.state.user.type == "ADMIN"
      ) {
        this.isLoading = true;
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/m/modules/all/for/" +
              this.$store.state.user.id +
              "/" +
              this.$store.state.user.type
          )
          .then(results => {
            this.isLoading = false;
            this.modules = results.data;
            this.modules.map(s => {
              s.show = true;
            });
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal.fire(err.response.data, "error");
            } else {
              swal.fire("Unable to load modules", "Try again later", "error");
            }
          });
      }
    }
  },
  methods: {
    submitBulkAttendance() {
      console.log("Here we go!");
      const students = this.selectedAttendanceModuleStudents
        ? this.selectedAttendanceModuleStudents
            .filter(v => v && v.selected)
            .map(v => v._id)
        : null;
      const code = this.attendanceRegister
        ? this.attendanceRegister.code
        : null;
      if (!students || !code) {
        swal.fire(
          "Unable to sign register",
          "make sure you selected students",
          "error"
        );
        return;
      }
      console.log("selected students", students);
      console.log("selected code", code);
      this.isLoading = true;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/attendance/sign/bulk/students",
          {
            students,
            code
          }
        )
        .then(results => {
          this.isLoading = false;
          swal.fire(results.data, "", "success");
          this.isCreatingAttendanceRegister = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "", "error");
          } else {
            console.log(err);
            swal.fire(
              "Unable to get the attendance list",
              "Try again later",
              "error"
            );
          }
        });
    },
    setStudentsForModule(moduleId) {
      this.selectedAttendanceModuleStudents = [];
      if (!moduleId) return;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/s/students/all/for/module/" +
            moduleId
        )
        .then(results => {
          this.isLoading = false;
          this.selectedAttendanceModuleStudents = results.data.map(v => {
            return {
              _id: v._id,
              username: v.username,
              lastname: v.lastname,
              firstname: v.firstname,
              selected: true
            };
          });
          console.log("results", this.selectedAttendanceModuleStudents);
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "", "error");
          } else {
            console.log(err);
            swal.fire(
              "Unable to get the attendance list",
              "Try again later",
              "error"
            );
          }
        });
    },
    submitAttendanceCode() {
      this.currentAttendanceCodeError = "";
      if (!this.currentAttendanceCode) {
        this.currentAttendanceCodeError = "Please enter a valid code";
        return;
      }
      this.isLoading = true;
      axios
        .post(this.$store.state.settings.baseLink + "/attendance/sign", {
          studentId: this.$store.state.user.id,
          code: this.currentAttendanceCode
        })
        .then(results => {
          this.isLoading = false;
          swal.fire(results.data, "", "success");
          this.signAttendanceRegister = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "", "error");
            this.currentAttendanceCodeError = err.response.data;
          } else {
            swal.fire(
              "Unable to get the attendance list",
              "Try again later",
              "error"
            );
          }
        });
    },
    selectAttendanceDate(time) {
      this.selectedAttendanceDate = time;
      this.attendanceRegisterHistoryStudentsLoading = true;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/attendance/get/for/" +
            this.selectedAttendanceDate._id
        )
        .then(results => {
          this.attendanceRegisterHistoryStudentsLoading = false;
          this.attendanceRegisterHistoryStudents = results.data;
          console.log(
            "attendanceRegisterHistoryStudents",
            this.attendanceRegisterHistoryStudents
          );
        })
        .catch(err => {
          this.attendanceRegisterHistoryStudentsLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire(
              "Unable to get the attendance list",
              "Try again later",
              "error"
            );
          }
        });
    },
    changeAttendanceTab(e) {
      if (e == "tab-home-history") {
        this.isLoading = true;
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/attendance/get/times/for/" +
              this.selectedAttendanceModule
          )
          .then(results => {
            this.isLoading = false;
            this.attendanceRegisterHistoryTimes = results.data;
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal.fire(err.response.data, "error");
            } else {
              swal.fire(
                "Unable to get the attendance list",
                "Try again later",
                "error"
              );
            }
          });
      }
      console.log(e);
    },
    createAttendance() {
      this.attendanceError = "";
      if (!this.selectedAttendanceModule) {
        this.attendanceError = "Please select a module";
        return;
      }
      let duration = 310;
      switch (this.selectedAttendanceDuration) {
        case "5 minutes":
          duration = 310;
          break;
        case "10 minutes":
          duration = 610;
          break;
        case "15 minutes":
          duration = 910;
          break;
        case "30 minutes":
          duration = 1810;
          break;
      }
      this.isLoading = true;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/attendance/create/for/" +
            this.selectedAttendanceModule,
          {
            duration,
            lecturerId: this.$store.state.user.id
          }
        )
        .then(results => {
          this.isLoading = false;
          this.createAttendanceIndex = 1;
          this.attendanceRegister = results.data;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire(
              "Unable to create attendance register",
              "Try again later",
              "error"
            );
          }
        });
    },
    changeStudent() {
      const currentStudent = this.students.filter(
        student => student._id === this.currentStudent
      );
      if (currentStudent[0]) {
        const user = currentStudent[0];
        this.$store.commit("login", {
          id: user._id,
          username: user.username,
          password: user.password,
          type: "STUDENT",
          isLoggedIn: true
        });
        const currentParent = JSON.parse(
          JSON.stringify(this.$store.state.user.parent)
        );
        const newParent = currentStudent[0].parents.filter(
          parent => parent.email === currentParent.email
        );

        if (newParent && newParent.length > 0) {
          currentParent.relationship = newParent[0].relationship;
        }
        this.$store.commit("setStudentParent", currentParent);
        this.isChangingStudent = false;
        this.currentStudent = "";
        swal.fire(
          "Success",
          `Successfully changed student to ${user.username}`,
          "success"
        );
      }
    },
    goToRoute(option) {
      if (option.showStudents) {
        this.isChangingStudent = true;
      } else if (option.attendanceRegister) {
        this.isCreatingAttendanceRegister = true;
      } else if (option.signAttendanceRegister) {
        this.signAttendanceRegister = true;
      } else {
        this.$router.push(option.link);
      }
    },
    capitalize(name) {
      if (!name) {
        return "";
      }
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    },
    GotoExternal(url) {
      window.open(url, "_blank");
    },
    AnnouncementClick(announcement) {
      swal.fire({
        title: announcement.title,
        text: announcement.message
      });
    },
    SendAnnouncement() {
      this.isLoading = true;
      this.announcement.isToAll = this.announcement.module == null;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/n/announcements/add/for/" +
            this.announcement.module +
            "/by/" +
            this.$store.state.user.type +
            "/of/id/" +
            this.$store.state.user.id,
          {
            announcement: this.announcement
          }
        )
        .then(results => {
          this.isLoading = false;
          this.isAddingAnnouncements = false;
          swal.fire("Success", "Announcement successfully sent.", "success");
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "Try again later", "error");
          } else {
            swal.fire("Unable to send announcement", "Try again later", "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bottomPin {
  position: fixed;
  bottom: 0;
}

.bigButton :hover {
  background: black;
  color: white;
}

.screen {
  /* The image used */
  background-image: url("/static/img/plain-white.png");
  /* Full height */
  height: 200vh;
  padding-top: 200px;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: auto;
  margin: auto;
}

.notificationRing {
  -webkit-animation: ring 2s infinite;
  animation: ring 2s infinite;
}

.Scroll-first-four {
  overflow: hidden;
  overflow-y: scroll;
  height: 400px;
}

.Scroll-first-four::-webkit-scrollbar {
  display: none;
}

@-webkit-keyframes ring {
  0% {
    -webkit-transform: rotate(35deg);
  }
  12.5% {
    -webkit-transform: rotate(-30deg);
  }
  25% {
    -webkit-transform: rotate(25deg);
  }
  37.5% {
    -webkit-transform: rotate(-20deg);
  }
  50% {
    -webkit-transform: rotate(15deg);
  }
  62.5% {
    -webkit-transform: rotate(-10deg);
  }
  75% {
    -webkit-transform: rotate(5deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
  }
}

@keyframes ring {
  0% {
    -webkit-transform: rotate(35deg);
    transform: rotate(35deg);
  }
  12.5% {
    -webkit-transform: rotate(-30deg);
    transform: rotate(-30deg);
  }
  25% {
    -webkit-transform: rotate(25deg);
    transform: rotate(25deg);
  }
  37.5% {
    -webkit-transform: rotate(-20deg);
    transform: rotate(-20deg);
  }
  50% {
    -webkit-transform: rotate(15deg);
    transform: rotate(15deg);
  }
  62.5% {
    -webkit-transform: rotate(-10deg);
    transform: rotate(-10deg);
  }
  75% {
    -webkit-transform: rotate(5deg);
    transform: rotate(5deg);
  }
  100% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
}
</style>
