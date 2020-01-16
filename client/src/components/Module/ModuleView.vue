<template>
  <div class="screen">
     <v-dialog
      v-if="
        $store.state.user.isLoggedIn &&
          ($store.state.user.type == 'LECTURER' ||
            $store.state.user.type == 'ADMIN')
      "
      max-width="600"
      color="white"
      v-model="isAddingAnnouncements"
    >
      <v-card color="secondary">
        <v-row>
          <v-col cols="10">
            <v-card-title class="headline text-white"
              >Send an announcement</v-card-title
            >
            <v-card-text
              ><span class="text-white"
                >Communicate with students in real-time</span
              ></v-card-text
            >
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
            <v-btn
              icon
              v-on:click="isAddingAnnouncements = false"
              right
              class="right"
            >
              <v-icon style="color:ghostwhite">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <v-row class="bg-white px-10">
        <v-col cols="12">
          <v-text-field
            color="secondary"
            label="Announcement title"
            outlined
            v-model="announcement.title"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            color="secondary"
            label="Message"
            outlined
            prepend-inner-icon="mdi-bullhorn-outline"
            v-model="announcement.message"
          >
          </v-textarea>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            v-model="announcement.isParent"
            label="Send announcement to parents"
          ></v-checkbox>
        </v-col>
        <v-col cols="12">
          <v-chip-group
          mandatory
          active-class="primary--text"
        >
          <v-chip @click="announcement.isToAll = false">
            Send to {{ module.name }} {{ module.code }} students only
          </v-chip>
          <v-chip @click="announcement.isToAll = true">
            Send to all students
          </v-chip>
        </v-chip-group>
        </v-col>

        <v-col cols="12">
          <p v-if="!isLoading" class="text-center">
            The announcement will be sent to
            <strong>{{
              announcement.isToAll
                ?
                 "all students"
                 : `${module.name} ${module.code} students only`
            }}</strong>
            {{
              announcement.isParent ? " and SMSs to thier parents as well" : ""
            }}
          </p>
          <v-btn
            :loading="isUploading"
            :disabled="isUploading"
            v-on:click="SendAnnouncement()"
            color="secondary"
            large
            block
            rounded
            >Send announcement</v-btn
          ></v-col
        >
      </v-row>
    </v-dialog>

    <v-dialog class="card" v-model="addNotes">
      <v-card class="col s12 m8 offset-m2">
        <v-card-header>
          <div class="v-title">Adding notes</div>
        </v-card-header>

        <v-card-content>
          <v-field>
            <label>Title</label>
            <v-input v-model="notes.title" required></v-input>
          </v-field>
          <v-field>
            <label>Description</label>
            <v-textarea v-model="notes.description" required></v-textarea>
          </v-field>
          <v-field>
            <label>Notes file</label>
            <v-file
              type="notesFile"
              id="notesFile"
              ref="notesFile"
              v-on:change="handleNotesFileUpload()"
              v-model="notes.file"
              placeholder="Select the file you want to upload"
            />
          </v-field>
          <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
        </v-card-content>
      </v-card>
      <v-dialog-actions>
        <ball-pulse-loader v-if="isUploading" color="#000000" size="20px"></ball-pulse-loader>
        <v-btn v-if="!isUploading" class="v-primary" @click="UploadNotes()">Upload notes</v-btn>
        <v-btn class="v-primary" @click="addNotes = false">Close</v-btn>
      </v-dialog-actions>
    </v-dialog>

    <v-dialog class="card" v-model="addStudent">
      <v-content style="overflow-y:scroll" class="row">
        <add-student v-on:submitted="AddedNewStudent"></add-student>
      </v-content>
      <v-dialog-actions>
        <v-btn class="v-primary" @click="addStudent = false">Close</v-btn>
      </v-dialog-actions>
    </v-dialog>

    <v-dialog class="card" v-model="addLecturer">
      <v-content style="overflow-y:scroll" class="row">
        <add-lecturer v-on:submitted="AddedNewLecturer"></add-lecturer>
      </v-content>
      <v-dialog-actions>
        <v-btn class="v-primary" @click="addLecturer = false">Close</v-btn>
      </v-dialog-actions>
    </v-dialog>

    <v-row>
       <v-col cols="10"> </v-col>
    <v-col cols="2">
      <v-btn
        right
        v-on:click="$router.back()"
        class="primary justify-end"
      >
        <v-icon>mdi-keyboard-backspace</v-icon>
        <span class="px-2">Back</span>
      </v-btn>
    </v-col>
    </v-row>
    <v-row v-if="module && module.name">
      <v-col cols="12" sm="12" md="6" lg="6" xlg="6" class="mx-auto">
        <v-card class="pa-3">
          <v-card-header class="text-center">
            <div class="display-2 py-2">{{ module.name }} {{ module.code }}</div>
            <div class="title">{{ module.description }}</div>
          </v-card-header>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="6" xlg="6" class="mx-auto">
        <v-card :loading="isLoading" class="pa-3">
        <v-tabs grow>
          <v-tab id="tab-announcements">
            Announcements
          </v-tab>
          <v-tab id="tab-tests">
            Tests
          </v-tab>
          <v-tab id="tab-notes">
            Notes
          </v-tab>
          <v-tab v-if="module && module.students" id="tab-students">
            <v-badge
          color="red"
          
          :content="module.students.length"
        >
          {{ module.students.length == 1 ? 'student' : 'students' }}
        </v-badge>
          </v-tab>
          <v-tab v-if="module && module.lecturers" id="tab-lecturers">
            <v-badge
          color="green"
          
          :content="module.lecturers.length"
        >
          {{ module.lecturers.length == 1 ? 'lecturer' : 'lecturers' }}
        </v-badge>
          </v-tab>
          <v-tab-item>
            <v-row>

      <v-col cols="12" sm="12">
        <v-row>
          <v-col cols="8" class="mx-auto">
            <v-btn
              class="my-auto"
              v-if="
                $store.state.user.type == 'LECTURER' ||
                  $store.state.user.type == 'ADMIN'
              "
              block 
              shaped
              @click="isAddingAnnouncements = true"
              color="secondary"
            >
              Send an announcement
            </v-btn>
          </v-col>
          <v-col style="overflow-y:auto;max-height:50vh" cols="12">
            <v-card
              class="mx-10 mb-5"
              shaped
              outlined
              v-on:click="AnnouncementClick(announcement)"
              v-for="(announcement, i) in announcements"
              :key="i"
            >
              <v-list-item three-line>
                <v-list-item-avatar tile size="80">
                  <v-icon class="text-peach" size="50">mdi-bell</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <div class="overline mb-4">
                    {{
                      announcement.lecturerId
                        ? announcement.lecturerId.lastname +
                          " " +
                          announcement.lecturerId.firstname
                        : "Admin"
                    }}
                    &nbsp;&bull;
                    <span class="text-peach">{{
                      getMoment(announcement.date).fromNow()
                    }}</span>
                  </div>
                  <v-list-item-title class="subtitle-1 mb-1">{{
                    announcement.title
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    ><span class="text-blue">{{
                      announcement.message
                    }}</span></v-list-item-subtitle
                  >
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
         </v-row>
      </v-col>
            </v-row>
          </v-tab-item>
            <v-tab-item>
            <v-row class="ma-3">
              <v-col cols="12" sm="12" md="8" class="mx-auto">
                  <v-btn
              class="my-auto"
              block
              shaped
              color="secondary" v-if="$store.state.user.type != 'STUDENT'"
                          v-on:click="setATestForModule(module._id)"
            >
              Set a test
            </v-btn>
              </v-col>
            <v-col cols="12" sm="12">
                    <v-list class="v-double-line">

    <v-list-item prepend-icon="library_books" v-for="questionaire in filteredTests"
                        :key="questionaire._id"
                        v-on:click="getSolutionFor(questionaire)" three-line>
            <v-list-item-avatar>
              <v-icon>mdi-library-books</v-icon>
            </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ questionaire.title }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ questionaire.questions.length }} {{ questionaire.questions.length == 1 ? 'question' : 'questions' }}
        </v-list-item-subtitle>
        <v-list-item-subtitle  class="caption">
          {{ getMoment(questionaire.date).fromNow() }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
                    </v-list>
              </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
            <v-row class="ma-3">
                 <v-col cols="12" sm="12" md="8" class="mx-auto">
                  <v-btn
              class="my-auto"
              block
              shaped
              color="secondary" v-if="$store.state.user.type != 'STUDENT'"
                          v-on:click="addNotes = true"
            >
              Upload new notes
            </v-btn>
              </v-col>
                 <v-col cols="12" sm="12">
                     <v-list>
    <v-list-item v-on:click="DownloadNotes(notes)"
                        v-for="(notes,i) in module.notes"
                        :key="i" two-line>
            <v-list-item-avatar>
              <v-icon>mdi-library-books</v-icon>
            </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ notes.title }}</v-list-item-title>
        <v-list-item-subtitle>
         {{ getMoment(notes.date).format('YYYY-MM-DD hh:mm') }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
                    </v-list>
              </v-col>
            </v-row>
            </v-tab-item>
            <v-tab-item>
                    <v-row class="ma-3">
                 <v-col cols="12" sm="12" md="8" class="mx-auto">
                  <v-btn
              class="my-auto"
              block
              shaped
              color="secondary" v-if="$store.state.user.type !== 'STUDENT'"
                          v-on:click="addStudent = true"
            >
              Register a student
            </v-btn>
              </v-col>
               <v-col sm="12" md="6" offset-md="3">
      <v-text-field
        class="text-center mx-auto text-xs-center"
        color="secondary"
        label="Search"
        solo
        block
        prepend-inner-icon="mdi-magnify" 
        v-model="txtStudentSearch"
      >
      </v-text-field>
    </v-col>
                 <v-col cols="12" sm="12">
                     <v-list>
    <v-list-item v-for="student in filteredStudents"
                        :key="student._id"
                        v-on:click="goToStudent(student._id)" two-line>
            <v-list-item-avatar>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ student.lastname }} {{ student.firstname }}</v-list-item-title>
        <v-list-item-subtitle>
         {{ student.username }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
                    </v-list>
              </v-col>
            </v-row>
            </v-tab-item>
            <v-tab-item>
                       <v-row class="ma-3">
              <v-col cols="12" sm="12" md="8" class="mx-auto">
                  <v-btn
              class="my-auto"
              block
              shaped
              color="secondary" 
                          v-if="$store.state.user.type == 'ADMIN'"
                          v-on:click="addLecturer = true"
            >
              Register a lecturer
            </v-btn>
              </v-col>
               <v-col sm="12" md="6" offset-md="3">
      <v-text-field
        class="text-center mx-auto text-xs-center"
        color="secondary"
        label="Search"
        solo
        block
        prepend-inner-icon="mdi-magnify" 
        v-model="txtLecturerSearch"
      >
      </v-text-field>
    </v-col>
            <v-col cols="12" sm="12">
                    <v-list class="v-double-line">

    <v-list-item 
                        v-for="lecturer in filteredLecturers"
                        :key="lecturer._id"
                        v-on:click="goToLecturer(lecturer._id)" two-line>
            <v-list-item-avatar>
              <v-icon>mdi-teach</v-icon>
            </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ lecturer.lastname }} {{ lecturer.firstname }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ lecturer.username }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
                    </v-list>
              </v-col>
              </v-row>
            </v-tab-item>
            </v-tabs>
            </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import swal from "sweetalert2";

const axios = require("axios");

import AddStudent from "../Student/AddStudent";
import AddLecturer from "../Lecturer/AddLecturer";

// import download from "../../plugins/download";

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
              swal.fire(err.response.data, "error");
            } else {
              swal.fire(err.message, "Try again later", "error");
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

        //  var notes = download.download(data, fileName, type);
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire(err.message, "Try again later", "error");
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
            swal.fire("Unable to upload selected file", err.message, "error");
            this.isUploading = false;
            this.notesFile = null;
          });
      } else {
        swal.fire("No file selected", "Please select a file", "error");
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
          swal.fire("Notes successfully uploaded.");
        })
        .catch(err => {
          this.isUploading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire(err.message, "Try again later", "error");
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
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load the module", "Try again later", "error");
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
              swal.fire("The student has not taken this test yet", "", "warning");
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
            swal.fire(err.response.data, "Try again later", "error");
          } else {
            swal.fire("Unable to load the questionaire", "Try again later", "error");
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
          swal.fire("Success", "Announcement successfully sent.", "success");
        })
        .catch(err => {
          this.isUploading = false;
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "Try again later", "error");
          } else {
            swal.fire("Unable to load the questionaire", "Try again later", "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

