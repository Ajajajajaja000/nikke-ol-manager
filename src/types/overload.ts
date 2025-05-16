export type OLAttr =
  | 'atk_pct'
  | 'crit_rate_pct'
  | 'crit_dmg_pct'
  | 'hit_rate_pct'
  | 'ammo_max_pct'
  | 'charge_dmg_pct'
  | 'charge_speed_pct'
  | 'element_dmg_pct'
  | 'def_pct';

export interface OLSubStat {
  attr: OLAttr;
  value: number;
  stage: number;
}

export type OLPartName = 'helm' | 'armor' | 'glove' | 'boot';

export interface OLPart {
  part: OLPartName;
  subs: OLSubStat[];
}

export interface OLCharRecord {
  nikkeId: string;
  displayName: string;
  parts: Record<OLPartName, OLPart>;
}
