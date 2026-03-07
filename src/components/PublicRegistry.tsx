import React, { useState, useMemo } from 'react';
import { Search, Filter, CheckCircle, MapPin, Phone, Globe, Building2, ChevronDown, XCircle, Clock, Shield } from 'lucide-react';
import type { Business } from '../types/types';

interface PublicRegistryProps {
    businesses: Business[];
}

const STATUS_CONFIG: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string; border: string }> = {
    Verified: {
        icon: <CheckCircle className="h-4 w-4" />,
        label: 'Verified',
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
    },
    Pending: {
        icon: <Clock className="h-4 w-4" />,
        label: 'Pending',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
    },
    Rejected: {
        icon: <XCircle className="h-4 w-4" />,
        label: 'Rejected',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
    },
};

const CATEGORIES = [
    'All Categories',
    'Food & Beverage',
    'Retail',
    'Health & Wellness',
    'Services',
    'Manufacturing',
    'Logistics',
    'Transportation',
];

export const PublicRegistry: React.FC<PublicRegistryProps> = ({ businesses }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [showFilters, setShowFilters] = useState(false);

    // Only show verified businesses in the public registry
    const verifiedBusinesses = useMemo(() => {
        return businesses.filter(b => b.status === 'Verified');
    }, [businesses]);

    const filteredBusinesses = useMemo(() => {
        let result = verifiedBusinesses;

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.tradeName?.toLowerCase().includes(q) ||
                b.legalName?.toLowerCase().includes(q) ||
                b.id?.toLowerCase().includes(q) ||
                b.address?.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (selectedCategory !== 'All Categories') {
            result = result.filter(b => b.category === selectedCategory);
        }

        return result;
    }, [verifiedBusinesses, searchQuery, selectedCategory]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = {};
        verifiedBusinesses.forEach(b => {
            if (b.category) {
                stats[b.category] = (stats[b.category] || 0) + 1;
            }
        });
        return stats;
    }, [verifiedBusinesses]);

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            {/* Hero Header */}
            <div className="relative bg-slate-900 border-b border-slate-800 pt-12 pb-16 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-yellow-500/5" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -ml-32 -mb-32" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
                            <Shield className="h-7 w-7 text-green-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">Public Business Registry</h1>
                            <p className="text-slate-400 text-sm mt-0.5">Verified businesses in Tamil Nadu</p>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-3 mt-6">
                        <div className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 text-sm">
                            <span className="text-slate-400">Total Verified: </span>
                            <span className="text-green-400 font-bold">{verifiedBusinesses.length}</span>
                        </div>
                        {Object.entries(categoryStats).slice(0, 3).map(([cat, count]) => (
                            <div key={cat} className="px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50 text-sm hidden sm:block">
                                <span className="text-slate-400">{cat}: </span>
                                <span className="text-yellow-400 font-bold">{count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                            <input
                                id="registry-search"
                                type="text"
                                placeholder="Search by name, ID, or address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-950/80 backdrop-blur-sm border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all text-base"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full sm:w-auto flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-sm border border-slate-700 rounded-xl px-5 py-3.5 text-slate-300 hover:border-yellow-500/50 transition-all min-w-[200px]"
                            >
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm font-medium">{selectedCategory}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>

                            {showFilters && (
                                <div className="absolute top-full mt-2 left-0 right-0 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setSelectedCategory(cat);
                                                setShowFilters(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${selectedCategory === cat
                                                ? 'bg-yellow-500/10 text-yellow-400 font-bold'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                                }`}
                                        >
                                            <span>{cat}</span>
                                            {cat !== 'All Categories' && categoryStats[cat] && (
                                                <span className="text-xs text-slate-500 font-mono">{categoryStats[cat]}</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-6xl mx-auto px-4 mt-8">
                {/* Results count */}
                <div className="flex items-center justify-between mb-6">
                    <p className="text-slate-500 text-sm">
                        Showing <span className="text-white font-bold">{filteredBusinesses.length}</span> of{' '}
                        <span className="text-white font-bold">{verifiedBusinesses.length}</span> verified businesses
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All Categories');
                            }}
                            className="text-xs text-yellow-500 hover:text-yellow-400 font-bold uppercase tracking-wider"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Business Cards Grid */}
                {filteredBusinesses.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                        <Search className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">No businesses found</h3>
                        <p className="text-slate-600 text-sm max-w-md mx-auto">
                            {searchQuery
                                ? `No verified businesses match "${searchQuery}". Try a different search term.`
                                : 'No verified businesses registered under this category yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredBusinesses.map((business, idx) => {
                            const statusConf = STATUS_CONFIG[business.status] || STATUS_CONFIG['Verified'];
                            return (
                                <div
                                    key={business.id}
                                    className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${Math.min(idx * 60, 600)}ms`, animationFillMode: 'both' }}
                                >
                                    {/* Card Header */}
                                    <div className="p-5 pb-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-white truncate group-hover:text-green-400 transition-colors">
                                                    {business.tradeName}
                                                </h3>
                                                <p className="text-xs text-slate-500 font-mono mt-1 truncate">
                                                    ID: {business.id}
                                                </p>
                                            </div>
                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusConf.bg} ${statusConf.color} ${statusConf.border} border shrink-0`}>
                                                {statusConf.icon}
                                                <span>{statusConf.label}</span>
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        {business.category && (
                                            <div className="mt-3">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 rounded-full text-xs font-medium text-slate-300 border border-slate-700/50">
                                                    <Building2 className="h-3 w-3 text-yellow-500" />
                                                    {business.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Divider */}
                                    <div className="mx-5 border-t border-slate-800/80" />

                                    {/* Card Body */}
                                    <div className="p-5 pt-4 space-y-3">
                                        {/* Legal Name */}
                                        <div className="flex items-start gap-2">
                                            <Building2 className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Legal Name</p>
                                                <p className="text-sm text-slate-300">{business.legalName}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        {business.address && (
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Address</p>
                                                    <p className="text-sm text-slate-400 line-clamp-2">{business.address}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact */}
                                        {business.contactNumber && (
                                            <div className="flex items-start gap-2">
                                                <Phone className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Contact</p>
                                                    <p className="text-sm text-slate-400">{business.contactNumber}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Website */}
                                        {business.website && (
                                            <div className="flex items-start gap-2">
                                                <Globe className="h-4 w-4 text-slate-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider font-bold">Website</p>
                                                    <a
                                                        href={business.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors truncate block max-w-[200px]"
                                                    >
                                                        {business.website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-5 py-3 bg-slate-950/50 border-t border-slate-800/50 flex items-center justify-between">
                                        <p className="text-[10px] text-slate-600 font-mono">
                                            Registered: {business.registrationDate ? new Date(business.registrationDate).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <div className="flex items-center gap-1 text-green-500/60">
                                            <Shield className="h-3 w-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">Trusted</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
