// import React, { useState, useEffect } from 'react';
// import { FaCalendarAlt, FaClock, FaChevronDown, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
// import { db } from '../../firebase/config';
// import { useTheme } from '../../Context/ThemeContext';
// /* ───────────────────────── Event Card (UI untouched) ───────────────────────── */
// const EventCard = ({ event }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <motion.div layout className="relative overflow-hidden rounded-3xl flex flex-col shadow-lg transition-all">
//       <div
//         className="h-70 flex flex-col justify-between p-6 text-white bg-cover bg-center"
//         style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${event.img})` }}
//       >
//         <div className="flex justify-between items-start">
//           <span className="text-[10px] font-bold tracking-widest text-teal-300 bg-teal-900/60 px-2 py-1 rounded">{event.type}</span>
//           <div className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full border border-white/30">{event.status}</div>
//         </div>

//         <div>
//           <h3 className="text-xl font-bold leading-tight mb-3">{event.title}</h3>
//           <div className="flex flex-wrap gap-4 text-[11px] opacity-90 mb-4">
//             <span className="flex items-center gap-1"><FaCalendarAlt /> {event.date}</span>
//             <span className="flex items-center gap-1"><FaClock /> {event.time}</span>
//           </div>
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 text-white font-semibold text-[13px] py-2 rounded-xl transition-all"
//           >
//             Details <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//           </button>
//         </div>
//       </div>


//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="bg-[#F3F4F6] border-x border-b border-gray-100 rounded-b-3xl px-6 overflow-hidden"
//           >
//             <div className="py-4 space-y-3">
//               <p className="text-sm text-gray-600 leading-relaxed italic">{event.description}</p>

//               <div className="pt-2 border-t border-gray-200">
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
//                   {event.status === 'Physical' ? 'Venue Location' : 'Meeting Link'}
//                 </p>
//                 {event.status === 'Physical' ? (
//                   <div className="flex items-center gap-2 text-sm text-[#0F3B39] font-medium">
//                     <FaMapMarkerAlt className="text-teal-600" /> {event.location}
//                   </div>
//                 ) : (
//                   <a href={event.location} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline break-all">
//                     <FaLink /> Click to join meeting
//                   </a>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// /* ───────────────────────── Helpers ───────────────────────── */

// // Firestore stores: title, type, status, eventDate (Timestamp), startTime, endTime,
// // description, location, imageURL, createdAt (Timestamp)
// const formatDate = (timestamp) => {
//   if (!timestamp) return '';
//   const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
//   return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
// };

// const formatTimeRange = (start, end) => {
//   if (!start) return '';
//   const fmt = (t) => {
//     if (!t) return '';
//     const [h, m] = t.split(':');
//     const hour = parseInt(h, 10);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//     return `${displayHour}:${m} ${ampm}`;
//   };
//   return end ? `${fmt(start)} - ${fmt(end)}` : fmt(start);
// };

// const mapDocToEvent = (docSnap) => {
//   const data = docSnap.data();
//   return {
//     id: docSnap.id,
//     title: data.title || 'Untitled Event',
//     type: (data.eventType || 'EVENT').toUpperCase(),
//     status: data.locationType === 'online' ? 'Online' : 'Physical',
//     date: formatDate(data.eventDate),
//     eventDateRaw: data.eventDate?.toDate ? data.eventDate.toDate() : new Date(data.eventDate),
//     time: formatTimeRange(data.startTime, data.endTime),
//     description: data.description || '',
//     location: data.location || '',
//     img: data.imageURL || 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=800',
//   };
// };

// /* ───────────────────────── Main Page ───────────────────────── */
// const EventPage = () => {
//   const [activeTab, setActiveTab] = useState('Current');
//   const [allEvents, setAllEvents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Listen live to the 'events' collection, newest event date first
//     const q = query(collection(db, 'events'), orderBy('eventDate', 'asc'));

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const mapped = snapshot.docs.map(mapDocToEvent);
//         setAllEvents(mapped);
//         setLoading(false);
//       },
//       (err) => {
//         console.error('Failed to load events:', err);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   // Current = most recent 5 events (by date desc). Past = everything else.
//   // const currentEvents = allEvents.slice(0, 5);
//   // const pastEvents = allEvents.slice(5);

//   // Add this filter logic:
// const now = new Date();
// // Normalize 'now' to remove time so it matches the date comparison better
// now.setHours(0, 0, 0, 0); 

// const currentEvents = allEvents.filter(e => e.eventDateRaw >= now);
// const pastEvents = allEvents.filter(e => e.eventDateRaw < now).reverse();

//   const displayedEvents = activeTab === 'Current' ? currentEvents : pastEvents;

//   return (
//     <div className="max-w-6xl mx-auto py-3 px-5">
//       {/* ── Page Header Description ── */}
// <div className="mb-8">
//   <div className="flex items-center gap-3">
//     {/* <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F3B39] text-white shadow-lg">
//       <FaCalendarAlt size={20} />
//     </div> */}
//     <div>
//       <h1 className="text-[26px] font-bold text-slate-900">Community Calendar</h1>
//       <p className="text-[12px] text-slate-500">
//         Stay connected with upcoming fellowships, services, and special programs.
//       </p>
//     </div>
//   </div>
// </div>
//       <div className="flex w-full bg-gray-100  rounded-xl shadow-inner mb-8">
//   {['Current', 'Past'].map((tab) => (
//     <button
//       key={tab}
//       onClick={() => setActiveTab(tab)}
//       className={`
//         flex-1 px-6 py-2 gap-1 text-sm font-bold tracking-wide rounded-lg transition-all duration-300
//         ${activeTab === tab 
//           ? 'text-white bg-[#0F3B39] shadow-md' 
//           : 'text-gray-500 hover:text-[#0F3B39] hover:bg-gray-200'}
//       `}
//     >
//       {tab} Events
//     </button>
//   ))}
// </div>

//       <div className="mb-10">
//         <h1 className="text-xl font-bold text-[#0F3B39] mb-3">
//           {activeTab === 'Current' ? 'Upcoming Gatherings' : 'Past Gatherings'}
//         </h1>
//         <p className="text-gray-500 text-sm">
//           {activeTab === 'Current'
//             ? 'Join our upcoming services and events to grow in faith and connect with our community.'
//             : 'A look back at events our community has shared together.'}
//         </p>
//       </div>

//       {loading ? (
//         <div className="flex justify-center py-20">
//           <div className="w-8 h-8 border-3 border-[#0F3B39] border-t-transparent rounded-full animate-spin" />
//         </div>
//       ) : displayedEvents.length === 0 ? (
//         <div className="text-center py-20 text-gray-400 text-sm">
//           {activeTab === 'Current' ? 'No upcoming events posted yet.' : 'No past events to show.'}
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {displayedEvents.map(event => <EventCard key={event.id} event={event} />)}
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventPage;







import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaChevronDown, FaMapMarkerAlt, FaLink } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useTheme } from '../../Context/ThemeContext';
/* ───────────────────────── Event Card (UI untouched) ───────────────────────── */
const EventCard = ({ event }) => {
  const { theme, themeKey, fontSize } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div layout className="relative overflow-hidden rounded-3xl flex flex-col shadow-lg transition-all">
      <div
        className="h-70 flex flex-col justify-between p-6 text-white bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url(${event.img})` }}
      >
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold tracking-widest text-teal-300 bg-teal-900/60 px-2 py-1 rounded">{event.type}</span>
          <div className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase px-3 py-1 rounded-full border border-white/30">{event.status}</div>
        </div>

        <div>
          <h3 className="text-xl font-bold leading-tight mb-3">{event.title}</h3>
          <div className="flex flex-wrap gap-4 text-[11px] opacity-90 mb-4">
            <span className="flex items-center gap-1"><FaCalendarAlt /> {event.date}</span>
            <span className="flex items-center gap-1"><FaClock /> {event.time}</span>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:bg-white/10 text-white font-semibold text-[13px] py-2 rounded-xl transition-all"
          >
            Details <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>


      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-x border-b rounded-b-3xl px-6 overflow-hidden transition-colors ${theme.border} ${theme.cardBg}`}
          >
            <div className="py-4 space-y-3">
              <p className={`${fontSize.bodyClass} leading-relaxed italic ${theme.text}`}>{event.description}</p>

              <div className={`pt-2 border-t ${theme.border}`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${theme.subText}`}>
                  {event.status === 'Physical' ? 'Venue Location' : 'Meeting Link'}
                </p>
                {event.status === 'Physical' ? (
                  <div className={`flex items-center gap-2 text-sm font-medium ${theme.heading}`}>
                    <FaMapMarkerAlt className="text-teal-600" /> {event.location}
                  </div>
                ) : (
                  <a href={event.location} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-500 hover:underline break-all">
                    <FaLink /> Click to join meeting
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ───────────────────────── Helpers ───────────────────────── */

// Firestore stores: title, type, status, eventDate (Timestamp), startTime, endTime,
// description, location, imageURL, createdAt (Timestamp)
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTimeRange = (start, end) => {
  if (!start) return '';
  const fmt = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:${m} ${ampm}`;
  };
  return end ? `${fmt(start)} - ${fmt(end)}` : fmt(start);
};

const mapDocToEvent = (docSnap) => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    title: data.title || 'Untitled Event',
    type: (data.eventType || 'EVENT').toUpperCase(),
    status: data.locationType === 'online' ? 'Online' : 'Physical',
    date: formatDate(data.eventDate),
    eventDateRaw: data.eventDate?.toDate ? data.eventDate.toDate() : new Date(data.eventDate),
    time: formatTimeRange(data.startTime, data.endTime),
    description: data.description || '',
    location: data.location || '',
    img: data.imageURL || 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=800',
  };
};

/* ───────────────────────── Main Page ───────────────────────── */
const EventPage = () => {
  const { theme, themeKey } = useTheme();
  const [activeTab, setActiveTab] = useState('Current');
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen live to the 'events' collection, newest event date first
    const q = query(collection(db, 'events'), orderBy('eventDate', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const mapped = snapshot.docs.map(mapDocToEvent);
        setAllEvents(mapped);
        setLoading(false);
      },
      (err) => {
        console.error('Failed to load events:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Current = most recent 5 events (by date desc). Past = everything else.
  // const currentEvents = allEvents.slice(0, 5);
  // const pastEvents = allEvents.slice(5);

  // Add this filter logic:
const now = new Date();
// Normalize 'now' to remove time so it matches the date comparison better
now.setHours(0, 0, 0, 0); 

const currentEvents = allEvents.filter(e => e.eventDateRaw >= now);
const pastEvents = allEvents.filter(e => e.eventDateRaw < now).reverse();

  const displayedEvents = activeTab === 'Current' ? currentEvents : pastEvents;

  return (
    <div className="max-w-6xl mx-auto py-3 px-5">
      {/* ── Page Header Description ── */}
<div className="mb-8">
  <div className="flex items-center gap-3">
    {/* <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F3B39] text-white shadow-lg">
      <FaCalendarAlt size={20} />
    </div> */}
    <div>
      <h1 className={`text-[26px] font-bold ${theme.heading}`}>Community Calendar</h1>
      <p className={`text-[12px] ${theme.subText}`}>
        Stay connected with upcoming fellowships, services, and special programs.
      </p>
    </div>
  </div>
</div>
      <div className={`flex w-full rounded-xl shadow-inner mb-8 ${themeKey === 'dark' ? 'bg-slate-800' : 'bg-gray-100'}`}>
  {['Current', 'Past'].map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`
        flex-1 px-6 py-2 gap-1 text-sm font-bold tracking-wide rounded-lg transition-all duration-300
        ${activeTab === tab 
          ? 'text-white bg-[#0F3B39] shadow-md' 
          : `${theme.subText} ${themeKey === 'dark' ? 'hover:text-teal-300 hover:bg-slate-700' : 'hover:text-[#0F3B39] hover:bg-gray-200'}`}
      `}
    >
      {tab} Events
    </button>
  ))}
</div>

      <div className="mb-10">
        <h1 className={`text-xl font-bold mb-3 ${theme.heading}`}>
          {activeTab === 'Current' ? 'Upcoming Gatherings' : 'Past Gatherings'}
        </h1>
        <p className={`text-sm ${theme.subText}`}>
          {activeTab === 'Current'
            ? 'Join our upcoming services and events to grow in faith and connect with our community.'
            : 'A look back at events our community has shared together.'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-[#0F3B39] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayedEvents.length === 0 ? (
        <div className={`text-center py-20 text-sm ${theme.subText}`}>
          {activeTab === 'Current' ? 'No upcoming events posted yet.' : 'No past events to show.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      )}
    </div>
  );
};

export default EventPage;
