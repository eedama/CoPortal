<template>
  <div>

    <md-dialog :md-active.sync="addStudent">
      <md-content style="overflow-y:scroll" class="row">
        <add-student v-on:submitted="AddedNewStudent"></add-student>
      </md-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="addStudent = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="$router.back()" class="right">
          <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
    <div class="row">
      <div class="col s12">
        <md-card>
          <md-card-header>
            <div class="md-title">{{ module.name }}</div>
            <div class="md-subhead">{{ module.code }}</div>
            <div class="md-subhead center-align">{{ module.description }}</div>
          </md-card-header>
        </md-card>
      </div>
      <div class="col s12">
        <md-tabs>
          <md-tab id="tab-home" md-label="Home">
            <div class="row">
              <div class="col s12 m6 xl3">
                <md-card>
                  <md-card-header>
                    <md-card-header-text>
                      <div class="md-subheader">Notes</div>
                    </md-card-header-text>
                    <md-menu md-size="big" md-direction="bottom-end">
                      <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>more_vert</md-icon>
                      </md-button>
  
                      <md-menu-content class="card">
                        <md-menu-item class="waves-effect">
                          <span>Add new</span>
                          <md-icon>add</md-icon>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </md-card-header>
                  <md-card-content>
                    <md-list class="md-double-line">
                      <md-list-item class="waves-effect">
                        <md-icon class="md-primary">library_books</md-icon>
                        <div class="md-list-item-text">
                          <span>The life of life</span>
                          <span>{{ getMoment(new Date()).format('YYYY-MM-DD hh:mm') }}</span>
                        </div>
                      </md-list-item>
                    </md-list>
                  </md-card-content>
                </md-card>
              </div>
              <div class="col s12 m6 xl3">
                <md-card>
                  <md-card-header>
                    <md-card-header-text>
                      <div class="md-subheader">Tests</div>
                    </md-card-header-text>
                    <md-menu md-size="big" md-direction="bottom-end">
                      <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>more_vert</md-icon>
                      </md-button>
  
                      <md-menu-content class="card">
                        <md-menu-item class="waves-effect">
                          <span>Set a test</span>
                          <md-icon>add</md-icon>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </md-card-header>
                  <md-card-content>
                    <md-list class="md-double-line">
                      <md-list-item class="waves-effect">
                        <md-icon class="md-primary">library_books</md-icon>
                        <div class="md-list-item-text">
                          <span>The life of life</span>
                          <span>{{ getMoment(new Date()).format('YYYY-MM-DD hh:mm') }}</span>
                        </div>
                      </md-list-item>
                    </md-list>
                  </md-card-content>
                </md-card>
              </div>
              <div class="col s12 m6 xl3">
                <md-card>
                  <md-card-header>
                    <md-card-header-text>
                      <div class="md-subheader">{{ module.students.length }} {{ module.students.length == 1 ? 'student' : 'students' }}</div>
                    </md-card-header-text>
                    <md-menu md-size="big" md-direction="bottom-end">
                      <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>more_vert</md-icon>
                      </md-button>
                      <md-menu-content class="card">
                        <md-menu-item v-on:click="Reload()" class="waves-effect">
                          <span>Reload</span>
                          <md-icon>reload</md-icon>
                        </md-menu-item>
                        <md-menu-item v-on:click="addStudent = true" class="waves-effect">
                          <span>Add new</span>
                          <md-icon>add</md-icon>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </md-card-header>
                  <md-card-content>
                    <md-list class="md-double-line">
                      <md-list-item>
                        <md-icon class="md-primary">search</md-icon>
                        <div class="md-list-item-text input-field">
                          <input v-model="txtStudentSearch" id="StudentPassword" name="StudentPassword" type="search" />
                          <label class="text-center" for="StudentPassword">Search</label>
                        </div>
                      </md-list-item>
                      <md-list-item v-for="student in filteredStudents" :key="student._id" v-on:click="goToStudent(student._id)" class="waves-effect">
                        <md-icon class="md-primary">account_circle</md-icon>
                        <div class="md-list-item-text">
                          <span>{{ student.lastname }} {{ student.firstname }}</span>
                          <span>{{ student.username }}</span>
                        </div>
                      </md-list-item>
                    </md-list>
                  </md-card-content>
                </md-card>
              </div>
              <div class="col s12 m6 xl3">
                <md-card>
                  <md-card-header>
                    <md-card-header-text>
                      <div class="md-subheader">{{ module.lecturers.length }} {{ module.lecturers.length == 1 ? 'lecturer' : 'lecturers' }}</div>
                    </md-card-header-text>
                    <md-menu md-size="big" md-direction="bottom-end">
                      <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>more_vert</md-icon>
                      </md-button>
  
                      <md-menu-content class="card">
                        <md-menu-item class="waves-effect">
                          <span>Add new</span>
                          <md-icon>add</md-icon>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </md-card-header>
                  <md-card-content>
                    <md-list class="md-double-line">
                      <md-list-item>
                        <md-icon class="md-primary">search</md-icon>
                        <div class="md-list-item-text input-field">
                          <input v-model="txtLecturerSearch" id="LecturerPassword" name="LecturerPassword" type="search" />
                          <label class="text-center" for="LecturerPassword">Search</label>
                        </div>
                      </md-list-item>
                      <md-list-item v-for="lecturer in filteredLecturers" :key="lecturer._id" v-on:click="goToLecturer(lecturer._id)" class="waves-effect">
                        <md-icon class="md-primary">account_circle</md-icon>
                        <div class="md-list-item-text">
                          <span>{{ lecturer.lastname }} {{ lecturer.firstname }}</span>
                          <span>{{ lecturer.username }}</span>
                        </div>
                      </md-list-item>
                    </md-list>
                  </md-card-content>
                </md-card>
              </div>
            </div>
          </md-tab>
          <md-tab id="tab-announcement" md-label="Announcements">
            <md-empty-state md-icon="announcement" md-label="No announcements" :md-description="`All the announcements about ${module.name} (${module.code}) will be posted here.`">
              <md-button class="md-primary md-raised">Add an announcement</md-button>
            </md-empty-state>
          </md-tab>
        </md-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";

const axios = require("axios");

import AddStudent from "../Student/AddStudent";

export default {
  name: "ModuleView",
  data() {
    return {
      module: null,
      txtStudentSearch: "",
      txtLecturerSearch: "",
      addStudent: false
    };
  },
  components: { AddStudent },
  computed: {
    filteredLecturers() {
      return this.module.lecturers.filter(
        l =>
          this.txtLecturerSearch.length < 1 ||
          JSON.stringify(l)
            .toLowerCase()
            .indexOf(this.txtLecturerSearch.toLowerCase()) >= 0
      );
    },
    filteredStudents() {
      return this.module.students.filter(
        l =>
          this.txtStudentSearch.length < 1 ||
          JSON.stringify(l)
            .toLowerCase()
            .indexOf(this.txtStudentSearch.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    if(this.moduleID == null){
      this.$router.push('/module/list');
    }else{
    this.Reload();
    }
  },
  props: ["moduleID"],
  methods: {
    AddedNewStudent(isAdded){
      if(isAdded){
        this.Reload();
      }else{

      }
    },
    Reload(){
      axios
      .get(
        this.$store.state.settings.baseLink + "/m/get/module/" + this.moduleID
      )
      .then(results => {
        this.module = results.data;
        console.log(this.module);
      })
      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load the module", "Try again later", "error");
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
    GetPastTestsFor(module) {
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/s/all/past/tests/for/" +
            module._id
        )
        .then(results => {
          this.modules.map(s => {
            if (s._id == module._id) {
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
            swal("Unable to load modules", err.message, "error");
          }
        });
    },
    SubmitModule() {
      this.txtError = "";
      if (this.module.name.length < 2) {
        this.txtError = "Please enter a valid module name";
      }

      if (this.module.code.length < 2) {
        this.txtError = "Please enter a valid module code";
      }

      if (this.txtError.length > 2) return;

      axios
        .post(this.$store.state.settings.baseLink + "/m/add/new/module", {
          module: this.module
        })
        .then(results => {
          this.modules = results.data;
          this.addingModules = false;
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the module", err.message, "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

