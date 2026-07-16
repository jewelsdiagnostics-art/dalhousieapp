/* ============================================
   Membership Curriculum — 3-Year MGCP Programme
   Full detailed syllabus from GCPS documents
   ============================================ */

App.registerPage('membership', () => {
  const y1Subjects = [
    'Neuroanatomy', 'Neurophysiology', 'Neurochemistry', 'Neuropathology',
    'Psychopharmacology', 'Introduction to Psychology', 'Introduction to Philosophy',
    'Sociology of Behaviour', 'Psychopathology', 'Clinical Psychiatry I', 'Transcultural Psychiatry'
  ];

  const y1Rotations = [
    { name: 'Didactic Lectures — Basic Sciences', duration: 'Block 1', detail: 'Neuroanatomy, neurophysiology, neurochemistry, neuropathology' },
    { name: 'Didactic Lectures — Basic Psychiatry', duration: 'Block 2', detail: 'Psychology, philosophy, sociology, psychopathology, transcultural psychiatry' },
    { name: 'Clinical Psychiatry', duration: '9 months', detail: 'Inpatient and outpatient general adult psychiatry under supervision' },
    { name: 'Community & Rehabilitation Psychiatry', duration: '1 month', detail: 'Outreach clinics, community mental health services' },
    { name: 'Annual Leave', duration: '8 weeks', detail: '' }
  ];

  const y2Rotations = [
    { name: 'Child & Adolescent Psychiatry', duration: '4 months', detail: 'Assessment and management of childhood mental disorders' },
    { name: 'Internal Medicine / Neurology & Neuroimaging', duration: '11 weeks', detail: 'Teaching Hospital Medical Block — neuroimaging interpretation' },
    { name: 'Neurosurgery', duration: '3 weeks', detail: 'Teaching Hospital neurosurgical department' },
    { name: 'Emergency & Liaison Psychiatry', duration: '1 month', detail: 'Acute psychiatric crises, consultation-liaison in medical settings' },
    { name: 'Clinical Psychology Skills', duration: '1 month', detail: 'Psychological testing, interpretation, and therapeutic techniques' },
    { name: 'Management & Administration', duration: '2 weeks', detail: 'Health services management principles' },
    { name: 'Annual Leave', duration: '8 weeks', detail: '' }
  ];

  const syllabus = [
    { id:'9.1', title:'Introduction to Psychiatry', topics:[
      'Philosophy and psychiatry','Logic, fallacies, and critical thinking','Mind-brain duality','Scientific basis of psychiatry','Wittgenstein and language in psychiatry','Chomsky and cognitive science','Types of thinking (concrete, abstract, lateral)'
    ]},
    { id:'9.2', title:'Basic Psychology', topics:[
      'Freud, post-Freudians, neo-Freudians, and psychoanalysis','Behaviour and learning theories: classical conditioning, operant conditioning, vicarious learning, cognitive learning','Personality theory and development','Sensation and perception','Memory: registration, encoding, storage, retrieval, forgetting','Thought and thinking processes','Attention and concentration','Cognition','Motivation','Emotion','Stress and coping','States of awareness: consciousness, sleep, hypnosis'
    ]},
    { id:'9.3', title:'Social Psychology', topics:[
      'Attitudes: Thurstone scales, Likert scales','Self-psychology','Interpersonal issues and relationships','Attribution theory','Leadership and social influence','Communication and Behaviour Change Communication','Intergroup behaviour','Aggression','Altruism','Durkheim and suicide'
    ]},
    { id:'9.4', title:'Social Science & Culture', topics:[
      'Social class and socioeconomic status','Sick role and illness behaviour','Family life and expressed emotion','Social and cultural determinants of mental health','Sociology of institutions','Criminology and penology','Stigma and mental illness','Culture as pathoplastic and pathogenic factor','Traditional healing practices','Widowhood rites and cultural practices'
    ]},
    { id:'9.5', title:'Human Growth & Development', topics:[
      'Stages of normal development across the lifespan','Nature vs. nurture debate','Freud: psychosexual stages','Erikson: psychosocial stages','Piaget: cognitive development stages','Bowlby: attachment theory','Family relationships and parenting styles','Temperament','Cognitive development','Language development','Moral development','Sexuality and gender identity','Adolescence','Adult adaptations and midlife transitions','Ageing and geriatric development'
    ]},
    { id:'9.6', title:'Basic Neurosciences', topics:[
      '9.6.1 Neuroanatomy: Brain drawing (all views); Basal ganglia; Cortex and temporal lobes; White matter pathways (corpus callosum, fornix, Papez circuit); Cell types; Major neurochemical pathways (nigrostriatal, mesolimbic, mesocortical dopamine, noradrenergic, cholinergic, glutamatergic, serotonergic, reticular formation)',
      '9.6.2 Neurophysiology: Neurones, synapses, receptors; Action potential, resting potential, ion fluxes; Neural/endocrine pathways for perception, pain, memory, motor, arousal, drives, emotion, aggression, fear, stress; Cerebral localization and homunculus; Neurodevelopmental models; Neuroendocrine system; Arousal and sleep physiology; EEG (normal/abnormal, frequency bands, evoked response)',
      '9.6.3 Neurochemistry: Transmitter synthesis, storage, release; Receptor structure and function; Noradrenaline, serotonin, dopamine, GABA, acetylcholine, excitatory amino acids; 1st, 2nd, and 3rd messengers; Neuropeptides (CRH, CCK, enkephalins/endorphins)',
      '9.6.4 Molecular Genetics: Chromosomes, gene structure, transcription/translation; Family, twin, and adoption studies; Molecular genetics techniques; Direct gene analysis vs. gene tracking; Genetic markers, linkage, LOD scores; Chromosome abnormalities; Genetic counselling; DNA and mental health',
      '9.6.5 Clinical Psychopharmacology: Drug classification; Placebo effect; Pharmacokinetics (absorption, distribution, metabolism, elimination, blood-brain barrier); Plasma drug levels and therapeutic response',
      '9.6.6 Pharmacodynamics: Receptor complexity and sub-types; Up-regulation and down-regulation; Mechanism of tardive dyskinesia; CNS pharmacology of antipsychotics, mood stabilizers, anxiolytics, hypnotics, antiepileptics; Neurochemical effects of ECT; Adverse drug reactions (dose-related vs. idiosyncratic, NMS, TD, metabolic, movement disorders); Risk-benefit assessment; Controlled drug prescribing'
    ]},
    { id:'9.7', title:'Ethology', topics:[
      'Lorenz and imprinting','Bowlby and attachment theory','Phylogenetic origins of behaviour','Separation and depression','Hierarchical and territorial behaviour','Tinbergen: four questions of ethology','von Frisch and animal communication'
    ]},
    { id:'9.8', title:'Ethics, Mental Health Legislation & Human Rights', topics:[
      'Four principles of medical ethics','Major ethical theories (deontology, utilitarianism, virtue ethics)','MI Principles (Mental Illness Principles)','CRPD (Convention on the Rights of Persons with Disabilities)','Mental Health Act','Coroner\'s Act','Criminal Code / Criminal Offences Act','Ghana Health Service Act','Traditional Medical Practice Act'
    ]},
    { id:'9.9', title:'Epidemiology', topics:[
      'Quantitative and qualitative research methods','Case identification and definition','Sample size determination','Confidence intervals','Prevalence and incidence rates','Reliability and validity','Descriptive, cohort, case-control, and experimental study designs','Research design principles'
    ]},
    { id:'9.10', title:'Biostatistics', topics:[
      'Descriptive and inferential statistics','Measures of central tendency and spread','Variability','Confidence intervals','Hypothesis testing: t-test, Z-test, chi-square','ANOVA','Correlation','Multivariate, regression, factor, and survival analysis','Pearson, Spearman, Mann-Whitney tests','Type I and Type II errors','Research designs'
    ]},
    { id:'9.11', title:'Clinical Topics', topics:[
      'History of psychiatry: world, West Africa, Ghana','Psychopathology: signs and symptoms, phenomenology, psychodynamics, experimental psychiatry','Psychiatric assessment: history-taking, MSE, instruments, biopsychosocial formulation, 4Ps (predisposing, precipitating, perpetuating, protective factors)','Psychiatric disorders: anxiety disorders, delirium, dementia, functional psychosis, schizophrenia, mood disorders, personality disorders, sleep disorders, eating disorders, epilepsy, substance use disorders, childhood disorders','Gender issues in psychiatry','Psychosexual and gender identity disorders','Psychiatric services and management','Child and adolescent psychiatry','Learning disability','Liaison psychiatry','Forensic psychiatry','Old age psychiatry','Addiction psychiatry','Social and rehabilitation psychiatry','Transcultural psychiatry','Neuropsychiatry','Neurology for psychiatrists','Basic neurosurgery','Psychotherapy','Psychoanalysis','Clinical information management','Mental health information systems','Service development and delivery','Community and outreach psychiatry'
    ]},
    { id:'9.12', title:'Specific Clinical Topics — Didactic Lectures', topics:[
      '2 hours per lecture; 80% attendance required (may be barred from summative exams if not met)','15 Mandatory/Core Lectures (all mandatory)','16 Specific Clinical Topics as Tutorials','Topics cover all areas of the curriculum including basic neurosciences, psychology, social sciences, and all clinical psychiatric sub-specialties'
    ]}
  ];

  const competencies = [
    { group: 'Core Competencies (6)', items: [
      'Patient Care', 'Medical Knowledge',
      'Interpersonal & Communication Skills', 'Practice-Based Learning & Improvement',
      'Professionalism', 'System-Based Practice'
    ]},
    { group: 'Clinical Skills', items: [
      'Assessment and management planning', 'Suicide risk assessment',
      'Dangerousness / violence risk assessment', 'Current legislation familiarity',
      'CRPD / Mental Health Act application',
      'Management: severe depressive disorder, first-episode psychosis, schizophrenia',
      'Management: alcohol withdrawal, delirium, dependence',
      'Management: substance abuse, bipolar disorder, acute disturbed patient',
      'Management: dementia, anxiety disorders, OCD, PTSD, panic disorders',
      'Referral to: clinical psychology, forensic, child & adolescent, learning disability services'
    ]},
    { group: 'Procedural & Professional', items: [
      'Brief psychotherapy', 'Long-term supervised psychotherapy',
      'ECT administration', 'Business management techniques',
      'Health services management', 'Breakaway / security / self-defence skills',
      'Clinical audit and research protocol design', 'Legal and official report writing',
      'CPR', 'IT systems proficiency', 'Inter-professional liaison',
      'Doctor-patient relationship insight', 'Recognising transference / counter-transference / denial',
      'Communication with colleagues, groups, patients, relatives',
      'Teaching', 'Team leadership', 'Supervising junior colleagues',
      'Interviewing through an interpreter', 'Cross-cultural adaptation'
    ]}
  ];

  const y3Rotations = [
    { name: 'General Adult Psychiatry', duration: '4 months', detail: 'Advanced independent management of adult psychiatric conditions' },
    { name: 'Forensic Psychiatry', duration: '3 months', detail: 'Court attendance, court report writing, criminal responsibility assessment' },
    { name: 'Addiction Rehabilitation & Occupational Therapy', duration: '6 weeks', detail: 'Pantang Hospital — detoxification, rehabilitation programmes' },
    { name: 'Geriatric & Long-Stay Psychiatry', duration: '2 months', detail: 'Accra Psychiatric Hospital — elderly care, chronic mental illness' },
    { name: 'Revision & Examinations', duration: '2 weeks', detail: 'Final preparation for summative examinations' }
  ];

  return `
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-header__title">Membership in Psychiatry (MGCP)</h1>
        <p class="page-header__subtitle">GCPS Faculty of Psychiatry — 3-Year Specialist Training Programme</p>
      </div>

      <div class="fellowship-tabs" id="memb-tabs">
        <button class="fellowship-tab fellowship-tab--active" data-tab="overview">Overview</button>
        <button class="fellowship-tab" data-tab="syllabus">Detailed Syllabus</button>
        <button class="fellowship-tab" data-tab="year1">Year 1</button>
        <button class="fellowship-tab" data-tab="year2">Year 2</button>
        <button class="fellowship-tab" data-tab="year3">Year 3</button>
        <button class="fellowship-tab" data-tab="competencies">Competencies</button>
        <button class="fellowship-tab" data-tab="assessment">Assessment</button>
      </div>

      <!-- === TAB: Overview === -->
      <div class="fellowship-panel" id="memb-panel-overview">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Programme Summary</span></div>
          <div class="section-card__body">
            <p style="font-size:0.9rem;line-height:1.7;">
              The <strong>Membership in Psychiatry</strong> is a 3-year specialist training programme of the Ghana College of
              Physicians and Surgeons (GCPS), Faculty of Psychiatry. It is the foundational specialist qualification and a
              prerequisite for entry into the Fellowship programme (FGCP). Successful candidates earn
              <strong style="color:var(--primary);">MGCP</strong> (Member of the Ghana College of Physicians).
            </p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);" class="ov-grid">
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">Entry Requirements</span></div>
            <div class="section-card__body">
              <ul style="padding-left:1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:2;">
                <li>Basic medical qualification (MB.ChB or equivalent)</li>
                <li>Full registration with Medical &amp; Dental Council of Ghana</li>
                <li>Pass the Entry (Primary) Examination of GCPS, or obtain exemption via equivalent qualification</li>
                <li>Pass interview conducted by the Faculty of Psychiatry</li>
              </ul>
            </div>
          </div>
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">Programme Structure</span></div>
            <div class="section-card__body">
              ${[
                { year:'Year 1', label:'Basic Sciences & Foundations', desc:'Neuroanatomy, neurophysiology, neurochemistry, psychology, psychopathology, transcultural psychiatry', color:'info' },
                { year:'Year 2', label:'Clinical Rotations & Specialty Exposure', desc:'Child & Adolescent, Internal Medicine, Neurology, Neurosurgery, Emergency, Psychology', color:'accent' },
                { year:'Year 3', label:'Advanced Clinical & Sub-Specialties', desc:'General Adult, Forensic, Addiction Rehab, Geriatric, Revision & Exams', color:'primary' }
              ].map(y => `
                <div class="card" style="border-left:4px solid var(--${y.color});padding:var(--space-4);margin-bottom:var(--space-3);">
                  <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;color:var(--${y.color});">${y.year}</div>
                  <div style="font-weight:600;margin:2px 0;">${y.label}</div>
                  <div style="font-size:0.8rem;color:var(--text-secondary);">${y.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="section-card" style="margin-top:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Teaching Methods</span></div>
          <div class="section-card__body">
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
              ${[
                'Didactic Lectures (80 hrs, 40 topics)', 'Seminars (trainer-led & candidate-led)',
                'Clinical Conferences', 'Case Presentations', 'Journal Clubs', 'Mortality Conferences',
                'Topic Discussions', 'Daily Ward Rounds', 'Teaching Ward Rounds',
                'Video Demonstrations', 'Clinical Demonstrations', 'Sit-In Consultations',
                'Monthly Supervisor Sessions (min. 1 hour)'
              ].map(t => `<span class="badge badge--secondary" style="padding:0.5em 0.8em;font-size:0.78rem;">${t}</span>`).join('')}
            </div>
          </div>
        </div>

        <div class="section-card" style="margin-top:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Supervision & Mentoring</span></div>
          <div class="section-card__body">
            <ul style="padding-left:1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:2;">
              <li>Named supervisor: minimum monthly 1-hour sessions</li>
              <li>Supervisor is consultant psychiatrist at workplace — bedside teaching, direct and indirect supervision</li>
              <li>Quarterly reports to Faculty of Psychiatry</li>
              <li>Monthly agenda covers: Education, Interpersonal skills, Managerial skills, Personal development, Mentorship, Role modelling</li>
              <li>Log book signed by supervisor, reviewed at monthly sessions</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- === TAB: Detailed Syllabus === -->
      <div class="fellowship-panel" id="memb-panel-syllabus" style="display:none;">
        <p class="page-header__subtitle" style="margin-bottom:var(--space-4);">Comprehensive subject content as specified in the GCPS Membership Curriculum — Sections 9.1 through 9.12</p>
        ${syllabus.map((s, si) => `
          <div class="section-card syll-sec" style="margin-bottom:var(--space-4);" id="syll-${si}">
            <div class="section-card__header syll-header" style="cursor:pointer;display:flex;justify-content:space-between;align-items:center;">
              <span class="section-card__title">${s.id} — ${s.title}</span>
              <span style="font-size:0.7rem;color:var(--text-muted);">${s.topics.length} topics ▾</span>
            </div>
            <div class="section-card__body syll-body" style="display:none;">
              <ul style="padding-left:1.2rem;font-size:0.83rem;color:var(--text-secondary);line-height:2;">
                ${s.topics.map(t => `<li>${t}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- === TAB: Year 1 === -->
      <div class="fellowship-panel" id="memb-panel-year1" style="display:none;">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Year 1 — Basic Sciences &amp; Foundations</span></div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--blue">🧬</div><div class="stat-card__info"><div class="stat-card__label">Subjects</div><div class="stat-card__value">${y1Subjects.length}</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--navy">🏥</div><div class="stat-card__info"><div class="stat-card__label">Clinical Psychiatry</div><div class="stat-card__value" style="font-size:0.95rem;">9 months</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--green">🏘️</div><div class="stat-card__info"><div class="stat-card__label">Community Rotation</div><div class="stat-card__value" style="font-size:0.95rem;">1 month</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--gold">🏖️</div><div class="stat-card__info"><div class="stat-card__label">Annual Leave</div><div class="stat-card__value" style="font-size:0.95rem;">8 weeks</div></div></div>
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);" class="ov-grid">
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">11 Subjects of Study</span></div>
            <div class="section-card__body">
              <div style="display:flex;flex-wrap:wrap;gap:var(--space-1);">
                ${y1Subjects.map(s => `<span class="badge badge--primary" style="padding:0.4em 0.7em;font-size:0.78rem;">${s}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">Rotation Schedule</span></div>
            <div class="section-card__body">
              ${y1Rotations.map(r => `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:var(--space-2) 0;border-bottom:1px solid var(--border-light);">
                  <div><div style="font-weight:500;font-size:0.85rem;">${r.name}</div>${r.detail?`<div style="font-size:0.75rem;color:var(--text-muted);">${r.detail}</div>`:''}</div>
                  <span class="badge badge--info" style="flex-shrink:0;">${r.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- === TAB: Year 2 === -->
      <div class="fellowship-panel" id="memb-panel-year2" style="display:none;">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Year 2 — Clinical Rotations &amp; Specialty Exposure</span></div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--gold">📚</div><div class="stat-card__info"><div class="stat-card__label">Didactic Lectures</div><div class="stat-card__value" style="font-size:0.9rem;">80 hrs / 40 topics</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--navy">📋</div><div class="stat-card__info"><div class="stat-card__label">Attendance</div><div class="stat-card__value" style="font-size:0.9rem;">80% minimum</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--green">🔄</div><div class="stat-card__info"><div class="stat-card__label">Clinical Rotations</div><div class="stat-card__value" style="font-size:0.9rem;">${y2Rotations.length-1} blocks</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--blue">🏖️</div><div class="stat-card__info"><div class="stat-card__label">Annual Leave</div><div class="stat-card__value" style="font-size:0.9rem;">8 weeks</div></div></div>
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);" class="ov-grid">
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">Rotation Schedule</span></div>
            <div class="section-card__body">
              ${y2Rotations.map(r => `
                <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:var(--space-2) 0;border-bottom:1px solid var(--border-light);">
                  <div><div style="font-weight:500;font-size:0.85rem;">${r.name}</div>${r.detail?`<div style="font-size:0.75rem;color:var(--text-muted);">${r.detail}</div>`:''}</div>
                  <span class="badge badge--accent" style="flex-shrink:0;">${r.duration}</span>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">Year 2 Subjects</span></div>
            <div class="section-card__body" style="font-size:0.85rem;color:var(--text-secondary);line-height:1.8;">
              <strong>Clinical Psychiatry II</strong> — outpatient, inpatient, emergency, liaison, community settings. Rotations in child &amp; adolescent psychiatry, internal medicine/neurology with neuroimaging, neurosurgery, emergency and liaison psychiatry, clinical psychology skills (including testing), and management &amp; administration.
            </div>
          </div>
        </div>
      </div>

      <!-- === TAB: Year 3 === -->
      <div class="fellowship-panel" id="memb-panel-year3" style="display:none;">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Year 3 — Advanced Clinical &amp; Sub-Specialties</span></div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--gold">🧠</div><div class="stat-card__info"><div class="stat-card__label">General Adult</div><div class="stat-card__value">4 mo</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--navy">⚖️</div><div class="stat-card__info"><div class="stat-card__label">Forensic</div><div class="stat-card__value">3 mo</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--green">🔄</div><div class="stat-card__info"><div class="stat-card__label">Addiction Rehab</div><div class="stat-card__value">6 wk</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--blue">👴</div><div class="stat-card__info"><div class="stat-card__label">Geriatric</div><div class="stat-card__value">2 mo</div></div></div>
            </div>
          </div>
        </div>
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Rotation Schedule</span></div>
          <div class="section-card__body">
            ${y3Rotations.map(r => `
              <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:var(--space-3) 0;border-bottom:1px solid var(--border-light);">
                <div><div style="font-weight:500;font-size:0.9rem;">${r.name}</div><div style="font-size:0.78rem;color:var(--text-muted);">${r.detail}</div></div>
                <span class="badge badge--primary" style="flex-shrink:0;">${r.duration}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="section-card">
          <div class="section-card__header"><span class="section-card__title">Year 3 Subjects</span></div>
          <div class="section-card__body" style="font-size:0.85rem;color:var(--text-secondary);line-height:1.9;">
            <strong>Clinical Psychiatry III</strong> — advanced management across all sub-specialties.<br>
            <strong>Psychological Treatment Methods</strong> — CBT, counselling, psychotherapy, relaxation training.<br>
            <strong>Community &amp; Rehabilitation Psychiatry</strong> — outreach clinics, community-based interventions.<br>
            <strong>Addiction Rehabilitation &amp; Occupational Therapy</strong> — at Pantang Hospital.<br>
            <strong>Geriatric Psychiatry</strong> — long-stay psychiatry at Accra Psychiatric Hospital.<br>
            <strong>Forensic Psychiatry</strong> — court attendance, court report writing, criminal responsibility.<br>
            <strong>Revision &amp; Examinations</strong> — 2 weeks dedicated preparation for summative exams.
          </div>
        </div>
      </div>

      <!-- === TAB: Competencies === -->
      <div class="fellowship-panel" id="memb-panel-competencies" style="display:none;">
        ${competencies.map((group, gi) => `
          <div class="section-card" style="margin-bottom:var(--space-5);">
            <div class="section-card__header"><span class="section-card__title">${group.group}</span><span class="badge badge--${gi===0?'primary':gi===1?'accent':'info'}">${group.items.length} items</span></div>
            <div class="section-card__body">
              <ul class="competency-list">
                ${group.items.map((c, i) => `
                  <li class="competency-item">
                    <span class="competency-item__check memb-comp-check" data-grp="${gi}" data-idx="${i}">✓</span>
                    <span class="competency-item__label">${c}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
        <div class="section-card">
          <div class="section-card__header"><span class="section-card__title">Professional Attributes to Develop</span></div>
          <div class="section-card__body">
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);">
              ${['Good interpersonal relationships','Team player','Managerial skills','Mature discretion','Empathy','Patience / Tolerance','Endurance','Work under stress','Time management','Sensitivity','Sense of urgency','Reading habit','Inquiring / Probing mind','Objective / Critical / Scientific mind','Abstract thinking','Lateral thinking','Assertiveness'].map(a => `<span class="badge badge--secondary" style="padding:0.5em 0.8em;font-size:0.78rem;">${a}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- === TAB: Assessment === -->
      <div class="fellowship-panel" id="memb-panel-assessment" style="display:none;">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Formative / Continuous Assessment</span><span class="badge badge--warning">30% of total</span></div>
          <div class="section-card__body">
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:var(--space-3);">Workplace-based assessments conducted throughout the 3-year programme.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:var(--space-3);">
              ${[
                { name:'Log Book / E-Portfolio', desc:'Documented clinical experiences, procedures, and competencies throughout 3 years' },
                { name:'Mini-CEX', desc:'Mini-Clinical Evaluation Exercise — observed clinical encounters with structured feedback' },
                { name:'MCQs', desc:'Regular multiple-choice question assessments on taught content' },
                { name:'Essays', desc:'Written assignments on clinical and theoretical topics' },
                { name:'ACE', desc:'Assessment of Clinical Expertise — direct observation of clinical skills' },
                { name:'CBD', desc:'Case-Based Discussion — structured discussion of clinical cases with assessor' },
                { name:'DOPS', desc:'Direct Observation of Procedural Skills — ECT, interviewing, clinical examination, feedback to patients' },
                { name:'Case Presentation', desc:'Ward rounds and clinical case conference presentations' },
                { name:'Journal Club Presentation', desc:'Critical appraisal and presentation of published research' },
                { name:'Assessment of Teaching', desc:'Evaluation of teaching sessions delivered to students and juniors' },
                { name:'Leadership Skills Observation', desc:'Direct observation of leadership in clinical and academic settings' },
                { name:'Non-Clinical Skills', desc:'Chairing meetings, supervision, professional comportment, time management' }
              ].map(c => `
                <div class="card" style="padding:var(--space-3);border-left:3px solid var(--warning);">
                  <div style="font-weight:600;font-size:0.82rem;">${c.name}</div>
                  <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">${c.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Summative / Final Examination</span><span class="badge badge--error">70% of total — End of Year 3</span></div>
          <div class="section-card__body">
            <div style="background:var(--error-bg);border:1px solid rgba(220,38,38,0.15);border-radius:var(--radius-lg);padding:var(--space-4);margin-bottom:var(--space-4);">
              <strong style="color:var(--error);">Eligibility:</strong>
              <span style="font-size:0.85rem;color:var(--text-secondary);">Completed 3 years of training, completed logbook, passed formative assessments, 75% lecture attendance. Exams held twice yearly — March and September.</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="card" style="border-left:4px solid var(--info);">
                <h4 style="color:var(--info);">Theory Paper</h4>
                <p style="font-size:0.82rem;">150 MCQ stems (5 questions each, best-of-five format). Duration: 2 hours 10 minutes.</p>
              </div>
              <div class="card" style="border-left:4px solid var(--accent);">
                <h4 style="color:var(--accent);">Clinical — Long Case</h4>
                <p style="font-size:0.82rem;">45 min history / examination / formulation + 30 min face-to-face with 3 examiners (2 internal, 1 external). 15 min presentation, 15 min quizzing.</p>
              </div>
              <div class="card" style="border-left:4px solid var(--primary);">
                <h4 style="color:var(--primary);">Clinical — OSCE</h4>
                <p style="font-size:0.82rem;">Examine patients in front of examiners. Covers all 3-year curriculum: basic neurosciences, brain parts identification, general/clinical psychiatry, basic psychology, patient management, picture identification, EEG/skull X-ray interpretation.</p>
              </div>
            </div>
            <table class="data-table">
              <thead><tr><th>Requirement</th><th>Detail</th></tr></thead>
              <tbody>
                <tr><td class="cell--name">Pass Mark</td><td>50% minimum in <strong>each</strong> part</td></tr>
                <tr><td class="cell--name">Weighting</td><td>Continuous Assessment 30%, Final Examination 70%</td></tr>
                <tr><td class="cell--name">Frequency</td><td>Exams held twice yearly — March and September</td></tr>
                <tr><td class="cell--name">Re-sit (Fail)</td><td>Re-sit after 6 months; very poor performance may require 1-year wait before re-attempt</td></tr>
                <tr><td class="cell--name">Attempts Limit</td><td>Government sponsorship withdrawn after 3rd attempt</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-card">
          <div class="section-card__header"><span class="section-card__title">Certification</span></div>
          <div class="section-card__body">
            <p style="font-size:0.9rem;line-height:1.7;">
              Successful candidates awarded <strong>Membership of the Ghana College of Physicians and Surgeons</strong> —
              entitled to use the letters <strong style="color:var(--primary);font-size:1.1rem;">MGCP</strong>.
              This qualification is the prerequisite for entry into the Fellowship programme (FGCP).
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}, () => {
  /* ---- Tab switching ---- */
  document.querySelectorAll('#memb-tabs .fellowship-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#memb-tabs .fellowship-tab').forEach(t => t.classList.remove('fellowship-tab--active'));
      document.querySelectorAll('[id^="memb-panel-"]').forEach(p => p.style.display = 'none');
      tab.classList.add('fellowship-tab--active');
      const target = document.getElementById('memb-panel-' + tab.dataset.tab);
      if (target) target.style.display = '';
    });
  });

  /* ---- Syllabus accordion ---- */
  document.querySelectorAll('.syll-header').forEach(header => {
    header.addEventListener('click', function() {
      const body = this.parentElement.querySelector('.syll-body');
      const arrow = this.querySelector('span:last-child');
      if (body.style.display === 'none') {
        body.style.display = '';
        arrow.textContent = arrow.textContent.replace('▾','▴');
      } else {
        body.style.display = 'none';
        arrow.textContent = arrow.textContent.replace('▴','▾');
      }
    });
  });

  /* ---- Competency check toggles ---- */
  document.querySelectorAll('.memb-comp-check').forEach(check => {
    check.addEventListener('click', function() {
      this.classList.toggle('competency-item__check--done');
      this.nextElementSibling.classList.toggle('competency-item__label--done');
    });
  });
});
