// ============================================================
// CONTENT SAMPLES DATA: the "// 05 Content Samples" section on
// index.html reads this list and builds the cards automatically.
//
// TO ADD A NEW POST:
//   1. Put the image (or a thumbnail, if the source is a PDF) in
//      this same folder.
//   2. Copy one of the objects below, paste it at the end of the
//      list, and fill in your own values. Every text field takes
//      en / fr / ru: fill in all three.
//   3. Save. No other file needs to change.
//
// Field reference:
//   image      : filename of the thumbnail shown in the card. Usually
//                one filename (same image for every language). If the
//                graphic itself has text that's been translated (like
//                an original diagram), use { en: '...', fr: '...' }
//                instead; any language left out just falls back to
//                the English file, so it's fine to add fr without ru.
//   viewLink   : filename the "View Full ..." link opens (often the
//                same as `image`, but point this at the original PDF
//                if `image` is just a rendered thumbnail of it).
//                Also accepts the { en, fr, ru } form above.
//   type       : small label above the title, e.g. "Case Study Promo"
//   title      : card heading
//   caption    : one or two sentences under the title
//   linkText   : the "View Full ..." link's label (e.g. "View Full
//                Image" vs "View Full PDF", whatever fits the file)
//
// Filenames with spaces are fine; write them exactly as they
// appear on disk, no need to type %20 yourself.
// ============================================================

var CONTENT_SAMPLES = [
  {
    image: 'cs.jpeg',
    viewLink: 'cs.jpeg',
    type: {
      en: 'Case Study Promo',
      fr: "Promotion d'Étude de Cas",
      ru: 'Промо кейса'
    },
    title: {
      en: 'Mining Case Study Announcement',
      fr: "Annonce d'Étude de Cas : Mines",
      ru: 'Анонс кейса для горнодобывающей отрасли'
    },
    caption: {
      en: 'Announcement graphic for a mining-sector case study on self-locking technology for shaker tables under extreme vibration.',
      fr: "Visuel d'annonce pour une étude de cas dans le secteur minier sur une technologie autobloquante pour tables vibrantes soumises à des vibrations extrêmes.",
      ru: 'Анонсирующий визуал для кейса в горнодобывающей отрасли о самоконтрящейся технологии для вибростолов, работающих в условиях экстремальной вибрации.'
    },
    linkText: {
      en: 'View Full Image',
      fr: "Voir l'Image Complète",
      ru: 'Смотреть полное изображение'
    }
  },
  {
    image: 'imp v met.jpeg',
    viewLink: 'imp v met.jpeg',
    type: {
      en: 'Educational Infographic',
      fr: 'Infographie Pédagogique',
      ru: 'Обучающая инфографика'
    },
    title: {
      en: 'Imperial vs. Metric Thread Pitch',
      fr: 'Pas de Filetage : Impérial vs Métrique',
      ru: 'Шаг резьбы: дюймовая и метрическая системы'
    },
    caption: {
      en: "Technical explainer breaking down the difference between imperial and metric threading conventions, and why they aren't interchangeable.",
      fr: "Explication technique détaillant la différence entre les conventions de filetage impérial et métrique, et pourquoi elles ne sont pas interchangeables.",
      ru: 'Техническое объяснение разницы между дюймовой и метрической системами резьбы и того, почему они не взаимозаменяемы.'
    },
    linkText: {
      en: 'View Full Image',
      fr: "Voir l'Image Complète",
      ru: 'Смотреть полное изображение'
    }
  },
  {
    image: 'ptorque-thumb.jpg',
    viewLink: 'Ptorque.pdf',
    type: {
      en: 'Product Guide (PDF)',
      fr: 'Guide Produit (PDF)',
      ru: 'Гайд по продукту (PDF)'
    },
    title: {
      en: 'Prevailing Torque Locknuts',
      fr: 'Écrous Freinés Prevailing Torque',
      ru: 'Самоконтрящиеся гайки Prevailing Torque'
    },
    caption: {
      en: 'Visual guide comparing four locknut types (all-metal de-pitched, nylon insert, jam nuts, and distorted thread) and when to use each.',
      fr: "Guide visuel comparant quatre types d'écrous freinés (tout métal dépité, insert nylon, écrous de blocage et filetage déformé) et leurs cas d'usage respectifs.",
      ru: 'Наглядный гайд, сравнивающий четыре типа самоконтрящихся гаек (цельнометаллические с деформированной резьбой, с нейлоновой вставкой, контргайки и с искажённой резьбой) и когда использовать каждый из них.'
    },
    linkText: {
      en: 'View Full PDF',
      fr: 'Voir le PDF complet',
      ru: 'Смотреть PDF'
    }
  },
  {
    image: 'diamond-thumb.jpg',
    viewLink: 'FR_Diamond Case Study.pdf',
    type: {
      en: 'Case Study (PDF)',
      fr: 'Étude de Cas (PDF)',
      ru: 'Кейс (PDF)'
    },
    title: {
      en: 'Diamond Crossing Case Study',
      fr: 'Étude de Cas Diamond Crossing',
      ru: 'Кейс Diamond Crossing'
    },
    caption: {
      en: "Design, formatting, and translation for a branded case study on J.Lanfranco's THU self-locking nuts eliminating daily maintenance inspections at a major Class 1 railroad's diamond crossing. Copywriting was handled by an external hire; I also created the reusable branded template used for later case studies.",
      fr: "Conception, mise en forme et traduction de cette étude de cas de marque sur les écrous autobloquants THU de J.Lanfranco, qui ont permis d'éliminer les inspections quotidiennes de maintenance sur un croisement ferroviaire (diamond) d'un grand réseau nord-américain de classe 1. La rédaction a été confiée à un prestataire externe ; j'ai également créé le gabarit de marque réutilisé pour les études de cas suivantes.",
      ru: 'Дизайн, вёрстка и перевод этого брендированного кейса о самоконтрящихся гайках THU от J.Lanfranco, которые позволили отказаться от ежедневных проверок на пересечении путей (diamond) крупной североамериканской железной дороги класса 1. Копирайтинг выполнил внешний подрядчик; также разработала фирменный шаблон, использованный для последующих кейсов.'
    },
    linkText: {
      en: 'View Full PDF (French)',
      fr: 'Voir le PDF complet',
      ru: 'Смотреть PDF (на французском)'
    }
  },
  {
    image: { en: 'hubspot-workflow.svg', fr: 'hubspot-workflow-fr.svg' },
    viewLink: { en: 'hubspot-workflow.svg', fr: 'hubspot-workflow-fr.svg' },
    type: {
      en: 'Automation Example',
      fr: "Exemple d'Automatisation",
      ru: 'Пример автоматизации'
    },
    title: {
      en: 'B2B Lead Nurture & Sales Handoff (HubSpot)',
      fr: 'Nurturing et Transfert des Leads B2B (HubSpot)',
      ru: 'Взращивание и передача B2B-лидов (HubSpot)'
    },
    caption: {
      en: "An original example workflow showing how I'd structure lead scoring and sales handoff in HubSpot: from form submission through MQL routing to a 24-hour sales follow-up.",
      fr: "Exemple original de workflow illustrant comment je structurerais le scoring des leads et leur transfert aux commerciaux dans HubSpot : du formulaire jusqu'au suivi commercial sous 24h.",
      ru: 'Оригинальный пример workflow, показывающий, как я бы выстроила скоринг лидов и их передачу отделу продаж в HubSpot: от заполнения формы до передачи в продажи в течение 24 часов.'
    },
    linkText: {
      en: 'View Full Diagram',
      fr: 'Voir le Schéma Complet',
      ru: 'Смотреть полную схему'
    }
  },
  {
    image: { en: 'rail-fasteners-onepager.svg', fr: 'rail-fasteners-onepager-fr.svg' },
    viewLink: { en: 'rail-fasteners-onepager.svg', fr: 'rail-fasteners-onepager-fr.svg' },
    type: {
      en: 'Sales Battlecard',
      fr: 'Argumentaire de Vente',
      ru: 'Карточка продаж'
    },
    title: {
      en: 'Fasteners That Survive Rail Vibration',
      fr: 'Des Fixations Qui Résistent aux Vibrations',
      ru: 'Крепёж, устойчивый к вибрации на транспорте'
    },
    caption: {
      en: 'A quick-reference sales battlecard for rail & transportation fastener buyers, currently being designed in my own visual style. Check back soon.',
      fr: "Un argumentaire de vente pour les acheteurs de fixations ferroviaires, en cours de création dans mon propre style visuel. Disponible prochainement.",
      ru: 'Карточка продаж для покупателей крепежа в железнодорожной и транспортной отрасли, сейчас в разработке в моём собственном визуальном стиле.'
    },
    linkText: {
      en: 'Coming Soon',
      fr: 'Bientôt Disponible',
      ru: 'Скоро'
    }
  }
];

// ============================================================
// HERO CAROUSEL: the static "coverflow" photo carousel at the top
// of the desktop hero reads this list and picks 5 random items on
// every page load (see the render script near the end of
// index.html). image/viewLink follow the same rules as above:
// a plain filename, or an { en, fr, ru } object for a localized
// asset (falls back to en for any language left out).
// ============================================================

var HERO_CAROUSEL_ITEMS = [
  {
    image: 'Torque.jpeg',
    viewLink: 'Torque.jpeg',
    caption: {
      en: 'Torque Infographic',
      fr: 'Infographie Technique',
      ru: 'Техническая инфографика'
    }
  },
  {
    image: 'Event .jpeg',
    viewLink: 'Event .jpeg',
    caption: {
      en: 'Event Sponsorship',
      fr: "Sponsoring d'Événement",
      ru: 'Спонсорство мероприятия'
    }
  },
  {
    image: 'imp v met.jpeg',
    viewLink: 'imp v met.jpeg',
    caption: {
      en: 'Imperial vs. Metric Infographic',
      fr: 'Infographie Impérial vs Métrique',
      ru: 'Инфографика: дюймы и метры'
    }
  },
  {
    image: 'cs.jpeg',
    viewLink: 'cs.jpeg',
    caption: {
      en: 'Case Study Announcement',
      fr: "Annonce d'Étude de Cas",
      ru: 'Анонс кейса'
    }
  },
  {
    image: { en: 'cover-board-thumb.jpg', fr: 'cover-board-thumb-fr.jpg' },
    viewLink: { en: 'Cover Board Case Study 2021.pdf', fr: 'FR_Cover Board Case Study 2021.pdf' },
    caption: {
      en: 'Rail Case Study',
      fr: 'Étude de Cas Ferroviaire',
      ru: 'Кейс: железная дорога'
    }
  },
  {
    image: 'ptorque-thumb.jpg',
    viewLink: 'Ptorque.pdf',
    caption: {
      en: 'Locknut Product Guide',
      fr: 'Guide Produit',
      ru: 'Гайд по продукту'
    }
  },
  {
    image: 'how-it-works-thumb.jpg',
    viewLink: 'HOW IT WORK-EN-V1.0.pdf',
    caption: {
      en: 'How It Works Guide',
      fr: 'Guide "Comment ça marche"',
      ru: 'Гайд «Как это работает»'
    }
  },
  {
    image: 'surface-treatments-thumb.jpg',
    viewLink: 'Surface treatments.pdf',
    caption: {
      en: 'Surface Treatments Guide',
      fr: 'Guide des Traitements de Surface',
      ru: 'Гайд по обработке поверхности'
    }
  }
];
