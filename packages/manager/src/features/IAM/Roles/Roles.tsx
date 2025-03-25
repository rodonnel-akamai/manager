import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableRowExpanded,
  sortRows,
} from 'akamai-cds-react-components/Table';

import type { Order } from 'akamai-cds-react-components/Table';

type Row = {
  name: string;
  rank: number;
  team: string;
};

const ROWS: Row[] = [
  { name: 'Michael Thomas', rank: 1, team: 'No' },
  { name: 'Julio Jones', rank: 2, team: 'ATL' },
  { name: 'Chris Godwin', rank: 3, team: 'TB' },
  { name: 'Travis Kelce', rank: 4, team: 'KC' },
];

export const RolesLanding = () => {

  const [rows, setRows] = useState(ROWS);

  const [sort, setSort] = useState<
    { column: string; order: Order } | undefined
  >(undefined);

  const [selectedRows, setSelectedRows] = useState<Row[]>([]);

  const areAllSelected = () => {
    return rows.length === selectedRows.length;
  };

  const handleSort = (event: CustomEvent, column: string) => {
    setSort({ column, order: event.detail as Order });
    const visibileRows = sortRows(rows, event.detail as Order, column);
    setRows(visibileRows);
  };

  const handleSelect = (event: CustomEvent, row: 'all' | Row) => {
    if (row === 'all') {
      setSelectedRows(areAllSelected() ? [] : rows);
    } else if (selectedRows.includes(row)) {
      setSelectedRows(selectedRows.filter((r) => r !== row));
    } else {
      setSelectedRows([...selectedRows, row]);
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow
            headerborder
            select={(event) => handleSelect(event, 'all')}
            selectable
            selected={areAllSelected()}
          >
            <TableHeaderCell
              sort={(event) => handleSort(event, 'rank')}
              sortable
              sorted={sort?.column === 'rank' ? sort.order : undefined}
            >
              Rank
            </TableHeaderCell>
            <TableHeaderCell
              sort={(event) => handleSort(event, 'name')}
              sortable
              sorted={sort?.column === 'name' ? sort.order : undefined}
            >
              Name
            </TableHeaderCell>
            <TableHeaderCell
              sort={(event) => handleSort(event, 'team')}
              sortable
              sorted={sort?.column === 'team' ? sort.order : undefined}
            >
              Team
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              expandable
              hoverable
              key={row.name}
              rowborder
              select={(event) => handleSelect(event, row)}
              selectable
              selected={selectedRows.includes(row)}
            >
              <TableCell>{row.rank}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.team}</TableCell>
              <TableRowExpanded slot="expanded">
                <p>Expanded Row</p>
              </TableRowExpanded>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
