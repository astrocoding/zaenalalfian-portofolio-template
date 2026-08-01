import * as React from "react";
import { AdminPagination } from "@/components/admin/AdminPagination";

export interface AdminContentColumn<T> {
    header: React.ReactNode;
    className?: string;
    headerClassName?: string;
    render: (item: T) => React.ReactNode;
}

export interface AdminContentProps<T> {
    // Data
    items: T[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    baseUrl: string;
    emptyMessage?: string;
    getItemKey: (item: T) => string | number;

    // Desktop Table Configuration
    columns: AdminContentColumn<T>[];
    tableHeaderClass?: string;

    // Mobile Card Configuration
    renderMobileCard: (item: T) => React.ReactNode;
}

export function AdminContent<T>({
    items,
    totalItems,
    currentPage,
    totalPages,
    pageSize,
    baseUrl,
    emptyMessage = "No items found in database.",
    getItemKey,
    columns,
    tableHeaderClass = "bg-primary border-b border-border-warm font-serif text-white text-xs uppercase tracking-wider",
    renderMobileCard,
}: AdminContentProps<T>) {
    return (
        <div className="space-y-6">
            {/* Desktop Table View (lg+) */}
            <div className="hidden lg:block bg-surface border border-border-warm rounded-xl overflow-hidden shadow-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className={tableHeaderClass}>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={col.headerClassName || "p-4 text-white"}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-subtle">
                            {items.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="p-8 text-center text-ink-muted font-mono text-xs"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr
                                        key={getItemKey(item)}
                                        className="hover:bg-black/2 transition-colors"
                                    >
                                        {columns.map((col, idx) => (
                                            <td key={idx} className={col.className || "p-4"}>
                                                {col.render(item)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Interactive Pagination (Desktop) */}
                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    baseUrl={baseUrl}
                />
            </div>

            {/* Mobile & Tablet Card List View (< lg) */}
            <div className="block lg:hidden space-y-3.5">
                {items.length === 0 ? (
                    <div className="bg-surface border border-border-warm rounded-xl p-6 text-center text-ink-muted font-mono text-xs shadow-card">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {items.map((item) => (
                            <React.Fragment key={getItemKey(item)}>
                                {renderMobileCard(item)}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* Interactive Pagination (Mobile) */}
                <AdminPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    baseUrl={baseUrl}
                />
            </div>
        </div>
    );
}
