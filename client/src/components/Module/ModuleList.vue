<template>
  <v-row class="screen">
    <v-col class="right text-right px-5" cols="12" md="10" offset-md="2">
      <v-btn right v-on:click="$router.back()" class="primary justify-end">
        <v-icon>mdi-keyboard-backspace</v-icon>
        <span class="px-2">Back</span>
      </v-btn>
    </v-col>
    <v-col
      cols="12"
      md="4"
      offset-md="4"
      class="mx-auto"
      v-if="userType !== 'STUDENT' && !addingModules"
    >
      <v-btn block v-on:click="addingModules = true" class="secondary"
        >Add Module</v-btn
      >
    </v-col>
    <v-col sm="12" md="6" offset-md="3" v-if="addingModules">
      <v-card>
        <v-content>
          <v-col class="right text-right px-5" cols="12">
            <v-btn class="right" right icon v-on:click="$router.back()">
              <v-icon :size="32" color="primary">mdi-close</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="10" class="text-center mx-auto">
            <v-subheading class="title text-center mx-auto">
              Adding a module
            </v-subheading>
          </v-col>
          <v-col cols="12" md="10" offset-md="1" class="mx-auto">
            <v-text-field
              v-model="module.name"
              prepend-inner-icon="mdi-book-open-variant"
              label="Module name"
              type="text"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="10" offset-md="1" class="mx-auto">
            <v-text-field
              v-model="module.code"
              prepend-inner-icon="mdi-google-classroom"
              label="Module code"
              type="text"
              outlined
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="10" offset-md="1" class="mx-auto">
            <v-textarea
              v-model="module.description"
              prepend-inner-icon="mdi-message-bulleted"
              label="Description"
              type="text"
              outlined
            ></v-textarea>
          </v-col>
          <v-col cols="12" md="10" offset-md="1" class="mx-auto">
            <p class="caption" v-if="txtError.length > 0">
              {{ txtError }}
            </p>
          </v-col>
          <v-col cols="12" md="10" offset-md="1" class="mx-auto">
            <v-btn
              :loading="isLoading"
              v-on:click="SubmitModule()"
              block
              color="secondary"
            >
              Submit module
            </v-btn>
          </v-col>
        </v-content>
      </v-card>
    </v-col>
    <v-col v-if="!addingModules" sm="12" md="6" offset-md="3">
      <v-text-field
        class="text-center mx-auto text-xs-center"
        color="secondary"
        label="Search"
        v-on:keypress.enter="DeepSearch"
        solo
        block
        prepend-inner-icon="mdi-magnify"
        v-model="txtSearch"
      >
      </v-text-field>
    </v-col>

    <v-col
      cols="12"
      md="10"
      offset-md="1"
      v-if="!addingModules"
      class="mx-auto"
    >
      <v-data-table
        :headers="headers"
        :items="makeTableItems(filteredModules)"
        class="elevation-1"
        item-key="_id"
        :items-per-page="100"
        @click:row="arg => goToModule(arg._id)"
        :loading="isLoading"
        loading-text="Loading... Please wait"
      >
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
import swal from "sweetalert2";

const axios = require("axios");

export default {
  name: "StidentList",
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "left",
          sortable: true,
          value: "name"
        },
        {
          text: "Code",
          align: "left",
          sortable: true,
          value: "code"
        },
        {
          text: "Description",
          align: "left",
          sortable: true,
          value: "description"
        },
        {
          text: "Lecturers",
          align: "left",
          sortable: true,
          value: "lecturerDetails"
        },
        {
          text: "Total students",
          align: "left",
          sortable: true,
          value: "totalStudents"
        },
        {
          text: "Total online tests",
          align: "left",
          sortable: true,
          value: "totalOnlineTests"
        }
      ],
      txtSearch: "",
      txtError: "",
      module: {
        name: "",
        code: "",
        description: ""
      },
      addingModules: false,
      modules: [],
      selectedStudent: null,
      isLoading: false,
      userType: ""
    };
  },
  computed: {
    filteredModules() {
      return this.modules.filter(
        m =>
          this.txtSearch.length < 1 ||
          JSON.stringify(m)
            .toLowerCase()
            .indexOf(this.txtSearch.toLowerCase()) >= 0
      );
    }
  },
  mounted() {
    this.isLoading = true;
    this.userType = this.$store.state.user.type;
    axios
      .get(
        this.$store.state.settings.baseLink +
          "/m/modules/all/for/" +
          this.$store.state.user.id +
          "/" +
          this.$store.state.user.type
      )
      .then(results => {
        this.isLoading = false;
        this.modules = results.data;
        this.modules.map(s => {
          s.show = true;
        });
      })
      .catch(err => {
        this.isLoading = false;
        if (err.response != null && err.response.status == 512) {
          swal.fire(err.response.data, "error");
        } else {
          swal.fire("Unable to load modules", "Try again later", "error");
        }
      });
  },
  methods: {
    makeTableItems(items) {
      if (!items) return [];
      return items.map(v => {
        return {
          ...v,
          lecturerDetails: v.lecturers
            ? v.lecturers
                .filter(b => b.lastname && b.firstname)
                .reduce((a, b) => a + `${b.lastname} ${b.firstname} , `, "")
            : null,
          totalStudents: v.students ? v.students.length : null,
          totalOnlineTests: v.questionaires ? v.questionaires.length : null
        };
      });
    },
    DeepSearch() {
      alert("Deep searching for " + this.txtSearch);
    },
    goToSolution(solutionId) {
      this.$router.push({
        name: "TestMarks",
        params: {
          solutionId: solutionId
        }
      });
    },
    SubmitModule() {
      this.isLoading = true;
      this.txtError = "";
      if (this.module.name.length < 2) {
        this.txtError = "Please enter a valid module name";
      }

      if (this.module.code.length < 2) {
        this.txtError = "Please enter a valid module code";
      }

      if (this.txtError.length > 2) {
        this.isLoading = false;
        return;
      }

      axios
        .post(this.$store.state.settings.baseLink + "/m/add/new/module", {
          module: this.module
        })
        .then(results => {
          this.isLoading = false;
          this.modules = results.data;
          this.addingModules = false;
        })
        .catch(err => {
          this.isLoading = false;
          if (err.response != null && err.response.status == 512) {
            this.txtError = err.response.data;
          } else {
            swal.fire("Unable to submit the module", err.message, "error");
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.screen {
  background-image: url("/static/img/coPortalLogo.jpg");
  /* Full height */
  height: 100vh;
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: fit;
}
</style>

