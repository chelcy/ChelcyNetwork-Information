<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="headline">
          {{ name }}
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
          <v-data-table
            :headers="headers"
            :items="ranking"
            :options.sync="options"
            hide-default-footer
            :search="search"
            :loading="loading"
            class="elevation-1"
            dense
          >
            <template #item.time="props">
              {{
                dateFns.format(
                  new Date(props.item.time - 9 * 60 * 60 * 1000),
                  'HH:mm:ss.SSS',
                )
              }}
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
      itemsPerPage: -1,
    },
    loading: false,
    headers: [
      {
        text: '順位',
        value: 'rank',
      },
      {
        text: 'プレイヤー名',
        value: 'name',
      },
      {
        text: 'アスレタイム',
        value: 'time',
      },
      {
        text: '更新日時',
        value: 'epoch',
      },
    ],
    ranking: [],
    name: null,
  }),
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      const athleticName = this.$route.query.name;
      if (athleticName) {
        this.name = athleticName;
        await this.setRanking(athleticName);
      }
      this.loading = false;
    },
    // ランキングの取得
    async setRanking(name) {
      try {
        let { data } = await this.$axios.get(
          'https://api.mchel.net/v1/athletic/' + name + '/ranking',
        );
        console.log(data);
        this.ranking = data;
      } catch (e) {
        console.error(e.response);
      }
    },
  },
  watch: {
    $route(to, from) {
      this.init();
      this.search = null;
    },
  },
};
</script>
