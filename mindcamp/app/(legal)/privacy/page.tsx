export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#243447] to-[#1a2332] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-6 text-white/80">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                        <p>We collect information you provide directly, including:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Email address for account creation and authentication</li>
                            <li>Journal entries and reflections you write</li>
                            <li>Usage data like login times and feature usage</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                        <p>Your information is used to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Provide and maintain the journaling service</li>
                            <li>Generate personalized insights about your writing patterns</li>
                            <li>Send important account-related emails</li>
                            <li>Improve our service based on usage patterns</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
                        <p>
                            Your journal entries are private and encrypted. We use industry-standard security
                            measures to protect your data. We do not sell, share, or monetize your personal
                            journal content.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Data Retention</h2>
                        <p>
                            Your data is retained as long as your account is active. You can export all your
                            entries at any time. When you delete your account, all your data is permanently
                            removed from our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Access all your personal data</li>
                            <li>Export your journal entries (JSON or CSV)</li>
                            <li>Delete your account and all associated data</li>
                            <li>Update your personal information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Cookies</h2>
                        <p>
                            We use essential cookies for authentication and session management.
                            We do not use tracking cookies or third-party advertising cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Contact</h2>
                        <p>
                            For privacy-related questions, please contact us at privacy@clarityjournal.app
                        </p>
                    </section>

                    <p className="text-white/50 text-sm pt-4 border-t border-white/10">
                        Last updated: January 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
