<template>
  <div class="home">
    <div class="row">
      <div class="col s10 offset-s1 m8 offset-m2">
        <img src="../assets/logo.png" class="responsive-img">
      </div>
      <div class="col s6 offset-s3 center-align">
        <h4 class="center-align">
          <vue-typer class="center-align" :text='titleText' erase-style='backspace'></vue-typer>
        </h4>
      </div>
    </div>
    <div class="row">
      <div v-for="(option,i) in options" :key="i" v-on:click="$router.push(option.link)" class="col m4 offset-m1 s6 pointer">
        <div class="card-panel hoverable">
          <h5 class="text-xs-center">{{ option.text }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      titleText: ["Welcome to Co-Portal.", "Please take a test"],
      options: [
        {
          text: "Set test",
          link: "/test/set"
        },
        {
          text: "Take test",
          link: "/test/take"
        }
      ]
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  text-align: center;
}

.right {
  float: initial !important;
}

.left {
  float: initial !important;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
