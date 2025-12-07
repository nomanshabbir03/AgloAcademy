import React from 'react';

const FloatingWhatsAppButton = () => {
  const whatsappNumber = '923061380308';
  const prefilledMessage = encodeURIComponent("Hi, I'd like to know more about your courses.");
  const chatUrl = `https://wa.me/${whatsappNumber}?text=${prefilledMessage}`;

  return (
    <a
      href={chatUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-[9990] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366]"
    >
      <span className="sr-only">Open WhatsApp chat</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="16" fill="#25D366" />
        <path
          fill="#ffffff"
          d="M16 8.5a7.5 7.5 0 0 0-6.4 11.3L9 24l4.3-1.3A7.5 7.5 0 1 0 16 8.5zm0 1.8a5.7 5.7 0 0 1 5.7 5.7 5.6 5.6 0 0 1-5.7 5.6 5.8 5.8 0 0 1-2.7-.7l-.2-.1-2.6.8.8-2.5-.2-.3a5.6 5.6 0 0 1-.9-3A5.7 5.7 0 0 1 16 10.3zm3 6.4c-.2-.1-1.1-.6-1.2-.7s-.3-.1-.4.1-.5.7-.6.8-.2.2-.4.1a4.6 4.6 0 0 1-2.2-1.8c-.2-.3.2-.3.4-.9s0-.6 0-.7-.4-1-0.6-1.5-.3-.4-.5-.4h-.4a.8.8 0 0 0-.6.3 2.7 2.7 0 0 0-.8 2 4.6 4.6 0 0 0 .9 2.4 8.1 8.1 0 0 0 3.5 3 7 7 0 0 0 1.7.5 4 4 0 0 0 1.9-.1 2.4 2.4 0 0 0 1.3-1 .9.9 0 0 0 .1-.9c0-.2-.2-.2-.4-.3z"
        />
      </svg>
    </a>
  );
};

export default FloatingWhatsAppButton;
