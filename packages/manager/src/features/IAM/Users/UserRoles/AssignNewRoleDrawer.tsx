import { Typography } from '@linode/ui';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Drawer } from 'src/components/Drawer';
import { Link } from 'src/components/Link';
import { LinkButton } from 'src/components/LinkButton';
import { StyledLinkButtonBox } from 'src/components/SelectFirewallPanel/SelectFirewallPanel';
import { SelectRole } from 'src/features/IAM/Users/UserRoles/SelectRole';
import { useAccountPermissions } from 'src/queries/iam/iam';

import { getAllRoles } from '../../Shared/utilities';

import type { RolesType } from '../../Shared/utilities';

interface Props {
  onClose: () => void;
  open: boolean;
}

export const AssignNewRoleDrawer = ({ onClose, open }: Props) => {
  const {
    control,
    formState: { isDirty, isSubmitting },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      selectedRoles: [],
    },
  });

  const {
    data: accountPermissions,
    isLoading: accountPermissionsLoading
  } = useAccountPermissions();

  const allRoles = React.useMemo(() => {
    if (!accountPermissions) {
      return [];
    }
    return getAllRoles(accountPermissions);
  }, [accountPermissions]);

  const onSubmit = async (data: {
    selectedRoles: RolesType[];
  }) => {
    try {
      // TODO - Need to submit data to the API
      // eslint-disable-next-line no-console
      console.log('they want these roles', data);
      handleClose();
    } catch (errors) {
      for (const error of errors) {
        setError(error?.field ?? 'root', { message: error.reason });
      }
    }
  };

  const handleClose = () => {
    // eslint-disable-next-line no-console
    console.log('wanting to close');
    onClose();
  };

  const addNewRoleSelect = () => {
    // TODO - make this real
    // onChange([...selectedRoles, { }]);
    // eslint-disable-next-line no-console
    console.log('trying to add a new input');
  };

  // TODO - add a link 'Learn more" - UIE-8534
  return (
    <Drawer onClose={onClose} open={open} title="Assign New Roles">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography sx={{ marginBottom: 2.5 }}>
          Select a role you want to assign to a user. Some roles require
          selecting resources they should apply to. Configure the first role
          and continue continue adding roles or save the assignment.
          <Link to=""> Learn more about roles and permissions.</Link>
        </Typography>

        {/* TODO - one of these per role */}

        {!accountPermissionsLoading && !!accountPermissions && (
          <Controller
            render={({ field }) => (
              <SelectRole options={allRoles} permissions={accountPermissions}></SelectRole>
            )}
            control={control}
            name="selectedRoles"
          />
        )}


        {/*  TODO - once one is added, put this link in here? */}

        <StyledLinkButtonBox sx={{ marginTop: '12px' }}>
          <LinkButton onClick={addNewRoleSelect}>Add another role</LinkButton>
        </StyledLinkButtonBox>

        <ActionsPanel
          primaryButtonProps={{
            disabled: !isDirty,
            label: 'Assign',
            loading: isSubmitting,
            type: 'submit',
          }}
          secondaryButtonProps={{
            label: 'Cancel',
            onClick: onClose,
          }}
        />
      </form>
    </Drawer>
  );
};
