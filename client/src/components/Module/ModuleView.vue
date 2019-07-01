<template>
  <div class="screen">
    <md-dialog style="position:absolute;top:50%" class="card" :md-active.sync="addNotes">
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
            <md-file
              type="notesFile"
              id="notesFile"
              ref="notesFile"
              v-on:change="handleNotesFileUpload()"
              v-model="notes.file"
              placeholder="Select the file you want to upload"
            />
          </md-field>
          <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
        </md-card-content>
      </md-card>
      <md-dialog-actions>
        <ball-pulse-loader v-if="isUploading" color="#000000" size="20px"></ball-pulse-loader>
        <md-button v-if="!isUploading" class="md-primary" @click="UploadNotes()">Upload notes</md-button>
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

    <md-dialog class="card" style="position:absolute" :md-active.sync="addLecturer">
      <md-content style="overflow-y:scroll" class="row">
        <add-lecturer v-on:submitted="AddedNewLecturer"></add-lecturer>
      </md-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="addLecturer = false">Close</md-button>
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
        <md-tabs @md-changed="ChangeTab">
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
                        <md-menu-item
                          v-if="$store.state.user.type != 'STUDENT'"
                          v-on:click="addNotes = true"
                          class="waves-effect"
                        >
                          <span>Add new</span>
                          <md-icon>add</md-icon>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </md-card-header>
                  <md-card-content>
                    <md-list class="md-double-line">
                      <md-list-item
                        v-on:click="DownloadNotes(notes)"
                        v-for="(notes,i) in module.notes"
                        :key="i"
                        class="waves-effect"
                      >
                        <md-icon class="md-primary">library_books</md-icon>
                        <div class="md-list-item-text">
                          <span>{{ notes.title }}</span>
                          <span>{{ getMoment(notes.date).format('YYYY-MM-DD hh:mm') }}</span>
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
                        <md-menu-item
                          v-if="$store.state.user.type != 'STUDENT'"
                          v-on:click="setATestForModule(module._id)"
                          class="waves-effect"
                        >
                          <span>Set a test</span>
                          <md-icon>add</md-icon>
                        </md-menu-item>
                      </md-menu-content>
                    </md-menu>
                  </md-card-header>
                  <md-card-content>
                    <md-list class="md-double-line">
                      <md-list-item
                        v-for="questionaire in filteredTests"
                        :key="questionaire._id"
                        v-on:click="getSolutionFor(questionaire)"
                        class="waves-effect"
                      >
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
                      <div
                        class="md-subheader"
                      >{{ module.students.length }} {{ module.students.length == 1 ? 'student' : 'students' }}</div>
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
                        <md-menu-item
                          v-if="$store.state.user.type !== 'STUDENT'"
                          v-on:click="addStudent = true"
                          class="waves-effect"
                        >
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
                          <input
                            v-model="txtStudentSearch"
                            id="StudentPassword"
                            name="StudentPassword"
                            type="search"
                          />
                          <label class="text-center" for="StudentPassword">Search</label>
                        </div>
                      </md-list-item>
                      <md-list-item
                        v-for="student in filteredStudents"
                        :key="student._id"
                        v-on:click="goToStudent(student._id)"
                        class="waves-effect"
                      >
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
                      <div
                        class="md-subheader"
                      >{{ module.lecturers.length }} {{ module.lecturers.length == 1 ? 'lecturer' : 'lecturers' }}</div>
                    </md-card-header-text>
                    <md-menu md-size="big" md-direction="bottom-end">
                      <md-button class="md-icon-button" md-menu-trigger>
                        <md-icon>more_vert</md-icon>
                      </md-button>

                      <md-menu-content class="card">
                        <md-menu-item
                          v-if="$store.state.user.type == 'ADMIN'"
                          v-on:click="addLecturer = true"
                          class="waves-effect"
                        >
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
                          <input
                            v-model="txtLecturerSearch"
                            id="LecturerPassword"
                            name="LecturerPassword"
                            type="search"
                          />
                          <label class="text-center" for="LecturerPassword">Search</label>
                        </div>
                      </md-list-item>
                      <md-list-item
                        v-for="lecturer in filteredLecturers"
                        :key="lecturer._id"
                        v-on:click="goToLecturer(lecturer._id)"
                        class="waves-effect"
                      >
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
            <md-empty-state
              v-if="announcements.length == 0"
              md-icon="announcement"
              md-label="No announcements"
              :md-description="`All the announcements about ${module.name} (${module.code}) will be posted here.`"
            >
              <md-button
                v-if="userType !== 'STUDENT'"
                class="md-primary md-raised"
              >Add an announcement</md-button>
            </md-empty-state>
            <div v-if="$store.state.user.type != 'STUDENT' && !isAddingAnnouncements" class="row">
              <div
                v-on:click="isAddingAnnouncements = true"
                class="col s8 card card-panel offset-s2 m6 offset-m3 text-center center-align hoverable pointer waves-effect"
              >
                <h5 class="center-align center text-center">Send an announcement</h5>
              </div>
            </div>

            <md-card v-if="$store.state.user.type != 'STUDENT' && isAddingAnnouncements">
              <md-header>
                <md-button class="md-icon-button right" v-on:click="isAddingAnnouncements = false">
                  <md-icon>close</md-icon>
                </md-button>
              </md-header>
              <md-content>
                <div class="row">
                  <div class="input-field col s8 offset-s2 m6 offset-m3 center-align text-center">
                    <label class="center-align text-center">Sending an announcement</label>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                    <input
                      v-model="announcement.title"
                      id="ModuleDescription"
                      name="ModuleDescription"
                      type="text"
                    />
                    <label class="text-center" for="ModuleDescription">Title</label>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                    <input
                      v-model="announcement.message"
                      id="ModuleDescription"
                      name="ModuleDescription"
                      type="text"
                    />
                    <label class="text-center" for="ModuleDescription">Message</label>
                  </div>
                </div>
                <div class="row">
                  <div class="col s8 offset-s2 m6 offset-m3 text-center">
                    <label>Send to :</label>
                  </div>
                  <div class="col s8 offset-s2 m6 offset-m3 text-center">
                    <form action="#">
                      <p>
                        <label>
                          <input
                            v-model="announcement.isToAll"
                            :value="false"
                            class="with-gap"
                            name="group1"
                            type="radio"
                            checked
                          />
                          <span>{{ module.name }} ({{ module.code }}) students</span>
                        </label>
                      </p>
                      <p>
                        <label>
                          <input
                            v-model="announcement.isToAll"
                            :value="true"
                            class="with-gap"
                            name="group1"
                            type="radio"
                          />
                          <span>All Students</span>
                        </label>
                      </p>
                    </form>
                  </div>
                </div>
              </md-content>
              <md-card-actions>
                <ball-pulse-loader v-if="isUploading" color="#000000" size="20px"></ball-pulse-loader>
                <md-button
                  v-if="!isUploading"
                  v-on:click="SendAnnouncement()"
                  class="md-primary"
                >Send announcement</md-button>
              </md-card-actions>
            </md-card>
            <md-card
              class="hoverable"
              v-show="!isAddingAnnouncements"
              v-for="(announcement,i) in announcements"
              :key="i"
            >
              <md-list class="md-triple-line">
                <md-list-item>
                  <md-avatar>
                    <img src="https://placeimg.com/40/40/people/1" alt="People" />
                  </md-avatar>

                  <div class="md-list-item-text">
                    <span>{{ announcement.lecturerId ? announcement.lecturerId.lastname + " " + announcement.lecturerId.firstname : "Admin" }} &nbsp;&bull; {{ getMoment(announcement.date).fromNow() }}</span>
                    <span>{{ announcement.title }}</span>
                    <p>{{ announcement.message }}</p>
                  </div>

                  <md-button class="md-icon-button md-list-action">
                    <md-icon class="md-primary">thumb_up</md-icon>
                  </md-button>
                </md-list-item>
              </md-list>
            </md-card>
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
import AddLecturer from "../Lecturer/AddLecturer";

import * as download from "../../assets/lib/js/download.js";

export default {
  name: "ModuleView",
  data() {
    return {
      module: {
        students: [],
        lecturers: []
      },
      announcement: {
        title: "",
        message: "",
        isToAll: false
      },
      announcements: [],
      txtStudentSearch: "",
      txtLecturerSearch: "",
      txtError: "",
      addStudent: false,
      addLecturer: false,
      userType: "",
      addNotes: false,
      notes: {
        title: "",
        description: "",
        file: null
      },
      notesFile: null,
      isLoading: false,
      isUploading: false,
      isAddingAnnouncements: false
    };
  },
  components: {
    AddStudent,
    AddLecturer
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
    this.userType = this.$store.state.user.type;
    if (this.moduleID == null) {
      this.$router.back();
    } else {
      this.Reload();
    }
  },
  props: ["moduleID"],
  methods: {
    ChangeTab(selected) {
      if (selected == "tab-announcement") {
        axios
          .post(
            this.$store.state.settings.baseLink +
              "/n/announcements/get/for/" +
              this.$store.state.user.id,
            {
              userType: this.$store.state.user.type,
              moduleID: this.moduleID
            }
          )
          .then(results => {
            this.isLoading = false;
            this.announcements = results.data;
            console.log(results);
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal(err.response.data, "error");
            } else {
              swal(err.message, "Try again later", "error");
            }
          });
      }
    },
    DownloadNotes(notes) {
      this.isLoading = true;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/m/get/lecturer/notes/" +
            notes._id
        )
        .then(results => {
          this.isLoading = false;
          var data = results.data.file.base64StringFile;
          var fileName = results.data.file.fileName;
          var type = results.data.type;

          var notes = download.download(data, fileName, type);
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal(err.message, "Try again later", "error");
          }
        });
    },
    getFile(file) {
      var reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onerror = () => {
          reader.abort();
          reject(new Error("Error parsing file"));
        };
        reader.onload = function() {
          //This will result in an array that will be recognized by C#.NET WebApi as a byte[]
          let bytes = Array.from(new Uint8Array(this.result));

          //if you want the base64encoded file you would use the below line:
          let base64StringFile = btoa(
            bytes.map(item => String.fromCharCode(item)).join("")
          );

          //Resolve the promise with your custom file structure
          resolve({
            bytes: new Array(),
            base64StringFile:
              "data:" + file.type + ";base64," + base64StringFile,
            fileName: file.name,
            fileType: file.type
          });
        };
        reader.readAsArrayBuffer(file);
      });
    },
    handleNotesFileUpload() {
      if (this.notes.file.target.files.length > 0) {
        this.isUploading = true;
        this.getFile(this.notes.file.target.files[0])
          .then(file => {
            this.isUploading = false;
            this.notesFile = file;
            console.log(file);
          })
          .catch(err => {
            swal("Unable to upload selected file", err.message, "error");
            this.isUploading = false;
            this.notesFile = null;
          });
      } else {
        swal("No file selected", "Please select a file", "error");
        this.notesFile = null;
      }
    },
    UploadNotes() {
      this.isUploading = true;
      this.txtError = "";
      if (this.notes.title.length < 2) {
        this.txtError = "Please provide a valid title";
      }

      if (this.notes.description.length < 2) {
        this.txtError = "Please provide a valid description";
      }

      if (this.notesFile == null) {
        this.txtError = "Please select a valid file";
      }

      if (this.txtError.length > 2) {
        this.isUploading = false;
        return;
      }

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/m/add/notes/title/" +
            this.notes.title +
            "/description/" +
            this.notes.description,
          {
            file: this.notesFile,
            moduleId: this.moduleID,
            lecturerId:
              this.$store.state.user.type == "ADMIN"
                ? "ADMIN"
                : this.$store.state.user.id
          }
        )
        .then(result => {
          this.isUploading = false;
          this.addNotes = false;
          swal("Notes successfully uploaded.");
        })
        .catch(err => {
          this.isUploading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal(err.message, "Try again later", "error");
          }
        });
    },
    AddedNewStudent(isAdded) {
      if (isAdded) {
        this.Reload();
      } else {
      }
    },
    AddedNewLecturer(isAdded) {
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
    },
    SendAnnouncement() {
      this.isUploading = true;
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/n/announcements/add/for/" +
            this.moduleID +
            "/by/" +
            this.$store.state.user.type +
            "/of/id/" +
            this.$store.state.user.id,
          {
            announcement: this.announcement
          }
        )
        .then(results => {
          this.isUploading = false;
          swal("Success", "Announcement successfully sent.", "success");
        })
        .catch(err => {
          this.isUploading = false;
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

