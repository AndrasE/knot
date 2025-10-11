<h3 align="center">
  <a href="https://andrasapplied.netlify.app/" target="_blank" rel="noopener noreferrer">
  <img src="https://github.com/AndrasE/raw-readme/blob/7a93175c63780473dfa44e00cbd97021d55e5d90/logo/applied-readme.png" width="135">
  </a>
  <br>
  Knot
  <br>
React, Tailwind, TypeScript and Firebase Real Time DB
</h3>

## Hello there 👋

I'm getting married, and this is our official wedding website! Built with **React** and leveraging the full power of **Google Firebase**, this site serves as a central hub for all our event details, RSVP tracking, and guest entertainment, providing a seamless and highly interactive experience for everyone attending.

---

### User Experience & Design

* **Elegant Single-Page Landing Design with Redirects:** The site uses **React Router** for multi-page navigation but presents all core event information on a single, responsive landing page. It uses **`React.lazy`** and **`Suspense`** to ensure a fast initial load while seamlessly delivering content (Hero, Details, RSVP, Gallery).
* **Smooth Page Transitions:** We utilized the **`@react-spring/web`** library for fluid, animated transitions between major routes, enhancing the modern feel.
* **Guest Management (RSVP & Guests):** Includes dedicated sections for RSVP submissions and a preview of the Guest List to manage attendance.
* **Integrated Gaming Arcade:** Features a dedicated **/games** route with three custom, themed games (Memory, Flappy-style, Puzzle) to keep guests entertained.

<div align="center">
*Fully Responsive, Accessible and SEO-Optimized!* 💯

*PWA - ready (cached assets, ready to be installed)!* 🚀
</div>


<div align="center">
<img src="https://github.com/AndrasE/raw-readme/blob/a680ed99ff9a58fa3248fbd5b9bb89a1a192cafe/thumbs/applied_1.png" width="240">
<img src="https://github.com/AndrasE/raw-readme/blob/a680ed99ff9a58fa3248fbd5b9bb89a1a192cafe/thumbs/applied_2.png" width="240">
<img src="https://github.com/AndrasE/raw-readme/blob/a680ed99ff9a58fa3248fbd5b9bb89a1a192cafe/thumbs/applied_3.png" width="240">
</div>

---

### Packages Used (Core Stack)

* **[React](https://react.dev/)** - The primary JavaScript library used to build the user interface and manage component-based state.
* **[Firebase](https://firebase.google.com/docs/web/setup)** - Provides real-time database, authentication, and Firestore services, enabling secure data syncing and profile management.
* **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework used for styling, offering rapid development of responsive designs.
* **[TypeScript](https://www.typescriptlang.org/)** - Used throughout the codebase to add static typing and improve maintainability and developer experience.

---

### Run 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Start with cloning this repo on your local machine via CLI or GitHub Desktop:

`
$ git clone https://github.com/AndrasE/knot
`

`
$ cd applied
`

To install and set up the library, run:

`
$ npm install
`

Or if you prefer using Yarn:

`
$ yarn install
`

Create a firabase webapp add real-time database and authentication & edit firebase.ts or add .env:

```js
VITE_FORMSPARK_FORM_ID="Your key"
VITE_FIREBASE_API_KEY="Your key"
VITE_FIREBASE_AUTH_DOMAIN="Your key"
VITE_FIREBASE_PROJECT_ID="Your key"
VITE_FIREBASE_STORAGE_BUCKET="Your key"
VITE_FIREBASE_MESSAGING_SENDER_ID="Your key"
VITE_FIREBASE_APP_ID="Your key"
VITE_FIREBASE_MEASUREMENT_ID=G-"Your key"
VITE_FIREBASE_DATABASE_URL="Your key"
```

Serving the app:

`
$ npm run dev
`

Building a distribution version:

`
$ npm run build
`
