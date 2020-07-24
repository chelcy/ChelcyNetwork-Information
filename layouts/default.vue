<template>
  <v-app>
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

        <v-list-group prepend-icon="fas fa-running" value="true" no-action>
          <template #activator>
            <v-list-item-content>
              <v-list-item-title>Athletics</v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link to="/athletics/ranking">
            <v-list-item-content>
              <v-list-item-title>Ranking</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item link to="/athletics/hardAthletics">
            <v-list-item-content>
              <v-list-item-title>Hard athletics</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item to="/manaita/ranking" router exact>
          <v-list-item-action>
            <v-icon>fas fa-mountain</v-icon>
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
      <v-toolbar-title
        v-text="title"
        @click="$router.push('/')"
        style="cursor: pointer;"
      />
      <v-spacer></v-spacer>

      <template v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn text href="https://www.mchel.net" target="_blank">
          <v-avatar size="29" class="mr-1">
            <img src="/favicon.ico" />
          </v-avatar>
          <span class="text-caption">ChelcyNetwork Web</span>
        </v-btn>
        <v-btn text href="https://twitter.com/ChelcyNetwork" target="_blank">
          <v-icon class="mr-1">
            fab fa-twitter
          </v-icon>
          <span class="text-caption">@ChelcyNetwork</span>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer
      app
      dark
      color="light-blue accent-4"
      absolute
      inset
      class="py-1 px-0"
    >
      <v-spacer></v-spacer>

      <div class="mx-1 text-body-2">
        <span>&copy; 2020 Chelcy</span>
      </div>

      <div class="mx-1">
        <v-btn
          icon
          small
          href="https://twitter.com/chelcy_nico"
          target="_blank"
        >
          <v-icon small>
            fab fa-twitter
          </v-icon>
        </v-btn>
        <v-btn
          icon
          small
          href="https://github.com/chelcy/ChelcyNetwork-Information"
          target="_blank"
        >
          <v-icon small>
            fab fa-github
          </v-icon>
        </v-btn>
        <v-btn
          icon
          small
          href="https://github.com/chelcy/ChelMoji/releases"
          target="_blank"
        >
          ち
        </v-btn>
      </div>

      <div class="mx-1">
        <a
          @click="$router.push('/privacy-policy')"
          class="white--text text-caption"
        >
          プライバシーポリシー
        </a>
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
    title: 'ChelcyNetwork Information',
  }),
  created() {
    this.getAthletics();
  },
  methods: {
    async getAthletics() {
      try {
        const data = await fetch(
          'https://asia-east2-freegcptrial.cloudfunctions.net/chelcynetwork-athletic-json',
        ).then((r) => r.json());

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
