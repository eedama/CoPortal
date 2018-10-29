<template>
  <div>
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="Logout()" class="right">
          <md-icon>done</md-icon>
          <span>Done</span>
        </md-button>
      </div>
    </div>

    <div class="row" style="height:80vh">
      <div class="col s12 m8 offset-m2 l6 offset-l3">
       <add-student v-on:submitted="AddedNewStudent"></add-student>  
      </div>
    
</div>
    
  </div>
</template>

<script>
import swal from "sweetalert";
import * as moment from "moment";

const axios = require("axios");

import AddStudent from "../Student/AddStudent";

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
  props: ["studentIDs"],
  components: { AddStudent },
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
  mounted() {},
  methods: {
    AddedNewStudent(isAdded) {
      if (isAdded) {
        this.Reload();
      } else {
      }
    }
  }
};
</script>

<style scoped>
</style>

