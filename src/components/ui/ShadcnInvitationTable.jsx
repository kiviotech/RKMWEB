import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper
} from "@tanstack/react-table";

export function ShadcnInvitationTable({ data = [], onSelectRows }) {
  const columnHelper = createColumnHelper();
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Helper: get name field (username or name)
  const getName = (row) => row.name || row.username || "";

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => {
          // Fix for indeterminate warning
          const ref = React.useRef();
          React.useEffect(() => {
            if (ref.current) {
              ref.current.indeterminate = table.getIsSomeRowsSelected();
            }
          }, [table.getIsSomeRowsSelected()]);
          return (
            <input
              ref={ref}
              type="checkbox"
              checked={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          );
        },
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 32,
      },
      columnHelper.accessor(row => getName(row), {
        id: "name",
        header: () => "Name",
        cell: info => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true
      }),
      columnHelper.accessor("email", {
        header: "Email",
        enableSorting: true,
        enableColumnFilter: true
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        enableSorting: true,
        enableColumnFilter: true
      }),
      columnHelper.accessor("address", {
        header: "Address",
        enableSorting: true,
        enableColumnFilter: true
      }),
      columnHelper.accessor("totalDonations", {
        header: "Total Donations",
        cell: info => `₹${info.getValue() || 0}`,
        enableSorting: true
      }),
      columnHelper.accessor("deeksha", {
        header: "Deeksha",
        cell: info => info.getValue() ? "Yes" : "No",
        enableSorting: true
      })
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      globalFilter
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: false
  });

  // Call parent on row selection change if needed
  React.useEffect(() => {
    if (onSelectRows) {
      onSelectRows(table.getSelectedRowModel().rows.map(row => row.original));
    }
  }, [rowSelection]);

  // Helper: get initials for avatar
  const getInitials = (name, email) => {
    if (name && typeof name === "string" && name.length > 0) return name.charAt(0).toUpperCase();
    if (email && typeof email === "string" && email.length > 0) return email.charAt(0).toUpperCase();
    return "?";
  };

  // Top bar: Title, search, and New Invitation button
  return (
    <div className="shadcn-card user-list">
      <div className="user-list-header flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex-1 flex items-center gap-2">
          <span className="shadcn-card-title text-lg font-bold text-gray-800 mr-4">Invitations</span>
          <div className="search-input-wrapper relative w-full max-w-xs">
            <svg className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              className="pl-7 pr-3 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm shadow-sm w-full transition-all bg-white"
              placeholder="Search invitations..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>
        <button className="shadcn-btn bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-primary-dark transition-all" onClick={() => alert('Open new invitation modal')}>+ New Invitation</button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-lg">
        <table className="user-list-table min-w-full text-sm">
          <thead className="sticky top-0 bg-gray-100 z-20">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-bold text-gray-800 border-b border-gray-200 bg-gray-100 sticky top-0 z-20"
                    style={{ minWidth: header.column.columnDef.size || 100 }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <button
                          className="ml-1 text-xs text-gray-500 hover:text-blue-600 focus:outline-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.getIsSorted() === false && <span>⇅</span>}
                          {header.column.getIsSorted() === "asc" && <span>▲</span>}
                          {header.column.getIsSorted() === "desc" && <span>▼</span>}
                        </button>
                      )}
                    </div>
                    {header.column.getCanFilter() && (
                      <input
                        className="mt-1 border border-gray-300 focus:ring-2 focus:ring-blue-200 px-2 py-1 rounded text-xs w-full transition-all"
                        placeholder={`Filter...`}
                        value={header.column.getFilterValue() || ""}
                        onChange={e => header.column.setFilterValue(e.target.value)}
                        onClick={e => e.stopPropagation()}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="max-h-[420px] overflow-y-auto block w-full">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-gray-400">
                  No invitations found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => {
                const invite = row.original;
                return (
                  <tr
                    key={row.id}
                    className={
                      `transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ` +
                      (row.getIsSelected() ? "!bg-blue-50" : "") +
                      " hover:bg-blue-50"
                    }
                  >
                    {/* Avatar */}
                    <td className="align-middle">
                      <div className="user-avatar-small bg-primary-light text-primary font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                        {getInitials(invite.name || invite.username, invite.email)}
                      </div>
                    </td>
                    {/* Name */}
                    <td className="align-middle font-medium text-gray-900">{invite.name || invite.username || 'N/A'}</td>
                    {/* Email */}
                    <td className="align-middle text-gray-700">{invite.email || 'N/A'}</td>
                    {/* Status Badge */}
                    <td className="align-middle">
                      <span className={`user-role-badge ${invite.status ? invite.status.toLowerCase() : ''}`}>{invite.status || 'N/A'}</span>
                    </td>
                    {/* Created Date */}
                    <td className="align-middle text-gray-500">{invite.createdAt ? (new Date(invite.createdAt)).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</td>
                    {/* Actions */}
                    <td className="align-middle">
                      <div className="action-buttons flex gap-2">
                        <button className="shadcn-btn" title="Edit" onClick={() => alert('Edit invitation')}>{/* Edit icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button className="shadcn-btn" title="Resend" onClick={() => alert('Resend invitation')}>{/* Resend icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M1 19a9 9 0 0 0 14-7V4"></path></svg>
                        </button>
                        <button className="shadcn-btn text-destructive" title="Delete" onClick={() => alert('Delete invitation')}>{/* Delete icon */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
