import {
  Tabs, Tab, TextField, Box, IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useOLStore } from '../store/useOLStore';

export default function CharacterTabs({
  current, onChange,
}: {
  current: string;
  onChange: (id: string) => void;
}) {
  const chars = useOLStore((s) => s.chars);
  const addChar = useOLStore((s) => s.addChar);
  const rename = useOLStore((s) => s.rename);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tmpName, setTmpName] = useState('');

  const commit = () => {
    if (editingId) rename(editingId, tmpName || 'NoName');
    setEditingId(null);
  };

  return (
    <Box sx={{ flex: 1, display: 'flex' }}>
      <Tabs value={current} onChange={(_, v) => onChange(v)} variant="scrollable">
        {chars.map((c) => (
          <Tab
            key={c.nikkeId}
            value={c.nikkeId}
            label={
              editingId === c.nikkeId ? (
                <TextField
                  size="small"
                  autoFocus
                  value={tmpName}
                  onChange={(e) => setTmpName(e.target.value)}
                  onBlur={commit}
                  onKeyDown={(e) => e.key === 'Enter' && commit()}
                />
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{c.displayName}</span>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(c.nikkeId);
                      setTmpName(c.displayName);
                    }}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              )
            }
          />
        ))}
      </Tabs>
      <IconButton onClick={addChar}>
        <AddIcon />
      </IconButton>
    </Box>
  );
}
