<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title class="headline">
          国リスト
        </v-card-title>
        <v-card-text class="scroll-inner">
          <v-data-table
            :headers="headers"
            :items="ranking"
            :options.sync="options"
            :loading="loading"
            hide-default-footer
            class="elevation-1"
            :mobile-breakpoint="0"
            dense
          >
            <template #item.flag="props">
              <country-flag :country="props.item.country"></country-flag>
            </template>
            <template #item.country="props">
              {{ (countryData[props.item.country] || {}).name }}
              ({{ props.item.country }})
            </template>
            <template #item.count="props">
              {{ Number(props.item.count).toLocaleString() }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import countryData from '@/assets/country.json';

export default {
  data: () => ({
    countryData,
    options: {
      itemsPerPage: -1,
      sortBy: ['count'],
      sortDesc: [true],
    },
    loading: false,
    headers: [
      {
        text: '',
        value: 'flag',
        sortable: false,
        align: 'center',
        width: '2rem',
      },
      {
        text: '国名',
        value: 'country',
      },
      {
        text: 'プレイヤー数',
        value: 'count',
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
        const { data } = await this.$axios.get(
          'https://api.mchel.net/v1/player_country',
        );
        console.log(data);
        this.ranking = data;
      } catch (e) {
        console.error(e.response);
      }
    },
    getCountryName(code) {
      return countryData[code] ? countryData[code].name : '';
    },
  },
  head: {
    title: 'General',
  },
};
</script>
