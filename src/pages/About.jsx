import { useState, useEffect } from 'react'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container">
          <h1 className="reveal active">OUR STORY</h1>
          <p className="reveal active" style={{ transitionDelay: '0.2s' }}>
            Born from a passion for travel and high-performance engineering, PRIORITY Bags has been creating luggage that defines excellence since 2005. 
            We believe that your journey deserves nothing less than perfection.
          </p>
        </div>
      </section>

      <section className="about-sections container">
        <div className="policy-grid">
           <div className="policy-card reveal active">
              <h3>Our Quality</h3>
              <p>Every bag undergoes 50+ durability tests, from 5-ton crush tests to 10km wheel endurance runs.</p>
           </div>
           <div className="policy-card reveal active" style={{ transitionDelay: '0.1s' }}>
              <h3>Sustainability</h3>
              <p>We use 100% recycled lining textures and modular designs that facilitate easier repairs, reducing landfill waste.</p>
           </div>
           <div className="policy-card reveal active" style={{ transitionDelay: '0.2s' }}>
              <h3>Global Warranty</h3>
              <p>Our 5-year international warranty covers you across 120 countries. Travel with absolute peace of mind.</p>
           </div>
        </div>
      </section>

      <section className="content-section container reveal active">
         <h2>Support & Policies</h2>
         <div className="support-list">
            <div className="support-item">
               <h4>Shipping</h4>
               <p>Free standard shipping across India on all orders above ₹499. Express delivery available in metro cities.</p>
            </div>
            <div className="support-item">
               <h4>Returns</h4>
               <p>Easy 10-day replacement policy for any manufacturing defects. No questions asked.</p>
            </div>
         </div>
      </section>
    </div>
  )
}
