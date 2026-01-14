export default function AboutPage() {
  return (
    <section id="about" className="about-section">
      <div className="about-grid">
        <div className="about-content">
          <h2>About AcmeCorp</h2>
          <p>
            Founded in 2020, AcmeCorp has been at the forefront of enterprise
            software innovation. We believe that building great software
            shouldn&apos;t be complicated.
          </p>
          <p>
            Our platform powers over 10,000 companies worldwide, from startups
            to Fortune 500 enterprises. We&apos;re committed to providing the
            tools and infrastructure that teams need to build, deploy, and
            scale their applications with confidence.
          </p>
          <p>
            Based in San Francisco with offices in London, Tokyo, and Sydney,
            we&apos;re a diverse team of engineers, designers, and product
            experts passionate about making development accessible to everyone.
          </p>
        </div>
        <div className="about-stats">
          <div className="stat-card">
            <div className="stat-value">10K+</div>
            <div className="stat-label">Companies Served</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">99.9%</div>
            <div className="stat-label">Uptime SLA</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">50M+</div>
            <div className="stat-label">Deployments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">150+</div>
            <div className="stat-label">Team Members</div>
          </div>
        </div>
      </div>
    </section>
  );
}
