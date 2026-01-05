"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
    id: string;
    question: string;
    options: string[];
}

const questions: Question[] = [
    {
        id: "occupation",
        question: "What do you do?",
        options: [
            "Work full-time",
            "Student",
            "Freelance / Self-employed",
            "Other",
        ],
    },
    {
        id: "journaling_experience",
        question: "Have you tried journaling before?",
        options: [
            "Never",
            "A few times, didn't stick",
            "On and off for months",
            "Yes, I journal regularly",
        ],
    },
    {
        id: "biggest_challenge",
        question: "What's your biggest journaling challenge?",
        options: [
            "I forget to do it",
            "I don't know what to write",
            "I don't see the point",
            "I can't find the time",
        ],
    },
    {
        id: "goal",
        question: "What do you want from journaling?",
        options: [
            "Reduce stress & anxiety",
            "Track personal growth",
            "Build self-awareness",
            "Process my thoughts",
        ],
    },
    {
        id: "commitment",
        question: "Can you commit to 2 minutes a day?",
        options: [
            "Absolutely",
            "I'll try my best",
            "Only on weekdays",
            "I'm not sure",
        ],
    },
    {
        id: "motivation",
        question: "What motivates you most?",
        options: [
            "Streaks & consistency",
            "Rankings & competition",
            "Personal insights",
            "Building good habits",
        ],
    },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = questions[currentStep];
    const isLastQuestion = currentStep === questions.length - 1;
    const progress = ((currentStep + 1) / questions.length) * 100;

    const handleSelect = (option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: option,
        }));
    };

    const handleNext = () => {
        if (isLastQuestion) {
            handleSubmit();
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // TODO: Save answers to database
        console.log("Questionnaire answers:", answers);

        setTimeout(() => {
            window.location.href = "/today";
        }, 1000);
    };

    const selectedOption = answers[currentQuestion.id];

    return (
        <div className="min-h-screen radial-glow grid-pattern flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-sm font-medium mb-6">
                        <span>🎖️</span>
                        <span>RECRUITMENT</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">
                        Question {currentStep + 1} of {questions.length}
                    </h1>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-[var(--background-secondary)] rounded-full overflow-hidden mt-4">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold mb-8 text-center">
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${selectedOption === option
                                        ? "bg-[var(--primary-muted)] border-2 border-[var(--primary)] text-[var(--foreground)]"
                                        : "bg-[var(--background-secondary)] border-2 border-transparent hover:border-[var(--glass-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === option
                                                ? "border-[var(--primary)] bg-[var(--primary)]"
                                                : "border-[var(--foreground-muted)]"
                                            }`}
                                    >
                                        {selectedOption === option && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="font-medium">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--glass-border)]">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 font-medium transition-colors ${currentStep === 0
                                    ? "text-[var(--foreground-muted)] opacity-50 cursor-not-allowed"
                                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                                }`}
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!selectedOption || isSubmitting}
                            className={`btn-primary flex items-center gap-2 ${!selectedOption
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Starting...
                                </>
                            ) : (
                                <>
                                    {isLastQuestion ? "Begin Training" : "Next"}
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Skip option */}
                <p className="text-center mt-6 text-sm text-[var(--foreground-muted)]">
                    <Link
                        href="/today"
                        className="hover:text-[var(--foreground)] transition-colors underline"
                    >
                        Skip for now
                    </Link>
                </p>
            </div>
        </div>
    );
}
