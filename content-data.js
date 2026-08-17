// ============================================================
// CONTENT SAMPLES DATA — the "// 05 Content Samples" section on
// index.html reads this list and builds the cards automatically.
//
// TO ADD A NEW POST:
//   1. Put the image (or a thumbnail, if the source is a PDF) in
//      this same folder.
//   2. Copy one of the objects below, paste it at the end of the
//      list, and fill in your own values. Every text field takes
//      en / fr / ru — fill in all three.
//   3. Save. No other file needs to change.
//
// Field reference:
//   image      — filename of the thumbnail shown in the card. Usually
//                one filename (same image for every language). If the
//                graphic itself has text that's been translated (like
//                an original diagram), use { en: '...', fr: '...' }
//                instead — any language left out just falls back to
//                the English file, so it's fine to add fr without ru.
//   viewLink   — filename the "View Full ..." link opens (often the
//                same as `image`, but point this at the original PDF
//                if `image` is just a rendered thumbnail of it) —
//                also accepts the { en, fr, ru } form above.
//   type       — small label above the title, e.g. "Case Study Promo"
//   title      — card heading
//   caption    — one or two sentences under the title
//   linkText   — the "View Full ..." link's label (e.g. "View Full
//                Image" vs "View Full PDF" — whatever fits the file)
//
// Filenames with spaces are fine — write them exactly as they
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
      fr: "Annonce d'Étude de Cas — Mines",
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
      en: 'Visual guide comparing four locknut types — all-metal de-pitched, nylon insert, jam nuts, and distorted thread — and when to use each.',
      fr: "Guide visuel comparant quatre types d'écrous freinés — tout métal dépité, insert nylon, écrous de blocage et filetage déformé — et leurs cas d'usage respectifs.",
      ru: 'Наглядный гайд, сравнивающий четыре типа самоконтрящихся гаек — цельнометаллические с деформированной резьбой, с нейлоновой вставкой, контргайки и с искажённой резьбой — и когда использовать каждый из них.'
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
      en: "An original example workflow showing how I'd structure lead scoring and sales handoff in HubSpot — from form submission through MQL routing to a 24-hour sales follow-up.",
      fr: "Exemple original de workflow illustrant comment je structurerais le scoring des leads et leur transfert aux commerciaux dans HubSpot — du formulaire jusqu'au suivi commercial sous 24h.",
      ru: 'Оригинальный пример workflow, показывающий, как я бы выстроила скоринг лидов и их передачу отделу продаж в HubSpot — от заполнения формы до передачи в продажи в течение 24 часов.'
    },
    linkText: {
      en: 'View Full Diagram',
      fr: 'Voir le Schéma Complet',
      ru: 'Смотреть полную схему'
    }
  },
  {
    image: { en: 'geo-framework.svg', fr: 'geo-framework-fr.svg' },
    viewLink: { en: 'geo-framework.svg', fr: 'geo-framework-fr.svg' },
    type: {
      en: 'Strategy Infographic',
      fr: 'Infographie Stratégique',
      ru: 'Стратегическая инфографика'
    },
    title: {
      en: 'Getting Cited by AI Search (GEO)',
      fr: 'Être Cité par les Moteurs IA (GEO)',
      ru: 'Цитирование в ИИ-поиске (GEO)'
    },
    caption: {
      en: 'An original data-backed strategy for earning citations in AI answer engines like ChatGPT and Perplexity — built from 2026 research on B2B buyer behavior, since 73% of buyers now use AI tools to research vendors.',
      fr: "Une stratégie originale, fondée sur des données, pour obtenir des citations dans les moteurs de réponse IA comme ChatGPT et Perplexity — construite à partir d'études 2026 sur le comportement des acheteurs B2B, puisque 73 % d'entre eux utilisent désormais l'IA pour évaluer des fournisseurs.",
      ru: 'Оригинальная стратегия на основе данных для получения цитирований в ИИ-поисковиках вроде ChatGPT и Perplexity — построена на исследованиях 2026 года о поведении B2B-покупателей, 73% которых уже используют ИИ для оценки поставщиков.'
    },
    linkText: {
      en: 'View Full Infographic',
      fr: "Voir l'Infographie Complète",
      ru: 'Смотреть полную инфографику'
    }
  }
];
