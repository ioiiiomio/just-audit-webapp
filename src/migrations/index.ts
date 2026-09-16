import * as migration_20260703_044517 from './20260703_044517';
import * as migration_20260706_122724_add_contact_details from './20260706_122724_add_contact_details';
import * as migration_20260916_044847 from './20260916_044847';

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
    name: '20260916_044847'
  },
];
