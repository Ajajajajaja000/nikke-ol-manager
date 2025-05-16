import {
  Card, CardContent, Typography,
  Select, MenuItem, Button, IconButton,
  LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { OLPart, OLAttr } from '../types/overload';
import { getStage, TABLES, attrLabels } from '../utils/stageTable';

const attrList: OLAttr[] = [
  'atk_pct','crit_rate_pct','crit_dmg_pct','hit_rate_pct','ammo_max_pct',
  'charge_dmg_pct','charge_speed_pct','element_dmg_pct','def_pct',
];

export default function PartCard({
  part, onChange, label,
}: {
  part: OLPart;
  onChange: (p: OLPart) => void;
  label: string;
}) {
  const addSub = () => {
    const attr = 'atk_pct';
    const value = TABLES[attr][0];
    onChange({ ...part, subs: [...part.subs, { attr, value, stage: getStage(attr, value) }] });
  };

  const setAttr = (i: number, attr: OLAttr) => {
    const subs = [...part.subs];
    subs[i].attr = attr;
    subs[i].value = TABLES[attr][0];
    subs[i].stage = getStage(attr, subs[i].value);
    onChange({ ...part, subs });
  };

  const setValue = (i: number, val: number) => {
    const subs = [...part.subs];
    subs[i].value = val;
    subs[i].stage = getStage(subs[i].attr, val);
    onChange({ ...part, subs });
  };

  const remove = (i: number) => {
    const subs = part.subs.filter((_, idx) => idx !== i);
    onChange({ ...part, subs });
  };

  return (
    <Card sx={{ borderTop: '5px solid', borderColor: 'primary.main' }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          {label}
        </Typography>

        {part.subs.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            {/* 属性セレクト */}
            <Select
              size="small"
              value={s.attr}
              onChange={(e) => setAttr(i, e.target.value as OLAttr)}
              sx={{ width: 240 }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxWidth: 360,
                    whiteSpace: 'nowrap',
                  },
                },
              }}
            >
              {attrList.map((a) => (
                <MenuItem key={a} value={a}>
                  {attrLabels[a]}
                </MenuItem>
              ))}
            </Select>

            {/* 数値セレクト（Lv表示なし） */}
            <Select
              size="small"
              value={s.value}
              onChange={(e) => setValue(i, Number(e.target.value))}
              sx={{ width: 120 }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    whiteSpace: 'nowrap',
                  },
                },
              }}
            >
              {TABLES[s.attr].map((val) => (
                <MenuItem key={val} value={val}>
                  {val.toFixed(2)}%
                </MenuItem>
              ))}
            </Select>

            {/* プログレスバー + ステージ表示 */}
            <LinearProgress
              variant="determinate"
              value={(s.stage / 15) * 100}
              sx={{ flex: 1, height: 8, borderRadius: 5, mx: 1 }}
            />
            <Typography sx={{ minWidth: 36 }}>
              {s.stage ? `Lv${s.stage}` : 'Err'}
            </Typography>

            {/* 削除ボタン */}
            <IconButton size="small" onClick={() => remove(i)}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
        ))}

        {/* サブステ追加ボタン */}
        {part.subs.length < 3 && (
          <Button
            size="small" variant="outlined" fullWidth sx={{ mt: 1 }}
            onClick={addSub}
          >
            ＋サブステ
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
