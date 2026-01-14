"use client";

import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

interface DropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function Dropdown({ label, options, value, onChange }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <button 
        className="dropdown-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find(o => o.value === value)?.label || "Select..."}
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li 
              key={option.value}
              className={`dropdown-item ${value === option.value ? "selected" : ""}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
}

export function Toast({ message, type, isVisible }: ToastProps) {
  if (!isVisible) return null;

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "ℹ"}
      </span>
      {message}
    </div>
  );
}

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="tooltip-content">
          {content}
          <div className="tooltip-arrow" />
        </div>
      )}
    </div>
  );
}

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={index} className="accordion-item">
          <button
            className={`accordion-header ${openIndex === index ? "open" : ""}`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {item.title}
            <span className="accordion-icon">{openIndex === index ? "−" : "+"}</span>
          </button>
          {openIndex === index && (
            <div className="accordion-content">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

interface TabsProps {
  tabs: { id: string; label: string; content: React.ReactNode }[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
