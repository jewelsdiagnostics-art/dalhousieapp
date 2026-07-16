/* ============================================
   Fellowship Curriculum — Full GCPS Programme
   ============================================ */

App.registerPage('fellowship', () => {
  const courses = [
    { id:'PSY-01', title:'Psychiatry as a Holistic Discipline', cat:'Foundations',
      desc:'Biopsychosocial model, interdisciplinary collaboration, holistic patient care approaches.',
      subtopics:['Biopsychosocial model of health and illness','Interdisciplinary collaboration in mental health care','Holistic patient assessment and care planning','Integration of biological, psychological, and social interventions','Role of the psychiatrist in multidisciplinary teams'] },
    { id:'PSY-02', title:'Diagnostic Manuals & Classification', cat:'Foundations',
      desc:'DSM-5, ICD-11 — criticisms, limitations, updates and changes in psychiatric nosology.',
      subtopics:['DSM-5 diagnostic criteria and classification system','ICD-11 structure and key changes from ICD-10','Criticisms and limitations of categorical diagnostic systems','Dimensional vs. categorical approaches','Updates and ongoing changes in psychiatric nosology','Cultural considerations in diagnosis'] },
    { id:'PSY-03', title:'Ethical & Legal Considerations', cat:'Foundations',
      desc:'Autonomy, beneficence, non-maleficence, justice; informed consent; capacity assessment; confidentiality; court reports.',
      subtopics:['Four principles of medical ethics (autonomy, beneficence, non-maleficence, justice)','Informed consent in psychiatric practice','Capacity assessment and determination','Confidentiality and its limits (Tarasoff laws)','Mental health legislation and human rights frameworks','Court reports: structure, content, and legal implications'] },
    { id:'PSY-04', title:'Advanced Psychiatric Interviewing & Assessment', cat:'Clinical Core',
      desc:'Phenomenology, transcultural considerations, case formulation models (biopsychosocial, cognitive-behavioral, psychodynamic).',
      subtopics:['Phenomenology and descriptive psychopathology','Transcultural considerations in psychiatric interviewing','Biopsychosocial case formulation model','Cognitive-behavioral case formulation','Psychodynamic case formulation','Multidisciplinary team collaboration in assessment'] },
    { id:'PSY-05', title:'Psychiatric Rating Scales & Instruments', cat:'Clinical Core',
      desc:'Screening, diagnosis, and symptom severity instruments. Suicidality assessment, functioning/disability measures, quality of life.',
      subtopics:['Screening instruments for depression, anxiety, mania, psychosis','Symptom severity rating scales','Suicidality assessment tools and risk stratification','Functioning and disability measures (GAF, WHODAS)','Quality of life assessment','Transcultural considerations in instrument selection and interpretation'] },
    { id:'PSY-06', title:'Psychological Testing', cat:'Clinical Core',
      desc:'Purpose, administration, and interpretation of intelligence, personality, and neuropsychological testing.',
      subtopics:['Purpose, administration, and interpretation of psychological tests','Intelligence testing (WAIS, Stanford-Binet)','Personality assessment (MMPI, Rorschach, projective tests)','Neuropsychological testing batteries','Test selection and integration with clinical findings','Ethical considerations in psychological testing'] },
    { id:'PSY-07', title:'Cultural Considerations in Psychiatry', cat:'Foundations',
      desc:'Cultural competence, addressing cultural bias, ethical considerations, working with interpreters.',
      subtopics:['Cultural competence in psychiatric practice','Addressing cultural bias in diagnosis and treatment','Ethical considerations in cross-cultural care','Working effectively with interpreters','Culture-bound syndromes and idioms of distress','Traditional healing practices and integration with Western psychiatry'] },
    { id:'PSY-08', title:'Mental Health & Disability', cat:'Clinical Core',
      desc:'Phenomenology of specific disabilities, psychopathology in persons with disability, management approaches.',
      subtopics:['Phenomenology of specific disabilities (intellectual, physical, sensory)','Psychopathology in persons with disability','Management approaches tailored to disability populations','Impact of technology on mental health and disability','Legal frameworks: CRPD, disability rights legislation'] },
    { id:'PSY-09', title:'Psychopharmacology & Medication Management', cat:'Clinical Core',
      desc:'Psychotropic medications, adverse event management, drug-drug interactions, pharmacogenetics, AI in treatment.',
      subtopics:['Classification and mechanisms of action of psychotropic medications','Adverse event identification and management','Drug-drug interactions in polypharmacy','Pharmacogenetics and personalized medicine in psychiatry','AI and machine learning in psychiatric treatment selection','Therapeutic drug monitoring'] },
    { id:'PSY-10', title:'Consultation-Liaison Psychiatry', cat:'Specialty',
      desc:'General hospital settings, psychiatric aspects of medical illness, pain management, palliative care.',
      subtopics:['Psychiatric consultation in general hospital settings','Adjustment disorders in medical illness','Somatic symptom and related disorders','Substance use disorder comorbidity in medical patients','Pain management and psychiatric comorbidities','Palliative care and psychological support'] },
    { id:'PSY-11', title:'Psychiatric Emergencies in Medical Settings', cat:'Specialty',
      desc:'Assessment and management of acute psychiatric crises in medical settings. Crisis stabilization.',
      subtopics:['Acute psychiatric crisis assessment in emergency departments','Risk assessment: suicide, violence, self-harm','Crisis stabilization techniques','Delirium and acute confusional states','Agitation management: pharmacological and non-pharmacological','Mobile crisis teams and crisis stabilization services'] },
    { id:'PSY-12', title:'Pain Management & Psychiatric Comorbidities', cat:'Specialty',
      desc:'Pain-psychiatric interface, assessment of comorbid conditions, multidisciplinary pain management.',
      subtopics:['Pain-psychiatric interface: neurobiological mechanisms','Assessment of comorbid pain and psychiatric conditions','Multidisciplinary pain management approaches','Psychological interventions for chronic pain','Opioid prescribing in patients with psychiatric comorbidity'] },
    { id:'PSY-13', title:'Palliative Care & Psychological Support', cat:'Specialty',
      desc:'End-of-life care, psychological support frameworks, multidisciplinary palliative approaches.',
      subtopics:['Psychological support frameworks in palliative care','Grief and bereavement counselling','End-of-life decision-making and capacity','Multidisciplinary palliative care team approaches','Spiritual and existential distress at end of life'] },
    { id:'PSY-14', title:'Child & Adolescent Psychiatry', cat:'Specialty',
      desc:'ADHD, Autism Spectrum Disorders, disruptive behavior disorders, eating disorders, intellectual disability, infant/maternal mental health.',
      subtopics:['ADHD: etiology, neurobiology, and evidence-based treatment','Autism Spectrum Disorders: early intervention and behavioral therapies','Disruptive behavior disorders (ODD, Conduct Disorder)','Eating disorders: anorexia nervosa, bulimia nervosa','Intellectual disability and specific learning disorders','Infant and maternal mental health','Pediatric consultation-liaison psychiatry'] },
    { id:'PSY-15', title:'Addiction Psychiatry', cat:'Specialty',
      desc:'Neurobiology of addiction, alcohol/opioid use disorders, behavioral addictions, comorbid mental disorders, harm reduction.',
      subtopics:['Neurobiology of addiction: reward pathways and neuroadaptation','Alcohol Use Disorder: pharmacological and psychosocial interventions, relapse prevention','Opioid Use Disorder: substitution therapy, naltrexone, harm reduction','Behavioral addictions: gambling disorder, internet gaming, compulsive buying','Family dynamics in addiction and typical addictive behaviours','Motivational Interviewing and Motivation Enhancement Therapy','Co-morbid mental disorders in addiction'] },
    { id:'PSY-16', title:'Geriatric Psychiatry', cat:'Specialty',
      desc:'Mental health in the elderly, pharmacokinetic/dynamic considerations, polypharmacy, palliative and end-of-life care.',
      subtopics:['Mental health issues in the elderly: depression, anxiety, psychosis','Pharmacokinetic and pharmacodynamic considerations in ageing','Polypharmacy and drug interactions in the elderly','Dementia: assessment and management','Palliative care and end-of-life issues in geriatric psychiatry','Managing polypharmacy in the elderly'] },
    { id:'PSY-17', title:'Forensic Psychiatry', cat:'Specialty',
      desc:'Interface of psychiatry and law, expert witness, criminal responsibility, competency, CRPD, M\'Naghten/Durham rules.',
      subtopics:['Interface between psychiatry and the legal system','The psychiatrist as expert witness','CRPD and mental health law','Competency and criminal responsibility: fitness to plead, insanity defense, diminished capacity','Tarasoff laws and duty to protect','M\'Naghten Rules and Durham Rules','Boundary crossing and boundary violation','Forensic report writing'] },
    { id:'PSY-18', title:'Neuropsychiatry', cat:'Advanced',
      desc:'Neuropsychiatric examination, neurocognitive disorders, movement disorders, TBI sequelae, epilepsy and psychiatric comorbidities.',
      subtopics:['Neuropsychiatric examination techniques','Neurocognitive disorders: dementia types, mild cognitive impairment','Movement disorders: Parkinson\'s, Huntington\'s, Tourette syndrome','Traumatic brain injury and sequelae: post-concussion syndrome, CTE','Epilepsy and neuropsychiatry: PNES, behavioral and cognitive comorbidities','Multidisciplinary approach in neuropsychiatry','Cognitive remediation techniques for neurocognitive impairments'] },
    { id:'PSY-19', title:'Sleep & Sleep Disorders', cat:'Clinical Core',
      desc:'Normal/abnormal sleep physiology, parasomnias, focal dyscognitive seizure disorders.',
      subtopics:['Normal sleep physiology: sleep architecture and circadian rhythms','Abnormal sleep physiology and sleep disorders classification','Parasomnias: NREM and REM parasomnias','Focal dyscognitive seizure disorders and sleep','Sleep assessment tools and polysomnography','Pharmacological and non-pharmacological management of sleep disorders'] },
    { id:'PSY-20', title:'Psychiatric Genetics & Epigenetics', cat:'Advanced',
      desc:'Genetic contributions, epigenetic mechanisms, genetic testing and clinical applications in psychiatry.',
      subtopics:['Genetic contributions to psychiatric disorders','Epigenetic mechanisms in mental illness','Family, twin, and adoption studies','Genetic testing: direct gene analysis vs. gene tracking','Genetic markers, linkage analysis, LOD scores','Chromosome abnormalities and psychiatric phenotypes','Genetic counselling in psychiatry'] },
    { id:'PSY-21', title:'Brain Imaging Techniques', cat:'Advanced',
      desc:'fMRI, PET, SPECT — neuroimaging biomarkers, treatment response imaging, AI advances.',
      subtopics:['Functional MRI (fMRI): principles and psychiatric applications','PET and SPECT imaging in psychiatry','Neuroimaging biomarkers for psychiatric disorders','Treatment response prediction using neuroimaging','AI and machine learning advances in neuroimaging','Integration of fMRI with EEG'] },
    { id:'PSY-22', title:'Current Issues & Future Directions', cat:'Advanced',
      desc:'Precision psychiatry, AI/machine learning, TMS/brain stimulation, cultural psychiatry, global mental health.',
      subtopics:['Precision psychiatry: tailoring treatment to individual profiles','AI and machine learning in psychiatric diagnosis and treatment','Transcranial Magnetic Stimulation (TMS) and brain stimulation techniques','Cultural psychiatry: emerging paradigms','Global mental health: challenges and opportunities','Indications and techniques of brain stimulation'] },
    { id:'PSY-23', title:'Telepsychiatry & Digital Mental Health', cat:'Professional',
      desc:'Practice, ethics, legal aspects; platforms; remote assessment and diagnosis; teletherapy efficacy.',
      subtopics:['Telepsychiatry practice: standards and guidelines','Ethical and legal aspects of remote care','Platforms and technologies for digital mental health','Remote psychiatric assessment and diagnosis','Teletherapy efficacy and limitations','Advances in digital mental health'] },
    { id:'PSY-24', title:'Global Mental Health Challenges', cat:'Professional',
      desc:'Disparities and access, humanitarian/refugee mental health, low-resource settings, collaborative partnerships.',
      subtopics:['Disparities in mental health access globally','Humanitarian and refugee mental health','Mental health in low-resource settings','Collaborative partnerships for global mental health initiatives','Task-sharing and capacity building approaches'] },
    { id:'PSY-25', title:'Integrative & Holistic Psychiatry', cat:'Professional',
      desc:'Complementary/alternative medicine, mind-body interventions (yoga, meditation), nutritional psychiatry, exercise.',
      subtopics:['Complementary and alternative medicine in psychiatry','Mind-body interventions: yoga, meditation, mindfulness','Nutritional psychiatry and the gut-brain axis','Exercise and physical activity in mental health','Evidence base for integrative approaches'] },
    { id:'PSY-26', title:'Advocacy & Policy Development', cat:'Professional',
      desc:'Mental health policy/legislation, stigma reduction, funding advocacy, patient/family advocacy.',
      subtopics:['Mental health policy and legislation development','Stigma reduction strategies and campaigns','Funding advocacy for mental health services','Patient and family advocacy','Role of professional organizations in advocacy'] },
    { id:'PSY-27', title:'Community & Rehabilitation Psychiatry', cat:'Professional',
      desc:'Psychiatric rehabilitation/recovery models, community services, homelessness, peer support.',
      subtopics:['Psychiatric rehabilitation and recovery models','Community mental health service models','Psychiatric Rehabilitation Assessment and Goal Setting','Homelessness and mental health','Peer support and advocacy','Collaborative care models and integrated service delivery','Setting up facility and community mental health services'] }
  ];

  const competenciesY1 = [
    'Independently manage all general adult psychiatry conditions',
    'Assess/evaluate childhood mental disorders using psychological tools; prescribe long-term management',
    'Read neuroimages; request and understand neuropsychiatry investigations; determine long-term management',
    'Appreciate law and mental health; assist court for determination of competence; uphold rights of persons with mental illness',
    'Independently work in general health facility managing all mental ill-health and disability conditions',
    'Diagnose and manage all forms of addictions; detoxify and transfer to rehabilitation',
    'Understand different forms of community mental health',
    'Understand and manage nuances of culture and diversity in mental health',
    'Understand normal ageing and common mental conditions in the elderly',
    'Understand normal sleep; identify and manage sleep abnormalities'
  ];

  const competenciesY2 = [
    'Undertake independent research and be able to publish',
    'Adequate skills/competencies to work in managerial/administrative role',
    'Establish new mental health facilities and units',
    'Confidently undertake tele-psychiatry'
  ];

  const coreCompetencies = [...competenciesY1, ...competenciesY2];
  const catalogTutorials = TutorialCatalog.getTutorials();
  const mandatoryLectureItems = catalogTutorials.slice(0, 10);
  const coreTutorialItems = catalogTutorials.slice(7, 27);
  const currentUser = Auth.currentUser ? Auth.currentUser() : null;
  const selectedTutorials = new Set((currentUser && Array.isArray(currentUser.tutorials)) ? currentUser.tutorials : []);

  function _renderSelectableCard(item, sectionLabel) {
    const selected = selectedTutorials.has(item.id);
    return `
      <button type="button" class="fellowship-select-card${selected ? ' fellowship-select-card--selected' : ''}" data-tutorial-id="${item.id}" data-section="${sectionLabel}" style="width:100%;text-align:left;padding:var(--space-3);border:1px solid ${selected ? 'var(--primary)' : 'var(--border-light)'};border-radius:var(--radius-lg);background:${selected ? 'var(--primary-bg)' : 'var(--surface)'};cursor:pointer;display:grid;gap:0.55rem;box-shadow:${selected ? '0 12px 28px rgba(200,150,12,0.14)' : 'none'};">
        <div class="fellowship-select-card__top">
          <span class="badge badge--${sectionLabel === 'lectures' ? 'secondary' : 'primary'}">${sectionLabel === 'lectures' ? 'Lecture' : 'Tutorial'}</span>
          <span class="badge badge--neutral">${item.id}</span>
        </div>
        <div class="fellowship-select-card__title">${item.label}</div>
        <div class="fellowship-select-card__footer">
          <span>${item.groupLabel}</span>
          <span class="badge badge--${selected ? 'success' : 'info'}">${selected ? 'Selected' : 'Select'}</span>
        </div>
      </button>
    `;
  }

  return `
    <div class="page-content">
      <div class="page-header">
        <h1 class="page-header__title">Fellowship in General Adult Psychiatry</h1>
        <p class="page-header__subtitle">GCPS Faculty of Psychiatry — 2-Year Post-Membership Programme (FGCP)</p>
      </div>

      <div class="fellowship-tabs" id="fellowship-tabs">
        <button class="fellowship-tab fellowship-tab--active" data-tab="overview">Overview</button>
        <button class="fellowship-tab" data-tab="year1">Year 1 Rotations</button>
        <button class="fellowship-tab" data-tab="year2">Year 2 Rotations</button>
        <button class="fellowship-tab" data-tab="competencies">Core Competencies</button>
        <button class="fellowship-tab" data-tab="assessment">Assessment</button>
      </div>

      <!-- ===== TAB: Overview ===== -->
      <div class="fellowship-panel" id="panel-overview">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Programme Summary</span></div>
          <div class="section-card__body">
            <p style="font-size:0.9rem;line-height:1.7;">
              The <strong>Fellowship in General Adult Psychiatry</strong> is a 2-year advanced programme by the Ghana College of
              Physicians and Surgeons (GCPS), Faculty of Psychiatry. It produces a consultant-eligible Psychiatrist qualified to
              act as an independent consultant in General Adult Psychiatry. Successful candidates earn the designation
              <strong style="color:var(--primary);">FGCP</strong> (Fellow of the Ghana College of Physicians).
            </p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);" class="ov-grid">
          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">Entry Requirements</span></div>
            <div class="section-card__body">
              <ul style="padding-left:1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:2;">
                <li>Membership of GCPS (MGCP) or recognised equivalent qualification</li>
                <li>Completion of Diploma in Project Design and Management (DPDM) Course</li>
                <li>Post-membership work in Ghana (min. 1 year, at least 6 months clinical practice in a psychiatric facility)</li>
                <li>Registration with Medical &amp; Dental Council of Ghana as specialist psychiatrist</li>
                <li>Full abstract of dissertation proposal presented at selection interview</li>
                <li>Pass a selection interview</li>
              </ul>
            </div>
          </div>

          <div class="section-card">
            <div class="section-card__header"><span class="section-card__title">8 Learning Outcomes</span></div>
            <div class="section-card__body">
              <ol style="padding-left:1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:1.9;">
                <li>Exhibit in-depth evidence-based knowledge of General Adult Psychiatry and/or chosen subspecialty</li>
                <li>Demonstrate skills, competencies, and attitudes to manage psychiatric problems</li>
                <li>Recognise, assess, plan, and manage a person with psychiatric illness independently</li>
                <li>Be able to educate Specialists, Residents, other medical personnel in Psychiatry</li>
                <li>Plan and carry out research in mental health independently</li>
                <li>Be a leader able to give sound evidence-based advice and direction</li>
                <li>Be an effective communicator through media and other means</li>
                <li>Complete dissertation; share knowledge through conference presentations, peer-reviewed publications</li>
              </ol>
            </div>
          </div>
        </div>

        <div class="section-card" style="margin-top:var(--space-5);">
          <div class="section-card__header">
            <span class="section-card__title">Fellowship Teaching Catalogue</span>
            <span class="badge badge--primary">${mandatoryLectureItems.length + coreTutorialItems.length} Selectable Items</span>
          </div>
          <div class="section-card__body" style="display:grid;gap:var(--space-5);">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
                <div>
                  <div style="font-size:0.78rem;font-weight:700;color:var(--primary-dark);text-transform:uppercase;letter-spacing:0.08em;">Mandatory Lectures</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary);">10 core mandatory lectures for fellowship teaching.</div>
                </div>
                <span class="badge badge--secondary">${mandatoryLectureItems.length} items</span>
              </div>
              <div class="fellowship-selection-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--space-3);">
                ${mandatoryLectureItems.map(item => _renderSelectableCard(item, 'lectures')).join('')}
              </div>
            </div>

            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);">
                <div>
                  <div style="font-size:0.78rem;font-weight:700;color:var(--primary-dark);text-transform:uppercase;letter-spacing:0.08em;">Core Tutorials</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary);">20 core tutorials available for selection and dashboard tracking.</div>
                </div>
                <span class="badge badge--primary">${coreTutorialItems.length} items</span>
              </div>
              <div class="fellowship-selection-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--space-3);">
                ${coreTutorialItems.map(item => _renderSelectableCard(item, 'tutorials')).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="section-card" style="margin-top:var(--space-5);display:none;">
          <div class="section-card__header">
            <span class="section-card__title">Mandatory Courses — Full Syllabus</span>
            <span class="badge badge--primary">${courses.length} Courses</span>
          </div>
          <div class="section-card__body" style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0;padding-bottom:var(--space-3);">
            Click any course card to expand its detailed sub-topics
          </div>
          <div class="section-card__body" style="padding-top:0;">
            <div class="curriculum-grid stagger" id="course-grid">
              ${courses.map((c, ci) => `
                <div class="course-card card${selectedTutorials.has(c.id) ? ' course-card--selected' : ''}" data-cat="${c.cat}" data-course-id="${c.id}" id="course-${ci}"${selectedTutorials.has(c.id) ? ' style="border-color:var(--primary);box-shadow:0 18px 40px rgba(200,150,12,0.14);"' : ''}>
                  <div class="course-card__header" style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                      <div class="course-card__code">${c.id}</div>
                      <h4 class="course-card__title">${c.title}</h4>
                      <p class="course-card__desc">${c.desc}</p>
                      <span class="badge badge--secondary">${c.cat}</span>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;flex-shrink:0;margin-left:var(--space-2);">
                      <button type="button" class="btn btn--outline btn--sm course-card__select" data-course-id="${c.id}" data-course-cat="${c.cat}">${selectedTutorials.has(c.id) ? 'Selected' : 'Select'}</button>
                      <span class="course-card__expand" style="font-size:1.2rem;cursor:pointer;color:var(--text-muted);">+</span>
                    </div>
                  </div>
                  <div class="course-card__subtopics" style="display:none;margin-top:var(--space-3);padding-top:var(--space-3);border-top:1px solid var(--border-light);">
                    <div style="font-size:0.73rem;font-weight:600;text-transform:uppercase;color:var(--primary);margin-bottom:var(--space-2);">Sub-Topics</div>
                    <ul style="padding-left:1.1rem;font-size:0.8rem;color:var(--text-secondary);line-height:1.9;">
                      ${c.subtopics.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- ===== TAB: Year 1 ===== -->
      <div class="fellowship-panel" id="panel-year1" style="display:none;">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Year 1 — Structure &amp; Milestones</span></div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--gold">🏥</div><div class="stat-card__info"><div class="stat-card__label">Training Site</div><div class="stat-card__value" style="font-size:0.95rem;">Recognised GCPS Institution / Hospital</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--navy">🔄</div><div class="stat-card__info"><div class="stat-card__label">Rotations</div><div class="stat-card__value">${courses.length} × 4-week blocks</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--green">📋</div><div class="stat-card__info"><div class="stat-card__label">Health Admin Course</div><div class="stat-card__value" style="font-size:0.95rem;">1 month minimum at approved institution</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--blue">📝</div><div class="stat-card__info"><div class="stat-card__label">Dissertation Proposal</div><div class="stat-card__value" style="font-size:0.85rem;">Submit by end of first 6 months</div></div></div>
            </div>
            <div style="background:var(--primary-bg);border:1px solid rgba(200,150,12,0.2);border-radius:var(--radius-lg);padding:var(--space-4);">
              <strong style="color:var(--primary-dark);">Year 1 Key Requirements:</strong>
              <ul style="margin:var(--space-2) 0 0 1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:1.8;">
                <li>Supervised role consolidating Membership-level Psychiatry experience at a training institution/hospital recognised by GCPS</li>
                <li>Four-week rotation in <strong>each</strong> of the ${courses.length} course content areas listed above</li>
                <li>Attend a health administration course (minimum 1 month) at an approved institution</li>
                <li>Participate in teaching clinical psychiatry to medical students and Junior Residents</li>
                <li>By end of first 6 months: submit dissertation proposal to Faculty Chair</li>
                <li>Proposal approval expected within 3 months of submission</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="section-card">
          <div class="section-card__header"><span class="section-card__title">Year 1 Expected Competencies</span><span class="badge badge--info">${competenciesY1.length} items</span></div>
          <div class="section-card__body">
            <ul class="competency-list">
              ${competenciesY1.map((c, i) => `
                <li class="competency-item">
                  <span class="competency-item__check comp-check-y1" data-idx="${i}">✓</span>
                  <span class="competency-item__label">${c}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- ===== TAB: Year 2 ===== -->
      <div class="fellowship-panel" id="panel-year2" style="display:none;">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Year 2 — Structure &amp; Milestones</span></div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--gold">🔄</div><div class="stat-card__info"><div class="stat-card__label">Rotations Continue</div><div class="stat-card__value" style="font-size:0.95rem;">4-week blocks across all content areas</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--navy">📖</div><div class="stat-card__info"><div class="stat-card__label">Thesis</div><div class="stat-card__value" style="font-size:0.85rem;">Submit 6 months before examination</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--green">📄</div><div class="stat-card__info"><div class="stat-card__label">Publication</div><div class="stat-card__value" style="font-size:0.85rem;">At least 1 paper or abstract encouraged</div></div></div>
              <div class="stat-card"><div class="stat-card__icon stat-card__icon--blue">📒</div><div class="stat-card__info"><div class="stat-card__label">Log Book</div><div class="stat-card__value" style="font-size:0.85rem;">Signed off 3 months before exam</div></div></div>
            </div>
            <div style="background:var(--accent-bg);border:1px solid rgba(27,126,75,0.2);border-radius:var(--radius-lg);padding:var(--space-4);">
              <strong style="color:var(--accent-dark);">Year 2 Key Requirements:</strong>
              <ul style="margin:var(--space-2) 0 0 1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:1.8;">
                <li>Continuation of four-week rotations in each course content area</li>
                <li>May do rotations in an accredited training centre in or outside Ghana (only after fellowship proposal has been submitted and accepted)</li>
                <li>Research and writing of thesis — must be submitted 6 months before final examination</li>
                <li>Log-book completion; rotations affirmed by supervisors at least 3 months before examination</li>
                <li>Encouraged to publish at least one paper in a peer-reviewed journal or do an abstract presentation</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Overseas Rotation Guidelines -->
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Overseas Rotation Guidelines</span><span class="badge badge--info">3–12 months</span></div>
          <div class="section-card__body">
            <table class="data-table">
              <thead><tr><th>Rule</th><th>Detail</th></tr></thead>
              <tbody>
                <tr><td class="cell--name">Eligibility</td><td>Only after dissertation proposal has been approved by the College</td></tr>
                <tr><td class="cell--name">Duration</td><td>Encouraged: 3–12 months in approved facilities in any course content area</td></tr>
                <tr><td class="cell--name">Observership</td><td>Maximum 3 months may be credited towards clinical rotations (observership only)</td></tr>
                <tr><td class="cell--name">Hands-On Rotations</td><td>May count towards clinical rotation requirements if in an approved training facility</td></tr>
                <tr><td class="cell--name">Approval</td><td>All overseas rotations must be pre-approved by the Faculty of Psychiatry, GCPS</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="section-card" style="display:none;">
          <div class="section-card__header"><span class="section-card__title">Year 2 Expected Competencies</span><span class="badge badge--info">${competenciesY2.length} items</span></div>
          <div class="section-card__body">
            <ul class="competency-list">
              ${competenciesY2.map((c, i) => `
                <li class="competency-item">
                  <span class="competency-item__check comp-check-y2" data-idx="${i}">✓</span>
                  <span class="competency-item__label">${c}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>

      <!-- ===== TAB: Core Competencies ===== -->
      <div class="fellowship-panel" id="panel-competencies" style="display:none;">
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">All 14 Core Skills &amp; Competencies</span><span class="badge badge--primary">Log-book sign-off required</span></div>
          <div class="section-card__body">
            <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:var(--space-3);">These 14 competencies must be signed off in the fellow's logbook by supervising consultants. They encompass all Year 1 and Year 2 expected competencies.</p>
            <ul class="competency-list">
              ${coreCompetencies.map((c, i) => `
                <li class="competency-item">
                  <span class="competency-item__check comp-check-all" data-idx="${i}">✓</span>
                  <span class="competency-item__label">${c}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">10 Core Lectures (Mandatory)</span></div>
          <div class="section-card__body">
            <ol style="padding-left:1.2rem;font-size:0.83rem;color:var(--text-secondary);line-height:2.2;">
              <li>Psychological Testing in Psychiatry</li>
              <li>Psychopharmacology and Medication Management</li>
              <li>Pain Management and Psychiatric Comorbidities</li>
              <li>Palliative Care and Psychological Support</li>
              <li>Sleep and Sleep Disorders</li>
              <li>Psychiatric Genetics and Epigenetics</li>
              <li>Brain Imaging Techniques in Psychiatry</li>
              <li>Current Issues and Future Directions</li>
              <li>Global Mental Health Challenges</li>
              <li>Advocacy and Policy Development in Psychiatry</li>
            </ol>
          </div>
        </div>

        <div class="section-card" style="display:none;">
          <div class="section-card__header"><span class="section-card__title">20 Core Tutorials</span></div>
          <div class="section-card__body">
            <ol style="padding-left:1.2rem;font-size:0.83rem;color:var(--text-secondary);line-height:2.2;">
              <li>Setting up facility and community mental health services</li>
              <li>Psychopharmacology and management of adverse events of psychotropics</li>
              <li>Relevant laws and conventions (CRPD, labour law, Criminal Offences Act, Convention on Rights of the Child, Children Act)</li>
              <li>Forensic Report writing</li>
              <li>Family dynamics in addiction, typical behaviours of addiction, diagnosis</li>
              <li>Motivational interviewing and Motivation Enhancement Therapy</li>
              <li>Psychiatric Rehabilitation Assessment and Goal Setting</li>
              <li>Collaborative Care Models and Integrated Service Delivery</li>
              <li>Mobile Crisis Teams and Crisis Stabilization Services</li>
              <li>Multidisciplinary approach in Neuropsychiatry</li>
              <li>Management strategies for neuropsychiatric sequelae of TBI</li>
              <li>Cognitive remediation techniques for neurocognitive impairments</li>
              <li>Indications and techniques of brain stimulation</li>
              <li>Advances in Digital Mental Health and Telepsychiatry</li>
              <li>Integration of Artificial Intelligence and Machine Learning in Psychiatry</li>
              <li>Collaborative Partnerships for Global Mental Health Initiatives</li>
              <li>Managing polypharmacy in the elderly</li>
              <li>Research methods in Psychiatry</li>
              <li>Overview of Psychiatric symptoms in various medical specialties (cardiology, neurology, nephrology, haematology, infectious disease)</li>
              <li>Assessment and management of acute psychiatric crises in medical settings</li>
            </ol>
          </div>
        </div>
      </div>

      <!-- ===== TAB: Assessment ===== -->
      <div class="fellowship-panel" id="panel-assessment" style="display:none;">
        <!-- Formative -->
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Formative / Continuous Assessment</span><span class="badge badge--warning">30% of total marks</span></div>
          <div class="section-card__body">
            <table class="data-table">
              <thead><tr><th>Component</th><th>Marks</th><th>Description</th></tr></thead>
              <tbody>
                <tr>
                  <td class="cell--name">Case Based Discussion (CBD)</td><td><strong>10</strong></td>
                  <td style="font-size:0.82rem;">Pathophysiology, Differential Diagnosis, Investigation planning, Treatment selection, Feedback integration</td>
                </tr>
                <tr>
                  <td class="cell--name">Direct Observation of Procedures &amp; Skills (DOPS)</td><td><strong>5</strong></td>
                  <td style="font-size:0.82rem;">Steps of procedure demonstrated, Competence at executing procedure, Feedback received and applied</td>
                </tr>
                <tr>
                  <td class="cell--name">Management &amp; Leadership Skills</td><td><strong>10</strong></td>
                  <td style="font-size:0.82rem;">Time management, Conflict resolution, Moderation skills, Supervisory/monitoring skill, Public speaking/media engagement skill</td>
                </tr>
                <tr>
                  <td class="cell--name">Research &amp; Publication Skills</td><td><strong>5</strong></td>
                  <td style="font-size:0.82rem;">Research activity, publication output, conference presentations</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Final Exam -->
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Final Examination</span><span class="badge badge--error">70% of total marks</span></div>
          <div class="section-card__body">
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--space-4);margin-bottom:var(--space-4);">
              <div class="card" style="border-left:4px solid var(--info);">
                <h4 style="color:var(--info);">Part 1 — Written Examination</h4>
                <ul style="padding-left:1.2rem;font-size:0.8rem;color:var(--text-secondary);line-height:1.8;">
                  <li>100 MCQs — 1 hour 40 minutes</li>
                  <li>2 Essays — 1 hour (one forensic report or medical report is mandatory)</li>
                </ul>
              </div>
              <div class="card" style="border-left:4px solid var(--accent);">
                <h4 style="color:var(--accent);">Part 2 — Viva Voce</h4>
                <ul style="padding-left:1.2rem;font-size:0.8rem;color:var(--text-secondary);line-height:1.8;">
                  <li>10 questions, 5 minutes each</li>
                  <li>Must pass at least 7 out of 10 questions</li>
                  <li>Covers all curriculum content areas</li>
                </ul>
              </div>
              <div class="card" style="border-left:4px solid var(--primary);">
                <h4 style="color:var(--primary);">Part 3 — Thesis Defence</h4>
                <ul style="padding-left:1.2rem;font-size:0.8rem;color:var(--text-secondary);line-height:1.8;">
                  <li>Defence of original research study</li>
                  <li>Duration: 1.5 hours</li>
                  <li>2 assessors read thesis and join panel</li>
                  <li>Examining panel: 3 Fellows of the Faculty</li>
                </ul>
              </div>
            </div>
            <p style="font-size:0.78rem;color:var(--text-muted);">Parts 1 and 2 constitute one section; a cumulative pass is required in both. Thesis must be submitted at least 6 months before the final examination.</p>
          </div>
        </div>

        <!-- Thesis Defence Outcomes -->
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Thesis Defence Outcomes</span></div>
          <div class="section-card__body">
            <table class="data-table">
              <thead><tr><th>Outcome</th><th>Criteria</th><th>Action</th></tr></thead>
              <tbody>
                <tr>
                  <td><span class="badge badge--success">(a) Pass</span></td>
                  <td style="font-size:0.82rem;">Thesis acceptable without modification or requires only administrative corrections</td>
                  <td style="font-size:0.82rem;">Proceed to certification</td>
                </tr>
                <tr>
                  <td><span class="badge badge--info">(b) Provisional Pass</span></td>
                  <td style="font-size:0.82rem;">Thesis acceptable with minor modifications under named supervisor</td>
                  <td style="font-size:0.82rem;">Modifications required; no re-defence needed</td>
                </tr>
                <tr>
                  <td><span class="badge badge--warning">(c) Referral</span></td>
                  <td style="font-size:0.82rem;">(i) Substantial modification/rewriting under named supervisor and re-defence in 6 months<br>(ii) Thesis acceptable but defence was poor — re-defence required</td>
                  <td style="font-size:0.82rem;">Re-defence in 6 months</td>
                </tr>
                <tr>
                  <td><span class="badge badge--error">(d) Outright Rejection</span></td>
                  <td style="font-size:0.82rem;">Poorly conducted research, did not conform to approved design, or poorly written thesis</td>
                  <td style="font-size:0.82rem;">New thesis required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Overall Exam Outcomes -->
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">Overall Examination Outcomes</span></div>
          <div class="section-card__body">
            <table class="data-table">
              <thead><tr><th>#</th><th>Outcome</th><th>Criteria</th></tr></thead>
              <tbody>
                <tr>
                  <td><span class="badge badge--success">i</span></td>
                  <td class="cell--name">Outright Pass</td>
                  <td style="font-size:0.82rem;">Passes all three parts (Written + Viva Voce + Thesis Defence)</td>
                </tr>
                <tr>
                  <td><span class="badge badge--info">ii</span></td>
                  <td class="cell--name">Provisional Pass</td>
                  <td style="font-size:0.82rem;">Passes viva/theory; minor thesis corrections required. No re-defence.</td>
                </tr>
                <tr>
                  <td><span class="badge badge--warning">iii</span></td>
                  <td class="cell--name">Referral in Theory</td>
                  <td style="font-size:0.82rem;">Passes thesis defence; fails viva/theory. Re-sit theory/viva in 6 months.</td>
                </tr>
                <tr>
                  <td><span class="badge badge--error">iv</span></td>
                  <td class="cell--name">Outright Referral</td>
                  <td style="font-size:0.82rem;">Fails viva/theory AND thesis rejected. Both must be re-attempted.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- CPD -->
        <div class="section-card" style="margin-bottom:var(--space-5);">
          <div class="section-card__header"><span class="section-card__title">CPD &amp; Update Course Requirements</span></div>
          <div class="section-card__body">
            <ul style="padding-left:1.2rem;font-size:0.85rem;color:var(--text-secondary);line-height:2;">
              <li>One relevant/accredited update course per year (minimum 3 days)</li>
              <li>Faculty organises mandatory revision courses once per year during Years 1 and 2</li>
              <li>Must meet prevailing regulatory body CPD requirements for retention to practice</li>
            </ul>
          </div>
        </div>

        <!-- Certification -->
        <div class="section-card">
          <div class="section-card__header"><span class="section-card__title">Certification</span></div>
          <div class="section-card__body">
            <p style="font-size:0.9rem;line-height:1.7;">
              Successful candidate awarded <strong>Fellowship certificate</strong> and entitled to use the letters
              <strong style="color:var(--primary);font-size:1.1rem;">FGCP</strong> — Fellow of the Ghana College of Physicians and Surgeons.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
}, () => {
  /* ---- Tab switching ---- */
  document.querySelectorAll('#fellowship-tabs .fellowship-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#fellowship-tabs .fellowship-tab').forEach(t => t.classList.remove('fellowship-tab--active'));
      document.querySelectorAll('#panel-overview, #panel-year1, #panel-year2, #panel-competencies, #panel-assessment').forEach(p => p.style.display = 'none');
      tab.classList.add('fellowship-tab--active');
      const target = document.getElementById('panel-' + tab.dataset.tab);
      if (target) target.style.display = '';
    });
  });

  /* ---- Expand/collapse course cards ---- */
  document.querySelectorAll('.course-card').forEach(card => {
    const header = card.querySelector('.course-card__header');
    const expand = card.querySelector('.course-card__expand');
    const subtopics = card.querySelector('.course-card__subtopics');
    header.style.cursor = 'pointer';
    header.addEventListener('click', function(e) {
      if (subtopics.style.display === 'none') {
        subtopics.style.display = '';
        expand.textContent = '−';
        expand.style.color = 'var(--primary)';
      } else {
        subtopics.style.display = 'none';
        expand.textContent = '+';
        expand.style.color = 'var(--text-muted)';
      }
    });
  });

  document.querySelectorAll('.course-card__select').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const card = btn.closest('.course-card');
      const current = Auth.currentUser ? Auth.currentUser() : null;
      if (!current || !card) {
        Notifications.toast('Sign in required', 'Please sign in to save teaching selections', 'warning', 2400);
        return;
      }

      const selected = card.classList.toggle('course-card--selected');
      card.style.borderColor = selected ? 'var(--primary)' : '';
      card.style.boxShadow = selected ? '0 18px 40px rgba(200,150,12,0.14)' : '';
      btn.textContent = selected ? 'Selected' : 'Select';

      const selectedCards = [...document.querySelectorAll('.course-card.course-card--selected')];
      const nextTutorials = selectedCards.map(el => el.dataset.courseId);
      const nextMainTopics = [...new Set(selectedCards.map(el => el.dataset.cat))];
      Auth.updateSelections(current.username, {
        mainTopics: nextMainTopics,
        tutorials: nextTutorials
      });

      Notifications.toast(
        selected ? 'Tutorial selected' : 'Tutorial removed',
        selected ? `${card.dataset.courseId} added to your dashboard` : `${card.dataset.courseId} removed from your dashboard`,
        selected ? 'success' : 'info',
        2200
      );
    });
  });

  document.querySelectorAll('.fellowship-select-card').forEach(card => {
    card.addEventListener('click', () => {
      const current = Auth.currentUser ? Auth.currentUser() : null;
      if (!current) {
        Notifications.toast('Sign in required', 'Please sign in to save teaching selections', 'warning', 2400);
        return;
      }

      const tutorialId = card.dataset.tutorialId;
      const isSelected = card.classList.toggle('fellowship-select-card--selected');
      card.style.borderColor = isSelected ? 'var(--primary)' : 'var(--border-light)';
      card.style.background = isSelected ? 'var(--primary-bg)' : 'var(--surface)';
      card.style.boxShadow = isSelected ? '0 12px 28px rgba(200,150,12,0.14)' : 'none';

      const statusBadge = card.querySelector('.badge--success, .badge--info');
      if (statusBadge) {
        statusBadge.textContent = isSelected ? 'Selected' : 'Select';
        statusBadge.className = `badge badge--${isSelected ? 'success' : 'info'}`;
      }

      const allSelected = [...document.querySelectorAll('.fellowship-select-card.fellowship-select-card--selected')]
        .map(el => el.dataset.tutorialId);
      Auth.updateSelections(current.username, {
        mainTopics: current.mainTopics || [],
        tutorials: allSelected
      });

      Notifications.toast(
        isSelected ? 'Item selected' : 'Item removed',
        `${tutorialId} ${isSelected ? 'added to' : 'removed from'} your fellowship selections`,
        isSelected ? 'success' : 'info',
        2200
      );
    });
  });

  /* ---- Competency check toggles ---- */
  document.querySelectorAll('.competency-item__check').forEach(check => {
    check.addEventListener('click', function() {
      this.classList.toggle('competency-item__check--done');
      this.nextElementSibling.classList.toggle('competency-item__label--done');
      const total = document.querySelectorAll('.comp-check-all').length;
      const done = document.querySelectorAll('.comp-check-all.competency-item__check--done').length;
      if (done > 0 && total > 0) Notifications.toast('Competency Signed Off', `${done} of ${total} skills completed`, 'success', 2000);
    });
  });
});
