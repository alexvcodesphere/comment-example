/* eslint-disable @next/next/no-img-element */
export default function TestimonialsPage() {
  return (
    <section id="testimonials" className="testimonials-section">
      <h2 className="section-title">Loved by Teams Everywhere</h2>
      <div className="testimonials-grid">
        <blockquote className="testimonial-card">
          <p>
            &quot;Acme transformed how we build software. Deployment time went from
            hours to minutes.&quot;
          </p>
          <footer>
            <img
              src="https://i.pravatar.cc/48?img=1"
              alt="Sarah Chen"
              className="avatar"
            />
            <cite><strong>Sarah Chen</strong><br />CTO, TechStart</cite>
          </footer>
        </blockquote>
        <blockquote className="testimonial-card">
          <p>
            &quot;The security features gave us peace of mind. Our compliance audit
            was a breeze.&quot;
          </p>
          <footer>
            <img
              src="https://i.pravatar.cc/48?img=2"
              alt="Marcus Johnson"
              className="avatar"
            />
            <cite><strong>Marcus Johnson</strong><br />VP Engineering, FinSecure</cite>
          </footer>
        </blockquote>
        <blockquote className="testimonial-card">
          <p>
            &quot;Support team is incredible. They helped us scale to handle 10x
            traffic overnight.&quot;
          </p>
          <footer>
            <img
              src="https://i.pravatar.cc/48?img=3"
              alt="Emily Rodriguez"
              className="avatar"
            />
            <cite><strong>Emily Rodriguez</strong><br />Lead DevOps, ScaleUp</cite>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
