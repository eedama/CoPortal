<template>
  <div>
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="$router.back()" class="right">
          <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
  
    <div class="row">
      <div class="col s8 offset-s2 center-align">
        <a v-on:click="addingStudents = !addingStudents" :class="{'red':addingStudents}" class="btn waves-effect">{{ !addingStudents ? 'Add Student' : 'Cancel'}}</a>
      </div>
    </div>
    <div v-show="addingStudents" class="row" style="height:80vh">
      <div class="col m6 offset-m3 col s12 center-align">
        <div class="card row">
          <div class="card-content">
            <div class="row">
              <div class="col s12 center-align z-depth-3 cardBar">
                <h5>Adding a student</h5>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.firstname" id="Firstname" name="Firstname" type="text" />
                <label class="text-center" for="Firstname">Firstname</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.lastname" id="Lastname" name="Lastname" type="text" />
                <label class="text-center" for="Lastname">Lastname</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                <input v-model="student.username" id="Username" name="Username" type="text" />
                <label class="text-center" for="Username">Username</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.password" id="Password" name="Password" type="password" />
                <label class="text-center" for="Password">Password</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="student.confirmPassword" id="ConfirmPassword" name="ConfirmPassword" type="password" />
                <label class="text-center" for="ConfirmPassword">Confirm Password</label>
              </div>
            </div>
            <div class="row" :key="m" v-for="(m,i) in student.modules.length">
              <div class="col s10">
                <md-field>
                  <label :for="`modules-${i}`">Module {{ m }}</label>
                  <md-select v-model="student.modules[i]" :name="`modules-${i}`" :id="`modules-${i}`">
                    <md-option :disabled="student.modules.filter(sm => sm == module._id).length > 0" v-for="module in modules" :value="module._id" :key="module._id">{{ module.name }} ({{ module.code }})</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="col s2 bottom-align">
                <a v-on:click="student.modules.push(null)" v-if="i == (student.modules.length - 1) && student.modules[i] != null" class="btn btn-floating waves-effect"><i class="material-icons">add</i></a>
                <a v-on:click="student.modules.splice(i,1)" v-if="i != (student.modules.length - 1)" class="btn btn-floating red waves-effect"><i class="material-icons">close</i></a>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <md-field>
                  <label>ID Number</label>
                  <md-input v-model="student.idNumber" maxlength="13"></md-input>
                </md-field>
              </div>
            </div>
            <div class="row" v-show="student.idNumber.length > 6">
              <div class="row">
                <div class="col s12">
                  <label>
                                  {{ student.isSouthAfrican ? 'South African Citizen' : 'Non-South African Citizen' }}
                            </label>
                </div>
              </div>
              <div class="col s12">
                <md-field>
                  <label for="Gender">Gender</label>
                  <md-select v-model="student.gender" name="Gender" id="Gender">
                    <md-option disabled>Pick a gender</md-option>
                    <md-option value="Male">Male</md-option>
                    <md-option value="Female">Female</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="col s12">
                <md-datepicker md-immediately v-model="student.dob">
                  <label>Date of birth</label>
                </md-datepicker>
              </div>
            </div>
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
            <div class="row">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <input v-on:click="SubmitStudent()" type="submit" value="Submit student" class="btn center-align tg-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!addingStudents" class="row">
  
      <md-dialog class="card" style="position:absolute" :md-active.sync="studentModule._id != null">
        <md-dialog-title>Adding modules for {{ studentModule.username }}</md-dialog-title>
  
        <md-dialog-content>
          <div class="row" :key="i" v-for="(m,i) in studentModule.modules.length">
            <div class="col s10">
              <md-field>
                <label :for="`mmodules-${i}`">Module {{ m }}</label>
                <md-select v-model="studentModule.modules[i]" :name="`mmodules-${i}`" :id="`mmodules-${i}`">
                  <md-option :disabled="studentModule.modules.filter(sm => sm == module._id).length > 0" v-for="module in modules" :value="module._id" :key="module._id">{{ module.name }} ({{ module.code }})</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="col s2 bottom-align">
              <a v-on:click="studentModule.modules.push(null)" v-show="i == (studentModule.modules.length - 1) && studentModule.modules[i] != null" class="btn btn-floating waves-effect"><i class="material-icons">add</i></a>
              <a v-on:click="studentModule.modules.splice(i,1)" v-show="i != (studentModule.modules.length - 1)" class="btn btn-floating red waves-effect"><i class="material-icons">close</i></a>
            </div>
          </div>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="AddNewModule(null)">Close</md-button>
          <md-button class="md-primary" @click="AddNewModule('submit')">Save Changes</md-button>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog class="card" style="position:absolute" :md-active.sync="showEditProfile">
        <md-dialog-actions>
          <md-button class="md-icon-button right" @click="activeEditProfile(null)">
            <md-icon>close</md-icon>
          </md-button>
        </md-dialog-actions>
        <div style="overflow-y:scroll;overflow-x:hidden" class="col m8 offset-m2 col s12 center-align">
          <div class="card-content row">
            <div class="row">
              <div class="col s12 center-align">
                <h5>Editting {{student.firstname}} {{student.lastname}}'s profile</h5>
              </div>
              <div class="input-field col s10 offset-s1 m8 offset-m2 text-center">
                <input v-model="student.firstname" id="Firstname" name="Firstname" type="text" />
                <label class="text-center" for="Firstname">Firstname</label>
              </div>
              <div class="input-field col s10 offset-s1 m8 offset-m2 text-center">
                <input v-model="student.lastname" id="Lastname" name="Lastname" type="text" />
                <label class="text-center" for="Lastname">Lastname</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s10 offset-s1 m8 offset-m2 text-center">
                <input v-model="student.username" id="Username" name="Username" type="text" />
                <label class="text-center" for="Username">Username</label>
              </div>
            </div>
  
            <div class="row">
              <div class="col s10 offset-s1 m8 offset-m2">
                <md-field>
                  <label>ID Number</label>
                  <md-input v-model="student.idNumber" maxlength="13"></md-input>
                </md-field>
              </div>
            </div>
  
            <div class="row" v-show="student.idNumber.length > 6">
              <div class="col s10 offset-s1 m8 offset-m2">
                <label>
                                            {{ student.isSouthAfrican ? 'South African Citizen' : 'Non-South African Citizen' }}
                                      </label>
              </div>
              <div class="col s10 offset-s1 m8 offset-m2">
                <md-field>
                  <label for="Gender">Gender</label>
                  <md-select v-model="student.gender" name="Gender" id="Gender">
                    <md-option disabled>Pick a gender</md-option>
                    <md-option value="Male">Male</md-option>
                    <md-option value="Female">Female</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="col s10 offset-s1 m8 offset-m2">
                <md-datepicker md-immediately v-model="student.dob">
                  <label>Date of birth</label>
                </md-datepicker>
              </div>
            </div>
  
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
          </div>
        </div>
        <md-dialog-actions>
          <md-button class="red" @click="activeEditProfile(null)">
            Cancel
          </md-button>
          <md-button v-on:click="UpdateStudent()" class="right">
            Save changes
          </md-button>
        </md-dialog-actions>
      </md-dialog>
      <div class="row">
        <div class="col s10 offset-s1 m8 offset-m3 l6 offset-l3 ">
          <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
            <input v-on:keypress.enter="DeepSearch" v-model="txtSearch" id="Password" name="Search" type="search" />
            <label class="text-center" for="Search">Search</label>
          </div>
        </div>
      </div>
      <div v-show="filteredStudents.length == 0" class="col s12 center-align">
        <p class="red-text">No results found</p>
      </div>
      <div v-show="isFullscreen == null || isFullscreen == student._id" v-for="(student,i) in filteredStudents" :key="i" :class="{'s10 offset-s1 m8 offset-m2 l6 offset-l3':isFullscreen == student._id,'m6 l4 xl3':isFullscreen == null,'hidden':isFullscreen != student._id}"
        class="col">
        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ student.lastname }} {{ student.firstname}}</div>
              <div class="md-subhead">Takes {{ student.modules.length }} {{ student.modules.length == 1 ? 'module' : 'modules' }}</div>
            </md-card-header-text>
  
            <md-menu md-size="big" md-direction="bottom-end">
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>more_vert</md-icon>
              </md-button>
  
              <md-menu-content class="card">
                <md-menu-item v-show="isFullscreen == student._id" v-on:click="isFullscreen = null" class="waves-effect">
                  <span>Normal screen</span>
                  <md-icon>close</md-icon>
                </md-menu-item>
                <md-menu-item v-on:click="isFullscreen = student._id" class="waves-effect">
                  <span>Full screen</span>
                  <md-icon>fullscreen</md-icon>
                </md-menu-item>
                <md-menu-item class="waves-effect">
                  <span>Send a message</span>
                  <md-icon>message</md-icon>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-card-header>
  
          <md-card-content>
            <md-list class="md-double-line">
              <md-subheader>Details</md-subheader>
              <md-list-item v-if="student.gender" class="waves-effect">
                <md-icon class="md-primary">account_circle</md-icon>
                <div class="md-list-item-text">
                  <span>{{ student.idNumber }}</span>
                  <span>ID Number</span>
                </div>
              </md-list-item>
              <md-list-item v-if="student.gender" class="waves-effect">
                <md-icon class="md-primary">wc</md-icon>
                <div class="md-list-item-text">
                  <span>{{ student.gender }}</span>
                  <span>Gender</span>
                </div>
              </md-list-item>
              <md-list-item v-if="student.isSouthAfrican != null" class="waves-effect">
                <md-icon class="md-primary">flag</md-icon>
                <div class="md-list-item-text">
                  <span>{{ student.isSouthAfrican ? "South African" : "Non South African" }}</span>
                  <span>Nationality</span>
                </div>
              </md-list-item>
              <md-subheader>Modules</md-subheader>
  
              <md-list-item v-for="modul in student.modules" :key="modul._id" :class="{'waves-effect':!modul.removed}">
                <md-icon class="md-primary">book</md-icon>
                <div class="md-list-item-text">
                  <span>{{ modul.name }}</span>
                  <span>{{ modul.removed ? 'Unassign ' + modul.code : modul.code }}</span>
                </div>
                <md-button v-show="!modul.removed" v-on:click="modul.removed = true" class="md-icon-button md-list-action">
                  <md-icon>delete</md-icon>
                </md-button>
                <md-button v-show="modul.removed" v-on:click="DeleteModule(student._id,modul._id)" class="md-icon-button md-list-action">
                  <md-icon>done</md-icon>
                </md-button>
                <md-button v-show="modul.removed" v-on:click="modul.removed = false" class="md-icon-button md-list-action">
                  <md-icon>close</md-icon>
                </md-button>
              </md-list-item>
              <md-list-item v-on:click="AddNewModule(student)" class="waves-effect">
                <md-icon class="md-primary">add</md-icon>
                <div class="md-list-item-text">
                  <span>Add new Module</span>
                  <span></span>
                </div>
              </md-list-item>
  
            </md-list>
          </md-card-content>
  
  
          <md-card-expand>
            <md-card-actions md-alignment="space-between">
              <div>
                <md-button v-on:click="activeEditProfile(student)">
                  <md-icon>account_circle</md-icon> {{ student.username }}
                </md-button>
              </div>
  
              <div>
              </div>
              <md-card-expand-trigger>
                <md-button v-on:click="GetPastTestsFor(student)">
                  Past Tests
                </md-button>
              </md-card-expand-trigger>
            </md-card-actions>
  
            <md-card-expand-content>
              <md-card-content>
  
                <md-list class="md-double-line">
                  <md-list-item v-on:click="goToSolution(pastTest.solutionId)" v-for="(pastTest,v) in student.pastTests" :key="v" href="#" class="waves-effect">
                    <md-icon class="md-primary">account_circle</md-icon>
                    <div class="md-list-item-text">
                      <span>{{pastTest.mark}}</span>
                      <span>{{pastTest.title}}</span>
                    </div>
                  </md-list-item>
                </md-list>
  
                <md-list class="md-double-line">
                  <md-list-item v-on:click="student.removed = !student.removed" class="waves-effect">
                    <md-icon class="md-primary">delete</md-icon>
                    <div class="md-list-item-text">
                      <span>{{ student.removed ? 'Are you sure?':'Delete' }}</span>
                    </div>
  
                    <md-button v-show="student.removed" v-on:click="DeleteStudent(student._id)" class="md-icon-button md-list-action">
                      <md-icon>done</md-icon>
                    </md-button>
  
                    <md-button v-show="student.removed" class="md-icon-button md-list-action">
                      <md-icon>close</md-icon>
                    </md-button>
                  </md-list-item>
                </md-list>
              </md-card-content>
            </md-card-expand-content>
          </md-card-expand>
        </md-card>
  
      </div>
  
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import * as moment from "moment";

const axios = require("axios");

export default {
  name: "StidentList",
  data() {
    return {
      studentModule: {
        _id: null,
        username: "",
        modules: [null],
        oldModules: []
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
      selectedStudent: null,
      showEditProfile: false,
      isFullscreen: null
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
    axios
      .get(this.$store.state.settings.baseLink + "/s/students/all")
      .then(results => {
        this.students = results.data;
        console.log(this.students);
        this.students.map(s => {
          s.show = true;
        });
      })
      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load students", "Try again later", "error");
        }
      });
    this.LoadModules();
  },
  methods: {
    AddNewModule(student) {
      if (student == null) {
        this.studentModule._id = null;
        this.studentModule.username = "";
        this.studentModule.modules = [null];
        this.studentModule.oldModules = null;
      } else if (student == "submit") {
        var newModules = this.studentModule.modules.filter(
          s =>
            s != null &&
            this.studentModule.oldModules.filter(om => om._id == s).length == 0
        );

        if (newModules == 0) {
          swal(
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
              var names = this.modules.filter(
                m => newModules.filter(nm => nm == m._id).length > 0
              );
              var stu = this.students.find(
                s => s._id == this.studentModule._id
              );
              names.forEach(name => {
                stu.modules.push(name);
              });

              swal(
                "Modules successfully assigned",
                `${newModules.length} new modules are now assigned to ${
                  this.studentModule.username
                }`,
                "success"
              );
              this.AddNewModule(null);
            })
            .catch(err => {
              if (err.response != null && err.response.status == 512) {
                swal(err.response.data, "error");
              } else {
                swal("Unable to load students", err.message, "error");
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
          isSouthAfrican: false
        };
      }
      this.showEditProfile = !this.showEditProfile;
    },
    DeleteStudent(studentID) {
      axios
        .post(this.$store.state.settings.baseLink + "/s/delete/" + studentID)
        .then(result => {
          var victim = this.students.find(s => s._id == studentID);
          var index = this.students.indexOf(victim);
          this.students.splice(index, 1);
          swal(
            "Student was removed from the system",
            "To recover the student you can contact admin",
            "success"
          );
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load students", err.message, "error");
          }
        });
    },
    DeleteModule(studentID, moduleID) {
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/m/unassign/module/" +
            moduleID +
            "/from/student/" +
            studentID
        )
        .then(result => {
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
          swal(
            "Module was unassigned successfully",
            "You can reassign the link again",
            "success"
          );
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load students", err.message, "error");
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
              s.pastTests = [];
              results.data.forEach(element => {
                s.pastTests.push({
                  solutionId: element.solutionId,
                  title: element.title,
                  mark: element.mark,
                  date: element.date
                });
              });
              this.selectedStudent = s;
            }
          });
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load students", err.message, "error");
          }
        });
    },
    LoadModules() {
      axios
        .get(this.$store.state.settings.baseLink + "/m/modules/all")
        .then(results => {
          this.modules = results.data;
          this.options = [];
          this.modules.map(s => {
            this.options.push({
              value: s._id,
              text: s.name + " ( " + s.code + " )"
            });
          });
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load modules", "Try again later", "error");
          }
        });
    },
    SubmitStudent() {
      this.txtError = "";
      if (this.student.lastname.length < 2) {
        this.txtError = "Please enter a valid lastname";
      }

      if (this.student.firstname.length < 2) {
        this.txtError = "Please enter a valid firstname";
      }

      if (this.student.password != this.student.confirmPassword) {
        this.txtError = "Passwords do not match";
      }

      if (this.student.password.length < 6) {
        this.txtError =
          "Please enter a valid password , passwords must be more than 6 charactors long";
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

      if (this.student.modules.filter(m => m != null).length <= 0) {
        this.txtError = "Please select at least one module";
      }

      if (this.txtError.length > 2) return;

      axios
        .post(this.$store.state.settings.baseLink + "/a/add/student", {
          student: this.student
        })
        .then(results => {
          this.students = results.data;
          this.students = {
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
          this.addingStudents = false;
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            alert(err.response.data);
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the student", err.message, "error");
          }
        });
    },
    UpdateStudent() {
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

      if (this.txtError.length > 2) return;

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
          this.students = results.data;
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

          swal("Profile successfully updated", "success");
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the student", err.message, "error");
          }
        });
    }
  }
};
</script>

<style scoped>
.cardBar {
  background-color: black;
  color: white;
  width: 100%;
}
</style>

