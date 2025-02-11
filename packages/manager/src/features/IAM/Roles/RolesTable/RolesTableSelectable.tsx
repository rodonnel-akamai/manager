import React from 'react';
import { useOrder } from 'src/hooks/useOrder';
import { StyledLinkButton, Typography } from '@linode/ui';
import { useTheme } from '@mui/material/styles';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';
import { TableCell } from 'src/components/TableCell';
import { truncate } from 'src/utilities/truncate';
import { RolesActionMenu } from 'src/features/IAM/Roles/RolesTable/RolesActionMenu';
import { UiRole } from 'src/features/IAM/Roles/RolesTable/Roles';
import { SelectableTableRow } from 'src/components/SelectableTableRow/SelectableTableRow';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';

export interface RolesTableSelectableProps {
  uiRoles: UiRole[];
}

export const RolesTableSelectable = (props: RolesTableSelectableProps) => {
  const order = useOrder();
  const theme = useTheme();

  const { uiRoles } = props;

  const RolesTableRowHead = () => {
    return (
      <TableRow>
        <TableCell sx={{ width: '5%' }} />
        <TableSortCell
          active={order.orderBy === 'name'}
          direction={order.order}
          handleClick={order.handleOrderChange}
          label="name"
          sx={{ width: '19%' }}
        >
          Role
        </TableSortCell>
        <TableSortCell
          active={order.orderBy === 'type'}
          direction={order.order}
          handleClick={order.handleOrderChange}
          label="type"
          sx={{ width: '31%' }}
        >
          Role Type
        </TableSortCell>
        <TableSortCell
          active={order.orderBy === 'description'}
          direction={order.order}
          handleClick={order.handleOrderChange}
          label="description"
          sx={{ width: '40%' }}
        >
          Description
        </TableSortCell>
        <TableCell sx={{ width: '5%' }} />
      </TableRow>
    );
  };

  const [showFullDescription, setShowFullDescription] = React.useState(false);

  const RolesTableSelectableRow = ({ uiRole }: { uiRole: UiRole }) => {
    const description =
      uiRole.description.length < 150 || showFullDescription
        ? uiRole.description
        : truncate(uiRole.description, 150);
    return (
      <>
        <SelectableTableRow key={uiRole.name}>
          <TableCell noWrap>{uiRole.name}</TableCell>
          <TableCell noWrap>{uiRole.type}</TableCell>
          <TableCell>
            <Typography sx={{ overflowWrap: 'anywhere', wordBreak: 'normal' }}>
              {description}{' '}
              {description.length > 150 && (
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
        </SelectableTableRow>
      </>
    );
  };

  return (
    <>
      <Table aria-label="List of Roles">
        <RolesTableRowHead />
        <TableBody>
          {uiRoles.map((uiRole) => (
            <RolesTableSelectableRow key={uiRole.name} uiRole={uiRole} />
          ))}
        </TableBody>
      </Table>
    </>
  );
};
