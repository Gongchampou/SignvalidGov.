Create a responsive web application that replicates the design, copy, structure, and functionality of SignValid (https://www.signvalid.in).

### 1. Tech Stack & Styling Guidelines
- **Framework**: Next.js (App Router) or React + Vite with TypeScript.
- **Styling**: Tailwind CSS with clean utility classes.
- **Icons**: Lucide React (`CheckCircle`, `AlertCircle`, `UploadCloud`, `FileText`, `ShieldCheck`, `ChevronDown`, `ArrowRight`).
- **Typography**: Clean modern sans-serif (`Inter`, system-ui).
- **Color Palette**:
  - Primary Green: `#126B44` / `#1B7A4D` (branding, buttons, valid state badges)
  - Light Mint Tint: `#F4F8F5` (hero section background, callout banners)
  - Card & Modal Background: `#FFFFFF`
  - Warning Yellow: `#FEF3C7` (background) / `#D97706` (text/border for "Validity Unknown")
  - Success Green: `#DCFCE7` (background) / `#15803D` (text/border for "Signature Valid")
  - Headings: `#1F2937` (Dark Charcoal)
  - Body Text: `#4B5563` (Slate Gray)
  - Borders: `#E5E7EB` (subtle gray) / `#A7F3D0` (dashed upload border)

---

### 2. Page Sections & Layout

#### A. Header / Navigation
- Fixed top navigation bar with a subtle bottom border.
- **Brand (Left)**: Green badge icon with a checkmark and bold text **SignValid**.
- **Navigation (Right)**:
  - Links: `Validate`, `Documents`, `Trusted Authorities`, `Guides`, `About`.
  - Clean hover underlines or subtle opacity transitions.

#### B. Hero Section (Split 2-Column Layout)
- **Background**: Soft mint gradient (`#F4F8F5`).
- **Left Column**:
  - Pill badge: *"Validate Indian government PDF signatures — and fix the yellow question mark for good."*
  - Main Heading: *"Validate Indian Digital Signatures"*
  - Description: Explain validating e-Aadhaar, state e-District certificates, DigiLocker files, and PAN e-cards against India's official Controller of Certifying Authorities (CCA) root trust store, producing a universal display copy with a permanent green checkmark.
  - Value propositions with green tick icons:
    - `Free · no signup`
    - `Files are processed in memory and never stored`
    - `Works in any viewer and on printouts`
    - `Validate many PDFs at once`
  - Visual before-and-after graphic:
    - Card 1: Yellow warning pill `? Validity Unknown`
    - Arrow indicator: `→`
    - Card 2: Green success pill `✓ Signature Valid`
  - Dynamic social proof counter: *"49,550+ documents validated so far"* with link *"See the numbers →"*.
- **Right Column (Interactive Drag-and-Drop Area)**:
  - Border: Dashed light green with rounded corners (`rounded-2xl`).
  - Content:
    - Green upload tray icon.
    - Title: *"Drop your PDFs here"*
    - Subtext: *"or"*
    - Button: `"Choose files"` (Pill-shaped, `#126B44`).
    - File type hint: *"e-Aadhaar, birth / income / community certificate, DigiLocker PDF, PAN e-card..."*
    - File size notice: *"Up to 25 MB and 50 pages each. Files are processed in memory and never stored."*
    - Keyboard shortcut hint: *"Tip: you can also paste copied files here with Ctrl+V."*

#### C. Verification Results Card (State UI)
- Provide a card that displays after a PDF is uploaded:
  - File header with document name, file size, and status badge (`Pass: Valid Signature`).
  - Metadata breakdown grid:
    - Document Type (e.g., e-Aadhaar / e-District Certificate).
    - Signer Identity (e.g., UIDAI, State Authority).
    - Certificate Authority (e.g., eMudhra Sub CA - Class 3 / CCA India).
    - Timestamp (Signed date and time in IST).
    - Integrity checks: Hash match OK (SHA-256), PKCS#7 signature valid.
  - CTAs: `"Download Validated PDF"` and `"View Full Verification Report"`.

#### D. Educational Explainer: "Why does Adobe show a yellow question mark?"
- Visual comparison detailing why Adobe Acrobat Reader defaults to `? Validity Unknown` (due to missing Indian CCA root certificates in standard OS/Adobe trust lists).
- Explain how SignValid matches certificates against India's CCA root hierarchy and embeds a universally compatible visual indicator.

#### E. 3-Step Process: "How SignValid works"
1. **Upload PDF**: Processed strictly in memory; never saved to disk.
2. **CCA Trust Verification**: Extracts PKCS#7 signatures, checks certificate path and CRL/OCSP revocation against official Indian CAs.
3. **Download Validated Copy**: Produces an updated PDF containing the permanent green tick visible on all viewers, phones, and printed copies.

#### F. Supported Documents Grid
Interactive categorized grid of supported Indian digital certificates:
- **Identity & Tax**: e-Aadhaar (UIDAI), PAN e-card (NSDL/UTIITSL), e-Passports.
- **State e-District Services**: Birth, Death, Caste, Income, Residence, Legal Heir certificates across state portals (TN eSevai, Karnataka Seva Sindhu, Kerala e-District, Maharashtra, UP, etc.).
- **Digital Repositories**: DigiLocker issued documents, CBSE & university marksheets.
- **Revenue & Judiciary**: e-Courts judgments, Land records (Patta/Chitta, RoR, Khata), Registered sale deeds.

#### G. Trusted Certificate Authorities (CCA India)
- Grid or badge showcase of authorized Certifying Authorities:
  - eMudhra, C-DAC, NSDL/Protean, NIC (National Informatics Centre), Capricorn CA, Safescrypt (Sify), Pantagon Sign, Vsign.

#### H. Zero-Retention & Privacy Guarantee Banner
- Standalone mint-colored callout card:
  - Heading: *"Your document never leaves the request"*
  - Key points:
    - Zero data retention: Files are evaluated in RAM and immediately discarded.
    - Signature metadata inspection only: No personal data (names, Aadhaar numbers, addresses) is extracted or logged.
    - Transparently ad-supported without selling user data.
  - Central CTA: `"Validate your document now"`.

#### I. Frequently Asked Questions (Accordion)
- Expandable accordion items answering:
  1. Is the downloaded copy digitally signed?
  2. How should someone verify my document properly?
  3. Do you store my documents?
  4. Which documents does SignValid support?
  5. Why does Adobe show "Validity Unknown" on authentic documents?
  6. What should I do if validation fails on a genuine document?
  7. Can I validate multiple files simultaneously?
  8. Is SignValid affiliated with the government?

#### J. Footer & Disclaimers
- Multi-column footer:
  - **Guides**: e-Aadhaar validation, State e-District certificates, Fixing "Validity Unknown", DigiLocker signatures.
  - **About & Legal**: About SignValid, What's New, Contact, Privacy Policy, Terms of Service.
- Mandatory legal notice:
  - *"SignValid is an independent tool and is not affiliated with UIDAI, the Government of India, or any state government. Files are processed in memory and never stored."*

#### K. Cookie / Analytics Banner
- Floating bottom-right banner:
  - Privacy-first notice about anonymous analytics without tracking document contents.
  - Action buttons: `Decline` (outline) and `Allow analytics` (solid green).

---

### 3. Interactive Behaviors & JavaScript Logic
- Implement drag-and-drop state transitions (drag over, drag leave, drop).
- Support clipboard paste (`window.addEventListener('paste', ...)`).
- Allow multiple file selections up to 25 MB each.
- Provide a working mock verification pipeline with realistic loading states and downloadable sample outputs.