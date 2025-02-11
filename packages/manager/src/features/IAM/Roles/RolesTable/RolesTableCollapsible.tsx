import React from 'react';
import { useOrder } from 'src/hooks/useOrder';
import { StyledLinkButton, Typography } from '@linode/ui';
import { useTheme } from '@mui/material/styles';
import {
  CollapsibleTable,
  TableItem,
} from 'src/components/CollapsibleTable/CollapsibleTable';
import { TableRowEmpty } from 'src/components/TableRowEmpty/TableRowEmpty';
import { TableRow } from 'src/components/TableRow';
import { TableSortCell } from 'src/components/TableSortCell';
import { TableCell } from 'src/components/TableCell';
import { Permissions } from 'src/features/IAM/Shared/Permissions/Permissions';
import { truncate } from 'src/utilities/truncate';
import { RolesActionMenu } from 'src/features/IAM/Roles/RolesTable/RolesActionMenu';
import { UiRole } from 'src/features/IAM/Roles/RolesTable/Roles';

export interface RolesTableCollapsibleProps {
  uiRoles: UiRole[];
}

export const RolesTableCollapsible = (props: RolesTableCollapsibleProps) => {
  const order = useOrder();
  const theme = useTheme();

  const { uiRoles } = props;

  const RolesTableRowHead = (
    <TableRow>
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
        sx={{ width: '45%' }}
      >
        Description
      </TableSortCell>
      <TableCell sx={{ width: '5%' }} />
    </TableRow>
  );

  const [showFullDescription, setShowFullDescription] = React.useState(false);

  const getTableItems = (): TableItem[] => {
    return uiRoles.map((uiRole) => {
      const description =
        uiRole.description.length < 150 || showFullDescription
          ? uiRole.description
          : truncate(uiRole.description, 150);
      const OuterTableCells = (
        <>
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
        </>
      );

      const InnerTable = <Permissions permissions={uiRole.permissions} />;

      return {
        InnerTable,
        OuterTableCells,
        id: uiRole.name,
        label: uiRole.name,
      };
    });
  };

  return (
    <>
      <CollapsibleTable
        TableRowEmpty={
          <TableRowEmpty colSpan={4} message={'No Roles are assigned.'} />
        }
        TableItems={getTableItems()}
        TableRowHead={RolesTableRowHead}
      />
    </>
  );
};
