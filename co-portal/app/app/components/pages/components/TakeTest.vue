<template>
    <page actionBarHidden="true">
        <GridLayout rows="auto,*,auto" columns="*">
            <StackLayout row="0">
                <GridLayout rows="auto,auto" columns="*">
                    <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="20%" text="Question 4 of 10"></label>
                </GridLayout>
                <Progress class="text-dark-black" :value="((currentPage + 1)/(Questionaire.questions.length) * 100)"></Progress>
            </StackLayout>
            <StackLayout v-if="currentPage == i" v-for="(question,i) in Questionaire.questions" :key="i" verticalAlignment="center" row="1">
                <CardView elevation="5" margin="10">
                    <GridLayout class="p-5" rows="auto,auto" columns="*">
                        <label row="0" class="text-dark-black m-10 font-weight-bold" :textWrap="true" fontSize="17%" colSpan="2" :text="question.title"></label>
                        <ScrollView class="p-x-15 m-l-25" row="1">
                            <StackLayout :textWrap="true">
                                <CheckBox fillColor="black" class="p-15 text-dark-black" name="circleToggle" boxType="circle" :text="answer" v-for="(answer,j) in question.answers" :key="j" @tap="selectSolution(index,answer)" :checked="solution[i] == answer"></CheckBox>
                            </StackLayout>
                        </ScrollView>
                    </GridLayout>
                </CardView>
            </StackLayout>
            <StackLayout row="2">
                <GridLayout v-if="(currentPage+1) != Questionaire.questions.length && !isLoading" class="p-5" rows="auto" columns="auto,*,auto">
                    <Ripple v-if="currentPage > 0" @tap="changePage(false)" class="m-15" col="0" verticalAlignment="bottom" textAlignment="left">
                        <label class="font-weight-bold mdi p-5" textAlignment="left" fontSize="50%" :text="'mdi-chevron-left' | fonticon "></label>
                    </Ripple>
                    <Ripple v-if="(currentPage+ 1) < Questionaire.questions.length" @tap="changePage(true)" class="m-15" col="2" verticalAlignment="bottom" textAlignment="right">
                        <label class="font-weight-bold mdi p-5" textAlignment="right" fontSize="50%" :text="'mdi-chevron-right' | fonticon "></label>
                    </Ripple>
                </GridLayout>
                <Ripple v-if="(currentPage+1) == Questionaire.questions.length && !isLoading" @tap="SubmitQuiz()" class="m-15" col="2" verticalAlignment="bottom" textAlignment="center">
                    <label class="font-weight-bold p-5" textAlignment="center" fontSize="20%" text="Submit"></label>
                 </Ripple>
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
      currentPage: 0,
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

      this.Questionaire = this.dbQuestionaire;
    },
    changePage(isForward) {
      this.txtError = "";
      isForward ? this.currentPage++ : this.currentPage--;
    },
    selectSolution(index,value){
        this.solutions[index] = value;
    },
    SubmitQuiz() {}
  }
};
</script>

<style lang="scss" scoped>
</style>
