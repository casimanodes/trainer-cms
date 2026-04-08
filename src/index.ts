import type { Core } from '@strapi/strapi';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Seed data only if database is empty
    const existingStats = await strapi.documents('api::stat.stat').findMany({ limit: 1 });
    if (existingStats.length > 0) {
      strapi.log.info('Seed: Daten existieren bereits, ueberspringe Seed.');
      return;
    }

    strapi.log.info('Seed: Erstelle initiale Daten...');

    // Helper: create and publish a document (for content types with draftAndPublish: true)
    async function createAndPublish(uid: any, data: any) {
      const entry = await strapi.documents(uid).create({ data });
      try {
        await strapi.documents(uid).publish({ documentId: entry.documentId });
      } catch (e: any) {
        strapi.log.warn(`Seed: Konnte ${uid} (${entry.documentId}) nicht publishen: ${e.message}`);
      }
      return entry;
    }

    // ── Stats (draftAndPublish: false → no publish needed) ──
    const statsData = [
      { value: '9+', label: 'Jahre Trainererfahrung', reihenfolge: 1 },
      { value: '4', label: 'Sportarten & Kurse', reihenfolge: 2 },
      { value: '100+', label: 'Unterrichtete Stunden', reihenfolge: 3 },
      { value: '\u221e', label: 'Motivation f\u00fcr Neues', reihenfolge: 4 },
    ];
    for (const s of statsData) {
      await strapi.documents('api::stat.stat').create({ data: s });
    }

    // ── Hero Content (singleType, draftAndPublish: true → publish!) ──
    await createAndPublish('api::hero-content.hero-content', {
      tagline: 'Lizenzierter Trainer & Berater \u00b7 Hamburg',
      titleLine1: 'Sport. Denken.',
      titleLine2: 'Entwicklung.',
      description: 'Knapp ein Jahrzehnt Erfahrung als Trainer, Lehrer und Vereinsfunktion\u00e4r. DenkSport, Schwimmen, Badminton und Schlagball \u2013 professionell, individuell, leidenschaftlich.',
      ctaPrimaryText: 'Kurs anfragen',
      ctaPrimaryLink: '/kontakt?buchen=true',
      ctaSecondaryText: 'Alle Angebote',
      ctaSecondaryLink: '/angebote',
    });

    // ── About Content (singleType, draftAndPublish: true → publish!) ──
    await createAndPublish('api::about-content.about-content', {
      headline: 'Trainer aus',
      highlightedWord: 'Leidenschaft.',
      text1: 'Seit knapp einem Jahrzehnt begleite ich Menschen auf ihrem Weg \u2013 egal ob es darum geht, den Zauberw\u00fcrfel zu l\u00f6sen, die ersten Z\u00fcge im Schach zu meistern, sicher im Wasser zu werden oder auf dem Badminton-Court zu gl\u00e4nzen.',
      text2: 'Als lizenzierter Trainer und 1. Vorstand des Schlagball Hamburg e.V. bringe ich nicht nur sportliches Know-how mit, sondern auch echtes Organisationstalent und Leidenschaft f\u00fcr Gemeinschaft und faire Entwicklung.',
      portraitBadgeText: 'Lizenzierter\nTrainer',
    });

    // ── Site Settings (draftAndPublish: false → no publish needed) ──
    await strapi.documents('api::site-setting.site-setting').create({
      data: {
        siteName: 'Trainer Hamburg',
        siteSubtitle: 'Sport & Denken',
        logoText: 'T',
        email: 'trainer@example.com',
        location: 'Hamburg, Deutschland',
        responseTime: 'Innerhalb von 48 Stunden',
        socialInstagram: 'https://instagram.com',
        socialFacebook: '',
        socialYoutube: '',
        socialTiktok: '',
      },
    });

    // ── Themenbereiche (draftAndPublish: true → publish!) ──
    const themen = [
      { titel: 'DenkSport', beschreibung: 'Zauberw\u00fcrfel und Schach \u2013 geistige Fitness trifft spielerisches Lernen.', slug: 'denksport', reihenfolge: 1 },
      { titel: 'Schlagball', beschreibung: 'Vereinstraining, Turniere und Gemeinschaft.', slug: 'schlagball', reihenfolge: 2 },
      { titel: 'Schwimmen', beschreibung: 'Sicher im Wasser werden \u2013 f\u00fcr Anf\u00e4nger und Fortgeschrittene.', slug: 'schwimmen', reihenfolge: 3 },
      { titel: 'Badminton', beschreibung: 'Strukturiertes Training mit Fokus auf Technik und Spielverst\u00e4ndnis.', slug: 'badminton', reihenfolge: 4 },
    ];
    for (const t of themen) {
      await createAndPublish('api::themenbereich.themenbereich', t);
    }

    // ── Offers (draftAndPublish: true → publish!) ──
    const offersData = [
      { slug: 'denksport', title: 'DenkSport', shortTitle: 'DenkSport', description: 'Geistige Fitness trifft sportliche Ambition.', longDescription: 'DenkSport vereint geistige Herausforderung mit spielerischem Lernen.', icon: '\ud83e\udde9', badge: 'DenkSport', badgeColor: 'primary' as const, gradient: 'from-[#1a1a2e] to-[#16213e]', features: 'Zauberw\u00fcrfel l\u00f6sen\nSchachkurse\nGruppen- und Einzelkurse\nFeste Termine', ctaText: 'Termin anfragen', ctaLink: '/kontakt?interesse=denksport' },
      { slug: 'schlagball', title: 'Schlagball Hamburg', shortTitle: 'Schlagball', description: 'Vereinstraining, Turniere und Gemeinschaft.', longDescription: 'Schlagball Hamburg e.V. ist ein aktiver Sportverein.', icon: '\ud83c\udfd3', badge: 'Verein', badgeColor: 'green' as const, gradient: 'from-[#1a2e1a] to-[#162e16]', features: 'Regelm\u00e4\u00dfiges Vereinstraining\nTurniere & Wettk\u00e4mpfe\nOffen f\u00fcr alle\nTeamgeist', ctaText: 'Mitmachen', ctaLink: '/kontakt?interesse=schlagball' },
      { slug: 'schwimmen', title: 'Schwimmunterricht', shortTitle: 'Schwimmen', description: 'Vier Jahre Erfahrung als Schwimmlehrer.', longDescription: 'Schwimmunterricht mit Sicherheit an erster Stelle.', icon: '\ud83c\udfca', badge: 'Schwimmlehrer', badgeColor: 'blue' as const, gradient: 'from-[#0d1e2b] to-[#0d2233]', features: 'Anf\u00e4ngerkurse\nTechnik-Training\nKleine Gruppen\n4 Jahre Erfahrung', ctaText: 'Anfrage senden', ctaLink: '/kontakt?interesse=schwimmen' },
      { slug: 'badminton', title: 'Badminton-Training', shortTitle: 'Badminton', description: 'Strukturiertes Badminton-Training.', longDescription: 'Eigene Trainingsgruppe f\u00fcr alle Niveaus.', icon: '\ud83c\udff8', badge: 'Training', badgeColor: 'pink' as const, gradient: 'from-[#2b1a1a] to-[#2e1616]', features: 'Eigene Trainingsgruppe\nTechnik & Taktik\nF\u00fcr alle Niveaus\nRegelm\u00e4\u00dfig', ctaText: 'Gruppe beitreten', ctaLink: '/kontakt?interesse=badminton' },
    ];
    for (const o of offersData) {
      await createAndPublish('api::offer.offer', o);
    }

    // ── Prices (draftAndPublish: false → no publish needed) ──
    const offers = await strapi.documents('api::offer.offer').findMany({ status: 'published' });
    const offerMap = Object.fromEntries(offers.map((o: any) => [o.slug, o.documentId]));

    const pricesData = [
      { name: 'Einzelstunde', price: 35, unit: 'pro Stunde', description: '60 Min. individuelles Training', highlighted: false, offer: offerMap['denksport'] },
      { name: 'Gruppenkurs (4er)', price: 20, unit: 'pro Person / Stunde', description: '60 Min. Kleingruppe', highlighted: true, offer: offerMap['denksport'] },
      { name: 'Mitgliedsbeitrag', price: 10, unit: 'pro Monat', description: 'Training & Vereinsleben', highlighted: true, offer: offerMap['schlagball'] },
      { name: 'Schnuppertraining', price: 0, unit: 'kostenlos', description: 'Kennenlernen', highlighted: false, offer: offerMap['schlagball'] },
      { name: 'Einzelstunde', price: 40, unit: 'pro Stunde', description: '45 Min. Schwimmunterricht', highlighted: false, offer: offerMap['schwimmen'] },
      { name: 'Gruppenkurs (4er)', price: 25, unit: 'pro Person / Stunde', description: '45 Min. Kleingruppe', highlighted: true, offer: offerMap['schwimmen'] },
      { name: 'Gruppentraining', price: 15, unit: 'pro Person / Training', description: '90 Min. Gruppentraining', highlighted: true, offer: offerMap['badminton'] },
      { name: 'Einzeltraining', price: 40, unit: 'pro Stunde', description: '60 Min. Techniktraining', highlighted: false, offer: offerMap['badminton'] },
    ];
    for (const p of pricesData) {
      await strapi.documents('api::price.price').create({ data: p });
    }

    // ── Schedule (draftAndPublish: true → publish!) ──
    const schedData = [
      { day: 'Montag', time: '18:00 \u2013 19:30 Uhr', type: 'Zauberw\u00fcrfel', offerSlug: 'denksport', badgeColor: 'primary' as const, location: 'Hamburg', spotsLeft: 3, price: 20 },
      { day: 'Mittwoch', time: '17:00 \u2013 18:30 Uhr', type: 'Schach', offerSlug: 'denksport', badgeColor: 'primary' as const, location: 'Hamburg', spotsLeft: 5, price: 20 },
      { day: 'Donnerstag', time: '19:00 \u2013 20:30 Uhr', type: 'Badminton', offerSlug: 'badminton', badgeColor: 'pink' as const, location: 'Sporthalle Hamburg', spotsLeft: 6, price: 15 },
      { day: 'Samstag', time: '10:00 \u2013 12:00 Uhr', type: 'Schwimmen', offerSlug: 'schwimmen', badgeColor: 'blue' as const, location: 'Schwimmhalle Hamburg', spotsLeft: 2, price: 25 },
      { day: 'Wochenende', time: 'Variabel', type: 'Schlagball', offerSlug: 'schlagball', badgeColor: 'green' as const, location: 'Sportplatz Hamburg' },
    ];
    for (const s of schedData) {
      await createAndPublish('api::schedule.schedule', s);
    }

    // ── Testimonials (draftAndPublish: true → publish!) ──
    const testiData = [
      { quote: 'Der Zauberw\u00fcrfel-Kurs hat mein Denken ver\u00e4ndert. Absolut empfehlenswert!', authorName: 'Max L.', authorRole: 'DenkSport-Teilnehmer', authorInitials: 'ML', rating: 5 },
      { quote: 'Meine Tochter schwimmt jetzt selbstst\u00e4ndig und mit Spa\u00df.', authorName: 'Sarah K.', authorRole: 'Elternteil, Schwimmkurs', authorInitials: 'SK', rating: 5 },
      { quote: 'Tolle Organisation, klare Kommunikation und echter Teamgeist.', authorName: 'Thomas H.', authorRole: 'Vereinsmitglied Schlagball HH', authorInitials: 'TH', rating: 5 },
    ];
    for (const t of testiData) {
      await createAndPublish('api::testimonial.testimonial', t);
    }

    // ── FAQ (draftAndPublish: true → publish!) ──
    const faqData = [
      { question: 'F\u00fcr wen sind die Kurse geeignet?', answer: 'Alle Kurse sind f\u00fcr Anf\u00e4nger und Fortgeschrittene geeignet.' },
      { question: 'Wie gro\u00df sind die Kursgruppen?', answer: 'Max. 6\u20138 Personen. Einzelunterricht auf Anfrage.' },
      { question: 'Wo finden die Kurse statt?', answer: 'In Hamburg. Details nach Anmeldung per E-Mail.' },
      { question: 'Was kostet ein Kurs?', answer: 'Preise auf den jeweiligen Angebotsseiten.' },
      { question: 'Wie melde ich mich an?', answer: 'Kontaktformular oder Kurs buchen Button.' },
      { question: 'Wie trete ich dem Schlagball-Verein bei?', answer: 'Kontaktformular nutzen. Schnuppertraining jederzeit.' },
    ];
    for (const f of faqData) {
      await createAndPublish('api::faq.faq', f);
    }

    // ── Public API Permissions (allow read without token) ──
    strapi.log.info('Seed: Setze Public-API-Berechtigungen...');
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' },
    });

    if (publicRole) {
      const contentTypes = [
        'api::offer.offer',
        'api::price.price',
        'api::schedule.schedule',
        'api::testimonial.testimonial',
        'api::faq.faq',
        'api::themenbereich.themenbereich',
        'api::stat.stat',
        'api::hero-content.hero-content',
        'api::about-content.about-content',
        'api::site-setting.site-setting',
      ];

      for (const ct of contentTypes) {
        // Extract the short name: "api::offer.offer" → "offer"
        const shortName = ct.split('.').pop()!;
        const actions = [`${ct}.find`, `${ct}.findOne`];
        for (const action of actions) {
          const existing = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { action, role: publicRole.id },
          });
          if (!existing) {
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id },
            });
          }
        }
      }
      strapi.log.info('Seed: Public-API-Berechtigungen gesetzt!');
    }

    strapi.log.info('Seed: Alle Daten erfolgreich erstellt und publiziert!');
  },
};
