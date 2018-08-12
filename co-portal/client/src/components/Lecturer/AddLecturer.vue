<template>
  <div>
    <div class="row">
      <div v-show="done" class="col s12 center-align card-panel">
        <md-empty-state md-icon="done" md-label="Lecturer was successfully added." md-description="You can now assign the lecturer to more modules / view the lecturer's progress.">
        </md-empty-state>
      </div>
      <div v-show="!done" class="col s12 center-align">
          <div class="card row">          
            <div class="card-header center-align z-depth-3 cardBar">
            <h5 style="padding:20px">Adding a lecturer</h5>
          </div>
            <div class="card-content">
              <div class="row">
                <div class="input-field col m4 offset-m1 s12 text-center">
                  <input v-model="lecturer.firstname" id="Firstname" name="Firstname" type="text" />
                  <label class="text-center" for="Firstname">Firstname</label>
                </div>
                <div class="input-field col m4 offset-m1 s12 text-center">
                  <input v-model="lecturer.lastname" id="Lastname" name="Lastname" type="text" />
                  <label class="text-center" for="Lastname">Lastname</label>
                </div>
              </div>
              <div class="row">
                <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                  <input v-model="lecturer.username" id="Username" name="Username" type="text" />
                  <label class="text-center" for="Username">Username</label>
                </div>
              </div>
              <div class="row" :key="m" v-for="(m,i) in lecturer.modules.length">
                <div class="col s10">
                  <md-field>
                    <label :for="`modules-${i}`">Module {{ m }}</label>
                    <md-select v-model="lecturer.modules[i]" :name="`modules-${i}`" :id="`modules-${i}`">
                      <md-option :disabled="lecturer.modules.filter(lm => lm == module._id).length > 0" v-for="module in modules" :value="module._id" :key="module._id">{{ module.name }} ({{ module.code }})</md-option>
                    </md-select>
    
                  </md-field>
                </div>
                <div class="col s2 bottom-align">
                  <a v-on:click="lecturer.modules.push(null)" v-if="i == (lecturer.modules.length - 1) && lecturer.modules[i] != null" class="btn btn-floating waves-effect"><i class="material-icons">add</i></a>
                  <a v-on:click="lecturer.modules.splice(i,1)" v-if="i != (lecturer.modules.length - 1)" class="btn btn-floating red waves-effect"><i class="material-icons">close</i></a>
                </div>
              </div>
    
              <div class="row">
                <div class="col s12">
                  <md-field>
                    <label>ID Number</label>
                    <md-input v-model="lecturer.idNumber" maxlength="13"></md-input>
                  </md-field>
                </div>
              </div>
    
              <div class="row" v-show="lecturer.idNumber.length > 6">
                <div class="row">
                  <div class="col s12">
                    <label>
                                                {{ lecturer.isSouthAfrican ? 'South African Citizen' : 'Non-South African Citizen' }}
                                          </label>
                  </div>
                </div>
                <div class="col s12">
                  <md-field>
                    <label for="Gender">Gender</label>
                    <md-select v-model="lecturer.gender" name="Gender" id="Gender">
                      <md-option disabled>Pick a gender</md-option>
                      <md-option value="Male">Male</md-option>
                      <md-option value="Female">Female</md-option>
                    </md-select>
                  </md-field>
                </div>
                <div class="col s12">
                  <md-datepicker md-immediately v-model="lecturer.dob">
                    <label>Date of birth</label>
                  </md-datepicker>
                </div>
              </div>
    
              <div class="row">
                <div class="input-field col m4 offset-m1 s12 text-center">
                  <input v-model="lecturer.password" id="Password" name="Password" type="password" />
                  <label class="text-center" for="Password">Password</label>
                </div>
                <div class="input-field col m4 offset-m1 s12 text-center">
                  <input v-model="lecturer.confirmPassword" id="ConfirmPassword" name="ConfirmPassword" type="password" />
                  <label class="text-center" for="ConfirmPassword">Confirm Password</label>
                </div>
              </div>
              <div class="row" v-show="txtError.length > 0">
                <div class="col s8 offset-s2 m6 offset-m3 text-center">
                  <label class="text-center red-text">{{ txtError }}</label>
                </div>
              </div>
              <div class="row">
                <div class="col s8 offset-s2 m6 offset-m3 text-center">
                  <input v-on:click="SubmitLecturer()" type="submit" value="Submit lecturer" class="btn center-align tg-btn" />
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

import "vue-material/dist/vue-material.min.css";

export default {
  name: "LecturerList",
  data() {
    return {
      txtError: "",
      lecturer: {
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
      modules: []
    };
  },
  watch: {
    "lecturer.idNumber": function(newVal, oldVal) {
      if (newVal.length >= 6) {
        this.lecturer.dob = new Date(
          newVal.substring(0, 2),
          newVal.substring(2, 4) - 1,
          newVal.substring(4, 6)
        );

        if (newVal.length >= 10) {
          var genderCode = newVal.substring(6, 10);
          this.lecturer.gender =
            parseInt(genderCode) < 5000 ? "Female" : "Male";

          if (newVal.length == 13) {
            this.lecturer.isSouthAfrican =
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
      axios
        .get(this.$store.state.settings.baseLink + "/m/modules/all")
        .then(results => {
          this.modules = results.data;
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load modules", "Try again later", "error");
          }
        });
    },
    SubmitLecturer() {
      this.txtError = "";
      if (this.lecturer.lastname.length < 2) {
        this.txtError = "Please enter a valid lastname";
      }

      if (this.lecturer.firstname.length < 2) {
        this.txtError = "Please enter a valid firstname";
      }

      if (this.lecturer.password != this.lecturer.confirmPassword) {
        this.txtError = "Passwords do not match";
      }

      if (this.lecturer.password.length < 6) {
        this.txtError =
          "Please enter a valid password , passwords must be more than 6 charactors long";
      }
      if (this.lecturer.username.length < 2) {
        this.txtError = "Please enter a valid username";
      }

      if (this.lecturer.gender.length < 2) {
        this.txtError = "Please pick a valid gender";
      }

      if (this.lecturer.dob.length < 2) {
        this.txtError = "Please pick a valid date of birth";
      }

      if (this.lecturer.idNumber < 6) {
        this.txtError = "Please enter a valid id number";
      }

      if (this.lecturer.modules.filter(m => m != null).length <= 0) {
        this.txtError = "Please select at least one module";
      }

      if (this.txtError.length > 2) return;

      axios
        .post(this.$store.state.settings.baseLink + "/a/add/lecturer", {
          lecturer: this.lecturer
        })
        .then(results => {
            this.done = true;
            this.$emit('submitted', true);
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the lecturer", err.message, "error");
          }
          this.$emit('submitted', false);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cardBar {
    background-color: black;
    color: white;
    width: 100%;
  }
</style>

