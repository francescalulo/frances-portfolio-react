import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Starts every new page at the top (React Router keeps the old scroll position).
// It draws nothing, so it returns null.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
