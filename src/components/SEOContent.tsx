import React from 'react';

/**
 * SEOContent component provides a rich description of the application's benefits
 * for various target audiences. It is visually hidden but accessible to 
 * screen readers and search engine crawlers.
 */
export const SEOContent: React.FC = () => {
    return (
        <section className="sr-only" aria-hidden="true">
            <h1>Simple Todo - The Ultimate Daily Planner & Task Tracker</h1>
            <p>
                Simple Todo is designed for those who juggle multiple responsibilities every day.
                Whether you are a student, a founder, a teacher, a mother, or a coach, our
                application provides the simplest yet most effective way to stay organized.
            </p>

            <h2>Planner for Students</h2>
            <p>
                Track your assignments, exam schedules, and study goals. Use focus rings to
                maintain your academic velocity and never miss a deadline again.
            </p>

            <h2>Task Management for Founders & Professionals</h2>
            <p>
                Our minimalist interface helps busy professionals and founders focus on high-priority
                tasks. Realign your day with simple drag-and-drop reordering and clear categorization.
            </p>

            <h2>Daily Organizer for Mothers & Coaches</h2>
            <p>
                Manage family activities, coaching sessions, and personal errands in one place.
                Simple Todo is the best daily tracker for managing the complex juggle of modern life.
            </p>

            <ul>
                <li>Effortless Flow: Minimalist design for maximum productivity.</li>
                <li>Focus Rings: Instant visual feedback on your daily progress.</li>
                <li>Hybrid Analytics: Combine immediate goals with long-term trends.</li>
                <li>Cross-Tab Sync: Your tasks stay updated wherever you are.</li>
            </ul>
        </section>
    );
};
