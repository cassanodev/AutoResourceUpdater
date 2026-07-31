import type { ResourceTree } from "./typings";

export const RESOURCES: ResourceTree = {
  Framework: {
    qbx: {
      qbx_core: {
        version: "v1.2.0",
        latestVersion: "v1.2.4",
        source: "github",
        status: "update-available",
      },
      qbx_apartments: {
        version: "v1.0.3",
        latestVersion: "v1.0.3",
        source: "github",
        status: "up-to-date",
      },
    },
    ox: {
      ox_lib: {
        version: "v3.10.2",
        latestVersion: "v3.12.0",
        source: "github",
        status: "update-available",
      },
      oxmysql: {
        version: "v2.9.0",
        latestVersion: "v2.9.0",
        source: "github",
        status: "up-to-date",
      },
    },
  },
  Systems: {
    "qb-inventory": {
      version: "v2.1.0",
      latestVersion: "v2.1.0",
      source: "github",
      status: "up-to-date",
    },
    economy: {
      "qb-banking": {
        version: "v1.4.1",
        latestVersion: "v1.5.0",
        source: "github",
        status: "update-available",
      },
      vehicles: {
        dealership: {
          "qb-vehicleshop": {
            version: "v1.0.0",
            latestVersion: "v1.0.0",
            source: "github",
            status: "up-to-date",
          },
        },
      },
    },
    property: {
      "ps-housing": {
        version: "v1.0.5",
        latestVersion: "v1.1.2",
        source: "github",
        status: "update-available",
      },
    },
  },
  Jobs: {
    "law-enforcement": {
      "qb-policejob": {
        version: "v1.1.0",
        latestVersion: "v1.1.0",
        source: "github",
        status: "up-to-date",
      },
    },
    medical: {
      "qb-ambulancejob": {
        version: "v1.0.9",
        latestVersion: "v1.1.4",
        source: "github",
        status: "update-available",
      },
    },
  },
  Interface: {
    hud: {
      "qb-hud": {
        version: "v1.3.0",
        latestVersion: "v1.3.0",
        source: "github",
        status: "up-to-date",
      },
    },
    menus: {
      "qb-menu": {
        version: "v1.0.2",
        latestVersion: "v1.0.4",
        source: "github",
        status: "update-available",
      },
    },
  },
  Assets: {
    weapons: {
      custom_weapons: {
        version: "v1.0.0",
        latestVersion: "v1.0.0",
        source: "manual",
        status: "up-to-date",
      },
    },
    maps: {
      custom_mlo_bank: {
        version: "v1.2.0",
        latestVersion: "v1.2.0",
        source: "manual",
        status: "up-to-date",
      },
    },
  },
};