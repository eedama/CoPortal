<template>
  <div class="screen">
    <md-dialog
      v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'STUDENT'"
      style="position:fixed;max-width:100%;max-height:60%;min-height:20%;min-width:40%;"
      class="card"
      :md-active.sync="signAttendanceRegister"
    >
      <md-card class="col s12" style="background-color:#006064;">
        <md-card-header>
          <div class="md-title" style="color:ghostwhite">Attendance register</div>
          <md-button v-on:click="signAttendanceRegister = false" class="right">
            <md-icon style="color:ghostwhite">close</md-icon>
          </md-button>
        </md-card-header>
      </md-card>
      <md-content class="row">
        <div class="col s12 row">
          <h5 class="text-xs-center center col s12">{{ getMoment().format("Do MMMM YYYY") }}</h5>
          <h3 class="text-xs-center center col s12">{{ getMoment().format("hh:mm A") }}</h3>
          <md-content class="col s12">
            <md-field style="height:100px">
              <label class="center"></label>
              <md-input
                class="center"
                placeholder="Attendance code"
                @keyup.enter="submitAttendanceCode"
                style="height:100px;font-size:50px;border:2px solid #006064"
                v-model="currentAttendanceCode"
              />
            </md-field>
          </md-content>
          <p class="red-text text-red center">{{ currentAttendanceCodeError }}</p>
          <ball-pulse-loader class="col s12 center" v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
          <md-button
            v-if="!isLoading"
            v-on:click="submitAttendanceCode"
            class="md-primary col s12"
            style="background-color:#006064;color:ghostwhite"
          >Submit</md-button>
        </div>
      </md-content>
    </md-dialog>
    <md-dialog
      v-if="$store.state.user.isLoggedIn && $store.state.user.type == 'LECTURER'"
      style="position:fixed;max-width:100%;max-height:60%;min-height:20%;min-width:40%;"
      class="card"
      :md-active.sync="isCreatingAttendanceRegister"
    >
      <md-card class="col s12" style="background-color:#006064;">
        <md-card-header>
          <div class="md-title" style="color:ghostwhite">Creating attendance register</div>
          <md-button v-on:click="isCreatingAttendanceRegister = false" class="right">
            <md-icon style="color:ghostwhite">close</md-icon>
          </md-button>
        </md-card-header>
      </md-card>
      <md-content style="overflow-y:scroll" class="row">
        <md-field class="col s8 offset-s2">
          <label>Select a module</label>
          <md-select @md-selected="setStudentsForModule" v-model="selectedAttendanceModule">
            <md-option
              v-for="(_module,i) in modules"
              :key="i"
              style="background-color:white"
              :value="_module._id"
            >{{ _module.name }} {{ _module.code }}</md-option>
          </md-select>
        </md-field>
        <md-tabs v-if="selectedAttendanceModule" class="col s12" @md-changed="changeAttendanceTab">
          <md-tab id="tab-home" md-label="New">
            <div class="row">
              <md-content v-show="createAttendanceIndex == 0" class="col s12">
                <md-field>
                  <label>Select a duration</label>
                  <md-select v-model="selectedAttendanceDuration">
                    <md-option
                      v-for="(duration,i) in ['5 minutes','10 minutes','15 minutes','30 minutes']"
                      :key="i"
                      style="background-color:white"
                      :value="duration"
                    >{{ duration }}</md-option>
                  </md-select>
                </md-field>
                <md-field>
                  <p
                    class="red-text text-red text-xs-center"
                    v-if="attendanceError"
                  >{{ attendanceError }}</p>
                </md-field>
              </md-content>
              <md-content v-if="createAttendanceIndex == 1 && attendanceRegister" class="col s12">
                <div class="row">
                  <h5 class="col s12">The attendance code is</h5>
                  <h2 class="col s12 text-xs-center center">{{ attendanceRegister.code }}</h2>
                  <h4
                    class="col s12 text-xs-center center"
                    v-if="getMoment()"
                  >Expires {{ getMoment(attendanceRegister.expiryDate).fromNow() }}</h4>
                </div>
              </md-content>
              <md-button
                v-if="createAttendanceIndex == 0 && !isLoading"
                v-on:click="createAttendance()"
                class="md-primary col s12"
                style="background-color:#006064;color:ghostwhite"
              >Create attendance register</md-button>
            </div>
          </md-tab>
          <md-tab id="tab-home-history" md-label="History">
            <div v-if="!selectedAttendanceDate" class="row">
              <md-button
                v-for="(time,i) in attendanceRegisterHistoryTimes"
                :key="i"
                @click="selectAttendanceDate(time)"
                class="col s4 offset-s1"
              >{{ getMoment(time.date).format("Do MMMM") }}</md-button>
            </div>
            <div v-if="selectedAttendanceDate" class="row">
              <md-button v-on:click="selectedAttendanceDate = false">
                <md-icon>arrow_back</md-icon>
              </md-button>
              <md-list class="md-triple-line col s12 center-align">
                <div class="Scroll-first-four">
                  <md-list-item
                    style="margin-bottom:15px;"
                    v-for="(student,i) in attendanceRegisterHistoryStudents.filter(v => v && v.studentId)"
                    :key="i"
                    class="hoverable col s12 m10 pointer white center-align waves-effect"
                  >
                    <md-avatar>
                      <img src="https://placeimg.com/40/40/people/1" alt="People" />
                    </md-avatar>

                    <div class="md-list-item-text">
                      <span>{{ student.studentId.lastname + " " + student.studentId.firstname }} &nbsp;&bull; {{ getMoment(student.date).fromNow() }}</span>
                      <span>{{ student.studentId.username }}</span>
                    </div>
                  </md-list-item>
                </div>
              </md-list>
              <ball-pulse-loader
                class="text-xs-center center col s12"
                v-if="attendanceRegisterHistoryStudentsLoading"
                color="#000000"
                size="20px"
              ></ball-pulse-loader>
            </div>
          </md-tab>
          <md-tab v-if="attendanceRegister" id="tab-home-manual" md-label="Sign manually">
            <div class="row">
              <md-list class="md-triple-line col s12 center-align">
                <h6>Mark all the present students</h6>
                <div class="Scroll-first-four">
                  <md-list-item
                    style="margin-bottom:15px;"
                    v-for="(student,i) in selectedAttendanceModuleStudents"
                    :key="i"
                    @click="student.selected = !student.selected"
                    class="col s12 m10 pointer center-align waves-effect"
                    :class="{'white':student.selected}"
                  >
                    <md-avatar>
                      <md-icon
                        v-show="!student.selected"
                        class="black-text"
                        style="color:ghostwhite;width:100%;height:100%"
                      >close</md-icon>
                      <md-icon
                        v-show="student.selected"
                        class="black-text"
                        style="color:ghostwhite;width:100%;height:100%"
                      >done</md-icon>
                    </md-avatar>

                    <div class="md-list-item-text">
                      <span>{{ student.lastname + " " + student.firstname }} &nbsp;&bull;</span>
                      <span>{{ student.username }}</span>
                    </div>
                  </md-list-item>
                </div>
              </md-list>
              <div class="col s12">
                <ball-pulse-loader class="col s12 center" v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
              </div>
              <div class="col s12">
                <md-button
                  v-if="!isLoading"
                  v-on:click="submitBulkAttendance"
                  class="md-primary col s12"
                  style="background-color:#006064;color:ghostwhite"
                >Submit</md-button>
              </div>
            </div>
          </md-tab>
        </md-tabs>

        <ball-pulse-loader
          class="text-xs-center center col s12"
          v-if="isLoading"
          color="#000000"
          size="20px"
        ></ball-pulse-loader>
      </md-content>
    </md-dialog>
    <md-dialog
      v-if="isParent"
      style="position:fixed;max-width:100%;max-height:60%;min-height:20%;min-width:40%;"
      class="card"
      :md-active.sync="isChangingStudent"
    >
      <md-card class="col s12" style="background-color:#006064;">
        <md-card-header>
          <div class="md-title" style="color:ghostwhite">Change Student</div>
          <md-button v-on:click="isChangingStudent = false" class="right">
            <md-icon style="color:ghostwhite">close</md-icon>
          </md-button>
        </md-card-header>
      </md-card>
      <md-card-actions>
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
        <div class="row">
          <md-content class="col s12">
            <md-field>
              <label>Select Student</label>
              <md-select v-model="currentStudent">
                <md-option
                  v-for="(student,i) in students"
                  :key="i"
                  style="background-color:white"
                  :value="student._id"
                >{{ student.username }}</md-option>
              </md-select>
            </md-field>
          </md-content>
          <md-button
            v-if="!isLoading"
            v-on:click="changeStudent()"
            class="md-primary col s12"
            style="background-color:#006064;color:ghostwhite"
          >Change student</md-button>
        </div>
      </md-card-actions>
    </md-dialog>
    <md-dialog
      v-if="$store.state.user.isLoggedIn && ($store.state.user.type=='LECTURER' || $store.state.user.type=='ADMIN')"
      style="position:fixed;max-height:100vh;min-height:20%;width:100%;"
      class="card"
      :md-active.sync="isAddingAnnouncements"
    >
      <md-card class="col s12">
        <md-card-header style="background-color:#006064;" class="row">
          <div class="col s12 m10 offset-m1 text-center">
            <span style="color:ghostwhite" class="md-title">Send an announcement</span>
            <md-button class="right" v-on:click="isAddingAnnouncements = false">
              <md-icon style="color:ghostwhite">close</md-icon>
            </md-button>
          </div>
        </md-card-header>
        <md-content>
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
        </md-content>
        <md-card-actions style="background-color:#006064;padding:10px">
          <span
            v-if="!isLoading"
            style="float:left;left:0;position:absolute;padding-left:30px;color:ghostwhite;max-width:100%"
          >The announcement will be sent to {{ modules.some(v => v && v._id == announcement.module) ? `${modules.find(v => v && v._id == announcement.module).name} ${modules.find(v => v && v._id == announcement.module).code}` : 'All' }} students {{ announcement.isParent ? ' and SMSs to thier parents as well' : ''}}</span>
          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
          <md-button
            v-if="!isLoading"
            v-on:click="SendAnnouncement()"
            style="color:ghostwhite;max-width:40%"
            class="md-secondary"
          >Send announcement</md-button>
        </md-card-actions>
      </md-card>
    </md-dialog>

    <div class="row">
      <div class="col s6 offset-s3 m8 offset-m2 center-align">
        <h5 class="center-align">
          <vue-typer
            v-if="!$store.state.user.isLoggedIn"
            class="center-align"
            :text="titleText"
            erase-style="backspace"
          ></vue-typer>
          <span v-if="$store.state.user.isLoggedIn">
            Welcome
            <span v-if="isParent">
              <a class="pointer">{{$store.state.user.parent.name}}</a>
            </span>
            <span v-if="!isParent">
              back
              <a class="pointer">{{ $store.state.user.username }}</a>
            </span>
          </span>
        </h5>
      </div>
      <div class="col s10 offset-s1 m8 offset-m2 center-align">
        <img src="../assets/logo.png" class="responsive-img" />
      </div>
    </div>
    <div v-if="!$store.state.user.isLoggedIn" class="row">
      <div
        v-on:click="$router.push('/login')"
        class="col m6 offset-m3 s12 pointer bigButton center-align waves-effect"
      >
        <div class="card-panel hoverable">
          <h5 class="center-align">
            <i style="font-size:100%" class="material-icons left">lock</i>
            <span>Login</span>
          </h5>
        </div>
      </div>
    </div>
    <div v-if="!$store.state.user.isLoggedIn" class="row bottomPin">
      <div class="col s12 center-align">
        <h5
          class="center-align"
        >Meet some of our cool friends that might help boost your career life</h5>
      </div>
      <div
        v-for="(partner,i) in partners"
        :key="i"
        v-on:click="GotoExternal(partner.link)"
        class="col m3 s6 pointer bigButton center-align waves-effect"
      >
        <div class="card-panel hoverable">
          <h6 class="center-align">
            <span>{{ partner.name }}</span>
          </h6>
        </div>
      </div>
    </div>
    <div v-if="$store.state.user.isLoggedIn" class="row">
      <div class="col s12 m6 xl4 push-xl2">
        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <md-card-header class="left">Annnouncements</md-card-header>
        </div>
        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
        </div>
        <md-list class="md-triple-line col s12 center-align">
          <div class="Scroll-first-four">
            <md-list-item
              v-if="$store.state.user.type == 'LECTURER' || $store.state.user.type == 'ADMIN'"
              v-on:click="isAddingAnnouncements = true"
              style="margin-bottom:15px"
              class="hoverable col s12 m10 pointer white center-align waves-effect"
            >
              <md-avatar>
                <md-icon>add</md-icon>
              </md-avatar>

              <div class="md-list-item-text center-align">
                <span>Add new Announcement</span>
              </div>
            </md-list-item>
            <md-list-item
              v-on:click="AnnouncementClick(announcement)"
              style="margin-bottom:15px;"
              v-for="(announcement,i) in announcements"
              :key="i"
              class="hoverable col s12 m10 pointer white center-align waves-effect"
            >
              <md-avatar>
                <img src="https://placeimg.com/40/40/people/1" alt="People" />
              </md-avatar>

              <div class="md-list-item-text">
                <span>{{ announcement.lecturerId ? announcement.lecturerId.lastname + " " + announcement.lecturerId.firstname : "Admin" }} &nbsp;&bull; {{ getMoment(announcement.date).fromNow() }}</span>
                <span>{{ announcement.title }}</span>
                <p>{{ announcement.message }}</p>
              </div>
            </md-list-item>
          </div>
        </md-list>
      </div>
      <div class="col s12 m6 xl4 push-xl2 row" style="margin-top:-6px;">
        <div @click="changeSchool()" class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <md-card-header class="left">
            {{ capitalize($store.state.settings.school) }}
            <span v-if="isParent">Parent</span> Portal
          </md-card-header>
        </div>
        <div
          v-for="(option,i) in options.filter(o => o.auth == null || o.auth.indexOf($store.state.user.type) >= 0)"
          :key="i"
          v-on:click="goToRoute(option)"
          class="col s12 pointer bigButton waves-effect"
        >
          <div class="card-panel hoverable">
            <h5 class="center-align">
              <i style="font-size:100%" class="material-icons left">{{ option.icon }}</i>
              <span>{{ option.text }}</span>
            </h5>
          </div>
        </div>
      </div>
    </div>
    <div v-if="$store.state.user.isLoggedIn" class="row">
      <div v-on:click="Logout()" class="col m2 offset-m5 s12 pointer center-align waves-effect">
        <div class="card-panel hoverable red">
          <h5 class="text-xs-center">
            Log out
            <i class="material-icons right">exit_to_app</i>
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
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
      signAttendanceRegister: true,
      currentAttendanceCodeError: "",
      currentAttendanceCode: "",
      ///
      isParent: false,
      partners: [
        {
          link: "https://www.onlinecareerguidance.co.za",
          name: "Online career guidance"
        },
        {
          link: "http://www.zabursaries.co.za",
          name: "ZA Bursaries"
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
          icon: "event_available",
          link: "/module/list/attend",
          attendanceRegister: true,
          auth: ["LECTURER"]
        },
        {
          text: "Sign Attendance Register",
          icon: "event_available",
          link: "/module/list/attend",
          signAttendanceRegister: true,
          auth: ["STUDENT"]
        },
        {
          text: "Survey",
          icon: "question_answer",
          link: "/survey/list",
          auth: ["LECTURER","ADMIN"]
        },
        {
          text: "Students",
          icon: "people",
          link: "/student/list",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: this.$store.state.user.isParent
            ? "Student Profile"
            : "Edit profile",
          icon: "account_circle",
          link: "/student/update",
          auth: ["STUDENT"]
        },
        {
          text: "Lecturers",
          icon: "supervised_user_circle",
          link: "/lecturer/list",
          auth: ["ADMIN"]
        },
        {
          text: this.$store.state.user.isParent ? "Student Modules" : "Modules",
          icon: "books",
          link: "/module/list",
          auth: ["ADMIN", "LECTURER", "STUDENT"]
        },
        {
          text: this.$store.state.user.isParent ? "Student Marks" : "Marks",
          icon: "done_all",
          link: "/marks/all",
          auth: ["STUDENT"]
        },
        {
          text: "Assessment results",
          icon: "done_all",
          link: "/marks/sheet",
          auth: ["LECTURER", "ADMIN"]
        },
        {
          text: "Report a student",
          icon: "timeline",
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
            swal(err.response.data, "error");
          } else {
            swal(err.message, "Try again later", "error");
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
              swal(err.response.data, "error");
            } else {
              swal("Unable to load modules", "Try again later", "error");
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
        swal(
          "Unable to sign register",
          "make sure you selected students",
          "error"
        );
        return;
      }
      console.log("selected students",students);
      console.log("selected code",code);
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
          swal(results.data, "", "success");
          this.isCreatingAttendanceRegister = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "", "error");
          } else {
            console.log(err);
            swal(
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
            swal(err.response.data, "", "error");
          } else {
            console.log(err);
            swal(
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
          swal(results.data, "", "success");
          this.signAttendanceRegister = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "", "error");
            this.currentAttendanceCodeError = err.response.data;
          } else {
            swal(
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
            swal(err.response.data, "error");
          } else {
            swal(
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
              swal(err.response.data, "error");
            } else {
              swal(
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
            swal(err.response.data, "error");
          } else {
            swal(
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
        swal(
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
      swal({
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
          swal("Success", "Announcement successfully sent.", "success");
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "Try again later", "error");
          } else {
            swal("Unable to send announcement", "Try again later", "error");
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
