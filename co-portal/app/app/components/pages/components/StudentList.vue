<template>
  <page actionBarHidden="true">
    <GridLayout rows="*" columns="*">
      <ScrollView orientation="vertical">
        <StackLayout>
          <cardView
            v-for="(_student,i) in studentList"
            :key="i"
            height="150"
            elevation="5"
            margin="10"
          >
            <Ripple>
              <GridLayout rows="auto,auto,auto,auto" columns="auto,auto">
                <label
                  row="0"
                  colspan="1"
                  :textWrap="true"
                  textAlignment="center"
                  verticalAlignment="center"
                  class="text-dark-black font-weight-bold p-2 card-title p-l-30"
                  :text="_student.firstname + ' ' + _student.lastname"
                ></label>
                <label
                  row="1"
                  col="0"
                  colspan="0"
                  class="font-weight-bold mdi p-5"
                  textAlignment="left"
                  fontSize="20%"
                  :text="'mdi-human-male-female' | fonticon "
                ></label>
                <label
                  row="1"
                  col="1"
                  :textWrap="true"
                  class="text-dark-black font-weight-bold mdi-card-text p-2"
                  :text=" _student.gender"
                ></label>
                <label
                  row="2"
                  col="0"
                  colspan="0"
                  class="font-weight-bold mdi p-5"
                  fontSize="20%"
                  :text="'mdi-account-outline' | fonticon"
                ></label>
                <label
                  row="2"
                  col="1"
                  :textWrap="true"
                  textAlignment="left"
                  class="text-dark-black font-weight-bold mdi-card-text p-2"
                  :text="_student.idNumber"
                ></label>
                <label
                  row="3"
                  col="0"
                  colspan="0"
                  class="font-weight-bold mdi p-5"
                  fontSize="20%"
                  :text="'mdi-flag' | fonticon"
                ></label>
                <label
                  row="3"
                  col="1"
                  :textWrap="true"
                  class="text-dark-black font-weight-bold mdi-card-text p-l-0"
                  :text="_student.isSouthAfrican"
                ></label>
              </GridLayout>
            </Ripple>
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