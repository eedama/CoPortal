<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="text-dark-black" fontSize="35%" text="CSC1A20"></label>
          <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Computer science 3B"></label>
        </GridLayout>
      </StackLayout>
      <StackLayout row="1">
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
          <TabViewItem title="Marks">
            <Label text="Content for Tab 2" />
          </TabViewItem>
          <TabViewItem title="Tests">
            <ScrollView>
              <StackLayout>
                <CardView v-for="a in 15" :key="a" elevation="15" margin="5">
                <Ripple @tap="TakeTest(a)">
                      <GridLayout verticalAlignment="center" class="p-10" rows="auto,auto" columns="auto,*,auto">
                      <label row="0" col="0" rowSpan="2" verticalAlignment="center" textAlignment="center" class="font-weight-bold mdi p-15" fontSize="25%" :text="'mdi-file-document-box-multiple' | fonticon "></label>
                      <label row="0" col="1" verticalAlignment="center" class="font-weight-bold" :textWrap="true" fontSize="17%" text="Geography test 101"></label>
                      <label row="1" col="1" verticalAlignment="center" :textWrap="true" fontSize="15%" text="101 Questions"></label>
                      <label row="1" col="2" verticalAlignment="center" class="h4 text-dark-black" text="10 minutes ago"></label>
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
    },
    TakeTest(a) {
      this.navigate("/take/test", {
        questionaireId: a
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
