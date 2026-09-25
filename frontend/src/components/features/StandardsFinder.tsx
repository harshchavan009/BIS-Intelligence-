import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, ShieldAlert, CheckCircle, ExternalLink, ArrowRight, Filter, BookOpen, X } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../common/Card';

interface StandardItem {
  is_number: string;
  product_name: string;
  category: string;
  qco_name: string;
  scheme: string;
  mandatory: boolean;
  notification_ref?: string;
  match_type: string;
  relevance_score?: number;
}

export const StandardsFinder: React.FC = () => {
  const { queryPrefill, setQueryPrefill, setActiveTab, openSource, language } = useAppStore();
  const [query, setQuery] = useState('cement');
  const debouncedQuery = useDebounce(query, 300);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [results, setResults] = useState<StandardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  const categories = [
    'All',
    'Cement & Building Materials',
    'Electronics & IT Goods',
    'Steel & Metallurgy',
    'Electrical & Lighting',
    'Household Appliances',
    'Gas Cylinders & Pressure Vessels'
  ];

  const handleSearch = async (searchQuery: string, retainCategory = false) => {
    if (!searchQuery.trim()) return;
    if (!retainCategory) {
      setCategoryFilter('All');
    }
    setLoading(true);
    try {
      const res = await fetch('/api/standards/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setResults(data.results || []);
      setSources(data.sources || []);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Standards search error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQ = queryPrefill.trim() || 'cement';
    setQuery(initialQ);
    setCategoryFilter('All');
    handleSearch(initialQ, false);
    if (queryPrefill) setQueryPrefill('');
  }, [queryPrefill]);

  // Live debounced search as user types
  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery.trim().length >= 2) {
      handleSearch(debouncedQuery.trim(), true);
    }
  }, [debouncedQuery]);

  const filteredResults = categoryFilter === 'All'
    ? results
    : results.filter(r => r.category.toLowerCase().includes(categoryFilter.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Shared Unified Header */}
      <PageHeader
        eyebrow={language === 'hi' ? 'संस्थागत उत्पाद-से-मानक इंजन' : 'Institutional Product-to-Standard Engine'}
        title={language === 'hi' ? 'भारतीय मानक एवं QCO खोजक' : 'Indian Standards & Mandatory QCO Finder'}
        description={language === 'hi'
          ? 'उत्पाद का नाम या IS नंबर दर्ज करें। सटीक मिलान और अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) की स्थिति देखें।'
          : 'Search product descriptions or IS numbers to view mandatory QCO orders, applicable schemes, and gazette references.'}
      >
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="e.g. cement bag, smart watch, TMT bars, IS 12330, LED lights, LPG cylinder..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-md text-sm text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-sans"
            />
          </div>
          <button
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Searching...' : 'Find My Standard'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <Filter className="w-3.5 h-3.5 text-text-secondary flex-shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded border transition-colors ${
                categoryFilter === cat
                  ? 'bg-brand-primary text-white border-brand-primary font-medium'
                  : 'bg-surface-alt text-text-secondary border-border hover:text-text-primary hover:bg-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Statutory Honesty Advisory Banner */}
        <div className="mt-3 p-2.5 bg-status-warning/10 border border-status-warning/30 rounded-md flex items-center gap-2 text-xs text-text-primary">
          <BookOpen className="w-4 h-4 text-status-warning flex-shrink-0" />
          <span>
            <strong>Mandatory vs. Voluntary Guidance: </strong>
            Products marked <span className="font-bold text-brand-accent">Mandatory QCO</span> carry statutory gazette enforcement. For voluntary standards or pilot categories not yet gazetted, the assistant provides general technical guidance.
          </span>
        </div>
      </PageHeader>

        {/* Results Count & Filter Status */}
        <div className="flex flex-wrap justify-between items-center text-xs text-text-secondary px-1 gap-2">
          <div className="flex items-center gap-2">
            <span>
              {language === 'hi' ? 'मिले परिणाम:' : 'Found'}{' '}
              <strong className="text-text-primary font-semibold">{filteredResults.length}</strong>{' '}
              {language === 'hi' ? 'मानक खोज हेतु' : 'standards matching'} "{query}"
            </span>
            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-brand-primary/10 text-brand-primary text-[11px] font-medium px-2 py-0.5 rounded border border-brand-primary/20">
                Filter: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('All')}
                  className="ml-1 hover:text-brand-accent p-0.5 rounded transition-colors"
                  title="Clear category filter"
                  aria-label="Clear category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-text-secondary">
            Lookup Strategy: Structured exact table + dense semantic fallback
          </span>
        </div>

        {filteredResults.length === 0 && !loading && (
          <div className="bg-surface border border-border rounded-lg p-8 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-text-secondary/40 mx-auto" />
            <h4 className="text-sm font-semibold text-text-primary">
              {language === 'hi' ? 'इस खोज के लिए कोई मानक नहीं मिला' : 'No exact standard found for this keyword'}
            </h4>
            {categoryFilter !== 'All' ? (
              <div className="space-y-2">
                <p className="text-xs text-text-secondary">
                  {results.length > 0
                    ? `There are ${results.length} results in other categories. The active filter "${categoryFilter}" excludes them.`
                    : `No standards found for "${query}" in category "${categoryFilter}".`}
                </p>
                <button
                  onClick={() => setCategoryFilter('All')}
                  className="px-3 py-1.5 bg-brand-primary text-white text-xs rounded hover:brightness-110 transition-colors"
                >
                  Clear Category Filter (Show All {results.length} Results)
                </button>
              </div>
            ) : (
              <p className="text-xs text-text-secondary max-w-md mx-auto">
                Try broader keywords like "cement", "steel", "laptop", "cylinder", "audio", or ask in the Assistant workspace for cross-reference.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResults.map((item, idx) => (
            <Card
              key={idx}
              hover
              padding="md"
              className="flex flex-col justify-between space-y-4 bg-surface border-border"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brand-primary bg-surface-alt border border-border px-2 py-0.5 rounded">
                    {item.is_number}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded border ${
                      item.mandatory
                        ? 'bg-status-danger/15 text-status-danger border-status-danger/30'
                        : 'bg-surface-alt text-text-secondary border-border'
                    }`}
                  >
                    {item.mandatory ? 'Mandatory QCO' : 'Voluntary'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-text-primary leading-snug">
                  {item.product_name}
                </h3>

                <div className="text-xs text-text-secondary space-y-1.5 pt-1.5 border-t border-border/40">
                  <div className="flex justify-between">
                    <span className="text-text-secondary/70 shrink-0">Category:</span>
                    <span className="font-medium text-text-primary text-right">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary/70 shrink-0">Applicable Scheme:</span>
                    <span className="font-medium text-brand-primary text-right">{item.scheme}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <span className="text-text-secondary/70 shrink-0">Order Name:</span>
                    <span 
                      className="font-medium text-text-primary text-left sm:text-right break-words hover:text-brand-primary cursor-help transition-colors"
                      title={`${item.qco_name} (Click to inspect source excerpt below)`}
                    >
                      {item.qco_name}
                    </span>
                  </div>
                  {item.notification_ref && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary/70 shrink-0">Notification Ref:</span>
                      <span className="font-mono text-[11px] text-text-secondary">{item.notification_ref}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-border/60 flex items-center justify-between">
                <button
                  onClick={() => {
                    setQueryPrefill(`What are the testing and certification requirements for ${item.product_name} (${item.is_number}) under ${item.qco_name}?`);
                    setActiveTab('chat');
                  }}
                  className="text-xs text-brand-primary hover:text-brand-accent font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Consult in Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                {sources.length > 0 && (
                  <button
                    onClick={() => {
                      const matchedSource = sources.find((s: any) => 
                        s.excerpt?.toLowerCase().includes(item.is_number.toLowerCase()) || 
                        s.excerpt?.toLowerCase().includes(item.product_name.toLowerCase())
                      ) || sources[0];
                      openSource(matchedSource);
                    }}
                    className="text-[11px] text-text-secondary hover:text-text-primary underline"
                  >
                    View Source Clause
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
  );
};
