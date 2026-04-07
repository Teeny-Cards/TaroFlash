export function getCards() {
  return blah.results.map((card) => {
    const front_text = card.term
    const back_text = card.hints[0]?.text

    return `${front_text}::${back_text}`
  })
}

const blah = {
  count: 633,
  next: 'https://www.lingq.com/api/v3/zh/cards/?page=2&page_size=200&search_criteria=startsWith&sort=alpha&status=0&status=1&status=2&status=3&status=4',
  previous: null,
  results: [
    {
      pk: 776161052,
      url: 'https://www.lingq.com/api/v3/zh/cards/776161052/',
      term: '\u4e00\u4e0b',
      fragment: '\u80fd \u5e2e \u6211 \u4e00\u4e0b \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:21:28.995788',
      status_changed_date: '2026-03-03T05:21:28.995788',
      notes: '',
      audio: null,
      words: ['\u4e00\u4e0b'],
      tags: [],
      hints: [
        {
          id: 13515058,
          locale: 'en',
          text: 'a bit',
          term: '\u4e00\u4e0b',
          popularity: 858,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bxi\u00e0'],
        hant: ['\u4e00\u4e0b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u4e0b']
    },
    {
      pk: 775453638,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453638/',
      term: '\u4e00\u4e2a',
      fragment: '\u5979 \u6709 \u4e00\u4e2a \u59b9\u59b9\u3002',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:21:05.136154',
      status_changed_date: '2026-03-03T05:21:05.136154',
      notes: '',
      audio: null,
      words: ['\u4e00\u4e2a'],
      tags: [],
      hints: [
        {
          id: 17889302,
          locale: 'en',
          text: 'one',
          term: '\u4e00\u4e2a',
          popularity: 496,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b g\u00e8'],
        hant: ['\u4e00\u500b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u4e2a']
    },
    {
      pk: 784784542,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784542/',
      term: '\u4e00\u4e9b',
      fragment:
        '\u2026\u51ac\u5929 \u8fbe\u65af\u6c40 \u53ef\u4ee5 \u6709 \u4e00\u4e9b \u7a7a\u95f2 \u65f6\u95f4 \u4e86 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-06-01T05:19:51.309932',
      status_changed_date: '2026-03-03T05:19:51.309932',
      notes: '',
      audio: null,
      words: ['\u4e00\u4e9b'],
      tags: [],
      hints: [
        {
          id: 6315126,
          locale: 'en',
          text: 'some',
          term: '\u4e00\u4e9b',
          popularity: 353815,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bxi\u0113'],
        hant: ['\u4e00\u4e9b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u4e9b']
    },
    {
      pk: 790056350,
      url: 'https://www.lingq.com/api/v3/zh/cards/790056350/',
      term: '\u4e00\u4ef6',
      fragment: '\u6211 \u6709 \u4e00\u4ef6 \u7eff\u8272 \u7684 \u4e0a\u8863',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-06T05:21:21.446274',
      status_changed_date: '2026-03-03T05:21:21.446274',
      notes: '',
      audio: null,
      words: ['\u4e00\u4ef6'],
      tags: [],
      hints: [
        {
          id: 18710771,
          locale: 'en',
          text: 'one (article of clothing)',
          term: '\u4e00\u4ef6',
          popularity: 228,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b ji\u00e0n'],
        hant: ['\u4e00\u4ef6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u4ef6']
    },
    {
      pk: 795224223,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224223/',
      term: '\u4e00\u4efd',
      fragment: '\u6211\u4eec \u627e \u670d\u52a1\u5458 \u8981 \u4e00\u4efd \u83dc\u5355 \u5427',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:45:28.381000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4e00\u4efd'],
      tags: [],
      hints: [
        {
          id: 18277312,
          locale: 'en',
          text: 'measure word for gifts, newspaper, magazine, papers, reports, contracts etc',
          term: '\u4e00\u4efd',
          popularity: 647,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b f\u00e8n'],
        hant: ['\u4e00\u4efd']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u4efd']
    },
    {
      pk: 792383376,
      url: 'https://www.lingq.com/api/v3/zh/cards/792383376/',
      term: '\u4e00\u4f1a\u89c1',
      fragment: '\u597d\u7684\u3002 \u62dc\u62dc\uff0c \u4e00\u4f1a\u89c1\u3002',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-06T05:19:24.196221',
      status_changed_date: '2026-03-03T05:19:24.196221',
      notes: '',
      audio: null,
      words: ['\u4e00\u4f1a\u89c1'],
      tags: [],
      hints: [
        {
          id: 217145633,
          locale: 'en',
          text: 'see you in a while',
          term: '\u4e00\u4f1a\u89c1',
          popularity: 30,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b hu\u00ec xi\u00e0n'],
        hant: ['\u4e00\u6703\u898b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u4f1a\u89c1']
    },
    {
      pk: 795223994,
      url: 'https://www.lingq.com/api/v3/zh/cards/795223994/',
      term: '\u4e00\u5171',
      fragment: '\u4f60 \u4ee5\u524d \u4e00\u5171 \u6765\u8fc7 \u51e0\u6b21',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:43:34.051000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4e00\u5171'],
      tags: [],
      hints: [
        {
          id: 5942010,
          locale: 'en',
          text: 'altogether',
          term: '\u4e00\u5171',
          popularity: 156,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bg\u00f2ng'],
        hant: ['\u4e00\u5171']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u5171']
    },
    {
      pk: 794246222,
      url: 'https://www.lingq.com/api/v3/zh/cards/794246222/',
      term: '\u4e00\u573a',
      fragment:
        '\u7535\u89c6 \u91cc \u6b63\u5728 \u64ad\u653e \u4e00\u573a \u8db3\u7403 \u6bd4\u8d5b',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:52:44.845000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4e00\u573a'],
      tags: [],
      hints: [
        {
          id: 28215117,
          locale: 'en',
          text: 'measure word for events; ground, place, courtyard',
          term: '\u4e00\u573a',
          popularity: 1664,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b ch\u01ceng'],
        hant: ['\u4e00\u5834']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u573a']
    },
    {
      pk: 779643746,
      url: 'https://www.lingq.com/api/v3/zh/cards/779643746/',
      term: '\u4e00\u5757\u94b1',
      fragment: '\u4e00\u5757\u94b1\u3002',
      importance: 0,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:20:40.721014',
      status_changed_date: '2026-03-03T05:20:40.721014',
      notes: '',
      audio: null,
      words: ['\u4e00\u5757\u94b1'],
      tags: [],
      hints: [
        {
          id: 160441152,
          locale: 'en',
          text: 'one yuan',
          term: '\u4e00\u5757\u94b1',
          popularity: 99,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b ku\u00e0i qi\u00e1n'],
        hant: ['\u4e00\u584a\u9322']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u5757\u94b1']
    },
    {
      pk: 783754630,
      url: 'https://www.lingq.com/api/v3/zh/cards/783754630/',
      term: '\u4e00\u5bb6',
      fragment: '\u8fc8\u514b \u5728 \u4e00\u5bb6 \u9910\u5385 \u505a \u53a8\u5e08\u3002',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-06-01T05:21:28.992050',
      status_changed_date: '2026-03-03T05:21:28.992050',
      notes: '',
      audio: null,
      words: ['\u4e00\u5bb6'],
      tags: [],
      hints: [
        {
          id: 23831392,
          locale: 'en',
          text: 'one + measure word for families or businesses;',
          term: '\u4e00\u5bb6',
          popularity: 528,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bji\u0101'],
        hant: ['\u4e00\u5bb6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u5bb6']
    },
    {
      pk: 777213879,
      url: 'https://www.lingq.com/api/v3/zh/cards/777213879/',
      term: '\u4e00\u676f',
      fragment: '\u505a \u65e9\u996d \u5e76 \u559d \u4e00\u676f \u5496\u5561',
      importance: 1,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:19:51.316486',
      status_changed_date: '2026-03-03T05:19:51.316486',
      notes: '',
      audio: null,
      words: ['\u4e00\u676f'],
      tags: [],
      hints: [
        {
          id: 164719207,
          locale: 'en',
          text: 'one cup',
          term: '\u4e00\u676f',
          popularity: 2249,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b b\u0113i'],
        hant: ['\u4e00\u676f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u676f']
    },
    {
      pk: 794247039,
      url: 'https://www.lingq.com/api/v3/zh/cards/794247039/',
      term: '\u4e00\u6b21',
      fragment: '\u957f \u65f6\u95f4 \u53bb \u6ed1 \u4e00\u6b21 \u96ea',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:56:38.604000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4e00\u6b21'],
      tags: [],
      hints: [
        {
          id: 376115,
          locale: 'en',
          text: 'once',
          term: '\u4e00\u6b21',
          popularity: 2264,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bc\u00ec'],
        hant: ['\u4e00\u6b21']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u6b21']
    },
    {
      pk: 784431158,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431158/',
      term: '\u4e00\u6bb5',
      fragment:
        '\u2026\u51ac\u5929 \u4ed6 \u53ef\u4ee5 \u4f11\u606f \u4e00\u6bb5 \u65f6\u95f4 \u4e86\u3002',
      importance: 2,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:33:17.128182',
      status_changed_date: '2026-03-06T05:33:17.128182',
      notes: '',
      audio: null,
      words: ['\u4e00\u6bb5'],
      tags: [],
      hints: [
        {
          id: 224551176,
          locale: 'en',
          text: 'a period / segment',
          term: '\u4e00\u6bb5',
          popularity: 2,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b du\u00e0n'],
        hant: ['\u4e00\u6bb5']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u6bb5']
    },
    {
      pk: 776157758,
      url: 'https://www.lingq.com/api/v3/zh/cards/776157758/',
      term: '\u4e00\u70b9',
      fragment: '\u2026\u53ef\u4ee5 \u8bf4 \u5f97 \u6162 \u4e00\u70b9 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:19:43.657662',
      status_changed_date: '2026-03-03T05:19:43.657662',
      notes: '',
      audio: null,
      words: ['\u4e00\u70b9'],
      tags: [],
      hints: [
        {
          id: 13628808,
          locale: 'en',
          text: 'a little',
          term: '\u4e00\u70b9',
          popularity: 2546,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bdi\u01cen'],
        hant: ['\u4e00\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u70b9']
    },
    {
      pk: 775823827,
      url: 'https://www.lingq.com/api/v3/zh/cards/775823827/',
      term: '\u4e00\u767e',
      fragment: '\u4e00\u767e \u5757 \u94b1',
      importance: 2,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:19:18.199973',
      status_changed_date: '2026-03-03T05:19:18.199973',
      notes: '',
      audio: null,
      words: ['\u4e00\u767e'],
      tags: [],
      hints: [
        {
          id: 98714538,
          locale: 'en',
          text: 'one hundred',
          term: '\u4e00\u767e',
          popularity: 227,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b b\u01cei'],
        hant: ['\u4e00\u767e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u767e']
    },
    {
      pk: 775819396,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819396/',
      term: '\u4e00\u767e\u4e09\u5341\u4e94',
      fragment: '\u5730\u5740 \u662f \u5357\u4eac \u8def \u4e00\u767e\u4e09\u5341\u4e94 \u53f7',
      importance: 0,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:19:28.550673',
      status_changed_date: '2026-03-03T05:19:28.550673',
      notes: '',
      audio: null,
      words: ['\u4e00\u767e\u4e09\u5341\u4e94'],
      tags: [],
      hints: [
        {
          id: 188940954,
          locale: 'en',
          text: 'one hundred thirty-five',
          term: '\u4e00\u767e\u4e09\u5341\u4e94',
          popularity: 181,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012b b\u01cei s\u0101n sh\u00ed w\u01d4'],
        hant: ['\u4e00\u767e\u4e09\u5341\u4e94']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u767e\u4e09\u5341\u4e94']
    },
    {
      pk: 780704962,
      url: 'https://www.lingq.com/api/v3/zh/cards/780704962/',
      term: '\u4e00\u76f4',
      fragment: '\u4e00\u76f4 \u8d70\uff0c \u53f3 \u8f6c\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-19T04:09:14.925521',
      status_changed_date: '2026-03-04T04:09:14.925521',
      notes: '',
      audio: null,
      words: ['\u4e00\u76f4'],
      tags: [],
      hints: [
        {
          id: 19065781,
          locale: 'en',
          text: 'straight',
          term: '\u4e00\u76f4',
          popularity: 136,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bzh\u00ed'],
        hant: ['\u4e00\u76f4']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u76f4']
    },
    {
      pk: 794246650,
      url: 'https://www.lingq.com/api/v3/zh/cards/794246650/',
      term: '\u4e00\u79cd',
      fragment: '\u4f60 \u559c\u6b22 \u54ea \u4e00\u79cd \u8fd0\u52a8',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:54:55.360000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4e00\u79cd'],
      tags: [],
      hints: [
        {
          id: 20990487,
          locale: 'en',
          text: 'one kind of / one type of',
          term: '\u4e00\u79cd',
          popularity: 122,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bzh\u01d2ng'],
        hant: ['\u4e00\u7a2e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u79cd']
    },
    {
      pk: 794554610,
      url: 'https://www.lingq.com/api/v3/zh/cards/794554610/',
      term: '\u4e00\u822c\u6765\u8bf4',
      fragment: '\u4e00\u822c\u6765\u8bf4 \uff0c\u6211 \u5f00\u8f66 \u53bb \u9644\u8fd1',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T02:08:34.657000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4e00\u822c\u6765\u8bf4'],
      tags: [],
      hints: [
        {
          id: 5548447,
          locale: 'en',
          text: 'Generally speaking',
          term: '\u4e00\u822c\u6765\u8bf4',
          popularity: 187,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bb\u0101nl\u00e1ishu\u014d'],
        hant: ['\u4e00\u822c\u4f86\u8aaa']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u822c\u6765\u8bf4']
    },
    {
      pk: 792059020,
      url: 'https://www.lingq.com/api/v3/zh/cards/792059020/',
      term: '\u4e00\u8d77',
      fragment: '\u4e3a\u4ec0\u4e48 \u4e0d \u548c \u6211 \u4e00\u8d77 \u53bb \u5462\uff1f',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-06T05:19:43.651818',
      status_changed_date: '2026-03-03T05:19:43.651818',
      notes: '',
      audio: null,
      words: ['\u4e00\u8d77'],
      tags: [],
      hints: [
        {
          id: 2788205,
          locale: 'en',
          text: 'together',
          term: '\u4e00\u8d77',
          popularity: 1033,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bq\u01d0'],
        hant: ['\u4e00\u8d77']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u8d77']
    },
    {
      pk: 785462591,
      url: 'https://www.lingq.com/api/v3/zh/cards/785462591/',
      term: '\u4e00\u904d',
      fragment:
        '\u5bf9\u4e0d\u8d77\uff0c \u8bf7 \u518d \u8bf4 \u4e00\u904d\uff0c \u6162 \u70b9\u3002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:41:35.508969',
      status_changed_date: '2026-03-06T05:41:35.508969',
      notes: '',
      audio: null,
      words: ['\u4e00\u904d'],
      tags: [],
      hints: [
        {
          id: 224864859,
          locale: 'en',
          text: 'one more time, one time',
          term: '\u4e00\u904d',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u012bbi\u00e0n'],
        hant: ['\u4e00\u904d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e00\u904d']
    },
    {
      pk: 780326277,
      url: 'https://www.lingq.com/api/v3/zh/cards/780326277/',
      term: '\u4e03\u6708',
      fragment: '\u4f60 \u4e03\u6708 \u53bb \u7f8e\u56fd \u5417\uff1f',
      importance: 1,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:19:41.499086',
      status_changed_date: '2026-03-03T05:19:41.499086',
      notes: '',
      audio: null,
      words: ['\u4e03\u6708'],
      tags: [],
      hints: [
        {
          id: 13309411,
          locale: 'en',
          text: 'July',
          term: '\u4e03\u6708',
          popularity: 138,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['q\u012byu\u00e8'],
        hant: ['\u4e03\u6708']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e03\u6708']
    },
    {
      pk: 784071140,
      url: 'https://www.lingq.com/api/v3/zh/cards/784071140/',
      term: '\u4e03\u70b9',
      fragment:
        '\u6211 \u6bcf\u5929 \u65e9\u4e0a \u4e03\u70b9 \u534a \u5f00\u59cb \u5de5\u4f5c\u3002',
      importance: 1,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-06-01T05:22:14.269265',
      status_changed_date: '2026-03-03T05:22:14.269265',
      notes: '',
      audio: null,
      words: ['\u4e03\u70b9'],
      tags: [],
      hints: [
        {
          id: 27725940,
          locale: 'en',
          text: "seven o'clock",
          term: '\u4e03\u70b9',
          popularity: 508,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['q\u012b di\u01cen'],
        hant: ['\u4e03\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e03\u70b9']
    },
    {
      pk: 784072602,
      url: 'https://www.lingq.com/api/v3/zh/cards/784072602/',
      term: '\u4e03\u70b9\u534a',
      fragment:
        '\u2026\u4e03\u70b9 \u5f00\u59cb \u4e0a\u73ed\uff0c \u4ed6 \u4e03\u70b9\u534a \u5f00\u59cb \u4e0a\u73ed\u3002',
      importance: 0,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-06-01T05:19:27.409411',
      status_changed_date: '2026-03-03T05:19:27.409411',
      notes: '',
      audio: null,
      words: ['\u4e03\u70b9\u534a'],
      tags: [],
      hints: [
        {
          id: 22339070,
          locale: 'en',
          text: 'seven thirty',
          term: '\u4e03\u70b9\u534a',
          popularity: 643,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['q\u012b di\u01cen b\u00e0n'],
        hant: ['\u4e03\u9ede\u534a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e03\u70b9\u534a']
    },
    {
      pk: 777563474,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563474/',
      term: '\u4e09',
      fragment: '\u4e00 \u4e09 \u4e94\uff0c \u4e8c \u516b \u96f6\u2026',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:22:01.239623',
      status_changed_date: '2026-03-03T05:22:01.239623',
      notes: '',
      audio: null,
      words: ['\u4e09'],
      tags: [],
      hints: [
        {
          id: 6880105,
          locale: 'en',
          text: 'three',
          term: '\u4e09',
          popularity: 957,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['s\u0101n'],
        hant: ['\u4e09']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e09']
    },
    {
      pk: 780705764,
      url: 'https://www.lingq.com/api/v3/zh/cards/780705764/',
      term: '\u4e09\u70b9',
      fragment: '\u4e09\u70b9\u3002',
      importance: 0,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:21:09.519111',
      status_changed_date: '2026-03-03T05:21:09.519111',
      notes: '',
      audio: null,
      words: ['\u4e09\u70b9'],
      tags: [],
      hints: [
        {
          id: 92264043,
          locale: 'en',
          text: "three o'clock",
          term: '\u4e09\u70b9',
          popularity: 131,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['s\u0101n di\u01cen'],
        hant: ['\u4e09\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e09\u70b9']
    },
    {
      pk: 790055355,
      url: 'https://www.lingq.com/api/v3/zh/cards/790055355/',
      term: '\u4e0a',
      fragment: '\u65c1\u8fb9 \u7684 \u90a3\u4e2a \u6905\u5b50 \u4e0a',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T05:22:07.869072',
      status_changed_date: '2026-03-03T05:22:07.869072',
      notes: '',
      audio: null,
      words: ['\u4e0a'],
      tags: [],
      hints: [
        {
          id: 17493142,
          locale: 'en',
          text: 'on, up, above',
          term: '\u4e0a',
          popularity: 164,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e0ng'],
        hant: ['\u4e0a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0a']
    },
    {
      pk: 778652957,
      url: 'https://www.lingq.com/api/v3/zh/cards/778652957/',
      term: '\u4e0a\u5348',
      fragment: '\u6211 \u660e\u5929 \u4e0a\u5348 \u6765\u3002',
      importance: 2,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:22:07.868283',
      status_changed_date: '2026-03-03T05:22:07.868283',
      notes: '',
      audio: null,
      words: ['\u4e0a\u5348'],
      tags: [],
      hints: [
        {
          id: 2788368,
          locale: 'en',
          text: 'morning',
          term: '\u4e0a\u5348',
          popularity: 837,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e0ngw\u01d4'],
        hant: ['\u4e0a\u5348']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0a\u5348']
    },
    {
      pk: 783076299,
      url: 'https://www.lingq.com/api/v3/zh/cards/783076299/',
      term: '\u4e0a\u6d77',
      fragment: '\u4e0a\u6d77\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-06-01T05:22:04.964099',
      status_changed_date: '2026-03-03T05:22:04.964099',
      notes: '',
      audio: null,
      words: ['\u4e0a\u6d77'],
      tags: [],
      hints: [
        {
          id: 3444405,
          locale: 'en',
          text: 'Shanghai',
          term: '\u4e0a\u6d77',
          popularity: 1119,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e0ngh\u01cei'],
        hant: ['\u4e0a\u6d77']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0a\u6d77']
    },
    {
      pk: 777214234,
      url: 'https://www.lingq.com/api/v3/zh/cards/777214234/',
      term: '\u4e0a\u73ed',
      fragment: '\u63a5\u7740 \u5f00\u8f66 \u53bb \u4e0a\u73ed',
      importance: 2,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:20:55.381181',
      status_changed_date: '2026-03-03T05:20:55.381181',
      notes: '',
      audio: null,
      words: ['\u4e0a\u73ed'],
      tags: [],
      hints: [
        {
          id: 376465,
          locale: 'en',
          text: 'go to work',
          term: '\u4e0a\u73ed',
          popularity: 199857,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e0ngb\u0101n'],
        hant: ['\u4e0a\u73ed']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0a\u73ed']
    },
    {
      pk: 776511974,
      url: 'https://www.lingq.com/api/v3/zh/cards/776511974/',
      term: '\u4e0a\u7f51',
      fragment: '\u6211 \u5728 \u4e0a\u7f51',
      importance: 2,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-10T05:19:34.997714',
      status_changed_date: '2026-03-03T05:19:34.997714',
      notes: '',
      audio: null,
      words: ['\u4e0a\u7f51'],
      tags: [],
      hints: [
        {
          id: 173301743,
          locale: 'en',
          text: 'surfing the internet',
          term: '\u4e0a\u7f51',
          popularity: 46,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e0ngw\u01ceng'],
        hant: ['\u4e0a\u7db2']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0a\u7f51']
    },
    {
      pk: 786158206,
      url: 'https://www.lingq.com/api/v3/zh/cards/786158206/',
      term: '\u4e0a\u8863',
      fragment: '\u8bf7 \u628a \u6211 \u7684 \u4e0a\u8863 \u7ed9 \u6211\u3002',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-08T04:15:45.641718',
      status_changed_date: '2026-03-01T04:15:45.641718',
      notes: '',
      audio: null,
      words: ['\u4e0a\u8863'],
      tags: [],
      hints: [
        {
          id: 376481,
          locale: 'en',
          text: 'jacket, coat, upper outer garment',
          term: '\u4e0a\u8863',
          popularity: 544,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e0ngy\u012b'],
        hant: ['\u4e0a\u8863']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0a\u8863']
    },
    {
      pk: 776512921,
      url: 'https://www.lingq.com/api/v3/zh/cards/776512921/',
      term: '\u4e0b',
      fragment: '\u6211 \u4e0b \u661f\u671f \u4e0d \u6765',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-10-18T05:34:39.889454',
      status_changed_date: '2026-02-08T05:34:39.889454',
      notes: '',
      audio: null,
      words: ['\u4e0b'],
      tags: [],
      hints: [
        {
          id: 12750172,
          locale: 'en',
          text: 'next',
          term: '\u4e0b',
          popularity: 105,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u00e0'],
        hant: ['\u4e0b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0b']
    },
    {
      pk: 778653080,
      url: 'https://www.lingq.com/api/v3/zh/cards/778653080/',
      term: '\u4e0b\u5348',
      fragment: '\u90a3\uff0c \u660e\u5929 \u4e0b\u5348 \u53ef\u4ee5 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-09T05:35:38.450374',
      status_changed_date: '2026-02-08T05:35:38.450374',
      notes: '',
      audio: null,
      words: ['\u4e0b\u5348'],
      tags: [],
      hints: [
        {
          id: 12818473,
          locale: 'en',
          text: 'afternoon',
          term: '\u4e0b\u5348',
          popularity: 789,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u00e0w\u01d4'],
        hant: ['\u4e0b\u5348']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0b\u5348']
    },
    {
      pk: 783076988,
      url: 'https://www.lingq.com/api/v3/zh/cards/783076988/',
      term: '\u4e0b\u73ed',
      fragment: '\u4f60 \u51e0\u70b9 \u4e0b\u73ed\uff1f',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-19T04:20:05.353752',
      status_changed_date: '2026-03-04T04:20:05.353752',
      notes: '',
      audio: null,
      words: ['\u4e0b\u73ed'],
      tags: [],
      hints: [
        {
          id: 14512259,
          locale: 'en',
          text: 'get off work',
          term: '\u4e0b\u73ed',
          popularity: 1640,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u00e0b\u0101n'],
        hant: ['\u4e0b\u73ed']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0b\u73ed']
    },
    {
      pk: 776888627,
      url: 'https://www.lingq.com/api/v3/zh/cards/776888627/',
      term: '\u4e0b\u96e8',
      fragment: '',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-09T05:33:39.793104',
      status_changed_date: '2026-02-08T05:33:39.793104',
      notes: '',
      audio: null,
      words: ['\u4e0b\u96e8'],
      tags: [],
      hints: [
        {
          id: 160046423,
          locale: 'en',
          text: "it's raining",
          term: '\u4e0b\u96e8',
          popularity: 29,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u00e0y\u01d4'],
        hant: ['\u4e0b\u96e8']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0b\u96e8']
    },
    {
      pk: 775818309,
      url: 'https://www.lingq.com/api/v3/zh/cards/775818309/',
      term: '\u4e0d',
      fragment: '\u4e0d \u662f',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-10-18T05:35:12.949620',
      status_changed_date: '2026-02-08T05:35:12.949620',
      notes: '',
      audio: null,
      words: ['\u4e0d'],
      tags: [],
      hints: [
        {
          id: 15899108,
          locale: 'en',
          text: 'not',
          term: '\u4e0d',
          popularity: 133162,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9'],
        hant: ['\u4e0d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d']
    },
    {
      pk: 781714057,
      url: 'https://www.lingq.com/api/v3/zh/cards/781714057/',
      term: '\u4e0d\u4e86',
      fragment:
        '\u2026\u4f60\uff0c \u4f60 \u4e5f \u63a5 \u4e0d\u4e86 \u90a3\u6837\u7684 \u7403\u3002',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-08T04:13:22.604584',
      status_changed_date: '2026-03-01T04:13:22.604584',
      notes: '',
      audio: null,
      words: ['\u4e0d\u4e86'],
      tags: [],
      hints: [
        {
          id: 29444376,
          locale: 'en',
          text: 'unable to',
          term: '\u4e0d\u4e86',
          popularity: 23,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9li\u01ceo'],
        hant: ['\u4e0d\u4e86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u4e86']
    },
    {
      pk: 776511167,
      url: 'https://www.lingq.com/api/v3/zh/cards/776511167/',
      term: '\u4e0d\u4f1a',
      fragment: '',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-30T03:31:00.383480',
      status_changed_date: '2026-01-30T03:31:00.383480',
      notes: '',
      audio: null,
      words: ['\u4e0d\u4f1a'],
      tags: [],
      hints: [
        {
          id: 16228514,
          locale: 'en',
          text: 'cannot',
          term: '\u4e0d\u4f1a',
          popularity: 433,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9hu\u00ec'],
        hant: ['\u4e0d\u6703']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u4f1a']
    },
    {
      pk: 777212921,
      url: 'https://www.lingq.com/api/v3/zh/cards/777212921/',
      term: '\u4e0d\u540c',
      fragment: '\u7528 \u4e0d\u540c \u7684 \u65b9\u5f0f \u8bb2\u8ff0 \u540c',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:24:30.145669',
      status_changed_date: '2026-02-24T03:24:30.145669',
      notes: '',
      audio: null,
      words: ['\u4e0d\u540c'],
      tags: [],
      hints: [
        {
          id: 13568307,
          locale: 'en',
          text: 'different',
          term: '\u4e0d\u540c',
          popularity: 4667,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9t\u00f3ng'],
        hant: ['\u4e0d\u540c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u540c']
    },
    {
      pk: 781713449,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713449/',
      term: '\u4e0d\u597d',
      fragment:
        '\u2026\u7fbd\u6bdb\u7403 \u6211 \u53ef \u6253 \u4e0d\u597d\uff0c \u4f60 \u6765 \u53d1\u7403 \u5427\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-30T04:15:41.752692',
      status_changed_date: '2026-03-01T04:15:41.752692',
      notes: '',
      audio: null,
      words: ['\u4e0d\u597d'],
      tags: [],
      hints: [
        {
          id: 73610932,
          locale: 'en',
          text: 'not well',
          term: '\u4e0d\u597d',
          popularity: 20,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9h\u01ceo'],
        hant: ['\u4e0d\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u597d']
    },
    {
      pk: 778976009,
      url: 'https://www.lingq.com/api/v3/zh/cards/778976009/',
      term: '\u4e0d\u597d\u610f\u601d',
      fragment: '\u4e0d\u597d\u610f\u601d\uff01',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-30T04:15:56.916196',
      status_changed_date: '2026-03-01T04:15:56.916196',
      notes: '',
      audio: null,
      words: ['\u4e0d\u597d\u610f\u601d'],
      tags: [],
      hints: [
        {
          id: 20797185,
          locale: 'en',
          text: 'sorry',
          term: '\u4e0d\u597d\u610f\u601d',
          popularity: 107,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9h\u01ceoy\u00ecsi'],
        hant: ['\u4e0d\u597d\u610f\u601d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u597d\u610f\u601d']
    },
    {
      pk: 778647853,
      url: 'https://www.lingq.com/api/v3/zh/cards/778647853/',
      term: '\u4e0d\u5bf9',
      fragment: '\u4e0d\u5bf9\uff0c \u5341\u56db \u5757\u94b1\u3002',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:16:29.333062',
      status_changed_date: '2026-02-24T03:16:29.333062',
      notes: '',
      audio: null,
      words: ['\u4e0d\u5bf9'],
      tags: [],
      hints: [
        {
          id: 182696766,
          locale: 'en',
          text: 'not correct',
          term: '\u4e0d\u5bf9',
          popularity: 41,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9du\u00ec'],
        hant: ['\u4e0d\u5c0d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u5bf9']
    },
    {
      pk: 784072569,
      url: 'https://www.lingq.com/api/v3/zh/cards/784072569/',
      term: '\u4e0d\u662f',
      fragment: '\u4e0d\u662f\uff0c \u4ed6 \u4e0d \u662f \u4e03\u70b9\u2026',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:20:00.127387',
      status_changed_date: '2026-02-24T03:20:00.127387',
      notes: '',
      audio: null,
      words: ['\u4e0d\u662f'],
      tags: [],
      hints: [
        {
          id: 19483390,
          locale: 'en',
          text: 'no / is not / not',
          term: '\u4e0d\u662f',
          popularity: 742552,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00fashi'],
        hant: ['\u4e0d\u662f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u662f']
    },
    {
      pk: 784431246,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431246/',
      term: '\u4e0d\u7528',
      fragment:
        '\u2026\u7684 \u65f6\u95f4 \u91cc\uff0c \u4ed6 \u4e0d\u7528 \u518d \u53bb \u5de5\u4f5c\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-19T04:23:44.332319',
      status_changed_date: '2026-03-04T04:23:44.332319',
      notes: '',
      audio: null,
      words: ['\u4e0d\u7528'],
      tags: [],
      hints: [
        {
          id: 217144676,
          locale: 'en',
          text: "doesn't need to",
          term: '\u4e0d\u7528',
          popularity: 72,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9y\u00f2ng'],
        hant: ['\u4e0d\u7528']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u7528']
    },
    {
      pk: 777563677,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563677/',
      term: '\u4e0d\u7528\u8c22',
      fragment: '\u4e0d\u7528\u8c22\u3002',
      importance: 0,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-30T03:30:02.497116',
      status_changed_date: '2026-01-30T03:30:02.497116',
      notes: '',
      audio: null,
      words: ['\u4e0d\u7528\u8c22'],
      tags: [],
      hints: [
        {
          id: 3690990,
          locale: 'en',
          text: "You're welcome",
          term: '\u4e0d\u7528\u8c22',
          popularity: 54,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9y\u00f2ngxi\u00e8'],
        hant: ['\u4e0d\u7528\u8b1d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u7528\u8c22']
    },
    {
      pk: 776888254,
      url: 'https://www.lingq.com/api/v3/zh/cards/776888254/',
      term: '\u4e0d\u8981',
      fragment: '\u4e0d\u8981 \u559d \u81ea\u6765\u6c34',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:22:20.169647',
      status_changed_date: '2026-02-24T03:22:20.169647',
      notes: '',
      audio: null,
      words: ['\u4e0d\u8981'],
      tags: [],
      hints: [
        {
          id: 22990631,
          locale: 'en',
          text: "don't",
          term: '\u4e0d\u8981',
          popularity: 158,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9y\u00e0o'],
        hant: ['\u4e0d\u8981']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u8981']
    },
    {
      pk: 779328027,
      url: 'https://www.lingq.com/api/v3/zh/cards/779328027/',
      term: '\u4e0d\u89c1',
      fragment: '\u597d\u4e45 \u4e0d\u89c1\uff01',
      importance: 1,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-30T04:16:00.088918',
      status_changed_date: '2026-03-01T04:16:00.088918',
      notes: '',
      audio: null,
      words: ['\u4e0d\u89c1'],
      tags: [],
      hints: [
        {
          id: 190519716,
          locale: 'en',
          text: 'no see',
          term: '\u4e0d\u89c1',
          popularity: 42,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9ji\u00e0n'],
        hant: ['\u4e0d\u898b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u89c1']
    },
    {
      pk: 782329321,
      url: 'https://www.lingq.com/api/v3/zh/cards/782329321/',
      term: '\u4e0d\u89c1\u4e86',
      fragment: '\u6211 \u7684 \u94a5\u5319 \u4e0d\u89c1\u4e86\uff01',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-08T04:16:32.535491',
      status_changed_date: '2026-03-01T04:16:32.535491',
      notes: '',
      audio: null,
      words: ['\u4e0d\u89c1\u4e86'],
      tags: [],
      hints: [
        {
          id: 93657947,
          locale: 'en',
          text: 'disappeared',
          term: '\u4e0d\u89c1\u4e86',
          popularity: 182,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9 xi\u00e0n le'],
        hant: ['\u4e0d\u898b\u4e86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u89c1\u4e86']
    },
    {
      pk: 782707954,
      url: 'https://www.lingq.com/api/v3/zh/cards/782707954/',
      term: '\u4e0d\u8c22',
      fragment: '\u4e0d\u8c22\u3002',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:16:05.805064',
      status_changed_date: '2026-02-24T03:16:05.805064',
      notes: '',
      audio: null,
      words: ['\u4e0d\u8c22'],
      tags: [],
      hints: [
        {
          id: 20481806,
          locale: 'en',
          text: 'not at all, do not mention it',
          term: '\u4e0d\u8c22',
          popularity: 97,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9xi\u00e8'],
        hant: ['\u4e0d\u8b1d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u8c22']
    },
    {
      pk: 779328161,
      url: 'https://www.lingq.com/api/v3/zh/cards/779328161/',
      term: '\u4e0d\u9519',
      fragment: '\u4e0d\u9519\uff01',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:24:30.146454',
      status_changed_date: '2026-02-24T03:24:30.146454',
      notes: '',
      audio: null,
      words: ['\u4e0d\u9519'],
      tags: [],
      hints: [
        {
          id: 376795,
          locale: 'en',
          text: 'not bad',
          term: '\u4e0d\u9519',
          popularity: 342749,
          is_google_translate: false,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['b\u00f9cu\u00f2'],
        hant: ['\u4e0d\u932f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0d\u9519']
    },
    {
      pk: 783753037,
      url: 'https://www.lingq.com/api/v3/zh/cards/783753037/',
      term: '\u4e0e',
      fragment: '\u4e0e \u8fd9\u4e9b \u987e\u5ba2 \u804a\u5929\uff0c \u8fc8\u514b\u2026',
      importance: 3,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:33:08.361978',
      status_changed_date: '2026-03-06T05:33:08.361978',
      notes: '',
      audio: null,
      words: ['\u4e0e'],
      tags: [],
      hints: [
        {
          id: 23903630,
          locale: 'en',
          text: 'together with, to give, and',
          term: '\u4e0e',
          popularity: 54,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u01d4'],
        hant: ['\u8207']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e0e']
    },
    {
      pk: 775820178,
      url: 'https://www.lingq.com/api/v3/zh/cards/775820178/',
      term: '\u4e1c\u897f',
      fragment: '\u4f60 \u6709 \u4ec0\u4e48 \u4e1c\u897f \u4e0d \u5403 \u5417',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-09T05:32:53.345257',
      status_changed_date: '2026-03-06T05:32:53.345257',
      notes: '',
      audio: null,
      words: ['\u4e1c\u897f'],
      tags: [],
      hints: [
        {
          id: 7479747,
          locale: 'en',
          text: 'things',
          term: '\u4e1c\u897f',
          popularity: 448,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u014dngx\u012b'],
        hant: ['\u6771\u897f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e1c\u897f']
    },
    {
      pk: 784431223,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431223/',
      term: '\u4e24\u5468',
      fragment: '\u4e24\u5468 \u7684 \u65f6\u95f4 \u91cc\uff0c \u4ed6\u2026',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-19T04:26:13.032951',
      status_changed_date: '2026-03-04T04:26:13.032951',
      notes: '',
      audio: null,
      words: ['\u4e24\u5468'],
      tags: [],
      hints: [
        {
          id: 23074146,
          locale: 'en',
          text: 'two weeks',
          term: '\u4e24\u5468',
          popularity: 609,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['li\u01ceng zh\u014du'],
        hant: ['\u5169\u5468']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e24\u5468']
    },
    {
      pk: 775818084,
      url: 'https://www.lingq.com/api/v3/zh/cards/775818084/',
      term: '\u4e2d\u56fd',
      fragment: '\u60a8 \u7b2c\u4e00\u6b21 \u6765 \u4e2d\u56fd \u5417',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-22T03:46:13.740086',
      status_changed_date: '2026-01-22T03:46:13.740086',
      notes: '',
      audio: null,
      words: ['\u4e2d\u56fd'],
      tags: [],
      hints: [
        {
          id: 1294360,
          locale: 'en',
          text: 'China',
          term: '\u4e2d\u56fd',
          popularity: 4097,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u014dnggu\u00f3'],
        hant: ['\u4e2d\u570b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e2d\u56fd']
    },
    {
      pk: 775453024,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453024/',
      term: '\u4e2d\u56fd\u4eba',
      fragment: '\u4f60 \u662f \u4e2d\u56fd\u4eba \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-10-01T03:44:57.349478',
      status_changed_date: '2026-01-22T03:44:57.349478',
      notes: '',
      audio: null,
      words: ['\u4e2d\u56fd\u4eba'],
      tags: [],
      hints: [
        {
          id: 9595598,
          locale: 'en',
          text: 'Chinese',
          term: '\u4e2d\u56fd\u4eba',
          popularity: 88,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u014dnggu\u00f3r\u00e9n'],
        hant: ['\u4e2d\u570b\u4eba']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e2d\u56fd\u4eba']
    },
    {
      pk: 779643686,
      url: 'https://www.lingq.com/api/v3/zh/cards/779643686/',
      term: '\u4e2d\u6587',
      fragment: '\u8981 \u4e2d\u6587 \u7684 \u8fd8\u662f \u82f1\u6587 \u7684\uff1f',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:20:00.118612',
      status_changed_date: '2026-02-24T03:20:00.118612',
      notes: '',
      audio: null,
      words: ['\u4e2d\u6587'],
      tags: [],
      hints: [
        {
          id: 9953078,
          locale: 'en',
          text: 'Chinese',
          term: '\u4e2d\u6587',
          popularity: 2634,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u014dngw\u00e9n'],
        hant: ['\u4e2d\u6587']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e2d\u6587']
    },
    {
      pk: 783077828,
      url: 'https://www.lingq.com/api/v3/zh/cards/783077828/',
      term: '\u4e3a',
      fragment: '\u4ed6 \u4e3a \u809a\u5b50 \u997f \u7684 \u987e\u5ba2\u2026',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T04:19:34.360536',
      status_changed_date: '2026-03-04T04:19:34.360536',
      notes: '',
      audio: null,
      words: ['\u4e3a'],
      tags: [],
      hints: [
        {
          id: 377075,
          locale: 'en',
          text: 'for, because of',
          term: '\u4e3a',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e9i'],
        hant: ['\u70ba']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e3a']
    },
    {
      pk: 776513049,
      url: 'https://www.lingq.com/api/v3/zh/cards/776513049/',
      term: '\u4e3a\u4ec0\u4e48',
      fragment: '\u4e3a\u4ec0\u4e48',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-08T04:21:45.392449',
      status_changed_date: '2026-02-07T04:21:45.392449',
      notes: '',
      audio: null,
      words: ['\u4e3a\u4ec0\u4e48'],
      tags: [],
      hints: [
        {
          id: 10629674,
          locale: 'en',
          text: 'Why',
          term: '\u4e3a\u4ec0\u4e48',
          popularity: 2047,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e8ish\u00e9nme'],
        hant: ['\u70ba\u4ec0\u9ebc']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e3a\u4ec0\u4e48']
    },
    {
      pk: 792059199,
      url: 'https://www.lingq.com/api/v3/zh/cards/792059199/',
      term: '\u4e3b\u610f',
      fragment: '\u6069\uff0c \u597d \u4e3b\u610f\u3002',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T04:19:32.740870',
      status_changed_date: '2026-03-04T04:19:32.740870',
      notes: '',
      audio: null,
      words: ['\u4e3b\u610f'],
      tags: [],
      hints: [
        {
          id: 13579260,
          locale: 'en',
          text: 'idea',
          term: '\u4e3b\u610f',
          popularity: 1050,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u01d4yi'],
        hant: ['\u4e3b\u610f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e3b\u610f']
    },
    {
      pk: 794245953,
      url: 'https://www.lingq.com/api/v3/zh/cards/794245953/',
      term: '\u4e3b\u9898',
      fragment: '\u8fd9 \u662f \u4e00\u5bb6 \u8fd0\u52a8 \u4e3b\u9898 \u9152\u5427',
      importance: 2,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-10T03:51:28.116954',
      status_changed_date: '2026-03-09T03:51:28.116954',
      notes: '',
      audio: null,
      words: ['\u4e3b\u9898'],
      tags: [],
      hints: [
        {
          id: 18053593,
          locale: 'en',
          text: 'theme, subject, topic',
          term: '\u4e3b\u9898',
          popularity: 35,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u01d4t\u00ed'],
        hant: ['\u4e3b\u984c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e3b\u9898']
    },
    {
      pk: 792383202,
      url: 'https://www.lingq.com/api/v3/zh/cards/792383202/',
      term: '\u4e4b\u524d',
      fragment:
        '\u5728 \u53bb \u996d\u9986 \u4e4b\u524d\uff0c \u6211\u4eec \u53ef\u4ee5 \u5148 \u559d\u2026',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:41:25.196163',
      status_changed_date: '2026-03-06T05:41:25.196163',
      notes: '',
      audio: null,
      words: ['\u4e4b\u524d'],
      tags: [],
      hints: [
        {
          id: 377209,
          locale: 'en',
          text: 'before',
          term: '\u4e4b\u524d',
          popularity: 3379,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u012bqi\u00e1n'],
        hant: ['\u4e4b\u524d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e4b\u524d']
    },
    {
      pk: 775819980,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819980/',
      term: '\u4e56',
      fragment: '\u5b9d\u5b9d \uff0c\u4e56',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:16:05.805334',
      status_changed_date: '2026-02-24T03:16:05.805334',
      notes: '',
      audio: null,
      words: ['\u4e56'],
      tags: [],
      hints: [
        {
          id: 160214601,
          locale: 'en',
          text: 'well-behaved',
          term: '\u4e56',
          popularity: 58,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['gu\u0101i'],
        hant: ['\u4e56']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e56']
    },
    {
      pk: 777563534,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563534/',
      term: '\u4e5d',
      fragment: '\u2026\u516b\uff0c \u56db \u56db \u4e03 \u4e5d\u3002',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:16:05.798418',
      status_changed_date: '2026-02-24T03:16:05.798418',
      notes: '',
      audio: null,
      words: ['\u4e5d'],
      tags: [],
      hints: [
        {
          id: 10670527,
          locale: 'en',
          text: 'nine',
          term: '\u4e5d',
          popularity: 639,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u01d4'],
        hant: ['\u4e5d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e5d']
    },
    {
      pk: 780326322,
      url: 'https://www.lingq.com/api/v3/zh/cards/780326322/',
      term: '\u4e5d\u6708',
      fragment: '\u6211 \u4e5d\u6708 \u53bb\u3002',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-16T04:13:43.388547',
      status_changed_date: '2026-03-01T04:13:43.388547',
      notes: '',
      audio: null,
      words: ['\u4e5d\u6708'],
      tags: [],
      hints: [
        {
          id: 2585868,
          locale: 'en',
          text: 'September',
          term: '\u4e5d\u6708',
          popularity: 928,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u01d4yu\u00e8'],
        hant: ['\u4e5d\u6708']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e5d\u6708']
    },
    {
      pk: 783076960,
      url: 'https://www.lingq.com/api/v3/zh/cards/783076960/',
      term: '\u4e5d\u70b9',
      fragment: '\u65e9\u4e0a \u4e5d\u70b9\u3002',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:16:05.799919',
      status_changed_date: '2026-02-24T03:16:05.799919',
      notes: '',
      audio: null,
      words: ['\u4e5d\u70b9'],
      tags: [],
      hints: [
        {
          id: 18367809,
          locale: 'en',
          text: "nine o'clock",
          term: '\u4e5d\u70b9',
          popularity: 510,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u01d4 di\u01cen'],
        hant: ['\u4e5d\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e5d\u70b9']
    },
    {
      pk: 775450798,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450798/',
      term: '\u4e5f',
      fragment: '\u6211 \u4e5f \u5f88 \u597d\uff0c \u8c22\u8c22\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-06T05:11:27.746399',
      status_changed_date: '2026-02-05T05:11:27.746399',
      notes: '',
      audio: null,
      words: ['\u4e5f'],
      tags: [],
      hints: [
        {
          id: 377281,
          locale: 'en',
          text: 'also',
          term: '\u4e5f',
          popularity: 2908,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u011b'],
        hant: ['\u4e5f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e5f']
    },
    {
      pk: 781714402,
      url: 'https://www.lingq.com/api/v3/zh/cards/781714402/',
      term: '\u4e60\u60ef\u4e86',
      fragment: '\u4e0d \u597d\u610f\u601d\uff0c \u4e60\u60ef\u4e86\u3002',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-16T04:15:32.189939',
      status_changed_date: '2026-03-01T04:15:32.189939',
      notes: '',
      audio: null,
      words: ['\u4e60\u60ef\u4e86'],
      tags: [],
      hints: [
        {
          id: 182130075,
          locale: 'en',
          text: 'used to it',
          term: '\u4e60\u60ef\u4e86',
          popularity: 22,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u00ed gu\u00e0n le'],
        hant: ['\u7fd2\u6163\u4e86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e60\u60ef\u4e86']
    },
    {
      pk: 782708413,
      url: 'https://www.lingq.com/api/v3/zh/cards/782708413/',
      term: '\u4e66',
      fragment: '\u6253\u5f00 \u4e66\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:22:20.172057',
      status_changed_date: '2026-02-24T03:22:20.172057',
      notes: '',
      audio: null,
      words: ['\u4e66'],
      tags: [],
      hints: [
        {
          id: 12713007,
          locale: 'en',
          text: 'book',
          term: '\u4e66',
          popularity: 495,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u016b'],
        hant: ['\u66f8']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e66']
    },
    {
      pk: 782329092,
      url: 'https://www.lingq.com/api/v3/zh/cards/782329092/',
      term: '\u4e70',
      fragment: '\u8981 \u4e70 \u4ec0\u4e48\uff1f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-16T04:16:31.542797',
      status_changed_date: '2026-03-01T04:16:31.542797',
      notes: '',
      audio: null,
      words: ['\u4e70'],
      tags: [],
      hints: [
        {
          id: 6027034,
          locale: 'en',
          text: 'buy',
          term: '\u4e70',
          popularity: 245967,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u01cei'],
        hant: ['\u8cb7']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e70']
    },
    {
      pk: 775822858,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822858/',
      term: '\u4e86',
      fragment: '\u9760\u8fb9 \u505c \u5c31 \u53ef\u4ee5 \u4e86',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-07T03:31:50.828511',
      status_changed_date: '2026-02-06T03:31:50.828511',
      notes: '',
      audio: null,
      words: ['\u4e86'],
      tags: [],
      hints: [
        {
          id: 15039986,
          locale: 'en',
          text: 'completed action marker',
          term: '\u4e86',
          popularity: 418393,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['le'],
        hant: ['\u4e86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e86']
    },
    {
      pk: 776160742,
      url: 'https://www.lingq.com/api/v3/zh/cards/776160742/',
      term: '\u4e8b',
      fragment: '\u4ec0\u4e48 \u4e8b\uff1f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:18:20.111835',
      status_changed_date: '2026-02-24T03:18:20.111835',
      notes: '',
      audio: null,
      words: ['\u4e8b'],
      tags: [],
      hints: [
        {
          id: 13634443,
          locale: 'en',
          text: 'thing',
          term: '\u4e8b',
          popularity: 867,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00ec'],
        hant: ['\u4e8b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e8b']
    },
    {
      pk: 779644834,
      url: 'https://www.lingq.com/api/v3/zh/cards/779644834/',
      term: '\u4e8b\u513f',
      fragment: '\u6211 \u6ca1 \u4e8b\u513f\u3002',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-30T04:16:28.040950',
      status_changed_date: '2026-03-01T04:16:28.040950',
      notes: '',
      audio: null,
      words: ['\u4e8b\u513f'],
      tags: [],
      hints: [
        {
          id: 65112650,
          locale: 'en',
          text: 'matter',
          term: '\u4e8b\u513f',
          popularity: 76,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00ecr'],
        hant: ['\u4e8b\u5152']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e8b\u513f']
    },
    {
      pk: 777563505,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563505/',
      term: '\u4e8c',
      fragment: '\u4e00 \u4e09 \u4e94\uff0c \u4e8c \u516b \u96f6 \u516b\uff0c \u56db\u2026',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-30T04:16:39.786440',
      status_changed_date: '2026-03-01T04:16:39.786440',
      notes: '',
      audio: null,
      words: ['\u4e8c'],
      tags: [],
      hints: [
        {
          id: 10670522,
          locale: 'en',
          text: 'two',
          term: '\u4e8c',
          popularity: 195409,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u00e8r'],
        hant: ['\u4e8c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e8c']
    },
    {
      pk: 784072915,
      url: 'https://www.lingq.com/api/v3/zh/cards/784072915/',
      term: '\u4e8e',
      fragment:
        '\u2026\u987e\u5ba2 \u4e0d \u662f \u6765\u81ea \u4e8e \u540c\u4e00\u4e2a \u56fd\u5bb6\uff0c \u4ed6\u4eec \u6765\u81ea\u2026',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:32:41.762999',
      status_changed_date: '2026-03-06T05:32:41.762999',
      notes: '',
      audio: null,
      words: ['\u4e8e'],
      tags: [],
      hints: [
        {
          id: 226996774,
          locale: 'en',
          text: 'formal preposition meaning \u201cin, at, from, to, or than.\u201d',
          term: '\u4e8e',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u00fa'],
        hant: ['\u65bc']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e8e']
    },
    {
      pk: 777215374,
      url: 'https://www.lingq.com/api/v3/zh/cards/777215374/',
      term: '\u4e91',
      fragment: '\u767d \u767d \u7684 \u4e91\uff0c',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-30T04:13:46.333744',
      status_changed_date: '2026-03-01T04:13:46.333744',
      notes: '',
      audio: null,
      words: ['\u4e91'],
      tags: [],
      hints: [
        {
          id: 13521766,
          locale: 'en',
          text: 'cloud',
          term: '\u4e91',
          popularity: 860,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u00fan'],
        hant: ['\u96f2']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e91']
    },
    {
      pk: 777563478,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563478/',
      term: '\u4e94',
      fragment: '\u4e00 \u4e09 \u4e94\uff0c \u4e8c \u516b \u96f6 \u516b\uff0c\u2026',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:22:20.168297',
      status_changed_date: '2026-02-24T03:22:20.168297',
      notes: '',
      audio: null,
      words: ['\u4e94'],
      tags: [],
      hints: [
        {
          id: 7846757,
          locale: 'en',
          text: 'five',
          term: '\u4e94',
          popularity: 535,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01d4'],
        hant: ['\u4e94']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e94']
    },
    {
      pk: 795224082,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224082/',
      term: '\u4e94\u6b21',
      fragment: '\u6211 \u81f3\u5c11 \u6765\u8fc7 \u4e94\u6b21',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:44:18.073000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4e94\u6b21'],
      tags: [],
      hints: [
        {
          id: 114818938,
          locale: 'en',
          text: '5 times',
          term: '\u4e94\u6b21',
          popularity: 5,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u01d4 c\u00ec'],
        hant: ['\u4e94\u6b21']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e94\u6b21']
    },
    {
      pk: 783752478,
      url: 'https://www.lingq.com/api/v3/zh/cards/783752478/',
      term: '\u4e9b',
      fragment: '\u8fd9 \u4e9b \u987e\u5ba2 \u6765\u81ea \u5f88 \u591a\u2026',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-16T22:42:20.660514',
      status_changed_date: '2026-03-13T22:42:20.660514',
      notes: '',
      audio: null,
      words: ['\u4e9b'],
      tags: [],
      hints: [
        {
          id: 224350903,
          locale: 'en',
          text: 'these / some / few',
          term: '\u4e9b',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u0113'],
        hant: ['\u4e9b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4e9b']
    },
    {
      pk: 785461566,
      url: 'https://www.lingq.com/api/v3/zh/cards/785461566/',
      term: '\u4eac',
      fragment: '\u6211 \u53eb \u5218 \u4eac \u4eac\u3002',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-19T04:23:39.997757',
      status_changed_date: '2026-03-04T04:23:39.997757',
      notes: '',
      audio: null,
      words: ['\u4eac'],
      tags: [],
      hints: [
        {
          id: 116539831,
          locale: 'en',
          text: 'capital',
          term: '\u4eac',
          popularity: 10,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u012bng'],
        hant: ['\u4eac']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4eac']
    },
    {
      pk: 795224668,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224668/',
      term: '\u4eac\u4eac',
      fragment: '\u5218 \u4eac\u4eac\uff1f',
      importance: 0,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-14T22:44:43.591077',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4eac\u4eac'],
      tags: [],
      hints: [
        {
          id: 13820749,
          locale: 'en',
          text: 'Jingjing',
          term: '\u4eac\u4eac',
          popularity: 23,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u012bng j\u012bng'],
        hant: ['\u4eac\u4eac']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4eac\u4eac']
    },
    {
      pk: 777908126,
      url: 'https://www.lingq.com/api/v3/zh/cards/777908126/',
      term: '\u4eb2',
      fragment: '\u6765\uff0c \u4eb2 \u4e00\u4e0b\u3002',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-04T04:15:32.193133',
      status_changed_date: '2026-03-01T04:15:32.193133',
      notes: '',
      audio: null,
      words: ['\u4eb2'],
      tags: [],
      hints: [
        {
          id: 80968552,
          locale: 'en',
          text: 'kiss',
          term: '\u4eb2',
          popularity: 161,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['q\u012bn'],
        hant: ['\u89aa']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4eb2']
    },
    {
      pk: 775455461,
      url: 'https://www.lingq.com/api/v3/zh/cards/775455461/',
      term: '\u4eba',
      fragment: 'John \u662f \u7f8e\u56fd \u4eba\u3002',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-10-22T04:53:01.640962',
      status_changed_date: '2026-02-12T04:53:01.640962',
      notes: '',
      audio: null,
      words: ['\u4eba'],
      tags: [],
      hints: [
        {
          id: 377703,
          locale: 'en',
          text: 'person',
          term: '\u4eba',
          popularity: 257124,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['r\u00e9n'],
        hant: ['\u4eba']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4eba']
    },
    {
      pk: 775451127,
      url: 'https://www.lingq.com/api/v3/zh/cards/775451127/',
      term: '\u4ec0\u4e48',
      fragment: '\u4f60 \u53eb \u4ec0\u4e48 \u540d\u5b57\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-28T01:57:23.312616',
      status_changed_date: '2026-01-28T01:57:23.312616',
      notes: '',
      audio: null,
      words: ['\u4ec0\u4e48'],
      tags: [],
      hints: [
        {
          id: 8842403,
          locale: 'en',
          text: 'what',
          term: '\u4ec0\u4e48',
          popularity: 146472,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e9nme'],
        hant: ['\u4ec0\u9ebc']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4ec0\u4e48']
    },
    {
      pk: 782020163,
      url: 'https://www.lingq.com/api/v3/zh/cards/782020163/',
      term: '\u4eca\u5929',
      fragment: '\u4f60 \u4eca\u5929 \u5f88 \u7d2f \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:22:20.171033',
      status_changed_date: '2026-02-24T03:22:20.171033',
      notes: '',
      audio: null,
      words: ['\u4eca\u5929'],
      tags: [],
      hints: [
        {
          id: 2859769,
          locale: 'en',
          text: 'Today',
          term: '\u4eca\u5929',
          popularity: 2047,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u012bnti\u0101n'],
        hant: ['\u4eca\u5929']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4eca\u5929']
    },
    {
      pk: 795224292,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224292/',
      term: '\u4eca\u665a',
      fragment:
        '\u4f60\u597d \uff0c\u6211 \u662f \u4f60\u4eec \u4eca\u665a \u7684 \u670d\u52a1\u5458',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:45:53.634000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4eca\u665a'],
      tags: [],
      hints: [
        {
          id: 15092273,
          locale: 'en',
          text: 'tonight, this evening',
          term: '\u4eca\u665a',
          popularity: 1400,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u012bnw\u01cen'],
        hant: ['\u4eca\u665a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4eca\u665a']
    },
    {
      pk: 795223806,
      url: 'https://www.lingq.com/api/v3/zh/cards/795223806/',
      term: '\u4ee5\u524d',
      fragment: '\u4f60 \u4ee5\u524d \u6765 \u8fc7 \u8fd9 \u5bb6',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:42:05.759000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u4ee5\u524d'],
      tags: [],
      hints: [
        {
          id: 13548125,
          locale: 'en',
          text: 'before',
          term: '\u4ee5\u524d',
          popularity: 2544,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u01d0qi\u00e1n'],
        hant: ['\u4ee5\u524d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4ee5\u524d']
    },
    {
      pk: 784073129,
      url: 'https://www.lingq.com/api/v3/zh/cards/784073129/',
      term: '\u4eec',
      fragment: '\u4e03: \u987e\u5ba2 \u4eec \u90fd \u5f88 \u53cb\u597d\u3002',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T03:22:20.173278',
      status_changed_date: '2026-02-24T03:22:20.173278',
      notes: '',
      audio: null,
      words: ['\u4eec'],
      tags: [],
      hints: [
        {
          id: 18003081,
          locale: 'en',
          text: 'plural marker for pronouns and nouns',
          term: '\u4eec',
          popularity: 893,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['men'],
        hant: ['\u5011']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4eec']
    },
    {
      pk: 790056262,
      url: 'https://www.lingq.com/api/v3/zh/cards/790056262/',
      term: '\u4ef6',
      fragment: '\u8fd9 \u4ef6 \u4e0a\u8863 \u5f88 \u597d\u770b',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T04:19:50.162290',
      status_changed_date: '2026-03-04T04:19:50.162290',
      notes: '',
      audio: null,
      words: ['\u4ef6'],
      tags: [],
      hints: [
        {
          id: 15055382,
          locale: 'en',
          text: 'measure word for clothes',
          term: '\u4ef6',
          popularity: 1784,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u00e0n'],
        hant: ['\u4ef6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4ef6']
    },
    {
      pk: 784431333,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431333/',
      term: '\u4f11\u5047',
      fragment: '\u4ed6 \u60f3 \u53bb \u4f11\u5047\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:41:45.967574',
      status_changed_date: '2026-03-06T05:41:45.967574',
      notes: '',
      audio: null,
      words: ['\u4f11\u5047'],
      tags: [],
      hints: [
        {
          id: 34431174,
          locale: 'en',
          text: 'to take a vacation',
          term: '\u4f11\u5047',
          popularity: 130,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u016bji\u00e0'],
        hant: ['\u4f11\u5047']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f11\u5047']
    },
    {
      pk: 784431093,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431093/',
      term: '\u4f11\u606f',
      fragment:
        '\u2026\u4e2a \u51ac\u5929 \u4ed6 \u53ef\u4ee5 \u4f11\u606f \u4e00\u6bb5 \u65f6\u95f4 \u4e86\u3002',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T04:24:23.811389',
      status_changed_date: '2026-03-04T04:24:23.811389',
      notes: '',
      audio: null,
      words: ['\u4f11\u606f'],
      tags: [],
      hints: [
        {
          id: 12979172,
          locale: 'en',
          text: 'rest',
          term: '\u4f11\u606f',
          popularity: 1762,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u016bxi'],
        hant: ['\u4f11\u606f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f11\u606f']
    },
    {
      pk: 779979373,
      url: 'https://www.lingq.com/api/v3/zh/cards/779979373/',
      term: '\u4f1a',
      fragment: '\u4f60 \u4f1a \u8bf4 \u4e2d\u6587 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-30T04:13:21.997857',
      status_changed_date: '2026-03-01T04:13:21.997857',
      notes: '',
      audio: null,
      words: ['\u4f1a'],
      tags: [],
      hints: [
        {
          id: 33782013,
          locale: 'en',
          text: 'can',
          term: '\u4f1a',
          popularity: 589,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['hu\u00ec'],
        hant: ['\u6703']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f1a']
    },
    {
      pk: 784431441,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431441/',
      term: '\u4f46\u662f',
      fragment: '\u4f46\u662f \u6cd5\u56fd \u592a \u8d35 \u4e86\u3002',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-09T05:21:01.495086',
      status_changed_date: '2026-03-02T05:21:01.495086',
      notes: '',
      audio: null,
      words: ['\u4f46\u662f'],
      tags: [],
      hints: [
        {
          id: 40887986,
          locale: 'en',
          text: 'but, yet',
          term: '\u4f46\u662f',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e0nsh\u00ec'],
        hant: ['\u4f46\u662f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f46\u662f']
    },
    {
      pk: 775453456,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453456/',
      term: '\u4f4f',
      fragment: '\u5979 \u4f4f \u5728 \u5357\u4eac\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-11T04:28:13.128645',
      status_changed_date: '2026-02-10T04:28:13.128645',
      notes: '',
      audio: null,
      words: ['\u4f4f'],
      tags: [],
      hints: [
        {
          id: 15053264,
          locale: 'en',
          text: 'to live, to inhabit, to reside',
          term: '\u4f4f',
          popularity: 380,
          is_google_translate: false,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['zh\u00f9'],
        hant: ['\u4f4f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f4f']
    },
    {
      pk: 775450777,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450777/',
      term: '\u4f60',
      fragment: '\u4f60 \u5462\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-28T01:59:36.712638',
      status_changed_date: '2026-01-28T01:59:36.712638',
      notes: '',
      audio: null,
      words: ['\u4f60'],
      tags: [],
      hints: [
        {
          id: 145797895,
          locale: 'en',
          text: 'you',
          term: '\u4f60',
          popularity: 3163,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01d0'],
        hant: ['\u4f60']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f60']
    },
    {
      pk: 779327364,
      url: 'https://www.lingq.com/api/v3/zh/cards/779327364/',
      term: '\u4f60\u4eec',
      fragment: '\u6211\u4eec\u3001 \u4f60\u4eec\u3001 \u4ed6\u4eec',
      importance: 3,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-10-02T04:38:45.572673',
      status_changed_date: '2026-01-23T04:38:45.572673',
      notes: '',
      audio: null,
      words: ['\u4f60\u4eec'],
      tags: [],
      hints: [
        {
          id: 15069008,
          locale: 'en',
          text: 'you (plural)',
          term: '\u4f60\u4eec',
          popularity: 1971,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01d0men'],
        hant: ['\u4f60\u5011']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f60\u4eec']
    },
    {
      pk: 775823656,
      url: 'https://www.lingq.com/api/v3/zh/cards/775823656/',
      term: '\u4f60\u597d',
      fragment: '\u4f60\u597d \uff0c\u53ef\u4ee5 \u6362 \u96f6\u94b1 \u5417',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-01T04:23:35.109975',
      status_changed_date: '2026-01-31T04:23:35.109975',
      notes: '',
      audio: null,
      words: ['\u4f60\u597d'],
      tags: [],
      hints: [
        {
          id: 101051484,
          locale: 'en',
          text: 'hello',
          term: '\u4f60\u597d',
          popularity: 25276,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01d0h\u01ceo'],
        hant: ['\u4f60\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f60\u597d']
    },
    {
      pk: 775450709,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450709/',
      term: '\u4f60\u597d\u5417',
      fragment: '\u4f60\u597d\u5417\uff1f',
      importance: 0,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-06T05:12:45.334335',
      status_changed_date: '2026-02-05T05:12:45.334335',
      notes: '',
      audio: null,
      words: ['\u4f60\u597d\u5417'],
      tags: [],
      hints: [
        {
          id: 1402580,
          locale: 'en',
          text: 'How are you?',
          term: '\u4f60\u597d\u5417',
          popularity: 137,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01d0 h\u01ceo ma'],
        hant: ['\u4f60\u597d\u55ce']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4f60\u597d\u5417']
    },
    {
      pk: 784784819,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784819/',
      term: '\u4fbf\u5b9c',
      fragment: '\u6cd5\u56fd \u5f88 \u4fbf\u5b9c \u5417\uff1f',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T04:23:31.890797',
      status_changed_date: '2026-03-04T04:23:31.890797',
      notes: '',
      audio: null,
      words: ['\u4fbf\u5b9c'],
      tags: [],
      hints: [
        {
          id: 102008108,
          locale: 'en',
          text: 'cheap',
          term: '\u4fbf\u5b9c',
          popularity: 397418,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['bi\u00e0ny\u00ed'],
        hant: ['\u4fbf\u5b9c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u4fbf\u5b9c']
    },
    {
      pk: 784785053,
      url: 'https://www.lingq.com/api/v3/zh/cards/784785053/',
      term: '\u5047\u671f',
      fragment:
        '\u2026\u5b66 \u6cd5\u8bed\u3001 \u7701\u94b1\u3001 \u6574\u4e2a \u5047\u671f \u90fd \u5f85 \u5728 \u5bb6\u91cc\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-05T04:25:35.241754',
      status_changed_date: '2026-03-04T04:25:35.241754',
      notes: '',
      audio: null,
      words: ['\u5047\u671f'],
      tags: [],
      hints: [
        {
          id: 29202512,
          locale: 'en',
          text: 'vacation; holiday',
          term: '\u5047\u671f',
          popularity: 637183,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u00e0q\u012b'],
        hant: ['\u5047\u671f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5047\u671f']
    },
    {
      pk: 777213841,
      url: 'https://www.lingq.com/api/v3/zh/cards/777213841/',
      term: '\u505a',
      fragment: '\u6211 \u5148 \u505a \u65e9\u996d \u5e76 \u559d \u4e00\u676f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-09T05:21:04.170304',
      status_changed_date: '2026-03-02T05:21:04.170304',
      notes: '',
      audio: null,
      words: ['\u505a'],
      tags: [],
      hints: [
        {
          id: 224351514,
          locale: 'en',
          text: 'Work As / Do',
          term: '\u505a',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zu\u00f2'],
        hant: ['\u505a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u505a']
    },
    {
      pk: 784071373,
      url: 'https://www.lingq.com/api/v3/zh/cards/784071373/',
      term: '\u505a\u996d',
      fragment: '\u2026\u809a\u5b50 \u997f \u7684 \u987e\u5ba2 \u505a\u996d\u3002',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-17T05:22:34.346323',
      status_changed_date: '2026-03-02T05:22:34.346323',
      notes: '',
      audio: null,
      words: ['\u505a\u996d'],
      tags: [],
      hints: [
        {
          id: 49646958,
          locale: 'en',
          text: 'cook',
          term: '\u505a\u996d',
          popularity: 508,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zu\u00f2f\u00e0n'],
        hant: ['\u505a\u98ef']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u505a\u996d']
    },
    {
      pk: 775822797,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822797/',
      term: '\u505c',
      fragment: '\u9760\u8fb9 \u505c \u5c31 \u53ef\u4ee5 \u4e86',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:22:19.648538',
      status_changed_date: '2026-03-02T05:22:19.648538',
      notes: '',
      audio: null,
      words: ['\u505c'],
      tags: [],
      hints: [
        {
          id: 223339389,
          locale: 'en',
          text: 'to stop, to park',
          term: '\u505c',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00edng'],
        hant: ['\u505c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u505c']
    },
    {
      pk: 776889207,
      url: 'https://www.lingq.com/api/v3/zh/cards/776889207/',
      term: '\u505c\u7535',
      fragment: '\u505c\u7535 \u4e86',
      importance: 0,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-01T05:18:32.848090',
      status_changed_date: '2026-03-02T05:18:32.848090',
      notes: '',
      audio: null,
      words: ['\u505c\u7535'],
      tags: [],
      hints: [
        {
          id: 160046583,
          locale: 'en',
          text: 'power outage',
          term: '\u505c\u7535',
          popularity: 242,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00edngdi\u00e0n'],
        hant: ['\u505c\u96fb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u505c\u7535']
    },
    {
      pk: 775822721,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822721/',
      term: '\u505c\u8f66',
      fragment: '\u5e08\u5085 \uff0c\u5728 \u8fd9\u513f \u505c\u8f66',
      importance: 1,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-01T05:18:56.908501',
      status_changed_date: '2026-03-02T05:18:56.908501',
      notes: '',
      audio: null,
      words: ['\u505c\u8f66'],
      tags: [],
      hints: [
        {
          id: 89699361,
          locale: 'en',
          text: 'park car',
          term: '\u505c\u8f66',
          popularity: 61,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00edngch\u0113'],
        hant: ['\u505c\u8eca']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u505c\u8f66']
    },
    {
      pk: 777213789,
      url: 'https://www.lingq.com/api/v3/zh/cards/777213789/',
      term: '\u5148',
      fragment: '\u6211 \u5148 \u505a \u65e9\u996d \u5e76 \u559d',
      importance: 3,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:33:13.077477',
      status_changed_date: '2026-03-06T05:33:13.077477',
      notes: '',
      audio: null,
      words: ['\u5148'],
      tags: [],
      hints: [
        {
          id: 137586823,
          locale: 'en',
          text: 'first, first of all',
          term: '\u5148',
          popularity: 216419,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u0101n'],
        hant: ['\u5148']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5148']
    },
    {
      pk: 779979805,
      url: 'https://www.lingq.com/api/v3/zh/cards/779979805/',
      term: '\u5148\u751f',
      fragment: '\u5148\u751f\uff0c \u4f60 \u60f3 \u5403 \u4ec0\u4e48\uff1f',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:20:00.118006',
      status_changed_date: '2026-02-24T03:20:00.118006',
      notes: '',
      audio: null,
      words: ['\u5148\u751f'],
      tags: [],
      hints: [
        {
          id: 65214928,
          locale: 'en',
          text: 'sir',
          term: '\u5148\u751f',
          popularity: 46,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u0101nsheng'],
        hant: ['\u5148\u751f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5148\u751f']
    },
    {
      pk: 786157042,
      url: 'https://www.lingq.com/api/v3/zh/cards/786157042/',
      term: '\u5168\u90fd',
      fragment: '\u8fd9 \u5168\u90fd \u662f \u6211\u4eec \u7684 \u4e66\uff0c\u2026',
      importance: 2,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:38:03.123411',
      status_changed_date: '2026-03-06T05:38:03.123411',
      notes: '',
      audio: null,
      words: ['\u5168\u90fd'],
      tags: [],
      hints: [
        {
          id: 15055343,
          locale: 'en',
          text: 'all, without exception',
          term: '\u5168\u90fd',
          popularity: 2444,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['qu\u00e1nd\u014du'],
        hant: ['\u5168\u90fd']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5168\u90fd']
    },
    {
      pk: 777563509,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563509/',
      term: '\u516b',
      fragment: '\u4e00 \u4e09 \u4e94\uff0c \u4e8c \u516b \u96f6 \u516b\uff0c \u56db \u56db\u2026',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:22:20.167805',
      status_changed_date: '2026-02-24T03:22:20.167805',
      notes: '',
      audio: null,
      words: ['\u516b'],
      tags: [],
      hints: [
        {
          id: 16858886,
          locale: 'en',
          text: 'eight',
          term: '\u516b',
          popularity: 747019,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u0101'],
        hant: ['\u516b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516b']
    },
    {
      pk: 777563858,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563858/',
      term: '\u516b\u70b9',
      fragment: '\u90fd \u516b\u70b9 \u4e86\uff01',
      importance: 1,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:20:48.894494',
      status_changed_date: '2026-03-02T05:20:48.894494',
      notes: '',
      audio: null,
      words: ['\u516b\u70b9'],
      tags: [],
      hints: [
        {
          id: 44321615,
          locale: 'en',
          text: "eight o'clock",
          term: '\u516b\u70b9',
          popularity: 258,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u0101 di\u01cen'],
        hant: ['\u516b\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516b\u70b9']
    },
    {
      pk: 779644518,
      url: 'https://www.lingq.com/api/v3/zh/cards/779644518/',
      term: '\u516c\u53f8',
      fragment: '\u6211 \u53bb \u516c\u53f8\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:19:14.371222',
      status_changed_date: '2026-03-02T05:19:14.371222',
      notes: '',
      audio: null,
      words: ['\u516c\u53f8'],
      tags: [],
      hints: [
        {
          id: 2144824,
          locale: 'en',
          text: 'company',
          term: '\u516c\u53f8',
          popularity: 395,
          is_google_translate: true,
          flagged: false
        },
        {
          id: 28818072,
          locale: 'en',
          text: 'work',
          term: '\u516c\u53f8',
          popularity: 19,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u014dngs\u012b'],
        hant: ['\u516c\u53f8']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516c\u53f8']
    },
    {
      pk: 775819480,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819480/',
      term: '\u516c\u56ed',
      fragment: '\u5728 \u516c\u56ed \u5bf9\u9762 \u5417',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:18:51.662635',
      status_changed_date: '2026-03-02T05:18:51.662635',
      notes: '',
      audio: null,
      words: ['\u516c\u56ed'],
      tags: [],
      hints: [
        {
          id: 13489733,
          locale: 'en',
          text: 'park',
          term: '\u516c\u56ed',
          popularity: 268,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u014dngyu\u00e1n'],
        hant: ['\u516c\u5712']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516c\u56ed']
    },
    {
      pk: 782328840,
      url: 'https://www.lingq.com/api/v3/zh/cards/782328840/',
      term: '\u516d',
      fragment: '\u5e7a \u4e09 \u516d\u2026\u2026',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-17T05:18:53.479224',
      status_changed_date: '2026-03-02T05:18:53.479224',
      notes: '',
      audio: null,
      words: ['\u516d'],
      tags: [],
      hints: [
        {
          id: 10610686,
          locale: 'en',
          text: 'six',
          term: '\u516d',
          popularity: 154426,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['li\u00f9'],
        hant: ['\u516d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516d']
    },
    {
      pk: 777907274,
      url: 'https://www.lingq.com/api/v3/zh/cards/777907274/',
      term: '\u516d\u4e2a',
      fragment: '\u6211 \u5bb6 \u6709 \u516d\u4e2a \u4eba\u3002',
      importance: 1,
      status: 3,
      extended_status: 3,
      last_reviewed_correct: null,
      srs_due_date: '2039-11-09T05:20:43.349076',
      status_changed_date: '2026-03-02T05:20:43.349076',
      notes: '',
      audio: null,
      words: ['\u516d\u4e2a'],
      tags: [],
      hints: [
        {
          id: 19147746,
          locale: 'en',
          text: 'six',
          term: '\u516d\u4e2a',
          popularity: 164,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['li\u00f9 g\u00e8'],
        hant: ['\u516d\u500b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516d\u4e2a']
    },
    {
      pk: 775817636,
      url: 'https://www.lingq.com/api/v3/zh/cards/775817636/',
      term: '\u516d\u70b9',
      fragment: '\u8fc8\u514b \u6bcf\u5929 \u65e9\u6668 \u516d\u70b9 \u8d77\u5e8a',
      importance: 1,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-13T04:55:11.351126',
      status_changed_date: '2026-02-12T04:55:11.351126',
      notes: '',
      audio: null,
      words: ['\u516d\u70b9'],
      tags: [],
      hints: [
        {
          id: 15067791,
          locale: 'en',
          text: "six o'clock",
          term: '\u516d\u70b9',
          popularity: 5719,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['li\u00f9 di\u01cen'],
        hant: ['\u516d\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516d\u70b9']
    },
    {
      pk: 792383104,
      url: 'https://www.lingq.com/api/v3/zh/cards/792383104/',
      term: '\u516d\u70b9\u534a',
      fragment: '\u516d\u70b9\u534a \u600e\u4e48\u6837\uff1f',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:34:01.201277',
      status_changed_date: '2026-03-06T05:34:01.201277',
      notes: '',
      audio: null,
      words: ['\u516d\u70b9\u534a'],
      tags: [],
      hints: [
        {
          id: 13399324,
          locale: 'en',
          text: 'six thirty',
          term: '\u516d\u70b9\u534a',
          popularity: 88,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['li\u00f9 di\u01cen b\u00e0n'],
        hant: ['\u516d\u9ede\u534a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u516d\u70b9\u534a']
    },
    {
      pk: 778648685,
      url: 'https://www.lingq.com/api/v3/zh/cards/778648685/',
      term: '\u5173\u706f',
      fragment: '\u597d \u4e86\uff0c \u5173\u706f \u5427\u3002',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-17T05:20:56.736045',
      status_changed_date: '2026-03-02T05:20:56.736045',
      notes: '',
      audio: null,
      words: ['\u5173\u706f'],
      tags: [],
      hints: [
        {
          id: 91535622,
          locale: 'en',
          text: 'turn off the lights',
          term: '\u5173\u706f',
          popularity: 140,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['gu\u0101n d\u0113ng'],
        hant: ['\u95dc\u71c8']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5173\u706f']
    },
    {
      pk: 792058309,
      url: 'https://www.lingq.com/api/v3/zh/cards/792058309/',
      term: '\u5173\u95e8',
      fragment: '\u8fd9 \u5bb6 \u996d\u9986 \u51e0\u70b9 \u5173\u95e8\uff1f',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T04:25:50.930913',
      status_changed_date: '2026-03-04T04:25:50.930913',
      notes: '',
      audio: null,
      words: ['\u5173\u95e8'],
      tags: [],
      hints: [
        {
          id: 226800216,
          locale: 'en',
          text: 'close (plural)',
          term: '\u5173\u95e8',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['gu\u0101nm\u00e9n'],
        hant: ['\u95dc\u9580']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5173\u95e8']
    },
    {
      pk: 784430939,
      url: 'https://www.lingq.com/api/v3/zh/cards/784430939/',
      term: '\u5174\u594b',
      fragment: '\u2026\u5230 \u4e86\uff0c \u8fbe\u65af\u6c40 \u5f88 \u5174\u594b\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:32:59.763745',
      status_changed_date: '2026-03-06T05:32:59.763745',
      notes: '',
      audio: null,
      words: ['\u5174\u594b'],
      tags: [],
      hints: [
        {
          id: 18020512,
          locale: 'en',
          text: 'excited',
          term: '\u5174\u594b',
          popularity: 1100,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['x\u012bngf\u00e8n'],
        hant: ['\u8208\u596e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5174\u594b']
    },
    {
      pk: 777563559,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563559/',
      term: '\u518d',
      fragment: '\u518d \u8bf4 \u4e00 \u6b21\u3002',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:19:05.657903',
      status_changed_date: '2026-03-02T05:19:05.657903',
      notes: '',
      audio: null,
      words: ['\u518d'],
      tags: [],
      hints: [
        {
          id: 25903470,
          locale: 'en',
          text: 'again, once more',
          term: '\u518d',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u00e0i'],
        hant: ['\u518d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u518d']
    },
    {
      pk: 781020427,
      url: 'https://www.lingq.com/api/v3/zh/cards/781020427/',
      term: '\u518d\u6765',
      fragment: '\u518d\u6765 \u4e00 \u676f\uff01',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-17T05:21:18.323704',
      status_changed_date: '2026-03-02T05:21:18.323704',
      notes: '',
      audio: null,
      words: ['\u518d\u6765'],
      tags: [],
      hints: [
        {
          id: 103352739,
          locale: 'en',
          text: 'again',
          term: '\u518d\u6765',
          popularity: 98,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u00e0i l\u00e1i'],
        hant: ['\u518d\u4f86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u518d\u6765']
    },
    {
      pk: 777210642,
      url: 'https://www.lingq.com/api/v3/zh/cards/777210642/',
      term: '\u518d\u89c1',
      fragment: '',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:22:37.735073',
      status_changed_date: '2026-03-02T05:22:37.735073',
      notes: '',
      audio: null,
      words: ['\u518d\u89c1'],
      tags: [],
      hints: [
        {
          id: 2102499,
          locale: 'en',
          text: 'goodbye',
          term: '\u518d\u89c1',
          popularity: 555,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['z\u00e0iji\u00e0n'],
        hant: ['\u518d\u898b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u518d\u89c1']
    },
    {
      pk: 784431048,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431048/',
      term: '\u51ac\u5929',
      fragment: '\u8fd9 \u4e2a \u51ac\u5929 \u4ed6 \u53ef\u4ee5 \u4f11\u606f \u4e00\u6bb5\u2026',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-05T05:21:31.221147',
      status_changed_date: '2026-03-02T05:21:31.221147',
      notes: '',
      audio: null,
      words: ['\u51ac\u5929'],
      tags: [],
      hints: [
        {
          id: 5986619,
          locale: 'en',
          text: 'winter',
          term: '\u51ac\u5929',
          popularity: 2640,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u014dngti\u0101n'],
        hant: ['\u51ac\u5929']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51ac\u5929']
    },
    {
      pk: 782018443,
      url: 'https://www.lingq.com/api/v3/zh/cards/782018443/',
      term: '\u51af',
      fragment: '\u8bf7\u95ee \u662f \u51af \u5148\u751f \u5417\uff1f',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-05T05:18:32.855537',
      status_changed_date: '2026-03-02T05:18:32.855537',
      notes: '',
      audio: null,
      words: ['\u51af'],
      tags: [],
      hints: [
        {
          id: 94036740,
          locale: 'en',
          text: 'surname Feng',
          term: '\u51af',
          popularity: 11,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['f\u00e9ng'],
        hant: ['\u99ae']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51af']
    },
    {
      pk: 777563057,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563057/',
      term: '\u51b0',
      fragment: '\u8981 \u51b0 \u7684 \u5417\uff1f',
      importance: 1,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:22:22.113685',
      status_changed_date: '2026-03-02T05:22:22.113685',
      notes: '',
      audio: null,
      words: ['\u51b0'],
      tags: [],
      hints: [
        {
          id: 13509660,
          locale: 'en',
          text: 'ice',
          term: '\u51b0',
          popularity: 339,
          is_google_translate: true,
          flagged: false
        },
        {
          id: 162132687,
          locale: 'en',
          text: 'cold',
          term: '\u51b0',
          popularity: 10,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u012bng'],
        hant: ['\u51b0']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51b0']
    },
    {
      pk: 784784080,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784080/',
      term: '\u51b3\u5b9a',
      fragment:
        '\u4ed6 \u8fd8\u662f \u51b3\u5b9a \u5f85\u5728 \u5bb6\u91cc \u5b66\u4e60\u3001 \u7701\u94b1\u3002',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:33:25.962639',
      status_changed_date: '2026-03-06T05:33:25.962639',
      notes: '',
      audio: null,
      words: ['\u51b3\u5b9a'],
      tags: [],
      hints: [
        {
          id: 159511331,
          locale: 'en',
          text: 'decided',
          term: '\u51b3\u5b9a',
          popularity: 343,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ju\u00e9d\u00ecng'],
        hant: ['\u6c7a\u5b9a']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51b3\u5b9a']
    },
    {
      pk: 784784975,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784975/',
      term: '\u51b3\u5fc3',
      fragment:
        '\u662f\u7684\uff0c \u4ed6 \u51b3\u5fc3 \u5b66 \u6cd5\u8bed\u3001 \u7701\u94b1\u3001 \u6574\u4e2a\u2026',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-09T05:33:35.609308',
      status_changed_date: '2026-03-06T05:33:35.609308',
      notes: '',
      audio: null,
      words: ['\u51b3\u5fc3'],
      tags: [],
      hints: [
        {
          id: 13755812,
          locale: 'en',
          text: 'determination, resolution',
          term: '\u51b3\u5fc3',
          popularity: 290,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ju\u00e9x\u012bn'],
        hant: ['\u6c7a\u5fc3']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51b3\u5fc3']
    },
    {
      pk: 777215016,
      url: 'https://www.lingq.com/api/v3/zh/cards/777215016/',
      term: '\u51b7',
      fragment: '\u51b7 \u7684 \u8fd8\u662f \u70ed \u7684\uff1f',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-26T03:24:30.143630',
      status_changed_date: '2026-02-24T03:24:30.143630',
      notes: '',
      audio: null,
      words: ['\u51b7'],
      tags: [],
      hints: [
        {
          id: 13494816,
          locale: 'en',
          text: 'cold',
          term: '\u51b7',
          popularity: 1193,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['l\u011bng'],
        hant: ['\u51b7']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51b7']
    },
    {
      pk: 777210493,
      url: 'https://www.lingq.com/api/v3/zh/cards/777210493/',
      term: '\u51e0',
      fragment: '\u53bb \u51e0 \u697c',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:22:29.943902',
      status_changed_date: '2026-03-02T05:22:29.943902',
      notes: '',
      audio: null,
      words: ['\u51e0'],
      tags: [],
      hints: [
        {
          id: 13166106,
          locale: 'en',
          text: 'how many',
          term: '\u51e0',
          popularity: 507,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u012b'],
        hant: ['\u5e7e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51e0']
    },
    {
      pk: 777564108,
      url: 'https://www.lingq.com/api/v3/zh/cards/777564108/',
      term: '\u51e0\u53f7',
      fragment: '\u51e0\u53f7\uff1f',
      importance: 1,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-31T05:18:26.654402',
      status_changed_date: '2026-03-02T05:18:26.654402',
      notes: '',
      audio: null,
      words: ['\u51e0\u53f7'],
      tags: [],
      hints: [
        {
          id: 13511423,
          locale: 'en',
          text: 'A few numbers',
          term: '\u51e0\u53f7',
          popularity: 36,
          is_google_translate: true,
          flagged: false
        },
        {
          id: 16858863,
          locale: 'en',
          text: 'what date',
          term: '\u51e0\u53f7',
          popularity: 609,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u012b h\u00e0o'],
        hant: ['\u5e7e\u865f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51e0\u53f7']
    },
    {
      pk: 795224002,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224002/',
      term: '\u51e0\u6b21',
      fragment: '\u4f60 \u4ee5\u524d \u4e00\u5171 \u6765\u8fc7 \u51e0\u6b21',
      importance: 1,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:43:38.752000',
      status_changed_date: '2026-03-12T03:43:38.752000',
      notes: '',
      audio: null,
      words: ['\u51e0\u6b21'],
      tags: [],
      hints: [
        {
          id: 18832429,
          locale: 'en',
          text: 'how many times? / several times',
          term: '\u51e0\u6b21',
          popularity: 464,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u01d0c\u00ec'],
        hant: ['\u5e7e\u6b21']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51e0\u6b21']
    },
    {
      pk: 783076875,
      url: 'https://www.lingq.com/api/v3/zh/cards/783076875/',
      term: '\u51e0\u70b9',
      fragment: '\u4f60 \u51e0\u70b9 \u4e0a\u73ed\uff1f',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-19T04:19:53.294717',
      status_changed_date: '2026-03-04T04:19:53.294717',
      notes: '',
      audio: null,
      words: ['\u51e0\u70b9'],
      tags: [],
      hints: [
        {
          id: 2844553,
          locale: 'en',
          text: 'what time',
          term: '\u51e0\u70b9',
          popularity: 716,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['j\u01d0di\u01cen'],
        hant: ['\u5e7e\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51e0\u70b9']
    },
    {
      pk: 781714655,
      url: 'https://www.lingq.com/api/v3/zh/cards/781714655/',
      term: '\u51fa\u754c',
      fragment: '\u5509\uff0c \u51fa\u754c \u4e86\uff01',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:41:05.509449',
      status_changed_date: '2026-03-06T05:41:05.509449',
      notes: '',
      audio: null,
      words: ['\u51fa\u754c'],
      tags: [],
      hints: [
        {
          id: 13553810,
          locale: 'en',
          text: 'Out of bounds',
          term: '\u51fa\u754c',
          popularity: 58,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u016bji\u00e8'],
        hant: ['\u51fa\u754c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51fa\u754c']
    },
    {
      pk: 782328263,
      url: 'https://www.lingq.com/api/v3/zh/cards/782328263/',
      term: '\u51fa\u79df\u8f66',
      fragment: '\u4f60 \u597d\uff0c \u6211 \u8981 \u51fa\u79df\u8f66\u3002',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-19T04:19:15.597169',
      status_changed_date: '2026-03-04T04:19:15.597169',
      notes: '',
      audio: null,
      words: ['\u51fa\u79df\u8f66'],
      tags: [],
      hints: [
        {
          id: 9890436,
          locale: 'en',
          text: 'Taxi',
          term: '\u51fa\u79df\u8f66',
          popularity: 22,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u016bz\u016bch\u0113'],
        hant: ['\u51fa\u79df\u8eca']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u51fa\u79df\u8f66']
    },
    {
      pk: 776514770,
      url: 'https://www.lingq.com/api/v3/zh/cards/776514770/',
      term: '\u5200',
      fragment: '',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-06-02T04:23:34.641611',
      status_changed_date: '2026-03-04T04:23:34.641611',
      notes: '',
      audio: null,
      words: ['\u5200'],
      tags: [],
      hints: [
        {
          id: 18704783,
          locale: 'en',
          text: 'knife',
          term: '\u5200',
          popularity: 212,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u0101o'],
        hant: ['\u5200']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5200']
    },
    {
      pk: 785461508,
      url: 'https://www.lingq.com/api/v3/zh/cards/785461508/',
      term: '\u5218',
      fragment: '\u6211 \u53eb \u5218 \u4eac \u4eac\u3002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-07T05:41:41.345798',
      status_changed_date: '2026-03-06T05:41:41.345798',
      notes: '',
      audio: null,
      words: ['\u5218'],
      tags: [],
      hints: [
        {
          id: 78822139,
          locale: 'en',
          text: 'Liu (name)',
          term: '\u5218',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['li\u00fa'],
        hant: ['\u5289']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5218']
    },
    {
      pk: 776515168,
      url: 'https://www.lingq.com/api/v3/zh/cards/776515168/',
      term: '\u521a\u521a',
      fragment: '',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-09T05:32:58.800624',
      status_changed_date: '2026-03-06T05:32:58.800624',
      notes: '',
      audio: null,
      words: ['\u521a\u521a'],
      tags: [],
      hints: [
        {
          id: 226996881,
          locale: 'en',
          text: 'just now; a moment ago',
          term: '\u521a\u521a',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u0101nggang'],
        hant: ['\u525b\u525b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u521a\u521a']
    },
    {
      pk: 775819988,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819988/',
      term: '\u522b',
      fragment: '\u522b \u6dd8\u6c14',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-03T04:23:48.817869',
      status_changed_date: '2026-03-04T04:23:48.817869',
      notes: '',
      audio: null,
      words: ['\u522b'],
      tags: [],
      hints: [
        {
          id: 38086716,
          locale: 'en',
          text: "don't",
          term: '\u522b',
          popularity: 465,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['bi\u00e9'],
        hant: ['\u5225']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u522b']
    },
    {
      pk: 776889248,
      url: 'https://www.lingq.com/api/v3/zh/cards/776889248/',
      term: '\u522b\u6015',
      fragment: '\u522b\u6015 \uff0c\u6ca1\u4e8b \u7684',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-17T06:02:05.943497',
      status_changed_date: '2026-02-02T06:02:05.943497',
      notes: '',
      audio: null,
      words: ['\u522b\u6015'],
      tags: [],
      hints: [
        {
          id: 160575360,
          locale: 'en',
          text: "Don't be afraid",
          term: '\u522b\u6015',
          popularity: 39,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['bi\u00e9 p\u00e0'],
        hant: ['\u5225\u6015']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u522b\u6015']
    },
    {
      pk: 775822211,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822211/',
      term: '\u5230',
      fragment: '\u5bc4 \u5230 \u54ea\u91cc',
      importance: 3,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-11T02:09:48.252165',
      status_changed_date: '2026-03-10T02:09:48.252165',
      notes: '',
      audio: null,
      words: ['\u5230'],
      tags: [],
      hints: [
        {
          id: 15077498,
          locale: 'en',
          text: 'arrive, reach, get to.',
          term: '\u5230',
          popularity: 73,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e0o'],
        hant: ['\u5230']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5230']
    },
    {
      pk: 784784493,
      url: 'https://www.lingq.com/api/v3/zh/cards/784784493/',
      term: '\u5230\u4e86',
      fragment:
        '\u662f\u7684\uff0c \u5bd2\u5047 \u5230\u4e86\uff0c \u8fbe\u65af\u6c40 \u5f88 \u5174\u594b\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:23:57.543085',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5230\u4e86'],
      tags: [],
      hints: [
        {
          id: 182793569,
          locale: 'en',
          text: 'has arrived',
          term: '\u5230\u4e86',
          popularity: 219,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['d\u00e0oli\u01ceo'],
        hant: ['\u5230\u4e86']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5230\u4e86']
    },
    {
      pk: 780704904,
      url: 'https://www.lingq.com/api/v3/zh/cards/780704904/',
      term: '\u524d\u9762',
      fragment: '\u5728 \u524d\u9762\u3002',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-09T05:38:12.432232',
      status_changed_date: '2026-03-06T05:38:12.432232',
      notes: '',
      audio: null,
      words: ['\u524d\u9762'],
      tags: [],
      hints: [
        {
          id: 13473633,
          locale: 'en',
          text: 'front',
          term: '\u524d\u9762',
          popularity: 1629,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['qi\u00e1nmi\u00e0n'],
        hant: ['\u524d\u9762']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u524d\u9762']
    },
    {
      pk: 776888804,
      url: 'https://www.lingq.com/api/v3/zh/cards/776888804/',
      term: '\u529e',
      fragment: '\u90a3 \u600e\u4e48 \u529e \u5462',
      importance: 2,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-06-04T05:33:25.959036',
      status_changed_date: '2026-03-06T05:33:25.959036',
      notes: '',
      audio: null,
      words: ['\u529e'],
      tags: [],
      hints: [
        {
          id: 13514634,
          locale: 'en',
          text: 'do',
          term: '\u529e',
          popularity: 126,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u00e0n'],
        hant: ['\u8fa6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u529e']
    },
    {
      pk: 776514776,
      url: 'https://www.lingq.com/api/v3/zh/cards/776514776/',
      term: '\u52fa\u5b50',
      fragment: '',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-15T04:21:37.825546',
      status_changed_date: '2026-01-31T04:21:37.825546',
      notes: '',
      audio: null,
      words: ['\u52fa\u5b50'],
      tags: [],
      hints: [
        {
          id: 4576253,
          locale: 'en',
          text: 'spoon',
          term: '\u52fa\u5b50',
          popularity: 303,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00e1ozi'],
        hant: ['\u52fa\u5b50']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u52fa\u5b50']
    },
    {
      pk: 776159597,
      url: 'https://www.lingq.com/api/v3/zh/cards/776159597/',
      term: '\u5317\u4eac',
      fragment: '\u4f60 \u662f \u5317\u4eac \u4eba \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-12T02:00:29.701285',
      status_changed_date: '2026-01-28T02:00:29.701285',
      notes: '',
      audio: null,
      words: ['\u5317\u4eac'],
      tags: [],
      hints: [
        {
          id: 47293473,
          locale: 'en',
          text: 'Beijing',
          term: '\u5317\u4eac',
          popularity: 689,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['b\u011bij\u012bng'],
        hant: ['\u5317\u4eac']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5317\u4eac']
    },
    {
      pk: 792058379,
      url: 'https://www.lingq.com/api/v3/zh/cards/792058379/',
      term: '\u5341\u4e00\u70b9',
      fragment: '\u8fd9 \u5bb6 \u996d\u9986 \u5341\u4e00\u70b9 \u5173\u95e8\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T05:07:04.736993',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5341\u4e00\u70b9'],
      tags: [],
      hints: [
        {
          id: 36561630,
          locale: 'en',
          text: "eleven o'clock",
          term: '\u5341\u4e00\u70b9',
          popularity: 72,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00ed y\u012b di\u01cen'],
        hant: ['\u5341\u4e00\u9ede']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5341\u4e00\u70b9']
    },
    {
      pk: 777564129,
      url: 'https://www.lingq.com/api/v3/zh/cards/777564129/',
      term: '\u5341\u4e03',
      fragment: '\u5341\u4e03 \u53f7\u3002',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-16T03:48:29.945421',
      status_changed_date: '2026-02-01T03:48:29.945421',
      notes: '',
      audio: null,
      words: ['\u5341\u4e03'],
      tags: [],
      hints: [
        {
          id: 12936941,
          locale: 'en',
          text: 'Seventeen',
          term: '\u5341\u4e03',
          popularity: 369,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00edq\u012b'],
        hant: ['\u5341\u4e03']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5341\u4e03']
    },
    {
      pk: 778647663,
      url: 'https://www.lingq.com/api/v3/zh/cards/778647663/',
      term: '\u5341\u56db',
      fragment: '\u5341\u56db \u5757 \u94b1\u3002',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:09:22.728047',
      status_changed_date: '2026-02-05T05:09:22.728047',
      notes: '',
      audio: null,
      words: ['\u5341\u56db'],
      tags: [],
      hints: [
        {
          id: 13746498,
          locale: 'en',
          text: 'fourteen',
          term: '\u5341\u56db',
          popularity: 144,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00eds\u00ec'],
        hant: ['\u5341\u56db']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5341\u56db']
    },
    {
      pk: 780326563,
      url: 'https://www.lingq.com/api/v3/zh/cards/780326563/',
      term: '\u5341\u6708',
      fragment: '\u5341\u6708 \u5417\uff1f',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:49:03.340439',
      status_changed_date: '2026-02-01T03:49:03.340439',
      notes: '',
      audio: null,
      words: ['\u5341\u6708'],
      tags: [],
      hints: [
        {
          id: 13166111,
          locale: 'en',
          text: 'October',
          term: '\u5341\u6708',
          popularity: 229,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['sh\u00edyu\u00e8'],
        hant: ['\u5341\u6708']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5341\u6708']
    },
    {
      pk: 775453561,
      url: 'https://www.lingq.com/api/v3/zh/cards/775453561/',
      term: '\u5357\u4eac',
      fragment: '\u5979 \u4f4f \u5728 \u5357\u4eac\u3002',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-23T05:37:45.317617',
      status_changed_date: '2026-02-08T05:37:45.317617',
      notes: '',
      audio: null,
      words: ['\u5357\u4eac'],
      tags: [],
      hints: [
        {
          id: 5297065,
          locale: 'en',
          text: 'Nanjing',
          term: '\u5357\u4eac',
          popularity: 505,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u00e1nj\u012bng'],
        hant: ['\u5357\u4eac']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5357\u4eac']
    },
    {
      pk: 776888362,
      url: 'https://www.lingq.com/api/v3/zh/cards/776888362/',
      term: '\u536b\u751f',
      fragment: '\u4e0d \u536b\u751f',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T05:39:17.415104',
      status_changed_date: '2026-02-08T05:39:17.415104',
      notes: '',
      audio: null,
      words: ['\u536b\u751f'],
      tags: [],
      hints: [
        {
          id: 160046313,
          locale: 'en',
          text: 'hygienic',
          term: '\u536b\u751f',
          popularity: 172,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e8ish\u0113ng'],
        hant: ['\u885b\u751f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u536b\u751f']
    },
    {
      pk: 780705974,
      url: 'https://www.lingq.com/api/v3/zh/cards/780705974/',
      term: '\u5371\u9669',
      fragment: '\u5371\u9669\uff01',
      importance: 2,
      status: 0,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:22:46.433006',
      status_changed_date: '2026-02-07T04:22:46.433006',
      notes: '',
      audio: null,
      words: ['\u5371\u9669'],
      tags: [],
      hints: [
        {
          id: 18594259,
          locale: 'en',
          text: 'danger',
          term: '\u5371\u9669',
          popularity: 150,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u0113ixi\u01cen'],
        hant: ['\u5371\u96aa']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5371\u9669']
    },
    {
      pk: 775817310,
      url: 'https://www.lingq.com/api/v3/zh/cards/775817310/',
      term: '\u53a8\u5e08',
      fragment: 'a -\u8fc8\u514b \u662f \u4e2a \u53a8\u5e08 ,\u7b2c\u4e00 \u90e8\u5206',
      importance: 1,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:52:05.885103',
      status_changed_date: '2026-02-01T03:52:05.885103',
      notes: '',
      audio: null,
      words: ['\u53a8\u5e08'],
      tags: [],
      hints: [],
      transliteration: {
        pinyin: ['ch\u00fash\u012b'],
        hant: ['\u5eda\u5e2b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53a8\u5e08']
    },
    {
      pk: 777214192,
      url: 'https://www.lingq.com/api/v3/zh/cards/777214192/',
      term: '\u53bb',
      fragment: '\u53bb \u51e0 \u697c',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-20T05:10:14.381988',
      status_changed_date: '2026-02-05T05:10:14.381988',
      notes: '',
      audio: null,
      words: ['\u53bb'],
      tags: [],
      hints: [
        {
          id: 32444258,
          locale: 'en',
          text: 'to go',
          term: '\u53bb',
          popularity: 145,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['q\u00f9'],
        hant: ['\u53bb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53bb']
    },
    {
      pk: 776514665,
      url: 'https://www.lingq.com/api/v3/zh/cards/776514665/',
      term: '\u53c9\u5b50',
      fragment: '\u670d\u52a1\u5458 \uff0c\u6709 \u53c9\u5b50 \u5417',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T05:10:08.281631',
      status_changed_date: '2026-02-05T05:10:08.281631',
      notes: '',
      audio: null,
      words: ['\u53c9\u5b50'],
      tags: [],
      hints: [
        {
          id: 13782289,
          locale: 'en',
          text: 'fork',
          term: '\u53c9\u5b50',
          popularity: 370,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u0101zi'],
        hant: ['\u53c9\u5b50']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53c9\u5b50']
    },
    {
      pk: 782708661,
      url: 'https://www.lingq.com/api/v3/zh/cards/782708661/',
      term: '\u53c9\u70e7',
      fragment: '\u53c9\u70e7',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T05:15:15.115586',
      status_changed_date: '2026-02-05T05:15:15.115586',
      notes: '',
      audio: null,
      words: ['\u53c9\u70e7'],
      tags: [],
      hints: [
        {
          id: 21438507,
          locale: 'en',
          text: 'barbeque spare ribs',
          term: '\u53c9\u70e7',
          popularity: 28,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u0101sh\u0101o'],
        hant: ['\u53c9\u71d2']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53c9\u70e7']
    },
    {
      pk: 783752868,
      url: 'https://www.lingq.com/api/v3/zh/cards/783752868/',
      term: '\u53cb\u597d',
      fragment: '\u2026\u53ef\u4ee5 \u9047\u5230 \u5f88 \u591a \u53cb\u597d \u7684 \u4eba\u3002',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:21:17.135912',
      status_changed_date: '2026-02-07T04:21:17.135912',
      notes: '',
      audio: null,
      words: ['\u53cb\u597d'],
      tags: [],
      hints: [
        {
          id: 212054629,
          locale: 'en',
          text: 'friendly',
          term: '\u53cb\u597d',
          popularity: 546,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u01d2uh\u01ceo'],
        hant: ['\u53cb\u597d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53cb\u597d']
    },
    {
      pk: 781713472,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713472/',
      term: '\u53d1\u7403',
      fragment: '\u2026\u6253 \u4e0d\u597d\uff0c \u4f60 \u6765 \u53d1\u7403 \u5427\u3002',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-10T04:19:08.750318',
      status_changed_date: '2026-02-07T04:19:08.750318',
      notes: '',
      audio: null,
      words: ['\u53d1\u7403'],
      tags: [],
      hints: [
        {
          id: 224154659,
          locale: 'en',
          text: 'serve (a ball)',
          term: '\u53d1\u7403',
          popularity: 1,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['f\u0101qi\u00fa'],
        hant: ['\u767c\u7403']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53d1\u7403']
    },
    {
      pk: 795224810,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224810/',
      term: '\u53ea',
      fragment: '\u901a\u5e38 \u6211 \u53ea \u559d \u4e00\u676f \u5564\u9152',
      importance: 3,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:49:11.923000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u53ea'],
      tags: [],
      hints: [
        {
          id: 13618727,
          locale: 'en',
          text: 'only',
          term: '\u53ea',
          popularity: 174921,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u01d0'],
        hant: ['\u53ea']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53ea']
    },
    {
      pk: 775450999,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450999/',
      term: '\u53eb',
      fragment: '\u4f60 \u53eb \u4ec0\u4e48 \u540d\u5b57\uff1f',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T03:10:17.864730',
      status_changed_date: '2026-01-12T03:10:17.864730',
      notes: '',
      audio: null,
      words: ['\u53eb'],
      tags: [],
      hints: [
        {
          id: 5714441,
          locale: 'en',
          text: 'called',
          term: '\u53eb',
          popularity: 667,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ji\u00e0o'],
        hant: ['\u53eb']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53eb']
    },
    {
      pk: 781713430,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713430/',
      term: '\u53ef',
      fragment:
        '\u5475\u5475\uff0c \u7fbd\u6bdb\u7403 \u6211 \u53ef \u6253 \u4e0d\u597d\uff0c \u4f60 \u6765\u2026',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:27.311345',
      status_changed_date: '2026-02-06T03:33:27.311345',
      notes: '',
      audio: null,
      words: ['\u53ef'],
      tags: [],
      hints: [
        {
          id: 13414868,
          locale: 'en',
          text: 'can',
          term: '\u53ef',
          popularity: 157,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u011b'],
        hant: ['\u53ef']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53ef']
    },
    {
      pk: 779979611,
      url: 'https://www.lingq.com/api/v3/zh/cards/779979611/',
      term: '\u53ef\u4e50',
      fragment: '\u6709 \u6ca1\u6709 \u53ef\u4e50\uff1f',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:51:24.474348',
      status_changed_date: '2026-02-01T03:51:24.474348',
      notes: '',
      audio: null,
      words: ['\u53ef\u4e50'],
      tags: [],
      hints: [
        {
          id: 19432265,
          locale: 'en',
          text: 'Coke, Coca-cola',
          term: '\u53ef\u4e50',
          popularity: 41,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u011bl\u00e8'],
        hant: ['\u53ef\u6a02']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53ef\u4e50']
    },
    {
      pk: 775820288,
      url: 'https://www.lingq.com/api/v3/zh/cards/775820288/',
      term: '\u53ef\u4ee5',
      fragment: '\u9e21\u86cb \u53ef\u4ee5',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-05-02T03:51:59.691622',
      status_changed_date: '2026-02-01T03:51:59.691622',
      notes: '',
      audio: null,
      words: ['\u53ef\u4ee5'],
      tags: [],
      hints: [
        {
          id: 15996069,
          locale: 'en',
          text: 'can',
          term: '\u53ef\u4ee5',
          popularity: 2285,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u011by\u01d0'],
        hant: ['\u53ef\u4ee5']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53ef\u4ee5']
    },
    {
      pk: 784431370,
      url: 'https://www.lingq.com/api/v3/zh/cards/784431370/',
      term: '\u53ef\u662f',
      fragment: '\u53ef\u662f\uff0c \u4ed6 \u4e0d \u77e5\u9053 \u53bb\u2026',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:59:05.933626',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u53ef\u662f'],
      tags: [],
      hints: [
        {
          id: 15053463,
          locale: 'en',
          text: 'but, however',
          term: '\u53ef\u662f',
          popularity: 754156,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u011bsh\u00ec'],
        hant: ['\u53ef\u662f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53ef\u662f']
    },
    {
      pk: 780705005,
      url: 'https://www.lingq.com/api/v3/zh/cards/780705005/',
      term: '\u53f3',
      fragment: '\u4e00\u76f4 \u8d70\uff0c \u53f3 \u8f6c\u3002',
      importance: 2,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:31:31.598053',
      status_changed_date: '2026-02-06T03:31:31.598053',
      notes: '',
      audio: null,
      words: ['\u53f3'],
      tags: [],
      hints: [
        {
          id: 72384841,
          locale: 'en',
          text: 'the right side; to the right',
          term: '\u53f3',
          popularity: 16,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u00f2u'],
        hant: ['\u53f3']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53f3']
    },
    {
      pk: 791709634,
      url: 'https://www.lingq.com/api/v3/zh/cards/791709634/',
      term: '\u53f3\u9762',
      fragment:
        '\u5728 \u90a3\u8fb9\uff0c \u53f3\u9762\uff0c \u90a3\u680b \u9ad8\u697c \u9644\u8fd1\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-02T04:03:44.228490',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u53f3\u9762'],
      tags: [],
      hints: [
        {
          id: 19033396,
          locale: 'en',
          text: 'right side',
          term: '\u53f3\u9762',
          popularity: 171,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['y\u00f2u mi\u00e0n'],
        hant: ['\u53f3\u9762']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53f3\u9762']
    },
    {
      pk: 775819419,
      url: 'https://www.lingq.com/api/v3/zh/cards/775819419/',
      term: '\u53f7',
      fragment: '\u662f \u5357\u4eac \u8def \u4e00\u767e\u4e09\u5341\u4e94 \u53f7',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-11T04:41:01.571690',
      status_changed_date: '2026-01-27T04:41:01.571690',
      notes: '',
      audio: null,
      words: ['\u53f7'],
      tags: [],
      hints: [
        {
          id: 13502180,
          locale: 'en',
          text: 'number',
          term: '\u53f7',
          popularity: 602,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u00e0o'],
        hant: ['\u865f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53f7']
    },
    {
      pk: 777563442,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563442/',
      term: '\u53f7\u7801',
      fragment: '\u4f60 \u7684 \u53f7\u7801 \u662f \u591a\u5c11\uff1f',
      importance: 1,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-17T06:03:37.175457',
      status_changed_date: '2026-02-02T06:03:37.175457',
      notes: '',
      audio: null,
      words: ['\u53f7\u7801'],
      tags: [],
      hints: [
        {
          id: 13489022,
          locale: 'en',
          text: 'number',
          term: '\u53f7\u7801',
          popularity: 1056,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u00e0om\u01ce'],
        hant: ['\u865f\u78bc']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u53f7\u7801']
    },
    {
      pk: 775820186,
      url: 'https://www.lingq.com/api/v3/zh/cards/775820186/',
      term: '\u5403',
      fragment: '\u6709 \u4ec0\u4e48 \u4e1c\u897f \u4e0d \u5403 \u5417',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-25T02:09:56.981111',
      status_changed_date: '2026-03-10T02:09:56.981111',
      notes: '',
      audio: null,
      words: ['\u5403'],
      tags: [],
      hints: [
        {
          id: 5563911,
          locale: 'en',
          text: 'eat',
          term: '\u5403',
          popularity: 2416,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u012b'],
        hant: ['\u5403']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5403']
    },
    {
      pk: 775820234,
      url: 'https://www.lingq.com/api/v3/zh/cards/775820234/',
      term: '\u5403\u7d20',
      fragment: '\u4e0d \u5403 \u8089 \uff0c\u6211 \u5403\u7d20',
      importance: 1,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T06:03:16.910922',
      status_changed_date: '2026-02-02T06:03:16.910922',
      notes: '',
      audio: null,
      words: ['\u5403\u7d20'],
      tags: [],
      hints: [
        {
          id: 160227013,
          locale: 'en',
          text: 'eat vegetarian',
          term: '\u5403\u7d20',
          popularity: 45,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u012bs\u00f9'],
        hant: ['\u5403\u7d20']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5403\u7d20']
    },
    {
      pk: 776512581,
      url: 'https://www.lingq.com/api/v3/zh/cards/776512581/',
      term: '\u5403\u8fc7',
      fragment: '',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-16T03:50:49.764611',
      status_changed_date: '2026-02-01T03:50:49.764611',
      notes: '',
      audio: null,
      words: ['\u5403\u8fc7'],
      tags: [],
      hints: [
        {
          id: 99641730,
          locale: 'en',
          text: 'have eaten',
          term: '\u5403\u8fc7',
          popularity: 54,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ch\u012b gu\u00f2'],
        hant: ['\u5403\u904e']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5403\u8fc7']
    },
    {
      pk: 795224737,
      url: 'https://www.lingq.com/api/v3/zh/cards/795224737/',
      term: '\u5408\u9002',
      fragment: '\u4e86 \uff0c\u6211 \u73b0\u5728 \u6b63 \u5408\u9002',
      importance: 2,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-13T03:48:51.687000',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5408\u9002'],
      tags: [],
      hints: [
        {
          id: 7642259,
          locale: 'en',
          text: 'suitable',
          term: '\u5408\u9002',
          popularity: 288,
          is_google_translate: false,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['h\u00e9sh\u00ec'],
        hant: ['\u5408\u9069']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5408\u9002']
    },
    {
      pk: 777212970,
      url: 'https://www.lingq.com/api/v3/zh/cards/777212970/',
      term: '\u540c',
      fragment: '\u4e0d\u540c \u7684 \u65b9\u5f0f \u8bb2\u8ff0 \u540c \u4e00 \u4e2a \u6545\u4e8b',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-23T05:39:07.572298',
      status_changed_date: '2026-02-08T05:39:07.572298',
      notes: '',
      audio: null,
      words: ['\u540c'],
      tags: [],
      hints: [
        {
          id: 159942798,
          locale: 'en',
          text: 'the same',
          term: '\u540c',
          popularity: 384,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00f3ng'],
        hant: ['\u540c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u540c']
    },
    {
      pk: 784073044,
      url: 'https://www.lingq.com/api/v3/zh/cards/784073044/',
      term: '\u540c\u4e00\u4e2a',
      fragment:
        '\u2026\u4e0d \u662f \u6765\u81ea \u4e8e \u540c\u4e00\u4e2a \u56fd\u5bb6\uff0c \u4ed6\u4eec \u6765\u81ea \u5f88\u591a\u2026',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T05:37:47.258472',
      status_changed_date: '2026-02-08T05:37:47.258472',
      notes: '',
      audio: null,
      words: ['\u540c\u4e00\u4e2a'],
      tags: [],
      hints: [
        {
          id: 2875409,
          locale: 'en',
          text: 'one and the same,  the same that',
          term: '\u540c\u4e00\u4e2a',
          popularity: 282646,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00f3ng y\u012b g\u00e8'],
        hant: ['\u540c\u4e00\u500b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u540c\u4e00\u4e2a']
    },
    {
      pk: 775451154,
      url: 'https://www.lingq.com/api/v3/zh/cards/775451154/',
      term: '\u540d\u5b57',
      fragment: '\u4f60 \u53eb \u4ec0\u4e48 \u540d\u5b57\uff1f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-15T04:25:57.208318',
      status_changed_date: '2026-01-31T04:25:57.208318',
      notes: '',
      audio: null,
      words: ['\u540d\u5b57'],
      tags: [],
      hints: [
        {
          id: 10256515,
          locale: 'en',
          text: 'name',
          term: '\u540d\u5b57',
          popularity: 179453,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['m\u00edngzi'],
        hant: ['\u540d\u5b57']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u540d\u5b57']
    },
    {
      pk: 791709084,
      url: 'https://www.lingq.com/api/v3/zh/cards/791709084/',
      term: '\u5411\u524d',
      fragment: '\u4e00\u76f4 \u5411\u524d \u8d70\u3002',
      importance: 1,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-02T04:00:47.329229',
      status_changed_date: null,
      notes: '',
      audio: null,
      words: ['\u5411\u524d'],
      tags: [],
      hints: [
        {
          id: 12363759,
          locale: 'en',
          text: 'forward',
          term: '\u5411\u524d',
          popularity: 384,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u00e0ngqi\u00e1n'],
        hant: ['\u5411\u524d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5411\u524d']
    },
    {
      pk: 775451509,
      url: 'https://www.lingq.com/api/v3/zh/cards/775451509/',
      term: '\u5417',
      fragment: '\u4ed6 \u6709 \u54e5\u54e5 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-28T01:59:34.462282',
      status_changed_date: '2026-01-28T01:59:34.462282',
      notes: '',
      audio: null,
      words: ['\u5417'],
      tags: [],
      hints: [
        {
          id: 172137869,
          locale: 'en',
          text: 'question marker',
          term: '\u5417',
          popularity: 220928,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ma'],
        hant: ['\u55ce']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5417']
    },
    {
      pk: 776511081,
      url: 'https://www.lingq.com/api/v3/zh/cards/776511081/',
      term: '\u5427',
      fragment: '\u6765 \uff0c\u5531\u6b4c \u5427',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-16T22:38:51.246869',
      status_changed_date: '2026-03-13T22:38:51.246869',
      notes: '',
      audio: null,
      words: ['\u5427'],
      tags: [],
      hints: [
        {
          id: 88813511,
          locale: 'en',
          text: 'suggestion particle',
          term: '\u5427',
          popularity: 128,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ba'],
        hant: ['\u5427']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5427']
    },
    {
      pk: 782019949,
      url: 'https://www.lingq.com/api/v3/zh/cards/782019949/',
      term: '\u542c',
      fragment: '\u542c \u4e0d \u89c1\uff0c \u6211 \u5728\u2026',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:46.563514',
      status_changed_date: '2026-02-06T03:33:46.563514',
      notes: '',
      audio: null,
      words: ['\u542c'],
      tags: [],
      hints: [
        {
          id: 38204742,
          locale: 'en',
          text: 'hear',
          term: '\u542c',
          popularity: 84,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u00ecng'],
        hant: ['\u807d']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u542c']
    },
    {
      pk: 778647914,
      url: 'https://www.lingq.com/api/v3/zh/cards/778647914/',
      term: '\u542c\u9519',
      fragment: '\u54e6\uff0c \u542c\u9519 \u4e86\uff01',
      importance: 0,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-23T05:39:10.953499',
      status_changed_date: '2026-02-08T05:39:10.953499',
      notes: '',
      audio: null,
      words: ['\u542c\u9519'],
      tags: [],
      hints: [
        {
          id: 91293597,
          locale: 'en',
          text: 'misheard',
          term: '\u542c\u9519',
          popularity: 33,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['t\u012bngcu\u00f2'],
        hant: ['\u807d\u932f']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u542c\u9519']
    },
    {
      pk: 778652727,
      url: 'https://www.lingq.com/api/v3/zh/cards/778652727/',
      term: '\u5440',
      fragment:
        '\u65b0\u5e74 \u597d \u5440\uff0c \u65b0\u5e74 \u597d \u5440\uff0c \u795d\u8d3a\u2026',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:48:23.876589',
      status_changed_date: '2026-02-01T03:48:23.876589',
      notes: '',
      audio: null,
      words: ['\u5440'],
      tags: [],
      hints: [
        {
          id: 185836534,
          locale: 'en',
          text: 'emphasis marker',
          term: '\u5440',
          popularity: 144,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ya'],
        hant: ['\u5440']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5440']
    },
    {
      pk: 780326595,
      url: 'https://www.lingq.com/api/v3/zh/cards/780326595/',
      term: '\u544a\u8bc9',
      fragment: '\u4e0d \u544a\u8bc9 \u4f60\uff01',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:51:13.470964',
      status_changed_date: '2026-02-01T03:51:13.470964',
      notes: '',
      audio: null,
      words: ['\u544a\u8bc9'],
      tags: [],
      hints: [
        {
          id: 7479627,
          locale: 'en',
          text: 'tell',
          term: '\u544a\u8bc9',
          popularity: 2638,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u00e0osu'],
        hant: ['\u544a\u8a34']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u544a\u8bc9']
    },
    {
      pk: 779644665,
      url: 'https://www.lingq.com/api/v3/zh/cards/779644665/',
      term: '\u545c',
      fragment: '\u545c \u545c\u545c......',
      importance: 0,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T05:14:20.949349',
      status_changed_date: '2026-02-05T05:14:20.949349',
      notes: '',
      audio: null,
      words: ['\u545c'],
      tags: [],
      hints: [
        {
          id: 160113745,
          locale: 'en',
          text: 'wail',
          term: '\u545c',
          popularity: 54,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u016b'],
        hant: ['\u55da']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u545c']
    },
    {
      pk: 779644674,
      url: 'https://www.lingq.com/api/v3/zh/cards/779644674/',
      term: '\u545c\u545c',
      fragment: '\u545c \u545c\u545c......',
      importance: 0,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-12T05:15:22.758631',
      status_changed_date: '2026-02-05T05:15:22.758631',
      notes: '',
      audio: null,
      words: ['\u545c\u545c'],
      tags: [],
      hints: [
        {
          id: 186588699,
          locale: 'en',
          text: 'sobbing',
          term: '\u545c\u545c',
          popularity: 51,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u016bw\u016b'],
        hant: ['\u55da\u55da']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u545c\u545c']
    },
    {
      pk: 775450788,
      url: 'https://www.lingq.com/api/v3/zh/cards/775450788/',
      term: '\u5462',
      fragment: '\u4f60 \u5462\uff1f',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:51:21.451345',
      status_changed_date: '2026-02-01T03:51:21.451345',
      notes: '',
      audio: null,
      words: ['\u5462'],
      tags: [],
      hints: [
        {
          id: 14354311,
          locale: 'en',
          text: 'question particle',
          term: '\u5462',
          popularity: 348,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['ne'],
        hant: ['\u5462']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5462']
    },
    {
      pk: 781021339,
      url: 'https://www.lingq.com/api/v3/zh/cards/781021339/',
      term: '\u5468\u672b',
      fragment: '\u4f60 \u5468\u672b \u5e72 \u5417\uff1f',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:33:29.880262',
      status_changed_date: '2026-02-06T03:33:29.880262',
      notes: '',
      audio: null,
      words: ['\u5468\u672b'],
      tags: [],
      hints: [
        {
          id: 1897941,
          locale: 'en',
          text: 'weekend',
          term: '\u5468\u672b',
          popularity: 2253,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['zh\u014dum\u00f2'],
        hant: ['\u5468\u672b']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5468\u672b']
    },
    {
      pk: 778250696,
      url: 'https://www.lingq.com/api/v3/zh/cards/778250696/',
      term: '\u5473\u7cbe',
      fragment: '\u8bf7 \u4e0d\u8981 \u653e \u5473\u7cbe\u3002',
      importance: 0,
      status: 0,
      extended_status: null,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T04:19:35.772929',
      status_changed_date: '2026-02-07T04:19:35.772929',
      notes: '',
      audio: null,
      words: ['\u5473\u7cbe'],
      tags: [],
      hints: [
        {
          id: 20291591,
          locale: 'en',
          text: 'monosodium glutamate (MSG)',
          term: '\u5473\u7cbe',
          popularity: 48,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u00e8ij\u012bng'],
        hant: ['\u5473\u7cbe']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5473\u7cbe']
    },
    {
      pk: 781713398,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713398/',
      term: '\u5475\u5475',
      fragment: '\u5475\u5475\uff0c \u7fbd\u6bdb\u7403 \u6211 \u53ef \u6253\u2026',
      importance: 1,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-12T05:14:22.648585',
      status_changed_date: '2026-02-05T05:14:22.648585',
      notes: '',
      audio: null,
      words: ['\u5475\u5475'],
      tags: [],
      hints: [
        {
          id: 160888583,
          locale: 'en',
          text: 'hehe',
          term: '\u5475\u5475',
          popularity: 48,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['h\u0113h\u0113'],
        hant: ['\u5475\u5475']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5475\u5475']
    },
    {
      pk: 775818544,
      url: 'https://www.lingq.com/api/v3/zh/cards/775818544/',
      term: '\u548c',
      fragment: '\u7279\u522b \u662f \u4e2d\u56fd \u6587\u5316 \u548c \u8bed\u8a00',
      importance: 3,
      status: 3,
      extended_status: 1,
      last_reviewed_correct: null,
      srs_due_date: '2026-03-03T03:53:56.200350',
      status_changed_date: '2026-02-01T03:53:56.200350',
      notes: '',
      audio: null,
      words: ['\u548c'],
      tags: [],
      hints: [
        {
          id: 4974100,
          locale: 'en',
          text: 'and',
          term: '\u548c',
          popularity: 536,
          is_google_translate: true,
          flagged: true
        }
      ],
      transliteration: {
        pinyin: ['h\u00e9'],
        hant: ['\u548c']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u548c']
    },
    {
      pk: 777213883,
      url: 'https://www.lingq.com/api/v3/zh/cards/777213883/',
      term: '\u5496\u5561',
      fragment: '\u65e9\u996d \u5e76 \u559d \u4e00\u676f \u5496\u5561',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-15T04:26:07.654928',
      status_changed_date: '2026-01-31T04:26:07.654928',
      notes: '',
      audio: null,
      words: ['\u5496\u5561'],
      tags: [],
      hints: [
        {
          id: 14409242,
          locale: 'en',
          text: 'coffee',
          term: '\u5496\u5561',
          popularity: 353661,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u0101f\u0113i'],
        hant: ['\u5496\u5561']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5496\u5561']
    },
    {
      pk: 778249206,
      url: 'https://www.lingq.com/api/v3/zh/cards/778249206/',
      term: '\u54c7',
      fragment: '\u54c7\uff01',
      importance: 1,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:31:44.634049',
      status_changed_date: '2026-02-06T03:31:44.634049',
      notes: '',
      audio: null,
      words: ['\u54c7'],
      tags: [],
      hints: [
        {
          id: 13574826,
          locale: 'en',
          text: 'Wow',
          term: '\u54c7',
          popularity: 477,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['w\u0101'],
        hant: ['\u54c7']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54c7']
    },
    {
      pk: 777564354,
      url: 'https://www.lingq.com/api/v3/zh/cards/777564354/',
      term: '\u54cd',
      fragment: '\u8c01 \u7684 \u624b\u673a \u5728 \u54cd\uff1f',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-12T05:14:08.904219',
      status_changed_date: '2026-02-05T05:14:08.904219',
      notes: '',
      audio: null,
      words: ['\u54cd'],
      tags: [],
      hints: [
        {
          id: 13438892,
          locale: 'en',
          text: 'ring',
          term: '\u54cd',
          popularity: 154,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['xi\u01ceng'],
        hant: ['\u97ff']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54cd']
    },
    {
      pk: 777563877,
      url: 'https://www.lingq.com/api/v3/zh/cards/777563877/',
      term: '\u54ce\u5440',
      fragment: '\u54ce\u5440\uff0c \u6211\u4eec \u8d70 \u5427\uff01',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-13T03:31:52.785650',
      status_changed_date: '2026-02-06T03:31:52.785650',
      notes: '',
      audio: null,
      words: ['\u54ce\u5440'],
      tags: [],
      hints: [
        {
          id: 174845244,
          locale: 'en',
          text: 'oh no',
          term: '\u54ce\u5440',
          popularity: 101,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u0101iy\u0101'],
        hant: ['\u54ce\u5440']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54ce\u5440']
    },
    {
      pk: 775451486,
      url: 'https://www.lingq.com/api/v3/zh/cards/775451486/',
      term: '\u54e5\u54e5',
      fragment: '\u4ed6 \u6709 \u54e5\u54e5 \u5417\uff1f',
      importance: 3,
      status: 3,
      extended_status: 2,
      last_reviewed_correct: null,
      srs_due_date: '2026-04-28T02:00:19.284234',
      status_changed_date: '2026-01-28T02:00:19.284234',
      notes: '',
      audio: null,
      words: ['\u54e5\u54e5'],
      tags: [],
      hints: [
        {
          id: 12710255,
          locale: 'en',
          text: 'older brother',
          term: '\u54e5\u54e5',
          popularity: 393,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['g\u0113ge'],
        hant: ['\u54e5\u54e5']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54e5\u54e5']
    },
    {
      pk: 778647911,
      url: 'https://www.lingq.com/api/v3/zh/cards/778647911/',
      term: '\u54e6',
      fragment: '\u54e6\uff0c \u542c\u9519 \u4e86\uff01',
      importance: 3,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-08T03:53:45.739951',
      status_changed_date: '2026-02-01T03:53:45.739951',
      notes: '',
      audio: null,
      words: ['\u54e6'],
      tags: [],
      hints: [
        {
          id: 7407919,
          locale: 'en',
          text: 'oh',
          term: '\u54e6',
          popularity: 477,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u00f3'],
        hant: ['\u54e6']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54e6']
    },
    {
      pk: 781714708,
      url: 'https://www.lingq.com/api/v3/zh/cards/781714708/',
      term: '\u54ea',
      fragment: '\u54ea \u6709 \u554a\uff0c \u4f60 \u770b\u2026',
      importance: 3,
      status: 1,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-09T03:34:32.092238',
      status_changed_date: '2026-02-06T03:34:32.092238',
      notes: '',
      audio: null,
      words: ['\u54ea'],
      tags: [],
      hints: [
        {
          id: 17329940,
          locale: 'en',
          text: 'where, which',
          term: '\u54ea',
          popularity: 851,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['na'],
        hant: ['\u54ea']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54ea']
    },
    {
      pk: 779644455,
      url: 'https://www.lingq.com/api/v3/zh/cards/779644455/',
      term: '\u54ea\u513f',
      fragment: '\u4f60 \u597d\uff0c \u4f60 \u53bb \u54ea\u513f\uff1f',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-23T05:39:24.017019',
      status_changed_date: '2026-02-08T05:39:24.017019',
      notes: '',
      audio: null,
      words: ['\u54ea\u513f'],
      tags: [],
      hints: [
        {
          id: 43279837,
          locale: 'en',
          text: 'where?',
          term: '\u54ea\u513f',
          popularity: 885,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01cer'],
        hant: ['\u54ea\u5152']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54ea\u513f']
    },
    {
      pk: 775822270,
      url: 'https://www.lingq.com/api/v3/zh/cards/775822270/',
      term: '\u54ea\u91cc',
      fragment: '\u5bc4 \u5230 \u54ea\u91cc',
      importance: 3,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-17T06:02:09.553264',
      status_changed_date: '2026-02-02T06:02:09.553264',
      notes: '',
      audio: null,
      words: ['\u54ea\u91cc'],
      tags: [],
      hints: [
        {
          id: 8466111,
          locale: 'en',
          text: 'where',
          term: '\u54ea\u91cc',
          popularity: 673,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['n\u01cel\u01d0'],
        hant: ['\u54ea\u88cf']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54ea\u91cc']
    },
    {
      pk: 779644876,
      url: 'https://www.lingq.com/api/v3/zh/cards/779644876/',
      term: '\u54ed',
      fragment: '\u522b \u54ed \u4e86\u3002',
      importance: 2,
      status: 3,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-23T05:40:21.203470',
      status_changed_date: '2026-02-08T05:40:21.203470',
      notes: '',
      audio: null,
      words: ['\u54ed'],
      tags: [],
      hints: [
        {
          id: 13573090,
          locale: 'en',
          text: 'cry',
          term: '\u54ed',
          popularity: 576,
          is_google_translate: true,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['k\u016b'],
        hant: ['\u54ed']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u54ed']
    },
    {
      pk: 781713755,
      url: 'https://www.lingq.com/api/v3/zh/cards/781713755/',
      term: '\u5509',
      fragment: '\u5509\uff0c \u6211 \u8bf4\uff0c \u5c31\u7b97 \u6211\u2026',
      importance: 2,
      status: 2,
      extended_status: 0,
      last_reviewed_correct: null,
      srs_due_date: '2026-02-14T04:22:56.768278',
      status_changed_date: '2026-02-07T04:22:56.768278',
      notes: '',
      audio: null,
      words: ['\u5509'],
      tags: [],
      hints: [
        {
          id: 160054474,
          locale: 'en',
          text: 'sigh',
          term: '\u5509',
          popularity: 181,
          is_google_translate: false,
          flagged: false
        }
      ],
      transliteration: {
        pinyin: ['\u00e0i'],
        hant: ['\u5509']
      },
      gTags: [],
      wordTags: [],
      readings: {},
      writings: ['\u5509']
    }
  ]
}
