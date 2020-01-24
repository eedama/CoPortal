import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: '#f96c5b',
        secondary: '#2d5afd',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
});
