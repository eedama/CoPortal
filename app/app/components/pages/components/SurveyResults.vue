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
          <TabViewItem title="Survey Results">
            <ScrollView height="300">
              <StackLayout class="p-x-5">
                <ActivityIndicator
                  v-show="loading"
                  row="0"
                  verticalAlignment="center"
                  class="p-t-10 text-blue-black"
                  textAlignment="center"
                  :busy="loading"
                ></ActivityIndicator>
                <CardView
                  elevation="10"
                  margin="5"
                  v-for="(survey, i) in results"
                  :key="i"
                >
                  <Ripple>
                    <GridLayout
                      class="text-dark-black p-15"
                      rows="auto,auto"
                      columns="auto,*,auto"
                    >
                      <label
                        row="0"
                        col="0"
                        class="mdi text-blue-black m-r-20"
                        rowSpan="2"
                        verticalAlignment="center"
                        textAlignment="left"
                        fontSize="35"
                        :text="'mdi-comment-question-outline' | fonticon"
                      ></label>
                      <label
                        row="0"
                        col="1"
                        colSpan="2"
                        class="font-weight-bold text-blue-black"
                        fontSize="25"
                        textAlignment="left"
                        :textWrap="true"
                        :text="
                          survey.studentId.firstname +
                            ' ' +
                            survey.studentId.lastname
                        "
                      ></label>
                      <StackLayout row="1" col="1" class="p-x-5">
                        <CardView
                          elevation="1"
                          margin="1"
                          v-for="(answer, i) in survey.answers"
                          :key="i"
                        >
                          <GridLayout
                            class="text-dark-black p-x-15 p-y-5"
                            rows="*,*"
                          >
                            <label
                              row="0"
                              class="font-weight-bold"
                              :textWrap="true"
                              fontSize="15"
                              textAlignment="left"
                              :text="answer.question"
                            ></label>
                            <label
                              row="1"
                              class=" text-blue-black font-weight-bold m-t-5"
                              :textWrap="true"
                              fontSize="12"
                              textAlignment="left"
                              :text="answer.answer"
                            ></label>
                          </GridLayout>
                        </CardView>
                      </StackLayout>
                    </GridLayout>
                  </Ripple>
                </CardView>
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
      results: [],
      loading: false
    };
  },
  mounted() {
    this.getSurveyResults();
  },
  props: ["surveyId"],
  methods: {
    getSurveyResults() {
      this.loading = true;
      this.$api
        .getSurveyResults(this.surveyId)
        .then(attend => {
          const days = JSON.parse(JSON.stringify(attend));
          this.results = days.students;

          this.loading = false;
          if (this.results.length === 0) {
            this.$feedback.info({
              title: "Surveys",
              message: "No student has taken this survey"
            });
          }
        })
        .catch(err => {
          this.$feedback.error({
            title: err.message
          });
          this.loading = false;
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
