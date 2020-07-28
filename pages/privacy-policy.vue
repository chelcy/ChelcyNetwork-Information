<template>
  <v-row justify="center">
    <v-col cols="12" lg="10">
      <div v-html="$md.render(policy)"></div>
    </v-col>
  </v-row>
</template>

<script>
import metaMixin from '@/mixins/meta';
import policy from '@/assets/privacy-policy.md';

export default {
  data: () => ({
    policy,
  }),
  mixins: [metaMixin],
};
</script>
