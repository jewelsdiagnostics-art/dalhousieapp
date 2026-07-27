/* ============================================
   Tutorial Catalog - shared course/topic data
   ============================================ */

const TutorialCatalog = (() => {
  const groups = [
    {
      id: 'foundations',
      label: 'Foundations & Orientation',
      description: 'Core concepts, curriculum orientation, and clinical reasoning.',
      tutorials: [
        { id: 'psy-01', label: 'Psychiatry as a Holistic Discipline' },
        { id: 'psy-02', label: 'Diagnostic Manuals & Classification' },
        { id: 'psy-03', label: 'Ethical & Legal Considerations' },
        { id: 'psy-04', label: 'Advanced Psychiatric Interviewing & Assessment' }
      ]
    },
    {
      id: 'basic-sciences',
      label: 'Basic Sciences',
      description: 'The neuroscience and psychology foundation for specialist psychiatry.',
      tutorials: [
        { id: 'mem-1', label: 'Introduction to Psychiatry' },
        { id: 'mem-2', label: 'Basic Psychology' },
        { id: 'mem-3', label: 'Social Psychology' },
        { id: 'mem-4', label: 'Social Science & Culture in Psychiatry' },
        { id: 'mem-5', label: 'Human Growth & Development' },
        { id: 'mem-6', label: 'Basic Neurosciences' }
      ]
    },
    {
      id: 'assessment-skills',
      label: 'Assessment & Diagnostic Skills',
      description: 'Scales, testing, interviewing, and case formulation.',
      tutorials: [
        { id: 'psy-05', label: 'Psychiatric Rating Scales & Instruments' },
        { id: 'psy-06', label: 'Psychological Testing' },
        { id: 'mem-7', label: 'Ethology' },
        { id: 'mem-8', label: 'Ethics, Mental Health Legislation & Human Rights' },
        { id: 'mem-9', label: 'Epidemiology' },
        { id: 'mem-10', label: 'Biostatistics' }
      ]
    },
    {
      id: 'clinical-core',
      label: 'Clinical Psychiatry Core',
      description: 'General adult psychiatry, daily clinical care, and teaching rounds.',
      tutorials: [
        { id: 'mem-11', label: 'Clinical Topics' },
        { id: 'mem-12', label: 'Specific Clinical Topics - Didactic Lectures' },
        { id: 'psy-09', label: 'Psychopharmacology & Medication Management' },
        { id: 'psy-10', label: 'Consultation-Liaison Psychiatry' },
        { id: 'psy-11', label: 'Psychiatric Emergencies in Medical Settings' }
      ]
    },
    {
      id: 'specialty-rotations',
      label: 'Specialty Rotations',
      description: 'Child, addiction, geriatric, forensic, neuropsychiatry, and liaison care.',
      tutorials: [
        { id: 'psy-14', label: 'Child & Adolescent Psychiatry' },
        { id: 'psy-15', label: 'Addiction Psychiatry' },
        { id: 'psy-16', label: 'Geriatric Psychiatry' },
        { id: 'psy-17', label: 'Forensic Psychiatry' },
        { id: 'psy-18', label: 'Neuropsychiatry' }
      ]
    },
    {
      id: 'professional-practice',
      label: 'Professional Practice',
      description: 'Teaching, supervision, leadership, and communication skills.',
      tutorials: [
        { id: 'mem-13', label: 'Teaching Methods & Instruction' },
        { id: 'mem-14', label: 'Log Book & Workplace Assessment' },
        { id: 'mem-15', label: 'Monitoring, Supervision & Mentorship' },
        { id: 'mem-16', label: 'Attributes, Qualities & Professional Attitude' },
        { id: 'mem-17', label: 'Skills and Competencies' },
        { id: 'psy-23', label: 'Telepsychiatry & Digital Mental Health' }
      ]
    },
    {
      id: 'research-leadership',
      label: 'Research & Leadership',
      description: 'Research methods, reporting, administration, policy, and advocacy.',
      tutorials: [
        { id: 'psy-20', label: 'Psychiatric Genetics & Epigenetics' },
        { id: 'psy-21', label: 'Brain Imaging Techniques' },
        { id: 'psy-22', label: 'Current Issues & Future Directions' },
        { id: 'psy-24', label: 'Global Mental Health Challenges' },
        { id: 'psy-25', label: 'Integrative & Holistic Psychiatry' },
        { id: 'psy-26', label: 'Advocacy & Policy Development' }
      ]
    },
    {
      id: 'community-rehab',
      label: 'Community & Rehabilitation Psychiatry',
      description: 'Recovery, outreach, peer support, disability, and service development.',
      tutorials: [
        { id: 'psy-27', label: 'Community & Rehabilitation Psychiatry' },
        { id: 'psy-08', label: 'Mental Health & Disability' },
        { id: 'psy-12', label: 'Pain Management & Psychiatric Comorbidities' },
        { id: 'psy-13', label: 'Palliative Care & Psychological Support' }
      ]
    }
  ];

  const _tutorialIndex = groups.flatMap(group =>
    group.tutorials.map(t => ({ ...t, groupId: group.id, groupLabel: group.label }))
  );

  function getGroups() {
    return groups;
  }

  function getTutorials() {
    return _tutorialIndex;
  }

  function getGroup(id) {
    return groups.find(group => group.id === id) || null;
  }

  function getTutorial(id) {
    return _tutorialIndex.find(item => item.id === id) || null;
  }

  function getGroupLabel(id) {
    const group = getGroup(id);
    return group ? group.label : id;
  }

  function getTutorialLabel(id) {
    const item = getTutorial(id);
    return item ? item.label : id;
  }

  function getTutorialsForGroup(groupId) {
    const group = getGroup(groupId);
    return group ? group.tutorials : [];
  }

  function labelsFromIds(ids, kind = 'tutorial') {
    if (!Array.isArray(ids)) return [];
    if (kind === 'group') return ids.map(getGroupLabel);
    return ids.map(getTutorialLabel);
  }

  function renderSelectionGroups(prefix, selectedGroups = [], selectedTutorials = []) {
    return groups.map(group => {
      const groupChecked = selectedGroups.includes(group.id);
      return `
        <div class="selection-group" data-group-id="${group.id}">
          <label class="selection-group__header">
            <input type="checkbox" class="selection-group__master ${prefix}-group-master" id="${prefix}-group-${group.id}" data-group-id="${group.id}" ${groupChecked ? 'checked' : ''}>
            <span>
              <strong>${group.label}</strong>
              <small>${group.description}</small>
            </span>
          </label>
          <div class="selection-group__items">
            ${group.tutorials.map(tutorial => `
              <label class="selection-chip">
                <input type="checkbox" class="selection-chip__input ${prefix}-tutorial" data-group-id="${group.id}" data-tutorial-id="${tutorial.id}" id="${prefix}-tutorial-${tutorial.id}" ${selectedTutorials.includes(tutorial.id) ? 'checked' : ''}>
                <span>${tutorial.label}</span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function allSelectionIds() {
    return {
      groups: groups.map(group => group.id),
      tutorials: _tutorialIndex.map(item => item.id)
    };
  }

  return {
    getGroups,
    getTutorials,
    getGroup,
    getTutorial,
    getGroupLabel,
    getTutorialLabel,
    getTutorialsForGroup,
    labelsFromIds,
    renderSelectionGroups,
    allSelectionIds
  };
})();
