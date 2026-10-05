import type { FaqItem } from '../types';

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Is the downloaded copy digitally signed?',
    answer: 'The downloaded copy retains the exact cryptographic integrity of your original document. SignValid verifies the embedded PKCS#7 digital signature against the official Controller of Certifying Authorities (CCA) India root trust list. The validated copy embeds a universally compatible visual representation of the verification state—the green checkmark and CCA certificate provenance badge—so that any PDF viewer, mobile device, or physical printout clearly shows the document is legally and cryptographically valid under the IT Act 2000.'
  },
  {
    id: 'faq-2',
    question: 'How should someone verify my document properly?',
    answer: 'Any recipient or verifying officer can inspect your validated document in two ways: (1) By checking the embedded cryptographic signature properties in Adobe Acrobat Reader or any PDF reader that has the CCA India 2014 root certificate installed, or (2) By scanning the verification QR code printed on the SignValid verification badge, which confirms the SHA-256 fingerprint, signing authority, and timestamp issued by the official CA.'
  },
  {
    id: 'faq-3',
    question: 'Do you store my documents?',
    answer: 'No. Never. SignValid operates on a strict zero-retention architecture. Your PDF files are read entirely into ephemeral browser and memory buffers solely to parse the digital signature directory, extract the X.509 certificate chain, and calculate the SHA-256 cryptographic digest. Once verification is finished, all buffers are purged immediately. No files, personal identity numbers, biometric data, names, or addresses are ever written to disk or stored in any database.'
  },
  {
    id: 'faq-4',
    question: 'Which documents does SignValid support?',
    answer: 'SignValid supports all digital PDFs issued by Indian central and state government authorities that contain an embedded X.509 / PKCS#7 digital signature. This includes e-Aadhaar cards from UIDAI, PAN e-cards from NSDL/Protean and UTIITSL, state e-District certificates (birth, death, income, caste, nativity, legal heir), DigiLocker documents, CBSE marksheets, e-Court orders, and land revenue records (Patta/Chitta).'
  },
  {
    id: 'faq-5',
    question: 'Why does Adobe show "Validity Unknown" on authentic documents?',
    answer: 'Adobe Acrobat Reader relies on its proprietary Adobe Approved Trust List (AATL) and the host operating system trust store. The Indian Controller of Certifying Authorities (CCA) root certificate is not included in standard global AATL default bundles unless manually imported by the user. Because Adobe does not have the India CCA root certificate pre-installed, it defaults to showing a yellow question mark "? Validity Unknown"—even though the signature is 100% genuine and legally binding under Section 3 of India’s IT Act 2000.'
  },
  {
    id: 'faq-6',
    question: 'What should I do if validation fails on a genuine document?',
    answer: 'If validation indicates an issue, verify that your PDF is an original download directly from the government portal (e.g. UIDAI or Seva Sindhu) and has not been opened and re-saved in an editor like Microsoft Word, Preview, or an online PDF compressor, which destroys the cryptographic PKCS#7 envelope. If you password-protected your PDF, make sure to enter the password when prompted so SignValid can inspect the signature payload.'
  },
  {
    id: 'faq-7',
    question: 'Can I validate multiple files simultaneously?',
    answer: 'Yes! You can drag and drop multiple PDF files or select several files at once (up to 25 MB and 50 pages each). SignValid queues and verifies them sequentially in parallel memory pipelines, allowing you to review each document’s verification breakdown and download the validated copies individually or as a batch.'
  },
  {
    id: 'faq-8',
    question: 'Is SignValid affiliated with the government?',
    answer: 'SignValid is an independent public utility project created to solve the persistent yellow question mark confusion on Indian citizen documents. We are not officially affiliated with, endorsed by, or partnered with UIDAI, the Government of India, or any state government portal. We use open cryptographic standards (PKCS#7, RFC 5280, ISO 32000-1) and the publicly available CCA India trust certificates to verify authenticity.'
  }
];
