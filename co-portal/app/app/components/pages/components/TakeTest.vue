<template>
    <page actionBarHidden="true">
        <GridLayout v-if="Questionaire" rows="auto,*,auto" columns="*">
            <StackLayout row="0">
                <GridLayout rows="auto,auto" columns="*">
                    <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="20%" :text="currentPage >= Questionaire.questions.length ? `Confirm your submission` : `Question ${currentPage + 1} of ${Questionaire.questions.length}`"></label>
                </GridLayout>
                <Progress class="text-dark-black" :value="((currentPage + 1)/(Questionaire.questions.length) * 100)"></Progress>
            </StackLayout>
    
            <ScrollView v-if="currentPage >= 0 && (currentPage) < Questionaire.questions.length" verticalAlignment="center" row="1">
                <StackLayout verticalAlignment="center">
                    <CardView elevation="5" margin="10">
                        <GridLayout class="p-5" rows="auto,auto" columns="*">
                            <label row="0" class="text-dark-black m-10 font-weight-bold" :textWrap="true" fontSize="17%" colSpan="2" :text="Questionaire.questions[currentPage].title"></label>
                            <ScrollView class="p-x-15 m-l-25" row="1">
                                <StackLayout :textWrap="true">
                                    <CheckBox fillColor="black" class="p-15 text-dark-black" :name="`circleToggle-${currentPage}`" boxType="circle" :text="answer" v-for="(answer,j) in Questionaire.questions[currentPage].answers" :key="j" @tap="selectSolution(currentPage,answer)" :checked="solutions[currentPage] == answer"></CheckBox>
                                </StackLayout>
                            </ScrollView>
                        </GridLayout>
                    </CardView>
                    <label class="m-10" :textWrap="true" verticalAlignment="center" textAlignment="center" color="red" v-if="txtError" :text="txtError"></label>
                </StackLayout>
            </ScrollView>
            <StackLayout v-if="(currentPage) == Questionaire.questions.length && !isLoading" row="1">
                <label class="p-y-15 p-5" :textWrap="true" textAlignment="center" text="Please go through your answers and if you want to correct any of them just tap it then submit"></label>
                <ScrollView>
                    <StackLayout>
                        <CardView v-for="(solution,i) in solutions" :key="i" elevation="5" margin="10">
                            <Ripple @tap="currentPage = i">
                                <GridLayout class="p-5" rows="auto,auto" columns="*">
                                    <label row="0" class="text-dark-black m-10 font-weight-bold" :textWrap="true" fontSize="17%" :text="Questionaire.questions[i].title"></label>
                                    <label v-if="solution != null" row="1" class="text-dark-black m-10" :textWrap="true" fontSize="16%" :text="solution"></label>
                                    <label v-if="solution == null" row="1" class="m-10" color="red" :textWrap="true" fontSize="16%" text="No answer provided."></label>
                                </GridLayout>
                            </Ripple>
                        </CardView>
                    </StackLayout>
                </ScrollView>
            </StackLayout>
            <StackLayout row="2">
                <GridLayout v-if="(currentPage) != Questionaire.questions.length && !isLoading" class="p-5" rows="auto" columns="auto,*,auto">
                    <Ripple v-if="currentPage > 0" @tap="changePage(false)" class="m-15" col="0" verticalAlignment="center" textAlignment="left">
                        <label class="font-weight-bold mdi p-5" textAlignment="left" fontSize="50%" :text="'mdi-chevron-left' | fonticon "></label>
                    </Ripple>
                    <Ripple v-if="(currentPage) < Questionaire.questions.length" @tap="changePage(true)" class="m-15" col="2" verticalAlignment="center" textAlignment="right">
                        <label class="font-weight-bold mdi p-5" textAlignment="right" fontSize="50%" :text="'mdi-chevron-right' | fonticon "></label>
                    </Ripple>
                </GridLayout>
                <GridLayout v-if="(currentPage) == Questionaire.questions.length && !isLoading" rows="auto" columns="auto,*">
                    <Ripple class="p-5" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" @tap="SubmitQuiz()">
                        <label class="font-weight-bold m-15 p-5" textAlignment="center" fontSize="20%" text="Submit"></label>
                    </Ripple>
                </GridLayout>
                <ActivityIndicator verticalAlignment="center" textAlignment="center" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
            </StackLayout>
        </GridLayout>
    </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      solutions: [],
      Questionaire: null,
      txtError: "",
      isLoading: false
    };
  },
  mounted() {
    this.pageLoaded();
  },
  props: ["dbQuestionaire", "isMemo"],
  methods: {
    pageLoaded() {
      if (
        this.dbQuestionaire == null ||
        this.dbQuestionaire.questions == null ||
        this.dbQuestionaire.questions.length <= 0
      ) {
        this.navigate(null);
        return;
      }
      this.solutions = [];
      this.dbQuestionaire.questions.map(q => {
        this.solutions.push(null);
      });

      this.ApplyNavigation(this);
      this.Questionaire = this.dbQuestionaire;
    },
    changePage(isForward) {
      this.txtError = "";
      isForward ? this.currentPage++ : this.currentPage--;
    },
    selectSolution(index, value) {
      if (this.solutions[index] != value) {
        this.solutions[index] = value;
      }
      this.$forceUpdate();
    },
    SubmitQuiz() {
      this.isLoading = true;
      this.txtError = "";
      var hasError = false;
      this.solutions.map((s, i) => {
        if (s == null) {
          hasError = true;
          this.txtError = "Please provide an answer to this question";
          this.currentPage = i;
        }
      });
      if (hasError) {
        this.isLoading = false;
        return;
      }
      confirm({
        title: "Submit confirmation",
        message: "Are you sure you want to submit?",
        okButtonText: "Yes",
        cancelButtonText: "No"
      }).then(result => {
        if (!result) {
          this.isLoading = false;
        } else {
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

          this.$api
            .submitQuiz(this.$store.state.cache.cachedUser.user._id, solution)
            .then(results => {
              this.isLoading = false;
              this.$feedback.success({
                title: "Submitted!",
                message: "You will get your marks shortly."
              });
              this.navigate(
                "/test/marks",
                {
                  solutionId: results._id
                },
                {
                  clearHistory: true
                }
              );
            })
            .catch(err => {
              this.isLoading = false;
              this.$feedback.error({
                title: "Unable to submit",
                message: err.message
              });
            });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
