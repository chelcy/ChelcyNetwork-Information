<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="headline">
          BAN者リスト
          <v-spacer></v-spacer>
          <v-btn fab dark small color="indigo" @click="init">
            <v-icon>fas fa-redo</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap mb-3>
            <v-flex xs12 md4 xl3 offset-md8 offset-xl9>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-data-table
            :headers="headers"
            :items="ranking"
            :options.sync="options"
            :footer-props="{
              showFirstLastPage: true,
              'items-per-page-options': rows_per_page_items,
            }"
            :search="search"
            :loading="loading"
            class="elevation-1"
            dense
          >
            <template #item.name="props">
              <v-tooltip top>
                <template #activator="{ on }">
                  <span v-on="on">{{ props.item.name }}</span>
                </template>
                <span>{{ props.item.uuid }}</span>
              </v-tooltip>
            </template>
            <template #item.epoch="props">
              {{
                dateFns.format(
                  dateFns.fromUnixTime(props.item.epoch),
                  'yyyy/MM/dd HH:mm:ss',
                )
              }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { format, fromUnixTime } from 'date-fns';

export default {
  data: () => ({
    dateFns: {
      format,
      fromUnixTime,
    },
    search: '',
    options: {
      itemsPerPage: 100,
      sortBy: ['epoch'],
      sortDesc: [true],
    },
    rows_per_page_items: [20, 50, 100, 200, { text: 'All', value: -1 }],
    loading: false,
    headers: [
      {
        text: 'プレイヤー名',
        value: 'name',
      },
      {
        text: 'サーバー',
        value: 'server',
      },
      {
        text: '理由',
        value: 'reason',
      },
      {
        text: '日時',
        value: 'epoch',
      },
    ],
    ranking: [],
  }),
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      await this.setRanking();
      this.loading = false;
    },
    // ランキングの取得
    async setRanking() {
      try {
        let { data } = await this.$axios.get('https://api.mchel.net/v1/ban');
        console.log(data);
        this.ranking = data;
      } catch (e) {
        console.error(e.response);
      }
    },
  },
};
</script>
