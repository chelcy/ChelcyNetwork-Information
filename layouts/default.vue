<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :clipped="true" fixed app>
      <v-list dense>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-title v-text="item.title" />
        </v-list-item>
        <v-list-item to="/general" router exact>
          <v-list-item-action>
            <v-icon>fa fa-dna</v-icon>
          </v-list-item-action>
          <v-list-item-title>General</v-list-item-title>
        </v-list-item>

        <v-list-group prepend-icon="fa-running" value="true">
          <template v-slot:activator>
            <v-list-item-title>Athletics</v-list-item-title>
          </template>

          <v-list-group
            v-for="(category, index) in athletics"
            :key="index"
            no-action
            sub-group
          >
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-title>{{ category.head }}</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item
              v-for="(athletic, i) in category.name"
              :key="i"
              @click="toDetail(athletic)"
            >
              <v-list-item-title>{{ athletic }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>

        <v-list-item to="/manaita/ranking" router exact>
          <v-list-item-action>
            <v-icon>fa fa-truck-pickup</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Manaita</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item to="/ban" router exact>
          <v-list-item-action>
            <v-icon>fa fa-ban</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Ban</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="true"
      fixed
      app
      dense
      dark
      color="light-blue accent-4"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer app dark color="light-blue accent-4" absolute inset>
      <v-spacer></v-spacer>
      <div>
        <span>&copy; 2019 ChelcyNetwork</span>
      </div>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    items: [
      {
        icon: 'apps',
        title: 'Welcome',
        to: '/',
      },
    ],
    athletics: [],
    title: 'ChelcyNetwork Athletic Ranking',
  }),
  created() {
    this.getAthletics();
  },
  methods: {
    async getAthletics() {
      try {
        const { data } = await this.$axios.get(
          'https://asia-east2-freegcptrial.cloudfunctions.net/chelcynetwork-athletic-json',
        );
        this.athletics = Object.entries(data)
          .map(([key, value]) => value)
          .reduce((acc, val) => acc.concat(val), []);
      } catch (e) {
        console.error(e.response);
      }
    },
    toDetail(name) {
      this.$router.push({
        name: 'athletics-ranking',
        query: {
          name: name,
        },
      });
    },
  },
};
</script>
