import { useEffect, useRef, useState } from "react";
import { revealInView } from "../utilities/Utilities";

// One accordion row (Work Info, FAQs): whether it's open, and when a click opens it,
// the page scrolls just enough to show the whole row. Put itemRef on the row.
function useAccordionItem(isOpenAtStart = false) {
  const [isOpen, setIsOpen] = useState(isOpenAtStart);
  const itemRef = useRef(null);
  const openedByClick = useRef(false);

  useEffect(() => {
    if (!isOpen || !openedByClick.current) return;
    openedByClick.current = false;
    revealInView(itemRef.current);
  }, [isOpen]);

  function toggle() {
    openedByClick.current = !isOpen;
    setIsOpen(!isOpen);
  }

  return { isOpen, itemRef, toggle };
}

export default useAccordionItem;
