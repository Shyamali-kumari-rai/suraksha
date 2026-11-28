/* =========================================================
   Suraksha — Botanical First-Aid Data & Translation System
   ========================================================= */

export const GUIDES = [
  {
    id: 'snake',
    sev: 'high',
    en: 'Snake Bite',
    hi: 'साँप का काटना',
    cat: 'bite',
    kw: ['snake', 'saap', 'saanp', 'साँप', 'सांप', 'bite', 'kaata', 'काटा', 'cobra', 'naag', 'venom'],
    enD: 'A snake has bitten someone. Stay calm — most panic causes more harm than the bite.',
    hiD: 'किसी को साँप ने काटा है। शांत रहें — घबराहट काटने से ज़्यादा नुकसान करती है।',
    enSteps: [
      'Call 112 immediately — every snake bite needs a hospital.',
      'Keep the person calm and still. Movement spreads venom faster.',
      'Remove rings, watches or tight clothing near the bite.',
      'Keep the bitten part below heart level and do not let the person walk.',
      'Note the time of the bite and what the snake looked like — from a safe distance.',
      'Take the person to hospital as fast as possible. Anti-venom is the only real treatment.'
    ],
    hiSteps: [
      'तुरंत 112 पर कॉल करें — हर साँप के काटने पर अस्पताल ज़रूरी है।',
      'व्यक्ति को शांत और स्थिर रखें। हिलने से ज़हर तेज़ी से फैलता है।',
      'काटे वाली जगह के पास की अंगूठी, घड़ी या तंग कपड़े उतार दें।',
      'काटा हुआ हिस्सा दिल से नीचे रखें और व्यक्ति को चलने न दें।',
      'काटने का समय नोट करें और साँप कैसा दिखा — सुरक्षित दूरी से।',
      'जितनी जल्दी हो सके अस्पताल ले जाएँ। एंटी-वेनम ही असली इलाज है।'
    ],
    enDont: 'Do NOT tie a tight tourniquet, cut the wound, suck out venom, or apply herbs, ice or a traditional remedy.',
    hiDont: 'कसी हुई पट्टी न बाँधें, घाव न काटें, मुँह से ज़हर न चूसें, जड़ी-बूटी, बर्फ़ या देसी इलाज न लगाएँ।'
  },
  {
    id: 'burns',
    sev: 'med',
    en: 'Burns',
    hi: 'जलना',
    cat: 'burn',
    kw: ['burn', 'jal', 'जल', 'jala', 'burns', 'aag', 'आग', 'garam', 'scald', 'fire'],
    enD: 'Skin burned by fire, hot liquid, steam or a hot object.',
    hiD: 'आग, गर्म पानी, भाप या गर्म चीज़ से त्वचा जल गई है।',
    enSteps: [
      'Cool the burn under cool running water for at least 20 minutes. Do this first, before anything else.',
      'Remove jewellery and loose clothing near the burn — unless it is stuck to the skin.',
      'Cover with a clean, non-fluffy cloth or cling film laid loosely over it.',
      'Give a painkiller like paracetamol if needed, and keep the person warm.',
      'Go to hospital if the burn is bigger than the person’s palm, on the face/hands/genitals, deep, or on a child.'
    ],
    hiSteps: [
      'जले हुए हिस्से को कम से कम 20 मिनट ठंडे बहते पानी के नीचे रखें। सबसे पहले यही करें।',
      'जले के पास के गहने और ढीले कपड़े हटाएँ — अगर त्वचा से चिपके हों तो नहीं।',
      'साफ़, बिना रेशे वाले कपड़े या क्लिंग फ़िल्म से ढीला ढकें।',
      'ज़रूरत हो तो पैरासिटामोल दें और व्यक्ति को गर्म रखें।',
      'अगर जलन हथेली से बड़ी हो, चेहरे/हाथों पर हो, गहरी हो या बच्चा जला हो तो अस्पताल जाएँ।'
    ],
    enDont: 'Do NOT apply toothpaste, turmeric, ink, ghee or ice. Do NOT burst blisters or peel off stuck clothing.',
    hiDont: 'टूथपेस्ट, हल्दी, स्याही, घी या बर्फ़ न लगाएँ। छाले न फोड़ें और चिपके कपड़े न खींचें।'
  },
  {
    id: 'choking',
    sev: 'high',
    en: 'Choking',
    hi: 'गले में अटकना',
    cat: 'airway',
    kw: ['chok', 'ghut', 'गला', 'atka', 'अटक', 'saans nahi', 'khana atka', 'swallow', 'cannot breathe', 'cant breathe', 'breathe', 'saans atki', 'gale me atka'],
    enD: 'Something is stuck in the throat and the person cannot breathe, speak or cough properly.',
    hiD: 'गले में कुछ अटक गया है और व्यक्ति ठीक से साँस, बोल या खाँस नहीं पा रहा।',
    enSteps: [
      'Ask “Are you choking?” If they can cough, encourage coughing and watch closely.',
      'If they cannot breathe: stand behind them, lean them forward, and give 5 sharp back blows between the shoulder blades with the heel of your hand.',
      'Check the mouth — remove anything you can clearly see. Never sweep blindly with fingers.',
      'If still blocked, give 5 abdominal thrusts: fist above the navel, pull sharply inwards and upwards.',
      'Repeat back blows and thrusts. Call 112. If they become unconscious, start CPR.'
    ],
    hiSteps: [
      'पूछें “क्या गले में अटका है?” अगर खाँस पा रहे हैं तो खाँसने दें और ध्यान से देखें।',
      'अगर साँस न आए: पीछे खड़े हों, आगे झुकाएँ, और कंधों के बीच हथेली के निचले हिस्से से 5 तेज़ थपकी दें।',
      'मुँह देखें — जो साफ़ दिखे वही निकालें। अंधाधुंध उँगली न घुमाएँ।',
      'फिर भी अटका हो तो 5 बार पेट पर झटका दें: नाभि के ऊपर मुट्ठी रखकर अंदर-ऊपर की ओर खींचें।',
      'थपकी और झटके दोहराएँ। 112 बुलाएँ। बेहोश हो जाएँ तो CPR शुरू करें।'
    ],
    enDont: 'Do NOT give water or food to clear it, and do NOT put fingers blindly into the throat.',
    hiDont: 'पानी या खाना देकर साफ़ करने की कोशिश न करें, और गले में अंधाधुंध उँगली न डालें।'
  },
  {
    id: 'cpr',
    sev: 'high',
    en: 'CPR — No Breathing',
    hi: 'CPR — साँस बंद',
    cat: 'heart',
    kw: ['cpr', 'behosh', 'बेहोश', 'unconscious', 'saans band', 'no breathing', 'gir gaya', 'collapse', 'not breathing', 'breathing', 'faint', 'unresponsive'],
    enD: 'The person is unconscious and not breathing normally. Every second counts — start now.',
    hiD: 'व्यक्ति बेहोश है और सामान्य साँस नहीं ले रहा। हर सेकंड कीमती है — अभी शुरू करें।',
    enSteps: [
      'Shout for help and call 112 on speaker. Send someone to bring an AED if available.',
      'Lay the person flat on a firm surface. Kneel beside their chest.',
      'Place the heel of one hand in the centre of the chest, other hand on top, fingers interlocked.',
      'Push hard and fast — about 5 cm deep, 100–120 times a minute (roughly 2 pushes every second — keep a steady beat).',
      'Let the chest come fully back up between pushes. Do not stop until help arrives or the person breathes normally.',
      'If trained, give 2 rescue breaths after every 30 pushes. If not trained, keep pushing — hands-only CPR saves lives.'
    ],
    hiSteps: [
      'मदद के लिए चिल्लाएँ और स्पीकर पर 112 बुलाएँ। AED हो तो किसी को लाने भेजें।',
      'व्यक्ति को सख़्त सतह पर सीधा लिटाएँ। छाती के पास घुटनों पर बैठें।',
      'एक हथेली का निचला हिस्सा छाती के बीच में रखें, दूसरा हाथ ऊपर, उँगलियाँ फँसाकर।',
      'ज़ोर से और तेज़ दबाएँ — करीब 5 सेमी गहरा, मिनट में 100–120 बार (लगभग हर सेकंड 2 दबाव — एक समान लय रखें)।',
      'हर दबाव के बाद छाती को पूरी तरह ऊपर आने दें। मदद आने या साँस लौटने तक न रुकें।',
      'अगर प्रशिक्षित हैं तो हर 30 दबाव के बाद 2 साँसें दें। नहीं हैं तो सिर्फ़ दबाते रहें — सिर्फ़ हाथों वाला CPR भी जान बचाता है।'
    ],
    enDont: 'Do NOT stop to check the pulse again and again, and do NOT delay starting to look for a doctor first.',
    hiDont: 'बार-बार नब्ज़ जाँचने के लिए न रुकें, और पहले डॉक्टर ढूँढने में समय बर्बाद न करें।'
  },
  {
    id: 'bleeding',
    sev: 'high',
    en: 'Heavy Bleeding',
    hi: 'तेज़ खून बहना',
    cat: 'wound',
    kw: ['blood', 'khoon', 'खून', 'bleed', 'cut', 'कट', 'chot', 'चोट', 'wound', 'ghaav', 'bleeding', 'khoon beh', 'nose bleed'],
    enD: 'Blood is flowing fast or spurting and will not stop on its own.',
    hiD: 'खून तेज़ी से या फव्वारे की तरह बह रहा है और अपने आप नहीं रुक रहा।',
    enSteps: [
      'Press hard on the wound with a clean cloth, gauze or your hand. Do not let go to check.',
      'If blood soaks through, add more cloth on top — do not remove the first layer.',
      'Raise the injured part above heart level if you can, while keeping pressure.',
      'If bleeding is on an arm or leg and will not stop, tie a wide cloth 5–7 cm above the wound, tight enough to slow the blood, and note the time.',
      'Call 112. Keep the person lying down, warm and calm until help arrives.'
    ],
    hiSteps: [
      'साफ़ कपड़े, गॉज़ या हाथ से घाव पर ज़ोर से दबाएँ। जाँचने के लिए दबाव न छोड़ें।',
      'खून रिसकर ऊपर आ जाए तो और कपड़ा ऊपर रखें — पहली परत न हटाएँ।',
      'दबाव बनाए रखते हुए चोट वाले हिस्से को दिल से ऊपर उठाएँ, अगर हो सके।',
      'अगर खून हाथ या पैर से न रुके तो घाव से 5–7 सेमी ऊपर चौड़ा कपड़ा कसकर बाँधें और समय नोट करें।',
      '112 बुलाएँ। मदद आने तक व्यक्ति को लिटाकर, गर्म और शांत रखें।'
    ],
    enDont: 'Do NOT remove an object stuck in the wound — press around it. Do NOT apply turmeric or soil to stop blood.',
    hiDont: 'घाव में फँसी चीज़ न निकालें — उसके आसपास दबाएँ। खून रोकने के लिए हल्दी या मिट्टी न लगाएँ।'
  },
  {
    id: 'fracture',
    sev: 'med',
    en: 'Fracture / Broken Bone',
    hi: 'हड्डी टूटना',
    cat: 'bone',
    kw: ['fracture', 'haddi', 'हड्डी', 'bone', 'toot', 'टूट', 'sprain', 'moch', 'मोच', 'broken', 'toot gaya', 'tooti'],
    enD: 'A bone may be broken — severe pain, swelling, odd shape, or the limb cannot move.',
    hiD: 'हड्डी टूटी हो सकती है — तेज़ दर्द, सूजन, टेढ़ा आकार, या अंग हिल नहीं रहा।',
    enSteps: [
      'Keep the injured part still. Do not try to straighten it.',
      'Support it with a splint — a rolled magazine, stick or board padded with cloth — tied above and below the injury.',
      'Apply a cold pack wrapped in cloth for 15–20 minutes to reduce swelling.',
      'For an arm injury, use a sling made from a dupatta or cloth to support the arm.',
      'Go to hospital. Call 112 if the bone is sticking out, there is heavy bleeding, or it is a neck/back/hip injury — do not move the person then.'
    ],
    hiSteps: [
      'चोट वाले हिस्से को स्थिर रखें। सीधा करने की कोशिश न करें।',
      'कपड़े में लिपटी पत्रिका, लकड़ी या बोर्ड से सहारा (स्प्लिंट) दें — चोट के ऊपर और नीचे बाँधें।',
      'सूजन कम करने के लिए कपड़े में लिपटा ठंडा पैक 15–20 मिनट रखें।',
      'हाथ की चोट हो तो दुपट्टे या कपड़े की स्लिंग बनाकर हाथ को सहारा दें।',
      'अस्पताल जाएँ। हड्डी बाहर दिखे, तेज़ खून बहे, या गर्दन/पीठ/कूल्हे की चोट हो तो 112 बुलाएँ — तब व्यक्ति को हिलाएँ नहीं।'
    ],
    enDont: 'Do NOT massage the injury, apply heat, or press the bone back in place.',
    hiDont: 'चोट की मालिश न करें, गर्म सिकाई न करें, और हड्डी को दबाकर जगह पर बिठाने की कोशिश न करें।'
  },
  {
    id: 'heat',
    sev: 'med',
    en: 'Heat Stroke (Loo)',
    hi: 'लू लगना',
    cat: 'heat',
    kw: ['loo', 'लू', 'heat', 'garmi', 'गर्मी', 'sunstroke', 'chakkar', 'चक्कर', 'fever', 'bukhar', 'sun', 'faint', 'dhoop'],
    enD: 'After being in strong sun/heat: very hot skin, high fever, confusion, vomiting or fainting. This can be life-threatening.',
    hiD: 'तेज़ धूप/गर्मी के बाद: बहुत गर्म त्वचा, तेज़ बुखार, भ्रम, उल्टी या बेहोशी। यह जानलेवा हो सकता है।',
    enSteps: [
      'Move the person to shade or a cool room immediately.',
      'Call 112 if they are confused, vomiting, fainting or their body is very hot.',
      'Cool them fast: wet the whole body with water and fan them, or place wet cloths on the neck, armpits and groin.',
      'If fully conscious, give small sips of water or ORS.',
      'Loosen tight clothing and keep them lying down until they cool down.'
    ],
    hiSteps: [
      'व्यक्ति को तुरंत छाँव या ठंडे कमरे में ले जाएँ।',
      'भ्रम, उल्टी, बेहोशी हो या शरीर बहुत गर्म हो तो 112 बुलाएँ।',
      'तेज़ी से ठंडा करें: पूरे शरीर पर पानी डालकर पंखा करें, या गर्दन, बगल और जाँघों पर गीला कपड़ा रखें।',
      'पूरी तरह होश में हों तो पानी या ORS के छोटे घूँट दें।',
      'तंग कपड़े ढीले करें और ठंडा होने तक लिटाकर रखें।'
    ],
    enDont: 'Do NOT give water to an unconscious or confused person, and do NOT leave them alone in the heat to “rest it off”.',
    hiDont: 'बेहोश या भ्रमित व्यक्ति को पानी न दें, और “आराम से ठीक हो जाएगा” सोचकर गर्मी में अकेला न छोड़ें।'
  },
  {
    id: 'heart',
    sev: 'high',
    en: 'Heart Attack',
    hi: 'दिल का दौरा',
    cat: 'heart',
    kw: ['heart', 'dil', 'दिल', 'chest pain', 'seene', 'सीने', 'attack', 'daura', 'दौरा', 'chest', 'heart attack', 'seene me dard', 'saans phool'],
    enD: 'Chest pain or pressure, pain spreading to arm/jaw/back, sweating, breathlessness or nausea. Treat as an emergency.',
    hiD: 'सीने में दर्द या दबाव, दर्द हाथ/जबड़े/पीठ तक जाए, पसीना, साँस फूलना या जी मिचलाना। इसे आपात स्थिति मानें।',
    enSteps: [
      'Call 112 immediately — do not drive the person yourself if an ambulance can come.',
      'Make the person sit down, rest and stay calm. Loosen tight clothing.',
      'If they are not allergic and it is available, give one aspirin (300 mg) to chew — only if a medical helpline or prior doctor advice allows it.',
      'Note the time the pain started and keep the person under watch.',
      'If they become unconscious and stop breathing normally, start CPR.'
    ],
    hiSteps: [
      'तुरंत 112 बुलाएँ — एम्बुलेंस आ सकती हो तो खुद गाड़ी चलाकर न ले जाएँ।',
      'व्यक्ति को बिठाकर आराम कराएँ और शांत रखें। तंग कपड़े ढीले करें।',
      'एलर्जी न हो और उपलब्ध हो तो एक एस्पिरिन (300 mg) चबाने को दें — सिर्फ़ तब जब चिकित्सा हेल्पलाइन या पहले के डॉक्टर की सलाह हो।',
      'दर्द शुरू होने का समय नोट करें और व्यक्ति पर नज़र रखें।',
      'बेहोश हो जाएँ और साँस सामान्य न रहे तो CPR शुरू करें।'
    ],
    enDont: 'Do NOT give food or drink (other than advised aspirin), and do NOT wait to “see if the pain goes away”.',
    hiDont: 'खाना-पीना न दें (सलाह वाली एस्पिरिन के अलावा), और “दर्द खुद ठीक होता है या नहीं” देखने के लिए इंतज़ार न करें।'
  },
  {
    id: 'shock',
    sev: 'high',
    en: 'Electric Shock',
    hi: 'बिजली का झटका',
    cat: 'electric',
    kw: ['electric', 'bijli', 'बिजली', 'current', 'shock', 'झटका', 'wire', 'taar'],
    enD: 'Someone has touched a live wire, faulty appliance or fallen power line.',
    hiD: 'किसी ने लाइव तार, खराब उपकरण या गिरी हुई बिजली की लाइन छू ली है।',
    enSteps: [
      'Do NOT touch the person while they are still in contact with the electricity.',
      'Switch off the power at the main switch / MCB first. If you cannot, move the wire away with a dry wooden stick or dry cloth — standing on dry ground.',
      'Call 112.',
      'Once safe, check breathing. If not breathing normally, start CPR.',
      'Cover any burn with a clean dry cloth and take the person to hospital — electric injuries can be deep inside.'
    ],
    hiSteps: [
      'जब तक व्यक्ति बिजली के संपर्क में है, उसे न छुएँ।',
      'पहले मेन स्विच / MCB से बिजली बंद करें। न हो सके तो सूखी ज़मीन पर खड़े होकर सूखी लकड़ी या सूखे कपड़े से तार हटाएँ।',
      '112 बुलाएँ।',
      'सुरक्षित होने पर साँस जाँचें। सामान्य साँस न हो तो CPR शुरू करें।',
      'जले पर साफ़ सूखा कपड़ा ढकें और अस्पताल ले जाएँ — बिजली की चोट अंदर तक गहरी हो सकती है।'
    ],
    enDont: 'Do NOT touch the person or wire with wet hands, metal, or while standing in water.',
    hiDont: 'गीले हाथों, धातु से, या पानी में खड़े होकर व्यक्ति या तार को न छुएँ।'
  },
  {
    id: 'drown',
    sev: 'high',
    en: 'Drowning',
    hi: 'डूबना',
    cat: 'water',
    kw: ['drown', 'doob', 'डूब', 'pani', 'water', 'swim', 'nahar', 'river'],
    enD: 'A person has been pulled out of water, or is struggling in water.',
    hiD: 'कोई व्यक्ति पानी से निकाला गया है, या पानी में संघर्ष कर रहा है।',
    enSteps: [
      'Keep yourself safe first — throw a rope, stick, tube or floating object. Do not jump in unless you are trained.',
      'Call 112.',
      'Once out: lay them on their back. If not breathing normally, start CPR — give 5 initial rescue breaths first if you are trained.',
      'If breathing, lay them on their side, keep them warm with dry clothes or a blanket.',
      'Always take them to hospital, even if they seem fine — water in the lungs can cause problems hours later.'
    ],
    hiSteps: [
      'पहले खुद सुरक्षित रहें — रस्सी, डंडा, ट्यूब या तैरने वाली चीज़ फेंकें। प्रशिक्षित न हों तो खुद न कूदें।',
      '112 बुलाएँ।',
      'बाहर आने पर: पीठ के बल लिटाएँ। सामान्य साँस न हो तो CPR शुरू करें — प्रशिक्षित हों तो पहले 5 साँसें दें।',
      'साँस आ रही हो तो करवट पर लिटाएँ और सूखे कपड़ों या कंबल से गर्म रखें।',
      'ठीक लगें तब भी अस्पताल ज़रूर ले जाएँ — फेफड़ों में पानी घंटों बाद भी समस्या कर सकता है।'
    ],
    enDont: 'Do NOT waste time trying to push water out of the stomach or hang the person upside down.',
    hiDont: 'पेट से पानी निकालने या उल्टा लटकाने में समय बर्बाद न करें।'
  },
  {
    id: 'seizure',
    sev: 'med',
    en: 'Seizure / Fit',
    hi: 'दौरा / मिर्गी',
    cat: 'neuro',
    kw: ['seizure', 'fit', 'mirgi', 'मिर्गी', 'daura', 'झटके', 'convulsion', 'fits', 'jhatke', 'epilepsy'],
    enD: 'The person is shaking uncontrollably, stiff, or unresponsive with jerking movements.',
    hiD: 'व्यक्ति बेकाबू काँप रहा है, अकड़ा हुआ है, या झटकों के साथ बेहोश है।',
    enSteps: [
      'Stay calm and time the seizure. Most stop within 1–3 minutes.',
      'Move objects away and cushion the head with something soft. Loosen clothing around the neck.',
      'Turn them onto their side once the shaking stops, or during it if you can do so safely.',
      'Stay with them until fully recovered — they may be confused or sleepy afterwards.',
      'Call 112 if it lasts over 5 minutes, repeats, happens in water, the person is pregnant/injured, or does not recover.'
    ],
    hiSteps: [
      'शांत रहें और दौरे का समय देखें। ज़्यादातर 1–3 मिनट में रुक जाते हैं।',
      'आसपास की चीज़ें हटाएँ और सिर के नीचे कुछ नरम रखें। गर्दन के कपड़े ढीले करें।',
      'काँपना रुके तो करवट पर लिटाएँ, या सुरक्षित हो तो दौरान भी।',
      'पूरी तरह ठीक होने तक साथ रहें — बाद में भ्रम या नींद आ सकती है।',
      '5 मिनट से ज़्यादा चले, दोबारा आए, पानी में आए, व्यक्ति गर्भवती/घायल हो या ठीक न हो तो 112 बुलाएँ।'
    ],
    enDont: 'Do NOT put anything in the mouth — no spoon, no fingers, no water — and do NOT hold the person down.',
    hiDont: 'मुँह में कुछ न डालें — न चम्मच, न उँगली, न पानी — और व्यक्ति को ज़बरदस्ती दबाकर न रोकें।'
  },
  {
    id: 'poison',
    sev: 'high',
    en: 'Poisoning',
    hi: 'ज़हर / गलत दवा',
    cat: 'poison',
    kw: ['poison', 'zahar', 'ज़हर', 'dava', 'medicine', 'tablet', 'chemical', 'kha liya', 'pesticide', 'vomit', 'ulti', 'उल्टी', 'swallow', 'goli', 'zeher', 'dava kha'],
    enD: 'Someone has swallowed medicine, chemicals, pesticides, or spoiled/toxic substances — or is showing sudden vomiting, drowsiness or confusion after eating/drinking something.',
    hiD: 'किसी ने दवा, केमिकल, कीटनाशक या ज़हरीली चीज़ खा/पी ली है — या कुछ खाने-पीने के बाद अचानक उल्टी, सुस्ती या भ्रम हो रहा है।',
    enSteps: [
      'Call 112 immediately. Keep the packet/container of what was taken — doctors will need it.',
      'Note what was taken, how much, and at what time.',
      'If the person is conscious and a medical helpline advises it, follow their instructions exactly.',
      'If unconscious but breathing, lay them on their side and keep watch. If not breathing, start CPR.',
      'Take them to hospital with the container, even if they seem fine — some poisons act late.'
    ],
    hiSteps: [
      'तुरंत 112 बुलाएँ। जो खाया गया उसका पैकेट/डिब्बा संभालकर रखें — डॉक्टरों को ज़रूरत होगी।',
      'नोट करें: क्या लिया, कितना, और किस समय।',
      'होश में हों और चिकित्सा हेल्पलाइन सलाह दे तो ठीक वैसा ही करें।',
      'बेहोश हों पर साँस चल रही हो तो करवट पर लिटाकर नज़र रखें। साँस न हो तो CPR शुरू करें।',
      'ठीक लगें तब भी डिब्बे के साथ अस्पताल ले जाएँ — कुछ ज़हर देर से असर करते हैं।'
    ],
    enDont: 'Do NOT make the person vomit unless a doctor/helpline tells you to, and do NOT give milk, lemon or home remedies as an “antidote”.',
    hiDont: 'डॉक्टर/हेल्पलाइन कहे बिना उल्टी न कराएँ, और “इलाज” के नाम पर दूध, नींबू या घरेलू नुस्खे न दें।'
  },
  {
    id: 'mirgi',
    sev: 'med',
    en: 'Mirgi (Seizure)',
    hi: 'मिर्गी का दौरा',
    cat: 'neuro',
    kw: ['mirgi', 'मिर्गी', 'mirgi ka daura', 'seizure', 'pakdo mat', 'muh me kuch mat daalo', 'jhatka', 'दौरा'],
    enD: 'Patient ko pakdo mat, muh mein kuch mat daalo. Keep them safe on their side until the fit stops.',
    hiD: 'मरीज़ को पकड़ें नहीं और मुँह में कुछ न डालें। दौरा रुकने तक उन्हें करवट पर सुरक्षित रखें।',
    enSteps: [
      'Turn the patient gently onto their side so the airway stays clear.',
      'Move nearby dangerous or sharp objects away from the patient.',
      'Place something soft under their head to cushion it.',
      'Note the exact time the seizure started.',
      'Call 112 immediately if the seizure lasts more than 5 minutes or breathing stops.'
    ],
    hiSteps: [
      'मरीज़ को धीरे से करवट (साइड) में लिटाएँ ताकि साँस की नली खुली रहे।',
      'आसपास की खतरनाक या सख़्त चीज़ें हटा दें।',
      'सिर के नीचे कोई नरम चीज़ (कपड़ा या तकिया) रखें।',
      'दौरा शुरू होने का समय नोट करें।',
      'अगर दौरा 5 मिनट से ज़्यादा चले या साँस रुक जाए तो तुरंत 112 पर कॉल करें।'
    ],
    enDont: 'Do NOT hold the patient down, put anything in their mouth, or give them water.',
    hiDont: 'मरीज़ को ज़बरदस्ती पकड़ें नहीं, मुँह में कुछ न डालें और पानी न पिलाएँ।'
  },
  {
    id: 'asthma',
    sev: 'high',
    en: 'Asthma Attack',
    hi: 'अस्थमा का दौरा (दमा)',
    cat: 'airway',
    kw: ['asthma', 'dama', 'दमा', 'अस्थमा', 'inhaler', 'saans phoolna', 'wheezing', 'breathless', 'puff', 'asthma attack'],
    enD: 'Breathing becomes tight or wheezy — know how to use an inhaler calmly and quickly.',
    hiD: 'साँस फूलना या सीटी जैसी आवाज़ आना — जानें कि इनहेलर का इस्तेमाल सही तरीके से कैसे करें।',
    enSteps: [
      'Make the patient sit upright and stay calm.',
      'Shake the inhaler well before using.',
      'Take 1 puff and hold the breath for 10 seconds.',
      'After 1 minute, take a second puff if needed.',
      'If breathing still does not improve, call 112 immediately.'
    ],
    hiSteps: [
      'मरीज़ को सीधा बिठाएँ — शांत रहें और उन्हें आराम से साँस लेने कहें।',
      'इस्तेमाल करने से पहले इनहेलर को अच्छी तरह हिलाएँ।',
      'एक पफ़ लें और 10 सेकंड तक साँस रोककर रखें।',
      'ज़रूरत हो तो 1 मिनट बाद दूसरा पफ़ लें।',
      'अगर फिर भी साँस ठीक न आए तो तुरंत 112 पर कॉल करें।'
    ],
    enDont: 'Do NOT make the patient lie down flat, and do NOT panic.',
    hiDont: 'मरीज़ को सीधा न लिटाएँ और घबराएँ नहीं।'
  },
  {
    id: 'lowsugar',
    sev: 'high',
    en: 'Low Sugar (Diabetes)',
    hi: 'लो शुगर (डायबिटीज़)',
    cat: 'metabolic',
    kw: ['low sugar', 'sugar', 'diabetes', 'hypoglycemia', 'pasina', 'kaanpna', 'meetha', 'glucose', 'शुगर', 'डायबिटीज'],
    enD: 'Sudden sweating and shaking (pasina + kaanpna) means blood sugar has dropped — give something sweet right away.',
    hiD: 'अचानक पसीना आना और काँपना कम शुगर का संकेत है — होश में हों तो तुरंत मीठा दें।',
    enSteps: [
      'If the patient is conscious, give something sweet immediately — juice, glucose, or sugar water.',
      'Wait and check again after 15 minutes.',
      'If they are not better, give something sweet again.',
      'If the patient becomes unconscious, do NOT feed or give any drink, and call 112 immediately.'
    ],
    hiSteps: [
      'अगर मरीज़ होश में है तो तुरंत कुछ मीठा दें — जूस, ग्लूकोज़ या चीनी वाला पानी।',
      '15 मिनट बाद फिर जाँच करें।',
      'अगर हालत बेहतर न हो तो दोबारा मीठा दें।',
      'अगर मरीज़ बेहोश हो जाए तो कुछ भी न खिलाएँ/पिलाएँ और तुरंत 112 पर कॉल करें।'
    ],
    enDont: 'Do NOT feed an unconscious patient, and do NOT give insulin.',
    hiDont: 'बेहोश मरीज़ को कुछ न खिलाएँ/पिलाएँ और इंसुलिन न दें।'
  },
  {
    id: 'zeher',
    sev: 'high',
    en: 'Zeher Kha Liya (Poisoning)',
    hi: 'ज़हर खा लिया',
    cat: 'poison',
    kw: ['zeher', 'zeher kha liya', 'ज़हर खा लिया', 'zahar', 'ulti mat karwao', 'packet', 'poisoning', 'chemical', 'pesticide'],
    enD: 'Ulti mat karwao, packet saath le jao — keep the container and get medical help fast.',
    hiD: 'उल्टी न करवाएँ, ज़हर का पैकेट/डिब्बा साथ लेकर तुरंत अस्पताल जाएँ।',
    enSteps: [
      'Stay calm and keep the poison packet or container with you.',
      'Do NOT give the patient anything to eat or drink.',
      'Call 112 immediately and tell them the name of the poison.',
      'Take the poison packet or container along when going to the hospital.'
    ],
    hiSteps: [
      'शांत रहें और ज़हर का पैकेट या डिब्बा संभालकर साथ रखें।',
      'मरीज़ को कुछ भी खाने या पीने को न दें।',
      'तुरंत 112 पर कॉल करें और ज़हर का नाम बताएँ।',
      'अस्पताल ले जाते समय ज़हर का पैकेट/डिब्बा साथ लेकर जाएँ।'
    ],
    enDont: 'Do NOT force vomiting (ulti), and do NOT force milk or water.',
    hiDont: 'ज़बरदस्ती उल्टी न करवाएँ और दूध या पानी ज़बरदस्ती न पिलाएँ।'
  },
  {
    id: 'eye',
    sev: 'med',
    en: 'Aankh Mein Chot (Eye Injury)',
    hi: 'आँख में चोट',
    cat: 'eye',
    kw: ['eye', 'eye injury', 'aankh', 'aankh mein chot', 'आँख', 'आँख में चोट', 'ragdo mat', 'chubh', 'dust', 'chemical in eye'],
    enD: 'Ragdo mat, paani se dho — flush gently with clean water and never rub the injured eye.',
    hiD: 'आँख को रगड़ें नहीं, साफ़ पानी से हल्के से धोएँ और बिना सलाह कोई दवा न डालें।',
    enSteps: [
      'Do NOT rub the eye.',
      'Rinse gently with clean water for 15 minutes.',
      'If something is stuck inside, do NOT try to remove it.',
      'Close the eye gently and place a light clean cloth over it.',
      'Go to a doctor immediately.'
    ],
    hiSteps: [
      'आँख को बिल्कुल न रगड़ें।',
      'साफ़ पानी से 15 मिनट तक आँख को हल्के से धोएँ।',
      'अगर आँख में कुछ चुभ गया हो तो उसे निकालने की कोशिश न करें।',
      'आँख बंद करके ऊपर हल्का साफ़ कपड़ा रखें।',
      'तुरंत डॉक्टर के पास जाएँ।'
    ],
    enDont: 'Do NOT rub the eye, and do NOT put any medicine or drops without a doctor’s advice.',
    hiDont: 'आँख को न रगड़ें और बिना डॉक्टर की सलाह के कोई दवा या ड्रॉप न डालें।'
  }
];

// Alias for compatibility
export const SURAKSHA_GUIDES = GUIDES;

export const HELPLINES = [
  { number: '112', en: 'National Emergency', hi: 'राष्ट्रीय आपात नंबर', descEn: 'Police, fire and ambulance — one number for all emergencies across India.', descHi: 'पुलिस, फायर और एम्बुलेंस — पूरे भारत में सभी आपात स्थितियों के लिए एक नंबर।' },
  { number: '108', en: 'Ambulance', hi: 'एम्बुलेंस', descEn: 'Free government ambulance service in most states.', descHi: 'अधिकांश राज्यों में मुफ़्त सरकारी एम्बुलेंस सेवा।' },
  { number: '102', en: 'Medical Transport', hi: 'चिकित्सा परिवहन', descEn: 'Ambulance / patient transport helpline, including pregnancy cases.', descHi: 'एम्बुलेंस / मरीज़ परिवहन हेल्पलाइन, गर्भावस्था मामलों सहित।' },
  { number: '1091', en: 'Women Helpline', hi: 'महिला हेल्पलाइन', descEn: 'Help and support for women in distress.', descHi: 'संकट में महिलाओं के लिए मदद और सहायता।' },
  { number: '1098', en: 'Child Helpline', hi: 'बाल हेल्पलाइन', descEn: 'CHILDLINE — for any child in danger or in need of care.', descHi: 'CHILDLINE — खतरे में या देखभाल की ज़रूरत वाले किसी भी बच्चे के लिए।' },
  { number: '1075', en: 'Health Helpline', hi: 'स्वास्थ्य हेल्पलाइन', descEn: 'National health helpline for medical information and guidance.', descHi: 'चिकित्सा जानकारी और मार्गदर्शन के लिए राष्ट्रीय स्वास्थ्य हेल्पलाइन।' }
];

export const KITS = {
  home: {
    label: 'Home Kit',
    items: [
      ['Sterile gauze & bandages', '×10', 'For covering wounds and stopping bleeding.', 'ess'],
      ['Adhesive plasters (Band-Aid)', '×20 assorted', 'For small cuts and blisters.', 'ess'],
      ['Cotton roll', '×1', 'Cleaning around wounds — never directly on an open wound.', 'ess'],
      ['Antiseptic liquid', '100 ml', 'Clean skin around a wound before dressing.', 'ess'],
      ['ORS packets', '×5', 'For dehydration, loo, vomiting and diarrhoea.', 'ess'],
      ['Paracetamol tablets', '×10', 'Fever and pain. Check expiry every 6 months.', 'ess'],
      ['Disposable gloves', '×4 pairs', 'Protects you and the injured person from infection.', 'ess'],
      ['Scissors & safety pins', '1 set', 'Cutting bandages and fixing a sling.', 'good'],
      ['Torch + extra batteries', '1 set', 'Power cuts and night emergencies.', 'ess'],
      ['Thermometer', '×1', 'Check fever properly instead of guessing.', 'good'],
      ['Emergency numbers card', '×1', '112, family doctor and nearest hospital — written, not just in a phone.', 'ess'],
      ['Crepe bandage', '×2', 'Support for sprains and swollen joints.', 'good'],
      ['Burn dressing / clean cling film', '×2', 'Cover a burn loosely after cooling with water.', 'good'],
      ['Tweezers', '×1', 'Removing splinters and thorns.', 'good']
    ]
  },
  travel: {
    label: 'Travel Kit',
    items: [
      ['Adhesive plasters', '×10', 'Small cuts on the move.', 'ess'],
      ['ORS packets', '×3', 'Heat, travel sickness and stomach upset.', 'ess'],
      ['Paracetamol', '×6', 'Fever and headache while travelling.', 'ess'],
      ['Antiseptic wipes', '×10', 'No water needed to clean around a cut.', 'ess'],
      ['Motion-sickness tablets', 'As advised', 'Only medicines a doctor has advised for you.', 'good'],
      ['Disposable gloves', '×2 pairs', 'Helping a stranger safely.', 'good'],
      ['Small torch', '×1', 'Trains, buses and power cuts.', 'good'],
      ['Safety pins & small scissors', '1 set', 'Quick fixes for bandages and clothing.', 'good'],
      ['Personal medicines', 'Full trip + 2 days extra', 'Never keep only in checked luggage.', 'ess'],
      ['Emergency card', '×1', 'Blood group, allergies and home contact.', 'ess'],
      ['Electrolyte / glucose sweets', 'Small pack', 'Quick energy for weakness and loo.', 'good'],
      ['Insect repellent & after-bite cream', '×1', 'For bites and stings on the way.', 'good']
    ]
  },
  car: {
    label: 'Car Kit',
    items: [
      ['Full home-kit basics in a pouch', '1 pouch', 'Gauze, plasters, antiseptic, gloves and ORS.', 'ess'],
      ['Torch + batteries', '×1', 'Night breakdowns and accidents.', 'ess'],
      ['Reflective warning triangle', '×1', 'Warn other vehicles — place it well behind the car.', 'ess'],
      ['High-visibility vest', '×1', 'Be seen on a dark highway.', 'ess'],
      ['Bottled water', '1 litre', 'Drinking, ORS and cooling a burn.', 'ess'],
      ['Clean towel / cloth', '×2', 'Pressure on bleeding and making a sling.', 'ess'],
      ['Emergency numbers card', '×1', '112, highway helpline and family contact.', 'ess'],
      ['Phone power bank', '×1 charged', 'A dead phone cannot call 112.', 'ess'],
      ['Blanket', '×1', 'Keep an injured person warm in shock.', 'good'],
      ['Raincoat / umbrella', '×1', 'Helping in rain without getting soaked and cold.', 'good'],
      ['Basic tool kit & jump cable', '1 set', 'For breakdowns while waiting for help.', 'good'],
      ['Seat-belt cutter & glass breaker', '×1', 'Escape tool — keep within driver reach.', 'good']
    ]
  },
  kids: {
    label: 'Baby & Kids Kit',
    items: [
      ['Child paracetamol syrup', 'As doctor advised', 'Only the dose your doctor advised for age / weight.', 'ess'],
      ['ORS packets', '×5', 'Children dehydrate fast in loo and vomiting.', 'ess'],
      ['Digital thermometer', '×1', 'Check fever — note it before calling the doctor.', 'ess'],
      ['Small adhesive plasters', '×15', 'Child-size, for small cuts.', 'ess'],
      ['Sterile gauze (small)', '×6', 'Gentle dressing for small wounds.', 'ess'],
      ['Antiseptic liquid (mild)', 'Small bottle', 'Clean around cuts — expect tears, go slow.', 'good'],
      ['Nasal saline drops', '×1', 'Blocked nose in babies.', 'good'],
      ['Disposable gloves', '×2 pairs', 'Clean hands before dressing a wound.', 'good'],
      ['Doctor & hospital card', '×1', 'Paediatrician number and nearest hospital.', 'ess'],
      ['ORS spoon / measuring cup', '×1', 'Mix ORS in the exact water amount on the pack.', 'good'],
      ['Torch', '×1', 'Checking mouth, ears and wounds at night.', 'good'],
      ['Spare clothes & plastic bag', '1 set', 'For vomiting, spills and accidents.', 'good']
    ]
  }
};

export const I18N = {
  en: {
    ready: 'OFFLINE READY',
    n1: 'Ask AI',
    nMadad: 'Madad SMS',
    n2: 'Emergency Guides',
    n3: 'How It Works',
    n4: 'CPR Helper',
    n5: 'Helplines',
    call: 'Call 112',
    eyebrow: 'ON-DEVICE FIRST-AID AI • INDIA',
    lead: 'Suraksha — offline first-aid AI. Ask anything in Hindi or English and get instant emergency steps, even with no internet.',
    s1: '17 Verified Protocols',
    s1s: 'Clear numbered steps',
    s2: 'Hindi + English',
    s2s: 'Devanagari & Hinglish',
    s3: '0 KB Internet Needed',
    s3s: 'Runs 100% on-device',
    askTitle: 'Ask Suraksha',
    ondevice: 'ON-DEVICE • OFFLINE',
    askBtn: 'Ask',
    emptyT: 'Type any emergency or pick a guide below',
    emptyS: 'Try typing burn, snake bite, khoon, साँप, or tap a quick chip above.',
    madadH: 'Madad SMS — One Tap Help',
    madadP: 'In an accident or emergency, one tap sends an SMS with your location to your family. SMS needs zero internet, so it works completely offline.',
    madadCardT: 'Save your family number',
    madadCardP: 'First save a trusted family member or friend’s number. In an emergency, tap the big button below — your SMS app opens with the distress message and your GPS location ready, just tap Send.',
    madadAdd: '＋ Save Number',
    madadEmpty: 'No number saved yet. Save a family number above — that number will be used for Madad SMS.',
    madadSend: 'Send Madad SMS — With Live Location',
    madadNote: 'Message: “Madad chahiye, main yahan hoon” + Google Maps location link. Keep phone GPS / Location ON. Standard SMS rates apply. In serious emergency, dial 112 first.',
    gH: 'Emergency Guides',
    gP: 'Tap any emergency for step-by-step first aid, what NOT to do, and when to call 112. Everything works offline.',
    whyH: '3 Reasons To Choose Suraksha',
    r1t: 'Works 24/7, fully offline',
    r1p: 'No signal in a village, lift, highway or basement? Suraksha still answers in seconds — the guides live on your device, not on a server.',
    r2t: 'Hindi + English, spoken aloud',
    r2p: 'Ask in Hinglish or Devanagari — “haath jal gaya”, “saans nahi aa rahi” — and tap Listen to hear the steps read out while your hands are busy helping.',
    r3t: 'Clear do’s and don’ts',
    r3p: 'Every guide shows the steps in order, the common mistakes to avoid, and a clear line on when home first aid is not enough and 112 must be called.',
    howH: 'Follow These 3 Simple Steps',
    howP: 'From panic to action in under a minute.',
    st1t: 'Describe the emergency',
    st1p: 'Type or tap what happened — in English, Hindi or Hinglish. No medical words needed.',
    st2t: 'Follow the instant steps',
    st2p: 'Get numbered first-aid steps instantly, on-device. Listen to them aloud if you can’t look at the screen.',
    st3t: 'Call & share for help',
    st3p: 'One tap calls 112. Copy the steps and send them to family on WhatsApp so everyone knows what to do.',
    toolH: 'Emergency Tools',
    toolP: 'Built-in emergency utilities — zero downloads, zero internet required.',
    cprT: 'CPR Rhythm Helper',
    cprP: 'Push hard and fast to this steady beat in the centre of the chest — around 110 times a minute. Tap Start and follow the pulse.',
    kitT: 'First-Aid Kit Checklist',
    kitP: 'Keep these essential supplies prepared at home, car or travel — check off what you have today.',
    helpH: 'India Emergency Helplines',
    helpP: 'Tap any number to call. All are toll-free, 24×7 across India.',
    faqH: 'About & FAQ',
    aboutSub: 'What Suraksha is, how it works offline, and the questions people ask most.',
    aboutT: 'About Suraksha',
    aboutP: 'Suraksha is an offline-first first-aid field manual for India. It gives clear, step-by-step help for 12 common emergencies — in Hindi and English — right on your device, with no internet, no login and no waiting. It is made for the first few minutes of an emergency: the time before an ambulance or doctor can reach you. Suraksha does not replace medical care — in any serious emergency, call 112 first, then follow the steps while help is on the way.',
    aboutBtn: 'About & FAQ',
    f1: 'Offline-First Hybrid AI Field Manual • India • Hindi + English',
    f2: 'Disclaimer: General first-aid guidance only; not a substitute for professional medical care. In any serious emergency, call 112 immediately.'
  },
  hi: {
    ready: 'ऑफ़लाइन तैयार',
    n1: 'AI से पूछें',
    nMadad: 'मदद SMS',
    n2: 'आपात गाइड',
    n3: 'कैसे काम करता है',
    n4: 'CPR सहायक',
    n5: 'हेल्पलाइन',
    call: '112 बुलाएँ',
    eyebrow: 'ऑन-डिवाइस फ़र्स्ट-एड AI • भारत',
    lead: 'सुरक्षा — ऑफ़लाइन फ़र्स्ट-एड AI। हिंदी या अंग्रेज़ी में कुछ भी पूछें और बिना इंटरनेट भी तुरंत आपात स्टेप्स पाएँ।',
    s1: '17 सत्यापित प्रोटोकॉल',
    s1s: 'स्पष्ट क्रमांकित स्टेप्स',
    s2: 'हिंदी + अंग्रेज़ी',
    s2s: 'देवनागरी और हिंग्लिश',
    s3: '0 KB इंटरनेट चाहिए',
    s3s: '100% ऑन-डिवाइस चलता है',
    askTitle: 'सुरक्षा से पूछें',
    ondevice: 'ऑन-डिवाइस • ऑफ़लाइन',
    askBtn: 'पूछें',
    emptyT: 'कोई भी आपात स्थिति लिखें या नीचे गाइड चुनें',
    emptyS: 'burn, snake bite, khoon, साँप लिखकर देखें, या ऊपर का चिप दबाएँ।',
    madadH: 'मदद SMS — एक टैप में मदद',
    madadP: 'दुर्घटना या आपात स्थिति में एक टैप — आपके परिवार के नंबर पर लोकेशन के साथ SMS जाएगा। SMS को इंटरनेट नहीं चाहिए, इसलिए यह ऑफ़लाइन भी चलेगा।',
    madadCardT: 'अपने परिवार का नंबर सेव करें',
    madadCardP: 'पहले किसी भरोसेमंद परिवार / दोस्त का नंबर सेव करें। आपात स्थिति में नीचे वाला बड़ा बटन दबाते ही SMS ऐप खुलेगा — मैसेज और आपकी GPS लोकेशन तैयार मिलेगी, बस Send दबाना है।',
    madadAdd: '＋ नंबर सेव करें',
    madadEmpty: 'अभी कोई नंबर सेव नहीं है। ऊपर अपने परिवार के सदस्य का नंबर सेव करें — वही नंबर मदद SMS के लिए इस्तेमाल होगा।',
    madadSend: 'मदद SMS भेजो — लोकेशन के साथ',
    madadNote: 'मैसेज: “मदद चाहिए, मैं यहाँ हूँ” + Google Maps लोकेशन लिंक। लोकेशन के लिए फ़ोन का GPS / Location ON रखें। SMS भेजने पर आपके प्लान के सामान्य SMS चार्ज लग सकते हैं। गंभीर आपात स्थिति में पहले 112 भी कॉल करें।',
    gH: 'आपात गाइड',
    gP: 'स्टेप-दर-स्टेप फ़र्स्ट-एड, क्या न करें, और 112 कब बुलाएँ — किसी भी आपात स्थिति को दबाएँ। सब कुछ ऑफ़लाइन काम करता है।',
    whyH: 'सुरक्षा चुनने के 3 कारण',
    r1t: '24/7 काम करता है, पूरी तरह ऑफ़लाइन',
    r1p: 'गाँव, लिफ़्ट, हाईवे या बेसमेंट में सिग्नल न हो? सुरक्षा फिर भी सेकंडों में जवाब देती है — गाइड आपके डिवाइस पर हैं, सर्वर पर नहीं।',
    r2t: 'हिंदी + अंग्रेज़ी, बोलकर भी सुनें',
    r2p: 'हिंग्लिश या देवनागरी में पूछें — “हाथ जल गया”, “साँस नहीं आ रही” — और Listen दबाकर स्टेप्स सुनें, जब हाथ मदद में व्यस्त हों।',
    r3t: 'स्पष्ट क्या करें और क्या न करें',
    r3p: 'हर गाइड में क्रम से स्टेप्स, आम गलतियाँ जिनसे बचना है, और साफ़ लाइन कि घरेलू फ़र्स्ट-एड कब काफ़ी नहीं और 112 कब ज़रूरी है।',
    howH: 'बस ये 3 आसान स्टेप्स',
    howP: 'घबराहट से एक्शन तक, एक मिनट से भी कम में।',
    st1t: 'आपात स्थिति बताएँ',
    st1p: 'क्या हुआ, लिखें या दबाएँ — अंग्रेज़ी, हिंदी या हिंग्लिश में। मेडिकल शब्द ज़रूरी नहीं।',
    st2t: 'तुरंत स्टेप्स अपनाएँ',
    st2p: 'क्रमांकित फ़र्स्ट-एड स्टेप्स तुरंत, ऑन-डिवाइस पाएँ। स्क्रीन न देख सकें तो सुन भी सकते हैं।',
    st3t: 'मदद बुलाएँ और शेयर करें',
    st3p: 'एक टैप में 112 बुलाएँ। स्टेप्स कॉपी करके WhatsApp पर परिवार को भेजें ताकि सबको पता हो क्या करना है।',
    toolH: 'आपात टूल्स',
    toolP: 'सुरक्षा में बने दो एक्स्ट्रा टूल — न डाउनलोड, न इंटरनेट।',
    cprT: 'CPR रिदम हेल्पर',
    cprP: 'इस बीट पर छाती के बीच में ज़ोर से और तेज़ दबाएँ — मिनट में करीब 110 बार। Start दबाएँ और पल्स के साथ चलें।',
    kitT: 'घर की फ़र्स्ट-एड किट चेकलिस्ट',
    kitP: 'ये सामान घर पर तैयार रखें — आज ही अपने बॉक्स से मिलान करें।',
    helpH: 'भारत आपात हेल्पलाइन',
    helpP: 'किसी भी नंबर को दबाकर कॉल करें। सभी मुफ़्त हैं, 24×7।',
    faqH: 'सुरक्षा के बारे में और आम सवाल',
    aboutSub: 'सुरक्षा क्या है, यह ऑफ़लाइन कैसे काम करती है, और सबसे ज़्यादा पूछे जाने वाले सवाल।',
    aboutT: 'सुरक्षा के बारे में',
    aboutP: 'सुरक्षा भारत के लिए एक ऑफ़लाइन-फ़र्स्ट फ़र्स्ट-एड फ़ील्ड मैनुअल है। यह 12 आम आपात स्थितियों के लिए साफ़, क्रमवार मदद देता है — हिंदी और अंग्रेज़ी में — सीधे आपके डिवाइस पर, बिना इंटरनेट, बिना लॉगिन और बिना इंतज़ार। यह आपात स्थिति के पहले कुछ मिनटों के लिए बना है: एम्बुलेंस या डॉक्टर के पहुँचने से पहले का समय। सुरक्षा चिकित्सा देखभाल का विकल्प नहीं है — किसी भी गंभीर आपात स्थिति में पहले 112 बुलाएँ, फिर मदद आने तक स्टेप्स अपनाएँ।',
    aboutBtn: 'सुरक्षा के बारे में और FAQ',
    f1: 'ऑफ़लाइन-फ़र्स्ट हाइब्रिड AI फ़ील्ड मैनुअल • भारत • हिंदी + अंग्रेज़ी',
    f2: 'अस्वीकरण: सुरक्षा केवल सामान्य फ़र्स्ट-एड जानकारी देती है और पेशेवर चिकित्सा देखभाल का विकल्प नहीं है। किसी भी गंभीर आपात स्थिति में तुरंत 112 बुलाएँ।'
  }
};

export const SURAKSHA_COPY = I18N;
