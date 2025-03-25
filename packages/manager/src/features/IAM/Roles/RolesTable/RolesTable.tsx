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
import { UiRole } from 'src/features/IAM/Roles/RolesTable/Roles';
import { StyledLinkButton, Typography } from '@linode/ui';
import { RolesActionMenu } from 'src/features/IAM/Roles/RolesTable/RolesActionMenu';
import { AssignedPermissionsPanel } from 'src/features/IAM/Shared/AssignedPermissionsPanel/AssignedPermissionsPanel';
import { getRoleByName } from 'src/features/IAM/Shared/utilities';

interface Props {
  roles: UiRole[];
}

export const RolesTable = ({roles}: Props) => {

  const [rows, setRows] = useState(roles);

  const [sort, setSort] = useState<
    { column: string; order: Order } | undefined
  >(undefined);

  const [selectedRows, setSelectedRows] = useState<UiRole[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const areAllSelected = () => {
    return rows.length === selectedRows.length;
  };

  const handleSort = (event: CustomEvent, column: string) => {
    setSort({ column, order: event.detail as Order });
    const visibleRows = sortRows(rows, event.detail as Order, column);
    setRows(visibleRows);
  };

  const handleSelect = (event: CustomEvent, row: 'all' | UiRole) => {
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
              sort={(event) => handleSort(event, 'name')}
              sortable
              sorted={sort?.column === 'name' ? sort.order : undefined}
            >
              Role
            </TableHeaderCell>
            <TableHeaderCell
              sort={(event) => handleSort(event, 'type')}
              sortable
              sorted={sort?.column === 'type' ? sort.order : undefined}
            >
              Role Type
            </TableHeaderCell>
            <TableHeaderCell
              sort={(event) => handleSort(event, 'description')}
              sortable
              sorted={sort?.column === 'description' ? sort.order : undefined}
            >
              Description
            </TableHeaderCell>
            <TableHeaderCell>
              &nbsp;
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
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>
                <Typography sx={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}>
                  {row.description}{' '}
                  {row.description.length > 150 && (
                    <StyledLinkButton
                      onClick={() => setShowFullDescription((show) => !show)}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      Read {showFullDescription ? 'Less' : 'More'}
                    </StyledLinkButton>
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                <RolesActionMenu />
              </TableCell>
              <TableRowExpanded slot="expanded">
                <AssignedPermissionsPanel
                  role={getRoleByName(row.permissions, row.name)!}
                />
              </TableRowExpanded>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};
