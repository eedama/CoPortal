<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,auto,*" columns="*">
      <label
        row="0"
        verticalAlignment="center"
        textAlignment="center"
        class="p-t-5 text-peach"
        fontSize="30%"
        fontWeight="bold"
        text="Announcements"
      ></label>

      <Image
        src="~/assets/images/backgrounds/notification.png"
        stretch="aspectFit"
        row="1"
      />
      <StackLayout
        row="0"
        rowSpan="3"
        verticalAlignment="center"
        textAlignment="center"
        v-if="!isLoading && Object.keys(moduleNotifications).length == 0"
      >
        <label
          verticalAlignment="center"
          textAlignment="center"
          class="mdi m-x-10"
          fontSize="50%"
          :text="'mdi-alert' | fonticon"
        ></label>
        <label
          verticalAlignment="center"
          textAlignment="center"
          class="m-10 font-weight-bold"
          fontSize="20%"
          text="No Notifications"
        ></label>
        <label
          verticalAlignment="center"
          textAlignment="center"
          class="m-x-10"
          fontSize="20%"
          :textWrap="true"
          text="You are up-to-date with all the announcements"
        ></label>
      </StackLayout>

      <ActivityIndicator
        verticalAlignment="center"
        textAlignment="center"
        v-show="isLoading"
        row="2"
        :busy="isLoading"
      ></ActivityIndicator>

      <TabView
        v-if="Object.keys(moduleNotifications).length > 0"
        row="2"
        tabBackgroundColor="white"
        selectedTabTextColor="#F96C5B"
        androidSelectedTabHighlightColor="#F96C5B"
      >
        <TabViewItem
          v-for="(moduleName, i) in Object.keys(moduleNotifications)"
          :key="i"
          :title="moduleName"
        >
          <GridLayout v-if="moduleName" rows="*">
            <ScrollView>
              <StackLayout>
                <CardView
                  v-for="notify in moduleNotifications[moduleName]"
                  :key="notify._id"
                  elevation="0"
                  margin="5"
                >
                  <Ripple @tap="readMessage(notify.title, notify.message)">
                    <GridLayout class="p-15" rows="auto,auto" columns="auto,*">
                      <Label
                        row="0"
                        col="0"
                        rowSpan="2"
                        verticalAlignment="center"
                        textAlignment="center"
                        fontSize="30"
                        class="mdi rounded-card p-15 text-peach"
                        :text="'mdi-bell' | fonticon"
                      ></Label>

                      <label
                        row="0"
                        col="1"
                        fontSize="18%"
                        verticalAlignment="center"
                        class="text-dark-black m-l-15"
                        :textWrap="true"
                        fontWeight="bold"
                        :text="notify.title"
                      ></label>
                      <label
                        row="1"
                        verticalAlignment="center"
                        col="1"
                        fontSize="12%"
                        class="m-l-15"
                        :text="getMoment(notify.date).fromNow()"
                      ></label>
                    </GridLayout>
                  </Ripple>
                </CardView>
              </StackLayout>
            </ScrollView>
          </GridLayout>
        </TabViewItem>
      </TabView>
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
      introTxt: "Digitalize your business and keep track of all your earnings.",
      moduleNotifications: {
        General: []
      }
    };
  },
  mounted() {
    this.pageLoaded();
    this.isLoading = true;
    this.$api
      .getStudentNotification(this.$store.state.cache.cachedUser.user._id)
      .then(notifications => {
        const notification = JSON.parse(JSON.stringify(notifications));
        notification.forEach(notificationType => {
          let moduleName = "General";
          if (notificationType.moduleId != null) {
            moduleName = notificationType.moduleId.name;
          }
          if (!this.moduleNotifications[moduleName]) {
            this.moduleNotifications[moduleName] = [];
          }
          this.moduleNotifications[moduleName].push(notificationType);
        });
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
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
