import type { CSSProperties, ReactNode } from "react";

export type SpecItem = {
  value: ReactNode;
  label?: ReactNode;
  valueStyle?: CSSProperties;
};

type SpecBandProps = {
  items: SpecItem[];
  /** Number of columns on desktop. Defaults to 4. */
  columns?: 2 | 3 | 4;
  /** Tighter padding and smaller numbers. */
  compact?: boolean;
};

export default function SpecBand({ items, columns = 4, compact = false }: SpecBandProps) {
  const classes = ["spec-grid"];
  if (columns !== 4) classes.push(`spec-grid-${columns}`);
  if (compact) classes.push("spec-grid-compact");

  return (
    <div className="spec-band">
      <div className={classes.join(" ")}>
        {items.map((item, i) => (
          <div className="spec-cell" key={i}>
            <div className="value" style={item.valueStyle}>
              {item.value}
            </div>
            {item.label && <div className="key">{item.label}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
