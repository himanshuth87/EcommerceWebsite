import { Link } from 'react-router-dom'
import './About.css'

const VALUES = [
  { icon: '🏗️', title: 'Built to Last', desc: 'Every hinge, wheel, and zipper is stress-tested for 10,000+ cycles.' },
  { icon: '🌍', title: 'Global Standards', desc: 'TSA, IATA, and airline-compliant across 150+ countries.' },
  { icon: '♻️', title: 'Sustainable Craft', desc: 'Recycled polycarbonate shells, FSC-certified packaging.' },
  { icon: '🤝', title: 'Lifetime Promise', desc: 'A lifetime warranty on every product we make.' },
]

const TEAM = [
  { name: '', role: 'Founder & CEO', initial: 'A' },
  { name: '', role: 'Head of Design', initial: 'P' },
  { name: '', role: 'Chief Product Officer', initial: 'V' },
]

export default function About() {
  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="container about-hero-content">
          <span className="section-label">Our Story</span>
          <h1 className="section-title about-title">
            Crafting Luggage for<br /><span>The Modern Nomad</span>
          </h1>
          <p className="about-hero-sub">
            Founded in Mumbai, Priority Bags was born from a simple frustration —
            great luggage shouldn't cost a fortune, but it should feel like it does.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission section-pad">
        <div className="container about-mission-inner">
          <div className="about-mission-text">
            <span className="section-label">Our Mission</span>
            <h2 className="section-title">Travel is an <span>Art Form</span></h2>
            <p>
              We believe your luggage should match your ambition. Since 2020, Priority Bags
              has been designing hardshell luggage that combines aerospace-grade materials
              with refined aesthetics — engineered for both the boardroom-bound executive
              and the weekend adventurer.
            </p>
            <p>
              Every product is designed in Mumbai, tested in our labs, and shipped directly
              to your door with a lifetime warranty. No middlemen. No compromises.
            </p>
            <Link to="/products" className="btn btn-gold btn-lg" style={{ marginTop: 12 }}>
              Shop the Collection →
            </Link>
          </div>
          <div className="about-mission-visual">
            <img src="/assets/Creatives/1920%20%C3%97%201080%20px%20(3).jpg" alt="Priority Bags Mission"
              onError={e => e.target.style.opacity = '0.3'} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title">Our Core <span>Values</span></h2>
          </div>
          <div className="values-grid">
            {VALUES.map(v => (
              <div key={v.title} className="value-card card">
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="section-label">The People Behind It</span>
            <h2 className="section-title">Meet Our <span>Team</span></h2>
          </div>
          <div className="team-grid">
            {TEAM.map(m => (
              <div key={m.name} className="team-card card">
                <div className="team-avatar">{m.initial}</div>
                <h3>{m.name}</h3>
                <p>{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta section-pad" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="about-cta-inner card">
            <span className="section-label">Ready to Travel Better?</span>
            <h2 className="section-title">Start Your <span>Journey</span></h2>
            <p>Explore our full collection of premium luggage, backpacks, and accessories.</p>
            <div className="about-cta-btns">
              <Link to="/products" className="btn btn-gold btn-lg">Shop All Products →</Link>
              <Link to="/premium" className="btn btn-outline btn-lg">View Premium ✦</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
