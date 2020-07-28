// デフォルトメタ
export const defaultMeta = {
  title: 'ChelcyNetwork Information',
  description:
    'ちぇる鯖の各種情報を表示するwebです。アスレランキングやサーバーステータスなどが確認できます。',
  type: 'website',
  url: process.env.URL,
  image: 'https://www.mchel.net/img/favicon.ico',
};

// メタからheadを生成する
export const generateHead = (meta = {}) => {
  return {
    title: meta.title,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: meta.description,
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: meta.title,
      },
      { hid: 'og:type', property: 'og:type', content: meta.type },
      { hid: 'og:url', property: 'og:url', content: meta.url },
      {
        hid: 'og:title',
        property: 'og:title',
        content: meta.title,
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: meta.description,
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: meta.image,
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:site',
        content: '@chelcy_nico',
      },
      {
        hid: 'og:country-name',
        property: 'og:country-name',
        content: 'JP',
      },
    ],
  };
};

export default {
  head() {
    return generateHead({
      ...defaultMeta,
      ...this.meta,
    });
  },
};
