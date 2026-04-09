export function getCards() {
  return blah.results.map((card) => {
    const front_text = card.term
    const back_text = card.hints[0]?.text

    return `${front_text}::${back_text}`
  })
}

const blah = {
  count: 633,
  next: 'https://www.lingq.com/api/v3/zh/cards/?page=3&page_size=200&search_criteria=startsWith&sort=alpha&status=0&status=1&status=2&status=3&status=4',
  previous:
    'https://www.lingq.com/api/v3/zh/cards/?page_size=200&search_criteria=startsWith&sort=alpha&status=0&status=1&status=2&status=3&status=4',
  results: [
    {
      pk: 776511171,
      url: 'https://www.lingq.com/api/v3/zh/cards/776511171/',
      term: '\u5531',
      fragment: '',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-16T03:54:08.594583',
      status_changed_date: '2026-02-01T03:54:08.594583',
      notes: '',
      audio: null,
      words: ['\u5531'],
      tags: [],
      hints: [
        {
          id: 13497279,
          locale: 'en',
          text: 'sing',
          term: '\u5531',
          popularity: 510,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u00e0ng'],
        hant: ['\u5531']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5531']
    },
    {
      pk: 776511054,
      url: 'https://www.lingq.com/api/v3/zh/cards/776511054/',
      term: '\u5531\u6b4c',
      fragment: '\u6765 \uff0c\u5531\u6b4c \u5427',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:15:31.034552',
      status_changed_date: '2026-02-05T05:15:31.034552',
      notes: '',
      audio: null,
      words: ['\u5531\u6b4c'],
      tags: [],
      hints: [
        {
          id: 65269093,
          locale: 'en',
          text: 'sing',
          term: '\u5531\u6b4c',
          popularity: 183,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u00e0ngg\u0113'],
        hant: ['\u5531\u6b4c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5531\u6b4c']
    },
    {
      pk: 786157475,
      url: 'https://www.lingq.com/api/v3/zh/cards/786157475/',
      term: '\u5546\u573a',
      fragment: '\u6211 \u6b63\u8981 \u53bb \u5546\u573a\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T04:36:27.214153',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5546\u573a'],
      tags: [],
      hints: [
        {
          id: 23957451,
          locale: 'en',
          text: 'shopping mall',
          term: '\u5546\u573a',
          popularity: 258,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u0101ngch\u01ceng'],
        hant: ['\u5546\u5834']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5546\u573a']
    },
    {
      pk: 776889184,
      url: 'https://www.lingq.com/api/v3/zh/cards/776889184/',
      term: '\u554a',
      fragment: '\u554a \uff0c\u600e\u4e48 \u4e86',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:34:16.686072',
      status_changed_date: '2026-02-06T03:34:16.686072',
      notes: '',
      audio: null,
      words: ['\u554a'],
      tags: [],
      hints: [
        {
          id: 31025853,
          locale: 'en',
          text: 'ah',
          term: '\u554a',
          popularity: 164,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u00e1'],
        hant: ['\u554a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u554a']
    },
    {
      pk: 782329255,
      url: 'https://www.lingq.com/api/v3/zh/cards/782329255/',
      term: '\u554a\u5440',
      fragment: '\u554a\u5440\uff01',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:19:19.715804',
      status_changed_date: '2026-02-07T04:19:19.715804',
      notes: '',
      audio: null,
      words: ['\u554a\u5440'],
      tags: [],
      hints: [
        {
          id: 195693671,
          locale: 'en',
          text: 'Ah',
          term: '\u554a\u5440',
          popularity: 19,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u0101y\u0101'],
        hant: ['\u554a\u5440']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u554a\u5440']
    },
    {
      pk: 777562989,
      url: 'https://www.lingq.com/api/v3/zh/cards/777562989/',
      term: '\u5564\u9152',
      fragment: '\u9752\u5c9b \u5564\u9152\u3002',
      importance: 2,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:49:11.653205',
      status_changed_date: '2026-03-09T03:49:11.653205',
      notes: '',
      audio: null,
      words: ['\u5564\u9152'],
      tags: [],
      hints: [
        {
          id: 7321599,
          locale: 'en',
          text: 'beer',
          term: '\u5564\u9152',
          popularity: 426,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['p\u00edji\u01d4'],
        hant: ['\u5564\u9152']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5564\u9152']
    },
    {
      pk: 780327714,
      url: 'https://www.lingq.com/api/v3/zh/cards/780327714/',
      term: '\u5582',
      fragment: '\u5582\uff0c \u674e \u5148\u751f \u5728 \u5417\uff1f',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T05:15:25.819224',
      status_changed_date: '2026-02-05T05:15:25.819224',
      notes: '',
      audio: null,
      words: ['\u5582'],
      tags: [],
      hints: [
        {
          id: 223543095,
          locale: 'en',
          text: 'hello (phone)',
          term: '\u5582',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e9i'],
        hant: ['\u9935']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5582']
    },
    {
      pk: 775453582,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453582/',
      term: '\u559c\u6b22',
      fragment: '\u5979 \u5f88 \u559c\u6b22 \u5357\u4eac\u3002',
      importance: 3,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:54:07.407034',
      status_changed_date: '2026-03-09T03:54:07.407034',
      notes: '',
      audio: null,
      words: ['\u559c\u6b22'],
      tags: [],
      hints: [
        {
          id: 5941989,
          locale: 'en',
          text: 'to like; to be fond of',
          term: '\u559c\u6b22',
          popularity: 745,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u01d0huan'],
        hant: ['\u559c\u6b61']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u559c\u6b22']
    },
    {
      pk: 777213866,
      url: 'https://www.lingq.com/api/v3/zh/cards/777213866/',
      term: '\u559d',
      fragment: '\u5148 \u505a \u65e9\u996d \u5e76 \u559d \u4e00\u676f \u5496\u5561',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-06T05:09:06.624148',
      status_changed_date: '2026-03-03T05:09:06.624148',
      notes: '',
      audio: null,
      words: ['\u559d'],
      tags: [],
      hints: [
        {
          id: 129190478,
          locale: 'en',
          text: 'drink',
          term: '\u559d',
          popularity: 3349,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u0113'],
        hant: ['\u559d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u559d']
    },
    {
      pk: 785461680,
      url: 'https://www.lingq.com/api/v3/zh/cards/785461680/',
      term: '\u55e8',
      fragment: '\u55e8\uff0c \u6700\u8fd1 \u600e\u4e48\u6837\uff1f',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:01:29.054267',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u55e8'],
      tags: [],
      hints: [
        {
          id: 1916861,
          locale: 'en',
          text: 'hi',
          term: '\u55e8',
          popularity: 3364,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u0101i'],
        hant: ['\u55e8']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u55e8']
    },
    {
      pk: 781020754,
      url: 'https://www.lingq.com/api/v3/zh/cards/781020754/',
      term: '\u55ef',
      fragment: '\u55ef\u3002',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T05:14:11.963414',
      status_changed_date: '2026-02-05T05:14:11.963414',
      notes: '',
      audio: null,
      words: ['\u55ef'],
      tags: [],
      hints: [
        {
          id: 168725653,
          locale: 'en',
          text: 'uh-huh',
          term: '\u55ef',
          popularity: 30,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u0113n'],
        hant: ['\u55ef']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u55ef']
    },
    {
      pk: 781714814,
      url: 'https://www.lingq.com/api/v3/zh/cards/781714814/',
      term: '\u563f\u563f',
      fragment: '\u55ef...... \u54e6\uff0c \u6ca1 \u51fa\u754c\uff0c \u563f\u563f\u3002',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-12T05:14:04.626785',
      status_changed_date: '2026-02-05T05:14:04.626785',
      notes: '',
      audio: null,
      words: ['\u563f\u563f'],
      tags: [],
      hints: [
        {
          id: 159715168,
          locale: 'en',
          text: 'hehe',
          term: '\u563f\u563f',
          popularity: 84,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u0113i h\u0113i'],
        hant: ['\u563f\u563f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u563f\u563f']
    },
    {
      pk: 776512989,
      url: 'https://www.lingq.com/api/v3/zh/cards/776512989/',
      term: '\u5662',
      fragment: '\u5662',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:04:15.051437',
      status_changed_date: '2026-02-02T06:04:15.051437',
      notes: '',
      audio: null,
      words: ['\u5662'],
      tags: [],
      hints: [
        {
          id: 13679983,
          locale: 'en',
          text: 'Oh',
          term: '\u5662',
          popularity: 679,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u014d'],
        hant: ['\u5662']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5662']
    },
    {
      pk: 777563526,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563526/',
      term: '\u56db',
      fragment: '\u2026\u4e8c \u516b \u96f6 \u516b\uff0c \u56db \u56db \u4e03 \u4e5d\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-21T03:31:38.636899',
      status_changed_date: '2026-02-06T03:31:38.636899',
      notes: '',
      audio: null,
      words: ['\u56db'],
      tags: [],
      hints: [
        {
          id: 10610716,
          locale: 'en',
          text: 'four',
          term: '\u56db',
          popularity: 776,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['s\u00ec'],
        hant: ['\u56db']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u56db']
    },
    {
      pk: 778647717,
      url: 'https://www.lingq.com/api/v3/zh/cards/778647717/',
      term: '\u56db\u5341',
      fragment: '\u56db\u5341 \u5757 \u94b1\uff1f',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:15:38.725323',
      status_changed_date: '2026-02-05T05:15:38.725323',
      notes: '',
      audio: null,
      words: ['\u56db\u5341'],
      tags: [],
      hints: [
        {
          id: 10610718,
          locale: 'en',
          text: 'forty',
          term: '\u56db\u5341',
          popularity: 247,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['s\u00ecsh\u00ed'],
        hant: ['\u56db\u5341']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u56db\u5341']
    },
    {
      pk: 786157416,
      url: 'https://www.lingq.com/api/v3/zh/cards/786157416/',
      term: '\u56de\u5bb6',
      fragment: '\u6211 \u6b63\u8981 \u56de\u5bb6\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T04:36:05.374679',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u56de\u5bb6'],
      tags: [],
      hints: [
        {
          id: 73611713,
          locale: 'en',
          text: 'go home',
          term: '\u56de\u5bb6',
          popularity: 142,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['hu\u00edji\u0101'],
        hant: ['\u56de\u5bb6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u56de\u5bb6']
    },
    {
      pk: 780326461,
      url: 'https://www.lingq.com/api/v3/zh/cards/780326461/',
      term: '\u56de\u6765',
      fragment: '\u4ec0\u4e48 \u65f6\u5019 \u56de\u6765\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:04:11.550880',
      status_changed_date: '2026-02-02T06:04:11.550880',
      notes: '',
      audio: null,
      words: ['\u56de\u6765'],
      tags: [],
      hints: [
        {
          id: 8534913,
          locale: 'en',
          text: 'return',
          term: '\u56de\u6765',
          popularity: 20,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['hu\u00edlai'],
        hant: ['\u56de\u4f86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u56de\u6765']
    },
    {
      pk: 779328465,
      url: 'https://www.lingq.com/api/v3/zh/cards/779328465/',
      term: '\u56e0\u4e3a',
      fragment: '\u56e0\u4e3a \u5b83\u4eec \u90fd \u5f88 \u8d35\u3002',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:03:33.245589',
      status_changed_date: '2026-02-02T06:03:33.245589',
      notes: '',
      audio: null,
      words: ['\u56e0\u4e3a'],
      tags: [],
      hints: [
        {
          id: 13150148,
          locale: 'en',
          text: 'because',
          term: '\u56e0\u4e3a',
          popularity: 744,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bnw\u00e8i'],
        hant: ['\u56e0\u70ba']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u56e0\u4e3a']
    },
    {
      pk: 783752672,
      url: 'https://www.lingq.com/api/v3/zh/cards/783752672/',
      term: '\u56fd\u5bb6',
      fragment: '\u2026\u987e\u5ba2 \u6765\u81ea \u5f88 \u591a \u56fd\u5bb6\u3002',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:19:29.142248',
      status_changed_date: '2026-02-07T04:19:29.142248',
      notes: '',
      audio: null,
      words: ['\u56fd\u5bb6'],
      tags: [],
      hints: [
        {
          id: 7479722,
          locale: 'en',
          text: 'country',
          term: '\u56fd\u5bb6',
          popularity: 259622,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u0101'],
        hant: ['\u570b\u5bb6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u56fd\u5bb6']
    },
    {
      pk: 775453511,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453511/',
      term: '\u5728',
      fragment: '\u5979 \u4f4f \u5728 \u5357\u4eac\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-28T01:59:42.223504',
      status_changed_date: '2026-01-28T01:59:42.223504',
      notes: '',
      audio: null,
      words: ['\u5728'],
      tags: [],
      hints: [
        {
          id: 29642225,
          locale: 'en',
          text: 'In / on / at',
          term: '\u5728',
          popularity: 163,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u00e0i'],
        hant: ['\u5728']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5728']
    },
    {
      pk: 775819141,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819141/',
      term: '\u5730\u5740',
      fragment: '\u4f60 \u5bb6 \u91cc \u7684 \u5730\u5740 \u662f \u4ec0\u4e48',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-17T06:03:30.166153',
      status_changed_date: '2026-02-02T06:03:30.166153',
      notes: '',
      audio: null,
      words: ['\u5730\u5740'],
      tags: [],
      hints: [
        {
          id: 10672712,
          locale: 'en',
          text: 'address',
          term: '\u5730\u5740',
          popularity: 2244,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00eczh\u01d0'],
        hant: ['\u5730\u5740']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5730\u5740']
    },
    {
      pk: 780327086,
      url: 'https://www.lingq.com/api/v3/zh/cards/780327086/',
      term: '\u5750',
      fragment: '\u8bf7 \u5750\uff01',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:01:50.257055',
      status_changed_date: '2026-02-02T06:01:50.257055',
      notes: '',
      audio: null,
      words: ['\u5750'],
      tags: [],
      hints: [
        {
          id: 12287898,
          locale: 'en',
          text: 'sit',
          term: '\u5750',
          popularity: 326,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zu\u00f2'],
        hant: ['\u5750']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5750']
    },
    {
      pk: 782329532,
      url: 'https://www.lingq.com/api/v3/zh/cards/782329532/',
      term: '\u5750\u4e0b',
      fragment: '\u5c0f\u767d\uff0c \u5750\u4e0b\u3002',
      importance: 1,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:22:04.077780',
      status_changed_date: '2026-02-07T04:22:04.077780',
      notes: '',
      audio: null,
      words: ['\u5750\u4e0b'],
      tags: [],
      hints: [
        {
          id: 13507120,
          locale: 'en',
          text: 'sit down',
          term: '\u5750\u4e0b',
          popularity: 767,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zu\u00f2xia'],
        hant: ['\u5750\u4e0b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5750\u4e0b']
    },
    {
      pk: 775822378,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822378/',
      term: '\u5757',
      fragment: '21 \u5757 \u94b1',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-03T06:07:00.904446',
      status_changed_date: '2026-02-02T06:07:00.904446',
      notes: '',
      audio: null,
      words: ['\u5757'],
      tags: [],
      hints: [
        {
          id: 14637931,
          locale: 'en',
          text: 'measure word for pieces and monetary units',
          term: '\u5757',
          popularity: 109,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ku\u00e0i'],
        hant: ['\u584a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5757']
    },
    {
      pk: 778647859,
      url: 'https://www.lingq.com/api/v3/zh/cards/778647859/',
      term: '\u5757\u94b1',
      fragment: '\u4e0d\u5bf9\uff0c \u5341\u56db \u5757\u94b1\u3002',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:05:39.436773',
      status_changed_date: '2026-02-02T06:05:39.436773',
      notes: '',
      audio: null,
      words: ['\u5757\u94b1'],
      tags: [],
      hints: [
        {
          id: 11743023,
          locale: 'en',
          text: 'yuan',
          term: '\u5757\u94b1',
          popularity: 241,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ku\u00e0i qi\u00e1n'],
        hant: ['\u584a\u9322']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5757\u94b1']
    },
    {
      pk: 778249072,
      url: 'https://www.lingq.com/api/v3/zh/cards/778249072/',
      term: '\u591a',
      fragment: '\u4f60 \u6709 \u591a \u9ad8\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-12T05:15:01.550458',
      status_changed_date: '2026-02-05T05:15:01.550458',
      notes: '',
      audio: null,
      words: ['\u591a'],
      tags: [],
      hints: [
        {
          id: 15053210,
          locale: 'en',
          text: 'many, much,',
          term: '\u591a',
          popularity: 923,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['du\u014d'],
        hant: ['\u591a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u591a']
    },
    {
      pk: 775823803,
      url: 'https://www.lingq.com/api/v3/zh/cards/775823803/',
      term: '\u591a\u5c11',
      fragment: '\u4f60 \u8981 \u6362 \u591a\u5c11 \u94b1',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:05:36.308586',
      status_changed_date: '2026-02-02T06:05:36.308586',
      notes: '',
      audio: null,
      words: ['\u591a\u5c11'],
      tags: [],
      hints: [
        {
          id: 6027043,
          locale: 'en',
          text: 'how much',
          term: '\u591a\u5c11',
          popularity: 491,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['du\u014dshao'],
        hant: ['\u591a\u5c11']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u591a\u5c11']
    },
    {
      pk: 795223898,
      url: 'https://www.lingq.com/api/v3/zh/cards/795223898/',
      term: '\u591a\u957f',
      fragment: '\u4f60 \u591a\u957f \u65f6\u95f4 \u6765 \u4e00\u6b21',
      importance: 1,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:42:40.631000',
      status_changed_date: '2026-03-12T03:42:40.631000',
      notes: '',
      audio: null,
      words: ['\u591a\u957f'],
      tags: [],
      hints: [
        {
          id: 27000664,
          locale: 'en',
          text: 'How often / How long',
          term: '\u591a\u957f',
          popularity: 9,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['du\u014d zh\u01ceng'],
        hant: ['\u591a\u9577']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u591a\u957f']
    },
    {
      pk: 777907896,
      url: 'https://www.lingq.com/api/v3/zh/cards/777907896/',
      term: '\u591f',
      fragment: '\u771f\u7684 \u591f \u4e86\uff0c \u8c22\u8c22\uff01',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:22:59.951646',
      status_changed_date: '2026-02-07T04:22:59.951646',
      notes: '',
      audio: null,
      words: ['\u591f'],
      tags: [],
      hints: [
        {
          id: 13515086,
          locale: 'en',
          text: 'enough',
          term: '\u591f',
          popularity: 779,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u00f2u'],
        hant: ['\u5920']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u591f']
    },
    {
      pk: 778980943,
      url: 'https://www.lingq.com/api/v3/zh/cards/778980943/',
      term: '\u5927',
      fragment: '\u5927\u3001 \u91cd\u3001 \u6162',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:15:03.307444',
      status_changed_date: '2026-02-05T05:15:03.307444',
      notes: '',
      audio: null,
      words: ['\u5927'],
      tags: [],
      hints: [
        {
          id: 19208447,
          locale: 'en',
          text: 'big',
          term: '\u5927',
          popularity: 442,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e0'],
        hant: ['\u5927']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5927']
    },
    {
      pk: 778652790,
      url: 'https://www.lingq.com/api/v3/zh/cards/778652790/',
      term: '\u5927\u5bb6',
      fragment:
        '\u2026\u65b0\u5e74 \u597d \u5440\uff0c \u795d\u8d3a \u5927\u5bb6 \u65b0\u5e74 \u597d\uff01',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:14:16.922987',
      status_changed_date: '2026-02-05T05:14:16.922987',
      notes: '',
      audio: null,
      words: ['\u5927\u5bb6'],
      tags: [],
      hints: [
        {
          id: 35868850,
          locale: 'en',
          text: 'Everybody; all',
          term: '\u5927\u5bb6',
          popularity: 999,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e0ji\u0101'],
        hant: ['\u5927\u5bb6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5927\u5bb6']
    },
    {
      pk: 780704843,
      url: 'https://www.lingq.com/api/v3/zh/cards/780704843/',
      term: '\u5929\u5b89\u95e8',
      fragment: '\u8bf7\u95ee \u5929\u5b89\u95e8 \u5728 \u54ea\u91cc\uff1f',
      importance: 1,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:31:52.783756',
      status_changed_date: '2026-02-06T03:31:52.783756',
      notes: '',
      audio: null,
      words: ['\u5929\u5b89\u95e8'],
      tags: [],
      hints: [
        {
          id: 159744835,
          locale: 'en',
          text: 'Tiananmen',
          term: '\u5929\u5b89\u95e8',
          popularity: 212,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ti\u0101n\u0101nm\u00e9n'],
        hant: ['\u5929\u5b89\u9580']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5929\u5b89\u95e8']
    },
    {
      pk: 777215292,
      url: 'https://www.lingq.com/api/v3/zh/cards/777215292/',
      term: '\u5929\u7a7a',
      fragment: '\u84dd \u84dd \u7684 \u5929\u7a7a\uff0c',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:33.356268',
      status_changed_date: '2026-02-06T03:33:33.356268',
      notes: '',
      audio: null,
      words: ['\u5929\u7a7a'],
      tags: [],
      hints: [
        {
          id: 5943953,
          locale: 'en',
          text: 'sky',
          term: '\u5929\u7a7a',
          popularity: 219,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ti\u0101nk\u014dng'],
        hant: ['\u5929\u7a7a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5929\u7a7a']
    },
    {
      pk: 778647783,
      url: 'https://www.lingq.com/api/v3/zh/cards/778647783/',
      term: '\u592a',
      fragment: '\u592a \u8d35 \u4e86\uff01',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:14:06.285077',
      status_changed_date: '2026-02-05T05:14:06.285077',
      notes: '',
      audio: null,
      words: ['\u592a'],
      tags: [],
      hints: [
        {
          id: 13502093,
          locale: 'en',
          text: 'too',
          term: '\u592a',
          popularity: 127632,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00e0i'],
        hant: ['\u592a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u592a']
    },
    {
      pk: 777215505,
      url: 'https://www.lingq.com/api/v3/zh/cards/777215505/',
      term: '\u592a\u9633',
      fragment: '\u7ea2 \u7ea2 \u7684 \u592a\u9633 \u70b9\u5934 \u7b11\u3002',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:12.652223',
      status_changed_date: '2026-02-06T03:33:12.652223',
      notes: '',
      audio: null,
      words: ['\u592a\u9633'],
      tags: [],
      hints: [
        {
          id: 13483120,
          locale: 'en',
          text: 'sun',
          term: '\u592a\u9633',
          popularity: 483,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00e0iyang'],
        hant: ['\u592a\u967d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u592a\u9633']
    },
    {
      pk: 780705504,
      url: 'https://www.lingq.com/api/v3/zh/cards/780705504/',
      term: '\u5973\u5b69\u513f',
      fragment: '\u90a3 \u4e2a \u5973\u5b69\u513f \u662f \u8c01\uff1f',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:21.355723',
      status_changed_date: '2026-02-06T03:33:21.355723',
      notes: '',
      audio: null,
      words: ['\u5973\u5b69\u513f'],
      tags: [],
      hints: [
        {
          id: 71461594,
          locale: 'en',
          text: 'girl',
          term: '\u5973\u5b69\u513f',
          popularity: 163,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01dah\u00e1ir'],
        hant: ['\u5973\u5b69\u5152']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5973\u5b69\u513f']
    },
    {
      pk: 780705586,
      url: 'https://www.lingq.com/api/v3/zh/cards/780705586/',
      term: '\u5973\u670b\u53cb',
      fragment: '\u5979 \u662f \u6211 \u5973\u670b\u53cb\u3002',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:24.563100',
      status_changed_date: '2026-02-06T03:33:24.563100',
      notes: '',
      audio: null,
      words: ['\u5973\u670b\u53cb'],
      tags: [],
      hints: [
        {
          id: 13548127,
          locale: 'en',
          text: 'girlfriend',
          term: '\u5973\u670b\u53cb',
          popularity: 1733,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01dap\u00e9ngyou'],
        hant: ['\u5973\u670b\u53cb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5973\u670b\u53cb']
    },
    {
      pk: 775453402,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453402/',
      term: '\u5979',
      fragment: '\u5979 \u4f4f \u5728 \u5357\u4eac\u3002',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-27T02:01:54.110149',
      status_changed_date: '2026-01-28T02:01:54.110149',
      notes: '',
      audio: null,
      words: ['\u5979'],
      tags: [],
      hints: [
        {
          id: 384366,
          locale: 'en',
          text: 'she',
          term: '\u5979',
          popularity: 167345,
          is_google_translate: true,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['t\u0101'],
        hant: ['\u5979']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5979']
    },
    {
      pk: 775450766,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450766/',
      term: '\u597d',
      fragment: '\u6211 \u5f88 \u597d\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-04T06:44:43.086975',
      status_changed_date: '2026-02-03T06:44:43.086975',
      notes: '',
      audio: null,
      words: ['\u597d'],
      tags: [],
      hints: [
        {
          id: 14784720,
          locale: 'en',
          text: 'good',
          term: '\u597d',
          popularity: 1174,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceo'],
        hant: ['\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d']
    },
    {
      pk: 779327985,
      url: 'https://www.lingq.com/api/v3/zh/cards/779327985/',
      term: '\u597d\u4e45',
      fragment: '\u597d\u4e45 \u4e0d\u89c1\uff01',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:31:46.960312',
      status_changed_date: '2026-02-06T03:31:46.960312',
      notes: '',
      audio: null,
      words: ['\u597d\u4e45'],
      tags: [],
      hints: [
        {
          id: 7479638,
          locale: 'en',
          text: 'long time',
          term: '\u597d\u4e45',
          popularity: 116,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceoji\u01d4'],
        hant: ['\u597d\u4e45']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d\u4e45']
    },
    {
      pk: 778976262,
      url: 'https://www.lingq.com/api/v3/zh/cards/778976262/',
      term: '\u597d\u4e86',
      fragment: '\u6211 \u597d\u4e86\u3002',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:07:28.348476',
      status_changed_date: '2026-02-02T06:07:28.348476',
      notes: '',
      audio: null,
      words: ['\u597d\u4e86'],
      tags: [],
      hints: [
        {
          id: 134590852,
          locale: 'en',
          text: "okay; all right; that's enough, that'll do",
          term: '\u597d\u4e86',
          popularity: 24,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceo le'],
        hant: ['\u597d\u4e86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d\u4e86']
    },
    {
      pk: 776157512,
      url: 'https://www.lingq.com/api/v3/zh/cards/776157512/',
      term: '\u597d\u5403',
      fragment: '\u597d\u5403 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-03T06:07:31.542077',
      status_changed_date: '2026-02-02T06:07:31.542077',
      notes: '',
      audio: null,
      words: ['\u597d\u5403'],
      tags: [],
      hints: [
        {
          id: 15067963,
          locale: 'en',
          text: 'delicious',
          term: '\u597d\u5403',
          popularity: 123912,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceoch\u012b'],
        hant: ['\u597d\u5403']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d\u5403']
    },
    {
      pk: 777210919,
      url: 'https://www.lingq.com/api/v3/zh/cards/777210919/',
      term: '\u597d\u5427',
      fragment: '\u597d\u5427',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:46:15.840151',
      status_changed_date: '2026-02-03T06:46:15.840151',
      notes: '',
      audio: null,
      words: ['\u597d\u5427'],
      tags: [],
      hints: [
        {
          id: 182384978,
          locale: 'en',
          text: 'okay',
          term: '\u597d\u5427',
          popularity: 98,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceo ba'],
        hant: ['\u597d\u5427']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d\u5427']
    },
    {
      pk: 795224626,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224626/',
      term: '\u597d\u554a',
      fragment: '\u597d\u554a \uff0c\u6211 \u8981 \u4e00\u676f \u5564\u9152',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:47:58.431000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u597d\u554a'],
      tags: [],
      hints: [
        {
          id: 217152384,
          locale: 'en',
          text: 'great',
          term: '\u597d\u554a',
          popularity: 18,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceo \u00e1'],
        hant: ['\u597d\u554a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d\u554a']
    },
    {
      pk: 775822885,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822885/',
      term: '\u597d\u7684',
      fragment: '\u597d\u7684 \uff0c\u6ca1\u95ee\u9898',
      importance: 0,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-03T06:05:42.817713',
      status_changed_date: '2026-02-02T06:05:42.817713',
      notes: '',
      audio: null,
      words: ['\u597d\u7684'],
      tags: [],
      hints: [
        {
          id: 62074937,
          locale: 'en',
          text: 'okay',
          term: '\u597d\u7684',
          popularity: 120,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceo d\u00ec'],
        hant: ['\u597d\u7684']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d\u7684']
    },
    {
      pk: 775455521,
      url: 'https://www.lingq.com/api/v3/zh/cards/775455521/',
      term: '\u597d\u770b',
      fragment: '\u4ed6 \u5f88 \u597d\u770b\u3002',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-03T06:05:30.631823',
      status_changed_date: '2026-02-02T06:05:30.631823',
      notes: '',
      audio: null,
      words: ['\u597d\u770b'],
      tags: [],
      hints: [
        {
          id: 18505706,
          locale: 'en',
          text: 'good-looking',
          term: '\u597d\u770b',
          popularity: 440,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u01ceok\u00e0n'],
        hant: ['\u597d\u770b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u597d\u770b']
    },
    {
      pk: 777907367,
      url: 'https://www.lingq.com/api/v3/zh/cards/777907367/',
      term: '\u5988\u5988',
      fragment:
        '\u7238\u7238\u3001 \u5988\u5988\u3001 \u54e5\u54e5\u3001 \u5f1f\u5f1f\u3001 \u59d0\u59d0 \u548c\u2026',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:07:08.480426',
      status_changed_date: '2026-02-02T06:07:08.480426',
      notes: '',
      audio: null,
      words: ['\u5988\u5988'],
      tags: [],
      hints: [
        {
          id: 24187625,
          locale: 'en',
          text: 'Mom',
          term: '\u5988\u5988',
          popularity: 150,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u0101ma'],
        hant: ['\u5abd\u5abd']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5988\u5988']
    },
    {
      pk: 775453651,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453651/',
      term: '\u59b9\u59b9',
      fragment: '\u5979 \u6709 \u4e00\u4e2a \u59b9\u59b9\u3002',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:15:36.618550',
      status_changed_date: '2026-02-05T05:15:36.618550',
      notes: '',
      audio: null,
      words: ['\u59b9\u59b9'],
      tags: [],
      hints: [
        {
          id: 11822401,
          locale: 'en',
          text: 'younger sister',
          term: '\u59b9\u59b9',
          popularity: 2898,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u00e8imei'],
        hant: ['\u59b9\u59b9']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u59b9\u59b9']
    },
    {
      pk: 777907384,
      url: 'https://www.lingq.com/api/v3/zh/cards/777907384/',
      term: '\u59d0\u59d0',
      fragment:
        '\u7238\u7238\u3001 \u5988\u5988\u3001 \u54e5\u54e5\u3001 \u5f1f\u5f1f\u3001 \u59d0\u59d0 \u548c \u6211\u3002',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:05:19.517634',
      status_changed_date: '2026-02-02T06:05:19.517634',
      notes: '',
      audio: null,
      words: ['\u59d0\u59d0'],
      tags: [],
      hints: [
        {
          id: 384564,
          locale: 'en',
          text: 'sister',
          term: '\u59d0\u59d0',
          popularity: 936,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u011bjie'],
        hant: ['\u59d0\u59d0']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u59d0\u59d0']
    },
    {
      pk: 780326930,
      url: 'https://www.lingq.com/api/v3/zh/cards/780326930/',
      term: '\u59d3',
      fragment: '\u2026\u5c0f\u59d0\uff0c \u4f60 \u597d\uff0c \u6211 \u59d3 \u738b\u3002',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:23:04.223850',
      status_changed_date: '2026-02-07T04:23:04.223850',
      notes: '',
      audio: null,
      words: ['\u59d3'],
      tags: [],
      hints: [
        {
          id: 47925591,
          locale: 'en',
          text: 'surname',
          term: '\u59d3',
          popularity: 306,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u00ecng'],
        hant: ['\u59d3']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u59d3']
    },
    {
      pk: 784784949,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784949/',
      term: '\u5b66',
      fragment: '\u8fbe\u65af\u6c40 \u6253\u7b97 \u5b66 \u6cd5\u8bed \u5417\uff1f',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:27:12.276553',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5b66'],
      tags: [],
      hints: [
        {
          id: 13530847,
          locale: 'en',
          text: 'learn',
          term: '\u5b66',
          popularity: 139717,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xu\u00e9'],
        hant: ['\u5b78']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b66']
    },
    {
      pk: 781021702,
      url: 'https://www.lingq.com/api/v3/zh/cards/781021702/',
      term: '\u5b66\u4e60',
      fragment: '\u6765 \u5b66\u4e60\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:36.587977',
      status_changed_date: '2026-02-06T03:33:36.587977',
      notes: '',
      audio: null,
      words: ['\u5b66\u4e60'],
      tags: [],
      hints: [
        {
          id: 3949638,
          locale: 'en',
          text: 'study',
          term: '\u5b66\u4e60',
          popularity: 968000,
          is_google_translate: true,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['xu\u00e9x\u00ed'],
        hant: ['\u5b78\u7fd2']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b66\u4e60']
    },
    {
      pk: 779644589,
      url: 'https://www.lingq.com/api/v3/zh/cards/779644589/',
      term: '\u5b66\u6821',
      fragment: '\u6211 \u53bb \u5b66\u6821\u3002',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:07:04.588383',
      status_changed_date: '2026-02-02T06:07:04.588383',
      notes: '',
      audio: null,
      words: ['\u5b66\u6821'],
      tags: [],
      hints: [
        {
          id: 384789,
          locale: 'en',
          text: 'school',
          term: '\u5b66\u6821',
          popularity: 157998,
          is_google_translate: true,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['xu\u00e9xi\u00e0o'],
        hant: ['\u5b78\u6821']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b66\u6821']
    },
    {
      pk: 779327346,
      url: 'https://www.lingq.com/api/v3/zh/cards/779327346/',
      term: '\u5b69\u5b50',
      fragment: '\u7238\u7238\u3001 \u5988\u5988\u3001 \u5b69\u5b50',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:46:46.984163',
      status_changed_date: '2026-02-03T06:46:46.984163',
      notes: '',
      audio: null,
      words: ['\u5b69\u5b50'],
      tags: [],
      hints: [
        {
          id: 5941808,
          locale: 'en',
          text: 'child',
          term: '\u5b69\u5b50',
          popularity: 2568,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u00e1izi'],
        hant: ['\u5b69\u5b50']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b69\u5b50']
    },
    {
      pk: 778976786,
      url: 'https://www.lingq.com/api/v3/zh/cards/778976786/',
      term: '\u5b83',
      fragment: '\u4ed6\u3001 \u5979\u3001 \u5b83',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:05:32.803413',
      status_changed_date: '2026-02-02T06:05:32.803413',
      notes: '',
      audio: null,
      words: ['\u5b83'],
      tags: [],
      hints: [
        {
          id: 1347250,
          locale: 'en',
          text: 'it',
          term: '\u5b83',
          popularity: 190296,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u0101'],
        hant: ['\u5b83']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b83']
    },
    {
      pk: 779328477,
      url: 'https://www.lingq.com/api/v3/zh/cards/779328477/',
      term: '\u5b83\u4eec',
      fragment: '\u56e0\u4e3a \u5b83\u4eec \u90fd \u5f88 \u8d35\u3002',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:05:28.444879',
      status_changed_date: '2026-02-02T06:05:28.444879',
      notes: '',
      audio: null,
      words: ['\u5b83\u4eec'],
      tags: [],
      hints: [
        {
          id: 13150092,
          locale: 'en',
          text: 'they',
          term: '\u5b83\u4eec',
          popularity: 435,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u0101men'],
        hant: ['\u5b83\u5011']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b83\u4eec']
    },
    {
      pk: 786157881,
      url: 'https://www.lingq.com/api/v3/zh/cards/786157881/',
      term: '\u5b8c',
      fragment: '\u2026\u5bb6 \u7684 \u725b\u5976 \u559d \u5b8c \u4e86\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T04:38:41.140295',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5b8c'],
      tags: [],
      hints: [
        {
          id: 217169345,
          locale: 'en',
          text: 'completion particle',
          term: '\u5b8c',
          popularity: 36,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e1n'],
        hant: ['\u5b8c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b8c']
    },
    {
      pk: 775819966,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819966/',
      term: '\u5b9d\u5b9d',
      fragment: '\u5b9d\u5b9d \uff0c\u4e56',
      importance: 1,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:47:56.299574',
      status_changed_date: '2026-02-03T06:47:56.299574',
      notes: '',
      audio: null,
      words: ['\u5b9d\u5b9d'],
      tags: [],
      hints: [
        {
          id: 13546012,
          locale: 'en',
          text: 'baby',
          term: '\u5b9d\u5b9d',
          popularity: 860,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u01ceob\u01ceo'],
        hant: ['\u5bf6\u5bf6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5b9d\u5b9d']
    },
    {
      pk: 777907783,
      url: 'https://www.lingq.com/api/v3/zh/cards/777907783/',
      term: '\u5ba2\u6c14',
      fragment: '\u4e0d \u8981 \u5ba2\u6c14\uff01',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:25:19.041345',
      status_changed_date: '2026-02-07T04:25:19.041345',
      notes: '',
      audio: null,
      words: ['\u5ba2\u6c14'],
      tags: [],
      hints: [
        {
          id: 165413672,
          locale: 'en',
          text: 'be polite',
          term: '\u5ba2\u6c14',
          popularity: 37,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u00e8qi'],
        hant: ['\u5ba2\u6c23']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5ba2\u6c14']
    },
    {
      pk: 775819001,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819001/',
      term: '\u5bb6',
      fragment: '\u4f60 \u5bb6 \u91cc \u7684 \u5730\u5740 \u662f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-18T06:47:56.304662',
      status_changed_date: '2026-02-03T06:47:56.304662',
      notes: '',
      audio: null,
      words: ['\u5bb6'],
      tags: [],
      hints: [
        {
          id: 20539515,
          locale: 'en',
          text: 'home',
          term: '\u5bb6',
          popularity: 338,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u0101'],
        hant: ['\u5bb6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bb6']
    },
    {
      pk: 775819227,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819227/',
      term: '\u5bb6\u91cc',
      fragment: '\u6211 \u5bb6\u91cc \u7684 \u5730\u5740 \u662f \u5357\u4eac',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-18T06:45:07.297816',
      status_changed_date: '2026-02-03T06:45:07.297816',
      notes: '',
      audio: null,
      words: ['\u5bb6\u91cc'],
      tags: [],
      hints: [
        {
          id: 37771919,
          locale: 'en',
          text: 'at home',
          term: '\u5bb6\u91cc',
          popularity: 238,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u0101l\u01d0'],
        hant: ['\u5bb6\u88cf']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bb6\u91cc']
    },
    {
      pk: 775822189,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822189/',
      term: '\u5bc4',
      fragment: '\u5bc4 \u5230 \u54ea\u91cc',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:27:25.240753',
      status_changed_date: '2026-02-07T04:27:25.240753',
      notes: '',
      audio: null,
      words: ['\u5bc4'],
      tags: [],
      hints: [
        {
          id: 13486629,
          locale: 'en',
          text: 'send',
          term: '\u5bc4',
          popularity: 492,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u00ec'],
        hant: ['\u5bc4']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bc4']
    },
    {
      pk: 775822499,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822499/',
      term: '\u5bc4\u5230',
      fragment: '\u5bc4\u5230 \u5fb7\u56fd',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:27:19.775716',
      status_changed_date: '2026-02-07T04:27:19.775716',
      notes: '',
      audio: null,
      words: ['\u5bc4\u5230'],
      tags: [],
      hints: [
        {
          id: 144018126,
          locale: 'en',
          text: 'send to',
          term: '\u5bc4\u5230',
          popularity: 187,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u00ec d\u00e0o'],
        hant: ['\u5bc4\u5230']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bc4\u5230']
    },
    {
      pk: 784430908,
      url: 'https://www.lingq.com/api/v3/zh/cards/784430908/',
      term: '\u5bd2\u5047',
      fragment: '\u5bd2\u5047 \u5230 \u4e86\uff0c \u8fbe\u65af\u6c40 \u5f88\u2026',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:56:20.439629',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5bd2\u5047'],
      tags: [],
      hints: [
        {
          id: 159715903,
          locale: 'en',
          text: 'winter break',
          term: '\u5bd2\u5047',
          popularity: 310,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u00e1nji\u00e0'],
        hant: ['\u5bd2\u5047']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bd2\u5047']
    },
    {
      pk: 775453290,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453290/',
      term: '\u5bf9',
      fragment: '\u5bf9\uff0c \u6211 \u662f \u4e2d\u56fd\u4eba\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-18T06:46:22.337293',
      status_changed_date: '2026-02-03T06:46:22.337293',
      notes: '',
      audio: null,
      words: ['\u5bf9'],
      tags: [],
      hints: [
        {
          id: 28668920,
          locale: 'en',
          text: 'right',
          term: '\u5bf9',
          popularity: 137,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['du\u00ec'],
        hant: ['\u5c0d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bf9']
    },
    {
      pk: 776511154,
      url: 'https://www.lingq.com/api/v3/zh/cards/776511154/',
      term: '\u5bf9\u4e0d\u8d77',
      fragment: '\u5bf9\u4e0d\u8d77 \uff0c\u6211 \u4e0d\u4f1a \u5531',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:13:47.626072',
      status_changed_date: '2026-02-05T05:13:47.626072',
      notes: '',
      audio: null,
      words: ['\u5bf9\u4e0d\u8d77'],
      tags: [],
      hints: [
        {
          id: 65214974,
          locale: 'en',
          text: 'sorry',
          term: '\u5bf9\u4e0d\u8d77',
          popularity: 422,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['du\u00ecbuq\u01d0'],
        hant: ['\u5c0d\u4e0d\u8d77']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bf9\u4e0d\u8d77']
    },
    {
      pk: 775819494,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819494/',
      term: '\u5bf9\u9762',
      fragment: '\u5728 \u516c\u56ed \u5bf9\u9762 \u5417',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-18T06:49:18.092523',
      status_changed_date: '2026-02-03T06:49:18.092523',
      notes: '',
      audio: null,
      words: ['\u5bf9\u9762'],
      tags: [],
      hints: [
        {
          id: 1542784,
          locale: 'en',
          text: 'opposite',
          term: '\u5bf9\u9762',
          popularity: 2010,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['du\u00ecmi\u00e0n'],
        hant: ['\u5c0d\u9762']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5bf9\u9762']
    },
    {
      pk: 778980868,
      url: 'https://www.lingq.com/api/v3/zh/cards/778980868/',
      term: '\u5c0f',
      fragment: '\u597d\u3001 \u5c0f\u3001 \u65e9',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:49:16.493001',
      status_changed_date: '2026-02-03T06:49:16.493001',
      notes: '',
      audio: null,
      words: ['\u5c0f'],
      tags: [],
      hints: [
        {
          id: 13531194,
          locale: 'en',
          text: 'small',
          term: '\u5c0f',
          popularity: 2004,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01ceo'],
        hant: ['\u5c0f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5c0f']
    },
    {
      pk: 775453359,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453359/',
      term: '\u5c0f\u59d0',
      fragment: '\u738b \u5c0f\u59d0 \u662f \u82f1\u56fd\u4eba\u3002',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-18T06:49:36.458073',
      status_changed_date: '2026-02-03T06:49:36.458073',
      notes: '',
      audio: null,
      words: ['\u5c0f\u59d0'],
      tags: [],
      hints: [
        {
          id: 8466108,
          locale: 'en',
          text: 'Miss',
          term: '\u5c0f\u59d0',
          popularity: 457,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01ceojie'],
        hant: ['\u5c0f\u59d0']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5c0f\u59d0']
    },
    {
      pk: 779327681,
      url: 'https://www.lingq.com/api/v3/zh/cards/779327681/',
      term: '\u5c0f\u5fc3',
      fragment: '\u5c0f\u5fc3 \u70eb\uff01',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:52:14.425320',
      status_changed_date: '2026-02-03T06:52:14.425320',
      notes: '',
      audio: null,
      words: ['\u5c0f\u5fc3'],
      tags: [],
      hints: [
        {
          id: 13553697,
          locale: 'en',
          text: 'Be careful',
          term: '\u5c0f\u5fc3',
          popularity: 1112,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01ceox\u012bn'],
        hant: ['\u5c0f\u5fc3']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5c0f\u5fc3']
    },
    {
      pk: 775822820,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822820/',
      term: '\u5c31',
      fragment: '\u9760\u8fb9 \u505c \u5c31 \u53ef\u4ee5 \u4e86',
      importance: 3,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-02T04:06:11.792834',
      status_changed_date: '2026-03-01T04:06:11.792834',
      notes: '',
      audio: null,
      words: ['\u5c31'],
      tags: [],
      hints: [
        {
          id: 23538211,
          locale: 'en',
          text: 'at once, right away, to undertake,  as early as, already',
          term: '\u5c31',
          popularity: 143803,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u00f9'],
        hant: ['\u5c31']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5c31']
    },
    {
      pk: 790055725,
      url: 'https://www.lingq.com/api/v3/zh/cards/790055725/',
      term: '\u5c31\u662f',
      fragment: '\u662f\u7684 \uff0c\u90a3 \u5c31\u662f \u6211 \u7684 \u4e0a\u8863 \uff0c\u84dd',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-24T06:57:45',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5c31\u662f'],
      tags: [],
      hints: [
        {
          id: 15459963,
          locale: 'en',
          text: 'exactly, in the same way, just like',
          term: '\u5c31\u662f',
          popularity: 820,
          is_google_translate: false,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['ji\u00f9sh\u00ec'],
        hant: ['\u5c31\u662f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5c31\u662f']
    },
    {
      pk: 781713782,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713782/',
      term: '\u5c31\u7b97',
      fragment:
        '\u5509\uff0c \u6211 \u8bf4\uff0c \u5c31\u7b97 \u6211 \u83dc\uff0c \u4e5f \u522b\u2026',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:39:56.431920',
      status_changed_date: '2026-02-08T05:39:56.431920',
      notes: '',
      audio: null,
      words: ['\u5c31\u7b97'],
      tags: [],
      hints: [
        {
          id: 18250438,
          locale: 'en',
          text: 'even if',
          term: '\u5c31\u7b97',
          popularity: 289,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u00f9su\u00e0n'],
        hant: ['\u5c31\u7b97']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5c31\u7b97']
    },
    {
      pk: 794554686,
      url: 'https://www.lingq.com/api/v3/zh/cards/794554686/',
      term: '\u5c71\u4e0a',
      fragment: '\u5f00\u8f66 \u53bb \u9644\u8fd1 \u7684 \u5c71\u4e0a',
      importance: 1,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T02:09:06.751157',
      status_changed_date: '2026-03-10T02:09:06.751157',
      notes: '',
      audio: null,
      words: ['\u5c71\u4e0a'],
      tags: [],
      hints: [
        {
          id: 1534382,
          locale: 'en',
          text: 'mountain top',
          term: '\u5c71\u4e0a',
          popularity: 820,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u0101nsh\u00e0ng'],
        hant: ['\u5c71\u4e0a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5c71\u4e0a']
    },
    {
      pk: 781021642,
      url: 'https://www.lingq.com/api/v3/zh/cards/781021642/',
      term: '\u5de5\u4f5c',
      fragment: '\u6765 \u5de5\u4f5c\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:25:21.836638',
      status_changed_date: '2026-02-07T04:25:21.836638',
      notes: '',
      audio: null,
      words: ['\u5de5\u4f5c'],
      tags: [],
      hints: [
        {
          id: 1145400,
          locale: 'en',
          text: 'work',
          term: '\u5de5\u4f5c',
          popularity: 1578,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u014dngzu\u00f2'],
        hant: ['\u5de5\u4f5c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5de5\u4f5c']
    },
    {
      pk: 794554798,
      url: 'https://www.lingq.com/api/v3/zh/cards/794554798/',
      term: '\u5dee\u4e0d\u591a',
      fragment: '\u54e6 \uff0c\u5dee\u4e0d\u591a \u5230 \u5403 \u665a\u996d \u7684',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T02:09:29.747000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5dee\u4e0d\u591a'],
      tags: [],
      hints: [
        {
          id: 14512882,
          locale: 'en',
          text: 'almost, nearly',
          term: '\u5dee\u4e0d\u591a',
          popularity: 739,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u00e0budu\u014d'],
        hant: ['\u5dee\u4e0d\u591a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5dee\u4e0d\u591a']
    },
    {
      pk: 775822597,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822597/',
      term: '\u5e08\u5085',
      fragment: '\u5e08\u5085 \uff0c\u5728 \u8fd9\u513f \u505c\u8f66',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:27:03.127197',
      status_changed_date: '2026-02-07T04:27:03.127197',
      notes: '',
      audio: null,
      words: ['\u5e08\u5085'],
      tags: [],
      hints: [
        {
          id: 13488200,
          locale: 'en',
          text: 'master',
          term: '\u5e08\u5085',
          popularity: 766,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u012bfu'],
        hant: ['\u5e2b\u5085']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e08\u5085']
    },
    {
      pk: 776888688,
      url: 'https://www.lingq.com/api/v3/zh/cards/776888688/',
      term: '\u5e26',
      fragment: '\u6211 \u6ca1 \u5e26 \u96e8\u4f1e',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:25:35.805653',
      status_changed_date: '2026-02-07T04:25:35.805653',
      notes: '',
      audio: null,
      words: ['\u5e26'],
      tags: [],
      hints: [
        {
          id: 12794828,
          locale: 'en',
          text: 'bring',
          term: '\u5e26',
          popularity: 231,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e0i'],
        hant: ['\u5e36']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e26']
    },
    {
      pk: 776160845,
      url: 'https://www.lingq.com/api/v3/zh/cards/776160845/',
      term: '\u5e2e',
      fragment: '\u80fd \u5e2e \u6211 \u4e00\u4e0b \u5417\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:49:09.895538',
      status_changed_date: '2026-02-03T06:49:09.895538',
      notes: '',
      audio: null,
      words: ['\u5e2e'],
      tags: [],
      hints: [
        {
          id: 386069,
          locale: 'en',
          text: 'help',
          term: '\u5e2e',
          popularity: 3109,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u0101ng'],
        hant: ['\u5e6b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e2e']
    },
    {
      pk: 790056562,
      url: 'https://www.lingq.com/api/v3/zh/cards/790056562/',
      term: '\u5e3d\u5b50',
      fragment:
        '\u548c \u6211 \u7684 \u84dd \u5e3d\u5b50 \u642d\u914d \u8d77\u6765 \uff0c\u663e\u5f97 \u5f88',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-24T07:01:20',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5e3d\u5b50'],
      tags: [],
      hints: [
        {
          id: 10400187,
          locale: 'en',
          text: 'hat',
          term: '\u5e3d\u5b50',
          popularity: 2105,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u00e0ozi'],
        hant: ['\u5e3d\u5b50']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e3d\u5b50']
    },
    {
      pk: 777563809,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563809/',
      term: '\u5e72',
      fragment: '\u4f60 \u5728 \u5e72 \u5417\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:51:09.410352',
      status_changed_date: '2026-02-03T06:51:09.410352',
      notes: '',
      audio: null,
      words: ['\u5e72'],
      tags: [],
      hints: [
        {
          id: 160047900,
          locale: 'en',
          text: 'doing',
          term: '\u5e72',
          popularity: 97,
          is_google_translate: false,
          flagged: false
        },
        {
          id: 11626991,
          locale: 'en',
          text: 'dry',
          term: '\u5e72',
          popularity: 86,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u0101n'],
        hant: ['\u5e79']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e72']
    },
    {
      pk: 781020279,
      url: 'https://www.lingq.com/api/v3/zh/cards/781020279/',
      term: '\u5e72\u676f',
      fragment: '\u5e72\u676f\uff01',
      importance: 1,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:27:01.550994',
      status_changed_date: '2026-02-07T04:27:01.550994',
      notes: '',
      audio: null,
      words: ['\u5e72\u676f'],
      tags: [],
      hints: [
        {
          id: 20604435,
          locale: 'en',
          text: 'cheers',
          term: '\u5e72\u676f',
          popularity: 107,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u0101nb\u0113i'],
        hant: ['\u5e79\u676f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e72\u676f']
    },
    {
      pk: 777214134,
      url: 'https://www.lingq.com/api/v3/zh/cards/777214134/',
      term: '\u5e76',
      fragment: '\u6211 \u5148 \u505a \u65e9\u996d \u5e76 \u559d \u4e00\u676f \u5496\u5561',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:31:44.629509',
      status_changed_date: '2026-02-06T03:31:44.629509',
      notes: '',
      audio: null,
      words: ['\u5e76'],
      tags: [],
      hints: [
        {
          id: 30809162,
          locale: 'en',
          text: 'and',
          term: '\u5e76',
          popularity: 1187,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00ecng'],
        hant: ['\u4e26']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e76']
    },
    {
      pk: 782328833,
      url: 'https://www.lingq.com/api/v3/zh/cards/782328833/',
      term: '\u5e7a',
      fragment: '\u5e7a \u4e09 \u516d\u2026\u2026',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:26:53.874082',
      status_changed_date: '2026-02-07T04:26:53.874082',
      notes: '',
      audio: null,
      words: ['\u5e7a'],
      tags: [],
      hints: [
        {
          id: 160405584,
          locale: 'en',
          text: 'one',
          term: '\u5e7a',
          popularity: 67,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u0101o'],
        hant: ['\u5e7a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e7a']
    },
    {
      pk: 781714459,
      url: 'https://www.lingq.com/api/v3/zh/cards/781714459/',
      term: '\u5e94\u8be5',
      fragment: '\u558f\uff0c \u4f60 \u5e94\u8be5 \u8fd9\u6837 \u63e1 \u7403\u62cd\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:39:30.417674',
      status_changed_date: '2026-02-08T05:39:30.417674',
      notes: '',
      audio: null,
      words: ['\u5e94\u8be5'],
      tags: [],
      hints: [
        {
          id: 12396286,
          locale: 'en',
          text: 'Should',
          term: '\u5e94\u8be5',
          popularity: 2670,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bngg\u0101i'],
        hant: ['\u61c9\u8a72']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5e94\u8be5']
    },
    {
      pk: 776513089,
      url: 'https://www.lingq.com/api/v3/zh/cards/776513089/',
      term: '\u5ea6\u5047',
      fragment: '\u6211 \u53bb \u5ea6\u5047',
      importance: 1,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:27:19.776269',
      status_changed_date: '2026-02-07T04:27:19.776269',
      notes: '',
      audio: null,
      words: ['\u5ea6\u5047'],
      tags: [],
      hints: [
        {
          id: 159047713,
          locale: 'en',
          text: 'on vacation',
          term: '\u5ea6\u5047',
          popularity: 251,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00f9ji\u00e0'],
        hant: ['\u5ea6\u5047']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5ea6\u5047']
    },
    {
      pk: 776514973,
      url: 'https://www.lingq.com/api/v3/zh/cards/776514973/',
      term: '\u5f00',
      fragment: '\u53ef\u4ee5 \u5f00 \u7a7a\u8c03 \u5417',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:52:10.925183',
      status_changed_date: '2026-02-03T06:52:10.925183',
      notes: '',
      audio: null,
      words: ['\u5f00'],
      tags: [],
      hints: [
        {
          id: 12138884,
          locale: 'en',
          text: 'Open',
          term: '\u5f00',
          popularity: 343,
          is_google_translate: false,
          flagged: false
        },
        {
          id: 162241204,
          locale: 'en',
          text: 'turn on',
          term: '\u5f00',
          popularity: 47,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u0101i'],
        hant: ['\u958b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f00']
    },
    {
      pk: 780705734,
      url: 'https://www.lingq.com/api/v3/zh/cards/780705734/',
      term: '\u5f00\u4f1a',
      fragment: '\u6211\u4eec \u4ec0\u4e48 \u65f6\u5019 \u5f00\u4f1a\uff1f',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:34:29.091166',
      status_changed_date: '2026-02-06T03:34:29.091166',
      notes: '',
      audio: null,
      words: ['\u5f00\u4f1a'],
      tags: [],
      hints: [
        {
          id: 72694111,
          locale: 'en',
          text: 'have a meeting',
          term: '\u5f00\u4f1a',
          popularity: 216,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u0101ihu\u00ec'],
        hant: ['\u958b\u6703']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f00\u4f1a']
    },
    {
      pk: 783754485,
      url: 'https://www.lingq.com/api/v3/zh/cards/783754485/',
      term: '\u5f00\u59cb',
      fragment: '\u2026\u65e9\u4e0a \u4e03 \u70b9 \u534a \u5f00\u59cb \u5de5\u4f5c\u3002',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:26:49.915771',
      status_changed_date: '2026-02-07T04:26:49.915771',
      notes: '',
      audio: null,
      words: ['\u5f00\u59cb'],
      tags: [],
      hints: [
        {
          id: 7479604,
          locale: 'en',
          text: 'start',
          term: '\u5f00\u59cb',
          popularity: 1061,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u0101ish\u01d0'],
        hant: ['\u958b\u59cb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f00\u59cb']
    },
    {
      pk: 776513265,
      url: 'https://www.lingq.com/api/v3/zh/cards/776513265/',
      term: '\u5f00\u5fc3',
      fragment: '\u73a9 \u5f97 \u5f00\u5fc3 \u70b9',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:26:53.876129',
      status_changed_date: '2026-02-07T04:26:53.876129',
      notes: '',
      audio: null,
      words: ['\u5f00\u5fc3'],
      tags: [],
      hints: [
        {
          id: 18780420,
          locale: 'en',
          text: 'happy',
          term: '\u5f00\u5fc3',
          popularity: 581,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u0101ix\u012bn'],
        hant: ['\u958b\u5fc3']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f00\u5fc3']
    },
    {
      pk: 777214180,
      url: 'https://www.lingq.com/api/v3/zh/cards/777214180/',
      term: '\u5f00\u8f66',
      fragment: '\u63a5\u7740 \u5f00\u8f66 \u53bb \u4e0a\u73ed',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:51:44.632252',
      status_changed_date: '2026-02-03T06:51:44.632252',
      notes: '',
      audio: null,
      words: ['\u5f00\u8f66'],
      tags: [],
      hints: [
        {
          id: 12705088,
          locale: 'en',
          text: 'to drive a car',
          term: '\u5f00\u8f66',
          popularity: 113,
          is_google_translate: false,
          flagged: true
        },
        {
          id: 10483999,
          locale: 'en',
          text: 'drive',
          term: '\u5f00\u8f66',
          popularity: 2524,
          is_google_translate: true,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['k\u0101ich\u0113'],
        hant: ['\u958b\u8eca']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f00\u8f66']
    },
    {
      pk: 792058225,
      url: 'https://www.lingq.com/api/v3/zh/cards/792058225/',
      term: '\u5f00\u95e8',
      fragment: '\u8fd9 \u5bb6 \u996d\u9986 \u51e0\u70b9 \u5f00\u95e8\uff1f',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T05:06:18.498957',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f00\u95e8'],
      tags: [],
      hints: [
        {
          id: 226800191,
          locale: 'en',
          text: 'open (plural)',
          term: '\u5f00\u95e8',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u0101im\u00e9n'],
        hant: ['\u958b\u9580']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f00\u95e8']
    },
    {
      pk: 777907379,
      url: 'https://www.lingq.com/api/v3/zh/cards/777907379/',
      term: '\u5f1f\u5f1f',
      fragment:
        '\u7238\u7238\u3001 \u5988\u5988\u3001 \u54e5\u54e5\u3001 \u5f1f\u5f1f\u3001 \u59d0\u59d0 \u548c \u6211\u3002',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:49:11.714963',
      status_changed_date: '2026-02-03T06:49:11.714963',
      notes: '',
      audio: null,
      words: ['\u5f1f\u5f1f'],
      tags: [],
      hints: [
        {
          id: 12710257,
          locale: 'en',
          text: 'younger brother',
          term: '\u5f1f\u5f1f',
          popularity: 501,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00ecdi'],
        hant: ['\u5f1f\u5f1f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f1f\u5f1f']
    },
    {
      pk: 785462486,
      url: 'https://www.lingq.com/api/v3/zh/cards/785462486/',
      term: '\u5f20\u57fa',
      fragment: '\u55e8\uff0c \u6211 \u53eb \u5f20\u57fa\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:06:00.985094',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f20\u57fa'],
      tags: [],
      hints: [
        {
          id: 69293346,
          locale: 'en',
          text: 'Zhang Ji',
          term: '\u5f20\u57fa',
          popularity: 119,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u0101ng j\u012b'],
        hant: ['\u5f35\u57fa']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f20\u57fa']
    },
    {
      pk: 785462267,
      url: 'https://www.lingq.com/api/v3/zh/cards/785462267/',
      term: '\u5f20\u6d9b',
      fragment: '\u6253\u6270 \u4e00\u4e0b\uff0c \u4f60 \u662f \u5f20\u6d9b \u5417\uff1f',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:04:39.062920',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f20\u6d9b'],
      tags: [],
      hints: [
        {
          id: 386685,
          locale: 'en',
          text: 'Zhang Tao',
          term: '\u5f20\u6d9b',
          popularity: 166,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u0101ng t\u0101o'],
        hant: ['\u5f35\u6fe4']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f20\u6d9b']
    },
    {
      pk: 784071319,
      url: 'https://www.lingq.com/api/v3/zh/cards/784071319/',
      term: '\u5f53',
      fragment: '\u6211 \u5728 \u4e00\u5bb6 \u9910\u5385 \u5f53 \u53a8\u5e08\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:17:02.462877',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f53'],
      tags: [],
      hints: [
        {
          id: 29668380,
          locale: 'en',
          text: 'Work, serve as / When',
          term: '\u5f53',
          popularity: 66,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u0101ng'],
        hant: ['\u7576']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f53']
    },
    {
      pk: 775820042,
      url: 'https://www.lingq.com/api/v3/zh/cards/775820042/',
      term: '\u5f53\u5fc3',
      fragment: '\u5b9d\u5b9d \uff0c\u5f53\u5fc3',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-21T03:33:44.649076',
      status_changed_date: '2026-02-06T03:33:44.649076',
      notes: '',
      audio: null,
      words: ['\u5f53\u5fc3'],
      tags: [],
      hints: [
        {
          id: 159988847,
          locale: 'en',
          text: 'be careful',
          term: '\u5f53\u5fc3',
          popularity: 350,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u0101ngx\u012bn'],
        hant: ['\u7576\u5fc3']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f53\u5fc3']
    },
    {
      pk: 776157813,
      url: 'https://www.lingq.com/api/v3/zh/cards/776157813/',
      term: '\u5f53\u7136',
      fragment: '\u5f53\u7136\u3002',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:49:13.341723',
      status_changed_date: '2026-02-03T06:49:13.341723',
      notes: '',
      audio: null,
      words: ['\u5f53\u7136'],
      tags: [],
      hints: [
        {
          id: 2788151,
          locale: 'en',
          text: 'of course',
          term: '\u5f53\u7136',
          popularity: 397,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u0101ngr\u00e1n'],
        hant: ['\u7576\u7136']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f53\u7136']
    },
    {
      pk: 784784404,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784404/',
      term: '\u5f85',
      fragment:
        '\u6211 \u8fd8\u662f \u51b3\u5b9a \u5f85 \u5728 \u5bb6\u91cc \u5b66\u4e60\u3001 \u7701\u94b1\u3002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:23:13.474880',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f85'],
      tags: [],
      hints: [
        {
          id: 34606780,
          locale: 'en',
          text: 'wait, stay',
          term: '\u5f85',
          popularity: 157,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u0101i'],
        hant: ['\u5f85']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f85']
    },
    {
      pk: 784784102,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784102/',
      term: '\u5f85\u5728',
      fragment:
        '\u4ed6 \u8fd8\u662f \u51b3\u5b9a \u5f85\u5728 \u5bb6\u91cc \u5b66\u4e60\u3001 \u7701\u94b1\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:20:50.961777',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f85\u5728'],
      tags: [],
      hints: [
        {
          id: 142495474,
          locale: 'en',
          text: 'stay at',
          term: '\u5f85\u5728',
          popularity: 645,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u0101i z\u00e0i'],
        hant: ['\u5f85\u5728']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f85\u5728']
    },
    {
      pk: 775450751,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450751/',
      term: '\u5f88',
      fragment: '\u6211 \u5f88 \u597d\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-21T03:41:11.225884',
      status_changed_date: '2026-02-06T03:41:11.225884',
      notes: '',
      audio: null,
      words: ['\u5f88'],
      tags: [],
      hints: [
        {
          id: 128273258,
          locale: 'en',
          text: 'very',
          term: '\u5f88',
          popularity: 1698,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u011bn'],
        hant: ['\u5f88']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f88']
    },
    {
      pk: 784071440,
      url: 'https://www.lingq.com/api/v3/zh/cards/784071440/',
      term: '\u5f88\u591a',
      fragment:
        '\u8fd9\u4e9b \u987e\u5ba2 \u6765\u81ea \u5f88\u591a \u4e0d\u540c \u7684 \u56fd\u5bb6\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:17:43.835676',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f88\u591a'],
      tags: [],
      hints: [
        {
          id: 15068958,
          locale: 'en',
          text: 'very many, very much, great (quantity)',
          term: '\u5f88\u591a',
          popularity: 155614,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u011bn du\u014d'],
        hant: ['\u5f88\u591a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f88\u591a']
    },
    {
      pk: 785461915,
      url: 'https://www.lingq.com/api/v3/zh/cards/785461915/',
      term: '\u5f88\u597d',
      fragment: '\u54e6\uff0c \u5f88\u597d\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:02:37.587907',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5f88\u597d'],
      tags: [],
      hints: [
        {
          id: 5897643,
          locale: 'en',
          text: 'very good',
          term: '\u5f88\u597d',
          popularity: 294,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u011bn h\u01ceo'],
        hant: ['\u5f88\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f88\u597d']
    },
    {
      pk: 776157676,
      url: 'https://www.lingq.com/api/v3/zh/cards/776157676/',
      term: '\u5f97',
      fragment: '\u4f60 \u53ef\u4ee5 \u8bf4 \u5f97 \u6162 \u4e00\u70b9 \u5417\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:52:21.213888',
      status_changed_date: '2026-02-03T06:52:21.213888',
      notes: '',
      audio: null,
      words: ['\u5f97'],
      tags: [],
      hints: [
        {
          id: 19577583,
          locale: 'en',
          text: 'structural particle: used after a verb (or adjective as main verb), linking it to following phrase indicating effect, degree, possibility etc',
          term: '\u5f97',
          popularity: 183584,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['de'],
        hant: ['\u5f97']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5f97']
    },
    {
      pk: 775822332,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822332/',
      term: '\u5fb7\u56fd',
      fragment: '\u5bc4\u5230 \u5fb7\u56fd',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:28:04.787737',
      status_changed_date: '2026-02-07T04:28:04.787737',
      notes: '',
      audio: null,
      words: ['\u5fb7\u56fd'],
      tags: [],
      hints: [
        {
          id: 13483132,
          locale: 'en',
          text: 'Germany',
          term: '\u5fb7\u56fd',
          popularity: 571,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e9gu\u00f3'],
        hant: ['\u5fb7\u570b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5fb7\u56fd']
    },
    {
      pk: 775455629,
      url: 'https://www.lingq.com/api/v3/zh/cards/775455629/',
      term: '\u5fd9',
      fragment: '\u4ed6\u4eec \u90fd \u5f88 \u5fd9\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-21T03:38:31.002502',
      status_changed_date: '2026-02-06T03:38:31.002502',
      notes: '',
      audio: null,
      words: ['\u5fd9'],
      tags: [],
      hints: [
        {
          id: 387363,
          locale: 'en',
          text: 'busy',
          term: '\u5fd9',
          popularity: 3731,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u00e1ng'],
        hant: ['\u5fd9']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5fd9']
    },
    {
      pk: 777210894,
      url: 'https://www.lingq.com/api/v3/zh/cards/777210894/',
      term: '\u5feb',
      fragment: '\u5feb \u8d77\u5e8a',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:51:37.897343',
      status_changed_date: '2026-02-03T06:51:37.897343',
      notes: '',
      audio: null,
      words: ['\u5feb'],
      tags: [],
      hints: [
        {
          id: 387430,
          locale: 'en',
          text: 'fast',
          term: '\u5feb',
          popularity: 1778,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ku\u00e0i'],
        hant: ['\u5feb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5feb']
    },
    {
      pk: 776888339,
      url: 'https://www.lingq.com/api/v3/zh/cards/776888339/',
      term: '\u600e\u4e48',
      fragment: '',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:53:34.707928',
      status_changed_date: '2026-02-03T06:53:34.707928',
      notes: '',
      audio: null,
      words: ['\u600e\u4e48'],
      tags: [],
      hints: [
        {
          id: 114588890,
          locale: 'en',
          text: 'what',
          term: '\u600e\u4e48',
          popularity: 22,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u011bnme'],
        hant: ['\u600e\u9ebc']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u600e\u4e48']
    },
    {
      pk: 776515122,
      url: 'https://www.lingq.com/api/v3/zh/cards/776515122/',
      term: '\u600e\u4e48\u6837',
      fragment: '',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:41:06.946032',
      status_changed_date: '2026-02-06T03:41:06.946032',
      notes: '',
      audio: null,
      words: ['\u600e\u4e48\u6837'],
      tags: [],
      hints: [
        {
          id: 12855303,
          locale: 'en',
          text: 'how is it',
          term: '\u600e\u4e48\u6837',
          popularity: 150,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u011bnmey\u00e0ng'],
        hant: ['\u600e\u9ebc\u6a23']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u600e\u4e48\u6837']
    },
    {
      pk: 776889517,
      url: 'https://www.lingq.com/api/v3/zh/cards/776889517/',
      term: '\u6015',
      fragment: '\u6211 \u6015 \u9ed1',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:53:46.176438',
      status_changed_date: '2026-02-03T06:53:46.176438',
      notes: '',
      audio: null,
      words: ['\u6015'],
      tags: [],
      hints: [
        {
          id: 22077170,
          locale: 'en',
          text: 'dread, be afraid',
          term: '\u6015',
          popularity: 30,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['p\u00e0'],
        hant: ['\u6015']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6015']
    },
    {
      pk: 792059210,
      url: 'https://www.lingq.com/api/v3/zh/cards/792059210/',
      term: '\u6069',
      fragment: '\u6069\uff0c \u597d \u4e3b\u610f\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T05:11:57.581210',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6069'],
      tags: [],
      hints: [
        {
          id: 13540184,
          locale: 'en',
          text: 'Yep',
          term: '\u6069',
          popularity: 1637,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u0113n'],
        hant: ['\u6069']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6069']
    },
    {
      pk: 775818009,
      url: 'https://www.lingq.com/api/v3/zh/cards/775818009/',
      term: '\u60a8',
      fragment: '\u60a8 \u7b2c\u4e00\u6b21 \u6765 \u4e2d\u56fd \u5417',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-04T06:53:30.644484',
      status_changed_date: '2026-02-03T06:53:30.644484',
      notes: '',
      audio: null,
      words: ['\u60a8'],
      tags: [],
      hints: [
        {
          id: 1208710,
          locale: 'en',
          text: 'you',
          term: '\u60a8',
          popularity: 358,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u00edn'],
        hant: ['\u60a8']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u60a8']
    },
    {
      pk: 779979826,
      url: 'https://www.lingq.com/api/v3/zh/cards/779979826/',
      term: '\u60f3',
      fragment: '\u5148\u751f\uff0c \u4f60 \u60f3 \u5403 \u4ec0\u4e48\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:53:19.130309',
      status_changed_date: '2026-02-03T06:53:19.130309',
      notes: '',
      audio: null,
      words: ['\u60f3'],
      tags: [],
      hints: [
        {
          id: 19030459,
          locale: 'en',
          text: 'want',
          term: '\u60f3',
          popularity: 653,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01ceng'],
        hant: ['\u60f3']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u60f3']
    },
    {
      pk: 792059347,
      url: 'https://www.lingq.com/api/v3/zh/cards/792059347/',
      term: '\u60f3\u597d',
      fragment: '\u55ef\uff0c \u6211 \u4e5f \u6ca1 \u60f3\u597d\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T05:12:45.515709',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u60f3\u597d'],
      tags: [],
      hints: [
        {
          id: 171172133,
          locale: 'en',
          text: 'decide',
          term: '\u60f3\u597d',
          popularity: 18,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01ceng h\u01ceo'],
        hant: ['\u60f3\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u60f3\u597d']
    },
    {
      pk: 794245350,
      url: 'https://www.lingq.com/api/v3/zh/cards/794245350/',
      term: '\u60f3\u8981',
      fragment: '\u4f60 \u60f3\u8981 \u6765 \u70b9 \u4ec0\u4e48',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:48:14.836000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u60f3\u8981'],
      tags: [],
      hints: [
        {
          id: 387968,
          locale: 'en',
          text: 'want',
          term: '\u60f3\u8981',
          popularity: 1724,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01cengy\u00e0o'],
        hant: ['\u60f3\u8981']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u60f3\u8981']
    },
    {
      pk: 783753107,
      url: 'https://www.lingq.com/api/v3/zh/cards/783753107/',
      term: '\u6109\u5feb',
      fragment: '\u2026\u804a\u5929\uff0c \u8fc8\u514b \u611f\u5230 \u5f88 \u6109\u5feb\u3002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:25:44.837835',
      status_changed_date: '2026-02-07T04:25:44.837835',
      notes: '',
      audio: null,
      words: ['\u6109\u5feb'],
      tags: [],
      hints: [
        {
          id: 27236985,
          locale: 'en',
          text: 'cheerful / happy / delighted',
          term: '\u6109\u5feb',
          popularity: 266276,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u00faku\u00e0i'],
        hant: ['\u6109\u5feb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6109\u5feb']
    },
    {
      pk: 783753087,
      url: 'https://www.lingq.com/api/v3/zh/cards/783753087/',
      term: '\u611f\u5230',
      fragment:
        '\u2026\u8fd9\u4e9b \u987e\u5ba2 \u804a\u5929\uff0c \u8fc8\u514b \u611f\u5230 \u5f88 \u6109\u5feb\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:25:09.028320',
      status_changed_date: '2026-02-07T04:25:09.028320',
      notes: '',
      audio: null,
      words: ['\u611f\u5230'],
      tags: [],
      hints: [
        {
          id: 29668143,
          locale: 'en',
          text: 'feel / sense',
          term: '\u611f\u5230',
          popularity: 86,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u01cend\u00e0o'],
        hant: ['\u611f\u5230']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u611f\u5230']
    },
    {
      pk: 776157746,
      url: 'https://www.lingq.com/api/v3/zh/cards/776157746/',
      term: '\u6162',
      fragment: '\u4f60 \u53ef\u4ee5 \u8bf4 \u5f97 \u6162 \u4e00\u70b9 \u5417\uff1f',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:25:06.564759',
      status_changed_date: '2026-02-07T04:25:06.564759',
      notes: '',
      audio: null,
      words: ['\u6162'],
      tags: [],
      hints: [
        {
          id: 208345791,
          locale: 'en',
          text: 'slow',
          term: '\u6162',
          popularity: 197,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u00e0n'],
        hant: ['\u6162']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6162']
    },
    {
      pk: 782328076,
      url: 'https://www.lingq.com/api/v3/zh/cards/782328076/',
      term: '\u61c2',
      fragment: '\u4f60 \u4e0d \u61c2 \u4e2d\u6587\uff1f',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:28:17.313728',
      status_changed_date: '2026-02-07T04:28:17.313728',
      notes: '',
      audio: null,
      words: ['\u61c2'],
      tags: [],
      hints: [
        {
          id: 13554542,
          locale: 'en',
          text: 'understand',
          term: '\u61c2',
          popularity: 1076,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u01d2ng'],
        hant: ['\u61c2']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u61c2']
    },
    {
      pk: 775450734,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450734/',
      term: '\u6211',
      fragment: '\u6211 \u5f88 \u597d\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-28T02:01:33.879472',
      status_changed_date: '2026-01-28T02:01:33.879472',
      notes: '',
      audio: null,
      words: ['\u6211'],
      tags: [],
      hints: [
        {
          id: 163083465,
          locale: 'en',
          text: 'I',
          term: '\u6211',
          popularity: 2487,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01d2'],
        hant: ['\u6211']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6211']
    },
    {
      pk: 776514727,
      url: 'https://www.lingq.com/api/v3/zh/cards/776514727/',
      term: '\u6211\u4eec',
      fragment: '',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-10-02T04:38:41.718484',
      status_changed_date: '2026-01-23T04:38:41.718484',
      notes: '',
      audio: null,
      words: ['\u6211\u4eec'],
      tags: [],
      hints: [
        {
          id: 5195261,
          locale: 'en',
          text: 'we',
          term: '\u6211\u4eec',
          popularity: 210398,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01d2men'],
        hant: ['\u6211\u5011']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6211\u4eec']
    },
    {
      pk: 782019361,
      url: 'https://www.lingq.com/api/v3/zh/cards/782019361/',
      term: '\u624b',
      fragment: '\u2026\u4e2a \u793c \u5440\uff0c \u63e1\u63e1 \u624b\uff0c',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:38:38.302009',
      status_changed_date: '2026-02-06T03:38:38.302009',
      notes: '',
      audio: null,
      words: ['\u624b'],
      tags: [],
      hints: [
        {
          id: 5941747,
          locale: 'en',
          text: 'hand',
          term: '\u624b',
          popularity: 544,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u01d2u'],
        hant: ['\u624b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u624b']
    },
    {
      pk: 777564344,
      url: 'https://www.lingq.com/api/v3/zh/cards/777564344/',
      term: '\u624b\u673a',
      fragment: '\u8c01 \u7684 \u624b\u673a \u5728 \u54cd\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:40:02.449410',
      status_changed_date: '2026-02-06T03:40:02.449410',
      notes: '',
      audio: null,
      words: ['\u624b\u673a'],
      tags: [],
      hints: [
        {
          id: 18308688,
          locale: 'en',
          text: 'mobile phone',
          term: '\u624b\u673a',
          popularity: 420,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u01d2uj\u012b'],
        hant: ['\u624b\u6a5f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u624b\u673a']
    },
    {
      pk: 781713444,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713444/',
      term: '\u6253',
      fragment:
        '\u5475\u5475\uff0c \u7fbd\u6bdb\u7403 \u6211 \u53ef \u6253 \u4e0d\u597d\uff0c \u4f60 \u6765 \u53d1\u7403\u2026',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:38:34.950452',
      status_changed_date: '2026-02-06T03:38:34.950452',
      notes: '',
      audio: null,
      words: ['\u6253'],
      tags: [],
      hints: [
        {
          id: 224451014,
          locale: 'en',
          text: 'hit / play (ball)',
          term: '\u6253',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e1'],
        hant: ['\u6253']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6253']
    },
    {
      pk: 782708384,
      url: 'https://www.lingq.com/api/v3/zh/cards/782708384/',
      term: '\u6253\u5f00',
      fragment: '\u6253\u5f00 \u4e66\u3002',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:27:15.384271',
      status_changed_date: '2026-02-07T04:27:15.384271',
      notes: '',
      audio: null,
      words: ['\u6253\u5f00'],
      tags: [],
      hints: [
        {
          id: 21491380,
          locale: 'en',
          text: 'to open',
          term: '\u6253\u5f00',
          popularity: 7,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u01cek\u0101i'],
        hant: ['\u6253\u958b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6253\u5f00']
    },
    {
      pk: 785462091,
      url: 'https://www.lingq.com/api/v3/zh/cards/785462091/',
      term: '\u6253\u6270',
      fragment: '\u6253\u6270 \u4e00\u4e0b\uff0c \u4f60 \u662f \u6768\u96ea\u2026',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:03:40.095421',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6253\u6270'],
      tags: [],
      hints: [
        {
          id: 187221175,
          locale: 'en',
          text: 'to disturb; to bother; to trouble',
          term: '\u6253\u6270',
          popularity: 7020,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u01cer\u01ceo'],
        hant: ['\u6253\u64fe']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6253\u6270']
    },
    {
      pk: 784784936,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784936/',
      term: '\u6253\u7b97',
      fragment: '\u8fbe\u65af\u6c40 \u6253\u7b97 \u5b66 \u6cd5\u8bed \u5417\uff1f',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:27:09.041366',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6253\u7b97'],
      tags: [],
      hints: [
        {
          id: 15079244,
          locale: 'en',
          text: 'plan, intend',
          term: '\u6253\u7b97',
          popularity: 275277,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u01cesu\u00e0n'],
        hant: ['\u6253\u7b97']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6253\u7b97']
    },
    {
      pk: 781713618,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713618/',
      term: '\u6263\u7403',
      fragment: '\u6f02\u4eae \u7684 \u6263\u7403\uff01',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:40:16.502827',
      status_changed_date: '2026-02-06T03:40:16.502827',
      notes: '',
      audio: null,
      words: ['\u6263\u7403'],
      tags: [],
      hints: [
        {
          id: 195673377,
          locale: 'en',
          text: 'spike ball',
          term: '\u6263\u7403',
          popularity: 27,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u00f2uqi\u00fa'],
        hant: ['\u6263\u7403']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6263\u7403']
    },
    {
      pk: 782018834,
      url: 'https://www.lingq.com/api/v3/zh/cards/782018834/',
      term: '\u627e',
      fragment: '\u627e\u554a \u627e\u554a \u627e \u670b\u53cb\uff0c',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:25:33.868625',
      status_changed_date: '2026-02-07T04:25:33.868625',
      notes: '',
      audio: null,
      words: ['\u627e'],
      tags: [],
      hints: [
        {
          id: 224552539,
          locale: 'en',
          text: 'search / look for',
          term: '\u627e',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u01ceo'],
        hant: ['\u627e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u627e']
    },
    {
      pk: 782018857,
      url: 'https://www.lingq.com/api/v3/zh/cards/782018857/',
      term: '\u627e\u5230',
      fragment: '\u627e\u5230 \u4e00 \u4e2a \u597d \u670b\u53cb\uff0c',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:40:32.573754',
      status_changed_date: '2026-02-06T03:40:32.573754',
      notes: '',
      audio: null,
      words: ['\u627e\u5230'],
      tags: [],
      hints: [
        {
          id: 15067708,
          locale: 'en',
          text: 'succeeded in finding',
          term: '\u627e\u5230',
          popularity: 2746,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u01ceod\u00e0o'],
        hant: ['\u627e\u5230']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u627e\u5230']
    },
    {
      pk: 782018828,
      url: 'https://www.lingq.com/api/v3/zh/cards/782018828/',
      term: '\u627e\u554a',
      fragment: '\u627e\u554a \u627e\u554a \u627e \u670b\u53cb\uff0c',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:40:22.373864',
      status_changed_date: '2026-02-06T03:40:22.373864',
      notes: '',
      audio: null,
      words: ['\u627e\u554a'],
      tags: [],
      hints: [
        {
          id: 186834364,
          locale: 'en',
          text: 'find',
          term: '\u627e\u554a',
          popularity: 75,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u01ceo \u00e1'],
        hant: ['\u627e\u554a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u627e\u554a']
    },
    {
      pk: 786158294,
      url: 'https://www.lingq.com/api/v3/zh/cards/786158294/',
      term: '\u628a',
      fragment: '\u8bf7 \u628a \u6211 \u7684 \u4e0a\u8863 \u7ed9\u2026',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T04:40:42.858880',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u628a'],
      tags: [],
      hints: [
        {
          id: 217251774,
          locale: 'en',
          text: 'particle for object manipulation',
          term: '\u628a',
          popularity: 49,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00e0'],
        hant: ['\u628a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u628a']
    },
    {
      pk: 776511831,
      url: 'https://www.lingq.com/api/v3/zh/cards/776511831/',
      term: '\u62a5\u7eb8',
      fragment: '\u770b \u62a5\u7eb8',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T06:53:28.465854',
      status_changed_date: '2026-02-03T06:53:28.465854',
      notes: '',
      audio: null,
      words: ['\u62a5\u7eb8'],
      tags: [],
      hints: [
        {
          id: 7479801,
          locale: 'en',
          text: 'newspaper',
          term: '\u62a5\u7eb8',
          popularity: 464,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00e0ozh\u01d0'],
        hant: ['\u5831\u7d19']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u62a5\u7eb8']
    },
    {
      pk: 792383362,
      url: 'https://www.lingq.com/api/v3/zh/cards/792383362/',
      term: '\u62dc\u62dc',
      fragment: '\u597d\u7684\u3002 \u62dc\u62dc\uff0c \u4e00\u4f1a\u89c1\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-04T05:09:48.988117',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u62dc\u62dc'],
      tags: [],
      hints: [
        {
          id: 389140,
          locale: 'en',
          text: 'bye bye',
          term: '\u62dc\u62dc',
          popularity: 471,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00e1ib\u00e1i'],
        hant: ['\u62dc\u62dc']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u62dc\u62dc']
    },
    {
      pk: 795224519,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224519/',
      term: '\u62ff\u6765',
      fragment:
        '\u5728 \u83dc\u5355 \u62ff\u6765 \u4e4b\u524d \uff0c\u4f60\u4eec \u60f3\u8981 \u559d',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:47:13.976000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u62ff\u6765'],
      tags: [],
      hints: [
        {
          id: 20278396,
          locale: 'en',
          text: 'to bring / to fetch / to get',
          term: '\u62ff\u6765',
          popularity: 634,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u00e1l\u00e1i'],
        hant: ['\u62ff\u4f86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u62ff\u6765']
    },
    {
      pk: 775823721,
      url: 'https://www.lingq.com/api/v3/zh/cards/775823721/',
      term: '\u6362',
      fragment: '\u4f60\u597d \uff0c\u53ef\u4ee5 \u6362 \u96f6\u94b1 \u5417',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:37:34.990576',
      status_changed_date: '2026-02-06T03:37:34.990576',
      notes: '',
      audio: null,
      words: ['\u6362'],
      tags: [],
      hints: [
        {
          id: 223339481,
          locale: 'en',
          text: 'to exchange, to change (clothes etc)',
          term: '\u6362',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['hu\u00e0n'],
        hant: ['\u63db']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6362']
    },
    {
      pk: 781713975,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713975/',
      term: '\u6362\u4e86',
      fragment: '\u6362\u4e86 \u4f60\uff0c \u4f60 \u4e5f \u63a5\u2026',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:25:28.895968',
      status_changed_date: '2026-02-07T04:25:28.895968',
      notes: '',
      audio: null,
      words: ['\u6362\u4e86'],
      tags: [],
      hints: [
        {
          id: 182611291,
          locale: 'en',
          text: 'changed',
          term: '\u6362\u4e86',
          popularity: 148,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['hu\u00e0n le'],
        hant: ['\u63db\u4e86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6362\u4e86']
    },
    {
      pk: 777214162,
      url: 'https://www.lingq.com/api/v3/zh/cards/777214162/',
      term: '\u63a5\u7740',
      fragment: '\u63a5\u7740 \u5f00\u8f66 \u53bb \u4e0a\u73ed',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:38:11.171905',
      status_changed_date: '2026-02-06T03:38:11.171905',
      notes: '',
      audio: null,
      words: ['\u63a5\u7740'],
      tags: [],
      hints: [
        {
          id: 100946278,
          locale: 'en',
          text: 'and then; continue, carry on',
          term: '\u63a5\u7740',
          popularity: 1641,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u0113zhe'],
        hant: ['\u63a5\u8457']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u63a5\u7740']
    },
    {
      pk: 781714505,
      url: 'https://www.lingq.com/api/v3/zh/cards/781714505/',
      term: '\u63e1',
      fragment: '\u558f\uff0c \u4f60 \u5e94\u8be5 \u8fd9\u6837 \u63e1 \u7403\u62cd\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:38:38.304233',
      status_changed_date: '2026-02-06T03:38:38.304233',
      notes: '',
      audio: null,
      words: ['\u63e1'],
      tags: [],
      hints: [
        {
          id: 31236189,
          locale: 'en',
          text: 'grip, hold, grasp',
          term: '\u63e1',
          popularity: 40,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00f2'],
        hant: ['\u63e1']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u63e1']
    },
    {
      pk: 790056586,
      url: 'https://www.lingq.com/api/v3/zh/cards/790056586/',
      term: '\u642d\u914d',
      fragment:
        '\u6211 \u7684 \u84dd \u5e3d\u5b50 \u642d\u914d \u8d77\u6765 \uff0c\u663e\u5f97 \u5f88 \u597d\u770b',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-24T07:01:28',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u642d\u914d'],
      tags: [],
      hints: [
        {
          id: 16856805,
          locale: 'en',
          text: 'paired with, matched with',
          term: '\u642d\u914d',
          popularity: 932,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u0101p\u00e8i'],
        hant: ['\u642d\u914d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u642d\u914d']
    },
    {
      pk: 794246172,
      url: 'https://www.lingq.com/api/v3/zh/cards/794246172/',
      term: '\u64ad\u653e',
      fragment:
        '\u662f\u554a \uff0c\u7535\u89c6 \u91cc \u6b63\u5728 \u64ad\u653e \u4e00\u573a \u8db3\u7403 \u6bd4\u8d5b',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:52:29.043000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u64ad\u653e'],
      tags: [],
      hints: [
        {
          id: 14605606,
          locale: 'en',
          text: 'broadcast, transmit',
          term: '\u64ad\u653e',
          popularity: 783,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u014df\u00e0ng'],
        hant: ['\u64ad\u653e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u64ad\u653e']
    },
    {
      pk: 778250556,
      url: 'https://www.lingq.com/api/v3/zh/cards/778250556/',
      term: '\u653e',
      fragment: '\u8bf7 \u4e0d\u8981 \u653e \u5473\u7cbe\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:28:26.105011',
      status_changed_date: '2026-02-07T04:28:26.105011',
      notes: '',
      audio: null,
      words: ['\u653e'],
      tags: [],
      hints: [
        {
          id: 13511637,
          locale: 'en',
          text: 'put',
          term: '\u653e',
          popularity: 958,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['f\u00e0ng'],
        hant: ['\u653e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u653e']
    },
    {
      pk: 781713661,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713661/',
      term: '\u653e\u8fc7',
      fragment: '\u6211 \u5f88 \u83dc\uff0c \u653e\u8fc7 \u6211 \u5427\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:40:56.071184',
      status_changed_date: '2026-02-06T03:40:56.071184',
      notes: '',
      audio: null,
      words: ['\u653e\u8fc7'],
      tags: [],
      hints: [
        {
          id: 186822130,
          locale: 'en',
          text: 'spare',
          term: '\u653e\u8fc7',
          popularity: 31,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['f\u00e0nggu\u00f2'],
        hant: ['\u653e\u904e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u653e\u8fc7']
    },
    {
      pk: 775817473,
      url: 'https://www.lingq.com/api/v3/zh/cards/775817473/',
      term: '\u6545\u4e8b',
      fragment: '\u6545\u4e8b \u4e00 :\u8fc8\u514b \u662f \u4e2a',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:38:15.160784',
      status_changed_date: '2026-02-06T03:38:15.160784',
      notes: '',
      audio: null,
      words: ['\u6545\u4e8b'],
      tags: [],
      hints: [],
      transliteration: {
        pinyin: ['g\u00f9shi'],
        hant: ['\u6545\u4e8b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6545\u4e8b']
    },
    {
      pk: 782019094,
      url: 'https://www.lingq.com/api/v3/zh/cards/782019094/',
      term: '\u656c',
      fragment: '\u656c \u4e2a \u793c \u5440\uff0c \u63e1\u63e1\u2026',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:38:21.947261',
      status_changed_date: '2026-02-06T03:38:21.947261',
      notes: '',
      audio: null,
      words: ['\u656c'],
      tags: [],
      hints: [
        {
          id: 76644285,
          locale: 'en',
          text: 'to revere, respect',
          term: '\u656c',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u00ecng'],
        hant: ['\u656c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u656c']
    },
    {
      pk: 784785037,
      url: 'https://www.lingq.com/api/v3/zh/cards/784785037/',
      term: '\u6574\u4e2a',
      fragment:
        '\u2026\u51b3\u5fc3 \u5b66 \u6cd5\u8bed\u3001 \u7701\u94b1\u3001 \u6574\u4e2a \u5047\u671f \u90fd \u5f85 \u5728\u2026',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:27:48.564531',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6574\u4e2a'],
      tags: [],
      hints: [
        {
          id: 22761465,
          locale: 'en',
          text: 'whole, entire, total',
          term: '\u6574\u4e2a',
          popularity: 119,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u011bngg\u00e8'],
        hant: ['\u6574\u500b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6574\u4e2a']
    },
    {
      pk: 779979416,
      url: 'https://www.lingq.com/api/v3/zh/cards/779979416/',
      term: '\u6587',
      fragment: '\u82f1 \u6587\uff1f',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:40:56.065502',
      status_changed_date: '2026-02-06T03:40:56.065502',
      notes: '',
      audio: null,
      words: ['\u6587'],
      tags: [],
      hints: [
        {
          id: 224451182,
          locale: 'en',
          text: 'language / culture',
          term: '\u6587',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e9n'],
        hant: ['\u6587']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6587']
    },
    {
      pk: 775818526,
      url: 'https://www.lingq.com/api/v3/zh/cards/775818526/',
      term: '\u6587\u5316',
      fragment: '\u7279\u522b \u662f \u4e2d\u56fd \u6587\u5316 \u548c \u8bed\u8a00',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-18T06:53:21.910258',
      status_changed_date: '2026-02-03T06:53:21.910258',
      notes: '',
      audio: null,
      words: ['\u6587\u5316'],
      tags: [],
      hints: [
        {
          id: 12364012,
          locale: 'en',
          text: 'culture',
          term: '\u6587\u5316',
          popularity: 647,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e9nhu\u00e0'],
        hant: ['\u6587\u5316']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6587\u5316']
    },
    {
      pk: 778976634,
      url: 'https://www.lingq.com/api/v3/zh/cards/778976634/',
      term: '\u65b0',
      fragment: '\u65b0\u3001 \u8f7b\u3001 \u5e72',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:37:49.326564',
      status_changed_date: '2026-02-06T03:37:49.326564',
      notes: '',
      audio: null,
      words: ['\u65b0'],
      tags: [],
      hints: [
        {
          id: 3191592,
          locale: 'en',
          text: 'new',
          term: '\u65b0',
          popularity: 265703,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u012bn'],
        hant: ['\u65b0']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65b0']
    },
    {
      pk: 778652686,
      url: 'https://www.lingq.com/api/v3/zh/cards/778652686/',
      term: '\u65b0\u5e74',
      fragment: '\u65b0\u5e74 \u597d',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:40:37.038100',
      status_changed_date: '2026-02-06T03:40:37.038100',
      notes: '',
      audio: null,
      words: ['\u65b0\u5e74'],
      tags: [],
      hints: [
        {
          id: 9440860,
          locale: 'en',
          text: 'New Year',
          term: '\u65b0\u5e74',
          popularity: 183,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u012bnni\u00e1n'],
        hant: ['\u65b0\u5e74']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65b0\u5e74']
    },
    {
      pk: 778653033,
      url: 'https://www.lingq.com/api/v3/zh/cards/778653033/',
      term: '\u65b9\u4fbf',
      fragment: '\u4e0a\u5348 \u4e0d \u592a \u65b9\u4fbf\u3002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-07T03:38:15.162001',
      status_changed_date: '2026-02-06T03:38:15.162001',
      notes: '',
      audio: null,
      words: ['\u65b9\u4fbf'],
      tags: [],
      hints: [
        {
          id: 12098943,
          locale: 'en',
          text: 'convenient',
          term: '\u65b9\u4fbf',
          popularity: 358,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['f\u0101ngbi\u00e0n'],
        hant: ['\u65b9\u4fbf']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65b9\u4fbf']
    },
    {
      pk: 777212935,
      url: 'https://www.lingq.com/api/v3/zh/cards/777212935/',
      term: '\u65b9\u5f0f',
      fragment: '',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:27:06.974012',
      status_changed_date: '2026-02-07T04:27:06.974012',
      notes: '',
      audio: null,
      words: ['\u65b9\u5f0f'],
      tags: [],
      hints: [
        {
          id: 12321900,
          locale: 'en',
          text: 'way',
          term: '\u65b9\u5f0f',
          popularity: 1053,
          is_google_translate: false,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['f\u0101ngsh\u00ec'],
        hant: ['\u65b9\u5f0f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65b9\u5f0f']
    },
    {
      pk: 790055254,
      url: 'https://www.lingq.com/api/v3/zh/cards/790055254/',
      term: '\u65c1\u8fb9',
      fragment: '\u5728 \u684c\u5b50 \u65c1\u8fb9 \u7684 \u90a3\u4e2a \u6905\u5b50 \u4e0a',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-24T06:55:52',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u65c1\u8fb9'],
      tags: [],
      hints: [
        {
          id: 52653142,
          locale: 'en',
          text: 'beside',
          term: '\u65c1\u8fb9',
          popularity: 229,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['p\u00e1ngbi\u0101n'],
        hant: ['\u65c1\u908a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65c1\u8fb9']
    },
    {
      pk: 778980878,
      url: 'https://www.lingq.com/api/v3/zh/cards/778980878/',
      term: '\u65e9',
      fragment: '\u597d\u3001 \u5c0f\u3001 \u65e9',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:40:40.015900',
      status_changed_date: '2026-02-06T03:40:40.015900',
      notes: '',
      audio: null,
      words: ['\u65e9'],
      tags: [],
      hints: [
        {
          id: 8370485,
          locale: 'en',
          text: 'early',
          term: '\u65e9',
          popularity: 137415,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u01ceo'],
        hant: ['\u65e9']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65e9']
    },
    {
      pk: 775450605,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450605/',
      term: '\u65e9\u4e0a\u597d',
      fragment: '\u65e9\u4e0a\u597d\uff01',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:42:45.828034',
      status_changed_date: '2026-01-27T04:42:45.828034',
      notes: '',
      audio: null,
      words: ['\u65e9\u4e0a\u597d'],
      tags: [],
      hints: [
        {
          id: 31875404,
          locale: 'en',
          text: 'Good morning!',
          term: '\u65e9\u4e0a\u597d',
          popularity: 2577,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u01ceoshangh\u01ceo'],
        hant: ['\u65e9\u4e0a\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65e9\u4e0a\u597d']
    },
    {
      pk: 775817617,
      url: 'https://www.lingq.com/api/v3/zh/cards/775817617/',
      term: '\u65e9\u6668',
      fragment: '\u8fc8\u514b \u6bcf\u5929 \u65e9\u6668 \u516d\u70b9 \u8d77\u5e8a',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:25:43.151214',
      status_changed_date: '2026-02-07T04:25:43.151214',
      notes: '',
      audio: null,
      words: ['\u65e9\u6668'],
      tags: [],
      hints: [
        {
          id: 390684,
          locale: 'en',
          text: 'morning',
          term: '\u65e9\u6668',
          popularity: 12150,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u01ceoch\u00e9n'],
        hant: ['\u65e9\u6668']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65e9\u6668']
    },
    {
      pk: 783077456,
      url: 'https://www.lingq.com/api/v3/zh/cards/783077456/',
      term: '\u65e9\u9910',
      fragment:
        '\u4ed6 \u5148 \u505a \u65e9\u9910 \u7136\u540e \u559d \u4e00\u676f \u5496\u5561\u3002',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:28:13.129730',
      status_changed_date: '2026-02-07T04:28:13.129730',
      notes: '',
      audio: null,
      words: ['\u65e9\u9910'],
      tags: [],
      hints: [
        {
          id: 13527362,
          locale: 'en',
          text: 'breakfast',
          term: '\u65e9\u9910',
          popularity: 546229,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u01ceoc\u0101n'],
        hant: ['\u65e9\u9910']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65e9\u9910']
    },
    {
      pk: 777213244,
      url: 'https://www.lingq.com/api/v3/zh/cards/777213244/',
      term: '\u65e9\u996d',
      fragment: '\u6211 \u5148 \u505a \u65e9\u996d \u5e76 \u559d \u4e00\u676f \u5496\u5561',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:28:17.312739',
      status_changed_date: '2026-02-07T04:28:17.312739',
      notes: '',
      audio: null,
      words: ['\u65e9\u996d'],
      tags: [],
      hints: [
        {
          id: 13559940,
          locale: 'en',
          text: 'breakfast',
          term: '\u65e9\u996d',
          popularity: 3391,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u01ceof\u00e0n'],
        hant: ['\u65e9\u98ef']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65e9\u996d']
    },
    {
      pk: 780326438,
      url: 'https://www.lingq.com/api/v3/zh/cards/780326438/',
      term: '\u65f6\u5019',
      fragment: '\u4ec0\u4e48 \u65f6\u5019 \u56de\u6765\uff1f',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:25:28.894112',
      status_changed_date: '2026-02-07T04:25:28.894112',
      notes: '',
      audio: null,
      words: ['\u65f6\u5019'],
      tags: [],
      hints: [
        {
          id: 390699,
          locale: 'en',
          text: 'time',
          term: '\u65f6\u5019',
          popularity: 297701,
          is_google_translate: false,
          flagged: false
        },
        {
          id: 16574165,
          locale: 'en',
          text: 'moment, a time',
          term: '\u65f6\u5019',
          popularity: 19,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00edhou'],
        hant: ['\u6642\u5019']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65f6\u5019']
    },
    {
      pk: 782018497,
      url: 'https://www.lingq.com/api/v3/zh/cards/782018497/',
      term: '\u65f6\u95f4',
      fragment: '\u8bf7\u95ee \u60a8 \u6709 \u65f6\u95f4 \u5417\uff1f',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-01T03:53:44.970418',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u65f6\u95f4'],
      tags: [],
      hints: [
        {
          id: 3950128,
          locale: 'en',
          text: 'Time',
          term: '\u65f6\u95f4',
          popularity: 449,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        hant: ['\u6642\u9593']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u65f6\u95f4']
    },
    {
      pk: 777564051,
      url: 'https://www.lingq.com/api/v3/zh/cards/777564051/',
      term: '\u660e\u5929',
      fragment: '\u660e\u5929 \u662f \u661f\u671f \u51e0\uff1f',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-19T05:00:18.862680',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u660e\u5929'],
      tags: [],
      hints: [
        {
          id: 5698025,
          locale: 'en',
          text: 'tomorrow',
          term: '\u660e\u5929',
          popularity: 1243,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u00edngti\u0101n'],
        hant: ['\u660e\u5929']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u660e\u5929']
    },
    {
      pk: 776512953,
      url: 'https://www.lingq.com/api/v3/zh/cards/776512953/',
      term: '\u661f\u671f',
      fragment: '\u6211 \u4e0b \u661f\u671f \u4e0d \u6765',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-04T02:06:38.013614',
      status_changed_date: '2026-01-28T02:06:38.013614',
      notes: '',
      audio: null,
      words: ['\u661f\u671f'],
      tags: [],
      hints: [
        {
          id: 13166104,
          locale: 'en',
          text: 'week',
          term: '\u661f\u671f',
          popularity: 2521,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u012bngq\u012b'],
        hant: ['\u661f\u671f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u661f\u671f']
    },
    {
      pk: 777564079,
      url: 'https://www.lingq.com/api/v3/zh/cards/777564079/',
      term: '\u661f\u671f\u4e00',
      fragment: '\u660e\u5929 \u662f \u661f\u671f\u4e00\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-19T05:00:27.562292',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u661f\u671f\u4e00'],
      tags: [],
      hints: [
        {
          id: 13714897,
          locale: 'en',
          text: 'Monday',
          term: '\u661f\u671f\u4e00',
          popularity: 860,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u012bngq\u012by\u012b'],
        hant: ['\u661f\u671f\u4e00']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u661f\u671f\u4e00']
    },
    {
      pk: 779980515,
      url: 'https://www.lingq.com/api/v3/zh/cards/779980515/',
      term: '\u661f\u671f\u4e09',
      fragment: '\u661f\u671f\u4e09 \u600e\u4e48\u6837\uff1f',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-31T02:06:47.335081',
      status_changed_date: '2026-01-28T02:06:47.335081',
      notes: '',
      audio: null,
      words: ['\u661f\u671f\u4e09'],
      tags: [],
      hints: [
        {
          id: 5698019,
          locale: 'en',
          text: 'Wednesday',
          term: '\u661f\u671f\u4e09',
          popularity: 618,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u012bngq\u012bs\u0101n'],
        hant: ['\u661f\u671f\u4e09']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u661f\u671f\u4e09']
    },
    {
      pk: 779980488,
      url: 'https://www.lingq.com/api/v3/zh/cards/779980488/',
      term: '\u661f\u671f\u4e8c',
      fragment: '\u6211 \u661f\u671f\u4e8c \u6709\u7a7a\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-26T04:18:16.039239',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u661f\u671f\u4e8c'],
      tags: [],
      hints: [
        {
          id: 5698020,
          locale: 'en',
          text: 'Tuesday',
          term: '\u661f\u671f\u4e8c',
          popularity: 1138,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u012bngq\u012b\u00e8r'],
        hant: ['\u661f\u671f\u4e8c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u661f\u671f\u4e8c']
    },
    {
      pk: 775449969,
      url: 'https://www.lingq.com/api/v3/zh/cards/775449969/',
      term: '\u662f',
      fragment: '1 a-\u8fc8\u514b \u662f \u4e2a \u53a8\u5e08, \u7b2c\u4e00 \u90e8\u5206',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-27T02:50:28.229579',
      status_changed_date: '2026-01-12T02:50:28.229579',
      notes: '',
      audio: null,
      words: ['\u662f'],
      tags: [],
      hints: [
        {
          id: 205195210,
          locale: 'en',
          text: 'is',
          term: '\u662f',
          popularity: 4380,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00ec'],
        hant: ['\u662f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u662f']
    },
    {
      pk: 776513166,
      url: 'https://www.lingq.com/api/v3/zh/cards/776513166/',
      term: '\u662f\u5417',
      fragment: '\u662f\u5417',
      importance: 2,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-16T02:31:34.152602',
      status_changed_date: '2026-01-15T02:31:34.152602',
      notes: '',
      audio: null,
      words: ['\u662f\u5417'],
      tags: [],
      hints: [
        {
          id: 1018966,
          locale: 'en',
          text: '... is that so?',
          term: '\u662f\u5417',
          popularity: 558,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00ec ma'],
        hant: ['\u662f\u55ce']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u662f\u5417']
    },
    {
      pk: 775819514,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819514/',
      term: '\u662f\u7684',
      fragment: '\u662f\u7684',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-04T02:06:34.395494',
      status_changed_date: '2026-01-28T02:06:34.395494',
      notes: '',
      audio: null,
      words: ['\u662f\u7684'],
      tags: [],
      hints: [
        {
          id: 73612768,
          locale: 'en',
          text: 'yes',
          term: '\u662f\u7684',
          popularity: 505,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00ecde'],
        hant: ['\u662f\u7684']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u662f\u7684']
    },
    {
      pk: 790056684,
      url: 'https://www.lingq.com/api/v3/zh/cards/790056684/',
      term: '\u663e\u5f97',
      fragment:
        '\u84dd \u5e3d\u5b50 \u642d\u914d \u8d77\u6765 \uff0c\u663e\u5f97 \u5f88 \u597d\u770b',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-24T07:02:00',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u663e\u5f97'],
      tags: [],
      hints: [
        {
          id: 8198671,
          locale: 'en',
          text: 'seem; appear to be',
          term: '\u663e\u5f97',
          popularity: 826,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01cende'],
        hant: ['\u986f\u5f97']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u663e\u5f97']
    },
    {
      pk: 777210874,
      url: 'https://www.lingq.com/api/v3/zh/cards/777210874/',
      term: '\u665a',
      fragment: '\u5f88 \u665a \u4e86',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-31T02:06:53.880651',
      status_changed_date: '2026-01-28T02:06:53.880651',
      notes: '',
      audio: null,
      words: ['\u665a'],
      tags: [],
      hints: [
        {
          id: 5943090,
          locale: 'en',
          text: 'night; evening; late',
          term: '\u665a',
          popularity: 591,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01cen'],
        hant: ['\u665a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u665a']
    },
    {
      pk: 785461305,
      url: 'https://www.lingq.com/api/v3/zh/cards/785461305/',
      term: '\u665a\u4e0a',
      fragment: '\u665a\u4e0a \u597d\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T03:59:45.548064',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u665a\u4e0a'],
      tags: [],
      hints: [
        {
          id: 13697570,
          locale: 'en',
          text: 'evening',
          term: '\u665a\u4e0a',
          popularity: 725,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01censhang'],
        hant: ['\u665a\u4e0a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u665a\u4e0a']
    },
    {
      pk: 794244998,
      url: 'https://www.lingq.com/api/v3/zh/cards/794244998/',
      term: '\u665a\u4e0a\u597d',
      fragment: '\u665a\u4e0a\u597d\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:46:25.885183',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u665a\u4e0a\u597d'],
      tags: [],
      hints: [
        {
          id: 2927381,
          locale: 'en',
          text: 'good evening',
          term: '\u665a\u4e0a\u597d',
          popularity: 40,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01censh\u00e0ngh\u01ceo'],
        hant: ['\u665a\u4e0a\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u665a\u4e0a\u597d']
    },
    {
      pk: 792059099,
      url: 'https://www.lingq.com/api/v3/zh/cards/792059099/',
      term: '\u665a\u4e9b',
      fragment: '\u6211\u4eec \u53ef\u4ee5 \u665a\u4e9b \u8fc7\u53bb\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T05:11:20.170588',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u665a\u4e9b'],
      tags: [],
      hints: [
        {
          id: 217145166,
          locale: 'en',
          text: 'a bit later',
          term: '\u665a\u4e9b',
          popularity: 46,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01cen xi\u0113'],
        hant: ['\u665a\u4e9b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u665a\u4e9b']
    },
    {
      pk: 778648725,
      url: 'https://www.lingq.com/api/v3/zh/cards/778648725/',
      term: '\u665a\u5b89',
      fragment: '\u597d\uff0c \u665a\u5b89\u3002',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-31T02:06:51.380872',
      status_changed_date: '2026-01-28T02:06:51.380872',
      notes: '',
      audio: null,
      words: ['\u665a\u5b89'],
      tags: [],
      hints: [
        {
          id: 1175447,
          locale: 'en',
          text: 'good night',
          term: '\u665a\u5b89',
          popularity: 5242,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01cen\u0101n'],
        hant: ['\u665a\u5b89']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u665a\u5b89']
    },
    {
      pk: 794554907,
      url: 'https://www.lingq.com/api/v3/zh/cards/794554907/',
      term: '\u665a\u996d',
      fragment:
        '\u54e6 \uff0c\u5dee\u4e0d\u591a \u5230 \u5403 \u665a\u996d \u7684 \u65f6\u95f4 \u4e86',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T02:10:01.150000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u665a\u996d'],
      tags: [],
      hints: [
        {
          id: 19483367,
          locale: 'en',
          text: 'dinner',
          term: '\u665a\u996d',
          popularity: 427,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01cenf\u00e0n'],
        hant: ['\u665a\u98ef']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u665a\u996d']
    },
    {
      pk: 781020339,
      url: 'https://www.lingq.com/api/v3/zh/cards/781020339/',
      term: '\u6700\u597d',
      fragment:
        '\u2026\u662f \u6211 \u7684 \u670b\u53cb\uff0c \u6700\u597d \u7684 \u670b\u53cb\uff01',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-29T01:35:52.955298',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6700\u597d'],
      tags: [],
      hints: [
        {
          id: 18350253,
          locale: 'en',
          text: 'best',
          term: '\u6700\u597d',
          popularity: 342,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zu\u00ech\u01ceo'],
        hant: ['\u6700\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6700\u597d']
    },
    {
      pk: 779328118,
      url: 'https://www.lingq.com/api/v3/zh/cards/779328118/',
      term: '\u6700\u8fd1',
      fragment: '\u6700\u8fd1 \u600e\u4e48\u6837\uff1f',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-29T02:06:38.018977',
      status_changed_date: '2026-01-28T02:06:38.018977',
      notes: '',
      audio: null,
      words: ['\u6700\u8fd1'],
      tags: [],
      hints: [
        {
          id: 7480182,
          locale: 'en',
          text: 'recent',
          term: '\u6700\u8fd1',
          popularity: 4327,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zu\u00ecj\u00ecn'],
        hant: ['\u6700\u8fd1']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6700\u8fd1']
    },
    {
      pk: 775451462,
      url: 'https://www.lingq.com/api/v3/zh/cards/775451462/',
      term: '\u6709',
      fragment: '\u4ed6 \u6709 \u54e5\u54e5 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-27T02:42:08.947445',
      status_changed_date: '2026-01-12T02:42:08.947445',
      notes: '',
      audio: null,
      words: ['\u6709'],
      tags: [],
      hints: [
        {
          id: 43054846,
          locale: 'en',
          text: 'have',
          term: '\u6709',
          popularity: 773,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u01d2u'],
        hant: ['\u6709']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6709']
    },
    {
      pk: 792058702,
      url: 'https://www.lingq.com/api/v3/zh/cards/792058702/',
      term: '\u6709\u540d',
      fragment: '\u2026\u662f \u4e00 \u5bb6 \u5f88 \u6709\u540d \u7684 \u996d\u9986\u3002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T05:08:54.730308',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6709\u540d'],
      tags: [],
      hints: [
        {
          id: 19446863,
          locale: 'en',
          text: 'famous',
          term: '\u6709\u540d',
          popularity: 294,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u01d2um\u00edng'],
        hant: ['\u6709\u540d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6709\u540d']
    },
    {
      pk: 779980436,
      url: 'https://www.lingq.com/api/v3/zh/cards/779980436/',
      term: '\u6709\u7a7a',
      fragment: '\u4f60 \u661f\u671f\u4e00 \u6709\u7a7a \u5417\uff1f',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-26T04:17:55.585476',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6709\u7a7a'],
      tags: [],
      hints: [
        {
          id: 20490759,
          locale: 'en',
          text: 'have free time',
          term: '\u6709\u7a7a',
          popularity: 288,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u01d2uk\u00f2ng'],
        hant: ['\u6709\u7a7a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6709\u7a7a']
    },
    {
      pk: 781020316,
      url: 'https://www.lingq.com/api/v3/zh/cards/781020316/',
      term: '\u670b\u53cb',
      fragment:
        '\u4f60 \u662f \u6211 \u7684 \u670b\u53cb\uff0c \u6700\u597d \u7684 \u670b\u53cb\uff01',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-29T01:35:48.275748',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u670b\u53cb'],
      tags: [],
      hints: [
        {
          id: 391512,
          locale: 'en',
          text: 'friend',
          term: '\u670b\u53cb',
          popularity: 528,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['p\u00e9ngyou'],
        hant: ['\u670b\u53cb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u670b\u53cb']
    },
    {
      pk: 776514651,
      url: 'https://www.lingq.com/api/v3/zh/cards/776514651/',
      term: '\u670d\u52a1\u5458',
      fragment: '\u670d\u52a1\u5458 \uff0c\u6709 \u53c9\u5b50 \u5417',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-31T02:07:02.910087',
      status_changed_date: '2026-01-28T02:07:02.910087',
      notes: '',
      audio: null,
      words: ['\u670d\u52a1\u5458'],
      tags: [],
      hints: [
        {
          id: 11774478,
          locale: 'en',
          text: 'waiter',
          term: '\u670d\u52a1\u5458',
          popularity: 381,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['f\u00faw\u00f9yu\u00e1n'],
        hant: ['\u670d\u52d9\u54e1']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u670d\u52a1\u5458']
    },
    {
      pk: 786156717,
      url: 'https://www.lingq.com/api/v3/zh/cards/786156717/',
      term: '\u672c\u6765',
      fragment: '\u6211 \u672c\u6765 \u4e5f \u8ba4\u4e3a \u8fd9 \u662f\u2026',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T04:32:45.598419',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u672c\u6765'],
      tags: [],
      hints: [
        {
          id: 6725988,
          locale: 'en',
          text: 'originally, at first, of course',
          term: '\u672c\u6765',
          popularity: 494,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u011bnl\u00e1i'],
        hant: ['\u672c\u4f86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u672c\u6765']
    },
    {
      pk: 782328315,
      url: 'https://www.lingq.com/api/v3/zh/cards/782328315/',
      term: '\u673a\u573a',
      fragment: '\u53bb \u673a\u573a\u3002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-02T03:22:43.830270',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u673a\u573a'],
      tags: [],
      hints: [
        {
          id: 160055922,
          locale: 'en',
          text: 'the airport',
          term: '\u673a\u573a',
          popularity: 80,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u012bch\u01ceng'],
        hant: ['\u6a5f\u5834']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u673a\u573a']
    },
    {
      pk: 780327783,
      url: 'https://www.lingq.com/api/v3/zh/cards/780327783/',
      term: '\u674e',
      fragment: '\u5582\uff0c \u674e \u5148\u751f \u5728 \u5417\uff1f',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-27T02:58:56.343103',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u674e'],
      tags: [],
      hints: [
        {
          id: 12753928,
          locale: 'en',
          text: 'Li (name)',
          term: '\u674e',
          popularity: 2,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['l\u01d0'],
        hant: ['\u674e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u674e']
    },
    {
      pk: 785462299,
      url: 'https://www.lingq.com/api/v3/zh/cards/785462299/',
      term: '\u674e\u6167',
      fragment: '\u4f60 \u662f \u674e\u6167 \u5417\uff1f',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:04:48.715981',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u674e\u6167'],
      tags: [],
      hints: [
        {
          id: 391760,
          locale: 'en',
          text: 'Li Hui',
          term: '\u674e\u6167',
          popularity: 192,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['l\u01d0 hu\u00ec'],
        hant: ['\u674e\u6167']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u674e\u6167']
    },
    {
      pk: 786156622,
      url: 'https://www.lingq.com/api/v3/zh/cards/786156622/',
      term: '\u675c\u4e3d',
      fragment: '\u5979 \u53eb \u675c\u4e3d\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T04:32:20.970873',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u675c\u4e3d'],
      tags: [],
      hints: [
        {
          id: 391791,
          locale: 'en',
          text: 'Du Li',
          term: '\u675c\u4e3d',
          popularity: 103,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00f9 l\u00ed'],
        hant: ['\u675c\u9e97']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u675c\u4e3d']
    },
    {
      pk: 775818053,
      url: 'https://www.lingq.com/api/v3/zh/cards/775818053/',
      term: '\u6765',
      fragment: '\u60a8 \u7b2c\u4e00\u6b21 \u6765 \u4e2d\u56fd \u5417',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-28T03:36:01.169951',
      status_changed_date: '2026-01-13T03:36:01.169951',
      notes: '',
      audio: null,
      words: ['\u6765'],
      tags: [],
      hints: [
        {
          id: 16340796,
          locale: 'en',
          text: 'come',
          term: '\u6765',
          popularity: 487,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        hant: ['\u4f86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6765']
    },
    {
      pk: 783752646,
      url: 'https://www.lingq.com/api/v3/zh/cards/783752646/',
      term: '\u6765\u81ea',
      fragment: '\u8fd9 \u4e9b \u987e\u5ba2 \u6765\u81ea \u5f88 \u591a \u56fd\u5bb6\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-06T04:36:10.369767',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6765\u81ea'],
      tags: [],
      hints: [
        {
          id: 1145393,
          locale: 'en',
          text: 'come from',
          term: '\u6765\u81ea',
          popularity: 2109,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['l\u00e1iz\u00ec'],
        hant: ['\u4f86\u81ea']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6765\u81ea']
    },
    {
      pk: 795223841,
      url: 'https://www.lingq.com/api/v3/zh/cards/795223841/',
      term: '\u6765\u8fc7',
      fragment: '\u662f\u7684 \uff0c\u6211 \u4ee5\u524d \u6765\u8fc7',
      importance: 0,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:42:19.327000',
      status_changed_date: '2026-03-12T03:42:19.327000',
      notes: '',
      audio: null,
      words: ['\u6765\u8fc7'],
      tags: [],
      hints: [
        {
          id: 89479716,
          locale: 'en',
          text: 'have come',
          term: '\u6765\u8fc7',
          popularity: 30,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['l\u00e1i gu\u00f2'],
        hant: ['\u4f86\u904e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6765\u8fc7']
    },
    {
      pk: 785462118,
      url: 'https://www.lingq.com/api/v3/zh/cards/785462118/',
      term: '\u6768\u96ea',
      fragment: '\u6253\u6270 \u4e00\u4e0b\uff0c \u4f60 \u662f \u6768\u96ea \u5417\uff1f',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:03:47.640565',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6768\u96ea'],
      tags: [],
      hints: [
        {
          id: 391862,
          locale: 'en',
          text: 'Yang Xue',
          term: '\u6768\u96ea',
          popularity: 263,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u00e1ng xu\u011b'],
        hant: ['\u694a\u96ea']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6768\u96ea']
    },
    {
      pk: 781020435,
      url: 'https://www.lingq.com/api/v3/zh/cards/781020435/',
      term: '\u676f',
      fragment: '\u518d\u6765 \u4e00 \u676f\uff01',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-29T01:36:13.666243',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u676f'],
      tags: [],
      hints: [
        {
          id: 28921635,
          locale: 'en',
          text: 'cup',
          term: '\u676f',
          popularity: 1553,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u0113i'],
        hant: ['\u676f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u676f']
    },
    {
      pk: 776157251,
      url: 'https://www.lingq.com/api/v3/zh/cards/776157251/',
      term: '\u676f\u5b50',
      fragment: '\u8fd9 \u662f \u4f60 \u7684 \u676f\u5b50 \u5417\uff1f',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-20T04:24:48.342513',
      status_changed_date: '2026-01-17T04:24:48.342513',
      notes: '',
      audio: null,
      words: ['\u676f\u5b50'],
      tags: [],
      hints: [
        {
          id: 13507278,
          locale: 'en',
          text: 'cup',
          term: '\u676f\u5b50',
          popularity: 589,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u0113izi'],
        hant: ['\u676f\u5b50']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u676f\u5b50']
    },
    {
      pk: 785462017,
      url: 'https://www.lingq.com/api/v3/zh/cards/785462017/',
      term: '\u6797\u7ff0',
      fragment: '\u4f60\u597d\uff0c \u4f60 \u662f \u6797\u7ff0 \u5417\uff1f',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:03:13.464759',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6797\u7ff0'],
      tags: [],
      hints: [
        {
          id: 391921,
          locale: 'en',
          text: 'Lin Han',
          term: '\u6797\u7ff0',
          popularity: 294,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['l\u00edn h\u00e0n'],
        hant: ['\u6797\u7ff0']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6797\u7ff0']
    },
    {
      pk: 791709938,
      url: 'https://www.lingq.com/api/v3/zh/cards/791709938/',
      term: '\u680b',
      fragment: '\u2026\u706b\u8f66\u7ad9 \u5bf9\u9762 \u7684 \u90a3 \u680b \u697c \u5417\uff1f',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-02T04:05:35.171352',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u680b'],
      tags: [],
      hints: [
        {
          id: 16661524,
          locale: 'en',
          text: 'classifier for houses or buildings',
          term: '\u680b',
          popularity: 2358,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00f2ng'],
        hant: ['\u68df']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u680b']
    },
    {
      pk: 790055234,
      url: 'https://www.lingq.com/api/v3/zh/cards/790055234/',
      term: '\u684c\u5b50',
      fragment: '\u5728 \u684c\u5b50 \u65c1\u8fb9 \u7684 \u90a3\u4e2a \u6905\u5b50',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-24T06:55:47',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u684c\u5b50'],
      tags: [],
      hints: [
        {
          id: 5660848,
          locale: 'en',
          text: 'table',
          term: '\u684c\u5b50',
          popularity: 461,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zhu\u014dzi'],
        hant: ['\u684c\u5b50']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u684c\u5b50']
    },
    {
      pk: 792058587,
      url: 'https://www.lingq.com/api/v3/zh/cards/792058587/',
      term: '\u68d2',
      fragment: '\u2026\u662f \u4e00 \u5bb6 \u5f88 \u68d2 \u7684 \u996d\u9986\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T05:08:20.513098',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u68d2'],
      tags: [],
      hints: [
        {
          id: 226800303,
          locale: 'en',
          text: 'good, fine, excellent',
          term: '\u68d2',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00e0ng'],
        hant: ['\u68d2']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u68d2']
    },
    {
      pk: 790055342,
      url: 'https://www.lingq.com/api/v3/zh/cards/790055342/',
      term: '\u6905\u5b50',
      fragment: '\u684c\u5b50 \u65c1\u8fb9 \u7684 \u90a3\u4e2a \u6905\u5b50 \u4e0a',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-24T06:56:12',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6905\u5b50'],
      tags: [],
      hints: [
        {
          id: 13549123,
          locale: 'en',
          text: 'chair',
          term: '\u6905\u5b50',
          popularity: 2633,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u01d0zi'],
        hant: ['\u6905\u5b50']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6905\u5b50']
    },
    {
      pk: 777210508,
      url: 'https://www.lingq.com/api/v3/zh/cards/777210508/',
      term: '\u697c',
      fragment: '\u53bb \u51e0 \u697c',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-29T02:06:40.675341',
      status_changed_date: '2026-01-28T02:06:40.675341',
      notes: '',
      audio: null,
      words: ['\u697c'],
      tags: [],
      hints: [
        {
          id: 13554686,
          locale: 'en',
          text: 'floor',
          term: '\u697c',
          popularity: 2775,
          is_google_translate: true,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['l\u00f3u'],
        hant: ['\u6a13']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u697c']
    },
    {
      pk: 777563599,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563599/',
      term: '\u6b21',
      fragment: '\u518d \u8bf4 \u4e00 \u6b21\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-01-19T04:57:08.913203',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u6b21'],
      tags: [],
      hints: [
        {
          id: 131057264,
          locale: 'en',
          text: 'time',
          term: '\u6b21',
          popularity: 347,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['c\u00ec'],
        hant: ['\u6b21']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u6b21']
    }
  ]
}
