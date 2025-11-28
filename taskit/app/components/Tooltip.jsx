'use client';

import { useState } from 'react';

export default function Tooltip({ children, content }) {
    const [show, setShow] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 bg-cyber-bgLight text-cyber-text text-xs rounded-lg border border-cyber-borderSubtle whitespace-nowrap z-50 animate-fade-in shadow-lg"
                    role="tooltip"
                >
                    {content}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -mb-0.5">
                        <div className="border-4 border-transparent border-b-cyber-bgLight"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
