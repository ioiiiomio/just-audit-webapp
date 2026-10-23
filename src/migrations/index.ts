import * as migration_20260703_044517 from './20260703_044517';
import * as migration_20260706_122724_add_contact_details from './20260706_122724_add_contact_details';
import * as migration_20260916_044847 from './20260916_044847';
import * as migration_20261001_143441_projects from './20261001_143441_projects';
import * as migration_20261023_092050_localize_team_member_name from './20261023_092050_localize_team_member_name';

export const migrations = [
  {
    up: migration_20260703_044517.up,
    down: migration_20260703_044517.down,
    name: '20260703_044517',
  },
  {
    up: migration_20260706_122724_add_contact_details.up,
    down: migration_20260706_122724_add_contact_details.down,
    name: '20260706_122724_add_contact_details',
  },
  {
    up: migration_20260916_044847.up,
    down: migration_20260916_044847.down,
    name: '20260916_044847',
  },
  {
    up: migration_20261001_143441_projects.up,
    down: migration_20261001_143441_projects.down,
    name: '20261001_143441_projects',
  },
  {
    up: migration_20261023_092050_localize_team_member_name.up,
    down: migration_20261023_092050_localize_team_member_name.down,
    name: '20261023_092050_localize_team_member_name'
  },
];
