<template>
  <div class="row">
    <div class="col s10 offset-s1">
      <div v-if="currentPage == i" v-for="(question,i) in Questionaire.questions" :key="i" class="row">
        <div class="col s10 offset-s1 row card-panel">
          <div class="col s12">
            <h5 class="center-align">{{ question.title }}</h5>
          </div>
          <div class="col m8 offset-m2 s12">
            <form>
              <h6 class="pointer" v-for="(answer,j) in question.answers" :key="j">
                <label>
                    <input v-model="solutions[i]" :value="answer" :id="answer + '-' + j" class="with-gap" :name="question.id" type="radio"/>
                    <span :for="answer + '-' + j">{{ answer }}</span>
                  </label>
              </h6>
            </form>
          </div>
          <div class="col m8 offset-m2 s12">
            <p class="center-align red-text" v-show="txtError.length > 2">{{ txtError }}</p>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s3">
          <p>{{currentPage + 1}}/{{ Questionaire.questions.length }}</p>
        </div>
  
        <div class="col s9 right-align">
          <button class="btn red" v-if="currentPage > 0" v-on:click="changePage(false)">Previous</button>
          <button class="btn" v-if="(currentPage+ 1) < Questionaire.questions.length" v-on:click="changePage(true)">Next</button>
          <button class="btn green" v-if="(currentPage+1) == Questionaire.questions.length" v-on:click="SubmitQuiz()">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
const axios = require("axios");

export default {
  name: "Test",
  data() {
    return {
      currentPage: 0,
      solutions: [],
      Questionaire: null,
      txtError: ""
    };
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
    this.solutions = [];
    this.dbQuestionaire.questions.map(q => {
      this.solutions.push(null);
    });

    this.Questionaire = this.dbQuestionaire;
  },
  props: ["dbQuestionaire", "isMemo"],
  methods: {
    changePage(isForward) {
      this.txtError = "";
      isForward ? this.currentPage++ : this.currentPage--;
    },
    SubmitQuiz() {
      this.txtError = "";
      var hasError = false;
      this.solutions.map((s, i) => {
        if (s == null) {
          hasError = true;
          this.txtError = "Please provide an answer to this question";
          this.currentPage = i;
        }
      });
      if (hasError) return;

      swal({
        title: "Submit?",
        text: "Are you sure you want to submit?",
        icon: "warning",
        buttons: [true, "Yes"]
      }).then(proceedSubmit => {
        if (proceedSubmit) {
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

          axios
            .post(
              this.$store.state.settings.baseLink + "/l/submit/questionaire",
              {
                studentId: this.$store.state.user.id,
                solution: solution
              }
            )
            .then(results => {
              swal("Submitted!", {
                icon: "success"
              });
              this.$router.push({
                name: "TestMarks",
                params: { solutionId: results.data._id }
              });
            })
            .catch(err => {
              swal("Unable to submit", err.message, "error");
            });
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
