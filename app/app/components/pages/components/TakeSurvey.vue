<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto" columns="*">
          <Image
            row="0"
            src="~/assets/images/company1.jpeg"
            opacity="1"
            stretch="aspectFit"
            verticalAlignment="bottom"
            textAlignment="center"
            horizontalAlignment="center"
            class=""
          ></Image>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <TabView
          tabBackgroundColor="white"
          selectedTabTextColor="black"
          androidSelectedTabHighlightColor="black"
        >
          <TabViewItem :title="title">
            <ScrollView height="300">
              <StackLayout>
                <ActivityIndicator
                  v-show="loading"
                  verticalAlignment="center"
                  class="p-t-10 text-blue-black"
                  textAlignment="center"
                  :busy="loading"
                ></ActivityIndicator>
                <CardView
                  elevation="10"
                  margin="5"
                  v-for="(survey, i) in questions"
                  :key="i"
                >
                  <Ripple>
                    <GridLayout class="text-dark-black p-15" rows="auto,auto">
                      <label
                        row="0"
                        class="font-weight-bold text-blue-black"
                        fontSize="16"
                        textAlignment="left"
                        :textWrap="true"
                        :text="survey.question"
                      ></label>
                      <StackLayout
                        v-show="survey.type === 'RADIO'"
                        row="1"
                        col="1"
                        class="p-x-5"
                      >
                        <CheckBox
                          font-size="20"
                          colSpan="2"
                          class="checkbox"
                          boxType="circle"
                          fillColor="#006064"
                          :text="answer"
                          v-for="(answer, j) in survey.options"
                          :key="j"
                          :checked="response.answers[i].answer === answer"
                          @tap="setChecked(i, answer)"
                        ></CheckBox>
                      </StackLayout>
                      <StackLayout
                        v-show="survey.type !== 'RADIO'"
                        row="1"
                        col="1"
                        class="p-x-5"
                      >
                        <TextField
                          v-model="response.answers[i].answer"
                          autocorrect="true"
                          autocapitalizationType="none"
                        ></TextField>
                      </StackLayout>
                    </GridLayout>
                  </Ripple>
                </CardView>
                <Button
                  horizontalAlignment="center"
                  verticalAlignment="top"
                  v-if="!loading && questions.length > 0"
                  text="Submit"
                  class="text-white submit-button bg-blue-black m-t-5"
                  @tap="submitSurvey()"
                ></Button>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
        </TabView>
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
      title: "",
      questions: [],
      studentId: "",
      surveyObject: {},
      loading: false,
      response: {
        studentId: "",
        answers: []
      }
    };
  },
  mounted() {
    this.studentId = this.$store.state.cache.cachedUser.user._id;
    this.response.studentId = this.studentId;
    this.getSurveyQuestions();
  },
  props: ["module"],
  methods: {
    setChecked(index, value) {
      this.response.answers[index].answer = value;
    },
    getSurveyQuestions() {
      this.loading = true;
      this.$api
        .getLatestSurveyQuestions(this.module._id)
        .then(attend => {
          const days = JSON.parse(JSON.stringify(attend));
          if (typeof days === "object") {
            this.surveyObject = days._id;
            this.title = days.surveyTemplateId.title;
            this.questions = days.surveyTemplateId.questions;
            this.response.answers = this.questions.map(e => {
              return { questionId: e._id, question: e.question, answer: "" };
            });
          } else {
            this.$feedback.info({
              title: "Surveys",
              message: "No Survey available for this module"
            });
          }

          this.loading = false;
        })
        .catch(err => {
          this.$feedback.error({
            title: err.message
          });
          this.loading = false;
        });
    },
    submitSurvey() {
      this.$api
        .submitSurveyQuestions(this.surveyObject, this.response)
        .then(attend => {
          this.loading = false;
          this.$feedback.success({
            title: "Survey",
            message: attend.toString()
          });
          this.navigate(
            "/module/list/survey",
            { attendance: true },
            {
              clearHistory: true
            }
          );
        })
        .catch(err => {
          this.$feedback.error({
            title: err.message
          });
        });
    }
  }
};
</script>

<style  scoped>
.submit-button {
  width: 70%;
  border-radius: 5%;
  height: 23%;
}
.item {
  background-color: ghostwhite;
  border-radius: 2%;
}
.attend {
  border-width: 2 2 2 2;
  border-radius: 10%;
  border-color: rgba(36, 36, 36, 0.5);
  background-color: ghostwhite;
  width: 90%;
  height: 25%;
}
.check {
  font-size: 25px;
  color: #006064;
  border-color: #006064;
}
</style>
