<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto,*" columns="*">
      <ScrollView orientation="vertical">
        <StackLayout>
          <cardView
            v-for="(_student,i) in studentList"
            :key="i"
            height="240"
            elevation="5"
            margin="10"
            textAlignment="center"
          >
            <ScrollView width="100%">
              <GridLayout
                rows="auto,auto,auto,auto,auto,auto,auto,auto,auto"
                columns="auto,*"
                class="p-x-20 p-y-15"
              >
                <StackLayout verticalAlignment="center" row="0">
                  <label
                    row="0"
                    textAlignment="center"
                    class="labelTitle m-t-2"
                    :text="_student.firstname + ' ' + _student.lastname"
                  ></label>
                </StackLayout>
                <label
                  row="1"
                  col="0"
                  rowspan="2"
                  class="text-dark-black text-dark-black mdi"
                  textAlignment="left"
                  fontSize="20%"
                  verticalAlignment="center"
                  :text="'mdi-account' | fonticon "
                ></label>
                <label
                  row="1"
                  col="1"
                  verticalAlignment="center"
                  textAlignment="left"
                  class="font-weight-bold m-t-0 text-dark-black"
                  text="IDNumber"
                ></label>
                <label
                  row="2"
                  col="2"
                  fontSize="15"
                  class="font-weight-bold"
                  textAlignment="left"
                  :text="_student.idNumber"
                ></label>
                <label
                  row="3"
                  col="0"
                  rowspan="2"
                  fontSize="20%"
                  class="font-weight-bold m-r-20 p-t-5 text-dark-black mdi"
                  :text="'mdi-human-male-female' | fonticon"
                ></label>
                <label
                  row="3"
                  col="1"
                  textAlignment="left"
                  class="font-weight-bold p-t-5 text-dark-black"
                  verticalAlignment="center"
                  fontSize="15"
                  text="Gender"
                ></label>
                <label row="4" col="1" fontSize="15" textAlignment="left" :text="_student.gender"></label>
                <label
                  row="5"
                  col="0"
                  rowspan="2"
                  fontSize="20%"
                  class="font-weight-bold m-r-20 p-t-5 mdi text-dark-black"
                  :text="'mdi-flag' | fonticon"
                ></label>
                <label
                  row="5"
                  col="1"
                  textAlignment="left"
                  class="font-weight-bold p-t-5 text-dark-black"
                  verticalAlignment="center"
                  fontSize="15"
                  text="Nationality"
                ></label>
                <label
                  row="6"
                  col="1"
                  class="font-weight-bold"
                  v-if="_student.isSouthAfrican == true"
                  text="South African"
                ></label>
                <label
                  row="7"
                  col="0"
                  rowspan="2"
                  class="font-weight-bold m-r-20 p-t-10 mdi text-dark-black"
                  fontSize="20%"
                  :text="'mdi-book-open-variant' | fonticon"
                ></label>
                <label
                  row="7"
                  col="1"
                  verticalAlignment="center"
                  textAlignment="left"
                  class="font-weight-bold p-t-5 text-dark-black"
                  text="Modules"
                ></label>
                <label
                  row="8"
                  col="1"
                  class="font-weight-bold mdi"
                  v-for="(_module,i) in studentList.modules"
                  :key="i"
                  :text="_module.code[i] + ',' "
                ></label>
              </GridLayout>
            </ScrollView>
          </cardView>
        </StackLayout>
      </ScrollView>
    </GridLayout>
  </page>
</template>
<script>
export default {
  data() {
    return {
      studentList: []
    };
  },

  mounted() {
    //this.pageLoaded();

    if (!this.$store.state.cache.cachedUser) {
      this.navigate("/login", null, {
        clearHistory: true
      });
    }

    this.isLoading = true;

    this.$api

      .getStudentList()

      .then(_students => {
        this.studentList = JSON.parse(JSON.stringify(_students));

        if (_students.length == 0) {
          this.$feedback.warning({
            title: "Students",

            message: "No Students Available",

            duration: 5000
          });
        }

        this.isLoading = false;
      })

      .catch(err => {
        this.$feedback.error({
          title: "Error in getting students",

          message: err.message,

          duration: 10000
        });

        this.isLoading = false;
      });
  },

  methods: {}
};
</script>

<style lang="scss"scoped>
.labelTitle {
  color: black;
  font-size: 20px;
  font-weight: bold;
}
</style>