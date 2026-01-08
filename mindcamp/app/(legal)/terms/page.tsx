export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2332] via-[#243447] to-[#1a2332] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-6 text-white/80">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                        <p>
                            By using Clarity Journal, you agree to these Terms of Service. If you do not
                            agree, please do not use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
                        <p>
                            Clarity Journal is a personal journaling application that helps you build
                            a daily writing habit through guided prompts, streak tracking, and insights
                            about your writing patterns.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
                        <p>You are responsible for:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Maintaining the security of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us of any unauthorized access</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">4. Subscriptions and Payments</h2>
                        <p>
                            The service offers a 3-day free trial. After the trial, a subscription is
                            required to continue writing entries. Subscriptions auto-renew unless cancelled.
                            Refunds are handled according to Apple App Store or Stripe policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">5. User Content</h2>
                        <p>
                            You retain ownership of all journal entries you create. We do not claim any
                            intellectual property rights over your content. You grant us a limited license
                            to store and display your content back to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">6. Prohibited Uses</h2>
                        <p>You agree not to:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Attempt to gain unauthorized access to the service</li>
                            <li>Interfere with the proper functioning of the service</li>
                            <li>Use the service to store illegal content</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">7. Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate these terms.
                            You may delete your account at any time through the Settings page.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">8. Disclaimer</h2>
                        <p>
                            The service is provided &quot;as is&quot; without warranties of any kind. We are not
                            responsible for any loss of data due to technical failures, though we take
                            reasonable precautions to prevent such events.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-3">9. Changes to Terms</h2>
                        <p>
                            We may update these terms from time to time. Continued use of the service
                            after changes constitutes acceptance of the new terms.
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
