import { useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GridLegacy as Grid } from '@mui/material';
import { DarkMode, LightMode, Delete as DeleteIcon } from '@mui/icons-material';

import { useOLStore } from './store/useOLStore';
import { getTheme } from './theme';
import PartCard from './components/PartCard';
import CharacterTabs from './components/CharacterTabs';
import { attrLabels } from './utils/stageTable';
import type { OLAttr } from './types/overload';

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const chars = useOLStore((s) => s.chars);
  const setPart = useOLStore((s) => s.setPart);
  const removeChar = useOLStore((s) => s.removeChar);
  const [currentId, setCurrentId] = useState(chars[0]?.nikkeId ?? '');
  const cur = chars.find((c) => c.nikkeId === currentId);

  const stageSum = useMemo(
    () =>
      cur
        ? Object.values(cur.parts)
            .flatMap((p) => p.subs)
            .reduce((a, s) => a + (s.stage || 0), 0)
        : 0,
    [cur]
  );

  const attrSums: Record<OLAttr, number> = useMemo(() => {
    const sums: Partial<Record<OLAttr, number>> = {};
    if (!cur) return {} as Record<OLAttr, number>;

    Object.values(cur.parts).forEach((part) => {
      part.subs.forEach((sub) => {
        sums[sub.attr] = (sums[sub.attr] || 0) + sub.value;
      });
    });

    return sums as Record<OLAttr, number>;
  }, [cur]);

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <CharacterTabs current={currentId} onChange={setCurrentId} />
          <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Box>

        {cur && (
          <>
            {/* キャラ名 + 削除ボタン */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
              <Typography variant="h6" sx={{ flex: 1 }}>
                {cur.displayName}
              </Typography>
              <IconButton
                onClick={() => {
                  const ok = window.confirm(`「${cur.displayName}」を削除しますか？`);
                  if (ok) {
                    removeChar(cur.nikkeId);
                    const next = chars.find((c) => c.nikkeId !== cur.nikkeId);
                    setCurrentId(next?.nikkeId ?? '');
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Box sx={{ mb: 1, fontWeight: 'bold' }}>
              オーバーロードLv合計: {stageSum}
            </Box>

            <Box sx={{ mb: 2 }}>
              {Object.entries(attrSums).map(([attr, sum]) => (
                <Box key={attr} sx={{ fontSize: 14 }}>
                  {attrLabels[attr as OLAttr]}: {sum.toFixed(2)}%
                </Box>
              ))}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <PartCard
                  part={cur.parts.helm}
                  onChange={(p) => setPart(cur.nikkeId, p)}
                  label="頭装備"
                />
              </Grid>
              <Grid item xs={6}>
                <PartCard
                  part={cur.parts.armor}
                  onChange={(p) => setPart(cur.nikkeId, p)}
                  label="胴装備"
                />
              </Grid>
              <Grid item xs={6}>
                <PartCard
                  part={cur.parts.glove}
                  onChange={(p) => setPart(cur.nikkeId, p)}
                  label="腕装備"
                />
              </Grid>
              <Grid item xs={6}>
                <PartCard
                  part={cur.parts.boot}
                  onChange={(p) => setPart(cur.nikkeId, p)}
                  label="脚装備"
                />
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}
