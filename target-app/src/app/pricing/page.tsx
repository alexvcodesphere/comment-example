export default function PricingPage() {
  return (
    <section id="pricing" className="pricing-section">
      <h2 className="section-title">Simple, Transparent Pricing</h2>
      <div className="pricing-grid">
        <div className="pricing-card" data-tier="starter">
          <h3>Starter</h3>
          <div className="price">$29<span>/mo</span></div>
          <ul className="pricing-features">
            <li>5 Team Members</li>
            <li>10GB Storage</li>
            <li>Basic Analytics</li>
            <li>Email Support</li>
          </ul>
          <button className="btn btn-outline">Choose Starter</button>
        </div>
        <div className="pricing-card popular" data-tier="professional">
          <div className="popular-badge">Most Popular</div>
          <h3>Professional</h3>
          <div className="price">$99<span>/mo</span></div>
          <ul className="pricing-features">
            <li>Unlimited Team Members</li>
            <li>100GB Storage</li>
            <li>Advanced Analytics</li>
            <li>Priority Support</li>
            <li>API Access</li>
          </ul>
          <button className="btn btn-primary">Choose Professional</button>
        </div>
        <div className="pricing-card" data-tier="enterprise">
          <h3>Enterprise</h3>
          <div className="price">Custom</div>
          <ul className="pricing-features">
            <li>Everything in Pro</li>
            <li>Unlimited Storage</li>
            <li>Custom Integrations</li>
            <li>Dedicated Support</li>
            <li>SLA Guarantee</li>
          </ul>
          <button className="btn btn-outline">Contact Sales</button>
        </div>
      </div>
    </section>
  );
}
