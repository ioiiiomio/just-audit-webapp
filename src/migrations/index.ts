import * as migration_20260703_044517 from './20260703_044517';
import * as migration_20260706_122724_add_contact_details from './20260706_122724_add_contact_details';
import * as migration_20260916_044847 from './20260916_044847';
import * as migration_20261001_143441_projects from './20261001_143441_projects';
import * as migration_20261023_092050_localize_team_member_name from './20261023_092050_localize_team_member_name';
import * as migration_20261023_103749_team_carousel from './20261023_103749_team_carousel';
import * as migration_20261023_105732_team_carousel from './20261023_105732_team_carousel';
import * as migration_20261023_115643_announcement_modal from './20261023_115643_announcement_modal';
import * as migration_20261023_115811_announcement_modal from './20261023_115811_announcement_modal';
import * as migration_20261023_122640_announcement_modal from './20261023_122640_announcement_modal';
import * as migration_20261023_123047_announcement_modal from './20261023_123047_announcement_modal';
import * as migration_20261023_123143_announcement_modal from './20261023_123143_announcement_modal';

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
    name: '20261023_092050_localize_team_member_name',
  },
  {
    up: migration_20261023_103749_team_carousel.up,
    down: migration_20261023_103749_team_carousel.down,
    name: '20261023_103749_team_carousel',
  },
  {
    up: migration_20261023_105732_team_carousel.up,
    down: migration_20261023_105732_team_carousel.down,
    name: '20261023_105732_team_carousel',
  },
  {
    up: migration_20261023_115643_announcement_modal.up,
    down: migration_20261023_115643_announcement_modal.down,
    name: '20261023_115643_announcement_modal',
  },
  {
    up: migration_20261023_115811_announcement_modal.up,
    down: migration_20261023_115811_announcement_modal.down,
    name: '20261023_115811_announcement_modal',
  },
  {
    up: migration_20261023_122640_announcement_modal.up,
    down: migration_20261023_122640_announcement_modal.down,
    name: '20261023_122640_announcement_modal',
  },
  {
    up: migration_20261023_123047_announcement_modal.up,
    down: migration_20261023_123047_announcement_modal.down,
    name: '20261023_123047_announcement_modal',
  },
  {
    up: migration_20261023_123143_announcement_modal.up,
    down: migration_20261023_123143_announcement_modal.down,
    name: '20261023_123143_announcement_modal'
  },
];
