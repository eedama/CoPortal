<template>
  <page actionBarHidden="true">
    <ScrollView>
      <GridLayout rows="*,auto,auto,auto,auto" columns="*">

      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="mdi p-15 text-dark-black" fontSize="50%" :text="'mdi-bell' | fonticon"></label>
        </GridLayout>
      </StackLayout>

      <StackLayout row="0" rowSpan="2" verticalAlignment="center" textAlignment="center" v-if="!isLoading && (!notification || notification.length == 0)">
        <label verticalAlignment="center" textAlignment="center" class="mdi m-x-10" fontSize="50%" :text="'mdi-alert' | fonticon"></label>
        <label verticalAlignment="center" textAlignment="center" class="m-10 font-weight-bold" fontSize="30%" text="No Notifications"></label>
        <label verticalAlignment="center" textAlignment="center" class="m-x-10" fontSize="20%" :textWrap="true" text="You are up-to-date with all the announcements"></label>
      </StackLayout>;
    
        <StackLayout row="1">
        <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="General Notifications"></label>
      
        <StackLayout row="2">
          <ActivityIndicator verticalAlignment="center"  textAlignment="center"  row="1"  v-show="isLoading"  :busy="isLoading" ></ActivityIndicator>
          <CardView  v-for="notify in generalNotification"  :key="notify._id"  elevation="15"  margin="5">
            <Ripple @tap="readMessage(notify.title,notify.message)">
              <GridLayout class="p-15" rows="auto,auto" columns="auto,*,auto">
                <Image
                  row="0"
                  col="0"
                  rowSpan="2"
                  verticalAlignment="center"
                  src="res://ic_logo"
                  width="60"
                  height="60"
                  borderRadius="50%"
                ></Image>
                <label
                  row="0"
                  col="1"
                  class="font-weight-bold p-x-5"
                  fontSize="16%"
                  :text="notify.title"
                ></label>
                <label
                  row="0"
                  col="2"
                  class="h4 text-dark-black"
                  :text="getMoment(notify.date).fromNow()"
                ></label>
                <label
                  row="1"
                  col="2"
                  class="h4 text-dark-black"
                  v-if="notify.moduleId"
                  :text="notify.moduleId.name"
                ></label>
                <label row="1" col="1" class="text-dark-black p-x-5" :text="notify.message"></label>
                <label
                  row="0"
                  class="font-weight-bold p-x-5"
                  fontSize="20%"
                  v-if="notify.moduleId != null"
                  text="No Notifications"
                ></label>
              </GridLayout>
            </Ripple>
          </CardView>
        </StackLayout>

         </StackLayout>

        <StackLayout row="3">
          <GridLayout rows="auto" columns="*">
            <label
              row="1"
              verticalAlignment="center"
              textAlignment="center"
              class="p-15 text-dark-black"
              fontSize="30%"
              text="Module Notifications"
            ></label>
          </GridLayout>
        </StackLayout>

        <StackLayout row="4">
          <ActivityIndicator  verticalAlignment="center"  textAlignment="center"  row="1"  v-show="isLoading"  :busy="isLoading"  ></ActivityIndicator>
          <CardView  v-for="notify in moduleNotification"  :key="notify._id"  elevation="15"  margin="5"  >
            <Ripple @tap="readMessage(notify.title,notify.message)">
              <GridLayout class="p-15" rows="auto,auto,auto" columns="auto,*,auto">
                <Image
                  row="0"
                  col="0"
                  rowSpan="2"
                  verticalAlignment="center"
                  src="res://ic_logo"
                  width="60"
                  height="60"
                  borderRadius="50%"
                ></Image>
                <label
                  row="0"
                  col="1"
                  class="font-weight-bold p-x-5"
                  fontSize="16%"
                  :text="notify.title"
                ></label>
                <label
                  row="0"
                  col="2"
                  class="h4 text-dark-black"
                  :text="getMoment(notify.date).fromNow()"
                ></label>
                <label
                  row="1"
                  col="2"
                  class="h4 text-dark-black"
                  v-if="notify.moduleId"
                  :text="notify.moduleId.name"
                ></label>
                <label row="1" col="1" class="text-dark-black p-x-5" :text="notify.message"></label>
                <label
                  row="2"
                  class="font-weight-bold p-x-5"
                  fontSize="20%"
                  v-if="notify.moduleId == null"
                  text="No Notifications"
                ></label>
              </GridLayout>
            </Ripple>
          </CardView>

        </StackLayout>
      </GridLayout>

    </ScrollView>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      notification: [],
      introTxt: "Digitalize your business and keep track of all your earnings.",
      generalNotification: [],
      moduleNotification: []
    };
  },
  mounted() {
    this.pageLoaded();
    this.isLoading = true;
    this.$api
      .getStudentNotification(this.$store.state.cache.cachedUser.user._id)
      .then(notifications => {
        this.notification = JSON.parse(JSON.stringify(notifications));
        this.isLoading = false;
          this.notification.forEach(notificationType => {
            if (notificationType.moduleId == null) {
          this.generalNotification.push(notificationType);
        } else {
          this.moduleNotification.push(notificationType);
        }
      });
      })
      .catch(err => {
        this.isLoading = false;
        this.$feedback.error({
          title: "Notification",
          message: err.message,
          duration: 3000
        });
      });
    
  },
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: this.appSettings,
        doc: "admin"
      });
    },
    readMessage(sender, Message) {
      alert({
        title: sender,
        message: Message,
        okButtonText: "close"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
