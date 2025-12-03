import { useEffect, useState } from 'react';
import { Link, Hash, Clock, Database, CheckCircle, XCircle, Search, Filter, Info, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface Block {
    index_id: number;
    timestamp: string | number; // Handle both string and number timestamps
    data: string | object; // Handle parsed JSON or string
    previousHash: string;
    hash: string;
    nonce: number;
}

export const BlockchainExplorer = () => {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'hash' | 'data'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const response = await fetch('/api/ledger');
                if (response.ok) {
                    const data = await response.json();
                    // Parse data field if it's a string
                    const parsedBlocks = data.data.map((b: any) => ({
                        ...b,
                        data: typeof b.data === 'string' && b.data.startsWith('{') ? JSON.parse(b.data) : b.data
                    }));
                    setBlocks(parsedBlocks);
                    setIsValid(data.isValid);
                }
            } catch (error) {
                console.error("Failed to fetch ledger:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLedger();
    }, []);

    const formatDate = (timestamp: string | number) => {
        if (!timestamp) return 'Unknown Date';
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleString();
    };

    const filteredBlocks = blocks.filter(block => {
        const searchLower = searchTerm.toLowerCase();
        if (filterType === 'hash') return block.hash.toLowerCase().includes(searchLower);
        if (filterType === 'data') return JSON.stringify(block.data).toLowerCase().includes(searchLower);
        return (
            block.hash.toLowerCase().includes(searchLower) ||
            JSON.stringify(block.data).toLowerCase().includes(searchLower) ||
            block.index_id.toString().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredBlocks.length / itemsPerPage);
    const paginatedBlocks = filteredBlocks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center">
                    <Link className="h-10 w-10 text-yellow-500 mr-4" />
                    <div>
                        <h2 className="text-3xl font-bold text-white">Immutable Ledger</h2>
                        <p className="text-slate-400">The unbreakable chain of truth for business registrations.</p>
                    </div>
                </div>
                <div className={`flex items-center px-4 py-2 rounded-full border ${isValid ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                    {isValid ? <CheckCircle className="h-5 w-5 mr-2" /> : <XCircle className="h-5 w-5 mr-2" />}
                    <span className="font-bold">{isValid ? 'Blockchain Verified' : 'Integrity Compromised'}</span>
                </div>
            </div>

            {/* Info Strip */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8 flex items-start">
                <Info className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                <div>
                    <h4 className="text-blue-400 font-bold mb-1">What is this?</h4>
                    <p className="text-slate-300 text-sm">
                        This ledger records every business registration securely. Once a block is added, it cannot be changed or deleted.
                        This ensures transparency and trust in the municipal records.
                    </p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by Block Hash, Data, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-yellow-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-8 py-3 text-white focus:border-yellow-500 outline-none appearance-none"
                    >
                        <option value="all">All Fields</option>
                        <option value="hash">Block Hash</option>
                        <option value="data">Data Payload</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin h-12 w-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-400">Syncing with the network...</p>
                </div>
            ) : (
                <div className="space-y-6 relative">
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-800 -z-10 hidden md:block"></div>

                    {paginatedBlocks.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            No blocks found matching your search.
                        </div>
                    ) : (
                        paginatedBlocks.map((block) => (
                            <div key={block.hash} className="ml-0 md:ml-12 bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-yellow-500/50 transition-colors shadow-lg relative group">
                                <div className="absolute -left-12 top-8 w-8 h-8 rounded-full bg-slate-950 border-4 border-slate-800 flex items-center justify-center z-10 hidden md:flex group-hover:border-yellow-500 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                </div>

                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="bg-slate-800 text-slate-300 text-xs font-mono px-2 py-1 rounded">
                                            Block #{block.index_id}
                                        </span>
                                        {block.index_id === 1 && (
                                            <span className="bg-yellow-500/20 text-yellow-500 text-xs font-bold px-2 py-1 rounded">
                                                GENESIS
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-slate-400 text-sm">
                                        <Clock className="h-4 w-4 mr-2" />
                                        {formatDate(block.timestamp)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="flex items-center text-yellow-500 mb-2" title="Unique identifier for this block">
                                            <Hash className="h-4 w-4 mr-2" />
                                            <span className="text-xs font-mono uppercase tracking-wider font-bold">Block Hash</span>
                                            <HelpCircle className="h-3 w-3 ml-1 text-slate-600 cursor-help" />
                                        </div>
                                        <p className="font-mono text-xs text-slate-300 break-all bg-slate-950 p-3 rounded border border-slate-800 select-all">
                                            {block.hash}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center text-slate-500 mb-2" title="Hash of the previous block in the chain">
                                            <Link className="h-4 w-4 mr-2" />
                                            <span className="text-xs font-mono uppercase tracking-wider font-bold">Previous Block Hash</span>
                                        </div>
                                        <p className="font-mono text-xs text-slate-500 break-all bg-slate-950 p-3 rounded border border-slate-800 select-all">
                                            {block.previousHash}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-800">
                                    <div className="flex items-center text-slate-400 mb-2">
                                        <Database className="h-4 w-4 mr-2" />
                                        <span className="text-sm font-bold">Data Payload</span>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded border border-slate-800 overflow-x-auto">
                                        {typeof block.data === 'object' ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {Object.entries(block.data).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-xs text-slate-500 uppercase tracking-wider block">{key}</span>
                                                        <span className="text-sm text-green-400 font-mono">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <pre className="text-xs text-green-400 font-mono">{String(block.data)}</pre>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Pagination */}
                    {filteredBlocks.length > itemsPerPage && (
                        <div className="flex justify-center items-center space-x-4 mt-8">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <span className="text-slate-400">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full bg-slate-800 text-white disabled:opacity-50 hover:bg-slate-700"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
