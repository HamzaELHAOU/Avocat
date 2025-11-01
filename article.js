(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Same dataset structure as on index (fallback if navigated directly)
  const articlesData = [
    { title: "La mise en demeure: mode d'emploi", excerpt: "Définition, cadre légal et erreurs fréquentes avant toute action.", category: "Procédure", date: "12 oct. 2025", read: 4,
      cover: "https://images.unsplash.com/photo-1555375771-14b2b1b4ea82?q=80&w=1200&auto=format&fit=crop",
      body: [
        "La mise en demeure est un acte par lequel un créancier demande formellement à son débiteur d'exécuter son obligation.",
        "Elle constitue souvent un préalable indispensable avant toute action judiciaire, permettant de fixer une date et de démontrer la bonne foi du créancier.",
        "Bonnes pratiques: précisez l'obligation, accordez un délai raisonnable, et mentionnez les suites en cas d'inaction." ] },
    { title: "5 clauses clés d'un contrat commercial", excerpt: "Confidentialité, non-concurrence, résiliation: comment sécuriser.", category: "Contrats", date: "29 sept. 2025", read: 6,
      cover: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
      body: [
        "Les contrats encadrent la relation commerciale et anticipent les litiges.",
        "Cinq clauses clés: objet et obligations, confidentialité, non-concurrence, responsabilité/assurance, résiliation.",
        "Soignez la rédaction et adaptez les clauses à votre activité et aux risques identifiés." ] },
    { title: "Contentieux urgent: premiers réflexes", excerpt: "Conserver les preuves, consigner les faits, alerter vos conseils.", category: "Contentieux", date: "10 sept. 2025", read: 5,
      cover: "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1200&auto=format&fit=crop",
      body: [
        "En situation d'urgence, la préservation des preuves est prioritaire (captures, courriels, constats).",
        "Documentez chronologiquement les faits et informez rapidement votre avocat.",
        "Des mesures conservatoires ou d'injonction peuvent être envisagées." ] },
    { title: "RGPD en PME: par où commencer?", excerpt: "Cartographie des données, mentions d'information, registre.", category: "RGPD", date: "22 août 2025", read: 7,
      cover: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1200&auto=format&fit=crop",
      body: [
        "Dressez une cartographie des traitements et mettez à jour les mentions d'information.",
        "Tenez un registre, cadre contractuel avec vos sous-traitants, et procédures d'exercice des droits.",
        "Formez les équipes et surveillez les évolutions réglementaires." ] },
    { title: "Rupture des pourparlers: quels risques?", excerpt: "La responsabilité délictuelle en cas de négociations rompues.", category: "Affaires", date: "6 août 2025", read: 5,
      cover: "https://images.unsplash.com/photo-1534126511673-b6899657816a?q=80&w=1200&auto=format&fit=crop",
      body: [
        "La rupture fautive des pourparlers peut engager la responsabilité délictuelle.",
        "Préservez des traces des échanges et évitez les annonces prématurées.",
        "Privilégiez des lettres d'intention encadrant la négociation." ] },
    { title: "Cession de fonds: check-list pratique", excerpt: "Bail, salariés, stock, prix: points d'attention avant signature.", category: "Affaires", date: "18 juil. 2025", read: 8,
      cover: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1200&auto=format&fit=crop",
      body: [
        "Vérifiez le bail commercial, le personnel transféré, la consistance du stock et les privilèges.",
        "Prévoyez une garantie d'actif et de passif adaptée.",
        "Anticipez la communication aux tiers et la continuité d'exploitation." ] },
    { title: "Injonction de payer: utile ou pas?", excerpt: "Procédure simple pour créances certaines, liquides et exigibles.", category: "Procédure", date: "2 juil. 2025", read: 3,
      cover: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1200&auto=format&fit=crop",
      body: [
        "L'injonction de payer est rapide et peu coûteuse pour recouvrer une créance.",
        "Préparez les justificatifs (contrat, factures, échanges).",
        "Le débiteur peut former opposition: prévoyez une stratégie alternative." ] },
    { title: "Email pro: valeur de preuve", excerpt: "Force probante, horodatage et conservation des correspondances.", category: "Preuve", date: "15 juin 2025", read: 4,
      cover: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop",
      body: [
        "Les courriels ont une valeur probante sous conditions de fiabilité.",
        "L'horodatage et la conservation intègre renforcent la force probante.",
        "Utilisez des outils adaptés pour l'archivage légal." ] }
  ];

  function qs(sel, root=document){ return root.querySelector(sel); }
  function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

  function getId(){
    const url = new URL(window.location.href);
    const id = parseInt(url.searchParams.get('id') || '0', 10);
    return isNaN(id) ? 0 : id;
  }

  function buildLongBody(a){
    const chunks = [];
    // Intro
    chunks.push(`<p>${a.excerpt}</p>`);
    // Base sections to repeat/stagger
    const sections = [
      {h: 'Contexte', ps: [
        "Cadrez le dossier: parties, engagements, calendrier, et documents clés.",
        "Identifiez rapidement les points de blocage et les obligations essentielles."]},
      {h: 'Analyse juridique', ps: [
        "Rattachez les faits aux textes applicables et à la jurisprudence récente.",
        "Évaluez les risques contentieux et contractuels associés à chaque option."]},
      {h: 'Stratégie et preuves', ps: [
        "Organisez les éléments probatoires: contrats, courriels, bons de commande, PV.",
        "Prévoyez des mesures conservatoires et une communication maîtrisée."]},
      {h: 'Clauses et rédaction', ps: [
        "Précisez l’objet, les obligations de moyens/résultat, garanties et responsabilités.",
        "Soignez la clause de résiliation, de compétence et de confidentialité."]},
      {h: 'Checklist pratique', ps: [
        "Vérifiez les délais, formalités, et autorisations éventuelles.",
        "Anticipez la suite: exécution, suivi, et voies de recours."]}
    ];

    // Build 120-200 paragraphs mixing headings, lists, quotes
    let count = 0;
    for (let loop = 0; loop < 8; loop++) {
      for (const s of sections) {
        chunks.push(`<h2>${s.h}</h2>`);
        for (const p of s.ps) { chunks.push(`<p>${p}</p>`); count++; }
        // Insert list every second section
        if (loop % 2 === 0) {
          chunks.push('<ul>' + ['Objectifs', 'Risques', 'Actions immédiates'].map(item => `<li>${item}</li>`).join('') + '</ul>');
          count += 3;
        }
        // Insert quote periodically
        if ((loop + count) % 3 === 0) {
          chunks.push(`<blockquote>"La stratégie juridique est efficace lorsqu’elle rend l’exécution prévisible."</blockquote>`);
        }
      }
    }

    // Ensure minimum size ~150+ lines
    while (count < 160) {
      chunks.push(`<p>Note pratique: adaptez toujours la rédaction et la stratégie aux faits précis et aux objectifs opérationnels.</p>`);
      count++;
    }
    return chunks.join('');
  }

  function render(){
    const id = getId();
    const a = articlesData[id] || articlesData[0];
    qs('.article-title').textContent = a.title;
    qs('.article-meta').textContent = `${a.category} • ${a.date} • ${a.read} min`;
    qs('.article-cover img').src = a.cover;
    qs('.article-cover img').alt = a.title;
    const body = qs('#articleBody');
    body.innerHTML = buildLongBody(a);
  }

  // Simple reveal on load
  function revealOnLoad(){
    qsa('.slide-up, .fade-in').forEach(el => el.classList.add('reveal'));
  }

  render();
  revealOnLoad();
})();
