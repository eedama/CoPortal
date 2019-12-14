<template>
  <div>
    <div class="row">
      <div class="col s12 center-align card-panel" v-show="done">
        <md-empty-state md-icon="done" md-label="Student was successfully added." md-description="You can now assign the student to more modules / view the student's progress.">
        </md-empty-state>
      </div>
      <div v-show="!done" class="col s12 center-align">
        <div class="card row">
          <div class="card-header center-align z-depth-3 cardBar">
            <h5 style="padding:20px">Adding a student</h5>
          </div>
          <div class="card-content">
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
                    <md-option :disabled="student.modules.filter(sm => sm == _module._id).length > 0" v-for="_module in modules" :value="_module._id" :key="_module._id">{{ _module.name }} ({{ _module.code }})</md-option>
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
                <input v-if="!isLoading" v-on:click="SubmitStudent()" type="submit" value="Submit student" class="btn center-align tg-btn" />
                <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import * as moment from "moment";

const axios = require("axios");

export default {
  name: "AddStudent",
  data() {
    return {
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
      done: false,
      modules: [],
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
  mounted() {
    this.done = false;
    this.LoadModules();
  },
  methods: {
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
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load modules", "Try again later", "error");
          }
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
        .post(this.$store.state.settings.baseLink + "/a/add/student", {
          student: this.student
        })
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
            swal.fire("Unable to submit the student", err.message, "error");
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

