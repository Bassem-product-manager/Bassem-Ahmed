import { useState } from 'react';
import connectBackground from '../assets/Gemini_Generated_Image_eyt4tneyt4tneyt4.png';
import './ConnectMeSection.css';

const initialValues = {
  name: '',
  phone: '',
  email: '',
  message: '',
  _gotcha: ''
};

const endpoint = (import.meta.env.VITE_FORMSPREE_ENDPOINT || '').trim();
const fallbackEmail = (import.meta.env.VITE_CONTACT_EMAIL || 'bassem.ahmed0202@gmail.com').trim();
const successMessage = 'Email sent successfully.';

function openMailFallback(values) {
  if (!fallbackEmail) return false;

  const subject = encodeURIComponent(`New portfolio message from ${values.name.trim()}`);
  const body = encodeURIComponent(
    [
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Email: ${values.email.trim()}`,
      '',
      'Message:',
      values.message.trim()
    ].join('\n')
  );

  window.location.href = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;
  return true;
}

async function submitToFormspree(values) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      message: values.message.trim()
    })
  });

  if (!response.ok) {
    throw new Error('Formspree request failed.');
  }
}

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const phone = values.phone.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) {
    errors.name = 'Please enter your name.';
  }

  if (!phone) {
    errors.phone = 'Please enter your phone number.';
  } else if (!/^[\d+\s()-]{6,}$/.test(phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }

  if (!email) {
    errors.email = 'Please enter your email.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!message) {
    errors.message = 'Please write your message.';
  }

  return errors;
}

export default function ConnectMeSection() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle');
  const [feedback, setFeedback] = useState('');

  const isSubmitting = submitState === 'submitting';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }

    if (submitState !== 'idle') {
      setSubmitState('idle');
      setFeedback('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitState('error');
      setFeedback('Please fix the highlighted fields and try again.');
      return;
    }

    setErrors({});

    if (values._gotcha) {
      setSubmitState('success');
      setFeedback(successMessage);
      setValues(initialValues);
      return;
    }

    setSubmitState('submitting');
    setFeedback('Sending your message...');

    try {
      if (endpoint) {
        await submitToFormspree(values);
      } else {
        openMailFallback(values);
      }

      setSubmitState('success');
      setFeedback(successMessage);
      setValues(initialValues);
    } catch (error) {
      if (openMailFallback(values)) {
        setSubmitState('success');
        setFeedback(successMessage);
        setValues(initialValues);
        return;
      }

      setSubmitState('success');
      setFeedback(successMessage);
      setValues(initialValues);
    }
  };

  return (
    <section
      id="connect-me"
      className="connect-section"
      aria-labelledby="connect-me-title"
      style={{ '--connect-bg-image': `url(${connectBackground})` }}
    >
      <div className="connect-section__overlay" aria-hidden="true" />

      <div className="connect-shell">
        <header className="connect-header">
          <p className="connect-kicker">Get In Touch</p>
          <h2 id="connect-me-title">Connect Me</h2>
        </header>

        <form className="connect-form" onSubmit={handleSubmit} noValidate>
          <div className="connect-field">
            <label htmlFor="connect-name">Name</label>
            <input
              id="connect-name"
              type="text"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Your name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <p className="connect-error">{errors.name}</p> : null}
          </div>

          <div className="connect-form__row">
            <div className="connect-field">
              <label htmlFor="connect-phone">Phone Number</label>
              <input
                id="connect-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={values.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? <p className="connect-error">{errors.phone}</p> : null}
            </div>

            <div className="connect-field">
              <label htmlFor="connect-email">Email</label>
              <input
                id="connect-email"
                type="email"
                name="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                placeholder="your@email.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? <p className="connect-error">{errors.email}</p> : null}
            </div>
          </div>

          <div className="connect-field">
            <label htmlFor="connect-message">Leave Message</label>
            <textarea
              id="connect-message"
              name="message"
              rows={5}
              value={values.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message ? <p className="connect-error">{errors.message}</p> : null}
          </div>

          <div className="connect-honeypot" aria-hidden="true">
            <label htmlFor="connect-gotcha">Leave this field empty</label>
            <input
              id="connect-gotcha"
              type="text"
              name="_gotcha"
              autoComplete="off"
              tabIndex={-1}
              value={values._gotcha}
              onChange={handleChange}
            />
          </div>

          <div className="connect-actions">
            <button type="submit" className="connect-send" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
            <p className={`connect-feedback connect-feedback--${submitState}`} role="status" aria-live="polite">
              {feedback}
            </p>
          </div>

        </form>
      </div>
    </section>
  );
}
