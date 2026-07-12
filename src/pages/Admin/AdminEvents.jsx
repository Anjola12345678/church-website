import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { FaUpload, FaInfoCircle, FaCalendarPlus } from 'react-icons/fa';
import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import emailjs from '@emailjs/browser'; // 1. Add this import
const resizeAndEncodeImage = (file, maxWidth = 1000, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Could not read image dimensions.'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
};

const estimateBase64Bytes = (base64String) => Math.round((base64String.length * 3) / 4);

const AdminEvents = () => {
  const [locationType, setLocationType] = useState('physical');
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const [form, setForm] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  const [imageDataUrl, setImageDataUrl] = useState('');
  const [processingImage, setProcessingImage] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const processFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      showToast('error', '📷 Please select a valid image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('error', '📷 Image is too large. Please choose one under 10MB.');
      return;
    }

    setProcessingImage(true);
    try {
      const dataUrl = await resizeAndEncodeImage(file, 1000, 0.7);
      const estimatedBytes = estimateBase64Bytes(dataUrl);

      if (estimatedBytes > 700 * 1024) {
        showToast('error', '📷 Image is still too large after compression. Try a smaller or simpler image.');
        setProcessingImage(false);
        return;
      }

      setImageDataUrl(dataUrl);
    } catch (err) {
      console.error('Image processing error:', err);
      showToast('error', '⚠️ Could not process that image. Please try a different file.');
    } finally {
      setProcessingImage(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const validate = () => {
    if (!form.title.trim()) {
      showToast('error', '📝 Please enter an event title.');
      return false;
    }
    if (!form.date) {
      showToast('error', '📅 Please select an event date.');
      return false;
    }
    if (!form.startTime) {
      showToast('error', '⏰ Please select a start time.');
      return false;
    }
    if (!form.location.trim()) {
      showToast('error', locationType === 'physical' ? '📍 Please enter the venue address.' : '🔗 Please enter the meeting link.');
      return false;
    }
    if (!form.description.trim()) {
      showToast('error', '🖊️ Please add event details.');
      return false;
    }
    return true;
  };

const handlePost = async () => {
    if (!validate()) return;

    if (!auth.currentUser) {
      showToast('error', '🔒 You must be signed in as admin to post an event.');
      return;
    }

    setPosting(true);
    
    try {
      // 1. Prepare formatted date for the email
      const formattedDate = new Date(form.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // 2. Prepare the date object for Firebase
      const eventDateObj = new Date(`${form.date}T${form.startTime || '00:00'}`);

      // 3. Save ALL fields to Firebase
      await addDoc(collection(db, 'events'), {
        title: form.title.trim(),
        eventType: 'EVENT',
        locationType: locationType,
        eventDate: Timestamp.fromDate(eventDateObj),
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location.trim(),
        description: form.description.trim(),
        imageURL: imageDataUrl,
        createdAt: serverTimestamp(),
      });

      // 4. Send Email
      await emailjs.send(
        'service_jogxx28', 
        'template_a43krni', 
        {
          event_title: form.title.trim(),
          event_date: formattedDate,
          location: form.location.trim(),
          description: form.description.trim()
        }, 
        'uk3AiPwRQ59XIPpbX'
      );

      // 5. Success feedback
      showToast('success', '🎉 Event published and members notified!');

      // 6. Reset form
      setForm({ title: '', date: '', startTime: '', endTime: '', location: '', description: '' });
      setImageDataUrl('');
      setLocationType('physical');
      
    } catch (err) {
      console.error('Failed to post event:', err);
      showToast('error', '⚠️ Could not publish event. Please try again.');
    } finally {
      setPosting(false);
    }
  };


  

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 bg-gray-50">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 z-[100] flex min-w-[280px] -translate-x-1/2 items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-[13px] font-medium text-white shadow-2xl"
          >
            {toast.type === 'error' ? (
              <AlertCircle size={16} className="text-rose-500" />
            ) : (
              <CheckCircle2 size={16} className="text-emerald-500" />
            )}
            <span className="flex-1">{toast.message}</span>
            <div className={`absolute bottom-0 left-0 h-1 w-full rounded-b-lg ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0F3B39]">Post New Church Event</h1>
        <p className="text-sm text-gray-600">Fill out the details below to publish a new event to the community calendar.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Topic / Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              placeholder="e.g., Annual Spring Fellowship"
              className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-[#0F3B39]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={handleChange('date')}
                className="w-full border border-gray-200 rounded-lg p-3 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={handleChange('startTime')}
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={handleChange('endTime')}
                  className="w-full border border-gray-200 rounded-lg p-3 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Location Type</label>
            <div className="flex gap-6 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loc"
                  checked={locationType === 'physical'}
                  onChange={() => setLocationType('physical')}
                  className="accent-[#0F3B39]"
                />
                <span className="text-sm">Physical Venue</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="loc"
                  checked={locationType === 'online'}
                  onChange={() => setLocationType('online')}
                  className="accent-[#0F3B39]"
                />
                <span className="text-sm">Online Stream</span>
              </label>
            </div>
            <input
              type="text"
              value={form.location}
              onChange={handleChange('location')}
              placeholder={locationType === 'physical' ? 'Venue Address' : 'Meeting Link'}
              className="w-full border border-gray-200 rounded-lg p-3 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Details</label>
            <textarea
              rows="5"
              value={form.description}
              onChange={handleChange('description')}
              placeholder="Describe the purpose, agenda, and what participants should bring..."
              className="w-full border border-gray-200 rounded-lg p-3 outline-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-4">Theme Image</label>
        <div
          onClick={handleImageClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#0F3B39] transition-colors cursor-pointer mb-6 overflow-hidden"
        >
          {processingImage ? (
            <div className="flex flex-col items-center gap-2">
              <span className="w-6 h-6 border-2 border-[#0F3B39] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Compressing image…</p>
            </div>
          ) : imageDataUrl ? (
            <img src={imageDataUrl} alt="Event theme preview" className="mx-auto max-h-48 rounded-lg object-cover" />
          ) : (
            <>
              <FaUpload className="mx-auto text-gray-400 text-2xl mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to upload or drag & drop</p>
              <p className="text-[10px] text-gray-400 mt-1">RECOMMENDED: 1600x900px · Auto-compressed for storage</p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          onClick={handlePost}
          disabled={posting || processingImage}
          className="w-full bg-[#0F3B39] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-[#1a4a47] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {posting ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <FaCalendarPlus /> Post Event
            </>
          )}
        </button>
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 flex gap-3">
        <FaInfoCircle className="text-teal-600 mt-1 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-teal-900">Preview Tips</h4>
          <p className="text-xs text-teal-800">Events appear on the public 'Home' and 'Events' tabs immediately after posting. Ensure your theme image is clear and inviting.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;