const subscribe = (eventName, callback) => {
  const event = document.addEventListener(eventName, callback);
  return () => document.removeEventListener(eventName, event);
};

const emit = (eventName, data) => {
  document.dispatchEvent(new CustomEvent(eventName, { detail: data }));
}

const EventEmitter = {
  subscribe,
  emit,
};

export default EventEmitter;