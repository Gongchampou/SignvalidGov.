import type { CertifyingAuthority } from '../types';

export const TRUSTED_AUTHORITIES: CertifyingAuthority[] = [
  {
    name: 'National Informatics Centre (NIC)',
    shortName: 'NIC CA',
    type: 'Government / MeitY',
    status: 'Government',
    accreditation: 'Authorized for Central & State Government portals (e-District, Seva Sindhu, e-Courts)',
    logoText: 'NIC',
    accentColor: '#126B44'
  },
  {
    name: 'eMudhra Consumer Services',
    shortName: 'eMudhra CA',
    type: 'Commercial CA',
    status: 'Licensed',
    accreditation: 'Official provider for UIDAI e-Aadhaar, MCA filings, and bank paperless e-Sign',
    logoText: 'eM',
    accentColor: '#0E7490'
  },
  {
    name: 'Centre for Development of Advanced Computing (C-DAC)',
    shortName: 'C-DAC CA',
    type: 'Autonomous R&D / MeitY',
    status: 'Government',
    accreditation: 'Powers DigiLocker repository signatures, academic certificates & national portals',
    logoText: 'C-DAC',
    accentColor: '#1E40AF'
  },
  {
    name: 'Protean eGov Technologies (formerly NSDL)',
    shortName: 'Protean / NSDL',
    type: 'Financial & Tax CA',
    status: 'Licensed',
    accreditation: 'Authorized issuer for Income Tax PAN e-cards, TIN-NSDL & NPS digital credentials',
    logoText: 'NSDL',
    accentColor: '#B45309'
  },
  {
    name: 'Capricorn Identity Services',
    shortName: 'Capricorn CA',
    type: 'Commercial CA',
    status: 'Licensed',
    accreditation: 'Class 3 DSC issuing authority for e-Tendering, DGFT, and ICEGATE customs',
    logoText: 'CAP',
    accentColor: '#4338CA'
  },
  {
    name: 'Safescrypt (Sify Technologies)',
    shortName: 'Safescrypt',
    type: 'Pioneer Commercial CA',
    status: 'Licensed',
    accreditation: 'First licensed certifying authority under Information Technology Act, 2000',
    logoText: 'SIFY',
    accentColor: '#047857'
  },
  {
    name: 'Vsign (Verasys Technologies)',
    shortName: 'Vsign CA',
    type: 'Digital Trust CA',
    status: 'Licensed',
    accreditation: 'Accredited by CCA for Paperless DSC, e-Sign API integrations, and corporate signing',
    logoText: 'VSIGN',
    accentColor: '#7C3AED'
  },
  {
    name: 'PantaSign CA',
    shortName: 'PantaSign',
    type: 'Licensed CA',
    status: 'Licensed',
    accreditation: 'Licensed by CCA India for Aadhaar-based paperless e-Sign and cryptographic tokens',
    logoText: 'PS',
    accentColor: '#BE185D'
  },
  {
    name: 'Institute for Development and Research in Banking Technology (IDRBT)',
    shortName: 'IDRBT CA',
    type: 'Reserve Bank of India Institute',
    status: 'Government',
    accreditation: 'Exclusively signs inter-bank clearing, SFMS, RTGS, and NEFT financial transmissions',
    logoText: 'IDRBT',
    accentColor: '#374151'
  }
];
