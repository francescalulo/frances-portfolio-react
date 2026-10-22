import { useId } from "react";
import useAccordionItem from "../../hooks/useAccordionItem";
import "./FaqList.scss";

// One question: the question is a button that opens and closes its answer
function FaqItem({ number, question, answer, isOpenAtStart }) {
  const { isOpen, itemRef, toggle } = useAccordionItem(isOpenAtStart);
  const panelId = useId();

  return (
    <div
      ref={itemRef}
      className={"faq-list__item" + (isOpen ? " is-open" : "")}
    >
      <h3 className="faq-list__heading">
        <button
          type="button"
          className="faq-list__toggle"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
        >
          <span className="faq-list__question">{question}</span>
          <span className="faq-list__number" aria-hidden="true">
            {"Q" + number}
          </span>
          <svg
            className="faq-list__chevron"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </h3>

      <div id={panelId} className="faq-list__panel" hidden={!isOpen}>
        <p className="faq-list__answer">{answer}</p>
      </div>
    </div>
  );
}

// About "FAQs About Me" from the ACF faqs repeater. Each opens on its own; the first
// starts open. Answers are plain text (line breaks typed in WordPress are kept).
function FaqList({ faqs }) {
  const items = (faqs || []).filter((faq) => faq.question && faq.answer);
  if (items.length === 0) return null;

  return (
    <section className="faq-list" aria-labelledby="faq-heading">
      <div className="faq-list__inner content-width">
        <h2 id="faq-heading" className="faq-list__label">
          FAQs About Me
        </h2>
        <div className="faq-list__items">
          {items.map((faq, index) => (
            <FaqItem
              key={faq.question}
              number={index + 1}
              question={faq.question.trim()}
              answer={faq.answer.trim()}
              isOpenAtStart={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FaqList;
