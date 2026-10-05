import type { ValidatedFile } from '../types';

export const SAMPLE_DOCUMENTS: Omit<ValidatedFile, 'id' | 'uploadDate'>[] = [
  {
    name: 'eaadhaar_uidai_signed.pdf',
    size: 1420580,
    status: 'valid',
    summary: 'Signature is valid and chains to India PKI CCA Root 2014.',
    encrypted: false,
    sha256: 'a8f4c1e099238dd4e1f728c390234b568910fedc339281a8b542e71f98bc012d',
    signatures: [
      {
        index: 0,
        subFilter: 'adbe.pkcs7.detached',
        signerName: 'Unique Identification Authority of India (UIDAI) - DS UIDAI 03',
        signerOrg: 'UIDAI',
        issuerName: 'eMudhra Sub CA - Class 3 / CCA India 2014',
        signingTime: '24 Oct 2024, 14:32:10 IST',
        signingTimeSource: 'timestamp',
        digestAlgorithm: 'SHA-256',
        signatureAlgorithm: 'RSA 2048-bit',
        certSerial: '6A 4B 8F 21 99 0C DE 1A 33 55',
        certValidFrom: '18 Nov 2021, 00:00:00 IST',
        certValidTo: '18 Nov 2026, 23:59:59 IST',
        integrityOk: true,
        signatureOk: true,
        chainOk: true,
        coversWholeDocument: true,
        trustedRoot: 'India PKI CCA Root 2014',
        chain: [
          'UIDAI Electronic Signature Token DS-03',
          'eMudhra Sub CA - Class 3 Document Signer 2021',
          'India PKI CCA Root 2014 (Controller of Certifying Authorities)'
        ],
        problems: []
      }
    ],
    bytes: new Uint8Array(),
    sampleType: 'e-Aadhaar',
    metadata: {
      documentType: 'e-Aadhaar Identity Card',
      signerIdentity: 'Unique Identification Authority of India (UIDAI) - DS UIDAI 03',
      certificateAuthority: 'eMudhra Sub CA - Class 3 / CCA India 2014',
      timestamp: '24 Oct 2024, 14:32:10 IST',
      hashAlgorithm: 'SHA-256 (256-bit secure cryptographic digest)',
      signatureAlgorithm: 'RSA 2048-bit with PKCS#1 v1.5 padding',
      crlOcspStatus: 'Valid · OCSP responder response: 200 OK (Not Revoked)',
      certificateSerial: '6A 4B 8F 21 99 0C DE 1A 33 55',
      validUntil: '18 Nov 2026, 23:59:59 IST',
      ccaTrustChain: [
        'India PKI CCA Root 2014 (Controller of Certifying Authorities)',
        'eMudhra Sub CA - Class 3 Document Signer 2021',
        'UIDAI Electronic Signature Token DS-03'
      ],
      docFingerprint: 'a8f4c1e099238dd4e1f728c390234b568910fedc339281a8b542e71f98bc012d'
    }
  },
  {
    name: 'karnataka_income_caste_cert.pdf',
    size: 890450,
    status: 'valid',
    summary: 'Signature is valid and chains to CCA India Root 2014.',
    encrypted: false,
    sha256: 'b712fa908e45cc223849102837bcde44881239aa84716301293847fedcba9012',
    signatures: [
      {
        index: 0,
        subFilter: 'adbe.pkcs7.detached',
        signerName: 'Tahsildar / Revenue Inspector, Karnataka Seva Sindhu Portal',
        signerOrg: 'Revenue Department',
        issuerName: 'National Informatics Centre (NIC) Sub CA / CCA India',
        signingTime: '12 Sep 2024, 11:15:42 IST',
        signingTimeSource: 'timestamp',
        digestAlgorithm: 'SHA-256',
        signatureAlgorithm: 'RSA 2048-bit',
        certSerial: '4F 22 B1 90 EA 12 77 CD 88 10',
        certValidFrom: '04 Aug 2022, 00:00:00 IST',
        certValidTo: '04 Aug 2027, 23:59:59 IST',
        integrityOk: true,
        signatureOk: true,
        chainOk: true,
        coversWholeDocument: true,
        trustedRoot: 'Controller of Certifying Authorities (CCA) India Root 2014',
        chain: [
          'Government of Karnataka Electronic Delivery of Citizen Services DS',
          'National Informatics Centre Certifying Authority (NICCA)',
          'Controller of Certifying Authorities (CCA) India Root 2014'
        ],
        problems: []
      }
    ],
    bytes: new Uint8Array(),
    sampleType: 'e-District Certificate',
    metadata: {
      documentType: 'State Revenue / Caste Certificate (Form D)',
      signerIdentity: 'Tahsildar / Revenue Inspector, Karnataka Seva Sindhu Portal',
      certificateAuthority: 'National Informatics Centre (NIC) Sub CA / CCA India',
      timestamp: '12 Sep 2024, 11:15:42 IST',
      hashAlgorithm: 'SHA-256 with ISO 32000-1 Digital Signature standard',
      signatureAlgorithm: 'RSA 2048-bit with PKCS#7 detached signature',
      crlOcspStatus: 'Valid · CRL timestamp verified against CCA Repository',
      certificateSerial: '4F 22 B1 90 EA 12 77 CD 88 10',
      validUntil: '04 Aug 2027, 23:59:59 IST',
      ccaTrustChain: [
        'Controller of Certifying Authorities (CCA) India Root 2014',
        'National Informatics Centre Certifying Authority (NICCA)',
        'Government of Karnataka Electronic Delivery of Citizen Services DS'
      ],
      docFingerprint: 'b712fa908e45cc223849102837bcde44881239aa84716301293847fedcba9012'
    }
  },
  {
    name: 'digilocker_cbse_marksheet.pdf',
    size: 1150240,
    status: 'valid',
    summary: 'Signature is valid and chains to India PKI CCA Root 2014.',
    encrypted: false,
    sha256: 'c99831ae7428f5b892304958162734ba9820194857640321948576cbadfe9012',
    signatures: [
      {
        index: 0,
        subFilter: 'adbe.pkcs7.detached',
        signerName: 'DigiLocker National Academic Depository (NAD)',
        signerOrg: 'NeGD / MeitY',
        issuerName: 'C-DAC Sub CA for National e-Governance Division (NeGD)',
        signingTime: '05 Jun 2024, 16:48:02 IST',
        signingTimeSource: 'timestamp',
        digestAlgorithm: 'SHA-256',
        signatureAlgorithm: 'RSA 2048-bit',
        certSerial: '1A 90 FE 33 22 BC 77 12 94 A1',
        certValidFrom: '15 May 2023, 00:00:00 IST',
        certValidTo: '15 May 2028, 23:59:59 IST',
        integrityOk: true,
        signatureOk: true,
        chainOk: true,
        coversWholeDocument: true,
        trustedRoot: 'India PKI CCA Root 2014',
        chain: [
          'DigiLocker Issuer Service NAD-CBSE-01',
          'C-DAC Class 3 Sub CA 2020',
          'India PKI CCA Root 2014'
        ],
        problems: []
      }
    ],
    bytes: new Uint8Array(),
    sampleType: 'DigiLocker Marksheet',
    metadata: {
      documentType: 'Central Board of Secondary Education Class XII Certificate',
      signerIdentity: 'DigiLocker National Academic Depository (NAD)',
      certificateAuthority: 'C-DAC Sub CA for National e-Governance Division (NeGD)',
      timestamp: '05 Jun 2024, 16:48:02 IST',
      hashAlgorithm: 'SHA-256 Cryptographic Hash',
      signatureAlgorithm: 'RSA 2048-bit PKCS#7 container',
      crlOcspStatus: 'Valid · Certified by Ministry of Electronics & IT (MeitY)',
      certificateSerial: '1A 90 FE 33 22 BC 77 12 94 A1',
      validUntil: '15 May 2028, 23:59:59 IST',
      ccaTrustChain: [
        'India PKI CCA Root 2014',
        'C-DAC Class 3 Sub CA 2020',
        'DigiLocker Issuer Service NAD-CBSE-01'
      ],
      docFingerprint: 'c99831ae7428f5b892304958162734ba9820194857640321948576cbadfe9012'
    }
  },
  {
    name: 'pan_ecard_nsdl_signed.pdf',
    size: 720890,
    status: 'valid',
    summary: 'Signature is valid and chains to CCA India Root Certificate 2014.',
    encrypted: false,
    sha256: 'f102837465928374950182736452019283746501928374650192837465019283',
    signatures: [
      {
        index: 0,
        subFilter: 'adbe.pkcs7.detached',
        signerName: 'Protean eGov Technologies (formerly NSDL e-Gov)',
        signerOrg: 'Income Tax Department',
        issuerName: 'NSDL CA Class 3 / CCA India Root 2014',
        signingTime: '19 Jan 2025, 09:22:15 IST',
        signingTimeSource: 'timestamp',
        digestAlgorithm: 'SHA-256',
        signatureAlgorithm: 'RSA 2048-bit',
        certSerial: '7C 11 09 AE BD 45 99 82 31 00',
        certValidFrom: '30 Dec 2023, 00:00:00 IST',
        certValidTo: '30 Dec 2026, 23:59:59 IST',
        integrityOk: true,
        signatureOk: true,
        chainOk: true,
        coversWholeDocument: true,
        trustedRoot: 'CCA India Root Certificate 2014',
        chain: [
          'Income Tax Department PAN Dispatch Signer 04',
          'Protean eGov Sub-CA Class 3',
          'CCA India Root Certificate 2014'
        ],
        problems: []
      }
    ],
    bytes: new Uint8Array(),
    sampleType: 'PAN e-Card',
    metadata: {
      documentType: 'Income Tax Department - Permanent Account Number Card',
      signerIdentity: 'Protean eGov Technologies (formerly NSDL e-Gov)',
      certificateAuthority: 'NSDL CA Class 3 / CCA India Root 2014',
      timestamp: '19 Jan 2025, 09:22:15 IST',
      hashAlgorithm: 'SHA-256 Digest',
      signatureAlgorithm: 'RSA 2048-bit with PKCS#7 signature format',
      crlOcspStatus: 'Valid · Verified against Tax Information Network CRL',
      certificateSerial: '7C 11 09 AE BD 45 99 82 31 00',
      validUntil: '30 Dec 2026, 23:59:59 IST',
      ccaTrustChain: [
        'CCA India Root Certificate 2014',
        'Protean eGov Sub-CA Class 3',
        'Income Tax Department PAN Dispatch Signer 04'
      ],
      docFingerprint: 'f102837465928374950182736452019283746501928374650192837465019283'
    }
  }
];
