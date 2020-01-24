<template>
  <v-row class="row">
    <v-col cols="12" md="4" offset-md="4" class="my-auto" v-show="done">
      <v-card class="ma-5">
        <v-card-text>
          <p class="title text-center mx-auto">
            Student was successfully added.
          </p>
          <p class="subtitle text-center mx-auto">
            You can now assign the student to more modules / view the student's
            progress.
          </p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="10" offset-md="1" class="mx-auto" v-show="!done">
      <v-content class="card-content">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="student.firstname"
              prepend-inner-icon="mdi-account"
              label="Firstname"
              type="text"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="student.lastname"
              prepend-inner-icon="mdi-account-outline"
              label="Lastname"
              type="text"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8" offset-md="2">
            <v-text-field
              v-model="student.username"
              prepend-inner-icon="mdi-account"
              label="Username"
              type="text"
              outlined
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="student.password"
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
              v-model="student.confirmPassword"
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
              v-model="student.modules"
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="9">
            <v-text-field
              v-model="student.idNumber"
              prepend-inner-icon="mdi-account"
              label="ID number"
              type="number"
              outlined
              maxlength="13"
              :helper="
                student.isSouthAfrican
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
              v-model="student.gender"
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
              v-on:click="SubmitStudent()"
              block
              color="secondary"
            >
              Submit student
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
  name: "AddStudent",
  data() {
    return {
      showPassword: false,
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
      moduleNames: [],
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

      if (this.student.modules.filter(m => m != null).length == 0) {
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

