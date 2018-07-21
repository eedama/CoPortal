<template>
  <div class="row">
    <div class="col s12 m8 offset-m2">
      <div v-if="currentPage == i" v-for="(question,i) in Questionaire.questions" :key="i" class="row">
        <div class="col m8 offset-m2 row card-panel">
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
        </div>
      </div>
      <div class="row">
        <div class="col s3">
          <p>{{currentPage + 1}}/{{ Questionaire.questions.length }}</p>
        </div>
  
        <div class="col s9 right-align">
          <button class="btn red" v-if="currentPage > 0 " v-on:click="currentPage--">Previous</button>
          <button class="btn" v-if="(currentPage+ 1) < Questionaire.questions.length" v-on:click="currentPage++">Next</button>
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
      questions2: {
        _id: "qwefwefwef23fewcdcev32ew",
        timeLimit: null,
        questions: [
          {
            id: "gsabfhjewbhjes",
            title: "How old is Nelson mandela",
            answers: [54, 20, 43, 12]
          },
          {
            id: "gsabfhjewbhjes",
            title: "How old is R-Kelly",
            answers: [44, 21, 31, 62]
          },
          {
            id: "gsabfhjewbhjes",
            title: "How old is Billy Gates",
            answers: [46, 12, 31, 20]
          },
          {
            id: "gsabfhjewbhjes",
            title: "How old is Donald Trump",
            answers: [64, 21, 31, 62]
          }
        ]
      },
      Questionaire: null
    };
  },
  mounted() {
    this.Questionaire = this.dbQuestionaire;

    console.log(this.Questionaire);

    if (this.Questionaire == null) this.Questionaire = this.questions2;
  },
  props: ["dbQuestionaire", "isMemo"],
  methods: {
    SubmitQuiz() {
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
                solution: solution
              }
            )
            .then(results => {
              swal("Submitted!", {
                icon: "success"
              });
              console.log(results.data);
              this.currentPage = 1;
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
