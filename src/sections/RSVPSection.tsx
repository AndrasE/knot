import React, { useState } from "react";
import { useFormspark } from "@formspark/use-formspark";

export default function RSVPSection() {
  const FORMSPARK_FORM_ID = import.meta.env.VITE_FORMSPARK_FORM_ID!;

  const [submit, submitting] = useFormspark({
    formId: FORMSPARK_FORM_ID,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({ name, email, description });
    alert("Thank you for your response!");
  };

  return (
    <section
      id="RSVP"
      className="flex flex-col items-center justify-center h-screen max-w-2xl pb-5 m-auto text-center sm:pb-0 pt-14 md:pt-16 xl:pt-20">
      <h1 className="pb-5 text-6xl font-dawning ">RSVP </h1>
      <div className="flex flex-col gap-3 text-center ">
        <p className="max-w-md">
          Please confirm your attendance by filling out the form below.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 p-5 ">
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="p-2 border rounded-md border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500"
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
            className="p-2 border rounded-md border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500"
            autoComplete="email"
            required
          />
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description or message (e.g., plus one, can`t come, etc.)"
            className="p-2 border rounded-md border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-500"
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
    </section>
  );
}
