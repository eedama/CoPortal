<template>
  <div class="row">
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
    <div class="col s12 center-align card-panel row">
      <div class="col s12 m8 offset-m2">
        <h4>
          <a>{{ Solution.isMemo ? 'Memorandum' : Solution.studentId.firstname + " " + Solution.studentId.lastname}}</a>
        </h4>
        <h5>
          Your score is
          <a
            :class="{'red-text':(Solution.mark*2 < Solution.answers.length)}"
          >{{ Solution.mark }}/{{ Solution.answers.length }}</a>
        </h5>
      </div>
      <div class="col s12 right-align">
        <a class="btn-floating black waves-effect" title="Download" v-on:click="DownloadMarks">
          <i class="material-icons">save</i>
        </a>
        <a class="btn-floating black waves-effect" title="Memorandum" v-on:click="ViewMemorandum">
          <i class="material-icons">description</i>
        </a>
        <a
          class="btn-floating black waves-effect"
          :class="{'transparent':addingFeedBack}"
          v-on:click="openCloseFeedbacks"
          title="Feed back"
        >
          <i :class="{'black-text':addingFeedBack}" class="material-icons">chat</i>
        </a>
      </div>
      <div class="col s12 m8 offset-m2">
        <span
          class="blue-text"
        >Scroll down to see {{ addingFeedBack ?'add your feedback' : 'view your test'}}.</span>
      </div>
    </div>
    <div v-show="addingFeedBack" class="col s12 row card-panel">
      <div class="col s12 right-align">
        <a
          class="btn-floating transparent waves-effect right-align"
          v-on:click="addingFeedBack = !addingFeedBack"
        >
          <i class="material-icons red-text">close</i>
        </a>
      </div>
      <div class="row">
        <div
          class="col s10 offset-s1 chat"
          :class="{'right-align':feedback.from.id == $store.state.user.id}"
          v-for="(feedback,i) in feedbacks"
          :key="i"
        >
          <span
            class="chip message"
            :class="{'notSent':feedback.status != 'sent','black white-text':feedback.from.type != 'STUDENT'}"
          >
            <span
              class="from"
              :class="{'white-text':feedback.from.type != 'STUDENT'}"
            >{{ feedback.from.name }}</span>
            : {{ feedback.message }}
          </span>
          <p
            class="time"
          >{{ feedback.status != 'sent' ? feedback.status : getMoment(feedback.date).fromNow() }}</p>
        </div>
      </div>
      <div class="col s10 switch">
        <label>
          <input v-on:change="toggleAutoRefresh" v-model="autoRefreshChats" type="checkbox" />
          <span class="lever"></span>
          {{ autoRefreshChats ? 'Auto refreshing every 5 seconds' : 'Auto refresh is off, Use the button on the right to get the latest messages' }}
        </label>
      </div>
      <div class="col s2 right-align">
        <a
          v-if="!isLoading"
          class="btn-floating transparent waves-effect right-align"
          v-on:click="refreshFeedbacks"
        >
          <i class="material-icons black-text">refresh</i>
        </a>
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
            <a
              v-if="!isLoading"
              v-on:click="SubmitFeedback"
              class="btn green waves-effect-effect"
            >Comment</a>
            <ball-pulse-loader v-if="isLoading" color="#000000" size="20px"></ball-pulse-loader>
          </div>
        </div>
      </form>
    </div>
    <div v-show="!addingFeedBack" class="col s10 offset-s1">
      <div v-for="(solution,i) in Solution.answers" :key="i" class="row">
        <div class="col m8 offset-m2 row card-panel hoverable">
          <div class="col s12">
            <h5 class="center-align">{{ solution.question.title }}</h5>
          </div>
          <div class="col m8 offset-m2 s12">
            <form>
              <h6 class="pointer" v-for="(answer,j) in solution.question.answers" :key="j">
                <label>
                  <input
                    :disabled="solution.answer != answer"
                    :checked="solution.answer == answer"
                    :id="answer + '-' + j"
                    class="with-gap"
                    :name="solution._id"
                    type="radio"
                  />
                  <span :for="answer + '-' + j">{{ answer }}</span>
                </label>
              </h6>
            </form>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s8 offset-s2 center-align">
          <button v-on:click="$router.push('/')" class="btn red">Go home</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert2";
import * as moment from "moment";
const axios = require("axios");

export default {
  name: "TestMarks",
  data() {
    return {
      txtFeedback: "",
      currentPage: 0,
      Solution: [],
      feedbacks: [],
      addingFeedBack: false,
      autoRefreshChats: false,
      refreshTimer: "",
      isLoading: false
    };
  },
  computed: {},
  mounted() {
    if (this.solutionId == null) {
      this.$router.push("/");
      return;
    }
    this.isLoading = true;
    axios
      .get(
        this.$store.state.settings.baseLink +
          "/l/get/solutions/" +
          this.solutionId
      )
      .then(results => {
        this.isLoading = false;
        if (results == null) {
          this.$router.push("/");
          return;
        }
        this.Solution = results.data;
        if (
          this.Solution == null ||
          this.Solution.answers == null ||
          this.Solution.answers.length < 1
        ) {
          throw new Error("Unable to retreive the solution , try again later");
        }
      })
      .catch(err => {
        this.isLoading = false;
        swal.fire("Unable to load your results", err.message, "error");
        this.$router.push("/");
        return;
      });
  },
  props: ["solutionId"],
  methods: {
    toggleAutoRefresh() {
      if (this.autoRefreshChats) {
        this.refreshTimer = setInterval(this.refreshFeedbacks, 5000);
      } else {
        clearInterval(this.refreshTimer);
      }
    },
    getMoment(value) {
      return moment(value);
    },
    DownloadMarks() {
      window.print();
    },
    ViewMemorandum() {
      swal.fire(
        "Memorandum not yet avaliable",
        "Not all students have wrote the test",
        "error"
      );
    },
    refreshFeedbacks() {
      this.isLoading = true;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/l/feedback/reload/" +
            this.Solution.questionaireId
        )
        .then(results => {
          this.isLoading = false;
          this.feedbacks = [];
          results.data.forEach(element => {
            this.feedbacks.push(element);
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.feedbacks.map(o => {
            if (o.status != "sent") {
              o.status = "not sent";
            }
          });
          swal.fire("Unable to submit questionaire", err.message, "error");
        });
    },
    openCloseFeedbacks() {
      this.addingFeedBack = !this.addingFeedBack;
      if (this.addingFeedBack) {
        this.refreshFeedbacks();
      }
    },
    SubmitFeedback() {
      this.isLoading = true;
      if (!this.$store.state.user.isLoggedIn) {
        swal.fire(
          "Unable to send",
          "Your session is over please log in again",
          "error"
        );
        this.isLoading = false;
        return;
      }
      if (this.txtFeedback.length < 1) {
        this.isLoading = false;
        return;
      }
      var feedback = {
        from: this.$store.state.user.username,
        message: this.txtFeedback,
        date: new Date(),
        status: "sending...."
      };
      if (this.$store.state.user.isParent) {
        feedback.from = `${
          feedback.from
        }'s (${this.$store.state.user.parent.relationship.toLowerCase()})`;
      }
      this.feedbacks.push(feedback);
      this.txtFeedback = "";

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/l/feedback/submit/" +
            this.Solution.questionaireId,
          {
            fromId: this.$store.state.user.id,
            from: feedback.from,
            fromType: this.$store.state.user.type,
            message: feedback.message,
            date: feedback.date,
            existingId: this.feedbacks.map(m => m._id)
          }
        )
        .then(results => {
          this.isLoading = false;
          this.feedbacks = [];
          results.data.forEach(element => {
            this.feedbacks.push(element);
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.feedbacks.map(o => {
            if (o.status != "sent") {
              o.status = "not sent";
            }
          });
          swal.fire("Unable to submit questionaire", err.message, "error");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chip {
  height: inherit;
}

.chat {
  padding-top: 10px;
}

.chat .from {
  cursor: pointer;
  color: grey;
  margin-bottom: 0%;
  font-size: smaller;
}

.chat .time {
  margin-top: 0%;
  font-size: smaller;
}

.chat .notSent {
  border: 1px solid red;
}
</style>
