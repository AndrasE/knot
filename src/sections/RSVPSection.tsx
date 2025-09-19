import React, { useState, useEffect } from "react";
import { useFormspark } from "@formspark/use-formspark";

// Define the types for the toast state and props
type ToastType = "success" | "error";
type ToastState = {
  message: string;
  type: ToastType;
};

// Toast component for displaying messages
const Toast: React.FC<{
  toast: ToastState | null;
  isVisible: boolean;
}> = ({ toast, isVisible }) => {
  if (!toast) return null;

  const bgColor = toast.type === "success" ? "bg-stone-500" : "bg-stone-600";
  const transitionClasses = "transition-all duration-500 ease-in-out";
  const visibilityClasses = isVisible
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-full";

  return (
    <div
      className={`fixed bottom-5  p-4 rounded-md text-white shadow-lg z-50 ${transitionClasses} ${visibilityClasses} ${bgColor}`}>
      <div className="flex items-center">
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default function RSVPSection() {
  const FORMSPARK_FORM_ID = import.meta.env.VITE_FORMSPARK_FORM_ID!;

  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });

  // State for form fields and toast
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [toastContent, setToastContent] = useState<ToastState | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Manages the toast's visibility and timeout
  useEffect(() => {
    if (toastContent) {
      // Show the toast after a slight delay to allow for the transition
      const showTimer = setTimeout(() => {
        setShowToast(true);
      }, 10);

      // Hide the toast after 3 seconds
      const hideTimer = setTimeout(() => {
        setShowToast(false);
        // Clear the content after the fade-out completes
        setTimeout(() => setToastContent(null), 500);
      }, 3000);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [toastContent]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit({ name, email, description });
      setToastContent({
        message: "Thank you! Your RSVP was sent.",
        type: "success",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setToastContent({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <section
      id="RSVP"
      className="flex flex-col items-center justify-center h-screen max-w-2xl p-5 m-auto text-center ">
      <h1 className="pb-5 text-6xl font-dawning ">RSVP </h1>
      <div className="flex flex-col gap-3 text-center ">
        <p className="max-w-md">
          Please confirm your attendance by filling out the form below. Thank
          you!
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-5">
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="p-2 border rounded-md border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
            autoComplete="name"
            required
          />
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="p-2 border rounded-md border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
            autoComplete="email"
            required
          />
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description or message (e.g., plus one, can't come, etc.)"
            className="p-2 border rounded-md border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-400"
            autoComplete="off"
            rows={4}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 ml-auto font-bold text-white transition duration-300 rounded-md max-w-fit bg-stone-500 hover:bg-stone-600 disabled:opacity-50">
            {submitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
      <Toast toast={toastContent} isVisible={showToast} />
    </section>
  );
}
