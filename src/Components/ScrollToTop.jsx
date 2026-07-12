export default function ScrollToTop({ scrollRef }) {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Try to scroll the specific container if it exists
    if (scrollRef && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    // 2. Fallback to window scroll
    window.scrollTo(0, 0);
  }, [pathname, scrollRef]);

  return null;
}