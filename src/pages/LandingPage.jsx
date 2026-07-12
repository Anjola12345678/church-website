import { useState, useEffect, useRef, useCallback } from "react";
import logos from './images/logos.png';
import { Link } from "react-router-dom";
import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import image3 from './images/image3.jpg';
import image4 from './images/image4.jpg';
import image5 from './images/image5.jpg';
import image6 from './images/image6.jpg';
import image7 from './images/image7.jpg';
import image8 from './images/image8.jpg';
import video1 from './video/video1.mp4';
import video2 from './video/video2.mp4';
import video3 from './video/video3.mp4';
import video4 from './video/video4.mp4';
import {
  BookOpen,
  Mic,
  HeartHandshake,
  Brain,
  Calendar,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ── RCCG Chapel of Praise SVG Logo ── */
function ChurchLogo({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer silver ring */}
      <circle cx="50" cy="54" r="42" fill="url(#silver)" stroke="#c0c8d0" strokeWidth="3"/>
      {/* Inner fill */}
      <circle cx="50" cy="54" r="37" fill="#1a3a5c"/>
      {/* Cross on top */}
      <rect x="47" y="4" width="6" height="18" rx="2" fill="url(#silverCross)"/>
      <rect x="40" y="9" width="20" height="5" rx="2" fill="url(#silverCross)"/>
      {/* RCCG circle emblem */}
      <circle cx="50" cy="32" r="13" fill="#fff" stroke="#b91c1c" strokeWidth="1.5"/>
      <circle cx="50" cy="32" r="10" fill="#1e40af"/>
      {/* Dove shape simplified */}
      <ellipse cx="50" cy="31" rx="5" ry="3.5" fill="#fff"/>
      <ellipse cx="53" cy="29" rx="3" ry="2" fill="#fff" transform="rotate(-20 53 29)"/>
      <ellipse cx="47" cy="29" rx="3" ry="2" fill="#fff" transform="rotate(20 47 29)"/>
      {/* Church name text */}
      <text x="50" y="52" textAnchor="middle" fill="#c8d8f0" fontSize="10" fontWeight="700" fontFamily="serif" fontStyle="italic">Chapel</text>
      <text x="50" y="62" textAnchor="middle" fill="#94a3b8" fontSize="7" fontWeight="400" fontFamily="serif" fontStyle="italic">of</text>
      <text x="50" y="74" textAnchor="middle" fill="#c8d8f0" fontSize="11" fontWeight="700" fontFamily="serif" fontStyle="italic">Praise</text>
      {/* Bottom text */}
      <text x="50" y="85" textAnchor="middle" fill="#7dd3a8" fontSize="4.2" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.5">A PARISH OF THE RCCG</text>
      {/* Defs */}
      <defs>
        <linearGradient id="silver" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8edf2"/>
          <stop offset="50%" stopColor="#b0bec5"/>
          <stop offset="100%" stopColor="#90a4ae"/>
        </linearGradient>
        <linearGradient id="silverCross" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#e8edf2"/>
          <stop offset="100%" stopColor="#b0bec5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Color tokens ── */
const C = {
  primary:    "#16a34a",   // green-600
  primaryDk:  "#15803d",   // green-700
  primaryLt:  "#dcfce7",   // green-100
  accent:     "#84cc16",   // lime-400  (lemon pop)
  accentDk:   "#65a30d",   // lime-600
  heroFrom:   "#14532d",   // green-900
  heroMid:    "#166534",   // green-800
  heroTo:     "#15803d",   // green-700
  text:       "#111827",
  textMuted:  "#6b7280",
  border:     "#e5e7eb",
  bg:         "#f9fafb",
};

const ABOUT_MEDIA = [
  { type: "image", src: image1, caption: "Tuesday Digging Deep" },
  { type: "video", src: video1, caption: "Ministration Highlight" },
  { type: "image", src: image2, caption: "Chapel of Praise" },
  { type: "image", src: image3, caption: "Sunday Sermon" },
  { type: "image", src: image4, caption: "Open Heavens" },
  { type: "video", src: video2, caption: "Ministration Highlight" },
  { type: "image", src: image5, caption: "Sunday School" },
  { type: "image", src: image6, caption: "Faithful Women" },
  { type: "video", src: video3, caption: "Choir ministration highlight" },
  { type: "image", src: image7, caption: "Evangelism" },
  { type: "image", src: image8, caption: "Sunday worship service" },
  { type: "video", src: video4, caption: "RCCG Auditorium" },
];


function MediaCard({ item, index, registerVideoRef }) {
  return (
    <div
      className="about-card"
      style={{
        position: "relative",
        flex: "0 0 auto",
        width: 260,
        height: 400,
        borderRadius: 18,
        overflow: "hidden",
        scrollSnapAlign: "center",
        background: "#111827",
        boxShadow: "0 8px 28px rgba(0,0,0,.18)",
      }}
    >
      {item.type === "video" ? (
        <video
          ref={(el) => registerVideoRef(index, el)}
          src={item.src}
          poster={item.poster}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <img
          src={item.src}
          alt={item.caption}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
        />
      )}

      {/* Caption overlay — pointer-events none so it never blocks video controls */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "28px 14px 12px",
          background: "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,0))",
          pointerEvents: "none",
        }}
      >
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{item.caption}</p>
      </div>
    </div>
  );
}

function AboutScroller() {
  const scrollerRef = useRef(null);
  const videoEls = useRef({});

  const registerVideoRef = useCallback((index, el) => {
    if (el) videoEls.current[index] = el;
    else delete videoEls.current[index];
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.65, 1] }
    );

    Object.values(videoEls.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 284, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        aria-label="Scroll left"
        className="about-arrow about-arrow-left"
        onClick={() => scrollByCard(-1)}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        aria-label="Scroll right"
        className="about-arrow about-arrow-right"
        onClick={() => scrollByCard(1)}
      >
        <ChevronRight size={20} />
      </button>

      <div
        ref={scrollerRef}
        className="hide-scrollbar"
        style={{
          display: "flex",
          gap: 20,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          padding: "6px 4px 18px",
        }}
      >
        {ABOUT_MEDIA.map((item, i) => (
          <MediaCard key={i} item={item} index={i} registerVideoRef={registerVideoRef} />
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const faqs = [
    { q: "Is my data secure?", a: "Yes, we use end-to-end encryption and secure cloud storage to ensure all your personal data, prayer requests, and records are private and protected." },
    { q: "Can I access sermons and the Bible on the same platform?", a: "Yes, you can access our full sermon library and Bible reader all in one place — no extra apps needed." },
    { q: "How do I join a quiz or event?", a: "Simply log in, navigate to the Quiz or Events section, and participate. Results are instant and you earn badges for achievements." },
    { q: "Is support available in local languages?", a: "Yes, our support team is available to assist you in Yoruba, Hausa, and Igbo alongside English." },
    { q: "Can I submit prayer requests anonymously?", a: "Yes, you have the option to submit your prayer request anonymously if you prefer." },
  ];

  const services = [
    { icon: BookOpen,     title: "Bible Reader",    desc: "Access the full Bible with multiple translations, bookmarks, and daily reading plans.",  color: C.primary },
    { icon: Mic,          title: "Sermons",         desc: "Watch and listen to past and live sermon recordings anytime, anywhere.",                   color: "#0891b2" },
    { icon: HeartHandshake, title: "Prayer Requests", desc: "Submit and track your prayer requests. Our team prays over every submission.",           color: "#7c3aed" },
    { icon: Brain,        title: "Bible Quiz",      desc: "Test your Bible knowledge with fun, challenging quizzes and earn badges.",                 color: C.accentDk },
    { icon: Calendar,     title: "Events",          desc: "Stay updated on all church events, programs, and special services.",                       color: "#d97706" },
    { icon: Headphones,   title: "24/7 Support",    desc: "Our team is always available to answer your questions and offer guidance.",                color: "#dc2626" },
  ];

  const steps = [
    { num: "1", title: "Create Your Account",  desc: "Sign up in seconds with your name and email. No complicated forms." },
    { num: "2", title: "Explore the Platform", desc: "Access sermons, the Bible, events, quizzes, and prayer requests instantly." },
    { num: "3", title: "Connect & Grow",       desc: "Engage with the church community, track your spiritual journey and grow in faith." },
  ];

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", color: C.text, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-link { text-decoration:none; color:#374151; font-size:15px; font-weight:500; transition:color .2s; }
        .nav-link:hover { color:${C.primary}; }

        .btn-primary {
          background:${C.primary}; color:#fff; border:none;
          padding:11px 26px; border-radius:8px; font-size:15px; font-weight:600;
          cursor:pointer; text-decoration:none; display:inline-block;
          transition:background .2s,transform .15s;
        }
        .btn-primary:hover { background:${C.primaryDk}; transform:translateY(-1px); }

        .btn-outline {
          background:transparent; color:${C.primary}; border:2px solid ${C.primary};
          padding:10px 26px; border-radius:8px; font-size:15px; font-weight:600;
          cursor:pointer; text-decoration:none; display:inline-block; transition:all .2s;
        }
        .btn-outline:hover { background:${C.primary}; color:#fff; transform:translateY(-1px); }

        .btn-white {
          background:#fff; color:${C.primary}; border:none;
          padding:11px 26px; border-radius:8px; font-size:15px; font-weight:600;
          cursor:pointer; text-decoration:none; display:inline-block;
          transition:all .2s; box-shadow:0 2px 8px rgba(0,0,0,.12);
        }
        .btn-white:hover { box-shadow:0 4px 16px rgba(0,0,0,.18); transform:translateY(-1px); }

        .btn-ghost {
          background:rgba(255,255,255,.12); color:#fff; border:2px solid rgba(255,255,255,.45);
          padding:10px 26px; border-radius:8px; font-size:15px; font-weight:600;
          cursor:pointer; text-decoration:none; display:inline-block; transition:all .2s;
        }
        .btn-ghost:hover { background:rgba(255,255,255,.22); }

        .service-card {
          background:#fff; border:1px solid ${C.border}; border-radius:14px;
          padding:28px 24px; transition:box-shadow .2s,transform .2s;
        }
        .service-card:hover { box-shadow:0 8px 32px rgba(22,163,74,.13); transform:translateY(-4px); }

        .faq-btn {
          width:100%; background:none; border:none; text-align:left;
          padding:20px 0; font-size:16px; font-weight:600; color:#111827;
          cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:12px;
        }
        .faq-body { font-size:15px; color:${C.textMuted}; line-height:1.7; padding-bottom:20px; }

        .footer-link { color:#9ca3af; text-decoration:none; font-size:14px; line-height:2.1; display:block; transition:color .2s; }
        .footer-link:hover { color:#fff; }

        .menu-overlay { position:fixed; inset:0; background:rgba(0,0,0,.4); z-index:99; }
        .mobile-menu {
          position:fixed; top:0; right:0; height:100%; width:min(320px,85vw);
          background:#fff; z-index:100; padding:24px;
          box-shadow:-4px 0 32px rgba(0,0,0,.15);
        }

        .hero-card {
          background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.22);
          border-radius:16px; padding:20px;
        }

        .step-connector {
          position:absolute; top:31px; left:calc(50% + 34px);
          width:calc(100% - 68px); height:2px;
          background:linear-gradient(90deg,${C.primary},${C.accent});
          opacity:.35;
        }

        /* ── About scroller ── */
        .hide-scrollbar { scrollbar-width:none; -ms-overflow-style:none; }
        .hide-scrollbar::-webkit-scrollbar { display:none; }

        .about-arrow {
          position:absolute; top:50%; transform:translateY(-50%); z-index:5;
          width:40px; height:40px; border-radius:50%;
          background:#fff; border:1px solid ${C.border};
          box-shadow:0 4px 14px rgba(0,0,0,.12);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:${C.text}; transition:background .2s,color .2s;
        }
        .about-arrow:hover { background:${C.primary}; color:#fff; border-color:${C.primary}; }
        .about-arrow-left { left:-6px; }
        .about-arrow-right { right:-6px; }

        /* ── Responsive ── */
        @media(max-width:900px){
          .services-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media(max-width:768px){
          .desktop-nav { display:none !important; }
          .mobile-btn   { display:flex !important; }
          .hero-grid    { flex-direction:column !important; }
          .hero-text    { text-align:center !important; }
          .hero-btns    { justify-content:center !important; }
          .hero-visual  { display:none !important; }
          .steps-grid   { flex-direction:column !important; gap:28px !important; }
          .step-connector { display:none !important; }
          .footer-grid  { grid-template-columns:1fr 1fr !important; }
          .footer-brand { grid-column:1/-1 !important; }
          .hero-h1      { font-size:34px !important; }
          .cta-h2       { font-size:28px !important; }
          .sec-h2       { font-size:28px !important; }
          .about-arrow  { display:none !important; }
        }
        @media(max-width:520px){
          .services-grid { grid-template-columns:1fr !important; }
          .footer-grid   { grid-template-columns:1fr !important; }
          .hero-h1       { font-size:27px !important; }
          .section-pad   { padding:56px 18px !important; }
        }
      `}</style>

      {/* ════════════════ NAVBAR ════════════════ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        background: scrolled ? "rgba(255,255,255,.97)" : "#fff",
        borderBottom:"1px solid #e5e7eb",
        boxShadow: scrolled ? "0 2px 16px rgba(0,0,0,.08)" : "none",
        transition:"box-shadow .3s",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          {/* Logo */}
          <a href="#home" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
            <img src={logos} alt="church logo" className="w-20 h-20" />
            <div style={{ lineHeight: 1.2 }} >
              <div style={{ fontSize: 16, fontWeight: 800, color: "#14532d", letterSpacing: "-0.2px" }}>
                Chapel of Praise
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: C.primary, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                A Parish of the RCCG
              </div>
            </div>
          </a>

          {/* Desktop links */}
          <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:34 }}>
            <a href="#home"         className="nav-link">Home</a>
            <a href="#about"        className="nav-link">About</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#services"     className="nav-link">Services</a>
            <a href="#faq"          className="nav-link">FAQ</a>
          </div>

          {/* Desktop CTA */}
          <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Link to="/login"  className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-primary">Register</Link>
          </div>

          {/* Hamburger */}
          <button className="mobile-btn" onClick={() => setMenuOpen(true)}
            style={{ display:"none", alignItems:"center", justifyContent:"center", background:"none", border:"none", cursor:"pointer", padding:8 }}>
            <svg width="24" height="24" fill="none" stroke="#374151" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)}/>
          <div className="mobile-menu">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <img src={logos} alt="Header" className="w-18 h-18 object-contain" />
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:"#14532d" }}>Chapel of Praise</div>
                  <div style={{ fontSize:9, color:C.primary, fontWeight:600, textTransform:"uppercase" }}>RCCG Parish</div>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background:"none", border:"none", cursor:"pointer" }}>
                <svg width="24" height="24" fill="none" stroke="#374151" strokeWidth="2.2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6"  y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {[["home","Home"],["about","About"],["how-it-works","How It Works"],["services","Services"],["faq","FAQ"]].map(([id,label]) => (
              <a key={id} href={`#${id}`} className="nav-link" onClick={() => setMenuOpen(false)}
                style={{ display:"block", padding:"14px 0", borderBottom:"1px solid #f3f4f6", fontSize:16 }}>
                {label}
              </a>
            ))}
            <div style={{ marginTop:28, display:"flex", flexDirection:"column", gap:12 }}>
              <Link to="/login"  className="btn-outline" style={{ textAlign:"center" }} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn-primary" style={{ textAlign:"center" }} onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          </div>
        </>
      )}

      {/* ════════════════ HERO ════════════════ */}
      <section id="home" style={{
        background:`linear-gradient(135deg, ${C.heroFrom} 0%, ${C.heroMid} 55%, ${C.heroTo} 100%)`,
        paddingTop:68, minHeight:"100vh", display:"flex", alignItems:"center",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0px 24px", width:"100%" }}>
          <div className="hero-grid" style={{ display:"flex", alignItems:"center", gap:60, justifyContent:"space-between" }}>

            {/* Left */}
            <div className="hero-text " style={{ flex:"1 1 500px", maxWidth:600 }}>
              {/* Church badge */}
              <div  style={{ display:"inline-flex", alignItems:"center", gap:10, background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.25)", borderRadius:100, padding:"7px 18px", marginBottom:26 }}>
                <img src={logos} alt="Church Logo" className="w-10 h-10" />
                <span style={{ fontSize:15, color:"rgba(255,255,255,.9)", fontWeight:600 }}>Chapel of Praise — RCCG Parish</span>
              </div>

              <h1 className="hero-h1" style={{ fontSize:52, fontWeight:800, color:"#fff", lineHeight:1.14, letterSpacing:"-1px", marginBottom:20 }}>
                Your Church,<br/>
                <span style={{ color:C.accent }}>Always With You</span>
              </h1>

              <p style={{ fontSize:18, color:"rgba(255,255,255,.8)", lineHeight:1.7, marginBottom:36, maxWidth:480 }}>
                Access sermons, the Bible, prayer requests, events, and quizzes — all in one secure platform. Stay connected with Chapel of Praise anytime, anywhere.
              </p>

              <div className="hero-btns" style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <Link to="/signup" className="btn-white">Get Started Free</Link>
                <Link to="/login"  className="btn-ghost">Login</Link>
              </div>

              {/* Stats */}
              <div style={{ display:"flex", gap:28, justifyContent:"center", marginTop:44, flexWrap:"wrap" }}>
                {[["300+","Members"],["1,200+","Sermons"],["24/7","Support"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{n}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,.55)", fontWeight:500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating cards */}
            <div className="hero-visual" style={{ flex:"0 0 370px", display:"flex", flexDirection:"column", gap:16 }}>
              <div className="hero-card">
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                  <div style={{ width:42, height:42, borderRadius:10, background:"rgba(255,255,255,.18)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <BookOpen size={20} color="#fff" />
                  </div>
                  <div>
                    <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Daily Bible Reading</div>
                    <div style={{ color:"rgba(255,255,255,.55)", fontSize:13 }}>John 3:16 — Today's verse</div>
                  </div>
                </div>
                <div style={{ background:"rgba(255,255,255,.08)", borderRadius:8, padding:"10px 14px" }}>
                  <p style={{ color:"rgba(255,255,255,.82)", fontSize:13, lineHeight:1.65, fontStyle:"italic" }}>
                    "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish…"
                  </p>
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                {[
                  { Icon: Mic,           title:"Sermons",  sub:"Watch live & past" },
                  { Icon: HeartHandshake, title:"Prayer",   sub:"Submit requests"  },
                  { Icon: Brain,         title:"Quiz",     sub:"Test your knowledge" },
                  { Icon: Calendar,      title:"Events",   sub:"Stay updated"     },
                ].map(c => (
                  <div key={c.title} className="hero-card" style={{ padding:16 }}>
                    <c.Icon size={22} color="#fff" style={{ marginBottom:6 }} />
                    <div style={{ color:"#fff", fontWeight:600, fontSize:14 }}>{c.title}</div>
                    <div style={{ color:"rgba(255,255,255,.5)", fontSize:12 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ ABOUT ════════════════ */}
      <section id="about" className="section-pad" style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.primary, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>About Us</div>
            <h2 className="sec-h2" style={{ fontSize:38, fontWeight:700, color:C.text, letterSpacing:"-0.5px", marginBottom:14 }}>Life at Chapel of Praise</h2>
            <p style={{ color:C.textMuted, fontSize:17, maxWidth:520, margin:"0 auto" }}>
              A glimpse into our services, our people, and our community — scroll through to see us in action.
            </p>
          </div>

          <AboutScroller />
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section id="how-it-works" className="section-pad" style={{ padding:"80px 24px", background:C.bg }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.primary, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>How It Works</div>
            <h2 className="sec-h2" style={{ fontSize:38, fontWeight:600, color:C.text, letterSpacing:"-0.5px", marginBottom:14 }}>Simple, Fast & Spiritual</h2>
            <p style={{ color:C.textMuted, fontSize:17, maxWidth:480, margin:"0 auto" }}>Follow these 3 easy steps to connect with your church community</p>
          </div>

          <div className="steps-grid" style={{ display:"flex", gap:32, position:"relative" }}>
            {steps.map((step, i) => (
              <div key={i} style={{ flex:1, position:"relative", textAlign:"center" }}>
                {i < steps.length - 1 && <div className="step-connector"/>}
                <div style={{
                  width:64, height:64, borderRadius:"50%",
                  background:C.primary, color:"#fff",
                  fontSize:24, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  margin:"0 auto 20px", boxShadow:`0 4px 20px rgba(22,163,74,.35)`,
                  position:"relative", zIndex:1,
                }}>{step.num}</div>
                <h3 style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:10 }}>{step.title}</h3>
                <p style={{ color:C.textMuted, fontSize:15, lineHeight:1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ SERVICES ════════════════ */}
      <section id="services" className="section-pad" style={{ padding:"80px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.primary, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>Our Services</div>
            <h2 className="sec-h2" style={{ fontSize:38, fontWeight:700, color:C.text, letterSpacing:"-0.5px", marginBottom:14 }}>Empowering Your Faith Journey</h2>
            <p style={{ color:C.textMuted, fontSize:17, maxWidth:480, margin:"0 auto" }}>Everything you need to grow spiritually, stay connected, and serve your community</p>
          </div>

          <div className="services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {services.map((s, i) => (
              <div key={i} className="service-card">
                <div style={{ width:52, height:52, borderRadius:14, background:s.color+"18", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18 }}>
                  <s.icon size={24} color={s.color} />
                </div>
                <h3 style={{ fontSize:17, fontWeight:700, color:C.text, marginBottom:10 }}>{s.title}</h3>
                <p style={{ color:C.textMuted, fontSize:14, lineHeight:1.65, marginBottom:16 }}>{s.desc}</p>
                <a href="#" style={{ color:C.primary, fontSize:14, fontWeight:600, textDecoration:"none" }}>Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA BANNER ════════════════ */}
      <section style={{ background:`linear-gradient(135deg, ${C.heroFrom} 0%, ${C.primary} 100%)`, padding:"72px 24px" }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <h2 className="cta-h2" style={{ fontSize:38, fontWeight:800, color:"#fff", marginBottom:16, letterSpacing:"-0.5px" }}>
            Join Our Growing Community
          </h2>
          <p style={{ color:"rgba(255,255,255,.8)", fontSize:17, marginBottom:36, lineHeight:1.65 }}>
            Hundreds of members are already growing in faith, accessing sermons, and connecting with each other at Chapel of Praise. Join them today — it's completely free.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/signup" className="btn-white">Create Free Account</Link>
            <Link to="/login"  className="btn-ghost">I Already Have an Account</Link>
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section id="faq" className="section-pad" style={{ padding:"80px 24px", background:C.bg }}>
        <div style={{ maxWidth:740, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.primary, textTransform:"uppercase", letterSpacing:2, marginBottom:10 }}>FAQ</div>
            <h2 className="sec-h2" style={{ fontSize:38, fontWeight:800, color:C.text, letterSpacing:"-0.5px", marginBottom:14 }}>Frequently Asked Questions</h2>
            <p style={{ color:C.textMuted, fontSize:17 }}>Got questions? We've got answers.</p>
          </div>

          <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${C.border}`, padding:"0 28px" }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ borderBottom: i === faqs.length-1 ? "none" : `1px solid ${C.border}` }}>
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.q}</span>
                  <span style={{ fontSize:22, color:C.primary, flexShrink:0, transition:"transform .2s", display:"inline-block", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
                </button>
                {openFaq === i && <div className="faq-body">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ NEWSLETTER ════════════════ */}
      <section style={{ background:"#fff", padding:"60px 24px", borderTop:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:520, margin:"0 auto", textAlign:"center" }}>
          <h3 style={{ fontSize:24, fontWeight:800, color:C.text, marginBottom:10 }}>Join Our Newsletter</h3>
          <p style={{ color:C.textMuted, fontSize:15, marginBottom:24 }}>Stay updated with the latest church news, sermon releases, and upcoming events.</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
            <input type="email" placeholder="Enter your email address" style={{
              flex:"1 1 240px", padding:"12px 16px", borderRadius:8,
              border:`1.5px solid ${C.border}`, fontSize:15, outline:"none", fontFamily:"inherit",
            }}/>
            <button className="btn-primary" style={{ whiteSpace:"nowrap" }}>Subscribe</button>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer style={{ background:"#0f172a", padding:"60px 24px 32px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>

            <div className="footer-brand">
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <img src={logos} alt="Header" className="w-18 h-18 object-contain" />
                <div>
                  <div style={{ fontSize:12, fontWeight:800, color:"#fff" }}>Chapel of Praise</div>
                  <div style={{ fontSize:8, color:C.accent, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px" }}>A Parish of the RCCG</div>
                </div>
              </div>
              <p style={{ color:"#9ca3af", fontSize:14, lineHeight:1.7, maxWidth:280 }}>
                Nigeria's most connected church platform. Access sermons, the Bible, prayer requests, and more — all in one place.
              </p>
              <div style={{ marginTop:20, color:"#6b7280", fontSize:13 }}>8, Oloyede Street, Ndike, Obawole, Lagos, Nigeria.</div>
              <div style={{ color:"#6b7280", fontSize:13 }}>support@chapelofpraise.ng</div>
            </div>

            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:16 }}>Company</div>
              {["About Us","Careers","Contact","Terms & Conditions","Privacy Policy"].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:16 }}>Support</div>
              {["FAQ","Help Center","Contact Us","Prayer Requests"].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
            </div>
            <div>
              <div style={{ color:"#fff", fontWeight:700, fontSize:14, marginBottom:16 }}>Quick Links</div>
              {["Sermons","Bible Reader","Events","Quiz","Profile"].map(l => <a key={l} href="#" className="footer-link">{l}</a>)}
            </div>
          </div>

          <div style={{ borderTop:"1px solid #1e293b", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ color:"#6b7280", fontSize:14 }}>© {new Date().getFullYear()} Chapel of Praise — RCCG. All rights reserved.</div>
            <div style={{ display:"flex", gap:20 }}>
              {["Terms","Privacy","Cookies"].map(l => <a key={l} href="#" style={{ color:"#6b7280", fontSize:14, textDecoration:"none" }}>{l}</a>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
