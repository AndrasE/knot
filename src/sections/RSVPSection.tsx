import React, { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";
// ✅ Import both the hook and the component
import { useToast, Toast } from "../utils/useToast";

export default function RSVPSection() {
  const FORMSPARK_FORM_ID = import.meta.env.VITE_FORMSPARK_FORM_ID!;
  const [submit, submitting] = useFormspark({ formId: FORMSPARK_FORM_ID });

  // ✅ Get the props from the hook
  const { showToast, toastProps } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submit({ name, email, description });
      showToast("Thank you! Your RSVP was sent.", "success");
      setName("");
      setEmail("");
      setDescription("");
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  return (
    <section
      id="RSVP"
      className="max-w-2xl text-center flex-center-100vh nav-content-offset">
      {/* ... your form JSX ... */}
      <h1 className="pb-5 text-6xl font-dawning">RSVP</h1>
      <div className="flex flex-col gap-3 text-center">
        <p className="max-w-md">
          Please confirm your attendance by filling out the form below. Thank
          you!
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-5">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="p-2 border rounded-md border-stone-300 focus:ring-1 focus:ring-stone-400"
            required
          />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            className="p-2 border rounded-md border-stone-300 focus:ring-1 focus:ring-stone-400"
            required
          />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short message (e.g., plus one, can’t come, etc.)"
            className="p-2 border rounded-md border-stone-300 focus:ring-1 focus:ring-stone-400"
            rows={4}
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-3 py-2 ml-auto text-white transition duration-300 rounded-md max-w-fit bg-stone-500 hover:bg-stone-600 disabled:opacity-50">
            {submitting ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      {/* ✅ Render the Toast component directly and spread the props */}
      <Toast {...toastProps} />
    </section>
  );
}
