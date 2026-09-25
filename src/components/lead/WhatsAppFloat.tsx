import { whatsappLink, hasWhatsApp } from "@/config/site";

/** Floating WhatsApp button, the #1 contact channel for UAE parents. */
export function WhatsAppFloat() {
  const href = whatsappLink("Hi Universal Blooming! I'd like to know more about admissions for my child.");
  return (
    <a
      href={href}
      data-cta="float-whatsapp"
      aria-label={hasWhatsApp ? "Chat with us on WhatsApp" : "Contact us"}
      className="no-print group fixed bottom-4 right-4 z-40 flex h-14 w-14 items-center justify-center gap-2 rounded-full border-[2.5px] border-ink bg-[#25d366] shadow-pop-sm transition-transform hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:p-3"
    >
      <svg aria-hidden viewBox="0 0 32 32" className="h-7 w-7 fill-ink">
        <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6C28.7 8.6 23 3 16 3zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.2 1.3-4-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6 0-5.8 4.8-10.5 10.6-10.5s10.6 4.7 10.6 10.5S21.8 26.1 16 26.1zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
      </svg>
      <span className="hidden pr-2 font-display font-semibold text-ink sm:inline">Chat with us</span>
    </a>
  );
}
