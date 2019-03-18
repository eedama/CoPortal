<template>
  <page actionBarHidden="true">
    <GridLayout rows="auto" columns="*">
      <ScrollView>
        <StackLyout v-for="(_student,i) in studentList" :key="i">
          <cardView height="100" textAlignment="center" elevation="5" margin="10">
            <GridLayout rows="auto,auto,auto,auto,auto" cols="*,auto">
              <label
                row="0"
                col="0"
                :textWrap="true"
                verticalAlignment="center"
                class="text-dark-black p-2 mdi-card-text"
                :text="_student.firstname"
              ></label>
              <label
                row="1"
                col="0"
                :textWrap="true"
                class="text-dark-black p-2"
                verticalAlignment="left"
                :text="_student.lastname"
              ></label>
              <label
                row="2"
                col="0"
                :textWrap="true"
                class="text-dark-black p-2"
                verticalAlignment="left"
                :text=" _student.gender"
              ></label>
              <label
                row="3"
                col="0"
                :textWrap="true"
                class="text-dark-black p-2"
                verticalAlignment="left"
                :text="_student.idNumber"
              ></label>
              <label
                row="4"
                col="0"
                :textWrap="true"
                class="text-dark-black p-2"
                verticalAlignment="left"
                :text="_student.isSouthAfrican"
              ></label>
            </GridLayout>
          </cardView>
        </StackLyout>
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