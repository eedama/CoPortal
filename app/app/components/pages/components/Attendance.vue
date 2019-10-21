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
            :text="'mdi-calendar-check' | fonticon"
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
            <GridLayout rows="200,*">
              <StackLayout class="attend" row="0" rows="*">
                <label
                  row="0"
                  class="p-t-30 text-blue-black"
                  textAlignment="center"
                  fontWeight="bold"
                  fontSize="43%"
                  v-show="!loading && code"
                  :text="code"
                ></label>
                <ActivityIndicator
                  v-show="loading"
                  row="0"
                  verticalAlignment="center"
                  class="p-t-30 text-blue-black"
                  textAlignment="center"
                  :busy="loading"
                ></ActivityIndicator>
              </StackLayout>
              <StackLayout verticalAlignment="top" row="1" rows="*,*">
                <label
                  row="0"
                  class="p-y-20 text-blue-black"
                  textAlignment="center"
                  fontWeight="bold"
                  verticalAlignment="top"
                  fontSize="20%"
                  :textWrap="true"
                  v-show="!loading && code"
                  v-if="getMoment"
                  :text="'code expires '+ getMoment(time).fromNow()"
                ></label>
                <Button
                  row="1"
                  horizontalAlignment="center"
                  verticalAlignment="top"
                  colspan="2"
                  text="generate"
                  :isEnabled="!loading"
                  class="text-white submit-button bg-blue-black"
                  @tap="generateAttendance()"
                ></Button>
              </StackLayout>
            </GridLayout>
          </TabViewItem>
          <TabViewItem title="History">
            <GridLayout rows="*">
              <StackLayout v-show="!listView" row="0">
                <RadListView ref="listView" for="item in history" layout="grid">
                  <v-template>
                    <Ripple @tap="getStudentLayout(item._id)">
                      <StackLayout class="item p-10 m-5" orientation="vertical">
                        <Label fontSize="20%" :text="item.name" class="text-black"></Label>
                      </StackLayout>
                    </Ripple>
                  </v-template>
                </RadListView>
              </StackLayout>
              <StackLayout v-show="listView" row="0" rows="*,*">
                <Label
                  row="0"
                  fontSize="35%"
                  :text="'mdi-keyboard-backspace' | fonticon"
                  @tap="reverseStudentLayout()"
                  class="text-black mdi m-x-10"
                ></Label>
                <ScrollView row="1">
                  <StackLayout>
                    <CardView elevation="5" margin="5" v-for="(student,i) in students" :key="i">
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
                            rowspan="2"
                            verticalAlignment="center"
                            textAlignment="left"
                            fontSize="35"
                            :text="'mdi-account-circle' | fonticon"
                          ></label>
                          <label
                            row="0"
                            col="1"
                            class="font-weight-bold"
                            fontSize="15"
                            textAlignment="left"
                            :text="student.lastname + ' ' + student.firstname"
                          ></label>
                          <label
                            v-if="student.gender"
                            row="0"
                            col="2"
                            class="font-weight-bold text-dark-black mdi p-x-10 p-b-2"
                            fontSize="30%"
                            rowspan="2"
                            borderRadius="50"
                            verticalAlignment="center"
                            textAlignment="center"
                            :text="'mdi-human-' + student.gender.toLowerCase() | fonticon"
                          ></label>
                          <label
                            row="1"
                            col="1"
                            fontSize="15"
                            textAlignment="left"
                            :text="student.username"
                          ></label>
                        </GridLayout>
                      </Ripple>
                    </CardView>
                  </StackLayout>
                </ScrollView>
              </StackLayout>
            </GridLayout>
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
      lectureId: null,
      code: "",
      time: null,
      loading: false,
      listView: false,
      history: [],
      students: []
    };
  },
  mounted() {
    this.lectureId = this.$store.state.cache.cachedUser.user._id;
    this.$api
      .getAttendanceHistory(this.module._id)
      .then(attend => {
        const days = JSON.parse(JSON.stringify(attend));
        this.history = days.map(i => {
          return {
            name: date.format(new Date(i.date), "DD MMMM YYYY"),
            _id: i._id,
            date: i.date
          };
        });
        console.log(this.history);
      })
      .catch(err => {
        this.$feedback.error({
          title: err.message
        });
      });
  },
  props: ["module"],
  methods: {
    reverseStudentLayout() {
      this.students = [];
      this.listView = false;
    },
    getStudentLayout(id) {
      this.$api
        .getAttendanceStudents(id)
        .then(attend => {
          const days = JSON.parse(JSON.stringify(attend));
          days.forEach(n => {
            const user = {
              firstname: n.studentId.firstname,
              lastname: n.studentId.lastname,
              gender: n.studentId.gender
            };
            this.students.push(user);
          });

          this.listView = true;
        })
        .catch(err => {
          this.$feedback.error({
            title: err.message
          });
        });
    },
    getExpiryTime(dated) {
      const time = "code expires at " + date.format(dated, "hh:mm");
      const noon = date
        .format(dated, "A")
        .split(".")
        .join("")
        .toUpperCase();
      this.time = time + " " + noon;
    },
    generateAttendance() {
      this.loading = true;
      const attendance = { duration: 310, lecturerId: this.lectureId };
      this.$api
        .createAttendance(attendance, this.module._id)
        .then(attend => {
          const days = JSON.parse(JSON.stringify(attend));
          this.code = days.code;
          
          this.time = days.expiryDate;
          console.log(this.time);
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
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
</style>
