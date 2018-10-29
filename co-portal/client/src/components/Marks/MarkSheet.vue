<template>
  <div class="screen">
    <div  v-show="!printing" class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="$router.back()" class="right">
          <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
    <div class="row">
      <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
      </div>
    </div>
    <div class="row">
      <div v-show="!printing" class="col s2 m3 row">
        <div class="col s12 center">
          <md-subheader><label class="markValue">Modules</label></md-subheader>
        </div>
        <div class="col s12 pointer center-align waves-effect" v-on:click="SwitchModule(i)" v-for="(module,i) in filteredModules" :key="i">
          <div class="hoverable card-panel" :class="{'black':selectedModuleIndex==i}">
            <h6 class="center-align">
              <span>{{ module.name }} 
                            <br /><label class="center-align">{{ module.code }}</label></span></h6>
          </div>
        </div>
      </div>
      <div :class="{'s12 m12':printing}" class="col s10 m9 row center-align">
        <md-card class="white col s12 m10 offset-m1 center">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ currentModule.name }}</div>
              <div class="md-subhead">{{ currentModule.code }}</div>
            </md-card-header-text>
          </md-card-header>
          <md-card-expand>
            <md-card-content>
              <div v-if="markSheetId == null" class="row">
                <div class="col s12">
                  <md-tabs md-alignment="fixed">
                    <md-tab :id="`tab-${i}`" :class="{'md-active':selectedMarkSheetAction == i}" v-on:click="selectedMarkSheetAction = i" v-for="(sheetAction,i) in sheetActions" :key="i" :md-label="sheetAction"></md-tab>
                  </md-tabs>
                </div>
              </div>
              <div class="row" v-if="selectedMarkSheetAction == 0">
                <div v-if="markSheetId == null" class="col s10 offset-s1 m8 offset-m3 l6 offset-l3">
                  <md-field>
                    <md-icon>search</md-icon>
                    <label>Marksheet search....</label>
                    <md-input type="search" v-model="txtSearchSheet"></md-input>
                  </md-field>
                  <div class="row">
                    <div class="col s12">
                      <p>Pick a marksheet to view/update</p>
                    </div>
                    <div class="col s6 m4" v-for="(sheet,i) in filteredSheets.filter(f => txtSearchSheet.length < 2 || JSON.stringify(f).toString().indexOf(txtSearchSheet) >= 0)" :key="i">
                      <div v-on:click="SelectMarkSheetById(sheet)" class="card-panel center-align pointer waves-effect">{{ sheet.id }} - {{ sheet.title }}</div>
                    </div>
                  </div>
                </div>
                <div style="overflow-y:visible" v-if="markSheetId != null" class="col s12 row">
  
                  <div  v-show="!printing" class="col s12">
                    <md-button v-on:click="markSheetId = null" class="right md-icon-button">
                      <md-icon>close</md-icon>
                    </md-button>
                  </div>
  
                  <div>
                    <h6 class="md-title center-align text-xs-center">Mark sheet : <a>{{ markSheetId }}</a></h6>
                  </div>
  
                  <md-table class="col s12" v-model="searched" md-sort="name" md-sort-order="asc" md-fixed-header>
                    <md-table-toolbar  v-show="!printing">
                      <md-field md-clearable class="md-toolbar-section-end">
                        <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
                      </md-field>
                      <md-field md-clearable class="md-toolbar-section-end">
                        <md-button v-on:click="PrintMarkSheet" class="md-icon-button"><md-icon>print</md-icon></md-button>
                      </md-field>
                    </md-table-toolbar>
  
                    <md-table-empty-state md-label="No users found" :md-description="`No record found for student with the name '${search}' . Try a different search term or create a new record.`">
                    </md-table-empty-state>
  
                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                      <md-table-cell md-label="Username" md-sort-by="username" md-numeric>{{ item.username }}</md-table-cell>
                      <md-table-cell md-label="Full Name" md-sort-by="lastname + firstname">{{ item.lastname }} {{ item.firstname }}</md-table-cell>
                      <md-table-cell md-label="Gender" md-sort-by="gender">{{ item.gender }}</md-table-cell>
                      <md-table-cell md-label="mark" md-sort-by="mark">
                        <span v-show="!item.editting">{{ item.mark }}</span>
                        <md-input type="number" v-show="item.editting" v-model="item.mark" placeholder="mark obtained"></md-input>
                      </md-table-cell>
                      <md-table-cell v-show="!printing" md-label="Actions">
                        <div>
                          <md-button v-on:click="UpdateMarkFor(item)" v-show="item.editting" class="md-icon-button md-mini">
                            <md-icon>done</md-icon>
                          </md-button>
                          <md-button v-on:click="item.editting = false" v-show="item.editting" class="md-icon-button md-mini">
                            <md-icon>close</md-icon>
                          </md-button>
                          <md-button v-on:click="item.editting = true" v-show="!item.editting" class="md-icon-button md-mini">
                            <md-icon>edit</md-icon>
                          </md-button>
                        </div>
                      </md-table-cell>
                    </md-table-row>
                  </md-table>
                  <md-card-actions v-show="!printing">
                    <md-button class="btn-flat">Save changes</md-button>
                  </md-card-actions>
                </div>
              </div>
              <div v-if="selectedMarkSheetAction == 1" class="row" style="border:3px solid #eeeeee">
                <md-list class="col s12 md-double-line">
                  <md-list-item>
                    <md-field>
                      <md-icon>lock</md-icon>
                      <label>Id</label>
                      <md-input v-model="markSheet.id"></md-input>
                    </md-field>
                  </md-list-item>
                  <md-list-item>
                    <md-field>
                      <md-icon>title</md-icon>
                      <label>Title</label>
                      <md-input v-model="markSheet.title"></md-input>
                    </md-field>
                  </md-list-item>
                  <md-list-item>
                    <md-field class="white">
                      <md-icon>note</md-icon>
                      <label for="movie">Test Type</label>
                      <md-select v-model="markSheet.type" name="movie" id="movie" class="white">
                        <md-option value="PracticalTest">Practical Test</md-option>
                        <md-option value="TheoryTest">Theory Test</md-option>
                        <md-option value="HomeClassTest">Home/class Test</md-option>
                        <md-option value="Exam">Exam</md-option>
                      </md-select>
                    </md-field>
                  </md-list-item>
                  <md-list-item>
                    <md-field class="white">
                      <md-datepicker v-model="markSheet.date" md-immediately>
                        <label>Date</label>
                      </md-datepicker>
                    </md-field>
                  </md-list-item>
                  <md-list-item>
                    <md-field class="col s8 offset-s2 m6 offset-m3 center-align text-center center-align">
                      <p class="red-text">{{ markSheet.error }}</p>
                    </md-field>
                  </md-list-item>
                </md-list>
                <div class="col s8 offset-s2 m6 offset-m3 center-align text-center center-align">
                  <input v-if="!isLoading" v-on:click="CreateMarkSheet" type="submit" value="Save" class="btn black center-align tg-btn" />
                  <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
                </div>
              </div>
            </md-card-content>
            <md-card-expand-content>
              <md-card-content v-if="false">
                <div class="row">
                  <div class="row col s12">
                    <div class="col s10 offset-s1 chat" :class="{'right-align':feedback.from.id == $store.state.user.id}" v-for="(feedback,i) in feedbacks" :key="i">
                      <span class="chip message" :class="{'notSent':feedback.status != 'sent','black white-text':feedback.from.type != 'STUDENT'}">
                                                                           <span class="from" :class="{'white-text':feedback.from.type != 'STUDENT'}">{{ feedback.from.name }}</span> : {{ feedback.message }}
                      </span>
                      <p class="time">{{ feedback.status != 'sent' ? feedback.status : getMoment(feedback.date).fromNow() }}</p>
                    </div>
                  </div>
                  <div class="col s10 switch">
                    <label>
                                                                            <input v-on:change="toggleAutoRefresh" v-model="autoRefreshChats" type="checkbox">
                                                                            <span class="lever"></span>
                                                                            {{ autoRefreshChats ?  'Auto refreshing every 5 seconds' : 'Auto refresh is off, Use the button on the right to get the latest messages' }} 
                                                                          </label>
                  </div>
                  <div class="col s2 right-align">
                    <a v-if="!isLoading" class="btn-floating transparent waves-effect right-align" v-on:click="refreshFeedbacks"><i class="material-icons black-text">refresh</i></a>
                    <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
                  </div>
                  <form class="col s12 center-align">
                    <div class="row">
                      <div class="input-field col s10 offset-s1 m6 offset-m3">
                        <i class="material-icons prefix">chat</i>
                        <textarea v-model="txtFeedback" id="icon_prefix2" class="materialize-textarea"></textarea>
                        <label for="icon_prefix2">Comment</label>
                      </div>
                      <div class="col s8 offset-s2 center-align">
                        <a v-if="!isLoading" class="btn green waves-effect-effect">Comment</a>
                        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
                      </div>
                    </div>
                  </form>
                </div>
              </md-card-content>
            </md-card-expand-content>
          </md-card-expand>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";

const axios = require("axios");
const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.name).includes(toLower(term)));
  }

  return items;
};

export default {
  name: "StidentList",
  data() {
    return {
      printing: false,
      // Create sheet Variables
      markSheet: {
        id: "",
        title: "",
        type: "PracticalTest",
        moduleID: "",
        lecturerID: "",
        error: "",
        date: new Date()
      },
      //End
      search: null,
      searched: [],
      addingRecord: false,
      markSheetIds: [
        214,
        2121,
        312,
        521,
        432,
        4543,
        643,
        6435,
        15,
        2134,
        235,
        346,
        4575,
        46,
        235,
        32532,
        634654,
        865,
        7634,
        4523,
        56236
      ],
      users: [],
      // end
      txtSearch: "",
      txtSearchSheet: "",
      txtError: "",
      module: {
        name: "",
        code: "",
        description: ""
      },
      selectedModuleIndex: 0,
      selectedMarkSheetAction: 0,
      markSheetId: null,
      sheetActions: ["View/Update", "Create new"],
      modules: [],
      sheets: [],
      selectedMarkSheet: null,
      feedbacks: [
        {
          from: "Mr Tshepi",
          message: "You have to improve on your tests",
          date: new Date(),
          status: "sent"
        },
        {
          from: "Student",
          message: "I am trying sir, i study eco everyday",
          date: new Date(),
          fromType: "STUDENT",
          status: "sent"
        }
      ],
      selectedStudent: null,
      isLoading: false
    };
  },
  computed: {
    filteredModules() {
      return this.modules.filter(
        m =>
          this.txtSearch.length < 1 ||
          JSON.stringify(m)
            .toLowerCase()
            .indexOf(this.txtSearch.toLowerCase()) >= 0
      );
    },
    filteredSheets() {
      return this.sheets.filter(
        s => this.currentModule && s.moduleID == this.currentModule["_id"]
      );
    },
    currentModule() {
      if (this.selectedModuleIndex == null) {
        return null;
      }
      return this.filteredModules[this.selectedModuleIndex];
    }
  },
  mounted() {
    this.isLoading = true;
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
        this.modules.map(s => {
          s.show = true;
        });
        this.SwitchModule(0);
      })
      .catch(err => {
        this.isLoading = false;
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load modules", err.message, "error");
        }
      });

    axios
      .get(
        this.$store.state.settings.baseLink +
          "/l/sheet/get/all/for/" +
          this.$store.state.user.id
      )
      .then(sheets => {
        this.sheets = sheets.data;
      })
      .catch(err => {
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load mark sheets", "Try again later", "error");
        }
      });
  },
  methods: {
    PrintMarkSheet() {
      this.printing = true;
      setTimeout(() => {
        window.print();
        this.printing = false;
      }, 100);
    },
    SwitchModule(i) {
      this.selectedModuleIndex = i;
      this.selectedMarkSheet = null;
      this.markSheetId = null;
      this.txtSearchSheet = "";

      axios
        .get(
          this.$store.state.settings.baseLink +
            "/s/students/all/for/module/" +
            this.currentModule["_id"]
        )
        .then(results => {
          results.data.map(u => {
            u.mark = null;
            u.editting = true;
            return u;
          });
          this.users = results.data;
          this.searchOnTable();
        })
        .catch(err => {
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal(
              "Unable load students for " + this.currentModule.name,
              err.message,
              "error"
            );
          }
        });
    },
    UpdateMarkFor(item) {
      if (isNaN(item.mark)) {
        return;
      }

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/l/sheet/update/mark/by/" +
            this.$store.state.user.id,
          {
            markSheetID: this.selectedMarkSheet["_id"],
            studentID: item["_id"],
            mark: item.mark
          }
        )
        .then(results => {
          this.sheets.filter(s => s["_id"] == results.data["_id"]).map(v => {
            return results.data;
          });
          this.SelectMarkSheetById(results.data);
          this.searchOnTable();
        })
        .catch(err => {
          item.editting = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable update marks for student", err.message, "error");
          }
        });
    },
    CreateMarkSheet() {
      this.markSheet.error = "";
      this.isLoading = true;
      if (this.markSheet.id.length < 2) {
        this.markSheet.error = "Marksheet id is too short";
        this.isLoading = false;
        return;
      }

      if (this.markSheet.title.length < 2) {
        this.markSheet.error = "Marksheet title is too short";
        this.isLoading = false;
        return;
      }

      this.markSheet.lecturerID = this.$store.state.user.id;
      this.markSheet.moduleID = this.currentModule["_id"];
      axios
        .post(this.$store.state.settings.baseLink + "/l/sheet/add", {
          markSheet: this.markSheet
        })
        .then(results => {
          this.isLoading = false;
          this.sheets.push(results.data);
          this.selectedMarkSheetAction = 0;
          this.selectedMarkSheet = results.data;
          this.markSheetId = this.txtSearchSheet = results.data.id;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            swal(err.response.data, "error");
          } else {
            swal("Unable to save mark sheet", err.message, "error");
          }
        });
    },
    goToSolution(solutionId) {
      this.$router.push({
        name: "TestMarks",
        params: {
          solutionId: solutionId
        }
      });
    },
    SelectMarkSheetById(value) {
      this.selectedMarkSheet = value;
      this.markSheetId = this.txtSearchSheet = value.id;

      this.users.map(u => {
        var userID = u["_id"];
        var marks = this.selectedMarkSheet.studentMarks.filter(
          s => s.studentID == userID
        );
        if (!marks || marks.length == 0) {
          u.mark = null;
          u.editting = true;
        } else {
          u.mark = marks[0].mark;
          u.editting = false;
        }
        return u;
      });
    },
    searchOnTable() {
      this.searched = searchByName(this.users, this.search);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.markValue {
  font-size: larger;
  font-weight: bold;
}

.screen {
  background-image: url("/static/img/coPortalLogo.jpg");
  /* Full height */
  height: 100vh;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: fit;
}
</style>

