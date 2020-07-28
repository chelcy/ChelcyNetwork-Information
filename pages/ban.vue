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
          <v-row class="mb-3">
            <v-col cols="12" md="4" xl="3" offset-md="8" offset-xl="9">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="scroll-inner">
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
              :mobile-breakpoint="0"
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
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import metaMixin from '@/mixins/meta';
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
  computed: {
    meta() {
      return {
        title: 'Ban',
        url: window.location.href,
      };
    },
  },
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
        const data = await fetch('https://api.mchel.net/v1/ban').then((r) =>
          r.json(),
        );
        this.ranking = data;
      } catch (e) {
        console.error(e.response);
      }
    },
  },
  mixins: [metaMixin],
};
</script>
