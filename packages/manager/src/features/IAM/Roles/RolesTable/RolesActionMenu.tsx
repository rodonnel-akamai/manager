import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import type { Action } from 'src/components/ActionMenu/ActionMenu';

export const RolesActionMenu = () => {
  const history = useHistory();

  const roleActions: Action[] = [
    {
      onClick: () => {
        history.push(`/iam/roles`);
      },
      title: 'Go here',
    },
  ];

  return (
    <ActionMenu
      actionsList={roleActions}
      ariaLabel={`Action menu for this role`}
    />
  );
};
