'use client';

export default function ToggleSwitch({ checked, onChange, label, disabled = false }) {
    return (
        <label className="inline-flex items-center cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${checked
                        ? 'bg-cyber-primary'
                        : 'bg-cyber-surface border-2 border-cyber-border'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'
                    }`}></div>
            </div>
            {label && (
                <span className="ml-3 text-sm font-medium text-cyber-text">
                    {label}
                </span>
            )}
        </label>
    );
}
