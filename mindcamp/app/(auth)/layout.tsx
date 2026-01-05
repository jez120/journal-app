// Global styles are inherited from root layout

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen radial-glow grid-pattern flex items-center justify-center p-4">
            {children}
        </div>
    );
}
