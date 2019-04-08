<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*,auto" columns="*">
      <StackLayout v-if="Solution" row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label
            row="0"
            verticalAlignment="center"
            textAlignment="center"
            class="p-15 text-dark-black font-weight-bold"
            fontSize="30%"
            text="Results"
          ></label>
            <label
            row="1"
            verticalAlignment="center"
            textAlignment="center"
            class="text-primary font-weight-bold"
            fontSize="20%"
            :text="total"
          ></label>
        </GridLayout>
      </StackLayout>
       <ScrollView v-if="!isLoading" row="1">
        <WrapLayout>
      <StackLayout row="1">
          <CardView v-for="(solution,i) in Solution" :key="i" elevation="5" margin="10">
             
                <GridLayout class="p-5" rows="auto,auto" columns="auto,*">
                  <label
                    row="0"
                    class="text-dark-black m-10 font-weight-bold"
                    :textWrap="true"
                    fontSize="17%"
                    colSpan="2"
                    :text="solution.question"
                  ></label>
                   <label
                  row="1"
                  col="1"
                  class="mdi text-dark-black font-weight-bold"
                  verticalAlignment="center"
                  :color="colorLoaded(solution.correct)"
                  textAlignment="right"
                  fontSize="35"
                  :text="iconLoaded(solution.correct) | fonticon"
                ></label>
                </GridLayout>
            </CardView>
      </StackLayout>
        </WrapLayout>
       </ScrollView>
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
      txtFeedback: "",
      currentPage: 0,
      Solution:[],
      feedbacks: [],
      addingFeedBack: false,
      autoRefreshChats: false,
      refreshTimer: "",
      isLoading: false,
      total : ""
    };
  },
  mounted() {
    this.isLoading = true;


    this.$api
      .getSolutions(this.solutionId)
      .then(results => {
        this.isLoading = false;
        if (results == null) {
          return;
        }
        results = JSON.parse(JSON.stringify(results));
        this.total  = results.mark +"/"+results.answers.length;
        results.answers.forEach(solution => {
  var Mark = {question : solution.question.title,
          correct : (solution.correctAnswer === solution.answer)
          }
          this.Solution.push(Mark)
        });

       
      })
      .catch(err => {
         this.isLoading = false;
        this.$feedback.error({
          title: "Unable to load your results",
          message: err.message
        });
        return;
      });
  },
  props: ["solutionId"],
  methods: {
   colorLoaded(marked) {
      if (!marked) {
        return "darkred";
      } else if (marked) {
        return "darkgreen";
      }
    },
    iconLoaded(marked)
    {
       if (marked) {
        return "mdi-check";
      } else if (!marked) {
        return "mdi-window-close";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
