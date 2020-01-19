<template>
  <div class="screen">
    <v-row>
      <v-col cols="10"></v-col>
      <v-col cols="2">
        <v-btn right v-on:click="$router.back()" class="primary justify-end">
          <v-icon>mdi-keyboard-backspace</v-icon>
          <span class="px-2">Back</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-content v-if="Questionaire" class="mt-5 pt-5">
      <v-row class="mx-auto mt-5 pt-5">
        <v-col cols="12" sm="12" md="8" lg="8" xlg="8" class="mx-auto">
          <p
            v-if="currentPage < Questionaire.questions.length"
            class="text-center title"
          >
            Question <strong>{{ currentPage + 1 }}</strong> of
            <strong>{{ Questionaire.questions.length }}</strong>
          </p>
          <p
            class="text-center title"
            v-if="currentPage == Questionaire.questions.length"
          >
            Verfiy your answers and submit
          </p>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="8"
          class="mx-auto my-auto"
          v-for="(question, i) in Questionaire.questions"
          v-show="
            currentPage == i || currentPage == Questionaire.questions.length
          "
          :key="i"
        >
          <v-card
            :loading="isLoading"
            class="col m8 offset-m2 row card-panel hoverable"
          >
            <v-card-title class="display-1 px-4">
              {{ question.title }}
            </v-card-title>
            <v-card-text class="px-2">
              <v-radio-group v-model="solutions[i]" column>
                <v-radio
                  v-for="(answer, j) in question.answers"
                  :key="j"
                  :disabled="timeUp"
                  :value="answer"
                  :label="answer"
                ></v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col
          md="8"
          v-if="timeRemaining && totalTimeLimit"
          class="mx-auto my-auto"
          cols="12"
        >
          <v-progress-linear
            :value="(timeRemaining / totalTimeLimit) * 100"
          ></v-progress-linear>
          <p class="text-center subtitle-1">
            {{
              timeRemaining == null
                ? `No time limit`
                : timeRemaining == 0
                ? "You ran out of time"
                : `${timeRemainingString}`
            }}
          </p>
        </v-col>
        <v-col cols="12" sm="12" md="8" lg="8" xlg="8" class="mx-auto">
          <p class="center-align red-text" v-show="txtError.length > 2">
            {{ txtError }}
          </p>
        </v-col>
        <v-col cols="12" sm="12" md="8" lg="8" xlg="8" class="mx-auto">
          <v-row>
            <v-col cols="12" sm="12" md="4" class="mx-auto">
              <v-btn
                class="red float-right"
                large
                v-if="
                  currentPage > 0 && currentPage < Questionaire.questions.length
                "
                v-on:click="changePage(false)"
                >Previous</v-btn
              >
            </v-col>
            <v-col cols="12" sm="12" md="4" class="mx-auto">
              <v-btn
                class="secondary"
                large
                block
                v-if="currentPage < Questionaire.questions.length"
                v-on:click="changePage(true)"
                >Next</v-btn
              >
            </v-col>
            <v-col
              cols="12"
              sm="12"
              class="mx-auto"
              v-if="currentPage == Questionaire.questions.length && !isLoading"
            >
              <v-btn
                :loading="isLoading"
                color="secondary"
                large
                block
                v-on:click="SubmitQuiz()"
                >Submit</v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-content>
  </div>
</template>

<script>
import swal from "sweetalert2";
const axios = require("axios");

export default {
  name: "Test",
  data() {
    return {
      currentPage: 0,
      solutions: [],
      Questionaire: null,
      txtError: "",
      isLoading: false,
      timeRemaining: null,
      totalTimeLimit: null,
      timeRemainingString: "",
      timeUp: false,
      submitted: false,
      timer: null,
      isLoading: false
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timeUp = true;
  },
  mounted() {
    if (
      this.dbQuestionaire == null ||
      this.dbQuestionaire.questions == null ||
      this.dbQuestionaire.questions.length <= 0
    ) {
      this.$router.push("/");
      return;
    }
    this.solutions = this.dbQuestionaire.questions.map(q => null);

    if (
      this.dbQuestionaire.timeLimit &&
      this.dbQuestionaire.timeLimit.split(" ").length == 2 &&
      !isNaN(this.dbQuestionaire.timeLimit.split(" ")[0])
    ) {
      const timeLimit = Number(this.dbQuestionaire.timeLimit.split(" ")[0]);
      switch (this.dbQuestionaire.timeLimit.split(" ")[1]) {
        case "minute":
        case "minutes":
          this.timeRemaining = timeLimit * 60;
          break;
        case "hour":
        case "hours":
          this.timeRemaining = timeLimit * 60 * 60;
          break;
        default:
          this.timeRemaining = null;
          break;
      }
    } else {
      this.timeRemaining = null;
    }

    this.Questionaire = this.dbQuestionaire;
    this.totalTimeLimit = this.timeRemaining;
    if (this.timeRemaining != null) {
      this.startTimer();
    }
  },
  props: ["dbQuestionaire", "isMemo"],
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        this.timeRemaining -= 1;
        if (this.timeRemaining > 60) {
          this.timeRemainingString =
            Math.round(this.timeRemaining / 60) + " minutes remaining";
        } else {
          this.timeRemainingString = this.timeRemaining + " seconds remaining";
        }

        if (
          this.timeRemaining == 5 * 60 ||
          this.timeRemaining == 15 * 60 ||
          this.timeRemaining == 30 * 60
        ) {
          swal.fire(
            "You have " + this.timeRemainingString,
            "Hurry up!",
            "info"
          );
        }

        if (this.timeRemaining <= 0) {
          clearInterval(this.timer);
          this.timeUp = true;
          this.currentPage = this.Questionaire.questions.length;
          this.SubmitQuiz();
          swal.fire(
            "Your time is up",
            "You can only submit your results",
            "error"
          );
        }
      }, 1000);
    },
    changePage(isForward) {
      this.txtError = "";
      isForward ? this.currentPage++ : this.currentPage--;
    },
    async SubmitQuiz() {
      this.isLoading = true;
      this.txtError = "";
      var hasError = false;
      if (!this.timeUp) {
        this.solutions.map((s, i) => {
          if (s == null) {
            hasError = true;
            this.txtError = "Please provide an answer to this question";
            this.currentPage = i;
          }
        });

        const proceedSubmit = await swal.fire({
          title: "Submit?",
          text: "Are you sure you want to submit?",
          icon: "warning",
          buttons: [true, "Yes"]
        });

        if (!proceedSubmit || hasError) {
          this.isLoading = false;
          return;
        }
      }

      var solution = {
        id: this.Questionaire._id,
        isMemo: this.isMemo,
        answers: []
      };
      this.solutions.forEach((v, i) => {
        solution.answers.push({
          answer: v,
          question: this.Questionaire.questions[i]
        });
      });
      console.log("About to submit.....", solution);

      axios
        .post(this.$store.state.settings.baseLink + "/l/submit/questionaire", {
          studentId: this.$store.state.user.id,
          solution: solution
        })
        .then(results => {
          this.isLoading = false;
          swal.fire("Submitted!", {
            icon: "success"
          });
          this.$router.push({
            name: "TestMarks",
            params: {
              solutionId: results.data._id
            }
          });
        })
        .catch(err => {
          this.isLoading = false;
          swal.fire("Unable to submit", err.message, "error");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
