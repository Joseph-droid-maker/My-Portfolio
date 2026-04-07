import { useState } from 'react';
import './css/Contact.css';

const CONTACT_ITEMS = [
  { icon: '✉️', label: 'Email',    val: 'josephmorada08@email.com',     href: 'mailto:josephmorada08@email.com' },
  { icon: '🔗', label: 'LinkedIn', val: 'mark Joseph Morada',           href: 'https://www.linkedin.com/in/markjoseph-morada-7934ab360' },
  { icon: '⌥',  label: 'GitHub',   val: 'Joseph-droid-maker',           href: 'https://github.com/Joseph-droid-maker' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="contact-layout">

          {/* Left: Info */}
          <div className="contact-info">
            <div className="section-label">Get In Touch</div>
            <h1 className="contact-title">Let's work<br />together.</h1>
            <p className="contact-sub">
              I'm actively looking for internship opportunities in software development,
              data engineering, or related fields. Feel free to reach out.
            </p>
            

            <div className="contact-items">
              {CONTACT_ITEMS.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="contact-item">
                  <div className="contact-item-icon">{c.icon}</div>
                  <div>
                    <div className="contact-item-label">{c.label}</div>
                    <div className="contact-item-val">{c.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-card">
            <h2 className="form-title">Send a Message</h2>

            {sent ? (
              <div className="form-success">
                <div className="form-success-icon">✅</div>
                <div className="form-success-msg">Message sent!</div>
                <p>Thanks for reaching out — I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    type="text"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    type="email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-textarea"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about the opportunity, project, or just say hi..."
                  />
                </div>

                <button className="form-submit" onClick={handleSubmit}>
                  Send Message →
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}