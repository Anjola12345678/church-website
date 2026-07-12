
// import React, { useState, useEffect, useRef } from 'react';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { db, auth } from '../../firebase/config';
// import { toast } from 'react-toastify';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FaUser,
//   FaCamera,
//   FaCheck,
//   FaCheckCircle,
//   FaExclamationCircle,
//   FaChurch,
//   FaSeedling,
// } from 'react-icons/fa';
// import { useTheme } from '../../Context/ThemeContext';
// const FontImport = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
//     .font-display { font-family: 'Fraunces', serif; font-feature-settings: 'ss01' 1; }
//     .font-body { font-family: 'Inter', sans-serif; }
//   `}</style>
// );


// // const ToastNotice = ({ tone, message }) => {
// //   const isSuccess = tone === 'success';
// //   return (
// //     <div className="font-body flex items-center gap-3 py-1">
// //       <span
// //         className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
// //           isSuccess ? 'bg-[#B8902F]/15 text-[#8A6B20]' : 'bg-[#B3261E]/10 text-[#B3261E]'
// //         }`}
// //       >
// //         {isSuccess ? <FaCheckCircle size={15} /> : <FaExclamationCircle size={15} />}
// //       </span>
// //       <div className="min-w-0">
// //         <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0F3B39]/50">
// //           {isSuccess ? 'Saved' : 'Action needed'}
// //         </p>
// //         <p className="text-[13px] font-semibold text-[#16302C] leading-snug">{message}</p>
// //       </div>
// //     </div>
// //   );
// // };


// // Replace your existing ToastNotice with this one from AdminProfilePage
// const Toast = ({ toast }) => {
//   if (!toast) return null;
//   const isError = toast.type === 'error';
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 50 }}
//       transition={{ type: 'spring', stiffness: 400, damping: 30 }}
//       className="fixed bottom-6 left-1/2 z-[100] flex min-w-[280px] -translate-x-1/2 items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-[13px] font-medium text-white shadow-2xl"
//     >
//       {isError ? <FaExclamationCircle size={16} className="text-rose-500" /> : <FaCheckCircle size={16} className="text-emerald-500" />}
//       <span className="flex-1">{toast.message}</span>
//       <div className={`absolute bottom-0 left-0 h-1 w-full rounded-b-lg ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
//     </motion.div>
//   );
// };

// const notify = {
//   success: (message) =>
//     toast(<ToastNotice tone="success" message={message} />, {
//       icon: false,
//       className: '!rounded-2xl !bg-[#FAF6EE] !p-3.5 !shadow-[0_12px_30px_-10px_rgba(15,59,57,0.35)] !border !border-[#0F3B39]/10',
//       progressClassName: '!bg-[#B8902F]',
//       bodyClassName: '!p-0 !m-0',
//     }),
//   error: (message) =>
//     toast(<ToastNotice tone="error" message={message} />, {
//       icon: false,
//       className: '!rounded-2xl !bg-[#FAF6EE] !p-3.5 !shadow-[0_12px_30px_-10px_rgba(179,38,30,0.35)] !border !border-[#B3261E]/15',
//       progressClassName: '!bg-[#B3261E]',
//       bodyClassName: '!p-0 !m-0',
//     }),
// };

// /* ------------------------------------------------------------------ */
// /*  Small shared UI                                                    */
// /* ------------------------------------------------------------------ */

// const SectionCard = ({ children, className = '' }) => (
//   <div
//     className={`rounded-[28px] bg-transparent border border-[#0F3B39]/8 shadow-[0_2px_24px_-8px_rgba(15,59,57,0.10)] p-6 ${className}`}
//   >
//     {children}
//   </div>
// );

// const SectionEyebrow = ({ icon, children }) => (
//   <div className="flex items-center gap-2 mb-6">
//     <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F3B39] text-[#D9C68A]">
//       {icon}
//     </span>
//     <span className="font-body text-[11px] font-bold uppercase tracking-[0.18em] text-[#0F3B39]">
//       {children}
//     </span>
//   </div>
// );

// const FieldRow = ({ label, value, disabled, onChange, type = 'text' }) => (
//   <div>
//     <label className="font-body block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0F3B39]/45 mb-1.5">
//       {label}
//     </label>
//     <input
//       type={type}
//       disabled={disabled}
//       value={value || ''}
//       onChange={onChange}
//       className="font-body w-full border-b border-[#0F3B39]/15 bg-transparent py-1.5 text-[15px] text-[#16302C] outline-none transition-colors focus:border-[#B8902F] disabled:text-[#16302C]/70"
//     />
//   </div>
// );

// const PillToggle = ({ active, disabled, onClick, children }) => (
//   <button
//     type="button"
//     disabled={disabled}
//     onClick={onClick}
//     className={`font-body flex-1 rounded-xl border py-2.5 text-[13px] font-semibold transition-all ${
//       active
//         ? 'border-[#0F3B39] bg-[#0F3B39] text-white shadow-sm'
//         : 'border-[#0F3B39]/12 bg-white text-[#16302C]/60 hover:border-[#0F3B39]/25'
//     } disabled:cursor-default`}
//   >
//     {children}
//   </button>
// );

// const Spinner = () => (
//   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
// );

// /* ------------------------------------------------------------------ */
// /*  Main component                                                     */
// /* ------------------------------------------------------------------ */

// const ProfilePage = () => {
//   const [userData, setUserData] = useState({
//     firstName: '', lastName: '', email: '', phone: '', postalAddress: '',
//     ageGroup: '', joinedDate: '', baptized: '', department: '', photoURL: ''
//   });
//   const [loading, setLoading] = useState(true); // For the initial data fetch
//   const [isSaving, setIsSaving] = useState(false); // New state for the button
//   const [isEditing, setIsEditing] = useState(false);
//   const fileInputRef = useRef(null);
//   const [flipped, setFlipped] = useState(false);
//   const [toast, setToast] = useState(null); // Add this state
  
//   const showToast = (type, message) => {
//     setToast({ type, message });
//     setTimeout(() => setToast(null), 3500);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!auth.currentUser) return;

//       try {
//         const docSnap = await getDoc(doc(db, "userprofile", auth.currentUser.uid));

//         const authInfo = {
//           email: auth.currentUser.email || '',
//           firstName: auth.currentUser.displayName?.split(' ')[0] || '',
//           lastName: auth.currentUser.displayName?.split(' ')[1] || ''
//         };

//         if (docSnap.exists()) {
//           setUserData({ ...authInfo, ...docSnap.data() });
//         } else {
//           setUserData(prev => ({ ...prev, ...authInfo }));
//         }
//       } catch (error) {
//         console.error("Error loading profile:", error);
//       }
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   const handleUpdate = (field, value) => {
//     if (!isEditing) return;
//     setUserData(prev => ({ ...prev, [field]: value }));
//   };

//   // Base64 conversion instead of Firebase Storage
//   const handleFileSelect = (e) => {
//     if (!isEditing) return;
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result;
//       setUserData(prev => ({ ...prev, photoURL: base64String }));
//       notify.success("Photo selected.");
//     };
//     reader.readAsDataURL(file);
//   };

//   // const toggleAction = async () => {
//   //   if (isEditing) {
//   //     setIsSaving(true);
//   //     try {
//   //       await setDoc(doc(db, "userprofile", auth.currentUser.uid), userData, { merge: true });
//   //       notify.success("Profile saved.");
//   //       setIsEditing(false);
//   //     } catch (e) {
//   //       console.error(e);
//   //       notify.error("Save failed. Please try again.");
//   //     }
//   //     setIsSaving(false);
//   //   } else {
//   //     setIsEditing(true);
//   //   }
//   // };


//   // Update your toggleAction to use showToast:
//   const toggleAction = async () => {
//     if (isEditing) {
//       setIsSaving(true);
//       try {
//         await setDoc(doc(db, "userprofile", auth.currentUser.uid), userData, { merge: true });
//         showToast('success', 'Profile saved.'); // Updated call
//         setIsEditing(false);
//       } catch (e) {
//         showToast('error', 'Save failed. Please try again.'); // Updated call
//       }
//       setIsSaving(false);
//     } else {
//       setIsEditing(true);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="font-body min-h-screen flex items-center justify-center text-[#0F3B39]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-6 h-6 border-2 border-[#0F3B39] border-t-transparent rounded-full animate-spin" />
//           <span className="text-[12px] uppercase tracking-[0.18em] text-[#0F3B39]/60">Loading profile</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="font-body min-h-screen bg-[#f4f3f2] max-w-md mx-auto px-4 py-8 pb-16">
//       <FontImport />

//       {/* ---------------- Header ---------------- */}
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="flex flex-col items-center mb-10"
//       >
//         <div className="relative w-32 h-32">
//           <div className="w-full h-full rounded-[26px] overflow-hidden bg-[#0F3B39]/5 shadow-[0_14px_30px_-10px_rgba(15,59,57,0.35)] ring-4 ring-white">
//             {userData.photoURL ? (
//               <img src={userData.photoURL} className="w-full h-full object-cover" alt="Profile" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-[#EEF3F1]">
//                 <FaUser className="text-[#0F3B39]/20 text-4xl" />
//               </div>
//             )}
//           </div>
//           {isEditing && (
//             <button
//               onClick={() => fileInputRef.current?.click()}
//               className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#0F3B39] flex items-center justify-center text-white shadow-lg ring-4 ring-[#F3F1EA] transition-transform active:scale-95"
//             >
//               <FaCamera size={14} />
//             </button>
//           )}
//           <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
//         </div>

//         <h1 className="font-display mt-5 text-[28px] leading-none text-[#16302C]" style={{ fontWeight: 600 }}>
//           {userData.firstName} {userData.lastName}
//         </h1>

//         <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F3B39] text-[#E7D9A8] font-semibold text-[10px] uppercase tracking-[0.14em]">
//           <FaCheck size={10} /> COP Member
//         </div>
//       </motion.div>

//       {/* ---------------- Personal Details ---------------- */}
//       <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
//         <SectionCard className="mb-6">
//           <SectionEyebrow icon={<FaUser size={11} />}>Personal Details</SectionEyebrow>
//           <div className="space-y-5">
//             <div className="grid grid-cols-2 gap-x-4 gap-y-5">
//               <FieldRow
//                 label="First Name"
//                 disabled={!isEditing}
//                 value={userData.firstName}
//                 onChange={(e) => handleUpdate('firstName', e.target.value)}
//               />
//               <FieldRow
//                 label="Last Name"
//                 disabled={!isEditing}
//                 value={userData.lastName}
//                 onChange={(e) => handleUpdate('lastName', e.target.value)}
//               />
//             </div>
//             <FieldRow
//               label="Email"
//               type="email"
//               disabled={!isEditing}
//               value={userData.email}
//               onChange={(e) => handleUpdate('email', e.target.value)}
//             />
//             <FieldRow
//               label="Phone"
//               type="tel"
//               disabled={!isEditing}
//               value={userData.phone}
//               onChange={(e) => handleUpdate('phone', e.target.value)}
//             />
//             <FieldRow
//               label="Postal Address"
//               disabled={!isEditing}
//               value={userData.postalAddress}
//               onChange={(e) => handleUpdate('postalAddress', e.target.value)}
//             />
//           </div>
//         </SectionCard>
//       </motion.div>

//       {/* ---------------- Membership Card (signature element) ---------------- */}
//       <motion.div
//         initial={{ opacity: 0, y: 14 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.1 }}
//         className="flex flex-col items-center mb-6"
//       >
//         <div className="[perspective:1200px] w-full flex justify-center">
//           <div
//             onClick={() => setFlipped(!flipped)}
//             className={`relative w-full max-w-[320px] h-52 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] ${
//               flipped ? '[transform:rotateY(180deg)]' : ''
//             }`}
//           >
//             {/* FRONT */}
//             <div
//               className="absolute inset-0 rounded-[26px] p-6 text-white shadow-[0_20px_40px_-14px_rgba(15,59,57,0.55)] [backface-visibility:hidden] overflow-hidden"
//               style={{ background: 'linear-gradient(150deg, #0F3B39 0%, #123F3D 55%, #0B2C2A 100%)' }}
//             >
//               {/* faint seal watermark */}
//               <FaChurch className="absolute -right-4 -bottom-6 text-white/[0.06] text-[140px]" />

//               <div className="relative flex justify-between items-start">
//                 <div>
//                   <p className="font-body text-[9px] font-bold uppercase tracking-[0.18em] text-[#D9C68A]">
//                     Membership Card
//                   </p>
//                   <h3 className="font-display mt-1 text-xl" style={{ fontWeight: 600 }}>
//                     {userData.firstName || 'Member'} {userData.lastName}
//                   </h3>
//                 </div>
//                 <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9C68A]/15 text-[#D9C68A]">
//                   <FaChurch size={14} />
//                 </span>
//               </div>

//               <div className="relative mt-10 flex items-end justify-between">
//                 <div>
//                   <p className="font-body text-[9px] text-[#D9C68A]/80 uppercase tracking-[0.14em]">Department</p>
//                   <p className="font-semibold text-sm mt-0.5">{userData.department || 'Unassigned'}</p>
//                 </div>
//                 <p className="font-body text-[9px] text-white/40 uppercase tracking-[0.1em]">Tap to flip</p>
//               </div>
//             </div>

//             {/* BACK */}
//             <div
//               className="absolute inset-0 rounded-[26px] p-6 text-white shadow-[0_20px_40px_-14px_rgba(15,59,57,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center text-center"
//               style={{ background: 'linear-gradient(150deg, #0F3B39 0%, #123F3D 55%, #0B2C2A 100%)' }}
//             >
//               <h3 className="font-body font-bold text-[11px] uppercase tracking-[0.18em] mb-3 text-[#D9C68A]">
//                 My Covenant
//               </h3>
//               <p className="font-display text-[13px] leading-relaxed italic" style={{ fontWeight: 500 }}>
//                 "I commit to walk in faith, to serve with love, and to uphold the fellowship of this church in all my actions."
//               </p>
//               <div className="w-10 h-px bg-[#D9C68A]/50 my-4" />
//               <p className="font-body text-[9px] font-semibold tracking-wide text-white/85 max-w-[220px]">
//                 It is incredibly comforting and reminds members that their life in the church is part of a larger, positive divine design.
//               </p>
//               <p className="font-body text-[8px] text-[#D9C68A]/70 mt-1.5 uppercase tracking-[0.12em] mt-6">Jeremiah 29:11</p>
//               <p className="font-body absolute bottom-4 text-[8px] text-white/40 uppercase tracking-[0.1em] ">
//                 Member since {userData.joinedDate ? new Date(userData.joinedDate).getFullYear() : '—'}
//               </p>
//             </div>
//           </div>
//         </div>
//         <p className="mt-4 text-[11px] text-[#0F3B39]/40 italic">Tap the card to view your covenant</p>
//       </motion.div>

//       {/* ---------------- Church Life ---------------- */}
//       <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
//         <SectionCard className="mb-6">
//           <SectionEyebrow icon={<FaSeedling size={11} />}>Church Life</SectionEyebrow>

//           <div className="space-y-7">
//             <div>
//               <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0F3B39]/45 mb-2.5">
//                 Age Group
//               </label>
//               <div className="flex gap-3">
//                 {['youth', 'adult'].map((group) => (
//                   <PillToggle
//                     key={group}
//                     active={userData.ageGroup === group}
//                     disabled={!isEditing}
//                     onClick={() => handleUpdate('ageGroup', group)}
//                   >
//                     {group.charAt(0).toUpperCase() + group.slice(1)}
//                   </PillToggle>    
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0F3B39]/45 mb-2.5">
//                 Baptized
//               </label>
//               <div className="flex gap-3">
//                 {['yes', 'no'].map((status) => (
//                   <PillToggle
//                     key={status}
//                     active={userData.baptized === status}
//                     disabled={!isEditing}
//                     onClick={() => handleUpdate('baptized', status)}
//                   >
//                     {status === 'yes' ? 'Yes' : 'No'}
//                   </PillToggle>
//                 ))}
//               </div>
//               {userData.baptized === 'no' && (
//                 <p className="mt-3 text-[11px] text-[#B3261E] font-medium italic">
//                   Please reach out to the church office for baptism arrangements.
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0F3B39]/45 mb-2.5">
//                 Department
//               </label>
//               <div className="grid grid-cols-2 gap-2.5">
//                 {['Worship Team', 'Ushers', 'Media', 'Sunday School', 'Technical', 'Sanitary', 'None'].map((dept) => {
//                   const active = userData.department === dept;
//                   return (
//                     <button
//                       key={dept}
//                       type="button"
//                       disabled={!isEditing}
//                       onClick={() => handleUpdate('department', dept)}
//                       className={`rounded-xl border py-2.5 px-3 text-[12px] font-semibold transition-all ${
//                         active
//                           ? 'border-[#0F3B39] bg-[#0F3B39] text-white shadow-sm'
//                           : 'border-[#0F3B39]/12 bg-white text-[#16302C]/60 hover:border-[#0F3B39]/25'
//                       } disabled:cursor-default`}
//                     >
//                       {dept}
//                     </button>
//                   );
//                 })}
//               </div>

//               {userData.department === 'None' && (
//                 <p className="mt-4 text-[11px] text-[#B3261E] font-medium italic">
//                   Please look forward to working for God.
//                 </p>
//               )}
//               {userData.department && userData.department !== 'None' && (
//                 <p className="mt-4 text-[11px] text-[#1B6E6A] font-medium italic">
//                   Thank you for serving in the {userData.department} department!
//                 </p>
//               )}
//             </div>

//             <FieldRow
//               label="Joined Date"
//               type="date"
//               disabled={!isEditing}
//               value={userData.joinedDate}
//               onChange={(e) => handleUpdate('joinedDate', e.target.value)}
//             />
//           </div>
//         </SectionCard>
//       </motion.div>

//       {/* ---------------- Save / Edit ---------------- */}
//       <motion.button
//         initial={{ opacity: 0, y: 14 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.2 }}
//         onClick={toggleAction}
//         disabled={isSaving}
//         className="w-full mt-2 bg-[#0F3B39] text-white py-4 rounded-2xl font-semibold text-[14px] tracking-wide shadow-[0_14px_28px_-12px_rgba(15,59,57,0.5)] flex items-center justify-center transition-all active:scale-[0.99] disabled:opacity-80"
//       >
//         {isSaving ? <Spinner /> : isEditing ? 'Save Changes' : 'Edit Profile'}
//       </motion.button>


//       <AnimatePresence>
//         {toast && <Toast toast={toast} />}
//       </AnimatePresence>

      
//     </div>
//   );
// };

// export default ProfilePage;










import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaCamera,
  FaCheck,
  FaCheckCircle,
  FaExclamationCircle,
  FaChurch,
  FaSeedling,
} from 'react-icons/fa';
import { useTheme } from '../../Context/ThemeContext';
const FontImport = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Fraunces', serif; font-feature-settings: 'ss01' 1; }
    .font-body { font-family: 'Inter', sans-serif; }
  `}</style>
);


// const ToastNotice = ({ tone, message }) => {
//   const isSuccess = tone === 'success';
//   return (
//     <div className="font-body flex items-center gap-3 py-1">
//       <span
//         className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
//           isSuccess ? 'bg-[#B8902F]/15 text-[#8A6B20]' : 'bg-[#B3261E]/10 text-[#B3261E]'
//         }`}
//       >
//         {isSuccess ? <FaCheckCircle size={15} /> : <FaExclamationCircle size={15} />}
//       </span>
//       <div className="min-w-0">
//         <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0F3B39]/50">
//           {isSuccess ? 'Saved' : 'Action needed'}
//         </p>
//         <p className="text-[13px] font-semibold text-[#16302C] leading-snug">{message}</p>
//       </div>
//     </div>
//   );
// };


// Replace your existing ToastNotice with this one from AdminProfilePage
const Toast = ({ toast }) => {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 z-[100] flex min-w-[280px] -translate-x-1/2 items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-[13px] font-medium text-white shadow-2xl"
    >
      {isError ? <FaExclamationCircle size={16} className="text-rose-500" /> : <FaCheckCircle size={16} className="text-emerald-500" />}
      <span className="flex-1">{toast.message}</span>
      <div className={`absolute bottom-0 left-0 h-1 w-full rounded-b-lg ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
    </motion.div>
  );
};

const notify = {
  success: (message) =>
    toast(<ToastNotice tone="success" message={message} />, {
      icon: false,
      className: '!rounded-2xl !bg-[#FAF6EE] !p-3.5 !shadow-[0_12px_30px_-10px_rgba(15,59,57,0.35)] !border !border-[#0F3B39]/10',
      progressClassName: '!bg-[#B8902F]',
      bodyClassName: '!p-0 !m-0',
    }),
  error: (message) =>
    toast(<ToastNotice tone="error" message={message} />, {
      icon: false,
      className: '!rounded-2xl !bg-[#FAF6EE] !p-3.5 !shadow-[0_12px_30px_-10px_rgba(179,38,30,0.35)] !border !border-[#B3261E]/15',
      progressClassName: '!bg-[#B3261E]',
      bodyClassName: '!p-0 !m-0',
    }),
};

/* ------------------------------------------------------------------ */
/*  Small shared UI — theme-aware versions of the cream/gold styling   */
/* ------------------------------------------------------------------ */

const SectionCard = ({ children, className = '' }) => {
  const { theme, themeKey } = useTheme();
  return (
    <div
      className={`rounded-[28px] border shadow-[0_2px_24px_-8px_rgba(15,59,57,0.10)] p-6 transition-colors ${
        themeKey === 'dark' ? 'border-white/10 bg-slate-900' : 'bg-transparent border-[#0F3B39]/8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SectionEyebrow = ({ icon, children }) => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F3B39] text-[#D9C68A]">
        {icon}
      </span>
      <span className={`font-body text-[11px] font-bold uppercase tracking-[0.18em] ${theme.heading}`}>
        {children}
      </span>
    </div>
  );
};

const FieldRow = ({ label, value, disabled, onChange, type = 'text' }) => {
  const { theme, themeKey } = useTheme();
  return (
    <div>
      <label className={`font-body block text-[10px] font-semibold uppercase tracking-[0.12em] mb-1.5 ${theme.subText}`}>
        {label}
      </label>
      <input
        type={type}
        disabled={disabled}
        value={value || ''}
        onChange={onChange}
        className={`font-body w-full border-b bg-transparent py-1.5 text-[15px] outline-none transition-colors focus:border-[#B8902F] disabled:opacity-70 ${
          themeKey === 'dark' ? 'border-white/15' : 'border-[#0F3B39]/15'
        } ${theme.text}`}
      />
    </div>
  );
};

const PillToggle = ({ active, disabled, onClick, children }) => {
  const { theme, themeKey } = useTheme();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`font-body flex-1 rounded-xl border py-2.5 text-[13px] font-semibold transition-all ${
        active
          ? 'border-[#0F3B39] bg-[#0F3B39] text-white shadow-sm'
          : `${themeKey === 'dark' ? 'border-white/12 bg-slate-800 hover:border-white/25' : 'border-[#0F3B39]/12 bg-white hover:border-[#0F3B39]/25'} ${theme.subText}`
      } disabled:cursor-default`}
    >
      {children}
    </button>
  );
};

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const ProfilePage = () => {
  const { theme, themeKey } = useTheme();
  const [userData, setUserData] = useState({
    firstName: '', lastName: '', email: '', phone: '', postalAddress: '',
    ageGroup: '', joinedDate: '', baptized: '', department: '', photoURL: ''
  });
  const [loading, setLoading] = useState(true); // For the initial data fetch
  const [isSaving, setIsSaving] = useState(false); // New state for the button
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useState(null); // Add this state
  
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;

      try {
        const docSnap = await getDoc(doc(db, "userprofile", auth.currentUser.uid));

        const authInfo = {
          email: auth.currentUser.email || '',
          firstName: auth.currentUser.displayName?.split(' ')[0] || '',
          lastName: auth.currentUser.displayName?.split(' ')[1] || ''
        };

        if (docSnap.exists()) {
          setUserData({ ...authInfo, ...docSnap.data() });
        } else {
          setUserData(prev => ({ ...prev, ...authInfo }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdate = (field, value) => {
    if (!isEditing) return;
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  // Base64 conversion instead of Firebase Storage
  const handleFileSelect = (e) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setUserData(prev => ({ ...prev, photoURL: base64String }));
      notify.success("Photo selected.");
    };
    reader.readAsDataURL(file);
  };

  // const toggleAction = async () => {
  //   if (isEditing) {
  //     setIsSaving(true);
  //     try {
  //       await setDoc(doc(db, "userprofile", auth.currentUser.uid), userData, { merge: true });
  //       notify.success("Profile saved.");
  //       setIsEditing(false);
  //     } catch (e) {
  //       console.error(e);
  //       notify.error("Save failed. Please try again.");
  //     }
  //     setIsSaving(false);
  //   } else {
  //     setIsEditing(true);
  //   }
  // };


  // Update your toggleAction to use showToast:
  const toggleAction = async () => {
    if (isEditing) {
      setIsSaving(true);
      try {
        await setDoc(doc(db, "userprofile", auth.currentUser.uid), userData, { merge: true });
        showToast('success', 'Profile saved.'); // Updated call
        setIsEditing(false);
      } catch (e) {
        showToast('error', 'Save failed. Please try again.'); // Updated call
      }
      setIsSaving(false);
    } else {
      setIsEditing(true);
    }
  };

  if (loading) {
    return (
      <div className={`font-body min-h-screen flex items-center justify-center transition-colors ${theme.pageBg} ${theme.heading}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#0F3B39] border-t-transparent rounded-full animate-spin" />
          <span className={`text-[12px] uppercase tracking-[0.18em] ${theme.subText}`}>Loading profile</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-body min-h-screen max-w-md mx-auto px-4 py-8 pb-16 transition-colors ${theme.pageBg}`}>
      <FontImport />

      {/* ---------------- Header ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center mb-10"
      >
        <div className="relative w-32 h-32">
          <div className="w-full h-full rounded-[26px] overflow-hidden bg-[#0F3B39]/5 shadow-[0_14px_30px_-10px_rgba(15,59,57,0.35)] ring-4 ring-white">
            {userData.photoURL ? (
              <img src={userData.photoURL} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#EEF3F1]">
                <FaUser className="text-[#0F3B39]/20 text-4xl" />
              </div>
            )}
          </div>
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-[#0F3B39] flex items-center justify-center text-white shadow-lg ring-4 ring-[#F3F1EA] transition-transform active:scale-95"
            >
              <FaCamera size={14} />
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>

        <h1 className={`font-display mt-5 text-[28px] leading-none ${theme.heading}`} style={{ fontWeight: 600 }}>
          {userData.firstName} {userData.lastName}
        </h1>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F3B39] text-[#E7D9A8] font-semibold text-[10px] uppercase tracking-[0.14em]">
          <FaCheck size={10} /> COP Member
        </div>
      </motion.div>

      {/* ---------------- Personal Details ---------------- */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <SectionCard className="mb-6">
          <SectionEyebrow icon={<FaUser size={11} />}>Personal Details</SectionEyebrow>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-5">
              <FieldRow
                label="First Name"
                disabled={!isEditing}
                value={userData.firstName}
                onChange={(e) => handleUpdate('firstName', e.target.value)}
              />
              <FieldRow
                label="Last Name"
                disabled={!isEditing}
                value={userData.lastName}
                onChange={(e) => handleUpdate('lastName', e.target.value)}
              />
            </div>
            <FieldRow
              label="Email"
              type="email"
              disabled={!isEditing}
              value={userData.email}
              onChange={(e) => handleUpdate('email', e.target.value)}
            />
            <FieldRow
              label="Phone"
              type="tel"
              disabled={!isEditing}
              value={userData.phone}
              onChange={(e) => handleUpdate('phone', e.target.value)}
            />
            <FieldRow
              label="Postal Address"
              disabled={!isEditing}
              value={userData.postalAddress}
              onChange={(e) => handleUpdate('postalAddress', e.target.value)}
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* ---------------- Membership Card (signature element — stays the same
           rich dark-teal/gold card in every theme, it's a branded artifact) --- */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center mb-6"
      >
        <div className="[perspective:1200px] w-full flex justify-center">
          <div
            onClick={() => setFlipped(!flipped)}
            className={`relative w-full max-w-[320px] h-52 cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] ${
              flipped ? '[transform:rotateY(180deg)]' : ''
            }`}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 rounded-[26px] p-6 text-white shadow-[0_20px_40px_-14px_rgba(15,59,57,0.55)] [backface-visibility:hidden] overflow-hidden"
              style={{ background: 'linear-gradient(150deg, #0F3B39 0%, #123F3D 55%, #0B2C2A 100%)' }}
            >
              {/* faint seal watermark */}
              <FaChurch className="absolute -right-4 -bottom-6 text-white/[0.06] text-[140px]" />

              <div className="relative flex justify-between items-start">
                <div>
                  <p className="font-body text-[9px] font-bold uppercase tracking-[0.18em] text-[#D9C68A]">
                    Membership Card
                  </p>
                  <h3 className="font-display mt-1 text-xl" style={{ fontWeight: 600 }}>
                    {userData.firstName || 'Member'} {userData.lastName}
                  </h3>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9C68A]/15 text-[#D9C68A]">
                  <FaChurch size={14} />
                </span>
              </div>

              <div className="relative mt-10 flex items-end justify-between">
                <div>
                  <p className="font-body text-[9px] text-[#D9C68A]/80 uppercase tracking-[0.14em]">Department</p>
                  <p className="font-semibold text-sm mt-0.5">{userData.department || 'Unassigned'}</p>
                </div>
                <p className="font-body text-[9px] text-white/40 uppercase tracking-[0.1em]">Tap to flip</p>
              </div>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 rounded-[26px] p-6 text-white shadow-[0_20px_40px_-14px_rgba(15,59,57,0.55)] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col items-center justify-center text-center"
              style={{ background: 'linear-gradient(150deg, #0F3B39 0%, #123F3D 55%, #0B2C2A 100%)' }}
            >
              <h3 className="font-body font-bold text-[11px] uppercase tracking-[0.18em] mb-3 text-[#D9C68A]">
                My Covenant
              </h3>
              <p className="font-display text-[13px] leading-relaxed italic" style={{ fontWeight: 500 }}>
                "I commit to walk in faith, to serve with love, and to uphold the fellowship of this church in all my actions."
              </p>
              <div className="w-10 h-px bg-[#D9C68A]/50 my-4" />
              <p className="font-body text-[9px] font-semibold tracking-wide text-white/85 max-w-[220px]">
                It is incredibly comforting and reminds members that their life in the church is part of a larger, positive divine design.
              </p>
              <p className="font-body text-[8px] text-[#D9C68A]/70 mt-1.5 uppercase tracking-[0.12em] mt-6">Jeremiah 29:11</p>
              <p className="font-body absolute bottom-4 text-[8px] text-white/40 uppercase tracking-[0.1em] ">
                Member since {userData.joinedDate ? new Date(userData.joinedDate).getFullYear() : '—'}
              </p>
            </div>
          </div>
        </div>
        <p className={`mt-4 text-[11px] italic ${theme.subText}`}>Tap the card to view your covenant</p>
      </motion.div>

      {/* ---------------- Church Life ---------------- */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <SectionCard className="mb-6">
          <SectionEyebrow icon={<FaSeedling size={11} />}>Church Life</SectionEyebrow>

          <div className="space-y-7">
            <div>
              <label className={`block text-[10px] font-semibold uppercase tracking-[0.12em] mb-2.5 ${theme.subText}`}>
                Age Group
              </label>
              <div className="flex gap-3">
                {['youth', 'adult'].map((group) => (
                  <PillToggle
                    key={group}
                    active={userData.ageGroup === group}
                    disabled={!isEditing}
                    onClick={() => handleUpdate('ageGroup', group)}
                  >
                    {group.charAt(0).toUpperCase() + group.slice(1)}
                  </PillToggle>    
                ))}
              </div>
            </div>

            <div>
              <label className={`block text-[10px] font-semibold uppercase tracking-[0.12em] mb-2.5 ${theme.subText}`}>
                Baptized
              </label>
              <div className="flex gap-3">
                {['yes', 'no'].map((status) => (
                  <PillToggle
                    key={status}
                    active={userData.baptized === status}
                    disabled={!isEditing}
                    onClick={() => handleUpdate('baptized', status)}
                  >
                    {status === 'yes' ? 'Yes' : 'No'}
                  </PillToggle>
                ))}
              </div>
              {userData.baptized === 'no' && (
                <p className="mt-3 text-[11px] text-[#B3261E] font-medium italic">
                  Please reach out to the church office for baptism arrangements.
                </p>
              )}
            </div>

            <div>
              <label className={`block text-[10px] font-semibold uppercase tracking-[0.12em] mb-2.5 ${theme.subText}`}>
                Department
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {['Worship Team', 'Ushers', 'Media', 'Sunday School', 'Technical', 'Sanitary', 'None'].map((dept) => {
                  const active = userData.department === dept;
                  return (
                    <button
                      key={dept}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => handleUpdate('department', dept)}
                      className={`rounded-xl border py-2.5 px-3 text-[12px] font-semibold transition-all ${
                        active
                          ? 'border-[#0F3B39] bg-[#0F3B39] text-white shadow-sm'
                          : `${themeKey === 'dark' ? 'border-white/12 bg-slate-800' : 'border-[#0F3B39]/12 bg-white'} ${theme.subText}`
                      } disabled:cursor-default`}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>

              {userData.department === 'None' && (
                <p className="mt-4 text-[11px] text-[#B3261E] font-medium italic">
                  Please look forward to working for God.
                </p>
              )}
              {userData.department && userData.department !== 'None' && (
                <p className="mt-4 text-[11px] text-[#1B6E6A] font-medium italic">
                  Thank you for serving in the {userData.department} department!
                </p>
              )}
            </div>

            <FieldRow
              label="Joined Date"
              type="date"
              disabled={!isEditing}
              value={userData.joinedDate}
              onChange={(e) => handleUpdate('joinedDate', e.target.value)}
            />
          </div>
        </SectionCard>
      </motion.div>

      {/* ---------------- Save / Edit ---------------- */}
      <motion.button
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onClick={toggleAction}
        disabled={isSaving}
        className="w-full mt-2 bg-[#0F3B39] text-white py-4 rounded-2xl font-semibold text-[14px] tracking-wide shadow-[0_14px_28px_-12px_rgba(15,59,57,0.5)] flex items-center justify-center transition-all active:scale-[0.99] disabled:opacity-80"
      >
        {isSaving ? <Spinner /> : isEditing ? 'Save Changes' : 'Edit Profile'}
      </motion.button>


      <AnimatePresence>
        {toast && <Toast toast={toast} />}
      </AnimatePresence>

      
    </div>
  );
};

export default ProfilePage;



