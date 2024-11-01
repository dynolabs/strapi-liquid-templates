import { NavLink } from "react-router-dom";

import {
    SubNav, SubNavHeader, SubNavLink, SubNavSection, SubNavSections
} from "@strapi/design-system";

import { PLUGIN_ID } from "../../pluginId";
import { getMessage } from "../../utils/getMessage";

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
