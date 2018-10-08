<template>
  <div class="screen">
    <div class="row">
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
      <div class="col s2 m3 row">
        <div class="col s12 center">
          <md-subheader><label class="markValue">Modules</label></md-subheader>
        </div>
        <div class="col s12 pointer center-align waves-effect" v-on:click="selectedModuleIndex = i" v-for="(module,i) in filteredModules" :key="i">
          <div class="hoverable card-panel" :class="{'black':selectedModuleIndex==i}">
            <h6 class="center-align">
              <span>{{ module.name }} 
                    <br /><label class="center-align">{{ module.code }}</label></span></h6>
          </div>
        </div>
      </div>
      <div class="col s10 m9 row center-align">
        <md-card class="white col s12 m10 offset-m1 center">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ currentModule.name }}</div>
              <div class="md-subhead">{{ currentModule.code }}</div>
            </md-card-header-text>
            <md-menu md-size="big" md-direction="bottom-end">
              <md-button class="md-icon-button">
                <md-icon>more_vert</md-icon>
              </md-button>
            </md-menu>
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
                      <div v-on:click="SearchForMarkSheetId(sheet.id)" class="card-panel center-align pointer waves-effect">{{ sheet.id }} - {{ sheet.title }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="markSheetId != null" class="col s12 row">
  
                  <div class="col s12">
                    <md-button v-on:click="markSheetId = null" class="right md-icon-button">
                      <md-icon>close</md-icon>
                    </md-button>
                  </div>
  
                  <div>
                    <h6 class="md-title center-align text-xs-center">Mark sheet : <a>{{ markSheetId }}</a></h6>
                  </div>
  
                  <md-table class="col s12" v-model="searched" md-sort="name" md-sort-order="asc" md-fixed-header>
                    <md-table-toolbar>
                      <md-field md-clearable class="md-toolbar-section-end">
                        <md-input placeholder="Search by name..." v-model="search" @input="searchOnTable" />
                      </md-field>
                    </md-table-toolbar>
  
                    <md-table-empty-state md-label="No users found" :md-description="`No record found for student with the name '${search}' . Try a different search term or create a new record.`">
                    </md-table-empty-state>
  
                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                      <md-table-cell md-label="ID number" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
                      <md-table-cell md-label="Full Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                      <md-table-cell v-show="!item.editting" md-label="Mark" md-sort-by="id">{{ item.mark }}</md-table-cell>
                      <md-table-cell v-show="item.editting" md-label="Mark">
                        <md-input v-model="item.mark" placeholder="mark obtained"></md-input>
                      </md-table-cell>
                      <md-table-cell md-label="Actions">
                        <div>
                          <md-button v-on:click="item.editting = false" v-show="item.editting" class="md-icon-button md-mini">
                            <md-icon>done</md-icon>
                          </md-button>
                          <md-button v-on:click="item.editting = true" v-show="!item.editting" class="md-icon-button md-mini">
                            <md-icon>edit</md-icon>
                          </md-button>
                        </div>
                      </md-table-cell>
                    </md-table-row>
                  </md-table>
                  <md-card-actions>
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
      users: [
        {
          id: 1,
          name: "Shawna Dubbin",
          editting: false,
          mark: 90,
          title: "Assistant Media Planner"
        },
        {
          id: 2,
          name: "Odette Demageard",
          editting: false,
          mark: 90,
          title: "Account Coordinator"
        },
        {
          id: 3,
          name: "Vera Taleworth",
          editting: false,
          mark: 90,
          title: "Community Outreach Specialist"
        },
        {
          id: 4,
          name: "Lonnie Izkovitz",
          editting: false,
          mark: 90,
          title: "Operator"
        },
        {
          id: 5,
          name: "Thatcher Stave",
          editting: false,
          mark: 90,
          title: "Software Test Engineer III"
        },
        {
          id: 6,
          name: "Karim Chipping",
          editting: false,
          mark: 90,
          title: "Safety Technician II"
        },
        {
          id: 7,
          name: "Helge Holyard",
          editting: false,
          mark: 90,
          title: "Internal Auditor"
        },
        {
          id: 8,
          name: "Rod Titterton",
          editting: false,
          mark: 90,
          title: "Technical Writer"
        },
        {
          id: 9,
          name: "Gawen Applewhite",
          editting: false,
          mark: 90,
          title: "GIS Technical Architect"
        },
        {
          id: 10,
          name: "Nero Mulgrew",
          editting: false,
          mark: 90,
          title: "Staff Scientist"
        },
        {
          id: 11,
          name: "Cybill Rimington",
          editting: false,
          mark: 90,
          title: "Assistant Professor"
        },
        {
          id: 12,
          name: "Maureene Eggleson",
          editting: false,
          mark: 90,
          title: "Recruiting Manager"
        },
        {
          id: 13,
          name: "Cortney Caulket",
          editting: false,
          mark: 90,
          title: "Safety Technician IV"
        },
        {
          id: 14,
          name: "Selig Swynfen",
          editting: false,
          mark: 90,
          title: "Environmental Specialist"
        },
        {
          id: 15,
          name: "Ingar Raggles",
          editting: false,
          mark: 90,
          title: "VP Sales"
        },
        {
          id: 16,
          name: "Karmen Mines",
          editting: false,
          mark: 90,
          title: "Administrative Officer"
        },
        {
          id: 17,
          name: "Salome Judron",
          editting: false,
          mark: 90,
          title: "Staff Scientist"
        },
        {
          id: 18,
          name: "Clarinda Marieton",
          editting: false,
          mark: 90,
          title: "Paralegal"
        },
        {
          id: 19,
          name: "Paxon Lotterington",
          editting: false,
          mark: 90,
          title: "Marketing Assistant"
        },
        {
          id: 20,
          name: "Maura Thoms",
          editting: false,
          mark: 90,
          title: "Actuary"
        }
      ],
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
    this.searchOnTable();
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
      })
      .catch(err => {
        this.isLoading = false;
        if (err.response != null && err.response.status == 512) {
          swal(err.response.data, "error");
        } else {
          swal("Unable to load modules", "Try again later", "error");
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
    SearchForMarkSheetId(value) {
      this.markSheetId = this.txtSearchSheet = value;
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

