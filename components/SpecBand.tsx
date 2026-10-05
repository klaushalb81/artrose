import type { CSSProperties, ReactNode } from "react";

export type SpecItem = {
  value: ReactNode;
  label: ReactNode;
  valueStyle?: CSSProperties;
};

export default function SpecBand({ items }: { items: SpecItem[] }) {
  return (
    <div className="spec-band">
      <div className="spec-grid">
        {items.map((item, i) => (
          <div className="spec-cell" key={i}>
            <div className="value" style={item.valueStyle}>
              {item.value}
            </div>
            <div className="key">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
