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
            <v-card-title class="headline text-white"
              >Attendance register</v-card-title
            >
            <v-card-text
              ><span class="text-white"
                >Enter the code to sign your attendance.</span
              ></v-card-text
            >
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
            <v-btn
              icon
              v-on:click="signAttendanceRegister = false"
              right
              class="right"
            >
              <v-icon style="color:ghostwhite">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row class="bg-white mx-auto">
        <v-col cols="8" class=" text-center" offset-md="2">
          <h5 class="display-1 text-xs-center mx-auto my-5">
            {{ getMoment().format("Do MMMM YYYY") }}
          </h5>
          <h3 class="display-2 text-xs-center mx-auto my-5">
            {{ getMoment().format("hh:mm A") }}
          </h3>
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
          <p class="red-text text-red text-center">
            {{ currentAttendanceCodeError }}
          </p>
          <ball-pulse-loader
            class="col s12 text-center"
            v-if="isLoading"
            color="#000000"
            size="20px"
          ></ball-pulse-loader>
          <v-btn
            :loading="isLoading"
            block
            x-large
            v-on:click="submitAttendanceCode"
            color="primary"
            >Submit</v-btn
          >
        </v-col>
      </v-row>
    </v-dialog>
    <v-dialog
      v-if="
        $store.state.user.isLoggedIn && $store.state.user.type == 'LECTURER'
      "
      class="card"
      max-width="600"
      color="white"
      v-model="isCreatingAttendanceRegister"
    >
      <v-card color="secondary">
        <v-row>
          <v-col cols="10">
            <v-card-title class="headline text-white"
              >Creating attendance register</v-card-title
            >
            <v-card-text
              ><span class="text-white"
                >Display this code for people to sign in.</span
              ></v-card-text
            >
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
            <v-btn
              icon
              v-on:click="isCreatingAttendanceRegister = false"
              right
              class="right"
            >
              <v-icon style="color:ghostwhite">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row class="bg-white row">
        <v-col cols="12">
          <v-select
            class="ma-5"
            :items="
              modules.map(v => {
                return { _id: v._id, title: `${v.name} - ${v.code}` };
              })
            "
            item-text="title"
            item-value="_id"
            label="Select a module"
            @change="setStudentsForModule"
            v-model="selectedAttendanceModule"
          >
          </v-select>
        </v-col>
        <v-col v-if="selectedAttendanceModule" cols="12">
          <v-tabs
            grow
            v-model="tabSelectedAttendanceModule"
            @change="changeAttendanceTab"
          >
            <v-tab id="tab-home">Create new</v-tab>
            <v-tab id="tab-home-history">View history</v-tab>
            <v-tab v-if="attendanceRegister" id="tab-home-manual"
              >Sign manually</v-tab
            >
          </v-tabs>
          <v-tabs-items v-model="tabSelectedAttendanceModule">
            <v-tab-item class="ma-5">
              <v-row v-show="createAttendanceIndex == 0">
                <v-col cols="12">
                  <v-select
                    color="secondary"
                    outlined
                    label="Select a duration"
                    :items="[
                      'Never',
                      '5 minutes',
                      '10 minutes',
                      '15 minutes',
                      '30 minutes'
                    ]"
                    v-model="selectedAttendanceDuration"
                  >
                  </v-select>
                </v-col>
                <v-col v-if="attendanceError" mx-auto cols="12">
                  <p class="red-text mx-auto text-red text-xs-center">
                    {{ attendanceError }}
                  </p>
                </v-col>
                <v-col mx-auto cols="12">
                  <v-btn
                    :loading="isLoading"
                    v-on:click="createAttendance()"
                    color="secondary"
                    large
                    block
                    rounded
                    >Generate</v-btn
                  ></v-col
                >
              </v-row>
              <v-row
                v-if="createAttendanceIndex == 1 && attendanceRegister"
                class="col s12"
              >
                <v-col cols="8" class=" text-center" offset-md="2">
                  <h5 class="display-1 text-xs-center mx-auto my-5">
                    Attendance code
                  </h5>
                  <h2
                    class="display-4 text-xs-center bg-grey text-blue mx-auto py-10"
                  >
                    {{ attendanceRegister.code }}
                  </h2>
                  <h5
                    class="text-xs-center display-2 title mx-auto my-5"
                    v-if="getMoment()"
                  >
                    Expires
                    <span class="text-peach">{{
                      getMoment(attendanceRegister.expiryDate).fromNow()
                    }}</span>
                  </h5>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row v-if="!selectedAttendanceDate" class="row">
                <v-col
                  cols="12"
                  md="6"
                  v-for="(time, i) in attendanceRegisterHistoryTimes"
                  :key="i"
                >
                  <v-card
                    @click="selectAttendanceDate(time)"
                    outlined
                    class="border-top-blue"
                  >
                    <v-row class="mx-auto my-auto px-2">
                      <v-col cols="2" class="mx-auto my-auto">
                        <v-icon
                          color="primary"
                          class="text-peach mx-auto my-auto"
                          size="30"
                          >mdi-calendar</v-icon
                        >
                      </v-col>
                      <v-col cols="10">
                        <v-list-item-content>
                          <v-list-item-title class="title mb-1">
                            {{
                              getMoment(time.date).format("Do MMMM")
                            }}</v-list-item-title
                          >
                          <v-list-item-subtitle
                            ><span class="text-blue">
                              {{ time.totalStudents }} attended</span
                            ></v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
              <div v-if="selectedAttendanceDate" class="Scroll-first-four">
                <v-row>
                  <v-col class="my-auto" cols="2">
                    <v-btn
                      large
                      icon
                      class="my-auto mx-5"
                      v-on:click="selectedAttendanceDate = false"
                    >
                      <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="10" class="my-auto">
                    <v-list-item-content>
                      <v-list-item-title class="title mb-1">
                        {{
                          getMoment(selectedAttendanceDate.date).format(
                            "Do MMMM"
                          )
                        }}</v-list-item-title
                      >
                      <v-list-item-subtitle
                        ><span class="text-blue">
                          {{ selectedAttendanceDate.totalStudents }}
                          attended</span
                        ></v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-col>
                </v-row>
                <v-row
                  :loading="attendanceRegisterHistoryStudentsLoading"
                  class="v-triple-line col s12 center-align"
                >
                  <v-col
                    cols="12"
                    md="6"
                    v-for="(student,
                    i) in attendanceRegisterHistoryStudents.filter(
                      v => v && v.studentId
                    )"
                    :key="i"
                  >
                    <v-card shaped outlined>
                      <v-list-item three-line>
                        <v-list-item-avatar tile class="my-auto" size="40">
                          <v-icon class="text-peach my-auto" size="60"
                            >mdi-account-outline</v-icon
                          >
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <div class="overline mb-4">
                            <span class="text-peach">{{
                              getMoment(student.date).fromNow()
                            }}</span>
                          </div>
                          <v-list-item-title class="subtitle-1 mb-1">{{
                            student.studentId.username
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            ><span class="text-blue">
                              {{
                                student.studentId.lastname +
                                  " " +
                                  student.studentId.firstname
                              }}
                            </span></v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-tab-item>
            <v-tab-item v-if="attendanceRegister">
              <v-row class="row">
                <v-col cols="12">
                  <h5 class="display-1 text-center title mt-3">
                    Mark all the present students
                  </h5>
                </v-col>
                <v-col cols="12" mx-auto class="v-triple-line mx-auto">
                  <v-row class="Scroll-first-four">
                    <v-col
                      cols="12"
                      md="4"
                      v-for="(student, i) in selectedAttendanceModuleStudents"
                      :key="i"
                    >
                      <v-list-item
                        @click="student.selected = !student.selected"
                        :class="{ white: student.selected }"
                        class="pointer"
                        three-line
                      >
                        <v-list-item-avatar
                          large
                          :color="student.selected ? 'secondary' : 'primary'"
                          outlined
                          class="my-auto"
                        >
                          <v-icon color="white">{{
                            student.selected ? "mdi-check" : "mdi-close"
                          }}</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="subtitle-1 mb-1">{{
                            student.username
                          }}</v-list-item-title>
                          <v-list-item-subtitle
                            ><span class="text-blue">
                              {{ student.lastname + " " + student.firstname }}
                            </span></v-list-item-subtitle
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <v-btn
                    :loading="isLoading"
                    v-on:click="submitBulkAttendance"
                    color="secondary"
                    large
                    block
                    rounded
                    >Submit</v-btn
                  >
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-dialog>
    <v-dialog
      v-if="isParent"
      class="card"
      max-width="600"
      color="white"
      v-model="isChangingStudent"
    >
      <v-card color="secondary">
        <v-row>
          <v-col cols="10">
            <v-card-title class="headline text-white"
              >Change Student</v-card-title
            >
            <v-card-text
              ><span class="text-white"
                >Access someone's profile</span
              ></v-card-text
            >
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
            <v-btn
              icon
              v-on:click="isChangingStudent = false"
              right
              class="right"
            >
              <v-icon style="color:ghostwhite">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row class="bg-white">
        <v-col cols="12">
          <v-select
            class="ma-5"
            :items="
              students.map(v => {
                return {
                  _id: v._id,
                  title: `${v.username} - ${v.firstname} ${v.lastname}`
                };
              })
            "
            item-text="title"
            item-value="_id"
            label="Select Student"
            v-model="currentStudent"
          >
          </v-select>
        </v-col>

        <v-col mx-auto cols="12">
          <v-btn
            :loading="isLoading"
            v-on:click="changeStudent()"
            color="secondary"
            large
            block
            rounded
            >Change student</v-btn
          ></v-col
        >
      </v-row>
    </v-dialog>
    <v-dialog
      v-if="
        $store.state.user.isLoggedIn &&
          ($store.state.user.type == 'LECTURER' ||
            $store.state.user.type == 'ADMIN')
      "
      max-width="600"
      color="white"
      v-model="isAddingAnnouncements"
    >
      <v-card color="secondary">
        <v-row>
          <v-col cols="10">
            <v-card-title class="headline text-white"
              >Send an announcement</v-card-title
            >
            <v-card-text
              ><span class="text-white"
                >Communicate with students in real-time</span
              ></v-card-text
            >
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
            <v-btn
              icon
              v-on:click="isAddingAnnouncements = false"
              right
              class="right"
            >
              <v-icon style="color:ghostwhite">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row 
      class="bg-white px-10">
      <v-col cols="12">
        <v-text-field
          color="secondary"
          label="Announcement title"
          outlined
          v-model="announcement.title"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-textarea
          color="secondary"
          label="Message"
          outlined
          prepend-inner-icon="mdi-bullhorn-outline"
          v-model="announcement.message"
        >
        </v-textarea>
      </v-col>
      <v-col cols="12">
        <v-checkbox v-model="announcement.isParent" label="Send announcement to parents"></v-checkbox>
      </v-col>
      <v-col cols="12">
        <v-checkbox 
                    v-model="announcement.module"
                    value="all_students" label="Send to all students"></v-checkbox>
          <v-select
            v-show="announcement.module != 'all_students'"
            :items="
              modules.map(v => {
                return {
                  _id: v._id,
                  title: `${v.name} ${v.code} students`
                };
              })
            "
            item-text="title"
            item-value="_id"
            label="Send to : "
            v-model="announcement.module"
          >
          </v-select>
      </v-col>

        <v-col cols="12">
          <p
          v-if="!isLoading"
          class="text-center"
          >The announcement will be sent to
          {{
            modules.some(v => v && v._id == announcement.module)
              ? `${modules.find(v => v && v._id == announcement.module).name} ${
                  modules.find(v => v && v._id == announcement.module).code
                }`
              : "All"
          }}
          students
          {{
            announcement.isParent ? " and SMSs to thier parents as well" : ""
          }}</p
        >
          <v-btn
            :loading="isLoading"
            v-on:click="SendAnnouncement()"
            color="secondary"
            large
            block
            rounded
            >Send announcement</v-btn
          ></v-col
        >
      </v-row>
    </v-dialog>

    <v-row v-if="!$store.state.user.isLoggedIn" class="row">
      <v-col cols="9">
        <h4 class="title text-blue px-5">We offer the following services</h4>
      </v-col>
      <v-col cols="2" class="mx-auto">
        <v-btn
          v-on:click="$router.push('/login')"
          x-large
          v-if="!$store.state.user.isLoggedIn"
          block
          rounded
          p-5
          color="secondary"
        >
          Login
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-row class="px-10">
          <v-col cols="4">
            <v-card>
              <v-card-title class="mx-auto" center>
                <span class="text-center title mx-auto mb-n4 text-peach center"
                  >Digital attendance register</span
                >
              </v-card-title>
              <v-img src="../assets/images/backgrounds/family_2x.png" />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title class="mx-auto" center>
                <span class="text-center title mx-auto mb-n4 text-peach center"
                  >Study materials of all modules/subjects</span
                >
              </v-card-title>
              <v-img src="../assets/images/backgrounds/coderdojo.png" />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title class="mx-auto" center>
                <span class="text-center title mx-auto mb-n4 text-peach center"
                  >Online tests and assesments</span
                >
              </v-card-title>
              <v-img src="../assets/images/backgrounds/invoice_maker_2x.jpg" />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title class="mx-auto" center>
                <span class="text-center title mx-auto mb-n4 text-blue center"
                  >Real time notifications to parents and students</span
                >
              </v-card-title>
              <v-img src="../assets/images/backgrounds/notification.png" />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title class="mx-auto" center>
                <span class="text-center title mx-auto mb-n4 text-blue center"
                  >Access to marksheets and assessment results</span
                >
              </v-card-title>
              <v-img src="../assets/images/backgrounds/education.jpg" />
            </v-card>
          </v-col>
          <v-col cols="4">
            <v-card>
              <v-card-title class="mx-auto" center>
                <span class="text-center title mx-auto mb-n4 text-blue center"
                  >Digitalized administrative system roles</span
                >
              </v-card-title>
              <v-img src="../assets/images/backgrounds/seating.png" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <h4 class="title text-blue px-5">
          Meet some of our cool friends that might help boost your career life
        </h4>
      </v-col>
      <v-col v-for="(partner, i) in partners" :key="i" cols="4">
        <v-card
          class="mx-5 mb-5"
          shaped
          outlined
          v-on:click="GotoExternal(partner.link)"
        >
          <v-img
            class="mx-10 my-5"
            max-width="200"
            max-height="100"
            :src="partner.img"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="$store.state.user.isLoggedIn" class="row">
      <v-col cols="4">
        <v-row>
          <v-col cols="10" offset-md="1">
            <v-list-item-title>
              <v-btn
                class="my-auto"
                v-if="
                  $store.state.user.type == 'LECTURER' ||
                    $store.state.user.type == 'ADMIN'
                "
                icon
                v-on:click="isAddingAnnouncements = true"
              >
                <v-icon size="40">
                  mdi-plus
                </v-icon>
              </v-btn>
              <span class="title mx-5 my-auto text-blue">Annnouncements</span>
            </v-list-item-title>
          </v-col>
          <v-col>
            <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
              <ball-pulse-loader
                v-if="isLoading"
                color="#000000"
                size="20px"
              ></ball-pulse-loader>
            </div>
          </v-col>
          <v-col style="overflow-y:scroll;max-height:50vh" cols="12">
            <v-card
              class="mx-10 mb-5"
              shaped
              outlined
              v-on:click="AnnouncementClick(announcement)"
              v-for="(announcement, i) in announcements"
              :key="i"
            >
              <v-list-item three-line>
                <v-list-item-avatar tile size="80">
                  <v-icon class="text-peach" size="50">mdi-bell</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="overline mb-4">
                    {{
                      announcement.lecturerId
                        ? announcement.lecturerId.lastname +
                          " " +
                          announcement.lecturerId.firstname
                        : "Admin"
                    }}
                    &nbsp;&bull;
                    <span class="text-peach">{{
                      getMoment(announcement.date).fromNow()
                    }}</span>
                  </div>
                  <v-list-item-title class="subtitle-1 mb-1">{{
                    announcement.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    ><span class="text-blue">{{
                      announcement.message
                    }}</span></v-list-item-subtitle
                  >
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
            v-for="(option, i) in options.filter(
              o => o.auth == null || o.auth.indexOf($store.state.user.type) >= 0
            )"
            :key="i"
            cols="6"
          >
            <v-card
              v-on:click="goToRoute(option)"
              outlined
              class="border-top-blue"
            >
              <v-row class="mx-auto my-auto px-2">
                <v-col cols="2" class="mx-auto my-auto">
                  <v-icon
                    color="primary"
                    class="text-peach mx-auto my-auto"
                    size="30"
                    >{{ option.icon }}</v-icon
                  >
                </v-col>
                <v-col cols="10">
                  <v-list-item-content>
                    <v-list-item-title class="title mb-1">
                      {{ option.text }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                      ><span class="text-blue">
                        {{ option.description }}</span
                      ></v-list-item-subtitle
                    >
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
      tabSelectedAttendanceModule: null,
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
          icon: "mdi-account-multiple",
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
      if (e == 1) {
        // Case is tab-home-history
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
        case "Never":
          duration = 31538000;
          break;
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
      if(this.announcement.module == "all_students"){
        this.announcement.module = null;
      }
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
            swal.fire(
              "Unable to send announcement",
              "Try again later",
              "error"
            );
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
  max-height: 300px;
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
