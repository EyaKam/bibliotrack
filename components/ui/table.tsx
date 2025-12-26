// components/ui/table.tsx
import React from "react";

// Main Table wrapper
export const Table = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <table className={`min-w-full border border-gray-200 ${className}`}>
    {children}
  </table>
);

// Table Header container
export const TableHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <thead className={`bg-gray-100 ${className}`}>{children}</thead>;

// Table Body container
export const TableBody = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <tbody className={className}>{children}</tbody>;

// Table Row
export const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <tr className={`border-b ${className}`}>{children}</tr>;

// Table Cell
export const TableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <td className={`px-4 py-2 ${className}`}>{children}</td>;

// Table Head (for column headers)
export const TableHead = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <th className={`px-4 py-2 text-left ${className}`}>{children}</th>;
