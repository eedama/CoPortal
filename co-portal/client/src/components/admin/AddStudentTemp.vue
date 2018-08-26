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
  mounted() {
    this.Reload();
  },
  methods: {
    Logout() {
      this.$store.commit("logout");
      this.$router.push("/login");
    },
    Reload() {
      if (this.studentIDs != null) {
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/s/students/of/ids/" +
              this.studentIDs
          )
          .then(results => {
            this.students = results.data;
            if (this.students.length == 1) {
              this.isFullscreen = this.students[0]._id;
            }
            console.log(this.students);
          })
          .catch(err => {
            if (err.response != null && err.response.status == 512) {
              swal(err.response.data, "error");
            } else {
              swal("Unable to load students", "Try again later", "error");
            }
          });
      } else {
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
    }
  }
};
</script>

<style scoped>
</style>

