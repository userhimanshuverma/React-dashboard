import React, { useMemo, useState } from 'react';
import {
  ColumnDef,
  useReactTable,
  VisibilityState,
  CellContext,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { CSVLink } from 'react-csv';
import { FiDownload, FiEye, FiEyeOff } from 'react-icons/fi';
import mockData from '../data/salesData.json';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, LineChart, Line
} from 'recharts';
import { motion } from 'framer-motion';
import logo from '../components/img.png';

const SalesDashboard: React.FC = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [tableData] = useState<Record<string, any>[]>(mockData);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => {
    if (tableData.length === 0) return [];

    const keys = Object.keys(tableData[0]);
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      ...keys.map(key => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        cell: (info: CellContext<Record<string, any>, any>) => String(info.getValue()),
        enableColumnFilter: true,
      })),
    ];
  }, [tableData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
      rowSelection,
      globalFilter,
      columnFilters,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnFilters: true,
  });

  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
  const totalSales = data.reduce((acc, curr) => acc + Number(curr.sales || 0), 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-gray-100 to-white rounded-lg">
      {/* Sidebar */}
      <aside className="md:w-72 w-full bg-gradient-to-b from-gray-800 to-teal-700 text-white p-6 flex flex-col items-center shadow-xl space-y-6 rounded-lg">
        <img src={logo} alt="logo" className="w-28 h-28 rounded-full border-4 border-white shadow-md" />
        <h1 className="text-2xl font-bold text-center">Himanshu Verma</h1>
        <p className="text-sm text-gray-200">Welcome to the dashboard</p>
        <nav className="w-full space-y-2">
          <a href="https://github.com/userhimanshuverma" className="block w-full text-center py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition">Github</a>
          <a href="https://www.linkedin.com/in/himanshu-verma-822a07286/" className="block w-full text-center py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition">Linkedin</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-teal-700">Sales Dashboard</h1>
          <input
            className="border rounded px-3 py-1 shadow"
            placeholder="Search..."
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
          />
        </header>

        {/* Total Sales */}
        <div className="text-lg font-semibold text-gray-700">
          Total Sales: <span className="text-teal-700 font-bold">{totalSales.toLocaleString()}</span>
        </div>

        {/* Actions */}
        <motion.div layout className="flex flex-wrap items-center gap-3">
          <CSVLink
            data={selectedRows}
            filename="export.csv"
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-1"
          >
            <FiDownload /> Export CSV
          </CSVLink>

          {table.getAllLeafColumns().map(column => (
            <button
              key={column.id}
              onClick={() => column.toggleVisibility()}
              className="border px-3 py-1 rounded-lg hover:bg-teal-100 text-sm flex items-center gap-1"
            >
              {column.getIsVisible() ? <FiEye /> : <FiEyeOff />} {column.id}
            </button>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-center text-teal-700 font-semibold mb-2">Sales by Product</h2>
            {tableData.length ? (
              <BarChart width={300} height={200} data={tableData}>
                <CartesianGrid strokeDasharray="3 3" />

                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#14b8a6" />
              </BarChart>
            ) : <p className="text-center text-sm text-gray-500">No data</p>}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-center text-teal-700 font-semibold mb-2">Sales Distribution</h2>
            {tableData.length ? (
              <PieChart width={300} height={260}>
                <Pie data={tableData} dataKey="sales" nameKey="product" cx="50%" cy="50%" outerRadius={80} fill="#5eead4" label />
                <Tooltip />
              </PieChart>
            ) : <p className="text-center text-sm text-gray-500">No data</p>}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <h2 className="text-center text-teal-700 font-semibold mb-2">Sales Trend</h2>
            {tableData.length ? (
              <LineChart width={300} height={200} data={tableData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#0f766e" />
              </LineChart>
            ) : <p className="text-center text-sm text-gray-500">No data</p>}
          </div>
        </motion.div>

        {/* Data Table */}
        <motion.div layout className="bg-white rounded-2xl shadow-md overflow-x-auto">
          <div className="bg-teal-600 text-white px-4 py-2 rounded-t-2xl font-semibold text-center">Sales Data Table</div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-teal-50">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="px-4 py-2 text-left">
                      {header.isPlaceholder ? null : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={row.getIsSelected() ? 'bg-teal-100' : 'hover:bg-teal-50'}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
          <div className="space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 bg-teal-200 hover:bg-teal-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 bg-teal-200 hover:bg-teal-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {[5, 10, 20, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;