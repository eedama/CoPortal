<template>
  <v-row>
<v-col cols="10"> </v-col>
    <v-col cols="2">
      <v-btn
        right
        v-on:click="addingLecturers ? (addingLecturers = false) : $router.back()"
        class="primary justify-end"
      >
        <v-icon>mdi-keyboard-backspace</v-icon>
        <span class="px-2">Back</span>
      </v-btn>
    </v-col>

    <v-col
      sm="12"
      md="4"
      v-offset="4"
      class="mx-auto"
      v-show="!addingLecturers"
    >
      <v-btn
        block
        v-on:click="addingLecturers = !addingLecturers"
        class="secondary"
        >Add new lecturer</v-btn
      >
    </v-col>
  
    <v-col cols="12" sm="12" md="6" class="mx-auto" v-if="addingLecturers">
       <v-card color="secondary">
        <v-row>
          <v-col cols="10">
            <v-card-title class="headline text-white"
              >Adding lecturer</v-card-title
            >
            <v-card-text
              ><span class="text-white"
                >The lecturer will be able to access the mobile app and this
                portal</span
              ></v-card-text
            >
          </v-col>
          <v-col class="m-auto my-auto" cols="2">
            <v-btn icon v-on:click="addingLecturers = false" right class="right">
              <v-icon style="color:ghostwhite">mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
      <add-lecturer v-on:submitted="AddedNewLecturer"></add-lecturer>
    </v-col>
    <v-col cols="12">
    <v-row v-show="!addingLecturers" class="row">
      <v-dialog 
          class="card"
          max-width="600"
          v-if="lecturerModule"
          color="white"
           :v-active.sync="lecturerModule._id != null">
        <v-dialog-title>Adding modules for {{ lecturerModule.username }}</v-dialog-title>
  
        <v-dialog-content>
          <div class="row" :key="i" v-for="(m,i) in lecturerModule.modules.length">
            <div class="col s10">
              <v-field>
                <label :for="`mmodules-${i}`">Module {{ m }}</label>
                <v-select v-model="lecturerModule.modules[i]" :name="`mmodules-${i}`" :id="`mmodules-${i}`">
                  <v-option :disabled="lecturerModule.modules.filter(sm => sm == _module._id).length > 0" v-for="_module in modules" :value="_module._id" :key="_module._id">{{ _module.name }} ({{ _module.code }})</v-option>
                </v-select>
              </v-field>
            </div>
            <div class="col s2 bottom-align">
              <a v-on:click="lecturerModule.modules.push(null)" v-show="i == (lecturerModule.modules.length - 1) && lecturerModule.modules[i] != null" class="btn btn-floating waves-effect"><i class="material-icons">add</i></a>
              <a v-on:click="lecturerModule.modules.splice(i,1)" v-show="i != (lecturerModule.modules.length - 1)" class="btn btn-floating red waves-effect"><i class="material-icons">close</i></a>
            </div>
          </div>
        </v-dialog-content>
        <v-dialog-actions>
          <v-btn class="v-primary" @click="AddNewModule(null)">Close</v-btn>
          <v-btn v-if="!isLoading" class="v-primary" @click="AddNewModule('submit')">Save Changes</v-btn>
          <div class="row">
            <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
              <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
            </div>
          </div>
        </v-dialog-actions>
      </v-dialog>
      <v-dialog class="card" style="position:absolute" :v-active.sync="showEditProfile">
        <v-dialog-actions>
          <v-btn class="v-icon-button right" @click="activeEditProfile(null)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-dialog-actions>
        <div style="overflow-y:scroll;overflow-x:hidden" class="col m8 offset-m2 col s12 center-align">
          <div class="card-content row">
            <div class="row">
              <div class="col s12 center-align">
                <h5>Editting {{lecturer.firstname}} {{lecturer.lastname}}'s profile</h5>
              </div>
              <div class="input-field col s10 offset-s1 m8 offset-m2 text-center">
                <input v-model="lecturer.firstname" id="Firstname" name="Firstname" type="text" />
                <label class="text-center" for="Firstname">Firstname</label>
              </div>
              <div class="input-field col s10 offset-s1 m8 offset-m2 text-center">
                <input v-model="lecturer.lastname" id="Lastname" name="Lastname" type="text" />
                <label class="text-center" for="Lastname">Lastname</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s10 offset-s1 m8 offset-m2 text-center">
                <input v-model="lecturer.username" id="Username" name="Username" type="text" />
                <label class="text-center" for="Username">Username</label>
              </div>
            </div>
  
            <div class="row">
              <div class="col s10 offset-s1 m8 offset-m2">
                <v-field>
                  <label>ID Number</label>
                  <v-input v-model="lecturer.idNumber" maxlength="13"></v-input>
                </v-field>
              </div>
            </div>
  
            <div class="row" v-show="lecturer.idNumber.length > 6">
              <div class="col s10 offset-s1 m8 offset-m2">
                <label>
                                                {{ lecturer.isSouthAfrican ? 'South African Citizen' : 'Non-South African Citizen' }}
                                          </label>
              </div>
              <div class="col s10 offset-s1 m8 offset-m2">
                <v-field>
                  <label for="Gender">Gender</label>
                  <v-select v-model="lecturer.gender" name="Gender" id="Gender">
                    <v-option disabled>Pick a gender</v-option>
                    <v-option value="Male">Male</v-option>
                    <v-option value="Female">Female</v-option>
                  </v-select>
                </v-field>
              </div>
              <div class="col s10 offset-s1 m8 offset-m2">
                <v-datepicker v-immediately v-model="lecturer.dob">
                  <label>Date of birth</label>
                </v-datepicker>
              </div>
            </div>
  
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
          </div>
        </div>
        <v-dialog-actions>
          <v-btn class="red" @click="activeEditProfile(null)">
            Cancel
          </v-btn>
          <v-btn v-if="!isLoading" v-on:click="UpdateLecturer()" class="right">
            Save changes
          </v-btn>
          <div class="row">
            <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
              <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
            </div>
          </div>
  
        </v-dialog-actions>
      </v-dialog>
  
     <v-col cols="12" sm="12" md="8" offset-md="2">
          <v-text-field
            class="text-center mx-auto text-xs-center"
            color="secondary"
            label="Search"
            solo
            block
            prepend-inner-icon="mdi-magnify"
            v-model="txtSearch"
          >
          </v-text-field>
          <p
            v-show="filteredLecturers.length == 0 && !isLoading"
            class="text-center ma-5 red-text"
          >
            No results found
          </p>
        </v-col>
      <v-col
          cols="12"
          :sm="isFullscreen == null ? 6 : 8"
          :md="isFullscreen == null ? 4 : 6"
          :lg="isFullscreen == null ? 3 : 6"
          class="mx-auto" 
          v-show="isFullscreen == null || isFullscreen == lecturer._id"
          v-for="(lecturer,i) in filteredLecturers" 
          :key="i + lecturer._id"
        >
          <v-card>

            <v-card-header>
               <v-list-item>
      <v-list-item-avatar color="grey"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">{{ lecturer.lastname }} {{ lecturer.firstname }}</v-list-item-title>
        <v-list-item-subtitle>Lecturers {{ lecturer.modules.length }} {{ lecturer.modules.length == 1 ? 'module' : 'modules' }}</v-list-item-subtitle>
      </v-list-item-content>

          <v-list-item-action>  
            <v-btn
                  v-on:click="
                    isFullscreen == lecturer._id
                      ? (isFullscreen = null)
                      : (isFullscreen = lecturer._id)
                  "
                  icon
                  class="v-icon-button waves-effect"
                >
                  <v-icon>{{
                    isFullscreen == lecturer._id ? "mdi-close" : "mdi-fullscreen"
                  }}</v-icon>
                </v-btn>
          </v-list-item-action>
    </v-list-item>
            </v-card-header>

            <v-tabs grow>
              <v-tab>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-account-card-details-outline</v-icon>
                  </template>
                  <span>Details</span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-library-books</v-icon>
                  </template>
                  <span>Modules</span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">mdi-settings</v-icon>
                  </template>
                  <span>Settings</span>
                </v-tooltip>
              </v-tab>
              <v-tab-item>
                <v-list class="v-double-line">
                   <v-list-item class="waves-effect">
                    <v-list-item-avatar>
                      <v-icon>mdi-account</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Fullname</v-list-item-title>
                      <v-list-item-subtitle>{{
                        lecturer.firstname
                      }} {{ lecturer.lastname }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="waves-effect">
                    <v-list-item-avatar>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Username</v-list-item-title>
                      <v-list-item-subtitle>{{
                        lecturer.username
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="UpdateLecturer.idNumber" class="waves-effect">
                    <v-list-item-avatar>
                      <v-icon>mdi-account-circle</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>ID number</v-list-item-title>
                      <v-list-item-subtitle>{{
                        lecturer.idNumber
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item v-if="lecturer.gender" class="waves-effect">
                    <v-list-item-avatar>
                      <v-icon>mdi-gender-male-female</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Gender</v-list-item-title>
                      <v-list-item-subtitle>{{
                        lecturer.gender
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-if="lecturer.isSouthAfrican != null"
                    class="waves-effect"
                  >
                    <v-list-item-avatar>
                      <v-icon>mdi-flag</v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Nationality</v-list-item-title>
                      <v-list-item-subtitle>{{
                        lecturer.isSouthAfrican
                          ? "South African"
                          : "Non South African"
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-tab-item>
              <v-tab-item>
                <v-row class="pa-2">
                  <v-col
                    v-for="modul in lecturer.modules"
                    :key="modul._id"
                    class="shrink"
                  >
                    <v-chip
                      :disabled="isLoading"
                      close
                      @click:close="modul.removed = true"
                      @click="!modul.removed ? goToModule(modul._id) : null"
                      ><span>{{ modul.name }} {{ modul.code }}</span>
                    </v-chip>
                    <v-btn
                      v-if="!isLoading"
                      :loading="isLoading"
                      v-show="modul.removed"
                      v-on:click="DeleteModule(lecturer._id, modul._id)"
                      color="primary"
                    >
                      Confirm
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-list-item
                      v-on:click="AddNewModule(lecturer)"
                      class="waves-effect"
                    >
                      <v-icon class="v-primary">mdi-plus</v-icon>
                      <div class="v-list-item-text">
                        <span>Add new Module</span>
                        <span></span>
                      </div>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item>
                <v-list>
                  <v-subheader></v-subheader>

                  <v-list-item
                    v-on:click="lecturer.removed = !lecturer.removed"
                    class="waves-effect"
                  >
                    <v-icon class="v-primary">mdi-delete</v-icon>
                    <div class="v-list-item-text">
                      <span>{{
                        lecturer.removed ? "Are you sure?" : "Delete"
                      }}</span>
                    </div>

                    <v-btn
                      v-if="!isLoading"
                      v-show="lecturer.removed"
                      v-on:click="DeleteLecturer(lecturer._id)"
                      class="v-icon-button v-list-action"
                    >
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                    <div v-show="lecturer.removed" class="row">
                      <div
                        class="col s8 offset-s2 m8 offset-m2 center-align text-center"
                      >
                        <ball-pulse-loader
                          v-if="isLoading"
                          color="#000000"
                          size="20px"
                        ></ball-pulse-loader>
                      </div>
                    </div>
                    <v-btn
                      v-show="lecturer.removed"
                      class="v-icon-button v-list-action"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-tab-item>
            </v-tabs>
          </v-card>
      </v-col>
    </v-row>
    </v-col>
  </v-row>
</template>

<script>
import swal from "sweetalert2";
import * as moment from "moment";

const axios = require("axios");

import AddLecturer from "./AddLecturer";

export default {
  name: "LecturerList",
  data() {
    return {
      lecturerModule: {
        _id: null,
        username: "",
        modules: [null],
        oldModules: []
      },
      txtSearch: "",
      options: [],
      searchText: "", // If value is falsy, reset searchText & searchItem
      items: [],
      lastSelectItem: {},
      // Add lecturer staff
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
      addingLecturers: false,
      //
      txtSearch: "",
      lecturers: [],
      modules: [],
      showEditProfile: false,
      isFullscreen: null,
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
  props: ["lecturerIDs"],
  components: {
    AddLecturer
  },
  computed: {
    filteredLecturers() {
      return this.lecturers.filter(
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
    Reload() {
      this.isLoading = true;
      if (this.lecturerIDs != null) {
        axios
          .get(
            this.$store.state.settings.baseLink +
              "/l/lecturers/of/ids/" +
              this.lecturerIDs
          )
          .then(results => {
            this.isLoading = false;
            this.lecturers = results.data;
            if (this.lecturers.length == 1) {
              this.isFullscreen = this.lecturers[0]._id;
            }
            // this.filteredLecturers = results.data;
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal.fire(err.response.data, "error");
            } else {
              swal.fire("Unable to load lecturers", "Try again later", "error");
            }
          });
      } else {
        axios
          .get(this.$store.state.settings.baseLink + "/l/lecturers/all")
          .then(results => {
            this.isLoading = false;
            this.lecturers = results.data;
            // this.filteredLecturers = results.data;
          })
          .catch(err => {
            this.isLoading = false;
            if (err.response != null && err.response.status == 512) {
              swal.fire(err.response.data, "error");
            } else {
              swal.fire("Unable to load lecturers", "Try again later", "error");
            }
          });
      }
      this.LoadModules();
    },
    AddedNewLecturer(isAdded) {
      if (isAdded) {
        this.Reload();
      } else {
      }
    },
    AddNewModule(lecturer) {
      if (lecturer == null) {
        this.lecturerModule._id = null;
        this.lecturerModule.username = "";
        this.lecturerModule.modules = [null];
        this.lecturerModule.oldModules = null;
      } else if (lecturer == "submit") {
        this.isLoading = true;
        var newModules = this.lecturerModule.modules.filter(
          s =>
            s != null &&
            this.lecturerModule.oldModules.filter(om => om._id == s).length == 0
        );

        if (newModules == 0) {
          swal.fire(
            "No change made",
            "Lecturer is already assigned to the selected modules",
            "success"
          );
        } else {
          axios
            .post(
              this.$store.state.settings.baseLink +
                "/m/assign/to/lecturer/" +
                this.lecturerModule._id,
              {
                modules: newModules
              }
            )
            .then(result => {
              this.isLoading = false;
              var names = this.modules.filter(
                m => newModules.filter(nm => nm == m._id).length > 0
              );
              var stu = this.lecturers.find(
                s => s._id == this.lecturerModule._id
              );
              names.forEach(name => {
                stu.modules.push(name);
              });

              swal.fire(
                "Modules successfully assigned",
                `${newModules.length} new modules are now assigned to ${
                  this.lecturerModule.username
                }`,
                "success"
              );
              this.AddNewModule(null);
            })
            .catch(err => {
              this.isLoading = false;
              if (err.response != null && err.response.status == 512) {
                swal.fire(err.response.data, "error");
              } else {
                swal.fire("Unable to load lecturers", err.message, "error");
              }
            });
        }
      } else {
        this.lecturerModule._id = lecturer._id;
        this.lecturerModule.username = lecturer.username;
        this.lecturerModule.oldModules = lecturer.modules;
      }
    },
    activeEditProfile(lecturer) {
      if (lecturer != null) {
        this.lecturer = lecturer;
      } else {
        this.lecturer = {
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
    onSelect(items, lastSelectItem) {
      this.items = items;
      this.lastSelectItem = lastSelectItem;
    },
    // deselect option
    reset() {
      this.items = []; // reset
    },
    // select option from parent component
    selectOption() {
      // this.items = _.unionWith(this.items, [this.options[0]], _.isEqual);
    },
    DeleteLecturer(lecturerID) {
      this.isLoading = true;
      axios
        .post(this.$store.state.settings.baseLink + "/l/delete/" + lecturerID)
        .then(result => {
          this.isLoading = false;
          var victim = this.lecturers.find(l => l._id == lecturerID);
          var index = this.lecturers.indexOf(victim);
          this.lecturers.splice(index, 1);
          swal.fire(
            "Lecturer was removed from the system",
            "To recover the lecturer you can contact admin",
            "success"
          );
        })
        .catch(err => {
          this.isLoading = false;
          swal.fire("An error has occurred", err.message, "error");
        });
    },
    DeleteModule(lecturerID, moduleID) {
      axios
        .post(
          this.$store.state.settings.baseLink +
            "/m/unassign/module/" +
            moduleID +
            "/from/lecturer/" +
            lecturerID
        )
        .then(result => {
          var victim = this.lecturers.find(l => l._id == lecturerID);
          var index = victim.modules.indexOf(
            victim.modules.find(m => m._id == moduleID)
          );
          if (index >= 0) {
            this.lecturers[this.lecturers.indexOf(victim)].modules.splice(
              index,
              1
            );
          }
          swal.fire(
            "Module was unassigned successfully",
            "You can reassign the link again",
            "success"
          );
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load lecturers", err.message, "error");
          }
        });
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
            swal.fire(err.response.data, "error");
          } else {
            swal.fire("Unable to load modules", "Try again later", "error");
          }
        });
    },
    UpdateLecturer() {
      this.isLoading = true;
      this.txtError = "";
      if (this.lecturer.lastname.length < 2) {
        this.txtError = "Please enter a valid lastname";
      }

      if (this.lecturer.firstname.length < 2) {
        this.txtError = "Please enter a valid firstname";
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

      if (this.txtError.length > 2) {
        this.isLoading = false;
        return;
      }

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/a/update/lecturer/" +
            this.lecturer._id,
          {
            lecturer: this.lecturer
          }
        )
        .then(results => {
          this.isLoading = false;
          this.lecturers = results.data;
          this.lecturer = {
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
          this.activeEditProfile(null);

          swal.fire("Profile successfully updated", "success");
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal.fire("Unable to submit the lecturer", err.message, "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

