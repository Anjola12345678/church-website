import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { FaUserShield, FaCamera, FaCheckCircle, FaUsersCog, FaChurch, FaDatabase } from 'react-icons/fa';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/* --- Custom Toast Component --- */
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
      {isError ? <AlertCircle size={16} className="text-rose-500" /> : <CheckCircle2 size={16} className="text-emerald-500" />}
      <span className="flex-1">{toast.message}</span>
      <div className={`absolute bottom-0 left-0 h-1 w-full rounded-b-lg ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
    </motion.div>
  );
};

const AdminProfilePage = () => {
  const [adminData, setAdminData] = useState({
    firstName: '', lastName: '', email: '', phone: '', postalAddress: '',
    ageGroup: '', baptized: '', department: '', photoURL: '', joinedDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!auth.currentUser) return;
      try {
        const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (docSnap.exists()) {
          setAdminData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (error) {
        showToast('error', 'Error loading admin data.');
      }
      setLoading(false);
    };
    fetchAdminData();
  }, []);

  const handleUpdate = (field, value) => {
    if (!isEditing) return;
    setAdminData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAdminData(prev => ({ ...prev, photoURL: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const toggleAction = async () => {
    if (isEditing) {
      setIsSaving(true);
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), adminData, { merge: true });
        showToast('success', 'Admin profile updated!');
        setIsEditing(false);
      } catch (e) {
        showToast('error', 'Save failed. Please try again.');
      }
      setIsSaving(false);
    } else {
      setIsEditing(true);
    }
  };

  if (loading) return <div className="p-10 text-center text-[#0F3B39]">Loading admin portal...</div>;

  return (
    <div className="min-h-screen max-w-md mx-auto py-6 px-4 bg-gray-50">
      <AnimatePresence>
        {toast && <Toast toast={toast} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-36 h-36">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-[#0F3B39]">
            {adminData.photoURL ? (
              <img src={adminData.photoURL} className="w-full h-full object-cover" alt="Admin" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0F3B39] text-white">
                <FaUserShield size={60} />
              </div>
            )}
          </div>
          {isEditing && (
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
              <FaCamera size={16} />
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
        <h2 className="mt-4 text-[22px] font-bold text-[#0F3B39]">{adminData.firstName} {adminData.lastName}</h2>
        <div className="mt-2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
          <FaCheckCircle /> <span>System Administrator</span>
        </div>
      </div>

      {/* Admin Identity */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-5 text-[#0F3B39] font-bold"><FaUsersCog /> Admin Identity</div>
        <div className="space-y-4">
          {['firstName', 'lastName', 'email', 'phone', 'postalAddress'].map(field => (
            <div key={field}>
              <label className="text-[9px] text-gray-400 uppercase">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input disabled={!isEditing} value={adminData[field] || ''} onChange={(e) => handleUpdate(field, e.target.value)} className="w-full border-b py-1 outline-none focus:border-[#0F3B39]" />
            </div>
          ))}
        </div>
      </div>

      {/* 3D Admin Card - CSS classes need to be supported by your tailwind config */}
      <div className="flex flex-col items-center mb-10 [perspective:1000px]">
        <div onClick={() => setFlipped(!flipped)} className={`relative w-full h-48 transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          <div className="absolute w-full h-full bg-gradient-to-br from-[#0F3B39] via-[#0A2A28] to-[#1a4a47] rounded-3xl p-6 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] [backface-visibility:hidden] [transform-style:preserve-3d] border border-amber-500/30 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <h2 className="text-xl font-bold tracking-tight">ADMINISTRATOR</h2>
                <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">System Command</p>
              </div>
              <div className="p-2 bg-amber-500/20 rounded-xl"><FaUserShield className="text-amber-400 text-2xl" /></div>
            </div>
            <div className="mt-10 relative z-10">
              <p className="text-[9px] text-teal-300 uppercase tracking-widest">Clearance Level</p>
              <p className="font-bold text-lg text-white">LEVEL OMEGA</p>
            </div>
          </div>
          <div className="absolute w-full h-full bg-[#0F3B39] text-white rounded-3xl p-6 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] [transform-style:preserve-3d] border-2 border-amber-500 flex flex-col items-center justify-center text-center">
            <FaDatabase className="text-amber-500 text-3xl mb-4" />
            <h3 className="font-bold text-sm uppercase tracking-widest mb-2 text-amber-500">System Oversight</h3>
            <p className="text-[11px] font-medium leading-relaxed italic px-2">"Absolute administrative control over all records. Accountability is the foundation of authority."</p>
          </div>
        </div>
        <p className="mt-4 text-[10px] text-gray-400 italic">Tap to authenticate system status</p>
      </div>

      {/* Church Life */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-6 text-[#1B6E6A] font-semibold"><FaChurch /> Church Life</div>
        <div className="space-y-8">
          <div>
            <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-3">Age Group</label>
            <div className="flex gap-4">
              {['youth', 'adult'].map((group) => (
                <button key={group} disabled={!isEditing} onClick={() => handleUpdate('ageGroup', group)} className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${adminData.ageGroup === group ? 'bg-amber-700 text-white border-amber-700' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{group.charAt(0).toUpperCase() + group.slice(1)}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-3">Baptized</label>
            <div className="flex gap-4">
              {['yes', 'no'].map((status) => (
                <button key={status} disabled={!isEditing} onClick={() => handleUpdate('baptized', status)} className={`flex-1 py-2 rounded-lg border text-sm font-semibold transition-all ${adminData.baptized === status ? 'bg-amber-700 text-white border-amber-700' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{status === 'yes' ? 'Yes' : 'No'}</button>
              ))}
            </div>
            {adminData.baptized === 'no' && <p className="mt-3 text-[11px] text-red-600 font-medium italic">Please reach out to the church office for baptism arrangements.</p>}
          </div>
          <div>
            <label className="text-[10px] text-gray-600 uppercase tracking-wider block mb-3">Department</label>
            <div className="grid grid-cols-2 gap-3">
              {['Worship Team', 'Ushers', 'Media', 'Sunday School', 'Technical', 'Sanitary', 'None'].map((dept) => (
                <button key={dept} disabled={!isEditing} onClick={() => handleUpdate('department', dept)} className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${adminData.department === dept ? 'bg-amber-700 text-white border-amber-700' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{dept}</button>
              ))}
            </div>
            {adminData.department === 'None' && <p className="mt-4 text-[11px] text-red-700 font-medium italic">Please look forward to working for God.</p>}
            {adminData.department && adminData.department !== 'None' && <p className="mt-4 text-[11px] text-teal-700 font-medium italic">Thank you for serving in the {adminData.department} department!</p>}
          </div>
        </div>
      </div>

      <button onClick={toggleAction} disabled={isSaving} className="w-full bg-[#0F3B39] text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all mb-10 gap-2">
        {isSaving ? <Loader2 className="animate-spin" /> : isEditing ? "Save Admin Changes" : "Edit Admin Profile"}
      </button>
    </div>
  );
};

export default AdminProfilePage;