<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label
            row="0"
            verticalAlignment="center"
            textAlignment="center"
            class="text-dark-black mdi"
            fontSize="45%"
            :text="'mdi-comment-question-outline' | fonticon"
          ></label>
          <label
            row="1"
            verticalAlignment="center"
            textAlignment="center"
            class="p-15 text-dark-black"
            fontSize="30%"
            :text="module.code"
          ></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <TabView
          tabBackgroundColor="white"
          selectedTabTextColor="black"
          androidSelectedTabHighlightColor="black"
        >
          <TabViewItem title="New">
            <ScrollView height="300">
              <StackLayout
                class="m-x-2"
                :textWrap="true"
                width="90%"
                horizontalAlignment="center"
              >
                <ActivityIndicator
                  v-show="loading"
                  row="0"
                  verticalAlignment="center"
                  class="p-t-30 text-blue-black"
                  textAlignment="center"
                  :busy="loading"
                ></ActivityIndicator>
                <label
                  row="0"
                  class="p-y-20"
                  v-if="!loading && surveyTemplates.length > 0"
                  color="gray"
                  textAlignment="center"
                  fontWeight="bold"
                  verticalAlignment="top"
                  fontSize="13%"
                  text="please choose a survey you want the students to take"
                ></label>
                <label
                  row="0"
                  class="p-y-20"
                  v-if="!loading && surveyTemplates.length == 0"
                  color="gray"
                  textAlignment="center"
                  fontWeight="bold"
                  verticalAlignment="top"
                  fontSize="15%"
                  text="this module has no surveys to take"
                ></label>
                <CheckBox
                  font-size="20"
                  colSpan="2"
                  class="checkbox"
                  boxType="circle"
                  fillColor="#006064"
                  :checked="selectedTemplate == answer._id"
                  :text="answer.title"
                  v-for="(answer, j) in surveyTemplates"
                  :key="j"
                  @tap="selectedTemplate = answer._id"
                ></CheckBox>
                <Button
                  horizontalAlignment="center"
                  verticalAlignment="top"
                  v-if="!loading && surveyTemplates.length > 0"
                  colSpan="2"
                  text="Create Survey"
                  class="text-white submit-button bg-blue-black m-t-5"
                  @tap="createSurvey()"
                ></Button>
              </StackLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem title="History">
            <ScrollView height="300">
              <StackLayout>
                <CardView
                  elevation="5"
                  margin="5"
                  v-for="(survey, i) in history"
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
                        class="mdi text-dark-black m-r-20"
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
                        class="font-weight-bold"
                        fontSize="15"
                        textAlignment="left"
                        :textWrap="true"
                        :text="survey.surveyTemplateId.title"
                      ></label>
                      <label
                        row="1"
                        col="1"
                        fontSize="15"
                        textAlignment="left"
                        :text="getDate(survey.date)"
                      ></label>
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
import date from "date-and-time";
export default {
  data() {
    return {
      selectedTemplate: "",
      surveyTemplates: [],
      loading: false,
      history: [],
      showStudents: false,
      students: []
    };
  },
  mounted() {
    this.lectureId = this.$store.state.cache.cachedUser.user._id;
    this.getSurveyTemplates();
    this.getHistory();
  },
  props: ["module"],
  methods: {
    getDate(dt) {
      return date.format(new Date(dt), "DD MMMM YYYY");
    },
    createSurvey() {
      if (this.selectedTemplate === "") {
        this.$feedback.warning({
          title: "Error",
          message: "please choose a survey for students to perform"
        });
        return;
      }
      this.loading = true;
      this.$api
        .submitSurvey(this.selectedTemplate)
        .then(attend => {
          this.loading = false;
          this.$feedback.success({
            title: attend.toString()
          });
        })
        .catch(err => {
          this.loading = false;
          this.$feedback.error({
            title: err.message
          });
        });
    },
    getSurveyTemplates() {
      this.loading = true;
      this.$api
        .getSurveyTemplate(this.module._id)
        .then(attend => {
          const days = JSON.parse(JSON.stringify(attend));
          this.surveyTemplates = days;
          this.loading = false;
        })
        .catch(err => {
          this.$feedback.error({
            title: err.message
          });
          this.loading = false;
        });
    },
    getHistory() {
      this.$api
        .getSurveyHistory(this.module._id)
        .then(attend => {
          const days = JSON.parse(JSON.stringify(attend));
          this.history = days;
          console.log("history", days);
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
