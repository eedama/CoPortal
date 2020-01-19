<template>
  <v-row class="row">
    <v-col cols="12" md="4" offset-md="4" class="my-auto" v-show="done">
      <v-card class="ma-5">
        <v-card-text>
          <p class="title text-center mx-auto">
            Lecturer was successfully added.
          </p>
          <p class="subtitle text-center mx-auto">
            You can now assign the lecturer to more modules / view the
            lecturer's progress.
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-show="!done" class="col s12 center-align">
      <v-content class="card-content">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="lecturer.firstname"
              prepend-inner-icon="mdi-account"
              label="Firstname"
              type="text"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="lecturer.lastname"
              prepend-inner-icon="mdi-account-outline"
              label="Lastname"
              type="text"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8" offset-md="2">
            <v-text-field
              v-model="lecturer.username"
              prepend-inner-icon="mdi-account"
              label="Username"
              type="text"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="lecturer.password"
              prepend-inner-icon="mdi-lock"
              label="Password"
              @click:append="showPassword = !showPassword"
              :append-icon="
                showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              :type="showPassword ? 'text' : 'password'"
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="lecturer.confirmPassword"
              prepend-inner-icon="mdi-lock"
              label="Confirm Password"
              @click:append="showPassword = !showPassword"
              :append-icon="
                showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'
              "
              :type="showPassword ? 'text' : 'password'"
              outlined
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="8" offset-md="2">
            <v-select
              class="ma-5"
              :items="
                moduleNames.map(v => {
                  return { _id: v._id, title: `${v.name} - ${v.code}` };
                })
              "
              item-text="title"
              item-value="_id"
              label="Select all modules"
              outlined
              multiple
              v-model="lecturer.modules"
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="9">
            <v-text-field
              v-model="lecturer.idNumber"
              prepend-inner-icon="mdi-account"
              label="ID number"
              type="number"
              outlined
              maxlength="13"
              :helper="
                lecturer.isSouthAfrican
                  ? `South African Citizen`
                  : `Non-South African Citizen`
              "
            >
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              outlined
              :items="['Male', 'Female']"
              label="Pick a gender"
              v-model="lecturer.gender"
            >
            </v-select>
          </v-col>
          <div class="row" v-show="txtError.length > 0">
            <div class="col s8 offset-s2 m6 offset-m3 text-center">
              <label class="text-center red-text">{{ txtError }}</label>
            </div>
          </div>
          <v-col cols="12" md="10" offset-md="1" class="mx-auto">
            <v-btn
              :loading="isLoading"
              v-on:click="SubmitLecturer()"
              block
              color="secondary"
            >
              Submit lecturer
            </v-btn>
          </v-col>
        </v-row>
      </v-content>
    </v-col>
  </v-row>
</template>

<script>
import swal from "sweetalert2";
import * as moment from "moment";

const axios = require("axios");

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
      done: false,
      moduleNames: [],
      isLoading: false
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
      this.isLoading = true;
      axios
        .get(this.$store.state.settings.baseLink + "/m/get/all/module/names")
        .then(results => {
          this.isLoading = false;
          this.moduleNames = results.data;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire(
              "Unable to load module names",
              "Try again later",
              "error"
            );
          }
          console.log(err);
        });
    },
    SubmitLecturer() {
      this.txtError = "";
      this.isLoading = true;

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

      if (this.txtError.length > 2) {
        this.isLoading = false;
        return;
      }

      axios
        .post(this.$store.state.settings.baseLink + "/a/add/lecturer", {
          lecturer: this.lecturer
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
            swal.fire("Unable to submit the lecturer", err.message, "error");
          }
          this.$emit("submitted", false);
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

