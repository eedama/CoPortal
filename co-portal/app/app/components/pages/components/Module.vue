<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="text-dark-black" fontSize="35%" text="CSC1A20"></label>
          <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Computer science 3B"></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
        <ScrollView orientation="horizontal">
          <StackLayout orientation="horizontal">
            <CardView v-for="a in 4" :key="a" :row="a-1" elevation="15" margin="5">
              <GridLayout class="p-5" rows="auto,auto,auto" columns="auto,*,auto">
                <Image row="0" col="0" rowSpan="3" verticalAlignment="center" src="res://ic_logo" width="60" height="60" borderRadius="50%"></Image>
                <label row="0" col="1" class="font-weight-bold" fontSize="16%" :text="notification.sender"></label>
                <label row="0" col="2" class="h4 text-dark-black" :text="notification.time"></label>
                <label row="1" col="1" class="text-dark-black" :textWrap="true" fontSize="13%" colSpan="2" :text="notification.title"></label>
                <label row="2" verticalAlignment="center" col="1" class="text-dark-black" colSpan="2" :text="notification.message"></label>
              </GridLayout>
            </CardView>
          </StackLayout>
        </ScrollView>
      </StackLayout>
      <StackLayout row="2">
        <TabView tabBackgroundColor="white" selectedTabTextColor="black" androidSelectedTabHighlightColor="black">
          <TabViewItem title="Notes">
            <ScrollView>
              <WrapLayout>
                <StackLayout width="50%" v-for="a in 15" :key="a">
                  <CardView elevation="15" margin="5">
                    <GridLayout class="p-10" rows="auto,auto,auto" columns="*,auto,auto">
                      <label row="0" col="0" colSpan="3" :textWrap="true" verticalAlignment="center" textAlignment="center" class="font-weight-bold" fontSize="16%" :text="notification.sender"></label>
                      <label row="1" col="0" colSpan="3" verticalAlignment="center" textAlignment="center" class="font-weight-bold mdi p-15" fontSize="75%" :text="'mdi-file-pdf' | fonticon "></label>
                      <label row="2" col="0" verticalAlignment="bottom" class="h4 text-dark-black" text="10 minutes ago"></label>
                      <Ripple row="2" col="1" verticalAlignment="bottom" textAlignment="right">
                        <label class="font-weight-bold mdi p-x-5" textAlignment="right" fontSize="20%" :text="'mdi-download' | fonticon "></label>
                      </Ripple>
                      <Ripple row="2" col="2" verticalAlignment="bottom" textAlignment="right">
                        <label class="font-weight-bold mdi p-x-5" textAlignment="right" fontSize="20%" :text="'mdi-share-variant' | fonticon "></label>
                      </Ripple>
                    </GridLayout>
                  </CardView>
                </StackLayout>
              </WrapLayout>
            </ScrollView>
          </TabViewItem>
          <TabViewItem title="Tests">
            <Label text="Content for Tab 2" />
          </TabViewItem>
          <TabViewItem title="Marks">
            <Label text="Content for Tab 2" />
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
      notification: {
        sender: "Admin",
        time: "3 mins ago",
        title: "WHO IS THIS?",
        message: "I think i know you, dont I???"
      },
      introTxt: "Digitalize your business and keep track of all your earnings."
    };
  },
  mounted() {
    this.pageLoaded();
  },
  props: ["moduleId"],
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: appSettings,
        doc: "admin"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
