<template>
  <div class="center-align">
    <div class="row">
      <div class="col s12 center-align card-panel" v-show="done">
        <md-empty-state md-icon="done" md-label="Student was successfully added." md-description="You can now assign the student to more modules / view the student's progress.">
        </md-empty-state>
      </div>
      <div style="padding-top:30" class="col m8 offset-m2 center-align center">
        <div class="card row">
          <div v-show="!done" class="card-header center-align z-depth-3 cardBar">
            <h5 style="padding:20px">Editting a student</h5>
          </div>
          <div v-show="!done" class="card-content">
            <div class="row">
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
              <div class="input-field active col m4 offset-m1 s12 text-center">
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
                  <md-select style="background-color:white" v-model="student.modules[i]" :name="`modules-${i}`" :id="`modules-${i}`">
                    <md-option style="background-color:white" :disabled="student.modules.filter(sm => sm == _module._id).length > 0" v-for="_module in modules" :value="_module._id" :key="_module._id">{{ _module.name }} ({{ _module.code }})</md-option>
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
                  <md-select style="background-color:white" v-model="student.gender" name="Gender" id="Gender">
                    <md-option style="background-color:white" disabled>Pick a gender</md-option>
                    <md-option style="background-color:white" value="Male">Male</md-option>
                    <md-option style="background-color:white" value="Female">Female</md-option>
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
                <input v-if="!isLoading" v-on:click="SubmitStudent()" type="submit" value="Submit student" class="btn center-align tg-btn" />
                <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
              </div>
            </div>
          </div>
          <div class="card-header center-align z-depth-3 cardBar">
            <h5 style="padding:20px">Add parent</h5>
              <div v-show="student.parents && student.parents.length > 0" class="row">
              <div class="input-field col m4 offset-m1 s12 text-center">
                <label class="text-center">We already have the following parents in the system</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <p class="text-center" v-for="_parent in student.parents">{{ _parent.surname }} {{ _parent.name }} - {{ _parent.relationship }}</p>
              </div>
            </div>
          </div>
          <div class="card-content">
            <div class="row">
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="parent.firstname" id="Firstname1" name="Firstname1" type="text" />
                <label class="text-center" for="Firstname1">Firstname</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="parent.lastname" id="Lastname1" name="Lastname1" type="text" />
                <label class="text-center" for="Lastname1">Lastname</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                <input v-model="parent.email" id="Username1" name="Username1" type="email" />
                <label class="text-center" for="Username1">Email</label>
              </div>
            </div>
             <div class="row">
              <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                <input v-model="parent.numbers" id="Username2" name="Username2" type="number" />
                <label class="text-center" for="Username2">Contact Numbers</label>
              </div>
            </div>
            <div class="row">
              <div class="col s12">
                <md-field>
                  <label for="Relationship">{{ parent.firstname }} {{ parent.lastname }} is my </label>
                  <md-select style="background-color:white" v-model="parent.relationship" name="Relationship" id="Relationship">
                    <md-option style="background-color:white" disabled>Pick a your relationship with {{ parent.firstname }} {{ parent.lastname }}</md-option>
                    <md-option style="background-color:white" value="FATHER">Father</md-option>
                    <md-option style="background-color:white" value="MOTHER">Mother</md-option>
                    <md-option style="background-color:white" value="SISTER">Sister</md-option>
                    <md-option style="background-color:white" value="BROTHER">Brother</md-option>
                    <md-option style="background-color:white" value="GUARDIAN">Guardian</md-option>
                  </md-select>
                </md-field>
              </div>
            </div>
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError2 }}</label>
              </div>
            </div>
             <div class="row">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <input v-if="!isLoading" v-on:click="SubmitParent()" type="submit" value="Save parent" class="btn center-align tg-btn" />
                <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
              </div>
            </div>
            <div class="row">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <p v-for="result in parentResults">{{ result }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import * as moment from "moment";

const axios = require("axios");

export default {
  name: "AddStudent",
  data() {
    return {
      txtError: "",
      txtError2: "",
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
      parent: {
        firstname: "",
        lastname: "",
        email: "",
        numbers: "",
        relationship: "FATHER"
      },
      parentResults:[],
      done: false,
      modules: [],
      isLoading: false
    };
  },
  props: ["studentID"],
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
  mounted() {
    this.done = false;
    this.LoadModules();
    this.LoadStudent();
  },
  methods: {
    LoadStudent() {
      this.isLoading = true;

      if (this.$store.state.user.type == "STUDENT") {
        this.studentID = this.$store.state.user.id;
      }
      if (!this.studentID) {
        this.$router.replace("/home");
      }

      axios
        .get(this.$store.state.settings.baseLink + `/s/${this.studentID}/get`)
        .then(results => {
          this.isLoading = false;
          this.student = results.data;
          if (!this.student.modules || this.student.modules.length == 0) {
            this.student.modules = [null];
          } else {
            this.student.modules = this.student.modules.map(v => v._id);
          }
          console.log("student", this.student);
        })
        .catch(err => {
          this.isLoading = false;
          this.$router.replace("/home");
        });
    },
    LoadModules() {
      this.isLoading = true;
      axios
        .get(this.$store.state.settings.baseLink + "/m/modules/all")
        .then(results => {
          this.isLoading = false;
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
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load modules", "Try again later", "error");
          }
        });
    },
    SubmitParent() {
      this.txtError2 = "";
      this.isLoading = true;
      if (this.parent.lastname.length < 2) {
        this.txtError2 = "Please enter a valid lastname";
      }

      if (this.parent.firstname.length < 2) {
        this.txtError2 = "Please enter a valid firstname";
      }
      if (this.parent.contacts < 10 || isNaN(this.parent.contacts)) {
        this.txtError2 = "Please enter valid contact numbers";
      }

      if (
        this.parent.email.length < 2 ||
        this.parent.email.indexOf("@") < 0 ||
        this.parent.email.indexOf(".") < 0
      ) {
        this.txtError2 = "Please enter a email address";
      }

      if (this.txtError.length > 2) {
        this.isLoading = false;
        return;
      }

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/s/add/parent/for/" +
            this.student._id,
          {
            parent: {
              surname: this.parent.lastname,
              name: this.parent.firstname,
              numbers: this.parent.numbers,
              email: this.parent.email,
              relationship: this.parent.relationship
            }
          }
        )
        .then(results => {
          this.isLoading = false;
          this.done = true;
          this.parentResults.push(results.data);
          swal(
            "Parent added",
            `${this.parent.firstname} ${
              this.parent.lastname
            } was successfully added as your ${this.parent.relationship}`,
            "success"
          );
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            this.txtError2 = err.response.data;
          } else {
            swal("Unable to save the parent", err.message, "error");
          }
          this.$emit("submitted", false);
        });
    },
    SubmitStudent() {
      this.txtError = "";
      this.isLoading = true;
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
          this.done = true;
          this.$emit("submitted", true);
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the student", err.message, "error");
          }
          this.$emit("submitted", false);
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

