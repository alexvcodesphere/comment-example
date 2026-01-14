"use client";

import { useState } from "react";
import { Modal, Dropdown, Toast, Tooltip, Accordion, Tabs } from "@/components/InteractiveComponents";

export default function DemoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("option1");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  const showToast = (type: "success" | "error" | "info") => {
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <section id="demo" className="demo-section">
      <h2 className="section-title">Interactive Components Demo</h2>
      <p style={{ textAlign: "center", color: "var(--gray)", marginBottom: "2rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
        Test how the commenting overlay works with dynamic elements like modals, dropdowns, tooltips, and more.
      </p>

      <div className="demo-grid">
        {/* Modal Demo */}
        <div className="demo-card" id="modal-demo-card">
          <h3>Modal / Popup</h3>
          <p>Click the button to open a modal dialog. Try adding a comment to elements inside the modal.</p>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            Open Modal
          </button>
        </div>

        {/* Dropdown Demo */}
        <div className="demo-card" id="dropdown-demo-card">
          <h3>Dropdown Menu</h3>
          <p>Interactive dropdown with selectable options. Comments can be anchored to the dropdown items.</p>
          <Dropdown
            label="Select an option"
            options={[
              { value: "option1", label: "🚀 Startup Plan" },
              { value: "option2", label: "💼 Business Plan" },
              { value: "option3", label: "🏢 Enterprise Plan" },
            ]}
            value={dropdownValue}
            onChange={setDropdownValue}
          />
        </div>

        {/* Toast Demo */}
        <div className="demo-card" id="toast-demo-card">
          <h3>Toast Notifications</h3>
          <p>Trigger toast messages that appear in the corner. Test commenting on transient elements.</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={() => showToast("success")}>
              Success
            </button>
            <button className="btn btn-secondary" onClick={() => showToast("error")}>
              Error
            </button>
            <button className="btn btn-outline" onClick={() => showToast("info")}>
              Info
            </button>
          </div>
        </div>

        {/* Tooltip Demo */}
        <div className="demo-card" id="tooltip-demo-card">
          <h3>Tooltips</h3>
          <p>Hover over elements to reveal tooltips. These are great for testing comment anchoring on hover states.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
            <Tooltip content="This is a helpful tip!">
              <button className="btn btn-primary">Hover Me</button>
            </Tooltip>
            <Tooltip content="Another useful tooltip">
              <button className="btn btn-secondary">Or Me</button>
            </Tooltip>
          </div>
        </div>

        {/* Accordion Demo */}
        <div className="demo-card" id="accordion-demo-card">
          <h3>Accordion</h3>
          <p>Expandable sections that reveal content. Test how comments behave when content expands/collapses.</p>
          <Accordion
            items={[
              { title: "What is Acme?", content: "Acme is an enterprise-grade platform that helps teams build, deploy, and scale applications with confidence." },
              { title: "How does pricing work?", content: "We offer flexible pricing tiers from $29/mo for startups to custom enterprise plans. All plans include core features." },
              { title: "Do you offer support?", content: "Yes! We have 24/7 support available via chat, email, and phone. Enterprise customers get dedicated support teams." },
            ]}
          />
        </div>

        {/* Tabs Demo */}
        <div className="demo-card" id="tabs-demo-card">
          <h3>Tabs</h3>
          <p>Tab panels that switch content. Great for testing comments on tab headers and content panels.</p>
          <Tabs
            tabs={[
              { id: "features", label: "Features", content: "Our platform includes real-time analytics, automated deployments, and enterprise-grade security out of the box." },
              { id: "integrations", label: "Integrations", content: "Connect with GitHub, GitLab, Slack, Jira, and 50+ other tools your team already uses." },
              { id: "api", label: "API", content: "Full REST API access with comprehensive documentation, SDKs for popular languages, and webhook support." },
            ]}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Request a Demo">
        <div className="form-group">
          <label htmlFor="name">Your Name</label>
          <input type="text" id="name" placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" placeholder="john@company.com" />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input type="text" id="company" placeholder="Acme Inc." />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message (Optional)</label>
          <textarea id="message" placeholder="Tell us about your needs..." />
        </div>
        <button 
          className="btn btn-primary" 
          style={{ width: "100%" }}
          onClick={() => {
            setModalOpen(false);
            showToast("success");
          }}
        >
          Submit Request
        </button>
      </Modal>

      {/* Toast */}
      <Toast
        message={
          toastType === "success" ? "Request submitted successfully!" :
          toastType === "error" ? "Something went wrong!" :
          "Here's some information for you."
        }
        type={toastType}
        isVisible={toastVisible}
      />
    </section>
  );
}
