import React, { useEffect, useState } from 'react';
import { auditLogService } from '@/services/auditLogService';
import { AuditLog, PaginatedList } from '@/types';

const AuditLogsPage: React.FC = () => {
    const [data, setData] = useState<PaginatedList<AuditLog> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const result = await auditLogService.getAuditLogs(page, 10);
                if (result.succeeded) {
                    setData(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch audit logs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [page]);

    if (loading && !data) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-gray-600">Track all changes made across the system.</p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User / IP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action / Entity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correlation ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Integrity (Hash)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data?.items.map((log: AuditLog) => {
                            const getActionColor = (action?: string) => {
                                switch (action) {
                                    case 'Added': return 'bg-green-100 text-green-800';
                                    case 'Modified': return 'bg-blue-100 text-blue-800';
                                    case 'Deleted': return 'bg-red-100 text-red-800';
                                    default: return 'bg-gray-100 text-gray-800';
                                }
                            };

                            return (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="text-gray-900 font-medium">{log.userEmail || 'System'}</div>
                                        <div className="text-gray-400 text-xs">{log.remoteIp || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="mb-1">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </div>
                                        <div className="text-gray-500">{log.entityName} <span className="text-gray-300">#{log.entityId}</span></div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">
                                        {log.correlationId ? log.correlationId.split('-')[0] + '...' : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {log.hash ? (
                                            <span className="text-green-600 font-mono text-xs" title={log.hash}>
                                                Verified: {log.hash.substring(0, 8)}...
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 font-mono text-xs">Unsigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="max-w-xs truncate group relative">
                                            {log.newValues && <div className="text-xs text-green-600" title={log.newValues}>New: {log.newValues}</div>}
                                            {log.oldValues && <div className="text-xs text-red-600" title={log.oldValues}>Old: {log.oldValues}</div>}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!data?.hasPreviousPage}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-700">
                    Page {data?.pageNumber} of {data?.totalPages}
                </span>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!data?.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AuditLogsPage;
