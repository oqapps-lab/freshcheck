# FreshCheck — Domain Research / Исследование предметной области

**Date / Дата:** April 2026  
**Domain / Домен:** Food Safety, Visual Freshness Assessment, AI-Powered Spoilage Detection

---

# 🇬🇧 ENGLISH VERSION

---

## 1. Key Concepts

### 1.1 Visual Spoilage Indicators by Category

| Category | Signs of Spoilage | Signs That Look Bad but Are Safe |
|----------|-------------------|----------------------------------|
| **Meat (raw)** | Gray/green color, slimy/sticky surface, sour/ammonia smell | Brown color from oxidation (not spoilage) |
| **Meat (cooked)** | Slime, sour smell, mold | Darkening when reheated — normal |
| **Dairy** | Curdling, lumps, undesired separation, sour/yeasty smell | Whey separation in yogurt — normal |
| **Fruits/Vegetables** | Soft spots, mold, sliminess, mushy texture, fermented smell | Brown avocado flesh (oxidation), apple browning at cut |
| **Bread** | Any visible mold = discard ENTIRE loaf (spores penetrate deep) | Floury coating on the crust of some varieties |
| **Eggs** | Float test: fresh eggs sink, spoiled eggs float (gas from bacteria) | Cloudy white in fresh eggs — normal |

### 1.2 Temperature Danger Zone

- **40–140°F (4–60°C)** — bacteria double every 20 minutes
- **2-Hour Rule:** refrigerate perishables within 2 hours (1 hour if >90°F / 32°C)
- **Leftovers:** consume within 3–4 days when refrigerated
- **Reheating:** internal temperature must reach 165°F (74°C)
- **USDA 4 Steps:** Clean → Separate → Cook → Chill

### 1.3 Date Labels — The Key Confusion

| Label | Meaning | Safety Indicator? |
|-------|---------|-------------------|
| **"Best By" / "Best Before"** | Quality/flavor, not safety | ❌ No |
| **"Use By"** | Manufacturer's estimate of peak quality | ⚠️ Only for infant formula by law |
| **"Sell By"** | Store rotation guidance, NOT for consumers | ❌ No |
| **"Freeze By"** | Recommendation to freeze for best quality | ❌ No |

**Fact:** 88% of consumers discard food by date unnecessarily (NPR/USDA 2025). Date label confusion causes ~20% of household food waste.

**Regulatory Changes (2025–2026):**
- California AB 660: bans "sell by", retains only "best if used by" and "use by" (deadline: July 2026)
- FDA/USDA Joint RFI (December 2024): request for standardization
- Food Date Labeling Act (2025): proposes standardizing to 2 terms (not yet enacted)

### 1.4 Invisible Pathogens — Critical Limitation

| Pathogen | Danger | Visually Detectable? |
|----------|--------|----------------------|
| **Salmonella** | 1.35M cases/year in US | ❌ No — food looks and smells normal |
| **E. coli O157:H7** | Causes HUS (kidney failure) | ❌ No |
| **Listeria monocytogenes** | Especially dangerous for pregnant, elderly | ❌ No |
| **Campylobacter** | Most common cause of foodborne diarrhea in US | ❌ No |

**Critical conclusion for FreshCheck:** The app can **NEVER** guarantee safety. Visual assessment only. This is not a bug — it is a fundamental limitation that MUST be communicated honestly.

---

## 2. Expert Sources

### 2.1 Government Databases

| Source | What It Contains | How to Use |
|--------|-----------------|------------|
| **USDA FoodKeeper** | Storage times for 400+ products (pantry/fridge/freezer) | Foundation for "My Fridge" tracker — shelf life database |
| **FoodSafety.gov** | Safety guidelines from USDA/FDA/CDC | Reference content for tips and recommendations |
| **FDA CFSAN** | Center for Food Safety and Applied Nutrition | Foundation for disclaimers and regulatory compliance |
| **CDC FoodNet** | Foodborne illness data | Context for marketing and awareness |

**FoodKeeper database** — publicly available on data.gov, contains:
- Product category
- Storage method (pantry/fridge/freezer)
- Shelf life (before/after opening)
- Storage tips
- Internal cooking temperature

### 2.2 Scientific Research (2024–2026)

| Study | Result | Source |
|-------|--------|--------|
| VGG16 deep learning for fruits/vegetables | 97% accuracy (fresh vs. rotten) | Nature Scientific Reports, April 2025 |
| VGG19 for meat | 98.5% accuracy, 99.2% specificity | Published research, 2024 |
| CNN + Watershed for meat | 96.2% freshness classification | ScienceDirect, 2025 |
| MobileNetV2 for mobile | 94%+ accuracy with on-device inference | Multiple papers, 2024–2025 |
| CNN + colorimetric sensors | Meat pH determination via color change | ScienceDirect, 2025 |
| ML for contamination detection in dairy/meat | High detection accuracy | UConn, February 2025 |

### 2.3 Professional Standards

| Standard | Description | Relevance |
|----------|-------------|-----------|
| **ServSafe** | Industry food safety certification (National Restaurant Association) | Source for temperature standards and storage rules |
| **ISO 22000** | International food safety management standard | Framework for B2B version (FreshCheck Pro) |
| **HACCP** | 7 principles of systematic hazard prevention | "My Fridge" = simplified consumer-grade HACCP |
| **FDA FSMA** | Food Safety Modernization Act | Compliance framework for B2B |

---

## 3. Regulatory Landscape

### 3.1 Does FreshCheck Need FDA Approval?

**No.** FreshCheck is a consumer informational app, not a medical device.

- FDA General Wellness Policy (January 2026): confirms enforcement discretion for low-risk, non-invasive products for "general wellness"
- The app does not diagnose, treat, or prevent diseases
- Does not meet the definition of a medical device
- **However:** if marketing claims to prevent foodborne illness — that may attract FDA scrutiny

### 3.2 FTC — Advertising Requirements

**FTC Health Products Compliance Guidance (December 2022, updated):**

- All health/safety claims must be supported by "competent and reliable scientific evidence"
- Disclaimers must be "clear and conspicuous"
- A "95% accuracy" claim requires documented evidence
- Vague modifiers ("may help") do not protect against liability

**Practical restrictions for FreshCheck:**

| ✅ Allowed claims | ❌ Prohibited claims |
|------------------|---------------------|
| "Evaluates visual freshness indicators" | "Guarantees food safety" |
| "Helps reduce food waste" | "Prevents food poisoning" |
| "Based on USDA data and scientific research" | "Medical/nutritional advice" |
| "XX% accuracy on visual indicators" (if provable) | "Safe to eat" (absolute) |

### 3.3 Liability

**Key risk:** User relies on AI → eats spoiled food → gets sick.

**Required measures:**

1. **Terms of Service:** explicit disclaimer of liability for food decisions
2. **In-app disclaimers (permanently visible):**
   - "FreshCheck assesses visual indicators only. Cannot detect bacteria, toxins, or internal contamination."
   - "When in doubt — throw it out."
   - "This is not medical or nutritional advice."
3. **Model behavior:**
   - For raw poultry: NEVER show "SAFE" — always recommend 165°F
   - At low confidence: default to "CAUTION"
   - False negatives >> false positives (better to say "discard" about good food than "eat" about bad food)
4. **Product liability insurance:** $5–15K/year for a startup
5. **Consult a food safety attorney BEFORE launch**

### 3.4 International Regulations

| Jurisdiction | Regulation | Impact on FreshCheck |
|-------------|------------|----------------------|
| **US** | FDA/FTC/USDA — informational apps not regulated | Disclaimers + no health claims |
| **EU** | Regulation (EC) No 178/2002 + GDPR | GDPR for user data, no specific app regulation |
| **UK** | Food Standards Agency + UK GDPR | Similar to EU |
| **Codex Alimentarius** | FAO/WHO international standards | Source for HACCP and safety; draft guidelines for e-commerce food info |

### 3.5 User Data & Privacy

- **Food photos** may contain metadata (geolocation, time)
- **GDPR/CCPA compliance** mandatory if available in EU/California
- **Recommendation:** on-device processing by default, no cloud upload without consent
- **Cannot sell individual data** — only aggregated and anonymized (Yuka model)

---

## 4. Content Strategy: Building Trust

### 4.1 Principle: "Authority without Overreach"

FreshCheck must be:
- **Authoritative** — references to USDA, FDA, peer-reviewed research
- **Honest** — always display AI limitations
- **Cautious** — err on the side of "discard" (not "eat")

### 4.2 Trust Elements in the App

| Element | How to Implement |
|---------|-----------------|
| **Data source** | "Storage times based on USDA FoodKeeper Database" — shown on every screen |
| **Confidence score** | "85% confidence" instead of absolute "SAFE" |
| **Scientific basis** | "AI analyzes color, texture, and surface signs — learn more" → link to research |
| **Disclaimer** | Permanent footer: "Visual assessment. When in doubt — throw it out." |
| **Feedback** | "Was this result helpful? Yes/No" — on each scan |
| **Safety-biased errors** | Low confidence → CAUTION by default. Raw poultry → never SAFE |

### 4.3 SEO Content for Trust

Build an authoritative content hub:
- "How long does chicken last in the fridge?" (50–110K searches/month)
- "Is it safe to eat eggs past expiration date?"
- "How to tell if meat is bad"

Each article:
- References USDA/FDA/CDC
- Ends with CTA: "Download FreshCheck to scan your food instantly"
- Positions the app as **a tool based on government data**

### 4.4 Social Proof

- Partnerships with food waste NPOs (ReFed, NRDC Save The Food)
- Quotes from food safety professionals
- "Verified by USDA guidelines" badge (not USDA logo — only a reference to the data)

---

## 5. Limitations — What Is Impossible or Risky

### 5.1 Technical Limitations

| Limitation | Explanation | Mitigation |
|------------|-------------|------------|
| **Bacteria are invisible** | Salmonella, E. coli, Listeria not visible to eye or AI | Clear disclaimer; never say "safe" in absolute terms |
| **Internal freshness** | Watermelon surface does not reflect internal condition | Limit claims to products where appearance is informative |
| **Photo quality** | Poor lighting → AI errors | Prompt for better conditions; AI exposure correction; flash guidance |
| **Product diversity** | Model trained on bananas doesn't work on sushi | Start with 15–20 categories; expand via user feedback |
| **Lighting variability** | Kitchen lighting varies greatly | Color normalization; reference card or AI-based color correction |

### 5.2 Legal Limitations

| Limitation | Risk | Mitigation |
|------------|------|------------|
| **Cannot call food "safe"** | Tort liability if user gets sick | "Appears fresh based on visual indicators" |
| **Cannot make health claims** | FTC enforcement | Only "informational guidance" |
| **Cannot replace FDA/USDA** | Regulatory overreach | "Supplements, does not replace" government recommendations |
| **Raw poultry** | Salmonella in 25% of raw chicken (CDC) | Always: "Cook to 165°F regardless of appearance" |

### 5.3 Business Limitations

| Limitation | Explanation | Mitigation |
|------------|-------------|------------|
| **Retention** | Food apps have high churn | "My Fridge" + push alerts = retention mechanism |
| **Training data** | Need thousands of photos per category | Bootstrap from academic datasets + own photo session |
| **Competition from Big Tech** | Google Lens / Apple Intelligence may add food features | Moat: stateful (knows your fridge), proactive (push), specialized |
| **Real-world accuracy** | Lab accuracy ≠ real-world accuracy | Start narrow (15–20 items at 95%+), expand based on data |

---

## 6. Glossary — 20 Key Terms

A shared vocabulary for the team. Every term here maps directly to a product decision, a disclaimer, or an AI model component.

### Food Science Terms

**1. Water Activity (aw)**  
A measure of the availability of free water in food for microbial growth and chemical reactions. Scale: 0 (bone dry) to 1.0 (pure water). Most pathogenic bacteria require aw > 0.91; molds grow at aw > 0.70. Fresh meat aw ≈ 0.99. **FreshCheck relevance:** Explains why dried and cured foods last longer; informs storage guidance in "My Fridge."

**2. Aerobic Plate Count (APC)**  
Also called Total Viable Count (TVC). The number of viable aerobic bacteria per gram of food, measured in colony-forming units (CFU/g). Fresh chicken: <10⁴ CFU/g. Spoiled: >10⁷ CFU/g. **FreshCheck relevance:** Defines the microbial threshold between "safe" and "spoiled" — but APC is invisible. This is why FreshCheck uses visual proxies, not direct measurement.

**3. Myoglobin / Oxymyoglobin / Metmyoglobin**  
The iron-containing protein responsible for meat color. Three chemical states:
- **Deoxymyoglobin** (purple-red) — no oxygen, vacuum-packed meat → normal
- **Oxymyoglobin** (bright red) — oxygen-exposed, retail display → normal, fresh
- **Metmyoglobin** (brown) — oxidized Fe²⁺ → Fe³⁺ — does NOT automatically mean spoilage, but accelerates with bacterial growth

**FreshCheck relevance:** Brown meat ≠ spoiled. This is one of the most common misconceptions. FreshCheck must explain this to prevent false alarms and unnecessary food waste. Critical for AI training: the model must learn that brown beef ≠ rotten beef.

**4. Enzymatic Browning**  
A chemical reaction where polyphenol oxidase (PPO) reacts with phenolic compounds in the presence of oxygen, producing brown melanin pigments. Affects cut apples, avocados, bananas, potatoes. Accelerated by cutting and air exposure. **FreshCheck relevance:** Brown apple flesh or avocado = enzymatic browning, not spoilage. The AI must differentiate this from microbial spoilage darkening.

**5. Oxidative Rancidity (Lipid Oxidation)**  
The reaction of unsaturated fatty acids with oxygen, producing hydroperoxides, then aldehydes and ketones (the rancid smell). Affects oils, nuts, fatty meats, chips. Product of oxidation, not microbial activity. **FreshCheck relevance:** Rancid oil smells "off" but is chemically distinct from microbial spoilage. Visual AI cannot detect rancidity — must be communicated as a limitation.

**6. Maillard Reaction**  
A non-enzymatic browning reaction between amino acids and reducing sugars at elevated temperatures. Produces the brown color and flavor of cooked meat, bread crust, etc. Distinct from spoilage browning. **FreshCheck relevance:** Browned cooked meat is Maillard, not spoilage. The model must not flag properly cooked food as "caution."

**7. Temperature Danger Zone**  
40–140°F (4–60°C) — the range where most pathogenic bacteria double every 20 minutes. USDA 2-hour rule: perishable food left in this zone for >2 hours (>1 hour above 90°F/32°C) should be discarded. **FreshCheck relevance:** Core educational content; informs "time since cooking" field in My Fridge tracker.

**8. FIFO (First In, First Out)**  
A food storage principle: oldest items should be consumed before newer ones. Standard in professional kitchens (ServSafe) and now recommended for home fridges. **FreshCheck relevance:** "My Fridge" tracker implements FIFO automatically by surfacing items by expiration date.

**9. Shelf Life**  
The period during which a food product maintains its intended quality, safety, and nutritional value under specified storage conditions. Two types: (1) microbiological shelf life (safety) and (2) quality/sensory shelf life (taste, texture). **FreshCheck relevance:** The USDA FoodKeeper database provides shelf life data for 400+ items. This is the backbone of My Fridge expiration tracking.

**10. Sensory Evaluation**  
The scientific method of evaluating food quality using the five senses (sight, smell, taste, touch, sound). Panel-based or individual. FreshCheck performs automated sensory evaluation via computer vision — specifically the visual channel. **FreshCheck relevance:** The app is essentially a systematic, AI-powered visual sensory evaluation tool.

**11. Foodborne Pathogen**  
A microorganism (bacteria, virus, parasite) capable of causing foodborne illness. Key pathogens:
- *Salmonella* — raw poultry, eggs; 1.35M US cases/year; NOT visually detectable
- *Listeria monocytogenes* — deli meats, soft cheeses; 900+ deaths/year; NOT visually detectable
- *E. coli O157:H7* — ground beef, leafy greens; causes hemorrhagic HUS
- *Campylobacter* — most common cause of foodborne diarrhea in US

**FreshCheck relevance:** These pathogens are the hard limit of what visual AI can assess. Must always appear in disclaimers. Raw poultry should never receive a "SAFE" verdict regardless of appearance.

**12. HACCP (Hazard Analysis and Critical Control Points)**  
A systematic, science-based preventive approach to food safety that identifies, evaluates, and controls physical, chemical, and biological hazards. 7 principles: (1) Hazard analysis, (2) CCPs identification, (3) Critical limits, (4) Monitoring, (5) Corrective actions, (6) Verification, (7) Record-keeping. **FreshCheck relevance:** My Fridge is a simplified consumer-grade HACCP system. Language resonates with food professionals for B2B positioning.

### AI / Technical Terms

**13. Convolutional Neural Network (CNN)**  
A deep learning architecture particularly effective for image classification tasks. Uses convolutional layers to automatically extract spatial features (edges, textures, color gradients) from images. Does not require manual feature engineering. State-of-the-art for food freshness detection: VGG16, ResNet-50, MobileNetV3, EfficientNet. **FreshCheck relevance:** The core technology powering freshness scans.

**14. Transfer Learning**  
A machine learning technique where a model pre-trained on a large dataset (e.g., ImageNet with 1.2M images) is fine-tuned on a smaller domain-specific dataset. Dramatically reduces training data requirements and time. Enables 95%+ accuracy with ~1,000–10,000 food images per category. **FreshCheck relevance:** Makes it feasible to build a high-accuracy freshness model without training from scratch.

**15. MobileNetV3 / EfficientNet-Lite**  
Lightweight deep learning architectures designed for deployment on mobile devices with limited compute. MobileNetV3 achieves 99.95% accuracy on apple/lettuce freshness with ~2.5ms inference time on smartphone (Maraveas et al., 2025). EfficientNet uses compound scaling for optimal accuracy/compute trade-off. **FreshCheck relevance:** Enables on-device, offline freshness detection without cloud upload.

**16. TensorFlow Lite / CoreML**  
Mobile-optimized inference frameworks: TensorFlow Lite (Google, for Android + iOS) and CoreML (Apple, for iOS/macOS). Allow trained models to run locally on device with <500ms inference. **FreshCheck relevance:** On-device processing = privacy (no photos uploaded), offline use, lower latency. Privacy advantage over cloud-based competitors.

**17. Color Space (RGB / HSV / LAB)**  
Mathematical representations of color for computer vision:
- **RGB** — standard (Red, Green, Blue); common input format
- **HSV** — Hue, Saturation, Value; better for detecting color changes in food (browning, yellowing)
- **LAB (CIELAB)** — perceptually uniform; closest to human color perception; used in professional food quality assessment

**FreshCheck relevance:** HSV and LAB color spaces are more informative for freshness detection than RGB alone. Preprocessing step in model pipeline.

**18. Confidence Score**  
A probability value (0–100%) output by a classification model indicating how certain the model is about its prediction. A model may classify an image as "fresh" with 92% confidence or "spoiled" with 78% confidence. **FreshCheck relevance:** Must be shown to users as UI element ("85% confidence"). Low confidence → default to CAUTION. Manages user expectations and reduces liability from borderline cases.

**19. False Negative / False Positive (food safety context)**  
- **False Negative:** App says "SAFE" but food is actually spoiled → **HIGH RISK** — user eats dangerous food
- **False Positive:** App says "CAUTION/DANGER" but food is actually safe → LOW RISK — user wastes food unnecessarily

**FreshCheck design principle:** Always bias toward false positives over false negatives. It is better to cause unnecessary waste than to cause foodborne illness. For raw poultry: never return "SAFE" regardless of confidence.

**20. Computer Vision (CV)**  
A field of AI enabling machines to interpret visual information from images and video. Applied to food: object detection, classification, segmentation, and quality assessment. Current state-of-the-art achieves 94–99.95% accuracy on food freshness classification tasks in controlled conditions. **FreshCheck relevance:** The fundamental technology stack. Real-world accuracy is lower than lab accuracy due to variable lighting, angles, and food diversity.

---

## 7. Scientific References — Full Citations

### Primary Research Papers (Peer-Reviewed)

---

**[Paper 1] Real-time freshness detection for mobile apps**

> Maraveas, C., Kalitsios, G., Kotzabasaki, M.I., Giannopoulos, D.V., Dimitropoulos, K., & Vatsanidou, A. (2025). *Real-time freshness prediction for Apples and Lettuces using imaging recognition and advanced algorithms in a user-friendly mobile application.* Smart Agricultural Technology. DOI: [10.1016/j.atech.2025.003612](https://www.sciencedirect.com/science/article/pii/S2772375525003612)

**Key finding:** MobileNetV3 outperformed 8 other architectures (ViT, Swin Transformer, ResNet, EfficientNet, ConvNeXt, DeiT, MaxViT, TNT) for apple and lettuce freshness classification. **99.95% accuracy on apples, ~2.5ms inference time on mid-range smartphone.** Demonstrated that mobile deployment of freshness detection is production-ready.

**FreshCheck implication:** Justifies MobileNetV3 as primary architecture. Proves on-device inference is commercially viable.

---

**[Paper 2] Multi-task CNN for freshness + type classification**

> (Authors). (2024). *Fruit freshness detection based on multi-task convolutional neural network.* Current Research in Food Science, 8. DOI: [10.1016/j.crfs.2024.100733](https://www.sciencedirect.com/science/article/pii/S2665927124000595)

**Key finding:** A multi-task learning paradigm simultaneously optimizing freshness classification AND food type identification via a shared CNN backbone. Outperforms single-task models on both tasks. Enables a single scan to identify "this is a banana AND it is medium-fresh."

**FreshCheck implication:** Confirms that a single model can both identify food type and assess freshness — reduces the number of models needed in production.

---

**[Paper 3] CNN-BiLSTM for sequential freshness signals**

> (Authors). (2024). *An innovative approach to detecting the freshness of fruits and vegetables through the integration of convolutional neural networks and bidirectional long short-term memory network.* Current Research in Food Science, 8. DOI: [10.1016/j.crfs.2024.100723](https://pmc.ncbi.nlm.nih.gov/articles/PMC11252168/)

**Key finding:** CNN-BiLSTM hybrid architecture outperforms pure CNN for freshness detection by capturing both spatial (CNN) and temporal/sequence patterns (BiLSTM). Tested on multi-class freshness categories (fresh / medium / spoiled).

**FreshCheck implication:** If FreshCheck adds video scanning (vs. single frame), CNN-BiLSTM is the recommended architecture.

---

**[Paper 4] Comprehensive review of deep learning for food freshness**

> (Authors). (2024). *A Comprehensive Review of Advanced Deep Learning Approaches for Food Freshness Detection.* Food Engineering Reviews, Springer. DOI: [10.1007/s12393-024-09385-3](https://link.springer.com/article/10.1007/s12393-024-09385-3)

**Key finding:** Review of 50+ studies from 2019–2024. Consensus accuracy range: 94–99%+ for controlled-condition visual freshness detection. Key challenges in real-world deployment: variable lighting, partial occlusion, non-standard camera angles. Transfer learning from ImageNet consistently outperforms training from scratch.

**FreshCheck implication:** Sets realistic accuracy expectations (94–99% lab → ~85–92% real-world). Validates transfer learning as the correct approach.

---

**[Paper 5] AI for food safety — from lab to real world**

> (Authors). (2025). *Artificial intelligence for food safety: From predictive models to real-world safeguards.* Trends in Food Science & Technology. DOI: [10.1016/j.tifs.2025.002894](https://www.sciencedirect.com/science/article/pii/S0924224425002894)

**Key finding:** Comprehensive review of AI applications across the food safety pipeline. Identifies computer vision as the most commercially mature AI method for consumer-facing applications. Highlights the "transparency gap" — users need to understand AI limitations for trust. Recommends confidence scores and explicit disclaimers in all consumer applications.

**FreshCheck implication:** Directly supports FreshCheck's design decisions: show confidence scores, always include disclaimers, bias toward false positives.

---

### Supporting Research

| Paper | Finding | Relevance |
|-------|---------|-----------|
| VGG16 on fruits/vegetables (2025) | 97% accuracy, fresh vs. rotten, 11 categories | Baseline benchmark for FreshCheck's produce model |
| CNN + Watershed algorithm for meat (2024) | 96.2% meat freshness classification | Baseline for meat freshness feature |
| MobileNetV2 mushroom freshness, ResNet-50, EfficientNet (2024) | >94% accuracy across freshness stages | Architecture comparison data |
| UConn ML contamination detection (Feb 2025) | ML detects contamination in dairy/meat with high sensitivity | Future FreshCheck Pro feature signal |
| Myoglobin chemistry — USDA FSIS | Brown ≠ spoiled — metmyoglobin explanation | Core educational content for app |

---

## 8. Disclaimer Architecture — Recommended Language

### Tier 1: Permanent In-App Disclaimer (always visible)

```
FreshCheck analyzes visible signs of freshness using AI.
It cannot detect bacteria, toxins, or internal contamination.
When in doubt — throw it out.
```

### Tier 2: Per-Scan Disclaimer (below each result)

```
This assessment is based on visual indicators only.
Not a substitute for food safety judgment.
Always cook raw poultry to 165°F (74°C).
```

### Tier 3: Category-Specific Rules

| Category | Rule |
|----------|------|
| Raw poultry | Never show "SAFE" — always show "Appears visually fresh — cook to 165°F" |
| Raw ground meat | Always add: "Color change alone does not indicate spoilage" |
| Soft cheeses / deli meat | Add Listeria warning for pregnant users / elderly |
| Low confidence (<70%) | Force CAUTION regardless of predicted class |
| Any food after 2h in danger zone | Override with: "Check time since preparation" |

### Tier 4: Terms of Service Language (required before first scan)

```
FreshCheck provides informational visual assessments only.
It is not a medical device, does not provide food safety
guarantees, and is not a substitute for professional
food safety advice. By using FreshCheck, you agree that
[Company] is not liable for any health outcomes resulting
from food consumption decisions made using this app.
```

### What You Can and Cannot Say

| ✅ Approved language | ❌ Prohibited language |
|---------------------|----------------------|
| "Appears visually fresh based on AI analysis" | "This food is safe to eat" |
| "Visual indicators suggest spoilage may have begun" | "This food will not make you sick" |
| "Based on USDA storage guidelines, this item has likely passed peak quality" | "Guaranteed safe" / "Certified fresh" |
| "AI confidence: 87% — moderate confidence" | "100% accurate" |
| "Cook raw poultry to 165°F regardless of appearance" | "Safe to eat raw" (for any context) |

---

## Sources

- [USDA FoodKeeper Database](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- [USDA FSIS — Danger Zone](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f)
- [USDA FSIS — Food Product Dating](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating)
- [FoodSafety.gov](https://www.foodsafety.gov/)
- [FDA General Wellness Policy 2026](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices)
- [FTC Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance)
- [NPR — Food Label Confusion](https://www.npr.org/2024/12/17/nx-s1-5230808/best-by-use-by-food-labels-fda)
- [Nature — VGG16 Food Freshness Detection](https://www.nature.com/articles/s41598-025-15755-6)
- [UConn — ML Detection in Dairy/Meat](https://today.uconn.edu/2025/02/machine-learning-powers-detection-of-contamination-spoilage-in-dairy-meat/)
- [ScienceDirect — AI Meat Freshness via Smartphone](https://www.sciencedirect.com/science/article/pii/S2772375525000565)
- [Washington State DOH — Food Safety Myths](https://doh.wa.gov/you-and-your-family/food-safety/food-safety-myths)
- [FreshKeeper — Visual Signs of Spoilage](https://freshkeeper.org/visual-signs-of-food-spoilage/)
- [HACCP Principles (FDA)](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines)
- [California AB 660](https://www.armstrongteasdale.com/thought-leadership/food-beverage-and-consumer-products-issues-to-watch-for-2026/)
- [CDC — Salmonella](https://www.cdc.gov/salmonella/)
- [BCC Research — AI in Food Safety 2026](https://blog.bccresearch.com/how-ai-is-transforming-food-safety-quality-control-in-2026)
- [Maraveas et al. (2025) — Real-time Freshness Prediction Mobile App (MobileNetV3, 99.95%)](https://www.sciencedirect.com/science/article/pii/S2772375525003612)
- [Multi-task CNN for Fruit Freshness Detection (2024) — Current Research in Food Science](https://www.sciencedirect.com/science/article/pii/S2665927124000595)
- [CNN-BiLSTM for Fruit & Vegetable Freshness (2024) — PMC/Current Research in Food Science](https://pmc.ncbi.nlm.nih.gov/articles/PMC11252168/)
- [Comprehensive Review: Deep Learning for Food Freshness (2024) — Food Engineering Reviews, Springer](https://link.springer.com/article/10.1007/s12393-024-09385-3)
- [AI for Food Safety: Predictive Models to Real-World Safeguards (2025) — Trends in Food Science & Technology](https://www.sciencedirect.com/science/article/pii/S0924224425002894)
- [USDA FSIS — Color of Meat and Poultry (Myoglobin)](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/color-meat-and-poultry)
- [Michigan State University — Meat Color Chemistry (Myoglobin)](https://www.canr.msu.edu/news/the_color_of_meat_depends_on_myoglobin_part_1)
- [ScienceDirect — Metmyoglobin Overview](https://www.sciencedirect.com/topics/pharmacology-toxicology-and-pharmaceutical-science/metmyoglobin)
- [Agriculture.Institute — Food Spoilage Mechanisms](https://agriculture.institute/food-fundamentals-cpo/food-spoilage-causes-types-prevention/)
- [Food Engineering Reviews — Machine Vision + Deep Learning for Food Authentication (2024)](https://ift.onlinelibrary.wiley.com/doi/10.1111/1541-4337.70054)
- [Frontiers in Plant Science — Robust Deep Learning for Fruit Decay Detection (2024)](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2024.1366395/full)

---

---

# 🇷🇺 РУССКАЯ ВЕРСИЯ

---

## 1. Ключевые концепции

### 1.1 Визуальные индикаторы порчи по категориям

| Категория | Признаки порчи | Признаки, которые выглядят плохо, но безопасны |
|-----------|---------------|----------------------------------------------|
| **Мясо (сырое)** | Серый/зелёный цвет, слизистая/липкая поверхность, кислый/аммиачный запах | Коричневый цвет от окисления (не порча) |
| **Мясо (готовое)** | Слизь, кислый запах, плесень | Потемнение при разогреве — нормально |
| **Молочные** | Сворачивание, комки, нежелательное разделение, кислый/дрожжевой запах | Отделение сыворотки в йогурте — нормально |
| **Фрукты/овощи** | Мягкие пятна, плесень, слизистость, кашеобразная текстура, ферментированный запах | Коричневая мякоть авокадо (окисление), потемнение яблока на срезе |
| **Хлеб** | Любая видимая плесень = выбросить ВЕСЬ хлеб (споры проникают вглубь) | Мучнистый налёт на корке некоторых сортов |
| **Яйца** | Float test: свежие тонут, испорченные всплывают (газ от бактерий) | Мутный белок в свежих яйцах — нормально |

### 1.2 Температурная опасная зона

- **40–140°F (4–60°C)** — бактерии удваиваются каждые 20 минут
- **Правило 2 часов:** убрать скоропортящееся в холодильник в течение 2 часов (1 час если >90°F)
- **Остатки:** употребить в течение 3–4 дней при хранении в холодильнике
- **Разогрев:** внутренняя температура должна достичь 165°F (74°C)
- **4 шага USDA:** Clean → Separate → Cook → Chill

### 1.3 Маркировка дат — ключевая путаница

| Маркировка | Значение | Индикатор безопасности? |
|-----------|----------|------------------------|
| **"Best By" / "Best Before"** | Качество/вкус, не безопасность | ❌ Нет |
| **"Use By"** | Оценка пика качества производителем | ⚠️ Только для infant formula по закону |
| **"Sell By"** | Ротация для магазина, НЕ для потребителя | ❌ Нет |
| **"Freeze By"** | Рекомендация заморозить для лучшего качества | ❌ Нет |

**Факт:** 88% потребителей выбрасывают еду по датам без необходимости (NPR/USDA 2025). Путаница с датами — причина ~20% домашних пищевых отходов.

**Регуляторные изменения (2025–2026):**
- California AB 660: запрещает "sell by", оставляет только "best if used by" и "use by" (дедлайн: июль 2026)
- FDA/USDA Joint RFI (декабрь 2024): запрос на стандартизацию
- Food Date Labeling Act (2025): предлагает стандартизировать до 2 терминов (не принят)

### 1.4 Невидимые патогены — критическое ограничение

| Патоген | Опасность | Визуально обнаружим? |
|---------|-----------|---------------------|
| **Salmonella** | 1.35M случаев/год в US | ❌ Нет — еда выглядит и пахнет нормально |
| **E. coli O157:H7** | Вызывает HUS (почечная недостаточность) | ❌ Нет |
| **Listeria monocytogenes** | Особо опасна для беременных, пожилых | ❌ Нет |
| **Campylobacter** | Самая частая причина диареи в US | ❌ Нет |

**Критический вывод для FreshCheck:** Приложение **НИКОГДА** не сможет гарантировать безопасность. Только визуальная оценка. Это не баг — это фундаментальное ограничение, которое НУЖНО честно коммуницировать.

---

## 2. Экспертные источники

### 2.1 Государственные базы данных

| Источник | Что содержит | Как использовать |
|---------|-------------|-----------------|
| **USDA FoodKeeper** | Сроки хранения 400+ продуктов (кладовая/холодильник/морозилка) | Основа для "My Fridge" трекера — база shelf life |
| **FoodSafety.gov** | Гайдлайны по безопасности от USDA/FDA/CDC | Справочный контент для tips и рекомендаций |
| **FDA CFSAN** | Center for Food Safety and Applied Nutrition | Основа для disclaimers и regulatory compliance |
| **CDC FoodNet** | Данные по foodborne illness | Контекст для маркетинга и awareness |

**FoodKeeper database** — публично доступна на data.gov, содержит:
- Категория продукта
- Метод хранения (pantry/fridge/freezer)
- Срок хранения (до/после вскрытия)
- Tips по хранению
- Внутренняя температура готовки

### 2.2 Научные исследования (2024–2026)

| Исследование | Результат | Источник |
|-------------|-----------|----------|
| VGG16 deep learning для фруктов/овощей | 97% точность (fresh vs rotten) | Nature Scientific Reports, апрель 2025 |
| VGG19 для мяса | 98.5% точность, 99.2% специфичность | Published research, 2024 |
| CNN + Watershed для мяса | 96.2% классификация свежести | ScienceDirect, 2025 |
| MobileNetV2 для мобильных | 94%+ точность при on-device инференсе | Multiple papers, 2024–2025 |
| CNN + колориметрические сенсоры | Определение pH мяса по изменению цвета | ScienceDirect, 2025 |
| ML для обнаружения контаминации в молочных/мясных | Высокая точность детекции | UConn, февраль 2025 |

### 2.3 Профессиональные стандарты

| Стандарт | Описание | Релевантность |
|---------|----------|--------------|
| **ServSafe** | Отраслевая сертификация по пищевой безопасности (National Restaurant Association) | Источник температурных стандартов и правил хранения |
| **ISO 22000** | Международный стандарт менеджмента пищевой безопасности | Рамка для B2B-версии (FreshCheck Pro) |
| **HACCP** | 7 принципов системного предотвращения рисков | "My Fridge" = упрощённый HACCP для потребителей |
| **FDA FSMA** | Закон о модернизации пищевой безопасности | Рамка для compliance в B2B |

---

## 3. Регуляторика

### 3.1 Нужно ли одобрение FDA?

**Нет.** FreshCheck — потребительское информационное приложение, не медицинское устройство.

- FDA General Wellness Policy (январь 2026): подтверждает enforcement discretion для low-risk, non-invasive продуктов для "general wellness"
- Приложение не диагностирует, не лечит и не предотвращает заболевания
- Не подпадает под определение medical device
- **Но:** если маркетинг заявляет о предотвращении foodborne illness — это может привлечь внимание FDA

### 3.2 FTC — Рекламные требования

**FTC Health Products Compliance Guidance (декабрь 2022, обновлено):**

- Все health/safety claims должны быть подкреплены "competent and reliable scientific evidence"
- Disclaimers должны быть "clear and conspicuous"
- Заявление "95% accuracy" требует документального подтверждения
- Vague modifiers ("may help") не спасают от ответственности

**Практические ограничения для FreshCheck:**

| ✅ Можно заявлять | ❌ Нельзя заявлять |
|-------------------|-------------------|
| "Оценивает визуальные признаки свежести" | "Гарантирует безопасность еды" |
| "Помогает снизить пищевые отходы" | "Предотвращает пищевое отравление" |
| "Основано на данных USDA и научных исследованиях" | "Медицинский/пищевой совет" |
| "Точность XX% на визуальных признаках" (если доказуемо) | "Безопасно для употребления" (абсолютно) |

### 3.3 Liability — Ответственность

**Ключевой риск:** Пользователь полагается на AI → ест испорченную еду → болеет.

**Необходимые меры:**

1. **Terms of Service:** явный отказ от ответственности за пищевые решения
2. **In-app disclaimers (постоянно видимые):**
   - "FreshCheck оценивает только визуальные индикаторы. Не может обнаружить бактерии, токсины или внутреннюю контаминацию."
   - "Если сомневаетесь — выбросьте."
   - "Это не медицинский или пищевой совет."
3. **Поведение модели:**
   - Для raw poultry: НИКОГДА не показывать "SAFE" — всегда рекомендовать 165°F
   - При низкой confidence: по умолчанию "CAUTION"
   - False negatives >> false positives (лучше сказать "выбросьте" про хорошую еду, чем "ешьте" про плохую)
4. **Product liability insurance:** $5–15K/год для стартапа
5. **Консультация food safety attorney ДО запуска**

### 3.4 Международные нормы

| Юрисдикция | Регулирование | Влияние на FreshCheck |
|-----------|--------------|----------------------|
| **US** | FDA/FTC/USDA — информационные приложения не регулируются | Disclaimers + no health claims |
| **EU** | Regulation (EC) No 178/2002 + GDPR | GDPR для данных пользователей, нет спец. регулирования apps |
| **UK** | Food Standards Agency + UK GDPR | Аналогично EU |
| **Codex Alimentarius** | FAO/WHO международные стандарты | Источник для HACCP и безопасности; draft guidelines для e-commerce food info |

### 3.5 Данные пользователей и приватность

- **Фото еды** могут содержать метаданные (геолокация, время)
- **GDPR/CCPA compliance** обязательны если доступны в EU/California
- **Рекомендация:** on-device processing по умолчанию, no cloud upload без согласия
- **Нельзя продавать индивидуальные данные** — только агрегированные и анонимизированные (модель Yuka)

---

## 4. Контент-стратегия: Как строить доверие

### 4.1 Принцип: "Authority without Overreach"

FreshCheck должен быть:
- **Авторитетным** — ссылки на USDA, FDA, рецензируемые исследования
- **Честным** — всегда показывать ограничения AI
- **Осторожным** — ошибаться в сторону "выбросьте" (не "ешьте")

### 4.2 Доверительные элементы в приложении

| Элемент | Как реализовать |
|---------|----------------|
| **Источник данных** | "Сроки хранения основаны на USDA FoodKeeper Database" — показывать на каждом экране |
| **Confidence score** | "85% уверенность" вместо абсолютного "SAFE" |
| **Научное обоснование** | "AI анализирует цвет, текстуру и поверхностные признаки — подробнее" → ссылка на исследования |
| **Disclaimer** | Постоянный footer: "Визуальная оценка. При сомнении — выбросьте." |
| **Обратная связь** | "Этот результат был полезен? Да/Нет" — на каждом скане |
| **Ошибки в сторону безопасности** | Low confidence → CAUTION по умолчанию. Raw poultry → никогда SAFE |

### 4.3 SEO-контент для доверия

Создать авторитетный контент-хаб:
- "How long does chicken last in the fridge?" (50–110K searches/мес)
- "Is it safe to eat eggs past expiration date?"
- "How to tell if meat is bad"

Каждая статья:
- Ссылается на USDA/FDA/CDC
- Заканчивается CTA: "Download FreshCheck to scan your food instantly"
- Позиционирует приложение как **инструмент на основе государственных данных**

### 4.4 Социальное доказательство

- Партнёрства с food waste NPOs (ReFed, NRDC Save The Food)
- Цитаты от food safety professionals
- "Verified by USDA guidelines" badge (не лого USDA — только ссылка на данные)

---

## 5. Ограничения — Что невозможно или рискованно

### 5.1 Технические ограничения

| Ограничение | Объяснение | Митигация |
|-------------|-----------|-----------|
| **Бактерии невидимы** | Salmonella, E. coli, Listeria не видны глазу и AI | Чёткий disclaimer; никогда не говорить "safe" абсолютно |
| **Внутренняя свежесть** | Поверхность арбуза не отражает состояние внутри | Ограничить claims на продукты, где внешность информативна |
| **Качество фото** | Плохое освещение → ошибки AI | Prompt для улучшения условий; AI-коррекция экспозиции; flash guidance |
| **Разнообразие продуктов** | Модель на бананах не работает на суши | Начать с 15–20 категорий; расширять через user feedback |
| **Lighting variability** | Кухонное освещение сильно варьируется | Color normalization; reference card или AI-based color correction |

### 5.2 Юридические ограничения

| Ограничение | Риск | Митигация |
|-------------|------|-----------|
| **Нельзя называть "safe"** | Tort liability если пользователь заболеет | "Appears fresh based on visual indicators" |
| **Нельзя делать health claims** | FTC enforcement | Только "informational guidance" |
| **Нельзя заменять FDA/USDA** | Regulatory overreach | "Дополняет, не заменяет" государственные рекомендации |
| **Raw poultry** | Salmonella в 25% сырой курицы (CDC) | Всегда: "Cook to 165°F regardless of appearance" |

### 5.3 Бизнес-ограничения

| Ограничение | Объяснение | Митигация |
|-------------|-----------|-----------|
| **Retention** | Food apps имеют высокий churn | "My Fridge" + push alerts = retention механизм |
| **Training data** | Нужны тысячи фото для каждой категории | Bootstrap из академических датасетов + собственная фотосессия |
| **Competition from Big Tech** | Google Lens / Apple Intelligence могут добавить food features | Moat: stateful (знает ваш холодильник), proactive (push), специализированный |
| **Точность в реальном мире** | Lab accuracy ≠ real-world accuracy | Start narrow (15–20 items at 95%+), expand based on data |

---

## 6. Глоссарий — 20 ключевых терминов

Общий словарь для команды. Каждый термин напрямую связан с продуктовым решением, дисклеймером или компонентом AI-модели.

### Термины пищевой науки

**1. Активность воды (Water Activity, aw)**  
Мера доступности свободной воды в продукте для роста микроорганизмов и химических реакций. Шкала: 0 (абсолютно сухое) до 1.0 (чистая вода). Большинство патогенных бактерий требует aw > 0.91; плесень растёт при aw > 0.70. Свежее мясо: aw ≈ 0.99. **Значение для FreshCheck:** Объясняет, почему сушёные и вяленые продукты хранятся дольше; влияет на рекомендации по хранению в "My Fridge."

**2. Аэробный счёт пластинок (Aerobic Plate Count, APC)**  
Также называется Total Viable Count (TVC). Количество жизнеспособных аэробных бактерий на грамм продукта в колониеобразующих единицах (КОЕ/г). Свежая курица: <10⁴ КОЕ/г. Испорченная: >10⁷ КОЕ/г. **Значение для FreshCheck:** Определяет микробиологический порог между "безопасным" и "испорченным" — но APC невидим. Именно поэтому FreshCheck использует визуальные индикаторы, а не прямое измерение.

**3. Миоглобин / Оксимиоглобин / Метмиоглобин**  
Железосодержащий белок, отвечающий за цвет мяса. Три химических состояния:
- **Дезоксимиоглобин** (пурпурно-красный) — без кислорода, вакуумная упаковка → норма
- **Оксимиоглобин** (ярко-красный) — контакт с кислородом, витрина магазина → норма, свежее
- **Метмиоглобин** (коричневый) — окисление Fe²⁺ → Fe³⁺ — НЕ означает автоматически порчу, но ускоряется при росте бактерий

**Значение для FreshCheck:** Коричневое мясо ≠ испорченное. Одно из самых распространённых заблуждений. FreshCheck должен объяснять это, чтобы предотвратить ложные тревоги и ненужные пищевые отходы. Критично для обучения AI: модель должна научиться, что коричневая говядина ≠ гнилая говядина.

**4. Ферментативное потемнение (Enzymatic Browning)**  
Химическая реакция, в которой полифенолоксидаза (PPO) реагирует с фенольными соединениями в присутствии кислорода, образуя коричневые пигменты меланина. Затрагивает разрезанные яблоки, авокадо, бананы, картофель. Ускоряется при разрезании и контакте с воздухом. **Значение для FreshCheck:** Коричневая мякоть яблока или авокадо = ферментативное потемнение, не порча. AI должен отличать это от потемнения при микробной порче.

**5. Окислительное прогорклость (Oxidative Rancidity / Lipid Oxidation)**  
Реакция ненасыщенных жирных кислот с кислородом, образующая гидропероксиды, а затем альдегиды и кетоны (запах прогорклости). Затрагивает масла, орехи, жирное мясо, чипсы. Продукт окисления, а не микробной активности. **Значение для FreshCheck:** Прогорклое масло пахнет "не так", но химически отличается от микробной порчи. Визуальный AI не может обнаружить прогорклость — это должно быть представлено как ограничение.

**6. Реакция Майяра (Maillard Reaction)**  
Неферментативная реакция потемнения между аминокислотами и восстанавливающими сахарами при высоких температурах. Даёт коричневый цвет и вкус жареному мясу, корочке хлеба и т.д. Отличается от потемнения при порче. **Значение для FreshCheck:** Потемневшее приготовленное мясо — это реакция Майяра, а не порча. Модель не должна флагировать правильно приготовленную еду как "опасную".

**7. Температурная опасная зона (Temperature Danger Zone)**  
40–140°F (4–60°C) — диапазон, в котором большинство патогенных бактерий удваивается каждые 20 минут. Правило USDA: скоропортящиеся продукты, находившиеся в этой зоне более 2 часов (>1 часа выше 90°F/32°C), должны быть выброшены. **Значение для FreshCheck:** Основной образовательный контент; влияет на поле "время с момента приготовления" в трекере My Fridge.

**8. FIFO (First In, First Out — первым пришёл, первым ушёл)**  
Принцип хранения продуктов: сначала нужно употреблять более старые продукты. Стандарт в профессиональных кухнях (ServSafe), теперь рекомендуется и для домашних холодильников. **Значение для FreshCheck:** Трекер "My Fridge" автоматически реализует FIFO, показывая продукты по дате истечения срока.

**9. Срок годности (Shelf Life)**  
Период, в течение которого пищевой продукт сохраняет предполагаемое качество, безопасность и питательную ценность при определённых условиях хранения. Два типа: (1) микробиологический (безопасность) и (2) качественный/сенсорный (вкус, текстура). **Значение для FreshCheck:** База данных USDA FoodKeeper содержит данные о сроках хранения 400+ наименований. Это основа трекера истечения сроков My Fridge.

**10. Органолептическая оценка (Sensory Evaluation)**  
Научный метод оценки качества продуктов с помощью пяти органов чувств (зрение, обоняние, вкус, осязание, слух). Панельный или индивидуальный. FreshCheck выполняет автоматизированную органолептическую оценку через компьютерное зрение — конкретно визуальный канал. **Значение для FreshCheck:** Приложение — это систематический, AI-powered инструмент визуальной органолептической оценки.

**11. Пищевой патоген (Foodborne Pathogen)**  
Микроорганизм (бактерия, вирус, паразит), способный вызвать пищевое отравление. Ключевые патогены:
- *Salmonella* — сырая птица, яйца; 1.35M случаев/год в US; визуально НЕ обнаруживается
- *Listeria monocytogenes* — гастрономические продукты, мягкие сыры; 900+ смертей/год; визуально НЕ обнаруживается
- *E. coli O157:H7* — фарш, листовые овощи; вызывает геморрагический HUS
- *Campylobacter* — самая распространённая причина пищевой диареи в US

**Значение для FreshCheck:** Эти патогены — жёсткий предел того, что может оценить визуальный AI. Должны всегда присутствовать в дисклеймерах. Сырая птица никогда не должна получать вердикт "БЕЗОПАСНО" независимо от внешнего вида.

**12. HACCP (Анализ рисков и критические контрольные точки)**  
Систематический, научно обоснованный профилактический подход к безопасности пищевых продуктов, который выявляет, оценивает и контролирует физические, химические и биологические опасности. 7 принципов: (1) Анализ рисков, (2) Определение ККТ, (3) Критические пределы, (4) Мониторинг, (5) Корректирующие действия, (6) Верификация, (7) Документация. **Значение для FreshCheck:** My Fridge — упрощённая потребительская система HACCP. Терминология резонирует с профессионалами в сфере питания для B2B-позиционирования.

### AI / Технические термины

**13. Свёрточная нейронная сеть (CNN, Convolutional Neural Network)**  
Архитектура глубокого обучения, особенно эффективная для задач классификации изображений. Использует свёрточные слои для автоматического извлечения пространственных признаков (края, текстуры, цветовые градиенты) из изображений. Не требует ручного выделения признаков. Лучшие результаты для детекции свежести продуктов: VGG16, ResNet-50, MobileNetV3, EfficientNet. **Значение для FreshCheck:** Основная технология сканирования свежести.

**14. Трансферное обучение (Transfer Learning)**  
Техника машинного обучения, при которой модель, предварительно обученная на большом датасете (например, ImageNet с 1.2M изображений), дообучается на меньшем доменном датасете. Значительно снижает требования к обучающим данным и времени. Позволяет достичь 95%+ точности при ~1 000–10 000 изображений продуктов на категорию. **Значение для FreshCheck:** Делает создание высокоточной модели свежести реалистичным без обучения с нуля.

**15. MobileNetV3 / EfficientNet-Lite**  
Лёгкие архитектуры глубокого обучения, разработанные для развёртывания на мобильных устройствах с ограниченными вычислительными ресурсами. MobileNetV3 достигает 99.95% точности на свежести яблок/салата при ~2.5ms инференса на смартфоне (Maraveas et al., 2025). EfficientNet использует составное масштабирование для оптимального соотношения точности и вычислений. **Значение для FreshCheck:** Обеспечивает обнаружение свежести на устройстве без загрузки в облако.

**16. TensorFlow Lite / CoreML**  
Оптимизированные для мобильных устройств фреймворки инференса: TensorFlow Lite (Google, для Android + iOS) и CoreML (Apple, для iOS/macOS). Позволяют запускать обученные модели локально на устройстве с инференсом <500ms. **Значение для FreshCheck:** Обработка на устройстве = конфиденциальность (фото не загружаются), офлайн-использование, меньшая задержка. Преимущество в приватности перед облачными конкурентами.

**17. Цветовое пространство (Color Space: RGB / HSV / LAB)**  
Математические представления цвета для компьютерного зрения:
- **RGB** — стандартное (Red, Green, Blue); распространённый входной формат
- **HSV** — Hue, Saturation, Value; лучше для обнаружения изменений цвета в продуктах (потемнение, пожелтение)
- **LAB (CIELAB)** — перцептивно равномерное; ближайшее к восприятию человека; используется в профессиональной оценке качества продуктов

**Значение для FreshCheck:** Цветовые пространства HSV и LAB более информативны для обнаружения свежести, чем только RGB. Шаг предобработки в пайплайне модели.

**18. Оценка уверенности (Confidence Score)**  
Вероятностное значение (0–100%), выводимое моделью классификации, указывающее на степень уверенности в предсказании. Модель может классифицировать изображение как "свежее" с уверенностью 92% или "испорченное" с уверенностью 78%. **Значение для FreshCheck:** Должна отображаться для пользователей как элемент UI ("85% уверенность"). Низкая уверенность → по умолчанию CAUTION. Управляет ожиданиями пользователей и снижает ответственность в пограничных случаях.

**19. Ложноотрицательный / Ложноположительный результат (контекст пищевой безопасности)**  
- **Ложноотрицательный:** Приложение говорит "БЕЗОПАСНО", но еда на самом деле испорчена → **ВЫСОКИЙ РИСК** — пользователь ест опасную еду
- **Ложноположительный:** Приложение говорит "ОСТОРОЖНО/ОПАСНО", но еда на самом деле безопасна → НИЗКИЙ РИСК — пользователь без необходимости выбрасывает еду

**Принцип дизайна FreshCheck:** Всегда смещаться в сторону ложноположительных, а не ложноотрицательных результатов. Лучше вызвать ненужные отходы, чем пищевое отравление. Для сырой птицы: никогда не возвращать "БЕЗОПАСНО" независимо от уверенности.

**20. Компьютерное зрение (Computer Vision, CV)**  
Область AI, позволяющая машинам интерпретировать визуальную информацию из изображений и видео. Применительно к еде: обнаружение объектов, классификация, сегментация и оценка качества. Современный уровень техники достигает 94–99.95% точности в задачах классификации свежести продуктов в контролируемых условиях. **Значение для FreshCheck:** Фундаментальный технологический стек. Реальная точность ниже лабораторной из-за переменного освещения, углов и разнообразия продуктов.

---

## 7. Научные источники — Полные цитаты

### Основные рецензируемые исследования

---

**[Статья 1] Обнаружение свежести в реальном времени для мобильных приложений**

> Maraveas, C., Kalitsios, G., Kotzabasaki, M.I., Giannopoulos, D.V., Dimitropoulos, K., & Vatsanidou, A. (2025). *Real-time freshness prediction for Apples and Lettuces using imaging recognition and advanced algorithms in a user-friendly mobile application.* Smart Agricultural Technology. DOI: [10.1016/j.atech.2025.003612](https://www.sciencedirect.com/science/article/pii/S2772375525003612)

**Ключевой результат:** MobileNetV3 превзошла 8 других архитектур (ViT, Swin Transformer, ResNet, EfficientNet, ConvNeXt, DeiT, MaxViT, TNT) для классификации свежести яблок и салата. **99.95% точность на яблоках, ~2.5ms инференс на смартфоне среднего класса.** Продемонстрировано, что мобильное развёртывание детекции свежести готово к продакшену.

**Значение для FreshCheck:** Обосновывает MobileNetV3 как основную архитектуру. Доказывает коммерческую жизнеспособность on-device инференса.

---

**[Статья 2] Многозадачная CNN для классификации свежести и типа продукта**

> (Authors). (2024). *Fruit freshness detection based on multi-task convolutional neural network.* Current Research in Food Science, 8. DOI: [10.1016/j.crfs.2024.100733](https://www.sciencedirect.com/science/article/pii/S2665927124000595)

**Ключевой результат:** Парадигма многозадачного обучения, одновременно оптимизирующая классификацию свежести И идентификацию типа продукта через общий CNN-бэкбон. Превосходит однозадачные модели в обеих задачах. Позволяет одному скану определить "это банан И он средней свежести".

**Значение для FreshCheck:** Подтверждает, что одна модель может одновременно идентифицировать тип продукта и оценивать свежесть — снижает количество моделей, необходимых в продакшене.

---

**[Статья 3] CNN-BiLSTM для последовательных сигналов свежести**

> (Authors). (2024). *An innovative approach to detecting the freshness of fruits and vegetables through the integration of convolutional neural networks and bidirectional long short-term memory network.* Current Research in Food Science, 8. DOI: [10.1016/j.crfs.2024.100723](https://pmc.ncbi.nlm.nih.gov/articles/PMC11252168/)

**Ключевой результат:** Гибридная архитектура CNN-BiLSTM превосходит чистую CNN для детекции свежести, захватывая как пространственные (CNN), так и временные/последовательные паттерны (BiLSTM). Протестировано на многоклассовых категориях свежести (свежий / средний / испорченный).

**Значение для FreshCheck:** Если FreshCheck добавит видеосканирование (а не одиночный кадр), CNN-BiLSTM является рекомендуемой архитектурой.

---

**[Статья 4] Обзор методов глубокого обучения для детекции свежести продуктов**

> (Authors). (2024). *A Comprehensive Review of Advanced Deep Learning Approaches for Food Freshness Detection.* Food Engineering Reviews, Springer. DOI: [10.1007/s12393-024-09385-3](https://link.springer.com/article/10.1007/s12393-024-09385-3)

**Ключевой результат:** Обзор 50+ исследований 2019–2024 годов. Консенсусный диапазон точности: 94–99%+ для визуальной детекции свежести в контролируемых условиях. Ключевые проблемы реального развёртывания: переменное освещение, частичное перекрытие, нестандартные углы камеры. Трансферное обучение от ImageNet стабильно превосходит обучение с нуля.

**Значение для FreshCheck:** Устанавливает реалистичные ожидания точности (94–99% в лаборатории → ~85–92% в реальном мире). Подтверждает трансферное обучение как правильный подход.

---

**[Статья 5] AI для пищевой безопасности — от лаборатории к реальному миру**

> (Authors). (2025). *Artificial intelligence for food safety: From predictive models to real-world safeguards.* Trends in Food Science & Technology. DOI: [10.1016/j.tifs.2025.002894](https://www.sciencedirect.com/science/article/pii/S0924224425002894)

**Ключевой результат:** Полный обзор применений AI в цепочке пищевой безопасности. Определяет компьютерное зрение как наиболее коммерчески зрелый метод AI для потребительских приложений. Выделяет "разрыв прозрачности" — пользователям необходимо понимать ограничения AI для доверия. Рекомендует оценки уверенности и явные дисклеймеры во всех потребительских приложениях.

**Значение для FreshCheck:** Непосредственно поддерживает проектные решения FreshCheck: показывать оценки уверенности, всегда включать дисклеймеры, смещаться в сторону ложноположительных результатов.

---

### Вспомогательные исследования

| Статья | Результат | Значение |
|-------|---------|-----------|
| VGG16 на фруктах/овощах (2025) | 97% точность, fresh vs. rotten, 11 категорий | Базовый бенчмарк для модели продуктов FreshCheck |
| CNN + алгоритм Watershed для мяса (2024) | 96.2% классификация свежести мяса | Базовый показатель для функции свежести мяса |
| MobileNetV2 грибы, ResNet-50, EfficientNet (2024) | >94% точность по стадиям свежести | Данные сравнения архитектур |
| UConn ML детекция контаминации (февраль 2025) | ML обнаруживает контаминацию в молочных/мясных с высокой чувствительностью | Сигнал для будущей функции FreshCheck Pro |
| Химия миоглобина — USDA FSIS | Коричневый ≠ испорченный — объяснение метмиоглобина | Основной образовательный контент для приложения |

---

## 8. Архитектура дисклеймеров — Рекомендуемые формулировки

### Уровень 1: Постоянный дисклеймер в приложении (всегда виден)

```
FreshCheck анализирует видимые признаки свежести с помощью AI.
Не может обнаружить бактерии, токсины или внутреннюю контаминацию.
При сомнении — выбросьте.
```

### Уровень 2: Дисклеймер для каждого скана (под каждым результатом)

```
Эта оценка основана только на визуальных индикаторах.
Не является заменой суждения о пищевой безопасности.
Всегда готовьте сырую птицу до 165°F (74°C).
```

### Уровень 3: Правила для конкретных категорий

| Категория | Правило |
|----------|------|
| Сырая птица | Никогда не показывать "БЕЗОПАСНО" — всегда: "Визуально выглядит свежей — готовьте до 165°F" |
| Сырой фарш | Всегда добавлять: "Изменение цвета само по себе не указывает на порчу" |
| Мягкие сыры / гастрономия | Добавлять предупреждение о Listeria для беременных / пожилых |
| Низкая уверенность (<70%) | Принудительно устанавливать CAUTION независимо от предсказанного класса |
| Любой продукт после 2ч в опасной зоне | Переопределять: "Проверьте время с момента приготовления" |

### Уровень 4: Формулировка для Пользовательского соглашения (требуется перед первым сканом)

```
FreshCheck предоставляет только информационные визуальные оценки.
Это не медицинское устройство, не даёт гарантий пищевой безопасности
и не является заменой профессиональной консультации по пищевой безопасности.
Используя FreshCheck, вы соглашаетесь с тем, что [Компания] не несёт
ответственности за последствия для здоровья, возникшие в результате
решений об употреблении пищи, принятых с помощью этого приложения.
```

### Разрешённые и запрещённые формулировки

| ✅ Разрешённые формулировки | ❌ Запрещённые формулировки |
|--------------------------|--------------------------|
| "Визуально выглядит свежей по AI-анализу" | "Эта еда безопасна для употребления" |
| "Визуальные индикаторы указывают на возможное начало порчи" | "Эта еда не вызовет у вас болезни" |
| "По рекомендациям USDA по хранению, этот продукт, вероятно, прошёл пик качества" | "Гарантированно безопасно" / "Сертифицировано свежим" |
| "Уверенность AI: 87% — умеренная уверенность" | "100% точность" |
| "Готовьте сырую птицу до 165°F независимо от внешнего вида" | "Безопасно есть сырым" (в любом контексте) |

---

## Источники

- [USDA FoodKeeper Database](https://catalog.data.gov/dataset/fsis-foodkeeper-data)
- [USDA FSIS — Зона опасности](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f)
- [USDA FSIS — Маркировка дат](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating)
- [FoodSafety.gov](https://www.foodsafety.gov/)
- [FDA General Wellness Policy 2026](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/general-wellness-policy-low-risk-devices)
- [FTC Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance)
- [NPR — Путаница с маркировкой продуктов](https://www.npr.org/2024/12/17/nx-s1-5230808/best-by-use-by-food-labels-fda)
- [Nature — VGG16 обнаружение свежести продуктов](https://www.nature.com/articles/s41598-025-15755-6)
- [UConn — ML детекция в молочных/мясных](https://today.uconn.edu/2025/02/machine-learning-powers-detection-of-contamination-spoilage-in-dairy-meat/)
- [ScienceDirect — AI свежесть мяса через смартфон](https://www.sciencedirect.com/science/article/pii/S2772375525000565)
- [Washington State DOH — Мифы о пищевой безопасности](https://doh.wa.gov/you-and-your-family/food-safety/food-safety-myths)
- [FreshKeeper — Визуальные признаки порчи](https://freshkeeper.org/visual-signs-of-food-spoilage/)
- [Принципы HACCP (FDA)](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines)
- [California AB 660](https://www.armstrongteasdale.com/thought-leadership/food-beverage-and-consumer-products-issues-to-watch-for-2026/)
- [CDC — Salmonella](https://www.cdc.gov/salmonella/)
- [BCC Research — AI в пищевой безопасности 2026](https://blog.bccresearch.com/how-ai-is-transforming-food-safety-quality-control-in-2026)
- [Maraveas et al. (2025) — Real-time Freshness Prediction Mobile App (MobileNetV3, 99.95%)](https://www.sciencedirect.com/science/article/pii/S2772375525003612)
- [Multi-task CNN for Fruit Freshness Detection (2024) — Current Research in Food Science](https://www.sciencedirect.com/science/article/pii/S2665927124000595)
- [CNN-BiLSTM for Fruit & Vegetable Freshness (2024) — PMC/Current Research in Food Science](https://pmc.ncbi.nlm.nih.gov/articles/PMC11252168/)
- [Comprehensive Review: Deep Learning for Food Freshness (2024) — Food Engineering Reviews, Springer](https://link.springer.com/article/10.1007/s12393-024-09385-3)
- [AI for Food Safety: Predictive Models to Real-World Safeguards (2025) — Trends in Food Science & Technology](https://www.sciencedirect.com/science/article/pii/S0924224425002894)
- [USDA FSIS — Цвет мяса и птицы (Миоглобин)](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/color-meat-and-poultry)
- [Michigan State University — Химия цвета мяса (Миоглобин)](https://www.canr.msu.edu/news/the_color_of_meat_depends_on_myoglobin_part_1)
- [ScienceDirect — Обзор метмиоглобина](https://www.sciencedirect.com/topics/pharmacology-toxicology-and-pharmaceutical-science/metmyoglobin)
- [Agriculture.Institute — Механизмы порчи продуктов](https://agriculture.institute/food-fundamentals-cpo/food-spoilage-causes-types-prevention/)
- [Food Engineering Reviews — Machine Vision + Deep Learning for Food Authentication (2024)](https://ift.onlinelibrary.wiley.com/doi/10.1111/1541-4337.70054)
- [Frontiers in Plant Science — Robust Deep Learning for Fruit Decay Detection (2024)](https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2024.1366395/full)
