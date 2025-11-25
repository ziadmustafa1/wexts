export function AnimatedBackground() {
    return (
        <>
            {/* Smooth Base Gradient - Eye Friendly */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-violet-950/30" />

            {/* Subtle Animated Gradient Orbs - Softer Colors */}
            <div className="absolute inset-0 overflow-hidden opacity-40">
                <div
                    className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]"
                    style={{
                        animation: 'float 20s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px]"
                    style={{
                        animation: 'float 25s ease-in-out infinite',
                        animationDelay: '5s'
                    }}
                />
                <div
                    className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-fuchsia-600/15 rounded-full blur-[90px]"
                    style={{
                        animation: 'float 30s ease-in-out infinite',
                        animationDelay: '10s'
                    }}
                />
            </div>

            {/* Subtle Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(139, 92, 246, 0.08) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(139, 92, 246, 0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: '64px 64px'
                }}
            />

            {/* Soft Radial Gradient Overlay for Depth */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at top, transparent 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0.6) 100%)'
                }}
            />

            {/* Elegant Flowing Lines - More Subtle */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(167, 139, 250)" stopOpacity="0" />
                        <stop offset="50%" stopColor="rgb(167, 139, 250)" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="rgb(167, 139, 250)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(147, 197, 253)" stopOpacity="0" />
                        <stop offset="50%" stopColor="rgb(147, 197, 253)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="rgb(147, 197, 253)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Slow, Smooth Horizontal Lines */}
                <line x1="0" y1="25%" x2="100" y2="25%" stroke="url(#lineGrad1)" strokeWidth="2">
                    <animate attributeName="x1" values="0;100;0" dur="20s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="100;200;100" dur="20s" repeatCount="indefinite" />
                </line>
                <line x1="0" y1="75%" x2="100" y2="75%" stroke="url(#lineGrad2)" strokeWidth="2">
                    <animate attributeName="x1" values="0;100;0" dur="25s" repeatCount="indefinite" />
                    <animate attributeName="x2" values="100;200;100" dur="25s" repeatCount="indefinite" />
                </line>

                {/* Slow, Smooth Vertical Lines */}
                <line x1="35%" y1="0" x2="35%" y2="100" stroke="url(#lineGrad1)" strokeWidth="2">
                    <animate attributeName="y1" values="0;100;0" dur="22s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="100;200;100" dur="22s" repeatCount="indefinite" />
                </line>
                <line x1="65%" y1="0" x2="65%" y2="100" stroke="url(#lineGrad2)" strokeWidth="2">
                    <animate attributeName="y1" values="0;100;0" dur="28s" repeatCount="indefinite" />
                    <animate attributeName="y2" values="100;200;100" dur="28s" repeatCount="indefinite" />
                </line>
            </svg>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -20px) scale(1.05); }
                    50% { transform: translate(-10px, 10px) scale(0.95); }
                    75% { transform: translate(15px, 15px) scale(1.02); }
                }
            `}</style>
        </>
    );
}
