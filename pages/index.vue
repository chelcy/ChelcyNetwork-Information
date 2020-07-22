<template>
  <v-row>
    <v-col
      v-for="(item, index) in statusData"
      :key="index"
      cols="12"
      lg="4"
      xl="3"
    >
      <v-card class="elevation-5 ma-2">
        <v-card-title
          primary-title
          :class="item.color + ' ' + item.density_light"
        >
          <h4 class="mx-1">{{ item.text }}</h4>
        </v-card-title>
        <v-card-text v-if="!item.data" class="text-xs-center">
          <v-progress-circular
            indeterminate
            :color="item.color"
          ></v-progress-circular>
        </v-card-text>
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
                <v-icon color="success" class="mr-1">fas fa-check</v-icon>Online
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
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
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
      await this.setStatus();
    },
    async setStatus() {
      let tasks = [];
      this.statusData.forEach((server) => {
        server.data = null;
        let task = this.$axios
          .get('https://api.mchel.net/v1/server/' + server.key)
          .then((res) => {
            server.data = res.data;
          })
          .catch((e) => {
            console.log(e.response);
          });
        tasks.push(task);
      });
      await Promise.all(tasks);
    },
  },
};
</script>
