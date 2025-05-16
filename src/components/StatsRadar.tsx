import {
  Radar, RadarChart, PolarGrid,
  PolarAngleAxis, Tooltip,
} from 'recharts';
import type { OLCharRecord, OLAttr  } from '../types/overload';
import { attrLabels } from '../utils/stageTable';

const pick = [
  'atk_pct','crit_rate_pct','crit_dmg_pct',
  'hit_rate_pct','element_dmg_pct',
];

export default function StatsRadar({ char }: { char: OLCharRecord }) {
  const sum: Record<string, number> = {};
  pick.forEach((k) => (sum[k] = 0));

  Object.values(char.parts).forEach((p) =>
    p.subs.forEach((s) => {
      if (pick.includes(s.attr)) sum[s.attr] += s.value;
    })
  );

  const data = pick.map((k) => ({
    stat: attrLabels[k as OLAttr] ?? k,
    value: Number(sum[k].toFixed(1)),
  }));

  return (
    <RadarChart width={320} height={260} data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="stat" />
      <Tooltip />
      <Radar name="ステータス" dataKey="value" stroke="#ff5c8d" fill="#ff5c8d" fillOpacity={0.4} />
    </RadarChart>
  );
}
