<template>
  <div class="row">
    <div class="col s12 center-align card-panel row">
      <div class="col s12 m8 offset-m2">
        <h5>Your score is <a :class="{'red-text':(Solution.mark*2 < Solution.answers.length)}">{{ Solution.mark }}/{{ Solution.answers.length }}</a></h5>
      </div>
      <div class="col s12 m8 offset-m2">
        <span class="blue-text">Scroll down to see view your test.</span>
      </div>
    </div>
    <div class="col s12 m8 offset-m2">
      <div v-for="(solution,i) in Solution.answers" :key="i" class="row">
        <div class="col m8 offset-m2 row card-panel">
          <div class="col s12">
            <h5 class="center-align">{{ solution.question.title }}</h5>
          </div>
          <div class="col m8 offset-m2 s12">
            <form>
              <h6 class="pointer" v-for="(answer,j) in solution.question.answers" :key="j">
                <label>
                    <input disabled="true" :checked="solution.answer == answer" :id="answer + '-' + j" class="with-gap" :name="solution._id" type="radio"/>
                    <span :for="answer + '-' + j">{{ answer }}</span>
                  </label>
              </h6>
            </form>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col s8 offset-s2 center-align">
          <button class="btn red">Go to my profile</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
const axios = require("axios");

export default {
  name: "TestMarks",
  data() {
    return {
      currentPage: 0,
      Solution: []
    };
  },
  mounted() {
    if (this.solutionId == null) {
      this.$router.push("/");
      return;
    }

    axios
      .get(
        this.$store.state.settings.baseLink +
          "/l/get/solutions/" +
          this.solutionId
      )
      .then(results => {
        if (results == null) {
          this.$router.push("/");
          return;
        }
        this.Solution = results.data;
        console.log(this.Solution);
      })
      .catch(err => {
        swal("Unable to load your results", err.message, "error");
        this.$router.push("/");
        return;
      });
  },
  props: ["solutionId"],
  methods: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
