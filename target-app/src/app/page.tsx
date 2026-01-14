export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Build the Future with <span className="gradient-text">Acme</span>
          </h1>
          <p className="hero-subtitle">
            Enterprise-grade solutions that scale with your ambitions. Trusted by
            10,000+ companies worldwide.
          </p>
          <div className="hero-buttons">
            <button id="cta-primary" className="btn btn-primary">
              Start Free Trial
            </button>
            <button id="cta-secondary" className="btn btn-secondary">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">📊 Analytics</div>
          <div className="floating-card card-2">🚀 Deploy</div>
          <div className="floating-card card-3">🔒 Secure</div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2 className="section-title">Why Teams Choose Acme</h2>
        <div className="features-grid">
          <article className="feature-card" data-feature="speed">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>
              Deploy in seconds, not hours. Our infrastructure is optimized for
              speed at every layer.
            </p>
          </article>
          <article className="feature-card" data-feature="security">
            <div className="feature-icon">🛡️</div>
            <h3>Enterprise Security</h3>
            <p>
              SOC2, HIPAA, and GDPR compliant. Your data is protected by
              military-grade encryption.
            </p>
          </article>
          <article className="feature-card" data-feature="scale">
            <div className="feature-icon">📈</div>
            <h3>Infinite Scale</h3>
            <p>
              From prototype to planet-scale. We grow with you, handling billions
              of requests effortlessly.
            </p>
          </article>
          <article className="feature-card" data-feature="support">
            <div className="feature-icon">💬</div>
            <h3>24/7 Support</h3>
            <p>
              Real humans, real solutions. Get help from experts who understand
              your challenges.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
