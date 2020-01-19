<template>
  <v-row>
    <v-col cols="10"> </v-col>
    <v-col cols="2">
      <v-btn
        right
        v-on:click="addingStudents ? (addingStudents = false) : $router.back()"
        class="primary justify-end"
      >
        <v-icon>mdi-keyboard-backspace</v-icon>
        <span class="px-2">Back</span>
      </v-btn>
    </v-col>

    <v-col
      sm="12"
      md="4"
      md-offset="4"
      class="mx-auto"
      v-show="!addingStudents"
    >
      <v-btn
        block
        v-on:click="addingStudents = !addingStudents"
        class="secondary"
        >Add new student</v-btn
      >
    </v-col>
    <v-col cols="12" sm="12" md="6" class="mx-auto" v-if="addingStudents">
         <v-card color="secondary">
        <v-row>
          <v-col cols="10">
            <v-card-title class="headline text-white"
              >Adding student</v-card-title
            >
            <v-card-text
              ><span class="text-white"
                >The student will be able to access the mobile app and this
                portal</span
              ></v-card-text
            >
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
            <v-btn icon v-on:click="addingStudents = false" right class="right">
              <v-icon style="color:ghostwhite">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <add-student v-on:submitted="AddedNewStudent"></add-student>
    </v-col>
    <v-col cols="12">
      <v-row v-if="!addingStudents" class="row">
        <v-dialog
          class="card"
          max-width="600"
          v-if="studentModule"
          color="white"
          :v-active.sync="studentModule._id != null"
        >
          <v-dialog-title
            >Adding modules for {{ studentModule.username }}</v-dialog-title
          >

          <v-dialog-content>
            <div
              class="row"
              :key="i"
              v-for="(m, i) in studentModule.modules.length"
            >
              <div class="col s10">
                <v-field>
                  <label :for="`mmodules-${i}`">Module {{ m }}</label>
                  <v-select
                    v-model="studentModule.modules[i]"
                    :name="`mmodules-${i}`"
                    :id="`mmodules-${i}`"
                  >
                    <v-option
                      :disabled="
                        studentModule.modules.filter(sm => sm == _module._id)
                          .length > 0
                      "
                      v-for="_module in modules"
                      :value="_module._id"
                      :key="_module._id"
                      >{{ _module.name }} ({{ _module.code }})</v-option
                    >
                  </v-select>
                </v-field>
              </div>
              <div class="col s2 bottom-align">
                <a
                  v-on:click="studentModule.modules.push(null)"
                  v-show="
                    i == studentModule.modules.length - 1 &&
                      studentModule.modules[i] != null
                  "
                  class="btn btn-floating waves-effect"
                  ><i class="material-icons">add</i></a
                >
                <a
                  v-on:click="studentModule.modules.splice(i, 1)"
                  v-show="i != studentModule.modules.length - 1"
                  class="btn btn-floating red waves-effect"
                  ><i class="material-icons">close</i></a
                >
              </div>
            </div>
          </v-dialog-content>
          <v-dialog-actions>
            <v-btn class="v-primary" @click="AddNewModule(null)">Close</v-btn>
            <v-btn
              v-if="!isLoading"
              class="v-primary"
              @click="AddNewModule('submit')"
              >Save Changes</v-btn
            >
            <div class="row">
              <div
                class="col s8 offset-s2 m8 offset-m2 center-align text-center"
              >
                <ball-pulse-loader
                  v-if="isLoading"
                  color="#000000"
                  size="20px"
                ></ball-pulse-loader>
              </div>
            </div>
          </v-dialog-actions>
        </v-dialog>
        <v-dialog
          class="card"
          style="position:absolute"
          :v-active.sync="showEditProfile"
        >
          <v-dialog-actions>
            <v-btn class="v-icon-button right" @click="activeEditProfile(null)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-dialog-actions>
          <div
            style="overflow-y:scroll;overflow-x:hidden"
            class="col m8 offset-m2 col s12 center-align"
          >
            <div class="card-content row">
              <div class="row">
                <div class="col s12 center-align">
                  <h5>
                    Editting {{ student.firstname }} {{ student.lastname }}'s
                    profile
                  </h5>
                </div>
                <div
                  class="input-field col s10 offset-s1 m8 offset-m2 text-center"
                >
                  <input
                    v-model="student.firstname"
                    id="Firstname"
                    name="Firstname"
                    type="text"
                  />
                  <label class="text-center" for="Firstname">Firstname</label>
                </div>
                <div
                  class="input-field col s10 offset-s1 m8 offset-m2 text-center"
                >
                  <input
                    v-model="student.lastname"
                    id="Lastname"
                    name="Lastname"
                    type="text"
                  />
                  <label class="text-center" for="Lastname">Lastname</label>
                </div>
              </div>
              <div class="row">
                <div
                  class="input-field col s10 offset-s1 m8 offset-m2 text-center"
                >
                  <input
                    v-model="student.username"
                    id="Username"
                    name="Username"
                    type="text"
                  />
                  <label class="text-center" for="Username">Username</label>
                </div>
              </div>

              <div class="row">
                <div class="col s10 offset-s1 m8 offset-m2">
                  <v-field>
                    <label>ID Number</label>
                    <v-input
                      v-model="student.idNumber"
                      maxlength="13"
                    ></v-input>
                  </v-field>
                </div>
              </div>

              <div class="row" v-show="student.idNumber.length > 6">
                <div class="col s10 offset-s1 m8 offset-m2">
                  <label>
                    {{
                      student.isSouthAfrican
                        ? "South African Citizen"
                        : "Non-South African Citizen"
                    }}
                  </label>
                </div>
                <div class="col s10 offset-s1 m8 offset-m2">
                  <v-field>
                    <label for="Gender">Gender</label>
                    <v-select
                      v-model="student.gender"
                      name="Gender"
                      id="Gender"
                    >
                      <v-option disabled>Pick a gender</v-option>
                      <v-option value="Male">Male</v-option>
                      <v-option value="Female">Female</v-option>
                    </v-select>
                  </v-field>
                </div>
                <div class="col s10 offset-s1 m8 offset-m2">
                  <v-datepicker v-immediately v-model="student.dob">
                    <label>Date of birth</label>
                  </v-datepicker>
                </div>
              </div>

              <div class="row" v-show="txtError.length > 0">
                <div class="col s8 offset-s2 m6 offset-m3 text-center">
                  <label class="text-center red-text">{{ txtError }}</label>
                </div>
              </div>
            </div>
          </div>
          <v-dialog-actions>
            <v-btn class="red" @click="activeEditProfile(null)">
              Cancel
            </v-btn>
            <v-btn v-if="!isLoading" v-on:click="UpdateStudent()" class="right">
              Save changes
            </v-btn>
            <div class="row">
              <div
                class="col s8 offset-s2 m8 offset-m2 center-align text-center"
              >
                <ball-pulse-loader
                  v-if="isLoading"
                  color="#000000"
                  size="20px"
                ></ball-pulse-loader>
              </div>
            </div>
          </v-dialog-actions>
        </v-dialog>
        <v-col cols="12" sm="12" md="8" offset-md="2">
          <v-text-field
            class="text-center mx-auto text-xs-center"
            color="secondary"
            label="Search"
            v-on:keypress.enter="DeepSearch"
            solo
            block
            prepend-inner-icon="mdi-magnify"
            v-model="txtSearch"
          >
          </v-text-field>
          <p
            v-show="filteredStudents.length == 0 && !isLoading"
            class="text-center ma-5 red-text"
          >
            No results found
          </p>
        </v-col>
        <v-col
          cols="12"
          :sm="isFullscreen == null ? 6 : 8"
          :md="isFullscreen == null ? 4 : 6"
          :lg="isFullscreen == null ? 3 : 6"
          class="mx-auto"
          v-show="isFullscreen == null || isFullscreen == student._id"
          v-for="(student, i) in filteredStudents"
          :key="i"
        >
          <v-card>
            <v-card-header>
              <v-list-item>
                <v-list-item-avatar color="grey"></v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="headline"
                    >{{ student.lastname }}
                    {{ student.firstname }}</v-list-item-title
                  >
                  <v-list-item-subtitle>{{
                    student.username
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    v-on:click="
                      isFullscreen == student._id
                        ? (isFullscreen = null)
                        : (isFullscreen = student._id)
                    "
                    icon
                    class="v-icon-button waves-effect"
                  >
                    <v-icon>{{
                      isFullscreen == student._id
                        ? "mdi-close"
                        : "mdi-fullscreen"
                    }}</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card-header>

            <v-tabs @change="studentTabChanged($event, student)" grow>
              <v-tab>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-account-card-details-outline</v-icon>
                  </template>
                  <span>Details</span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-library-books</v-icon>
                  </template>
                  <span>Modules</span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-book-open</v-icon>
                  </template>
                  <span>Past tests</span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-settings</v-icon>
                  </template>
                  <span>Settings</span>
                </v-tooltip>
              </v-tab>
              <v-tab-item>
                <v-list class="v-double-line">
                  <v-list-item v-if="student.idNumber" class="waves-effect">
                    <v-list-item-avatar>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>ID number</v-list-item-title>
                      <v-list-item-subtitle>{{
                        student.idNumber
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="student.gender" class="waves-effect">
                    <v-list-item-avatar>
                      <v-icon>mdi-gender-male-female</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Gender</v-list-item-title>
                      <v-list-item-subtitle>{{
                        student.gender
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="student.isSouthAfrican != null"
                    class="waves-effect"
                  >
                    <v-list-item-avatar>
                      <v-icon>mdi-flag</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Nationality</v-list-item-title>
                      <v-list-item-subtitle>{{
                        student.isSouthAfrican
                          ? "South African"
                          : "Non South African"
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-tab-item>
              <v-tab-item>
                <v-row class="pa-2">
                  <v-col
                    v-for="modul in student.modules"
                    :key="modul._id"
                    class="shrink"
                  >
                    <v-chip
                      :disabled="isLoading"
                      close
                      @click:close="modul.removed = true"
                      @click="!modul.removed ? goToModule(modul._id) : null"
                      ><span>{{ modul.name }} {{ modul.code }}</span>
                    </v-chip>
                    <v-btn
                      v-if="!isLoading"
                      :loading="isLoading"
                      v-show="modul.removed"
                      v-on:click="DeleteModule(student._id, modul._id)"
                      color="primary"
                    >
                      Confirm
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-list-item
                      v-on:click="AddNewModule(student)"
                      class="waves-effect"
                    >
                      <v-icon class="v-primary">mdi-plus</v-icon>
                      <div class="v-list-item-text">
                        <span>Add new Module</span>
                        <span></span>
                      </div>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-list class="v-double-line">
                  <v-list-item
                    v-on:click="goToSolution(pastTest.solutionId)"
                    v-for="(pastTest, v) in student.pastTests"
                    :key="v"
                    class="waves-effect"
                  >
                    <v-list-item-avatar
                      :color="pastTest.isPassed ? 'primary' : 'secondary'"
                    >
                      {{ pastTest.mark }}
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        pastTest.title
                      }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        getMoment(pastTest.date).fromNow()
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-tab-item>
              <v-tab-item>
                <v-list>
                  <v-subheader></v-subheader>

                  <v-list-item
                    v-on:click="student.removed = !student.removed"
                    class="waves-effect"
                  >
                    <v-icon class="v-primary">mdi-delete</v-icon>
                    <div class="v-list-item-text">
                      <span>{{
                        student.removed ? "Are you sure?" : "Delete"
                      }}</span>
                    </div>

                    <v-btn
                      v-if="!isLoading"
                      v-show="student.removed"
                      v-on:click="DeleteStudent(student._id)"
                      class="v-icon-button v-list-action"
                    >
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <div v-show="student.removed" class="row">
                      <div
                        class="col s8 offset-s2 m8 offset-m2 center-align text-center"
                      >
                        <ball-pulse-loader
                          v-if="isLoading"
                          color="#000000"
                          size="20px"
                        ></ball-pulse-loader>
                      </div>
                    </div>
                    <v-btn
                      v-show="student.removed"
                      class="v-icon-button v-list-action"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import swal from "sweetalert2";
import * as moment from "moment";

const axios = require("axios");

import AddStudent from "./AddStudent";

export default {
  name: "StidentList",
  data() {
    return {
      studentModule: {
        _id: null,
        username: "",
        modules: [null],
        oldModules: [],
        studentTabs: []
      },
      txtSearch: "",
      txtError: "",
      student: {
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        confirmPassword: "",
        modules: [null],
        idNumber: "",
        gender: "",
        dob: "",
        isSouthAfrican: false
      },
      addingStudents: false,
      students: [],
      modules: [],
      showEditProfile: false,
      isFullscreen: null,
      isLoading: false
    };
  },
  watch: {
    "student.idNumber": function(newVal, oldVal) {
      if (newVal.length >= 6) {
        this.student.dob = new Date(
          newVal.substring(0, 2),
          newVal.substring(2, 4) - 1,
          newVal.substring(4, 6)
        );

        if (newVal.length >= 10) {
          var genderCode = newVal.substring(6, 10);
          this.student.gender = parseInt(genderCode) < 5000 ? "Female" : "Male";

          if (newVal.length == 13) {
            this.student.isSouthAfrican =
              parseInt(newVal.substring(10, 11)) == 0;
          }
        }
      }
    }
  },
  props: ["studentIDs"],
  components: {
    AddStudent
  },
  computed: {
    filteredStudents() {
      return this.students.filter(
        l =>
          this.txtSearch.length < 1 ||
          JSON.stringify(l)
            .toLowerCase()
            .indexOf(this.txtSearch.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    this.Reload();
  },
  methods: {
    Reload() {
      this.isLoading = true;
      if (this.studentIDs != null) {
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/s/students/of/ids/" +
              this.studentIDs
          )
          .then(results => {
            this.isLoading = false;
            this.students = results.data.map(s => {
              return {
                ...s,
                show: true,
                pastTests: []
              };
            });
            if (this.students.length == 1) {
              this.isFullscreen = this.students[0]._id;
            }
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal.fire(err.response.data, "error");
            } else {
              swal.fire("Unable to load students", "Try again later", "error");
            }
          });
      } else {
        axios
          .get(this.$store.state.settings.baseLink + "/s/students/all")
          .then(results => {
            this.isLoading = false;
            this.students = results.data.map(s => {
              return {
                ...s,
                show: true,
                pastTests: []
              };
            });
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal.fire(err.response.data, "error");
            } else {
              swal.fire("Unable to load students", "Try again later", "error");
            }
          });
      }
      this.LoadModules();
    },
    AddedNewStudent(isAdded) {
      if (isAdded) {
        this.Reload();
      } else {
      }
    },
    AddNewModule(student) {
      if (student == null) {
        this.studentModule._id = null;
        this.studentModule.username = "";
        this.studentModule.modules = [null];
        this.studentModule.oldModules = null;
      } else if (student == "submit") {
        this.isLoading = true;
        var newModules = this.studentModule.modules.filter(
          s =>
            s != null &&
            this.studentModule.oldModules.filter(om => om._id == s).length == 0
        );

        if (newModules == 0) {
          swal.fire(
            "No change made",
            "Student is already assigned to the selected modules",
            "success"
          );
        } else {
          axios
            .post(
              this.$store.state.settings.baseLink +
                "/m/assign/to/student/" +
                this.studentModule._id,
              {
                modules: newModules
              }
            )
            .then(result => {
              this.isLoading = false;
              var names = this.modules.filter(
                m => newModules.filter(nm => nm == m._id).length > 0
              );
              var stu = this.students.find(
                s => s._id == this.studentModule._id
              );
              names.forEach(name => {
                stu.modules.push(name);
              });

              swal.fire(
                "Modules successfully assigned",
                `${newModules.length} new modules are now assigned to ${this.studentModule.username}`,
                "success"
              );
              this.AddNewModule(null);
            })
            .catch(err => {
              this.isLoading = false;
              if (err.response != null && err.response.status == 512) {
                swal.fire(err.response.data, "error");
              } else {
                swal.fire("Unable to load students", err.message, "error");
              }
            });
        }
      } else {
        this.studentModule._id = student._id;
        this.studentModule.username = student.username;
        this.studentModule.oldModules = student.modules;
      }
    },
    activeEditProfile(student) {
      if (student != null) {
        this.student = student;
      } else {
        this.student = {
          firstname: "",
          lastname: "",
          username: "",
          password: "",
          confirmPassword: "",
          modules: [null],
          idNumber: "",
          gender: "",
          dob: "",
          isSouthAfrican: false,
          isLoading: true
        };
      }
      this.showEditProfile = !this.showEditProfile;
    },
    DeleteStudent(studentID) {
      this.isLoading = true;
      axios
        .post(this.$store.state.settings.baseLink + "/s/delete/" + studentID)
        .then(result => {
          this.isLoading = false;
          var victim = this.students.find(s => s._id == studentID);
          var index = this.students.indexOf(victim);
          this.students.splice(index, 1);
          swal.fire(
            "Student was removed from the system",
            "To recover the student you can contact admin",
            "success"
          );
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load students", err.message, "error");
          }
        });
    },
    DeleteModule(studentID, moduleID) {
      this.isLoading = true;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/m/unassign/module/" +
            moduleID +
            "/from/student/" +
            studentID
        )
        .then(result => {
          this.isLoading = false;
          var victim = this.students.find(s => s._id == studentID);
          var index = victim.modules.indexOf(
            victim.modules.find(m => m._id == moduleID)
          );
          if (index >= 0) {
            this.students[this.students.indexOf(victim)].modules.splice(
              index,
              1
            );
          }
          swal.fire(
            "Module was unassigned successfully",
            "You can reassign the link again",
            "success"
          );
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load students", err.message, "error");
          }
        });
    },
    DeepSearch() {
      alert("Deep searching for " + this.txtSearch);
    },
    goToSolution(solutionId) {
      this.$router.push({
        name: "TestMarks",
        params: {
          solutionId: solutionId
        }
      });
    },
    studentTabChanged(arg, student) {
      switch (arg) {
        case 2: // This is the past tests tab
          this.GetPastTestsFor(student);
          break;
      }
    },
    GetPastTestsFor(student) {
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/s/all/past/tests/for/" +
            student._id
        )
        .then(results => {
          this.students.map(s => {
            if (s._id == student._id) {
              s.pastTests = results.data.map((element, i) => {
                return {
                  solutionId: element.solutionId,
                  title: element.title,
                  mark: element.mark,
                  isPassed: element.isPassed,
                  date: element.date
                };
              });
            }
          });
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load students", err.message, "error");
          }
        });
    },
    LoadModules() {
      axios
        .get(this.$store.state.settings.baseLink + "/m/modules/all")
        .then(results => {
          this.modules = results.data;
          this.options = this.modules.map(s => {
            return {
              value: s._id,
              text: s.name + " ( " + s.code + " )"
            };
          });
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load modules", "Try again later", "error");
          }
        });
    },
    UpdateStudent() {
      this.isLoading = true;
      this.txtError = "";
      if (this.student.lastname.length < 2) {
        this.txtError = "Please enter a valid lastname";
      }

      if (this.student.firstname.length < 2) {
        this.txtError = "Please enter a valid firstname";
      }

      if (this.student.username.length < 2) {
        this.txtError = "Please enter a valid username";
      }

      if (this.student.gender.length < 2) {
        this.txtError = "Please pick a valid gender";
      }

      if (this.student.dob.length < 2) {
        this.txtError = "Please pick a valid date of birth";
      }

      if (this.student.idNumber < 6) {
        this.txtError = "Please enter a valid id number";
      }

      if (this.txtError.length > 2) {
        this.isLoading = false;
        return;
      }

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/a/update/student/" +
            this.student._id,
          {
            student: this.student
          }
        )
        .then(results => {
          this.isLoading = false;
          this.students = this.students.map(s => {
            if (s._id == results.data._id) {
              s = results.data;
            }
            return s;
          });
          this.student = {
            firstname: "",
            lastname: "",
            username: "",
            password: "",
            confirmPassword: "",
            modules: [null],
            idNumber: "",
            gender: "",
            dob: "",
            isSouthAfrican: false
          };
          this.activeEditProfile(null);

          swal.fire("Profile successfully updated", "success");
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal.fire("Unable to submit the student", err.message, "error");
          }
        });
    }
  }
};
</script>

<style scoped>
</style>

