<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>Minecraft サーバーステータス</h2>
      </v-col>
      <v-col
        v-for="(item, index) in statusData"
        :key="index"
        cols="12"
        md="6"
        lg="4"
        xl="3"
      >
        <v-card class="elevation-4">
          <v-card-title
            primary-title
            :class="[item.color, item.density_light, 'py-2']"
          >
            <h4 class="mx-1">{{ item.text }}</h4>
          </v-card-title>
          <v-list dense v-if="item.data">
            <v-list-item>
              <v-list-item-content>プレイヤー数</v-list-item-content>
              <v-list-item-content class="text-right">
                <span> {{ item.data.count }} / {{ item.data.max }} </span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>ステータス</v-list-item-content>
              <v-list-item-content v-if="item.data.online" class="text-right">
                <span>
                  <v-icon color="success" class="mr-1">fas fa-check</v-icon
                  >Online
                </span>
              </v-list-item-content>
              <v-list-item-content v-else class="text-right">
                <span>
                  <v-icon color="red" class="mr-1">fas fa-times</v-icon>Offline
                </span>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>バージョン</v-list-item-content>
              <v-list-item-content class="text-right">
                <span>
                  {{ item.data.version }}
                </span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text v-else>
            <v-skeleton-loader type="table-heading@3"></v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <h2>プレイヤー数総計</h2>
        <div class="text-center">
          <span class="text-h3">
            {{ Number(playerCount).toLocaleString() }}
          </span>
          <span class="text-h6 text-secondary">
            players
          </span>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <h2>総採掘数</h2>
        <div class="text-center">
          <span class="text-h3">
            {{ Number(manaitaCount).toLocaleString() }}
          </span>
          <span class="text-h6 text-secondary">
            blocks
          </span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    playerCount: null,
    manaitaCount: null,
    statusData: [
      {
        text: 'ChelcyNetwork',
        color: 'blue',
        density_light: 'lighten-4',
        key: 'bungee',
        data: null,
      },
      {
        text: 'Hub',
        color: 'light-blue',
        density_light: 'lighten-4',
        key: 'hub',
        data: null,
      },
      {
        text: 'Athletic',
        color: 'green',
        density_light: 'lighten-4',
        key: 'athletic',
        data: null,
      },
      {
        text: 'Manaita',
        color: 'red',
        density_light: 'lighten-4',
        key: 'manaita',
        data: null,
      },
    ],
  }),
  created() {
    this.init();
  },
  methods: {
    async init() {
      await Promise.all([
        this.setPlayerCount(),
        this.setManaitaCount(),
        this.setStatus(),
      ]);
    },
    async setPlayerCount() {
      try {
        const res = await fetch(
          `https://api.mchel.net/v1/player_count`,
        ).then((r) => r.json());
        this.playerCount = res.count;
      } catch (error) {
        console.error(error);
      }
    },
    async setManaitaCount() {
      try {
        const res = await fetch(
          `https://api.mchel.net/v1/manaita/count`,
        ).then((r) => r.json());
        this.manaitaCount = res.count;
      } catch (error) {
        console.error(error);
      }
    },
    async setStatus() {
      await Promise.all(
        this.statusData.map(async (server) => {
          try {
            const statusRes = await fetch(
              `https://api.mchel.net/v1/server/${server.key}`,
            ).then((r) => r.json());
            server.data = statusRes;
          } catch (error) {
            console.error(error);
            server.data = null;
          }
        }),
      );
    },
  },
  head: {
    title: 'Welcome',
  },
};
</script>
