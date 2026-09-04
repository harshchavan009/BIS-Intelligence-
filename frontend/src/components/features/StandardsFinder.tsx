import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Search, ShieldAlert, CheckCircle, ExternalLink, ArrowRight, Filter, BookOpen } from 'lucide-react';
import { SealMotif } from '../common/SealMotif';

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
      console.error(err);
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

  const filteredResults = categoryFilter === 'All'
    ? results
    : results.filter(r => r.category.toLowerCase().includes(categoryFilter.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-line rounded-lg p-6 shadow-paper-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <SealMotif size={20} />
              <span className="text-xs font-semibold tracking-wider text-brass uppercase font-mono">
                Institutional Product-to-Standard Engine
              </span>
            </div>
            <h1 className="text-2xl font-serif text-ink">
              {language === 'hi' ? 'भारतीय मानक एवं QCO खोजक' : 'Indian Standards & Mandatory QCO Finder'}
            </h1>
            <p className="text-xs text-ink-muted">
              {language === 'hi'
                ? 'उत्पाद का नाम या IS नंबर दर्ज करें। सटीक मिलान और अनिवार्य गुणवत्ता नियंत्रण आदेश (QCO) की स्थिति देखें।'
                : 'Search product descriptions or IS numbers to view mandatory QCO orders, applicable schemes, and gazette references.'}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              placeholder="e.g. cement bag, smart watch, TMT bars, IS 12330, LED lights, LPG cylinder..."
              className="w-full pl-10 pr-4 py-2.5 bg-paper border border-line rounded-md text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:border-brass focus:ring-1 focus:ring-brass"
            />
          </div>
          <button
            onClick={() => handleSearch(query)}
            disabled={loading}
            className="px-5 py-2.5 bg-indigo-deep hover:bg-indigo-deep-dark text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{loading ? 'Searching...' : 'Find My Standard'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
          <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded border transition-colors ${
                categoryFilter === cat
                  ? 'bg-brass text-white border-brass font-medium'
                  : 'bg-paper-dark/60 text-gray-600 border-line hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Statutory Honesty Advisory Banner */}
        <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2 text-xs text-amber-900">
          <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Mandatory vs. Voluntary Guidance: </strong>
            Products marked <span className="font-bold text-red-700">Mandatory QCO</span> carry statutory gazette enforcement. For voluntary standards or pilot categories not yet gazetted, the assistant provides general technical guidance.
          </span>
        </div>
      </div>

        {/* Results Count & Filter Status */}
        <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 px-1 gap-2">
          <div className="flex items-center gap-2">
            <span>
              {language === 'hi' ? 'मिले परिणाम:' : 'Found'}{' '}
              <strong className="text-ink font-semibold">{filteredResults.length}</strong>{' '}
              {language === 'hi' ? 'मानक खोज हेतु' : 'standards matching'} "{query}"
            </span>
            {categoryFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-brass/10 text-brass text-[11px] font-medium px-2 py-0.5 rounded border border-brass/20">
                Filter: {categoryFilter}
                <button
                  onClick={() => setCategoryFilter('All')}
                  className="ml-1 hover:text-red-700 font-bold"
                  title="Clear category filter"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-ink-muted">
            Lookup Strategy: Structured exact table + dense semantic fallback
          </span>
        </div>

        {filteredResults.length === 0 && !loading && (
          <div className="bg-white border border-line rounded-lg p-8 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto" />
            <h4 className="text-sm font-semibold text-ink">
              {language === 'hi' ? 'इस खोज के लिए कोई मानक नहीं मिला' : 'No exact standard found for this keyword'}
            </h4>
            {categoryFilter !== 'All' ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">
                  {results.length > 0
                    ? `There are ${results.length} results in other categories. The active filter "${categoryFilter}" excludes them.`
                    : `No standards found for "${query}" in category "${categoryFilter}".`}
                </p>
                <button
                  onClick={() => setCategoryFilter('All')}
                  className="px-3 py-1.5 bg-indigo-deep text-white text-xs rounded hover:bg-indigo-deep-dark transition-colors"
                >
                  Clear Category Filter (Show All {results.length} Results)
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try broader keywords like "cement", "steel", "laptop", "cylinder", "audio", or ask in the Assistant workspace for cross-reference.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResults.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-line rounded-lg p-5 shadow-paper-sm hover:border-brass/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-brass bg-brass/10 border border-brass/20 px-2 py-0.5 rounded">
                    {item.is_number}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 rounded border ${
                      item.mandatory
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {item.mandatory ? 'Mandatory QCO' : 'Voluntary'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-ink font-serif leading-snug">
                  {item.product_name}
                </h3>

                <div className="text-xs text-gray-500 space-y-1 pt-1 border-t border-line/40">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="font-medium text-ink">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Applicable Scheme:</span>
                    <span className="font-medium text-indigo-deep">{item.scheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order Name:</span>
                    <span className="font-medium text-ink truncate max-w-[240px]">{item.qco_name}</span>
                  </div>
                  {item.notification_ref && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Notification Ref:</span>
                      <span className="font-mono text-[11px] text-gray-600">{item.notification_ref}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-line/60 flex items-center justify-between">
                <button
                  onClick={() => {
                    setQueryPrefill(`What are the testing and certification requirements for ${item.product_name} (${item.is_number})?`);
                    setActiveTab('chat');
                  }}
                  className="text-xs text-indigo-deep hover:text-brass font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Consult in Chat</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                {sources.length > 0 && (
                  <button
                    onClick={() => openSource(sources[0])}
                    className="text-[11px] text-gray-500 hover:text-ink underline"
                  >
                    View Source Clause
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};
