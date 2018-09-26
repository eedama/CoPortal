<template>
  <div>
    <div class="row">
      <div class="col s8 offset-s2">
        <md-button v-on:click="$router.back()" class="right">
          <md-icon>keyboard_backspace</md-icon>
          <span>Back</span>
        </md-button>
      </div>
    </div>
    <div class="row">
      <div class="col s10 offset-s1 m8 offset-m3 l6 offset-l3">
        <div class="input-field col s8 offset-s2 m6 offset-m3 text-center">
          <input v-on:keypress.enter="DeepSearch" v-model="txtSearch" id="Password" name="Search" type="search" />
          <label class="text-center" for="Search">Search</label>
        </div>
      </div>
      <div class="col s8 offset-s2 m8 offset-m2 center-align text-center">
        <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
      </div>
    </div>
    <div class="row">
      <div class="col s12 m10 offset-m1" v-for="(module,i) in filteredModules" :key="i">
        <md-card>
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">{{ module.name }}</div>
              <div class="md-subhead">{{ module.code }}</div>
            </md-card-header-text>
  
            <md-menu md-size="big" md-direction="bottom-end">
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>more_vert</md-icon>
              </md-button>
  
              <md-menu-content class="white">
                <md-menu-item>
                  <span>Call</span>
                  <md-icon>phone</md-icon>
                </md-menu-item>
  
                <md-menu-item>
                  <span>Send a message</span>
                  <md-icon>message</md-icon>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-card-header>
  
          <md-card-expand>
            <md-card-content>
              <div class="row">
                <md-list class="col s12 m4 md-double-line" style="border-right:3px solid #eeeeee">
                  <md-list-header><label class="markValue">Tests and Practicals</label></md-list-header>
                  <md-list-item>
                    <div class="md-list-item-text">
                      <label>Total</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">70 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                  <md-list-item class="card-panel pointer  waves-effect" v-for="k in 3" :key="k">
                    <div class="md-list-item-text">
                      <span>Practical test {{k}}  &nbsp;&bull; 03/09/2018</span>
                      <span class="text-center">Position 3</span>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">90 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                </md-list>
                <md-list class="col s12 m4 md-double-line" style="border-right:3px solid #eeeeee">
                  <md-list-header><label class="markValue">Class tests and Homeworks</label></md-list-header>
                  <md-list-item>
                    <div class="md-list-item-text">
                      <label>Total</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">70 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                  <md-list-item class="card-panel pointer  waves-effect" v-for="k in 3" :key="k">
                    <div class="md-list-item-text">
                      <span>Class test {{ k }}  &nbsp;&bull; 03/09/2018</span>
                      <span class="text-center">Position 1</span>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">90 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                </md-list>
                <md-list class="col s12 m4 md-double-line">
                  <md-list-header><label class="markValue">Online tests</label></md-list-header>
                  <md-list-item>
                    <div class="md-list-item-text">
                      <label>Total</label>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">70 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                  <md-list-item class="card-panel pointer  waves-effect" v-for="k in 3" :key="k">
                    <div class="md-list-item-text">
                      <span>Life test  &nbsp;&bull; 03/09/2018</span>
                      <span class="text-center">Position 3</span>
                    </div>
                    <div class="md-list-action">
                      <label class="md-primary"><span class="markValue">90 /</span> <span>100</span></label>
                    </div>
                  </md-list-item>
                </md-list>
              </div>
            </md-card-content>
  
            <md-card-actions md-alignment="space-between">
              <div>
                <md-button>Download</md-button>
                <md-button>Share</md-button>
              </div>
              <md-card-expand-trigger>
                <md-button>Comments</md-button>
              </md-card-expand-trigger>
            </md-card-actions>
            <md-card-expand-content>
              <md-card-content>
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
                        <a v-if="!isLoading" v-on:click="SubmitFeedback" class="btn green waves-effect-effect">Comment</a>
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

export default {
  name: "StidentList",
  data() {
    return {
      txtSearch: "",
      txtError: "",
      module: {
        name: "",
        code: "",
        description: ""
      },
      modules: [],
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
</style>

