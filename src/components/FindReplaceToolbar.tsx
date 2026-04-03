import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FindReplaceToolbarProps {
  value: string;
  onChange: (value: string) => void;
}

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const FindReplaceToolbar = ({ value, onChange }: FindReplaceToolbarProps) => {
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [lastIndex, setLastIndex] = useState(0);

  const matchCount = useMemo(() => {
    if (!find.trim()) return 0;
    const regex = new RegExp(escapeRegExp(find), matchCase ? 'g' : 'gi');
    return (value.match(regex) || []).length;
  }, [find, matchCase, value]);

  const findNext = () => {
    if (!find) return;
    const haystack = matchCase ? value : value.toLowerCase();
    const needle = matchCase ? find : find.toLowerCase();

    const idx = haystack.indexOf(needle, lastIndex);
    if (idx >= 0) {
      setLastIndex(idx + needle.length);
    } else {
      setLastIndex(0);
    }
  };

  const replaceOne = () => {
    if (!find) return;
    const flags = matchCase ? '' : 'i';
    onChange(value.replace(new RegExp(escapeRegExp(find), flags), replace));
  };

  const replaceAll = () => {
    if (!find) return;
    const flags = matchCase ? 'g' : 'gi';
    onChange(value.replace(new RegExp(escapeRegExp(find), flags), replace));
  };

  return (
    <div className="space-y-3 rounded-md border border-border p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="find-input">Find</Label>
          <Input id="find-input" value={find} onChange={(e) => setFind(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="replace-input">Replace</Label>
          <Input id="replace-input" value={replace} onChange={(e) => setReplace(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={findNext}>Find Next</Button>
        <Button type="button" variant="outline" size="sm" onClick={replaceOne}>Replace</Button>
        <Button type="button" variant="outline" size="sm" onClick={replaceAll}>Replace All</Button>
        <Button
          type="button"
          variant={matchCase ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMatchCase((v) => !v)}
        >
          Match Case
        </Button>
        <span className="text-sm text-muted-foreground">Matches: {matchCount}</span>
      </div>
    </div>
  );
};

export default FindReplaceToolbar;
