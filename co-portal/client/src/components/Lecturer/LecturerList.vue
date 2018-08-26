<template>
  <div>
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="addingLecturers ? addingLecturers = false : $router.back()" class="right">
          <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
  
    <div v-show="!addingLecturers" class="row">
      <div class="col s8 offset-s2 center-align">
        <a v-on:click="addingLecturers = !addingLecturers" class="btn waves-effect">Add Lecturer</a>
      </div>
    </div>
    <div v-show="addingLecturers" class="row" style="height:80vh">
      <div class="col s12 m8 offset-m2 l6 offset-l3">
        <add-lecturer v-on:submitted="AddedNewLecturer"></add-lecturer>
      </div>
    </div>
    <div v-show="!addingLecturers" class="row">
      <md-dialog class="card" style="position:absolute" :md-active.sync="lecturerModule._id != null">
        <md-dialog-title>Adding modules for {{ lecturerModule.username }}</md-dialog-title>
  
        <md-dialog-content>
          <div class="row" :key="i" v-for="(m,i) in lecturerModule.modules.length">
            <div class="col s10">
              <md-field>
                <label :for="`mmodules-${i}`">Module {{ m }}</label>
                <md-select v-model="lecturerModule.modules[i]" :name="`mmodules-${i}`" :id="`mmodules-${i}`">
                  <md-option :disabled="lecturerModule.modules.filter(sm => sm == _module._id).length > 0" v-for="_module in modules" :value="_module._id" :key="_module._id">{{ _module.name }} ({{ _module.code }})</md-option>
                </md-select>
              </md-field>
            </div>
            <div class="col s2 bottom-align">
              <a v-on:click="lecturerModule.modules.push(null)" v-show="i == (lecturerModule.modules.length - 1) && lecturerModule.modules[i] != null" class="btn btn-floating waves-effect"><i class="material-icons">add</i></a>
              <a v-on:click="lecturerModule.modules.splice(i,1)" v-show="i != (lecturerModule.modules.length - 1)" class="btn btn-floating red waves-effect"><i class="material-icons">close</i></a>
            </div>
          </div>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="AddNewModule(null)">Close</md-button>
          <md-button v-if="!isLoading" class="md-primary" @click="AddNewModule('submit')">Save Changes</md-button>
          <div class="row">
            <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
              <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
            </div>
          </div>
        </md-dialog-actions>
      </md-dialog>
      <md-dialog class="card" style="position:absolute" :md-active.sync="showEditProfile">
        <md-dialog-actions>
          <md-button class="md-icon-button right" @click="activeEditProfile(null)">
            <md-icon>close</md-icon>
          </md-button>
        </md-dialog-actions>
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
                <md-field>
                  <label>ID Number</label>
                  <md-input v-model="lecturer.idNumber" maxlength="13"></md-input>
                </md-field>
              </div>
            </div>
  
            <div class="row" v-show="lecturer.idNumber.length > 6">
              <div class="col s10 offset-s1 m8 offset-m2">
                <label>
                                                {{ lecturer.isSouthAfrican ? 'South African Citizen' : 'Non-South African Citizen' }}
                                          </label>
              </div>
              <div class="col s10 offset-s1 m8 offset-m2">
                <md-field>
                  <label for="Gender">Gender</label>
                  <md-select v-model="lecturer.gender" name="Gender" id="Gender">
                    <md-option disabled>Pick a gender</md-option>
                    <md-option value="Male">Male</md-option>
                    <md-option value="Female">Female</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="col s10 offset-s1 m8 offset-m2">
                <md-datepicker md-immediately v-model="lecturer.dob">
                  <label>Date of birth</label>
                </md-datepicker>
              </div>
            </div>
  
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
          </div>
        </div>
        <md-dialog-actions>
          <md-button class="red" @click="activeEditProfile(null)">
            Cancel
          </md-button>
          <md-button v-if="!isLoading" v-on:click="UpdateLecturer()" class="right">
            Save changes
          </md-button>
          <div class="row">
            <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
              <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
            </div>
          </div>
  
        </md-dialog-actions>
      </md-dialog>
  
      <div class="row">
        <div class="col s8 offset-s2 input-field">
          <input v-on:keypress.enter="DeepSearch" v-model="txtSearch" id="Password" name="Search" type="search" />
          <label class="center-align" for="Search">Search....</label>
        </div>
        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
        </div>
      </div>
      <div v-show="filteredLecturers.length == 0 && !isLoading" class="col s12 center-align">
        <p class="red-text">No results found</p>
      </div>
      <div v-show="isFullscreen == null || isFullscreen == lecturer._id" v-for="(lecturer,i) in filteredLecturers" :key="i + lecturer._id" :class="{'s10 offset-s1 m8 offset-m2 l6 offset-l3':isFullscreen == lecturer._id,'m6 l4 xl3':isFullscreen == null,'hidden':isFullscreen != lecturer._id}"
        class="col">
        <div class="col s12">
          <md-card class="hoverable">
            <md-card-header>
              <md-card-header-text>
                <div class="md-title">{{ lecturer.lastname }} {{ lecturer.firstname}}</div>
                <div class="md-subhead">Lecturers {{ lecturer.modules.length }} {{ lecturer.modules.length == 1 ? 'module' : 'modules' }}</div>
  
              </md-card-header-text>
              <md-menu md-size="big" md-direction="bottom-end">
                <md-button v-on:click=" isFullscreen == lecturer._id ? isFullscreen = null : isFullscreen = lecturer._id" class="md-icon-button waves-effect">
                  <md-icon>{{ isFullscreen == lecturer._id ? 'close' : 'fullscreen'}}</md-icon>
                </md-button>
              </md-menu>
            </md-card-header>
  
            <md-card-content>
              <md-list class="md-double-line">
                <md-list-item v-if="lecturer.idNumber" class="waves-effect">
                  <md-icon class="md-primary">account_circle</md-icon>
                  <div class="md-list-item-text">
                    <span>{{ lecturer.idNumber }}</span>
                    <span>ID number</span>
                  </div>
                </md-list-item>
                <md-list-item v-if="lecturer.dob" class="waves-effect">
                  <md-icon class="md-primary">cake</md-icon>
                  <div class="md-list-item-text">
                    <span>{{ getMoment(lecturer.dob).format('YYYY-MM-DD') }}</span>
                    <span>Date of birth</span>
                  </div>
                </md-list-item>
                <md-list-item v-if="lecturer.gender" class="waves-effect">
                  <md-icon class="md-primary">wc</md-icon>
                  <div class="md-list-item-text">
                    <span>{{ lecturer.gender }}</span>
                    <span>Gender</span>
                  </div>
                </md-list-item>
  
                <md-list-item v-if="lecturer.isSouthAfrican != null" class="waves-effect">
                  <md-icon class="md-primary">flag</md-icon>
                  <div class="md-list-item-text">
                    <span>{{ lecturer.isSouthAfrican ? "South African" : "Non South African" }}</span>
                    <span>Nationality</span>
                  </div>
                </md-list-item>
  
              </md-list>
            </md-card-content>
  
            <md-card-expand>
              <md-card-actions md-alignment="space-between">
                <div>
                  <md-button v-on:click="activeEditProfile(lecturer)">
                    <md-icon>account_circle</md-icon> {{ lecturer.username }}</md-button>
  
                </div>
  
                <div>
                </div>
                <md-card-expand-trigger>
                  <md-button class="md-icon-button">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </md-button>
                </md-card-expand-trigger>
              </md-card-actions>
  
              <md-card-expand-content>
                <md-card-content>
                  <md-subheader>Modules</md-subheader>
  
                  <md-list>
                    <md-list-item v-for="modul in lecturer.modules" :key="modul._id" :class="{'waves-effect':!modul.removed}">
                      <md-icon class="md-primary">book</md-icon>
                      <div v-on:click="!modul.removed ? goToModule(modul._id) : null" class="md-list-item-text">
                        <span>{{ modul.name }}</span>
                        <span>{{ modul.removed ? 'Unassign ' + modul.code : modul.code }}</span>
                      </div>
                      <md-button style="z-index:10" v-show="!modul.removed" v-on:click="modul.removed = true" class="md-icon-button md-list-action">
                        <md-icon>delete</md-icon>
                      </md-button>
                      <md-button style="z-index:10" v-show="modul.removed" v-on:click="DeleteModule(lecturer._id,modul._id)" class="md-icon-button md-list-action">
                        <md-icon>done</md-icon>
                      </md-button>
                      <div v-show="modul.removed" class="row">
                        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
                          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
                        </div>
                      </div>
                      <md-button style="z-index:10" v-show="modul.removed" v-on:click="modul.removed = false" class="md-icon-button md-list-action">
                        <md-icon>close</md-icon>
                      </md-button>
                    </md-list-item>
                    <md-list-item v-on:click="AddNewModule(lecturer)" class="waves-effect">
                      <md-icon class="md-primary">add</md-icon>
                      <div class="md-list-item-text">
                        <span>Add new Module</span>
                        <span></span>
                      </div>
                    </md-list-item>
                    <md-divider></md-divider>
  
                    <md-subheader>Lecturer settings</md-subheader>
  
                    <md-list-item v-on:click="lecturer.removed = !lecturer.removed" class="waves-effect">
                      <md-icon class="md-primary">delete</md-icon>
                      <div class="md-list-item-text">
                        <span>{{ lecturer.removed ? 'Are you sure?':'Delete lecturer' }}</span>
                      </div>
  
                      <md-button v-show="lecturer.removed" v-on:click="DeleteLecturer(lecturer._id)" class="md-icon-button md-list-action">
                        <md-icon>done</md-icon>
                      </md-button>
                      <div v-show="lecturer.removed" class="row">
                        <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
                          <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
                        </div>
                      </div>
  
                      <md-button v-show="lecturer.removed" class="md-icon-button md-list-action">
                        <md-icon>close</md-icon>
                      </md-button>
                    </md-list-item>
                  </md-list>
                </md-card-content>
              </md-card-expand-content>
            </md-card-expand>
          </md-card>
        </div>
        <div v-if="false" class="contact">
          <main>
            <section>
              <div class="content">
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/256492/_mLIxaKY_400x400.jpg" alt="Profile Image">
  
                <aside>
                  <h1 class="white-text valign-wrapper"></h1>
                </aside>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import * as moment from "moment";

const axios = require("axios");

import "vue-material/dist/vue-material.min.css";
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
              swal(err.response.data, "error");
            } else {
              swal("Unable to load lecturers", "Try again later", "error");
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
              swal(err.response.data, "error");
            } else {
              swal("Unable to load lecturers", "Try again later", "error");
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
          swal(
            "No change made",
            "Student is already assigned to the selected modules",
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

              swal(
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
                swal(err.response.data, "error");
              } else {
                swal("Unable to load lecturers", err.message, "error");
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
          swal(
            "Lecturer was removed from the system",
            "To recover the lecturer you can contact admin",
            "success"
          );
        })
        .catch(err => {
          this.isLoading = false;
          swal("An error has occurred", err.message, "error");
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
          swal(
            "Module was unassigned successfully",
            "You can reassign the link again",
            "success"
          );
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to load lecturers", err.message, "error");
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
            swal(err.response.data, "error");
          } else {
            swal("Unable to load modules", "Try again later", "error");
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

          swal("Profile successfully updated", "success");
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal("Unable to submit the lecturer", err.message, "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

