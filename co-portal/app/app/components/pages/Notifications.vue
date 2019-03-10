<template>
  <page actionBarHidden="true">
    <ScrollView>
      <GridLayout rows="*,auto,auto" columns="*">
        <StackLayout row="1">
          <GridLayout rows="auto,auto" columns="*">
            <label row="0" verticalAlignment="center" textAlignment="center" class="mdi p-15 text-dark-black" fontSize="50%" :text="'mdi-bell' | fonticon"></label>
            <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Notifications"></label>
          </GridLayout>
        </StackLayout>
 
        <StackLayout row="2">
                 <ActivityIndicator verticalAlignment="center" textAlignment="center" row="1" v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          <CardView v-for="notify in notification" :key="notify._id" :row="a-1" elevation="15" margin="5">
            <Ripple @tap="readMessage(notify.title,notify.message)" >
              <GridLayout  class="p-15" rows="auto,auto,auto" columns="auto,*,auto">
                <Image row="0" col="0" rowSpan="3" verticalAlignment="center" src="res://ic_logo" width="60" height="60" borderRadius="50%"></Image>
                <label row="0" col="1" class="font-weight-bold" fontSize="16%" :text="handleSender(notify.moduleId)"></label>
                <label row="1" col="2"  class="h4 text-dark-black" :text="getMoment(notify.date).fromNow()"></label>
                <label row="1" col="1" class="text-dark-black" :textWrap="true" fontSize="13%" colSpan="2" :text="notify.title"></label> 
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
      introTxt: "Digitalize your business and keep track of all your earnings."
    };
  },
  mounted() {
    this.pageLoaded();
    console.log("findme2",this.$store.state.cache.cachedUser.user.userType)
       if(this.$store.state.cache.cachedUser.user.userType == "LECTURE")
        {         
     this.navigate('/module/list', null, {
        clearHistory: true
      });
      return;
        }
    this.isLoading = true;
    this.$api
      .getStudentNotification(this.$store.state.cache.cachedUser.user._id)
      .then(notifications => {
        this.notification = JSON.parse(JSON.stringify(notifications));
        this.isLoading = false;
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
    },
    handleSender(send) {
      if (!send) {
        return "General";
      } else return send.name;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
