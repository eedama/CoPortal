<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,auto,*" columns="*">
      <StackLayout verticalAlignment="center" row="0" class="m-y-10">
        <Image
          horizontalAlignment="center"
          stretch="aspectFill"
          width="150"
          height="150"
          borderRadius="100%"
          src="https://avatars2.githubusercontent.com/u/13318139?s=460&v=4"></Image>
        <label row="0" class="labelTitle m-t-5" textAlignment="center">Joseph Sirwali</label>
        <label row="0" class="labelname" textAlignment="center">joe234</label>
      </StackLayout>
      <StackLayout row="1">
        <CardView textAlignment="center" margin="10">
          <FlexboxLayout
            class="m-10"
            justifyContent="space-between"
            width="100%"
            alignSelf="center"
            height="100%"
            flexDirection="column"
          >
            <GridLayout
              row="0"
              class="text-dark-black email-grid m-20"
              rows="auto,auto"
              columns="auto,*"
            >
              <label
                row="0"
                col="0"
                class="mdi text-dark-black m-20"
                verticalAlignment="center"
                textAlignment="left"
                fontSize="25%"
                :text="'mdi-account' | fonticon"
              ></label>
              <label
                row="0"
                col="1"
                class="font-weight-bold"
                fontSize="13%"
                verticalAlignment="center"
                textAlignment="left"
                text="ID Number"
              ></label>
              <label
                row="1"
                col="1"
                fontSize="12%"
                textAlignment="left"
                class="text-left-margin"
                text="99054938382086"
              ></label>
            </GridLayout>
            <GridLayout
              class="text-dark-black email-grid"
              row="1"
              rows="auto,auto"
              columns="auto,*"
            >
              <label
                row="0"
                col="0"
                class="mdi icon-stager"
                verticalAlignment="center"
                textAlignment="left"
                fontSize="40px"
                :text="'mdi-email' | fonticon"
              ></label>
              <label
                row="0"
                col="1"
                class="font-weight-bold"
                fontSize="13%"
                verticalAlignment="center"
                textAlignment="left"
                text="Email"
              ></label>
              <label
                row="1"
                col="1"
                fontSize="12%"
                textAlignment="left"
                class="text-left-margin"
                text="sirwali@gmail.com"
              ></label>
            </GridLayout>
            <GridLayout
              class="text-dark-black email-grid"
              row="1"
              rows="auto,auto"
              columns="auto,*"
            >
              <label
                row="0"
                col="0"
                class="mdi icon-stager"
                verticalAlignment="center"
                textAlignment="left"
                fontSize="40px"
                :text="'mdi-library' | fonticon"
              ></label>
              <label
                row="0"
                col="1"
                class="font-weight-bold"
                fontSize="13%"
                verticalAlignment="center"
                textAlignment="left"
                text="Modules"
              ></label>
              <label
                row="1"
                col="1"
                fontSize="12%"
                textAlignment="left"
                class="text-left-margin"
                text="Physc,EngFal,Lo,Maths"
              ></label>
            </GridLayout>
          </FlexboxLayout>
        </CardView>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script>
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
        doc: "admin"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.labelTitle {
  color: black;
  font-size: 29px;
  font-weight: bold;
}
.labelname {
  color: black;
  opacity: 0.4;
  font-size: 15px;
}
.text-left-margin {
  margin-top: -40px;
}

.icon-stager {
  margin-top: 20px;
  opacity: 0.8;
  margin-right: 20px;
}
.email-grid {
  margin-left: 25px;
}
</style>
