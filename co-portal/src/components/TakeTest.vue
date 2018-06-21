<template>
  <div class="row">
    <div class="col s12 m8 offset-m2">
      <div v-if="currentPage == i" v-for="(question,i) in questions" :key="i" class="row">
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
          <p>{{currentPage + 1}}/{{ questions.length }}</p>
        </div>
  
        <div class="col s9 right-align">
          <button class="btn red" v-if="currentPage > 0 " v-on:click="currentPage--">Previous</button>
          <button class="btn" v-if="(currentPage+ 1) < questions.length" v-on:click="currentPage++">Next</button>
          <button class="btn green" v-if="(currentPage+1) == questions.length" v-on:click="SubmitQuiz()">Done</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      currentPage: 0,
      solutions: [54, 44, 46, 64],
      questions2: [
        {
          id: "gsabfhjewbhjes",
          question: "How old is Nelson mandela",
          answers: [54, 20, 43, 12]
        },
        {
          id: "gsabfhjewbhjes",
          question: "How old is R-Kelly",
          answers: [44, 21, 31, 62]
        },
        {
          id: "gsabfhjewbhjes",
          question: "How old is Billy Gates",
          answers: [46, 12, 31, 20]
        },
        {
          id: "gsabfhjewbhjes",
          question: "How old is Donald Trump",
          answers: [64, 21, 31, 62]
        }
      ]
    };
  },
  props: ["questions"],
  methods: {
    SubmitQuiz() {
      alert("Submitting");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
