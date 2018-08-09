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
      <div class="col s10 offset-s1 m8 offset-m3 l6 offset-l3 ">
        <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
          <input v-on:keypress.enter="DeepSearch" v-model="txtSearch" id="Password" name="Search" type="search" />
          <label class="text-center" for="Search">Search</label>
        </div>
      </div>
    </div>
  
    <div class="row">
      <div class="col s8 offset-s2 center-align">
        <a v-on:click="addingStudents = !addingStudents" :class="{'red':addingStudents}" class="btn waves-effect">{{ !addingStudents ? 'Add Student' : 'Cancel'}}</a>
      </div>
    </div>
    <div v-if="addingStudents" class="row valign-wrapper" style="height:80vh">
      <div class="col m6 offset-m3 col s12 center-align">
        <div class="card row">
          <div class="card-content">
            <div class="row">
              <div class="col s12 center-align">
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
    <div v-if="!addingStudents" class="row">
      <div v-if="student != null" v-for="(student,i) in students" :key="i" class="contact-area col s12 m6 l4 xl3">
         <md-card>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{ student.lastname }} {{ student.firstname}}</div>
          <div class="md-subhead">{{ student.idNumber }}</div>
        </md-card-header-text>

        <md-menu md-size="big" md-direction="bottom-end">
          <md-button class="md-icon-button" md-menu-trigger>
            <md-icon>more_vert</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item @click="doACall">
              <span>Call</span>
              <md-icon>phone</md-icon>
            </md-menu-item>

            <md-menu-item @click="sendMessage">
              <span>Send a message</span>
              <md-icon>message</md-icon>
            </md-menu-item>
          </md-menu-content>
        </md-menu>
      </md-card-header>

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
         </md-card-content>


            <md-card-expand>
              <md-card-actions md-alignment="space-between">
                <div>
                  <md-button v-on:click="activeEditProfile(student)"> <md-icon>account_circle</md-icon> {{ student.username }}</md-button>
               
                </div>
  
                <div>
                </div>
                <md-card-expand-trigger>
                  <md-button class="md-icon-button">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </md-button>
                </md-card-expand-trigger>
              </md-card-actions>
  
              <md-card-expand-content>
                <md-card-content>
                  <md-list class="md-double-line">
                    <md-list-item v-on:click="GetPastTestsFor(student)" class="waves-effect">
                      <md-icon class="md-primary">account_circle</md-icon>
                      <div class="md-list-item-text">
                        <span>{{ student.idNumber }}</span>
                        <span>Past Tests</span>
                      </div>
                    </md-list-item>
                    <md-list-item v-if="student.dob" class="waves-effect">
                      <md-icon class="md-primary">cake</md-icon>
                      <div class="md-list-item-text">
                        <span>{{ getMoment(student.dob).format('YYYY-MM-DD') }}</span>
                        <span>Modules</span>
                      </div>
                    </md-list-item>
                    <md-list-item v-if="student.gender" class="waves-effect">
                      <md-icon class="md-primary">wc</md-icon>
                      <div class="md-list-item-text">
                        <span>{{ student.gender }}</span>
                        <span>Gender</span>
                      </div>
                    </md-list-item>
  
                    <md-list-item v-on:click="student.removed = !student.removed" class="waves-effect">
                      <md-icon class="md-primary">delete</md-icon>
                      <div class="md-list-item-text">
                        <span>{{ student.removed ? 'Are you sure?':'Delete' }}</span>
                      </div>
  
                      <md-button v-show="student.removed" v-on:click="DeleteLecturer(student._id)" class="md-icon-button md-list-action">
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
      _txtSearch: "",
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
      selectedStudent: null
    };
  },
  computed: {
    txtSearch: {
      get() {
        return this._txtSearch;
      },
      set(v) {
        // FIlter students
        this._txtSearch = v;
      }
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
    DeepSearch() {
      alert("Deep searching for " + this.txtSearch);
    },
    getMoment(value) {
      return moment(value);
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
</style>

