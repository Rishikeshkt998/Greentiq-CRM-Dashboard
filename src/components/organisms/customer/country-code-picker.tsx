'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { COUNTRY_CODES, CountryCodeOption } from '@/config/country-codes';
import { cn } from '@/lib/utils/cn';

interface CountryCodePickerProps {
  value: string;
  onChange: (code: string) => void;
}

export function CountryCodePicker({ value, onChange }: CountryCodePickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  const filteredCountries = COUNTRY_CODES.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.includes(q) ||
      c.country.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/70 transition-all cursor-pointer shadow-2xs select-none"
      >
        <span className="text-sm">{selectedCountry.flag}</span>
        <span>{selectedCountry.code}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-border/80 bg-card p-2 shadow-2xl space-y-1.5 transition-colors duration-200">
          {/* Search Bar inside popover */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search country or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-border/70 bg-muted/50 py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none"
            />
          </div>

          {/* Searchable Country List */}
          <div className="max-h-52 overflow-y-auto scrollbar-thin space-y-0.5 pr-1">
            {filteredCountries.length === 0 ? (
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">No countries found</p>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = c.code === value && c.country === selectedCountry.country;
                return (
                  <button
                    key={`${c.country}-${c.code}`}
                    type="button"
                    onClick={() => {
                      onChange(c.code);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors text-left cursor-pointer',
                      isSelected
                        ? 'bg-primary/15 text-primary font-bold'
                        : 'text-foreground hover:bg-muted/60'
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">{c.flag}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground flex-shrink-0">
                      <span>{c.code}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
