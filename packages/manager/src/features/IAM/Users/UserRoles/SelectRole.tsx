import { Autocomplete } from '@linode/ui';
import React from 'react';

import { AssignedPermissionsPanel } from 'src/features/IAM/Shared/AssignedPermissionsPanel/AssignedPermissionsPanel';
import { getRoleByName } from 'src/features/IAM/Shared/utilities';

import type { IamAccountPermissions } from '@linode/api-v4';
import type { RolesType } from 'src/features/IAM/Shared/utilities';

interface Props {
  options: RolesType[];
  permissions: IamAccountPermissions;
}

export const SelectRole = ({ options, permissions }: Props) => {
  const [selectedOption, setSelectedOption] = React.useState<RolesType | null>(
    null
  );

  // Get the selected role based on the `selectedOptions`
  const selectedRole = React.useMemo(() => {
    if (!selectedOption || !permissions) {
      return null;
    }
    return getRoleByName(permissions, selectedOption.value);
  }, [selectedOption, permissions]);

  // TODO - add a link 'Learn more" - UIE-8534
  return (
    <>
      <br />
      <Autocomplete
        renderOption={(props, option) => (
          <li {...props} key={option.label}>
            {option.label}
          </li>
        )}
        label="Assign New Roles"
        onChange={(_, value) => setSelectedOption(value)}
        options={options}
        placeholder="Select a Role"
        textFieldProps={{ hideLabel: true, noMarginTop: true }}
      />
      <br />
      {selectedRole && (
        <AssignedPermissionsPanel key={selectedRole.name} role={selectedRole} />
      )}
      <br />
    </>
  );
};
