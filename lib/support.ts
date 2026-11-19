import { gitConfig } from './shared';

export const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;
export const sponsorUrl = `https://github.com/sponsors/${gitConfig.user}`;

export const supportTiers = [
  {
    id: 'once',
    title: 'Ponctuel',
    price: 'montant libre',
    lines: [
      'Un seul paiement, sans abonnement',
      'Paie un lot de certificats de signature',
      'Aucune contrepartie attendue',
    ],
    highlight: false,
    cta: 'Offrir une fois',
  },
  {
    id: 'monthly',
    title: 'Mensuel',
    price: '5 à 10 € / mois',
    lines: [
      'Couvre les minutes de CI en continu',
      'Votre nom dans le README, si vous le souhaitez',
      'Annulable à tout moment',
    ],
    highlight: true,
    cta: 'Devenir mécène',
  },
  {
    id: 'company',
    title: 'Sponsor',
    price: 'entreprise',
    lines: [
      'Logo dans le README et sur le site',
      'Facture émise par GitHub Sponsors',
      'Interlocuteur direct pour les correctifs',
    ],
    highlight: false,
    cta: 'Sponsoriser',
  },
] as const;
