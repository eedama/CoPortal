<template>
  <div>
    <div class="row">
      <div class="col s8 offset-s2 center-align">
        <a v-on:click="addingLecturers = !addingLecturers" :class="{'red':addingLecturers}" class="btn waves-effect">{{ !addingLecturers ? 'Add Lecturer' : 'Cancel'}}</a>
      </div>
    </div>
    <div v-if="addingLecturers" class="row" style="height:80vh">
      <div class="col m8 offset-m2 col s12 center-align">
        <div class="card row">
          <div class="card-content">
            <div class="row">
              <div class="col s12 center-align">
                <h5>Adding a lecturer</h5>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="lecturer.firstname" id="Firstname" name="Firstname" type="text" />
                <label class="text-center" for="Firstname">Firstname</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="lecturer.lastname" id="Lastname" name="Lastname" type="text" />
                <label class="text-center" for="Lastname">Lastname</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
                <input v-model="lecturer.username" id="Username" name="Username" type="text" />
                <label class="text-center" for="Username">Username</label>
              </div>
            </div>
            <div class="row" :key="m" v-for="(m,i) in lecturer.modules.length">
              <div class="col s10">
                <md-field>
                  <label :for="`modules-${i}`">Module {{ m }}</label>
                  <md-select v-model="lecturer.modules[i]" :name="`modules-${i}`" :id="`modules-${i}`">
                    <md-option v-for="module in modules" :value="module._id" :key="module._id">{{ module.name }} ({{ module.code }})</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="col s2 bottom-align">
                <a v-on:click="lecturer.modules.push(null)" v-if="i == (lecturer.modules.length - 1) && lecturer.modules[i] != null" class="btn btn-floating waves-effect"><i class="material-icons">add</i></a>
                <a v-on:click="lecturer.modules.splice(i,1)" v-if="i != (lecturer.modules.length - 1)" class="btn btn-floating red waves-effect"><i class="material-icons">close</i></a>
              </div>
            </div>
  
            <div class="row">
              <div class="col s12">
                <md-field>
                  <label>ID Number</label>
                  <md-input v-model="lecturer.idNumber" maxlength="13"></md-input>
                </md-field>
              </div>
            </div>
  
            <div class="row" v-show="lecturer.idNumber.length > 6">
              <div class="row">
                <div class="col s12">
                  <label>
                                {{ lecturer.isSouthAfrican ? 'South African Citizen' : 'Non-South African Citizen' }}
                          </label>
                </div>
              </div>
              <div class="col s12">
                <md-field>
                  <label for="Gender">Gender</label>
                  <md-select v-model="lecturer.gender" name="Gender" id="Gender">
                    <md-option disabled>Pick a gender</md-option>
                    <md-option value="Male">Male</md-option>
                    <md-option value="Female">Female</md-option>
                  </md-select>
                </md-field>
              </div>
              <div class="col s12">
                <md-datepicker md-immediately v-model="lecturer.dob">
                  <label>Date of birth</label>
                </md-datepicker>
              </div>
            </div>
  
            <div class="row">
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="lecturer.password" id="Password" name="Password" type="password" />
                <label class="text-center" for="Password">Password</label>
              </div>
              <div class="input-field col m4 offset-m1 s12 text-center">
                <input v-model="lecturer.confirmPassword" id="ConfirmPassword" name="ConfirmPassword" type="password" />
                <label class="text-center" for="ConfirmPassword">Confirm Password</label>
              </div>
            </div>
            <div class="row" v-show="txtError.length > 0">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <label class="text-center red-text">{{ txtError }}</label>
              </div>
            </div>
            <div class="row">
              <div class="col s8 offset-s2 m6 offset-m3 text-center">
                <input v-on:click="SubmitLecturer()" type="submit" value="Submit lecturer" class="btn center-align tg-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!addingLecturers" class="row">
  
      <div class="row">
        <div class="col s8 offset-s2 input-field">
          <input v-on:keypress.enter="DeepSearch" v-model="txtSearch" id="Password" name="Search" type="search" />
          <label class="center-align" for="Search">Search....</label>
        </div>
      </div>
      <div v-if="lecturer != null" v-for="(lecturer,i) in filteredLecturers" :key="i + lecturer._id" class="col s12 m6 l4 xl3 pointer">
        <div class="col s12">
          <md-card>
            <md-card-header>
              <div class="md-title">{{ lecturer.lastname }} {{ lecturer.firstname}}</div>
              <div class="md-subhead">
                <p v-for="m in lecturer.modules" :key="m._id"><a class="waves-effect">{{ m.name }} ( {{ m.code }} )</a></p>
              </div>
            </md-card-header>
  
            <md-card-expand>
              <md-card-actions md-alignment="space-between">
                <div>
                  <md-button>Edit Profile</md-button>
                </div>
  
                <md-card-expand-trigger>
                  <md-button class="md-icon-button">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </md-button>
                </md-card-expand-trigger>
              </md-card-actions>
  
              <md-card-expand-content>
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
  
                    <md-list-item v-on:click="lecturer.removed = !lecturer.removed" class="waves-effect">
                      <md-icon class="md-primary">delete</md-icon>
                      <div class="md-list-item-text">
                        <span>{{ lecturer.removed ? 'Are you sure?':'Delete' }}</span>
                      </div>
  
                      <md-button v-show="lecturer.removed" v-on:click="DeleteLecturer(lecturer._id)" class="md-icon-button md-list-action">
                        <md-icon>done</md-icon>
                      </md-button>

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

export default {
  name: "LecturerList",
  data() {
    return {
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
      modules: []
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
  computed: {
    filteredLecturers() {
      return this.lecturers.filter(
        l =>
          this.txtSearch.length < 2 ||
          JSON.stringify(l)
            .toLowerCase()
            .indexOf(this.txtSearch.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    axios
      .get(this.$store.state.settings.baseLink + "/l/lecturers/all")
      .then(results => {
        this.lecturers = results.data;
        // this.filteredLecturers = results.data;
      })
      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load lecturers", "Try again later", "error");
        }
      });

    this.LoadModules();
  },
  methods: {
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
      axios
        .post(this.$store.state.settings.baseLink + "/l/delete/" + lecturerID)
        .then(result => {
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
          swal("An error has occurred", err.message, "error");
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
    SubmitLecturer() {
      this.txtError = "";
      if (this.lecturer.lastname.length < 2) {
        this.txtError = "Please enter a valid lastname";
      }

      if (this.lecturer.firstname.length < 2) {
        this.txtError = "Please enter a valid firstname";
      }

      if (this.lecturer.password != this.lecturer.confirmPassword) {
        this.txtError = "Passwords do not match";
      }

      if (this.lecturer.password.length < 6) {
        this.txtError =
          "Please enter a valid password , passwords must be more than 6 charactors long";
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

      if (this.lecturer.modules.filter(m => m != null).length <= 0) {
        this.txtError = "Please select at least one module";
      }

      if (this.txtError.length > 2) return;

      axios
        .post(this.$store.state.settings.baseLink + "/a/add/lecturer", {
          lecturer: this.lecturer
        })
        .then(results => {
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
          this.addingLecturers = false;
        })
        .catch(err => {
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
/* COLORS
                                                            ========================================== */

/* MIXINS
                                                            ========================================== */

/* RESET
                                                            ========================================== */

.contact *,
.contact *:before,
.contact *:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* CONTACT
                                                            ========================================== */

.contact-area {
  width: 100%;
  position: relative;
}

.contact {
  position: relative;
  max-width: 420px;
  padding: 40px 20px;
  overflow: hidden;
  margin: 0 auto;
}

.contact main {
  float: left;
  width: 100%;
  position: relative;
}

.contact main section {
  border-radius: 5px;
  float: left;
  width: 100%;
  background-color: black;
}

.contact main section .content {
  float: left;
  width: 100%;
  padding: 20px 30px 50px 30px;
  position: relative;
  text-align: center;
}

@media (min-width: 414px) {
  .contact main section .content {
    text-align: left;
  }
}

.contact main section .content img {
  display: inline-block;
  width: 140px;
  border-radius: 50%;
}

@media (min-width: 414px) {
  .contact main section .content img {
    float: left;
    width: 30%;
    margin-right: 10%;
  }
}

.contact main section .content aside {
  float: left;
  width: 100%;
  color: white;
  margin-top: 10px;
}

@media (min-width: 414px) {
  .contact main section .content aside {
    width: 60%;
  }
}

.contact main section .content aside h1 {
  color: white;
  font-size: 26px;
  margin-bottom: 10px;
}

.contact main section .content aside p {
  font-size: 14px;
  font-weight: 10;
  letter-spacing: 0.5px;
  line-height: 160%;
}

.contact main .title {
  float: left;
  width: 100%;
  background-color: #c63535;
  max-height: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  -webkit-transition: all 0.55s;
  -moz-transition: all 0.55s;
  -o-transition: all 0.55s;
  transition: all 0.55s;
}

.contact main .title.active {
  max-height: 100px;
  -webkit-transition: all 1.3s;
  -moz-transition: all 1.3s;
  -o-transition: all 1.3s;
  transition: all 1.3s;
}

.contact main .title.active p {
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
  transform: scale(1);
  transition-delay: 0.2s;
}

.contact main .title p {
  padding: 15px 30px;
  color: white;
  font-size: 16px;
  display: inline-block;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  -webkit-transform: scale(0);
  -moz-transform: scale(0);
  -ms-transform: scale(0);
  -o-transform: scale(0);
  transform: scale(0);
}

.contact main button {
  position: absolute;
  bottom: 0;
  right: 50%;
  background-color: white;
  color: black;
  border: 0;
  width: 200px;
  height: 48px;
  text-align: center;
  border-radius: 30px;
  font-size: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: -24px;
  margin-right: -100px;
  -webkit-transition: all 0.4s;
  -moz-transition: all 0.4s;
  -o-transition: all 0.4s;
  transition: all 0.4s;
  transition-delay: 0.1s;
  outline: none;
  overflow: hidden;
  z-index: 10;
  font-family: inherit;
}

.contact main button span {
  opacity: 1;
  -webkit-transition: opacity 0.2s;
  -moz-transition: opacity 0.2s;
  -o-transition: opacity 0.2s;
  transition: opacity 0.2s;
  transition-delay: 0.4s;
  display: block;
  width: 200px;
  float: left;
  padding: 15px 0px;
}

.contact main button svg {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  opacity: 0;
  -webkit-transition: all 0.4s;
  -moz-transition: all 0.4s;
  -o-transition: all 0.4s;
  transition: all 0.4s;
}

.contact main button svg path {
  fill: black;
}

.contact main button.active {
  margin-right: 0;
  right: 20px;
  width: 65px;
  height: 65px;
  margin-bottom: -32.5px;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  border-radius: 65px;
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
}

.contact main button.active span {
  opacity: 0;
  transition-delay: 0s;
  width: 200px;
}

.contact main button.active svg {
  opacity: 1;
  transition-delay: 0.5s;
}

.contact nav {
  float: left;
  width: 100%;
  height: 0px;
  display: block;
  overflow: hidden;
  max-height: 0px;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.contact nav.active {
  height: 100%;
  max-height: 600px;
  -webkit-transition: all 1s;
  -moz-transition: all 1s;
  -o-transition: all 1s;
  transition: all 1s;
}

.contact nav.active a {
  opacity: 1;
  -webkit-transform: translateY(0px);
  -moz-transform: translateY(0px);
  -ms-transform: translateY(0px);
  -o-transform: translateY(0px);
  transform: translateY(0px);
  -webkit-transition: all 0.7s;
  -moz-transition: all 0.7s;
  -o-transition: all 0.7s;
  transition: all 0.7s;
}

.contact nav.active a:nth-of-type(1) {
  transition-delay: 0.5s;
}

.contact nav.active a:nth-of-type(2) {
  transition-delay: 0.7s;
}

.contact nav.active a:nth-of-type(3) {
  transition-delay: 0.9s;
}

.contact nav a {
  float: left;
  width: 100%;
  margin-top: 18px;
  background-color: #ffffff;
  padding: 18px 20px;
  border-radius: 5px;
  text-decoration: none;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
  opacity: 0;
  -webkit-transform: translateY(-10px);
  -moz-transform: translateY(-10px);
  -ms-transform: translateY(-10px);
  -o-transform: translateY(-10px);
  transform: translateY(-10px);
  position: relative;
}

@media (min-width: 414px) {
  .contact nav a {
    padding: 18px 30px;
  }
}

.contact nav a .arrow {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
}

.contact nav a .arrow path {
  fill: #e6e6e6;
}

.contact nav a.gmail .content h1 {
  color: #d14836;
}

.contact nav a.facebook .content h1 {
  color: #3b5998;
}

.contact nav a.twitter .content h1 {
  color: #1da1f2;
}

.contact nav a .content h1 {
  font-size: 20px;
  font-weight: 400;
  line-height: 160%;
  letter-spacing: 0.4px;
}

.contact nav a .content span {
  font-size: 14px;
  color: #b3b3b3;
  display: block;
  letter-spacing: 0.4px;
}
</style>

