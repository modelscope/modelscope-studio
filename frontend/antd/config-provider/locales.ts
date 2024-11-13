import type { Locale } from 'antd/es/locale';

export const locales: Record<
  string,
  () => Promise<{ antd: Locale; dayjs: string }>
> = {
  ar_EG: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ar_EG'),
      import('dayjs/locale/ar'),
    ]);
    return {
      antd,
      dayjs: 'ar',
    };
  },

  az_AZ: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/az_AZ'),
      import('dayjs/locale/az'),
    ]);
    return {
      antd,
      dayjs: 'az',
    };
  },

  bg_BG: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/bg_BG'),
      import('dayjs/locale/bg'),
    ]);
    return {
      antd,
      dayjs: 'bg',
    };
  },

  bn_BD: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/bn_BD'),
      import('dayjs/locale/bn'),
    ]);
    return {
      antd,
      dayjs: 'bn',
    };
  },

  by_BY: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/by_BY'),
      import('dayjs/locale/be'), // Belarusian (Belarus)
    ]);
    return {
      antd,
      dayjs: 'be',
    };
  },

  ca_ES: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ca_ES'),
      import('dayjs/locale/ca'),
    ]);
    return {
      antd,
      dayjs: 'ca',
    };
  },

  cs_CZ: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/cs_CZ'),
      import('dayjs/locale/cs'),
    ]);
    return {
      antd,
      dayjs: 'cs',
    };
  },

  da_DK: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/da_DK'),
      import('dayjs/locale/da'),
    ]);
    return {
      antd,
      dayjs: 'da',
    };
  },

  de_DE: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/de_DE'),
      import('dayjs/locale/de'),
    ]);
    return {
      antd,
      dayjs: 'de',
    };
  },

  el_GR: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/el_GR'),
      import('dayjs/locale/el'),
    ]);
    return {
      antd,
      dayjs: 'el',
    };
  },

  en_GB: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/en_GB'),
      import('dayjs/locale/en-gb'),
    ]);
    return {
      antd,
      dayjs: 'en-gb',
    };
  },

  en_US: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/en_US'),
      import('dayjs/locale/en'),
    ]);
    return {
      antd,
      dayjs: 'en',
    };
  },

  es_ES: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/es_ES'),
      import('dayjs/locale/es'),
    ]);
    return {
      antd,
      dayjs: 'es',
    };
  },

  et_EE: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/et_EE'),
      import('dayjs/locale/et'),
    ]);
    return {
      antd,
      dayjs: 'et',
    };
  },

  eu_ES: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/eu_ES'),
      import('dayjs/locale/eu'), // Basque
    ]);
    return {
      antd,
      dayjs: 'eu',
    };
  },

  fa_IR: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/fa_IR'),
      import('dayjs/locale/fa'),
    ]);
    return {
      antd,
      dayjs: 'fa',
    };
  },

  fi_FI: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/fi_FI'),
      import('dayjs/locale/fi'),
    ]);
    return {
      antd,
      dayjs: 'fi',
    };
  },

  fr_BE: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/fr_BE'),
      import('dayjs/locale/fr'),
    ]);
    return {
      antd,
      dayjs: 'fr',
    };
  },

  fr_CA: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/fr_CA'),
      import('dayjs/locale/fr-ca'),
    ]);
    return {
      antd,
      dayjs: 'fr-ca',
    };
  },

  fr_FR: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/fr_FR'),
      import('dayjs/locale/fr'),
    ]);
    return {
      antd,
      dayjs: 'fr',
    };
  },

  ga_IE: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ga_IE'),
      import('dayjs/locale/ga'), // Irish
    ]);
    return {
      antd,
      dayjs: 'ga',
    };
  },

  gl_ES: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/gl_ES'),
      import('dayjs/locale/gl'), // Galician
    ]);
    return {
      antd,
      dayjs: 'gl',
    };
  },

  he_IL: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/he_IL'),
      import('dayjs/locale/he'),
    ]);
    return {
      antd,
      dayjs: 'he',
    };
  },

  hi_IN: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/hi_IN'),
      import('dayjs/locale/hi'),
    ]);
    return {
      antd,
      dayjs: 'hi',
    };
  },

  hr_HR: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/hr_HR'),
      import('dayjs/locale/hr'),
    ]);
    return {
      antd,
      dayjs: 'hr',
    };
  },

  hu_HU: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/hu_HU'),
      import('dayjs/locale/hu'),
    ]);
    return {
      antd,
      dayjs: 'hu',
    };
  },

  hy_AM: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/hy_AM'),
      import('dayjs/locale/am'), // Armenian
    ]);
    return {
      antd,
      dayjs: 'am',
    };
  },

  id_ID: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/id_ID'),
      import('dayjs/locale/id'),
    ]);
    return {
      antd,
      dayjs: 'id',
    };
  },

  is_IS: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/is_IS'),
      import('dayjs/locale/is'),
    ]);
    return {
      antd,
      dayjs: 'is',
    };
  },

  it_IT: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/it_IT'),
      import('dayjs/locale/it'),
    ]);
    return {
      antd,
      dayjs: 'it',
    };
  },

  ja_JP: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ja_JP'),
      import('dayjs/locale/ja'),
    ]);
    return {
      antd,
      dayjs: 'ja',
    };
  },

  ka_GE: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ka_GE'),
      import('dayjs/locale/ka'), // Georgian
    ]);
    return {
      antd,
      dayjs: 'ka',
    };
  },

  kk_KZ: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/kk_KZ'),
      import('dayjs/locale/kk'), // Kazakh
    ]);
    return {
      antd,
      dayjs: 'kk',
    };
  },

  km_KH: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/km_KH'),
      import('dayjs/locale/km'), // Khmer
    ]);
    return {
      antd,
      dayjs: 'km',
    };
  },

  kmr_IQ: async () => {
    const [antd] = await Promise.all([
      import('antd/locale/kmr_IQ'),
      // Not available in Day.js, so no need to load a locale file.
    ]);
    return {
      antd: antd.default,
      dayjs: '',
    };
  },

  kn_IN: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/kn_IN'),
      import('dayjs/locale/kn'), // Kannada
    ]);
    return {
      antd,
      dayjs: 'kn',
    };
  },

  ko_KR: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ko_KR'),
      import('dayjs/locale/ko'),
    ]);
    return {
      antd,
      dayjs: 'ko',
    };
  },

  ku_IQ: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ku_IQ'),
      import('dayjs/locale/ku'), // Kurdish (Central)
    ]);
    return {
      antd,
      dayjs: 'ku',
    };
  },

  lt_LT: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/lt_LT'),
      import('dayjs/locale/lt'),
    ]);
    return {
      antd,
      dayjs: 'lt',
    };
  },

  lv_LV: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/lv_LV'),
      import('dayjs/locale/lv'),
    ]);
    return {
      antd,
      dayjs: 'lv',
    };
  },

  mk_MK: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/mk_MK'),
      import('dayjs/locale/mk'), // Macedonian
    ]);
    return {
      antd,
      dayjs: 'mk',
    };
  },

  ml_IN: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ml_IN'),
      import('dayjs/locale/ml'), // Malayalam
    ]);
    return {
      antd,
      dayjs: 'ml',
    };
  },

  mn_MN: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/mn_MN'),
      import('dayjs/locale/mn'), // Mongolian
    ]);
    return {
      antd,
      dayjs: 'mn',
    };
  },

  ms_MY: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ms_MY'),
      import('dayjs/locale/ms'),
    ]);
    return {
      antd,
      dayjs: 'ms',
    };
  },

  my_MM: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/my_MM'),
      import('dayjs/locale/my'), // Burmese
    ]);
    return {
      antd,
      dayjs: 'my',
    };
  },

  nb_NO: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/nb_NO'),
      import('dayjs/locale/nb'), // Norwegian Bokmål
    ]);
    return {
      antd,
      dayjs: 'nb',
    };
  },

  ne_NP: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ne_NP'),
      import('dayjs/locale/ne'), // Nepali
    ]);
    return {
      antd,
      dayjs: 'ne',
    };
  },

  nl_BE: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/nl_BE'),
      import('dayjs/locale/nl-be'), // Dutch (Belgium)
    ]);
    return {
      antd,
      dayjs: 'nl-be',
    };
  },

  nl_NL: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/nl_NL'),
      import('dayjs/locale/nl'), // Dutch (Netherlands)
    ]);
    return {
      antd,
      dayjs: 'nl',
    };
  },

  pl_PL: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/pl_PL'),
      import('dayjs/locale/pl'),
    ]);
    return {
      antd,
      dayjs: 'pl',
    };
  },

  pt_BR: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/pt_BR'),
      import('dayjs/locale/pt-br'), // Portuguese (Brazil)
    ]);
    return {
      antd,
      dayjs: 'pt-br',
    };
  },

  pt_PT: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/pt_PT'),
      import('dayjs/locale/pt'), // Portuguese (Portugal)
    ]);
    return {
      antd,
      dayjs: 'pt',
    };
  },

  ro_RO: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ro_RO'),
      import('dayjs/locale/ro'),
    ]);
    return {
      antd,
      dayjs: 'ro',
    };
  },

  ru_RU: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ru_RU'),
      import('dayjs/locale/ru'),
    ]);
    return {
      antd,
      dayjs: 'ru',
    };
  },

  si_LK: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/si_LK'),
      import('dayjs/locale/si'), // Sinhala
    ]);
    return {
      antd,
      dayjs: 'si',
    };
  },

  sk_SK: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/sk_SK'),
      import('dayjs/locale/sk'),
    ]);
    return {
      antd,
      dayjs: 'sk',
    };
  },

  sl_SI: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/sl_SI'),
      import('dayjs/locale/sl'),
    ]);
    return {
      antd,
      dayjs: 'sl',
    };
  },

  sr_RS: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/sr_RS'),
      import('dayjs/locale/sr'), // Serbian
    ]);
    return {
      antd,
      dayjs: 'sr',
    };
  },

  sv_SE: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/sv_SE'),
      import('dayjs/locale/sv'),
    ]);
    return {
      antd,
      dayjs: 'sv',
    };
  },

  ta_IN: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ta_IN'),
      import('dayjs/locale/ta'), // Tamil
    ]);
    return {
      antd,
      dayjs: 'ta',
    };
  },

  th_TH: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/th_TH'),
      import('dayjs/locale/th'),
    ]);
    return {
      antd,
      dayjs: 'th',
    };
  },

  tk_TK: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/tk_TK'),
      import('dayjs/locale/tk'), // Turkmen
    ]);
    return {
      antd,
      dayjs: 'tk',
    };
  },

  tr_TR: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/tr_TR'),
      import('dayjs/locale/tr'),
    ]);
    return {
      antd,
      dayjs: 'tr',
    };
  },

  uk_UA: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/uk_UA'),
      import('dayjs/locale/uk'), // Ukrainian
    ]);
    return {
      antd,
      dayjs: 'uk',
    };
  },

  ur_PK: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/ur_PK'),
      import('dayjs/locale/ur'), // Urdu
    ]);
    return {
      antd,
      dayjs: 'ur',
    };
  },

  uz_UZ: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/uz_UZ'),
      import('dayjs/locale/uz'), // Uzbek
    ]);
    return {
      antd,
      dayjs: 'uz',
    };
  },

  vi_VN: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/vi_VN'),
      import('dayjs/locale/vi'),
    ]);
    return {
      antd,
      dayjs: 'vi',
    };
  },

  zh_CN: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/zh_CN'),
      import('dayjs/locale/zh-cn'), // Chinese (Simplified)
    ]);
    return {
      antd,
      dayjs: 'zh-cn',
    };
  },

  zh_HK: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/zh_HK'),
      import('dayjs/locale/zh-hk'), // Chinese (Hong Kong)
    ]);
    return {
      antd,
      dayjs: 'zh-hk',
    };
  },

  zh_TW: async () => {
    const [{ default: antd }] = await Promise.all([
      import('antd/locale/zh_TW'),
      import('dayjs/locale/zh-tw'), // Chinese (Taiwan)
    ]);
    return {
      antd,
      dayjs: 'zh-tw',
    };
  },
};
