# Routine Fit 🌱
Smart Routine & Goal Management Platform

Routine Fit is a responsive, user‑friendly web application designed to help users manage their daily routines, health habits, and personal goals in a structured and motivating way. The platform addresses common challenges such as lack of discipline, irregular schedules, unhealthy lifestyle habits, and difficulty maintaining consistency.

---

## 🚀 Project Purpose

The main purpose of **Routine Fit** is to provide a **unified digital platform** where users can:

- Plan daily routines
- Set meaningful goals
- Track progress consistently
- Stay motivated through visual feedback
- Improve overall well‑being and productivity

---

## 🛠️ Tech Stack

- **HTML5** – Semantic and accessible markup  
- **CSS3** – Custom styling and layout improvements  
- **Bootstrap 5** – Responsive grid, components, and utilities  
- **JavaScript** – Interactive forms, dashboard, progress stepper, chart rendering, localStorage support  
- **Chart.js** – Data visualization for progress analytics  
- **SortableJS** – Drag-and-drop dashboard widgets  
- **html2pdf.js** – Export reports to PDF  
- **CDN‑based assets** – For faster loading and reliability  

---

## 📌 Table of Contents

- [Project Purpose](#-project-purpose)
- [Tech Stack](#-tech-stack)
- [User Stories & Acceptance Criteria](#user-stories--acceptance-criteria)
- [Features](#features)
- [Screenshots for All Screen Sizes](#screenshots-for-all-screen-sizes)
- [UI Components Used](#ui-components-used)
- [Data Management](#data-management)
- [Pages Included](#pages-included)
- [Accessibility & Responsiveness](#accessibility--responsiveness)
- [Lighthouse Performance](#lighthouse-performance)

---

## 🧾 User Stories & Acceptance Criteria

### User Story 1: Sign-up and Authentication
- As a new user, I want to create an account so that I can access my personalized dashboard.
- Acceptance Criteria:
  - User can enter name, email, password, and confirm password.
  - Password validation requires at least 6 characters.
  - User data is saved in localStorage upon successful signup.
  - After signup, the user is redirected to the dashboard.

### User Story 2: Personalized Dashboard
- As a user, I want to see my name and progress data so I feel connected to my routine journey.
- Acceptance Criteria:
  - The dashboard displays the signed-in username.
  - Weekly and monthly metrics are visible in cards and charts.
  - Dashboard uses localStorage data to render user progress.

### User Story 3: Routine Progress with Stepper
- As a user, I want to build a routine through a guided stepper flow so that I can plan and track a full routine.
- Acceptance Criteria:
  - The progress page has a category selection stage using cards.
  - The stepper moves through goal, routine, tracking, and completion stages.
  - Completion triggers a streak or reward message.
  - Feedback is collected after the user completes the final step.

### User Story 4: Visual Data and Reports
- As a user, I want to view charts and export my progress so I can analyze and share my routine performance.
- Acceptance Criteria:
  - Charts display completion percentage, streak counts, mood, and category distribution.
  - The user can export reports as PDF, CSV, or JSON.
  - Drag-and-drop widgets are enabled for dashboard customization.

### User Story 5: Contact and Support
- As a visitor, I want to send a message from the landing page so I can ask for help or provide feedback.
- Acceptance Criteria:
  - Contact form validates required fields only after submit.
  - The form shows a confirmation message after successful submission.
  - No errors occur when the contact form is not present on other pages.

## ⭐ Features

- Responsive hero carousel on the landing page.
- Stepper-based routine progress form with category cards.
- Personalized user greeting across dashboard and progress pages.
- Progress analytics using Chart.js line, bar, and doughnut charts.
- Drag-and-drop dashboard widgets with SortableJS.
- Export report options: PDF, CSV, JSON.
- LocalStorage-based data persistence for user profile, routines, streaks, and feedback.
- Accessible forms and interactive buttons with keyboard support.

## 🖼️ Screenshots for All Screen Sizes

### Website Flow

1. **Homepage** – hero carousel, feature overview, benefits section, and contact form.
2. **Sign-up Page** – user registration form and onboarding experience.
3. **Dashboard** – personalized analytics, charts, and export panel.
4. **Progress Page** – stepper workflow, routine category cards, and completion tracking.
5. **Feedback & Contact** – support form with submission confirmation.

### Screen Size Variation

- **Mobile** – compact navigation, stacked cards, and touch-friendly buttons.
- **Tablet** – balanced grid layout, visible charts, and responsive stepper controls.
- **Desktop** – full dashboard view with chart grid, export modal, and wider content panels.


> Screenshots are organized by page flow first, then by device size for each view.

#### Homepage

![Homepage Mobile](Screenshot_13-5-2026_21400_127.0.0.1.jpeg) ![Homepage Tablet](![alt text](image-6.png) ![Dashboard Desktop]![alt text](Image.png)

#### Sign-up Page

![Sign-up Mobile]![alt text](image-2.png) ![Sign-up Tablet] ![alt text](image-7.png) ![Dashboard Desktop] (Screenshot_13-5-2026_213336_tech-stack-hub-lab.github.io.jpeg)

#### Dashboard

![Dashboard Mobile]![alt text](image-1.png) ![Dashboard Tablet] ![alt text](image-8.png)![Dashboard Desktop](Screenshot_13-5-2026_214719_tech-stack-hub-lab.github.io.jpeg)

#### Progress Page


![Progress Mobile]![alt text](image-5.png)![alt text](Screenshot_13-5-2026_215119_tech-stack-hub-lab.github.io.jpeg)![alt text](image-4.png)![alt text](image-3.png)![alt text](Screenshot_13-5-2026_215258_tech-stack-hub-lab.github.io.jpeg) ![Progress Tablet]![alt text](image-9.png)![alt text](image-6.png)![Progress Desktop](Screenshot_13-5-2026_214027_tech-stack-hub-lab.github.io.jpeg)(Screenshot_13-5-2026_214123_tech-stack-hub-lab.github.io.jpeg)(Screenshot_13-5-2026_214227_tech-stack-hub-lab.github.io.jpeg)(Screenshot_13-5-2026_214252_tech-stack-hub-lab.github.io.jpeg)
(Screenshot_13-5-2026_214635_tech-stack-hub-lab.github.io.jpeg) 

#### Contact & Feedback


![Contact Mobile]![alt text](image-10.png) ![Contact Tablet]![alt text](image-9.png)![Contact Desktop] (Screenshot_13-5-2026_214635_tech-stack-hub-lab.github.io.jpeg)





## 🧩 UI Components Used

- **Carousel** – hero image slider for landing page highlights.
- **Stepper** – multi-step routine creation workflow.
- **Charts** – data visualization for progress tracking.
- **Forms** – signup, contact, and progress/routine data collection.
- **Cards** – routine category selection, benefit highlights, dashboard widgets, and export options.
- **Buttons** – primary action buttons, export controls, and navigation items.
- **Modals/Alerts** – export modal and success messages.

## 💾 Data Management

- Uses `localStorage` to store user profile data, routine entries, streaks, and feedback.
- The dashboard reads stored routines and displays analytics from user activity.
- Data is saved in JSON format for future report exports.

## 📄 Pages Included

- `index.html` — landing page with hero carousel, feature overview, benefits, and contact form.
- `signing.html` — signup page with form validation and user registration.
- `dashboard.html` — personalized analytics dashboard with cards, charts, drag-and-drop widgets, and export options.
- `progress.html` — routine creation page with category cards, stepper workflow, completion summary, streak feedback, and review.
- `assets/css/style.css` — project styling, accessibility enhancements, and responsive layout.
- `assets/js/script.js` — main JavaScript logic for signup, profile display, dashboard rendering, contact form handling, and progress workflow.

## ✅ Accessibility & Responsiveness

- Uses semantic HTML and accessible button/label patterns.
- Includes `tabindex` support for keyboard navigation.
- Uses `loading="lazy"` for images to speed up page load.
- Applies responsive breakpoints for mobile, tablet, and desktop layouts.

## 🚦 Lighthouse Performance

- **Performance**: Optimized for fast interactions with lazy-loaded assets and minimal DOM overhead.
- **Accessibility**: Focuses on keyboard navigation, form labeling, and readable contrast.
- **Best Practices**: Uses modern HTML, avoids duplicate script loads, and leverages CDN resources.
- **SEO**: Includes meta descriptions, page titles, and meaningful content structure.

> Recommended: Run Chrome Lighthouse for exact scores and capture reports for mobile and desktop performance.

![alt text](image-12.png)

![alt text](image-13.png)


