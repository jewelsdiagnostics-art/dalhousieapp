/* ============================================
   registration.js — Self-service faculty sign-up
   ============================================ */

const RegistrationPortal = (() => {
  const state = {
    bound: false
  };

  function _overlay() {
    return document.getElementById('signup-modal-overlay');
  }

  function _render() {
    const overlay = _overlay();
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="signup-modal" role="dialog" aria-modal="true" aria-labelledby="signup-title">
        <button class="signup-modal__close" type="button" id="signup-close">&times;</button>
        <div class="signup-modal__shell">
          <section class="signup-modal__panel signup-modal__panel--info">
            <span class="signup-modal__eyebrow">New Faculty Account</span>
            <h2 class="signup-modal__title" id="signup-title">Create your teaching profile.</h2>
            <p class="signup-modal__lead">
              Enter your details and create a secure password to access the curriculum portal.
            </p>
            <div class="signup-modal__checklist">
              <div class="signup-modal__check">
                <strong>Step 1</strong>
                <span>Share your contact and institution details.</span>
              </div>
              <div class="signup-modal__check">
                <strong>Step 2</strong>
                <span>Create a strong password for secure access.</span>
              </div>
            </div>
          </section>

          <section class="signup-modal__panel signup-modal__panel--form">
            <form class="signup-modal__body" id="signup-form">
              <div class="signup-modal__stepper">
                <div class="signup-modal__step signup-modal__step--active" data-step="1">1. Details</div>
                <div class="signup-modal__step" data-step="2">2. Password</div>
              </div>

              <div class="login-modal__error" id="signup-error" aria-live="polite" style="display:none;"></div>

              <div class="signup-modal__content signup-modal__content--active" data-step-panel="1">
                <div class="signup-modal__grid">
                  <div class="form-group">
                    <label class="form-label" for="signup-name">Full Name</label>
                    <input type="text" class="input" id="signup-name" placeholder="Dr. Jane Doe" autocomplete="name">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="signup-email">Email Address</label>
                    <input type="email" class="input" id="signup-email" placeholder="jane.doe@example.com" autocomplete="email">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="signup-institution">Institution Name</label>
                    <input type="text" class="input" id="signup-institution" placeholder="University / Hospital / Training Centre">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="signup-contact">Contact Number</label>
                    <input type="text" class="input" id="signup-contact" placeholder="+233-24-000-0000" autocomplete="tel">
                  </div>
                </div>
                <div class="signup-modal__actions">
                  <div></div>
                  <button type="button" class="btn btn--primary signup-modal__btn" id="signup-next-1">Continue</button>
                </div>
              </div>

              <div class="signup-modal__content" data-step-panel="2">
                <div class="signup-modal__grid">
                  <div class="form-group">
                    <div class="login-modal__field-head">
                      <label class="form-label" for="signup-password">Create Password</label>
                      <button type="button" class="login-modal__toggle" id="signup-toggle-password" aria-pressed="false">Show</button>
                    </div>
                    <input type="password" class="input" id="signup-password" placeholder="Create a strong password" autocomplete="new-password">
                    <div class="password-meter">
                      <div class="password-meter__bar"><div class="password-meter__fill" id="signup-password-fill"></div></div>
                      <div class="password-meter__text" id="signup-password-text">Use 8+ characters with upper, lower, number, and symbol.</div>
                    </div>
                  </div>
                  <div class="form-group">
                    <div class="login-modal__field-head">
                      <label class="form-label" for="signup-confirm">Confirm Password</label>
                      <button type="button" class="login-modal__toggle" id="signup-toggle-confirm" aria-pressed="false">Show</button>
                    </div>
                    <input type="password" class="input" id="signup-confirm" placeholder="Confirm password" autocomplete="new-password">
                    <div class="form-hint">Passwords must match before you continue.</div>
                  </div>
                </div>
                <div class="signup-modal__actions">
                  <button type="button" class="btn btn--outline signup-modal__btn" id="signup-back-2">Back</button>
                  <button type="submit" class="btn btn--primary signup-modal__btn" id="signup-submit">Create Account</button>
                </div>
              </div>

              <div class="signup-modal__success" id="signup-success">
                <h3>Account created</h3>
                <p>Your account has been created and the full curriculum is now available from your dashboard.</p>
                <p style="margin-top:0.75rem;font-size:0.8rem;color:var(--text-muted);">Redirecting to your dashboard now...</p>
              </div>
            </form>
          </section>
        </div>
      </div>
    `;
  }

  function _bind() {
    if (state.bound) return;
    state.bound = true;

    document.addEventListener('click', e => {
      const overlay = _overlay();
      if (overlay && e.target === overlay) close();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });

    document.body.addEventListener('input', e => {
      if (e.target && e.target.id === 'signup-password') {
        _updatePasswordMeter();
      }
      if (e.target && ['signup-name', 'signup-email', 'signup-institution', 'signup-contact'].includes(e.target.id)) {
        _updateSummary();
      }
    });

    document.body.addEventListener('click', async e => {
      if (e.target && e.target.id === 'signup-close') {
        close();
      }
      if (e.target && e.target.id === 'signup-next-1') {
        _updateSummary();
        setStep(2);
      }
      if (e.target && e.target.id === 'signup-back-2') {
        setStep(1);
      }
      if (e.target && e.target.id === 'signup-toggle-password') {
        _togglePasswordField('signup-password', e.target);
      }
      if (e.target && e.target.id === 'signup-toggle-confirm') {
        _togglePasswordField('signup-confirm', e.target);
      }
    });

    document.body.addEventListener('submit', async e => {
      if (e.target && e.target.id === 'signup-form') {
        e.preventDefault();
        await _submit();
      }
    });
  }

  function open() {
    const overlay = _overlay();
    if (!overlay) return;
    if (typeof window.closeLoginModal === 'function') {
      window.closeLoginModal();
    }
    _render();
    overlay.classList.add('signup-modal-overlay--open');
    setStep(1);
    _updatePasswordMeter();
    _updateSummary();
    window.requestAnimationFrame(() => document.getElementById('signup-name')?.focus());
  }

  function close() {
    const overlay = _overlay();
    if (!overlay) return;
    overlay.classList.remove('signup-modal-overlay--open');
    if (typeof window.openLoginModal === 'function') {
      window.openLoginModal();
    }
  }

  function setStep(step) {
    document.querySelectorAll('.signup-modal__content').forEach(panel => {
      panel.classList.toggle('signup-modal__content--active', panel.dataset.stepPanel === String(step));
    });
    document.querySelectorAll('.signup-modal__step').forEach(item => {
      const itemStep = Number(item.dataset.step);
      item.classList.toggle('signup-modal__step--active', itemStep === step);
      item.classList.toggle('signup-modal__step--done', itemStep < step);
    });
  }

  function _validateStep1() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const institution = document.getElementById('signup-institution').value.trim();
    const contact = document.getElementById('signup-contact').value.trim();
    const error = document.getElementById('signup-error');

    if (!name || !email || !institution || !contact) {
      _showError('Please complete all personal details');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      _showError('Please enter a valid email address');
      return false;
    }
    error.style.display = 'none';
    _updateSummary();
    return true;
  }

  function _validateStep2() {
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const error = document.getElementById('signup-error');
    const strength = Auth.getPasswordStrength(password);

    if (!password || !confirm) {
      _showError('Please create and confirm your password');
      return false;
    }
    if (password !== confirm) {
      _showError('Passwords do not match');
      return false;
    }
    if (!strength.ok) {
      _showError(strength.message);
      return false;
    }

    error.style.display = 'none';
    return true;
  }

  function _updateSummary() {
    const profileEl = document.getElementById('signup-summary-profile');
    if (!profileEl) return;

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const institution = document.getElementById('signup-institution').value.trim();
    const contact = document.getElementById('signup-contact').value.trim();
    profileEl.textContent = [name, email, institution, contact].filter(Boolean).join(' — ') || 'No details entered yet.';
  }

  function _updatePasswordMeter() {
    const password = document.getElementById('signup-password').value;
    const fill = document.getElementById('signup-password-fill');
    const text = document.getElementById('signup-password-text');
    if (!fill || !text) return;

    const strength = Auth.getPasswordStrength(password);
    const score = (() => {
      let points = 0;
      if (password.length >= 8) points += 25;
      if (/[a-z]/.test(password)) points += 20;
      if (/[A-Z]/.test(password)) points += 20;
      if (/\d/.test(password)) points += 20;
      if (/[^\w\s]/.test(password)) points += 15;
      return Math.min(points, 100);
    })();

    fill.style.width = `${score}%`;
    if (score < 40) {
      fill.style.background = 'var(--error)';
      text.textContent = strength.message || 'Password is weak.';
    } else if (score < 75) {
      fill.style.background = 'var(--warning)';
      text.textContent = 'Password strength is moderate.';
    } else {
      fill.style.background = 'var(--success)';
      text.textContent = 'Password strength looks strong.';
    }
  }

  function _showError(message) {
    const error = document.getElementById('signup-error');
    if (!error) return;
    error.textContent = message;
    error.style.display = '';
  }

  function _togglePasswordField(fieldId, button) {
    const input = document.getElementById(fieldId);
    if (!input || !button) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.textContent = isPassword ? 'Hide' : 'Show';
    button.setAttribute('aria-pressed', String(isPassword));
  }

  async function _submit() {
    const error = document.getElementById('signup-error');
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const institution = document.getElementById('signup-institution').value.trim();
    const contactNumber = document.getElementById('signup-contact').value.trim();
    const password = document.getElementById('signup-password').value;

    const submitBtn = document.getElementById('signup-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating...';
    }

    const result = await Auth.registerAccount({
      fullName: name,
      email,
      institution,
      contactNumber,
      password
    });

    if (!result.success) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
      _showError(result.error);
      return;
    }

    const success = document.getElementById('signup-success');
    if (success) success.classList.add('signup-modal__success--visible');
    if (success && result.user) {
      const details = [
        result.user.username ? `<div><strong>Username:</strong> ${result.user.username}</div>` : '',
        result.user.email ? `<div><strong>Email:</strong> ${result.user.email}</div>` : ''
      ].filter(Boolean).join('');
      const tempPassword = result.generatedPassword && result.tempPassword
        ? `<p style="margin-top:0.75rem;padding:0.8rem 1rem;border-radius:12px;background:var(--primary-bg);border:1px solid var(--primary);color:var(--text-primary);">
            A temporary password was generated because the form was submitted without one:
            <strong style="display:block;margin-top:0.35rem;">${result.tempPassword}</strong>
          </p>`
        : '';
      success.insertAdjacentHTML('beforeend', `
        <div style="margin-top:0.9rem;padding:0.8rem 1rem;border-radius:12px;background:var(--surface);border:1px solid var(--border-light);text-align:left;">
          <div style="font-weight:700;margin-bottom:0.35rem;">Login details</div>
          <div style="display:grid;gap:0.25rem;color:var(--text-secondary);font-size:0.9rem;">${details}</div>
        </div>
        ${tempPassword}
      `);
    }
    const body = document.querySelector('.signup-modal__body');
    if (body) {
      [...body.children].forEach(child => {
        if (child.id !== 'signup-success') child.style.display = 'none';
      });
    }
    if (error) error.style.display = 'none';
    window.setTimeout(() => {
      const overlay = _overlay();
      if (overlay) overlay.classList.remove('signup-modal-overlay--open');

      if (typeof window.showAuthenticatedApp === 'function') {
        window.showAuthenticatedApp();
      } else {
        window.location.reload();
      }
    }, 700);
  }

  _bind();

  return { open, close, setStep };
})();

window.openSignupModal = () => RegistrationPortal.open();
window.closeSignupModal = () => RegistrationPortal.close();
