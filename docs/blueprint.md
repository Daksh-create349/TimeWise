# **App Name**: Uniportal

## Core Features:

- Splash Screen: Animated splash screen with logo and title transition.
- Login Page: Two-column layout with a background video and a login form, including university selection and multiple login options.
- Dashboard Layout: Responsive dashboard layout with collapsible sidebar, navigation menu, and user avatar.
- Main Dashboard: Grid-based layout displaying welcome banner, timetable, assignments, attendance, and an AI promo card.
- AI Course Suggester: AI-powered page allowing users to input course topics/project ideas and receive personalized suggestions. The LLM uses a 'tool' to decide whether and when student performance data should affect the course suggestions.
- AI Integration (Genkit Flow): Backend Genkit flow (aiCourseSuggestion) to analyze student performance and provide personalized course suggestions, resources, and study strategies.
- Server Action Integration: Use a Next.js Server Action (getCourseSuggestions) to call the Genkit flow and display the AI-generated results on the front-end.

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) to convey trust and intelligence, reflecting an academic environment.
- Background color: Very light grey-blue (#F0F4F8) for a clean, neutral backdrop that supports prolonged screen use.
- Accent color: Vibrant magenta (#E91E63) to highlight important actions and information.
- Body text: 'PT Sans', a modern, neutral sans-serif, is recommended for good readability.
- Headline text: 'Space Grotesk' will match the digital nature of the app, lending a clean but strong look.
- Use lucide-react icons throughout the application for a consistent and modern look.
- Implement a responsive layout using Tailwind CSS to ensure compatibility across devices.
- Subtle animations and transitions using framer-motion to enhance user experience.