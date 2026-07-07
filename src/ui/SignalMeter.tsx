// src/ui/SignalMeter.tsx
import "./SignalMeter.css";

interface SignalMeterProps {
  label: string;
  score: number;
  zones?: string[];
}

export default function SignalMeter({ label, score, zones }: SignalMeterProps) {
  const clampedScore = Math.max(0, Math.min(100, score));

  return (
    <div className="signal-meter">
      <div className="signal-meter-header">
        <span className="signal-meter-label">{label}</span>
        <span className="signal-meter-score">
          <span className="signal-meter-score-value">{clampedScore}</span>
          <span className="signal-meter-score-max">/100</span>
        </span>
      </div>

      <div className="signal-meter-track">
        <div
          className="signal-meter-fill"
          style={{ width: `${clampedScore}%` }}
        />
      </div>

      {zones && zones.length > 0 && (
        <div className="signal-meter-zones">
          {zones.map((zone) => (
            <span key={zone} className="signal-meter-zone">
              {zone}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}