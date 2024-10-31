import { SubNavHeader } from '@strapi/design-system';
import { SubNavLink } from '@strapi/design-system';
import { SubNavSection } from '@strapi/design-system';
import { SubNavSections } from '@strapi/design-system';
import { SubNav } from '@strapi/design-system';
import { Box } from '@strapi/design-system';
import { GridNine, WarningCircle } from '@strapi/icons';
import { getMessage } from '../utils/getMessage';
import { NavLink } from 'react-router-dom';
import { PLUGIN_ID } from '../pluginId';

const SideNavBar = () => {
  const LINKS = [
    {
      id: 1,
      label: getMessage('label.baseTemplates'),
      href: `/plugins/${PLUGIN_ID}/templates/base`,
    },
    {
      id: 2,
      label: getMessage('label.customTemplates'),
      href: `/plugins/${PLUGIN_ID}/templates/custom`,
    },
    {
      id: 3,
      label: getMessage('label.coreTemplates'),
      href: `/plugins/${PLUGIN_ID}/templates/core`,
    },
  ];

  return (
    <SubNav aria-label="Side navbar">
      <SubNavHeader label={getMessage('plugin.name')} />
      <SubNavSections>
        <SubNavSection label={getMessage('label.templateTypes')}>
          {LINKS.map((link) => (
            <SubNavLink
              tag={NavLink}
              to={{
                pathname: link.href,
              }}
              key={link.id}
              isSubSectionChild
            >
              {link.label}
            </SubNavLink>
          ))}
        </SubNavSection>
      </SubNavSections>
    </SubNav>
  );
};

export { SideNavBar };
