import type { SupportedDocCategory } from '../types';

export const SUPPORTED_DOCUMENTS: SupportedDocCategory[] = [
  {
    category: 'Identity & Tax Documents',
    description: 'National biometric & fiscal identities with PKCS#7 digital signature tokens',
    iconName: 'ShieldCheck',
    items: [
      {
        name: 'e-Aadhaar PDF Download',
        authority: 'Unique Identification Authority of India (UIDAI)',
        portal: 'myaadhaar.uidai.gov.in',
        tag: 'DS UIDAI 01/02/03'
      },
      {
        name: 'Instant e-PAN / PAN Card PDF',
        authority: 'Protean eGov (NSDL) / UTIITSL / Income Tax Dept',
        portal: 'onlineservices.nsdl.com',
        tag: 'Income Tax DSC'
      },
      {
        name: 'Masked Aadhaar Card',
        authority: 'UIDAI Electronic Signature Facility',
        portal: 'resident.uidai.gov.in',
        tag: 'CCA Class 3'
      },
      {
        name: 'e-Passport Application Confirmation',
        authority: 'Ministry of External Affairs (CPV Division)',
        portal: 'passportindia.gov.in',
        tag: 'MEA DSC'
      }
    ]
  },
  {
    category: 'State e-District & Citizen Services',
    description: 'Statutory government certificates signed by Tahsildars, Revenue Officers, & Sub-Registrars',
    iconName: 'FileText',
    items: [
      {
        name: 'Karnataka Seva Sindhu Certificates',
        authority: 'Department of Revenue & e-Governance, Karnataka',
        portal: 'sevasindhuservices.karnataka.gov.in',
        tag: 'Income / Caste / Domicile'
      },
      {
        name: 'Tamil Nadu e-Sevai / TNeGA Documents',
        authority: 'Tamil Nadu e-Governance Agency',
        portal: 'tnesevai.tn.gov.in',
        tag: 'Community / Nativity / First Graduate'
      },
      {
        name: 'Kerala e-District Services',
        authority: 'Kerala State IT Mission & Revenue Dept',
        portal: 'edistrict.kerala.gov.in',
        tag: 'Relationship / Non-Creamy Layer'
      },
      {
        name: 'Maharashtra Aaple Sarkar Portal',
        authority: 'Government of Maharashtra',
        portal: 'aaplesarkar.mahaonline.gov.in',
        tag: 'Age / Nationality / Domicile'
      },
      {
        name: 'Uttar Pradesh e-Sathi / eDistrict',
        authority: 'Centre for e-Governance (CeG) UP',
        portal: 'edistrict.up.gov.in',
        tag: 'Aay / Jati / Niwas Praman Patra'
      },
      {
        name: 'Delhi e-District Revenue Certificates',
        authority: 'Revenue Department, Govt of NCT Delhi',
        portal: 'edistrict.delhigovt.nic.in',
        tag: 'Surviving Member / Caste Cert'
      }
    ]
  },
  {
    category: 'Digital Repositories & Academic Credentials',
    description: 'Cloud document lockers and accredited educational board certificates',
    iconName: 'Award',
    items: [
      {
        name: 'DigiLocker Issued Documents',
        authority: 'National e-Governance Division (NeGD) / MeitY',
        portal: 'digilocker.gov.in',
        tag: 'Universal DigiLocker Seal'
      },
      {
        name: 'CBSE Class X & XII Digital Marksheets',
        authority: 'Central Board of Secondary Education',
        portal: 'cbse.gov.in / NAD',
        tag: 'Academic Depository'
      },
      {
        name: 'University Degrees & Transcripts',
        authority: 'UGC National Academic Depository (NAD)',
        portal: 'nad.digilocker.gov.in',
        tag: 'University Registrar DSC'
      },
      {
        name: 'COVID-19 Vaccination Certificate',
        authority: 'Ministry of Health & Family Welfare (CoWIN)',
        portal: 'cowin.gov.in',
        tag: 'CoWIN PKI'
      }
    ]
  },
  {
    category: 'Revenue, Land Records & Judiciary',
    description: 'Property titles, certified copies of legal judgments, and land deeds',
    iconName: 'Scale',
    items: [
      {
        name: 'e-Courts Certified Orders & Judgments',
        authority: 'e-Committee, Supreme Court & High Courts of India',
        portal: 'ecourts.gov.in',
        tag: 'Judicial DSC'
      },
      {
        name: 'Patta / Chitta / Land Ownership Records',
        authority: 'State Survey & Land Records Departments',
        portal: 'State Land Portals (AnyRoR, Bhulekh, Dharani)',
        tag: 'Land Revenue DS'
      },
      {
        name: 'Registered Sale Deeds & Encumbrance (EC)',
        authority: 'Registration and Stamps Department',
        portal: 'State IGRS Portals (Kaveri, TNREGINET, IGRUP)',
        tag: 'Sub-Registrar Digital Token'
      },
      {
        name: 'Commercial Taxes & GST Invoices',
        authority: 'Goods and Services Tax Network (GSTN)',
        portal: 'gst.gov.in',
        tag: 'GSTN Signing Authority'
      }
    ]
  }
];
