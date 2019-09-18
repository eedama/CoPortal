<template>
  <page class="bg-white" actionBarHidden="true">
    <GridLayout rows="auto,*,auto" columns="*">
      <StackLayout v-if="Solution" row="0">
        <Label class="m-10 t-18" textAlignment="center" textWrap="true">
          <FormattedString>
            <Span text="Your score is " />
            <Span :class="{'text-red':(Solution.mark*2 < Solution.answers.length)}" :text="Solution.mark" fontWeight="bold"/>
            <Span :class="{'text-red':(Solution.mark*2 < Solution.answers.length)}" text="/" />
            <Span :class="{'text-red':(Solution.mark*2 < Solution.answers.length)}" :text="Solution.answers.length" fontStyle="italic" />
          </FormattedString>
        </Label>
      </StackLayout>
      <ScrollView class="m-y-10" row="1">
        <StackLayout>
          <GridLayout class="m-10" v-for="a in 30" :key="a" :textAlignment="a%2 == 1 ? 'right' : 'left'" columns="*,auto,*">
              <CardView :textAlignment="a%2 == 1 ? 'right' : 'left'" :col="a%2" colSpan="2" :elevation="5" class="m-5 p-20">
                <GridLayout rows="auto,auto,auto" columns="auto,*,auto" :textAlignment="a%2 == 1 ? 'right' : 'left'">
                  <Image rowSpan="3" col="0" horizontalAlignment="center" stretch="aspectFill" width="60" height="60" borderRadius="30" :src="$store.state.settings.defaultProfilePic"></Image>
                  <label row="0" col="1" :textWrap="true" class="p-5 t-18" text="Joseph Sirwali" ></label>
                  <label row="0" col="2" :textWrap="true" class="p-5 t-14" text="10 minutes ago" ></label>
                  <label row="1" col="1" colSpan="2" class="p-5" :textWrap="true" v-for="i in a" :key="i" :text="a %3 == 1 ? 'Small text' : `This is the text This is the text This is the text This is the text This is the text This is the text`"></label>
                </GridLayout>
              </CardView>
          </GridLayout>
        </StackLayout>
      </ScrollView>
      <StackLayout row="2">
        <GridLayout columns="*,auto">
          <MDTextField class="m-5" verticalAlignment="center" autocapitalizationType="sentences" col="0" :maxLength="255" returnKeyType="send" :floating="false" keyboardType="text" variant="outline" hint="Type a message"/>
          <Ripple class="m-5" col="1" backgroundColor="#006064" verticalAlignment="center" borderRadius="25" height="50" width="50">
            <label class="mdi m-5 text-white" verticalAlignment="center" textAlignment="center" fontSize="30" :text="'mdi-send' | fonticon"></label>
          </Ripple>
        </GridLayout>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script>
export default {
  name: "TestMarks",
  data() {
    return {
      txtFeedback: "",
      currentPage: 0,
      Solution: null,
      feedbacks: [],
      addingFeedBack: false,
      autoRefreshChats: false,
      refreshTimer: "",
      isLoading: false
    };
  },
  computed: {},
  mounted() {
    if (this.solutionId == null) {
      this.navigate(null);
      return;
    }
    this.isLoading = true;
    
    this.$api.getSolutions(this.solutionId)
      .then(results => {
        this.isLoading = false;
        if (results == null) {
          this.navigate(null);
          return;
        }
        this.Solution = JSON.parse(JSON.stringify(results));
        if (
          this.Solution == null ||
          this.Solution.answers == null ||
          this.Solution.answers.length < 1
        ) {
          throw new Error("Unable to retreive the solution , try again later");
        }
      })
      .catch(err => {
        this.isLoading = false;
        this.$feedback.error({
          title:'Unable to load your results',
          message: err.message
        });
        this.navigate(null);
        return;
      });
  },
  props: ["solutionId"],
  methods: {
    toggleAutoRefresh() {
      if (this.autoRefreshChats) {
        this.refreshTimer = setInterval(this.refreshFeedbacks, 5000);
      } else {
        clearInterval(this.refreshTimer);
      }
    },
    getMoment(value) {
      return moment(value);
    },
    DownloadMarks() {
      window.print();
    },
    ViewMemorandum() {
      swal(
        "Memorandum not yet avaliable",
        "Not all students have wrote the test",
        "error"
      );
    },
    refreshFeedbacks() {
      this.isLoading = true;
      axios
        .get(
          this.$store.state.settings.baseLink +
            "/l/feedback/reload/" +
            this.Solution.questionaireId
        )
        .then(results => {
          this.isLoading = false;
          this.feedbacks = [];
          results.data.forEach(element => {
            this.feedbacks.push(element);
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.feedbacks.map(o => {
            if (o.status != "sent") {
              o.status = "not sent";
            }
          });
          swal("Unable to submit questionaire", err.message, "error");
        });
    },
    openCloseFeedbacks() {
      this.addingFeedBack = !this.addingFeedBack;
      if (this.addingFeedBack) {
        this.refreshFeedbacks();
      }
    },
    SubmitFeedback() {
      this.isLoading = true;
      if (!this.$store.state.user.isLoggedIn) {
        swal(
          "Unable to send",
          "Your session is over please log in again",
          "error"
        );
        this.isLoading = false;
        return;
      }
      if (this.txtFeedback.length < 1) {
        this.isLoading = false;
        return;
      }
      var feedback = {
        from: this.$store.state.user.username,
        message: this.txtFeedback,
        date: new Date(),
        status: "sending...."
      };
      if (this.$store.state.user.isParent) {
        feedback.from = `${
          feedback.from
        }'s (${this.$store.state.user.parent.relationship.toLowerCase()})`;
      }
      this.feedbacks.push(feedback);
      this.txtFeedback = "";

      axios
        .post(
          this.$store.state.settings.baseLink +
            "/l/feedback/submit/" +
            this.Solution.questionaireId,
          {
            fromId: this.$store.state.user.id,
            from: feedback.from,
            fromType: this.$store.state.user.type,
            message: feedback.message,
            date: feedback.date,
            existingId: this.feedbacks.map(m => m._id)
          }
        )
        .then(results => {
          this.isLoading = false;
          this.feedbacks = [];
          results.data.forEach(element => {
            this.feedbacks.push(element);
          });
        })
        .catch(err => {
          this.isLoading = false;
          this.feedbacks.map(o => {
            if (o.status != "sent") {
              o.status = "not sent";
            }
          });
          swal("Unable to submit questionaire", err.message, "error");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chip {
  height: inherit;
}

.chat {
  padding-top: 10px;
}

.chat .from {
  cursor: pointer;
  color: grey;
  margin-bottom: 0%;
  font-size: smaller;
}

.chat .time {
  margin-top: 0%;
  font-size: smaller;
}

.chat .notSent {
  border: 1px solid red;
}
</style>
