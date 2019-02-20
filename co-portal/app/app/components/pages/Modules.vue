<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <StackLayout row="0">
        <GridLayout rows="auto,auto" columns="*">
          <label row="0" verticalAlignment="center" textAlignment="center" class="mdi text-dark-black" fontSize="50%" :text="'mdi-book-open-page-variant' | fonticon"></label>
          <label row="1" verticalAlignment="center" textAlignment="center" class="p-15 text-dark-black" fontSize="30%" text="Modules"></label>
        </GridLayout>
      </StackLayout>
      <ScrollView  verticalAlignment="bottom" row="1">
        <StackLayout verticalAlignment="bottom">
          <GridLayout v-for="a in 10" :key="a" rows="auto" columns="*,*">
            <CardView v-for="b in 2" :key="b" :col="b-1" elevation="5" margin="10">
              <Ripple>
                <GridLayout rows="auto,auto" columns="*" class="p-10" verticalAlignment="center" textAlignment="center">
                  <label row="0" :textWrap="true" class="font-weight-bold" fontSize="16%" verticalAlignment="center" textAlignment="center" text="Computer Sciences"></label>
                  <label row="1" :textWrap="true" class="text-dark-black" verticalAlignment="center" fontSize="14%" textAlignment="center" text="CSC1A10"></label>
                </GridLayout>
              </Ripple>
            </CardView>
          </GridLayout>
        </StackLayout>
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
      introTxt: "Digitalize your business and keep track of all your earnings."
    };
  },
  mounted() {
    this.pageLoaded();
  },
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
.topMainText {
  color: white;
  background-color: linear-gradient(
    top bottom,
    rgba(255, 0, 0, 0.5),
    rgba(255, 20, 0, 0.7),
    rgba(255, 0, 30, 0.5),
    rgba(255, 20, 30, 0.7)
  );
}

.backgroundImage {
  background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center
    center;
  background-size: cover;
  padding-top: 3%;
  padding-bottom: 3%;
}

.backgroundImageOverlay {
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
}

.bg-dark-blue-overlay {
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
