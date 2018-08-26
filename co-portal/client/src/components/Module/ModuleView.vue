<template>
  <div>
  
    <md-dialog style="width:50%;position:absolute" class="card row" :md-active.sync="addNotes">
      <md-card class="col s12 m8 offset-m2">
        <md-card-header>
          <div class="md-title">Adding notes</div>
        </md-card-header>
  
        <md-card-content>
          <md-field>
            <label>Title</label>
            <md-input v-model="notes.title" required></md-input>
          </md-field>
          <md-field>
            <label>Description</label>
            <md-textarea v-model="notes.description" required></md-textarea>
          </md-field>
          <md-field>
            <label>Notes file</label>
            <md-file type="notesFile" id="notesFile" ref="notesFile" v-on:change="handleNotesFileUpload()" v-model="notes.file" placeholder="Select the file you want to upload" />
          </md-field>
          <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
        </md-card-content>
      </md-card>
      <md-dialog-actions>
        <md-button class="md-primary" @click="UploadNotes()">Upload notes</md-button>
        <md-button class="md-primary" @click="addNotes = false">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  
    <md-dialog class="card" style="position:absolute" :md-active.sync="addStudent">
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
      <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
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
                        <md-menu-item v-on:click="addNotes = true" class="waves-effect">
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
                        <md-menu-item v-on:click="setATestForModule(module._id)" class="waves-effect">
                          <span>Set a test</span>
                          <md-icon>add</md-icon>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </md-card-header>
                  <md-card-content>
                    <md-list class="md-double-line">
                      <md-list-item v-for="questionaire in filteredTests" :key="questionaire._id" v-on:click="getSolutionFor(questionaire)" class="waves-effect">
                        <md-icon class="md-primary">library_books</md-icon>
                        <div class="md-list-item-text">
                          <span>{{ questionaire.title }}</span>
                          <span>{{ questionaire.questions.length }} {{ questionaire.questions.length == 1 ? 'question' : 'questions' }}</span>
                        </div>
                        <md-caption class="right">{{ getMoment(questionaire.date).fromNow() }}</md-caption>
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
      module: {
        students: [],
        lecturers: []
      },
      txtStudentSearch: "",
      txtLecturerSearch: "",
      txtError: "",
      addStudent: false,
      addNotes: false,
      notes: {
        title: "",
        description: "",
        file: null
      },
      notesFile: "",
      isLoading: false
    };
  },
  components: {
    AddStudent
  },
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
    },
    filteredTests() {
      return this.module.questionaires;
    }
  },
  mounted() {
    if (this.moduleID == null) {
      this.$router.back();
    } else {
      this.Reload();
    }
  },
  props: ["moduleID"],
  methods: {
    handleNotesFileUpload() {
      this.notesFile = this.$refs.notesFile.files[0];
    },
    UploadNotes() {
      this.txtError = "";
      if (this.notes.title.length < 2) {
        this.txtError = "Please provide a valid title";
      }

      if (this.notes.description.length < 2) {
        this.txtError = "Please provide a valid description";
      }

      if (this.notes.file == null) {
        this.txtError = "Please select a valid file";
      }

      if (this.txtError.length > 2) {
        return;
      }

      let formData = new FormData();
      formData.append("file", this.notesFile, "file");
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/m/add/notes/title/" +
            this.notes.title +
            "/description/" +
            this.notes.description,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        )
        .then(result => {
          console.log("SUCCESS!!");
        })
        .catch(err => {
          console.log("FAILURE!!");
        });
      alert();
    },
    AddedNewStudent(isAdded) {
      if (isAdded) {
        this.Reload();
      } else {
      }
    },
    Reload() {
      this.isLoading = true;
      axios
        .get(
          this.$store.state.settings.baseLink + "/m/get/module/" + this.moduleID
        )
        .then(results => {
          this.isLoading = false;
          this.module = results.data;
        })
        .catch(err => {
          this.isLoading = false;
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
    getSolutionFor(questionaire) {
      this.isLoading = true;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/m/get/solution/id/for/" +
            questionaire._id +
            "/by/" +
            this.$store.state.user.type +
            "/of/id/" +
            this.$store.state.user.id
        )
        .then(results => {
          this.isLoading = false;
          if (results.data.id == null) {
            this.goToTakeTest(questionaire);
          } else {
            this.goToSolution(results.data.id);
          }
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "Try again later", "error");
          } else {
            swal("Unable to load the questionaire", "Try again later", "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

