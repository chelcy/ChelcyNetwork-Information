<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h2>
          <span class="mr-4">クリア回数ランキング (Beta)</span>
          <v-btn dark @click="dialog.show = true">
            <span class="mr-4">選択</span>
            <v-icon>fas fa-bars</v-icon>
          </v-btn>
        </h2>
        <div class="mt-2">
          <h4>(クリア回数は、タイムアタック時のデータのみ計上しています。)</h4>
        </div>
      </v-col>
      <v-col cols="12" v-if="name">
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
            <div class="scroll-inner">
              <v-data-table
                :headers="headers"
                :items="ranking"
                :options.sync="options"
                hide-default-footer
                :search="search"
                :loading="loading"
                class="elevation-1"
                :mobile-breakpoint="0"
                dense
              >
              </v-data-table>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog.show" scrollable max-width="600px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title class="mr-6">アスレチック一覧</v-toolbar-title>
          <v-text-field
            v-model="dialog.search"
            solo
            hide-details
            append-icon="search"
            label="検索..."
            single-line
            clearable
          ></v-text-field>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="black--text">
          <v-list dense class="athletic-select-list">
            <v-list-group
              v-for="(category, categoryIndex) in computedAthletics"
              :key="categoryIndex"
              v-model="category.active"
              no-action
            >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ category.head }}
                    ({{ category.name.length }})
                  </v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(subName, subNameIndex) in category.name"
                :key="subNameIndex"
                @click="toDetail(subName)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="subName"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import metaMixin from '@/mixins/meta';
import { format, fromUnixTime } from 'date-fns';

export default {
  data: (vm) => ({
    athletics: [],
    dialog: {
      show: !vm.$route.query.name,
      search: '',
    },
    dateFns: {
      format,
      fromUnixTime,
    },
    search: '',
    options: {
      sortBy: ['rank'],
      sortDesc: [false],
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
        text: '回数',
        value: 'count',
      },
    ],
    ranking: [],
    name: null,
  }),
  computed: {
    meta() {
      return {
        title: `Athletics count ranking - ${this.name || ''}`,
        url: window.location.href,
      };
    },
    // フィルターしたアスレチック一覧
    computedAthletics() {
      return this.athletics.map((ath, i) => {
        return {
          ...ath,
          active: i === 0,
          name: ath.name.filter((n) => {
            return this.dialog.search
              ? n.toLowerCase().includes(this.dialog.search.toLowerCase())
              : true;
          }),
        };
      });
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getAthletics();
      await this.loadTable();
    },
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
    async loadTable() {
      this.loading = true;
      const athleticName = this.$route.query.name;
      if (athleticName) {
        this.name = athleticName;
        try {
          const data = await fetch(
            `https://api.mchel.net/v1/athletic/${this.name}/count`,
          ).then((r) => r.json());
          this.ranking = data;
        } catch (e) {
          console.error(e.response);
          this.ranking = [];
        }
      } else {
        this.ranking = [];
      }
      this.loading = false;
    },
    // クリック
    toDetail(name) {
      this.dialog.show = false;
      this.$router.push({
        name: 'athletics-countRanking',
        query: {
          name: name,
        },
      });
    },
  },
  mixins: [metaMixin],
  watch: {
    $route(to, from) {
      this.loadTable();
      this.search = null;
    },
  },
};
</script>
