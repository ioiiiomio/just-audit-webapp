import type { CollectionConfig } from "payload";

export const NavItems: CollectionConfig = {
  slug: "nav-items",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "href", "type", "order"],
  },
  access: {
    read: () => true,
  },
  defaultSort: "order",
  fields: [
    {
      name: "label",
      type: "text",
      localized: true, // no required:true on localized fields — locale-switch save bug
    },
    {
      name: "href",
      type: "text",
      required: true,
      admin: {
        description: 'e.g. "#about" for an anchor or "/team" for a route',
      },
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "anchor",
      options: [
        { label: "Anchor (scroll on homepage)", value: "anchor" },
        { label: "Route (separate page)", value: "route" },
      ],
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "showInNavbar",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "showInFooter",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
