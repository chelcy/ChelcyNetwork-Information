<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="headline">
          採掘数ランキング
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
            :footer-props="{
              showFirstLastPage: true,
              'items-per-page-options': rows_per_page_items,
            }"
            :search="search"
            :loading="loading"
            class="elevation-1"
            dense
          >
            <template #item.block="props">
              {{ Number(props.item.block).toLocaleString() }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data: () => ({
    search: '',
    options: {
      itemsPerPage: 100,
    },
    rows_per_page_items: [20, 50, 100, 200, { text: 'All', value: -1 }],
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
        text: 'ブロック数',
        value: 'block',
      },
      {
        text: 'ランク',
        value: 'player_rank',
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
        let { data } = await this.$axios.get(
          'https://api.mchel.net/v1/manaita/ranking',
        );
        console.log(data);
        this.ranking = data;
      } catch (e) {
        console.error(e.response);
      }
    },
  },
};
</script>
