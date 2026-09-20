const sparkles = [
    { left: '8%', top: '18%', size: 2 },
    { left: '18%', top: '42%', size: 1 },
    { left: '28%', top: '12%', size: 2 },
    { left: '39%', top: '31%', size: 1 },
    { left: '51%', top: '17%', size: 2 },
    { left: '63%', top: '38%', size: 1 },
    { left: '74%', top: '14%', size: 2 },
    { left: '86%', top: '30%', size: 1 },
    { left: '94%', top: '55%', size: 2 },

    { left: '13%', top: '72%', size: 1 },
    { left: '31%', top: '84%', size: 2 },
    { left: '47%', top: '67%', size: 1 },
    { left: '69%', top: '78%', size: 2 },
    { left: '82%', top: '88%', size: 1 },
];

export default function ChromeSparkles() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {sparkles.map((sparkle, index) => (
                <span
                    key={index}
                    className="absolute"
                    style={{
                        left: sparkle.left,
                        top: sparkle.top,
                        width: `${sparkle.size}px`,
                        height: `${sparkle.size}px`,
                    }}
                >
                    {/* Core */}
                    <span className="absolute inset-0 rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.7),0_0_18px_rgba(160,220,255,0.35)]" />

                    {/* Vertical chrome reflection */}
                    {sparkle.size > 1 && (
                        <span
                            className="absolute left-1/2 top-1/2 h-5 w-px -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.75),transparent)]"
                        />
                    )}

                    {/* Horizontal chrome reflection */}
                    {sparkle.size > 1 && (
                        <span
                            className="absolute left-1/2 top-1/2 h-px w-5 -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.75),transparent)]"
                        />
                    )}
                </span>
            ))}
        </div>
    );
}
