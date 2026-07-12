// 1. Add these states to your component
const [toast, setToast] = useState(null);

// 2. Define the showToast function
const showToast = (type, message) => {
  setToast({ type, message });
  // Auto-hide after 3 seconds
  setTimeout(() => setToast(null), 3000);
};

// 3. Use it in your code like this:
// Instead of toast.error('Error message')
showToast('error', 'Please enter an event title.');

// Instead of toast.success('Success message')
showToast('success', 'Event published successfully!');