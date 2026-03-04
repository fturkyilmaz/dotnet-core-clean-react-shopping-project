import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { auditLogService } from '@/services/auditLogService';
import { AuditLog, PaginatedList } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Shield, Clock, User } from 'lucide-react';

const AuditLogsPage: React.FC = () => {
  const { t } = useTranslation();
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getActionBadgeVariant = (action?: string) => {
    switch (action) {
      case 'Added': return 'default';
      case 'Modified': return 'secondary';
      case 'Deleted': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('auditLogs')}</h1>
        </div>
        <p className="text-muted-foreground">{t('trackChanges') || 'Track all changes made across the system.'}</p>
      </div>

      {/* Audit Logs Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('recentActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('timestamp')}</TableHead>
                  <TableHead>{t('user')}</TableHead>
                  <TableHead>{t('action')}</TableHead>
                  <TableHead>{t('correlationId')}</TableHead>
                  <TableHead>{t('integrity')}</TableHead>
                  <TableHead>{t('changes')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.items.map((log: AuditLog) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{log.userEmail || 'System'}</div>
                          <div className="text-xs text-muted-foreground">{log.remoteIp || 'N/A'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {log.entityName} #{log.entityId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {log.correlationId ? log.correlationId.split('-')[0] + '...' : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {log.hash ? (
                        <span className="text-green-600 font-mono text-xs flex items-center gap-1" title={log.hash}>
                          <Shield className="h-3 w-3" />
                          {log.hash.substring(0, 8)}...
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-mono text-xs">{t('unsigned')}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs space-y-1">
                        {log.newValues && (
                          <div className="text-xs text-green-600 truncate" title={log.newValues}>
                            + {log.newValues}
                          </div>
                        )}
                        {log.oldValues && (
                          <div className="text-xs text-red-600 truncate" title={log.oldValues}>
                            - {log.oldValues}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!data?.hasPreviousPage}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('previous')}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t('page')} {data?.pageNumber} {t('of')} {data?.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={!data?.hasNextPage}
              className="flex items-center gap-2"
            >
              {t('next')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage;
