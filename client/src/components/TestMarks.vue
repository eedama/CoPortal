<template>
  <div class="screen">
    <v-row>
      <v-col cols="10"> </v-col>
      <v-col cols="2">
        <v-btn right v-on:click="$router.back()" class="primary justify-end">
          <v-icon>mdi-keyboard-backspace</v-icon>
          <span class="px-2">Back</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="6" lg="6" xlg="6" class="mx-auto">
        <v-card :loading="isLoading" class="pa-3">
          <v-card-header class="text-center">
            <div class="display-2 py-2">
              {{
                Solution.isMemo
                  ? "Memorandum"
                  : Solution.studentId.firstname +
                    " " +
                    Solution.studentId.lastname
              }}
            </div>
            <div
              class="title"
              :class="
                Solution.mark * 2 < Solution.answers.length
                  ? 'text-peach'
                  : 'text-blue'
              "
            >
              {{
                Solution.isMemo
                  ? `Total marks : ${Solution.answers.length}`
                  : `Your mark is ${Solution.mark} out of ${Solution.answers.length}`
              }}
            </div>
          </v-card-header>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
        xlg="4"
        class="mx-auto my-3 text-center"
      >
        <v-badge
          class="mx-2"
          bordered
          color="secondary"
          icon="mdi-download"
          overlap
        >
          <v-btn
            class="white--text"
            color="secondary"
            v-on:click="DownloadMarks"
            depressed
          >
            Download
          </v-btn>
        </v-badge>
        <v-badge
          class="mx-2"
          bordered
          color="secondary"
          icon="mdi-file-document-box-check-outline"
          overlap
        >
          <v-btn
            class="white--text"
            color="secondary"
            v-on:click="ViewMemorandum"
            depressed
          >
            Memorandum
          </v-btn>
        </v-badge>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="12" md="8" lg="6" xlg="6" class="mx-auto">
        <v-tabs v-model="tabSolutionFeedback" grow centered icons-and-text>
          <v-tab>
            Solution
            <v-icon>mdi-file-document-box-check-outline</v-icon>
          </v-tab>

          <v-tab @click="refreshFeedbacks()">
            Feedback
            <v-icon>mdi-message-text</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabSolutionFeedback">
          <v-tab-item>
            <v-row class="mx-auto">
              <v-col
                cols="12"
                sm="12"
                v-for="(solution, i) in Solution.answers"
                :key="i"
              >
                <v-card class="col m8 offset-m2 row card-panel hoverable">
                  <v-card-title class="title px-4">
                    {{ solution.question.title }}
                  </v-card-title>
                  <v-card-text class="px-2">
                    <v-radio-group v-model="solution.answer" column>
                      <v-radio
                        v-for="(answer, j) in solution.question.answers"
                        :key="j"
                        :disabled="solution.answer != answer"
                        :value="answer"
                        :label="answer"
                      ></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="12" md="8" lg="8" xlg="8" class="mx-auto">
                <v-btn
                  block
                  color="primary"
                  v-on:click="$router.push('/')"
                  class="btn red"
                >
                  Go home
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
          <v-tab-item>
            <v-row class="mx-auto">
              <v-col cols="12">
                <v-spacer></v-spacer>
                <v-btn
                  :loading="isLoading"
                  :disabled="isLoading"
                  large
                  icon
                  class="float-right ma-2"
                  v-on:click="refreshFeedbacks"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" class="row">
                <v-row class="mx-4">
                  <v-col
                    cols="12"
                    :class="{
                      'float-right': feedback.from.id != $store.state.user.id
                    }"
                    v-for="(feedback, i) in feedbacks"
                    :key="i"
                  >
                    <v-card
                      :loading="feedback.status != 'sent'"
                      :shaped="feedback.from.id != $store.state.user.id"
                      :outlined="feedback.from.id == $store.state.user.id"
                      :class="{
                        'float-right': feedback.from.type == 'STUDENT'
                      }"
                      class="mx-auto "
                    >
                      <v-list-item two-line>
                        <v-list-item-avatar color="grey"></v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title
                            class="subtitle-2"
                            :class="
                              feedback.from.type == 'STUDENT'
                                ? 'text-peach'
                                : 'text-blue'
                            "
                            >{{ feedback.from.name }}</v-list-item-title
                          >
                          <p class="subtitle-1">{{ feedback.message }}</p>
                          <v-list-item-subtitle class="caption float-right">{{
                            feedback.status != "sent"
                              ? feedback.status
                              : getMoment(feedback.date).fromNow()
                          }}</v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12" class="col s10 switch">
                <v-switch
                  v-model="autoRefreshChats"
                  @click="toggleAutoRefresh"
                  inset
                  :label="
                    `
                ${
                  autoRefreshChats
                    ? 'Auto refreshing every 5 seconds'
                    : 'Auto refresh is off, Use the refresh icon to get the latest messages'
                }`
                  "
                ></v-switch>
              </v-col>
              <v-col class="my-auto" cols="11">
                <v-text-field
                  class="my-auto"
                  prepend-inner-icon="mdi-chat"
                  append-outer-icon="mdi-send"
                  :loading="isLoading"
                  @click:append-outer="SubmitFeedback"
                  label="Comment"
                  outlined
                  v-model="txtFeedback"
                  @keyup.enter="SubmitFeedback"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
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
      tabSolutionFeedback: null,
      txtFeedback: "",
      currentPage: 0,
      Solution: [],
      feedbacks: [],
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
        if (this.Solution == null || this.Solution.answers == null) {
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
      this.refreshFeedbacks();
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
