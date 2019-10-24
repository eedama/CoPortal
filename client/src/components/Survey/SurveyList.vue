<template>
  <div class="screen">
    <md-dialog
      md-fullscreen
      style="position:absolute;top:50%"
      class="card"
      :md-active.sync="showingSurveyStudentList"
    >
      <md-card style="overflow-y:scroll" class="col s12 m8 offset-m2">
        <md-card-header
          v-if="
            selectedSurveyStudentList &&
              selectedSurveyStudentList.surveyTemplateId
          "
        >
          <div class="row">
            <h5 class="center col s12">
              {{ selectedSurveyStudentList.surveyTemplateId.title }}
            </h5>
            <img
              class="col s12 m6 offset-m3 center img-responsive fluid"
              src="../../assets/km-logo.jpeg"
              alt="km logo"
            />
          </div>
        </md-card-header>

        <ball-pulse-loader
          v-if="!selectedSurveyStudentList"
          color="#000000"
          size="20px"
        ></ball-pulse-loader>

        <md-card-content v-if="selectedSurveyStudentList">
          <div class="row">
            <div
              class="col s12 m10 offset-m1"
              v-for="(student, i) in selectedSurveyStudentList.students.filter(
                v => v && v.studentId
              )"
              :key="i"
            >
              <md-card class="row">
                <md-card-header class="col s12 m-10 p-x-10 p-t-10">
                  <span class="md-subheading center"
                    ><strong
                      >{{ student.studentId.lastname }}
                      {{ student.studentId.firstname }}</strong
                    ></span
                  >
                </md-card-header>
                <md-card-content class="col s12">
                  <md-list class="md-double-line">
                    <md-list-item
                      v-for="(studentAnswer, k) in student.answers"
                      :key="k"
                      class="waves-effect"
                    >
                      <md-icon class="md-primary">question_answer</md-icon>
                      <div class="md-list-item-text">
                        <span class="md-subheading">{{
                          studentAnswer.question
                        }}</span>
                        <span class="blue-text">{{
                          studentAnswer.answer
                        }}</span>
                      </div>
                    </md-list-item>
                  </md-list>
                </md-card-content>
              </md-card>
            </div>
          </div>
        </md-card-content>
      </md-card>
      <md-dialog-actions>
        <md-button class="md-primary" @click="showingSurveyStudentList = false"
          >Close</md-button
        >
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
        <md-card-header class="center row text-xs-center">
          <div class="row center col s12 m8 offset-m2">
            <img
              class="col s12 m4 offset-m4 center"
              src="../../assets/km-logo.jpeg"
              alt="km logo"
            />
          </div>
          <h2 class="md-title col s12">Surveys</h2>
        </md-card-header>
      </div>
      <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
        <ball-pulse-loader
          v-if="isLoading"
          color="#000000"
          size="20px"
        ></ball-pulse-loader>
      </div>
      <div class="col s12">
        <div class="row">
          <div class="col s12 m6 xl3" v-for="(_module, i) in modules" :key="i">
            <md-card>
              <md-card-header>
                <md-card-header-text>
                  <div class="md-subheader">
                    {{ _module.name }} {{ _module.code }}
                  </div>
                </md-card-header-text>
                <md-menu md-size="big" md-direction="bottom-end">
                  <md-button class="md-icon-button">
                    <md-icon>add</md-icon>
                  </md-button>
                </md-menu>
              </md-card-header>
              <md-card-content>
                <ball-pulse-loader
                  v-show="!_module.loaded"
                  color="#000000"
                  size="20px"
                ></ball-pulse-loader>
                <md-list
                  v-if="_module.loaded && _module.moduleSurveys"
                  class="md-double-line"
                >
                  <md-list-item
                    v-for="(moduleSurvey, k) in _module.moduleSurveys"
                    :key="k"
                    @click="selectModuleSurvey(moduleSurvey)"
                    class="waves-effect"
                  >
                    <md-icon class="md-primary">question_answer</md-icon>
                    <div class="md-list-item-text">
                      <span>{{ moduleSurvey.surveyTemplateId.title }}</span>
                      <span>{{
                        getMoment(moduleSurvey.date).format("Do MMMM YYYY")
                      }}</span>
                    </div>
                  </md-list-item>
                </md-list>
              </md-card-content>
            </md-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";

const axios = require("axios");

export default {
  name: "ModuleView",
  data() {
    return {
      modules: [],
      showingSurveyStudentList: false,
      selectedSurveyStudentList: null,
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
  mounted() {
    this.isLoading = true;
    this.userType = this.$store.state.user.type;
    axios
      .get(
        this.$store.state.settings.baseLink +
          "/m/modules/all/for/" +
          this.$store.state.user.id +
          "/" +
          this.$store.state.user.type
      )
      .then(results => {
        this.isLoading = false;
        this.modules = results.data;
        this.modules.forEach(m => {
          m.moduleSurveys = null;
          axios
            .get(
              this.$store.state.settings.baseLink +
                "/survey/get/surveys/for/" +
                m._id
            )
            .then(moduleSurveys => {
              m.loaded = true;
              m.moduleSurveys = moduleSurveys.data;
              this.$forceUpdate();
            })
            .catch(err => {
              m.loaded = true;
              m.moduleSurveys = [];
              this.$forceUpdate();
              console.log("error", err.message);
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
  methods: {
    selectModuleSurvey(moduleSurvey) {
      this.showingSurveyStudentList = true;
      this.selectedSurveyStudentList = null;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/survey/get/survey/questions/for/" +
            moduleSurvey._id
        )
        .then(results => {
          this.isLoading = false;
          this.selectedSurveyStudentList = results.data;
          console.log(this.selectedSurveyStudentList);
        })
        .catch(err => {
          this.isLoading = false;
          console.log(err);
          this.selectedSurveyStudentList = [];
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal(err.message, "Try again later", "error");
          }
        });
    },
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
            if (this.$store.state.user.isParent) {
              swal("The student has not taken this test yet", "", "warning");
            } else {
              this.goToTakeTest(questionaire);
            }
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

