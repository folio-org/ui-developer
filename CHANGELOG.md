# Change history for ui-developer

## 11.0.0 IN PROGRESS

* Add `settings.enabled` as a subpermission to all permission sets so they can be accessed in the UI if enabled individually. Refs UID-199.
* *BREAKING* Refactor `UserLocale` component to use mod-settings API instead of mod-configuration; remove `Locale` field. Refs UID-202.
* Support longer queries in ShowCapabilities dev tool. Refs UID-201.
* Session timezone support. Refs UID-204.

## [10.0.0](https://github.com/folio-org/ui-developer/tree/v10.0.0) (2025-03-17)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v9.0.0...v10.0.0)

* Sort locales by label instead of locale-code. Refs UID-107.
* When the Permissions Inspector encounters an undefined permission (which should never happen) it now shows that permission's true name in bold red instead of crashing. Fixes UID-183.
* Hide "I can haz endpoint" and "Permissions inspector" if the `roles` interface is present. Refs UID-151.
* Include missing user-related permissions in `settings.userLocale`. Refs UID-126.
* Add `okapi` interface to dependencies. (We have long depended on this.) Fixes UID-184.
* *BREAKING* Update `react-intl` to v7. Refs UID-187.
* *BREAKING* Update `@folio/stripes` to `v10`. Refs UID-186.
* Provide application icon. Refs UID-197.
* Remove token display; tokens are no longer user-visible. Refs UID-114.

## [9.0.0](https://github.com/folio-org/ui-developer/tree/v9.0.0) (2024-10-09)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v8.0.0...v9.0.0)

* Handle access-control via cookies instead of `X-Okapi-Token` header. Refs UID-121.
* Configuration: expose `preserveConsole` to toggle `console.clear()` on logout. Refs UID-139.
* Optionally suppress react-intl warnings. Refs UID-140.
* Use type=password for auto login password field. Refs UID-147.
* *BREAKING* Purge service-worker cruft; leverage new STCOR functions for RTR display.
* Fence off ShowCapabilities behind IfInterface checks for capabilities, capability-sets. Refs UID-162.

## [8.0.0](https://github.com/folio-org/ui-developer/tree/v8.0.0) (2023-10-19)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v7.0.0...v8.0.0)

* *BREAKING* Upgrade `react` to `v18`. Refs UID-131.
* Bump `react-inspector` to `v6` for react 18 compatibility.
* Bump `@formatjs/cli` to `^6.1.3`.
* *BREAKING* bump `react-intl` to `v6.4.4`. Refs UID-137.
* Bump react-chartjs-2 from 2.11.1 to 5.2.0.
* Provide tools to expire AT, RT. Refs UID-138.

## [7.0.0](https://github.com/folio-org/ui-developer/tree/v7.0.0) (2023-02-24)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v6.3.0...v7.0.0)

* *BREAKING* Increment `stripes` to `v8` and remove unneeded `react-redux`. Refs UID-123.

## [6.3.0](https://github.com/folio-org/ui-developer/tree/v6.3.0) (2022-10-23)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v6.2.0...v6.3.0)

* Translation changes
* Skunkworks app-manager
* More Folio babies!

## [6.2.0](https://github.com/folio-org/ui-developer/tree/v6.2.0) (2022-06-28)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v6.1.0...v6.2.0)

* Replace `babel-eslint` with `@babel/eslint-parser`. Refs UID-111.
* Refactor forms to use final-form. Refs UID-39.
* Remove `react-hot-loader`. Refs UID-110.
* update NodeJS to v16 in CI. Refs UID-115.

## [6.1.0](https://github.com/folio-org/ui-developer/tree/v6.1.0) (2022-03-03)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v6.0.0...v6.1.0)

* Add Permissions Inspector page. Fixes UID-97.
* In the Permissions Inspector, show which module permissions are from. Fixes UID-99.
* Add rudimentary Okapi Console. Fixes UID-104, UID-105.
* Link to GitHub and API doc instead of assuming `/ramls` exists. Refs UID-106.

## [6.0.0](https://github.com/folio-org/ui-developer/tree/v6.0.0) (2021-10-05)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v5.2.1...v6.0.0)

* Remove unnecessarily permissive permissions. Refs UID-87.
* Increment `stripes` to `v7`. Refs UID-92.
* Release for Kiwi R3. Fixes UID-94

## [5.2.1](https://github.com/folio-org/ui-developer/tree/v5.2.1) (2021-07-25)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v5.2.0...v5.2.1)

* Remove TestHotKeys cruft. Refs UID-90, UTEN-65.
* Include necessary permissions for okapi dependencies. Fixes UID-91.

## [5.2.0](https://github.com/folio-org/ui-developer/tree/v5.2.0) (2021-07-23)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v5.1.0...v5.2.0)

* Use dynamic tenant-id. Fixes UID-88.
* Set user numbering system independent of locale. Fixes UID-89.
* Compile translation files into AST format. Fixes UID-76.

## [5.1.0](https://github.com/folio-org/ui-developer/tree/v5.1.0) (2021-06-17)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v5.0.0...v5.1.0)

* Add human-readable permission name to "Current permissions" list. Fixes UID-73.
* Recover from missing `handlers` attribute in Okapi interfaces. Fixes UID-74.
* Add page to list all currently loaded translations. Fixes UID-75.
* Display the current contents of the stripes object. Fixes UID-77.
* Add configurable plugin-surface page. Fixes UID-78.
* Pluggable-surface page now supports optional data object. Fixes UID-86.
* Add configurable handler-surface page. Fixes UID-79.
* Provide UI for user-locale condifg. Fixes UID-82.

## [5.0.0](https://github.com/folio-org/ui-developer/tree/v5.0.0) (2021-03-11)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v4.0.0...v5.0.0)

* Increment `react-redux` to `v7`, `redux-form` to `v8`, `@folio/stripes` to `v6`. Refs UID-38.
* Increment `@folio/stripes-cli` to `v2`. Refs UID-47.
* Use new SSC `ConfigReduxForm` export in place of `ConfigForm`. Refs UID-72.

## [4.0.0](https://github.com/folio-org/ui-developer/tree/v4.0.0) (2020-10-09)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v3.0.0...v4.0.0)

* New developer-setting page "Current Permissions", shows an alphabetically sorted list of the logged-in user's permissions.
* Increment `@folio/stripes` to `v5`, `react-router` to `v5.2`.
* New developer-setting page: "Okapi query" lets you, you know, query Okapi.
* Update to react-intl v5. UID-25.
* Fix calls to `FormatDisplayName()` to work with `react-intl`. Fixes UID-30.
* Import supported locales from `@folio/stripes/core`.
* Update queries related to OKAPI-863, OKAPI-835. Fixes UID-34.
* Add `suppressIntlErrors` toggle to configuration page.

## [3.0.0](https://github.com/folio-org/ui-developer/tree/v3.0.0) (2020-06-10)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v2.0.0...v3.0.0)

* Correctly label the "Settings > Developer > Configuration" permissions. Fixes UID-22.
* Provide checkboxes for two more config settings: `showHomeLink` and `showDevInfo`. From v2.0.1.
* Increment `stripes` to `v4.0`, `react-intl` to `v4.5`, `react-intl-safe-html` to `v2.0`. Refs STRIPES-672.
* Provide `<CanIUse>` ("I can haz endpoint") to show perms required for a given endpoint.
* Use `intl.formatDisplayName` to display locale labels.
* Fix checkboxes in Configuration settings to correctly display initial values.

## [2.0.0](https://github.com/folio-org/ui-developer/tree/v2.0.0) (2020-03-12)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.11.0...v2.0.0)

* Add Urdu.
* Migrate to `stripes` `v3.0.0` and move `react-intl` and `react-router-dom` to peerDependencies.
* Migrate from `stripes.type` to `stripes.actsAs`

## [1.11.0](https://github.com/folio-org/ui-developer/tree/v1.11.0) (2019-12-04)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.10.1...v1.11.0)

* Add Russian.
* Add Chinese (traditional).
* Add Japanese.
* Add Hebrew.
* Add French (France).

## [1.10.1](https://github.com/folio-org/ui-developer/tree/v1.10.1) (2019-09-11)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.10.0...v1.10.1)

* Translation updates.

## [1.10.0](https://github.com/folio-org/ui-developer/tree/v1.10.0) (2019-07-24)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.9.0...v1.10.0)

* Use more granular permissions. UITEN-35.

## [1.9.0](https://github.com/folio-org/ui-developer/tree/v1.9.0) (2019-05-10)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.8.0...v1.9.0)

* i18n. STCOR-333

## [1.8.0](https://github.com/folio-org/ui-developer/tree/v1.8.0) (2019-03-15)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.7.0...v1.8.0)

* Session locale support.

## [1.7.0](https://github.com/folio-org/ui-developer/tree/v1.7.0) (2019-01-25)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.6.0...v1.7.0)

* Upgrade to stripes v2.0.0.

## [1.6.0](https://github.com/folio-org/ui-developer/tree/v1.6.0) (2018-12-10)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.5.0...v1.6.0)

* Remove the experimental "plugin test" page. Fixes STCOM-378.
* Add module name to translation keys.

## [1.5.0](https://github.com/folio-org/ui-developer/tree/v1.5.0) (2018-10-03)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.4.0...v1.5.0)

* Use `stripes` 1.0 framework

## [1.4.0](https://github.com/folio-org/ui-developer/tree/v1.4.0) (2018-09-03)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.3.0...v1.4.0)

* Use PropTypes, not React.PropTypes. Refs STRIPES-427.
* Use more-current stripes-components. Refs STRIPES-495.
* Use more-current stripes-connect. Refs STRIPES-501.
* Add save buttons to settings pages. Fixes UID-11.
* Ignore yarn-error.log file. Refs STRIPES-517.
* Support for localisation, and some elementary locale files.
* Add elementary Jenkins support (`yarn test` does nothing).
* Simplify ESLint configuration, relying on `eslint-config-stripes`.

## [1.3.0](https://github.com/folio-org/ui-developer/tree/v1.3.0) (2017-09-01)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.2.0...v1.3.0)

* Add okapiInterfaces and permissionSets to package.json. Fixes UID-1.
* New developer settings page for setting the authentication token. Fixes UID-2.
* Use new-style specification of action-names. Fixes UID-3
* Add new permission, `settings.developer.enabled`. Fixes UID-8.
* Upgrade dependencies to stripes-components 1.7.0, stripes-connect 2.7.0 and stripes-core 2.7.0.

## [1.2.0](https://github.com/folio-org/ui-developer/tree/v1.2.0) (2017-06-19)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.1.0...v1.2.0)

* Hot-keys test page now uses the key bindings provided by stripes-core rather than a hardwired set of bindings. Fixes STRIPES-424.
* Hot-keys module specifies `actionNames` for stripes-core's aggregation. Relates to STRPCORE-2.

## [1.1.0](https://github.com/folio-org/ui-developer/tree/v1.1.0) (2017-06-11)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v1.0.0...v1.1.0)

* Add new "HotKeys Test" settings area.
* Rip old HotKeys testing code out of Configuration area.
* Add new "Plugin Test" settings area.

## [1.0.0](https://github.com/folio-org/ui-developer/tree/v1.0.0) (2017-06-08)
[Full Changelog](https://github.com/folio-org/ui-developer/compare/v0.1.0...v1.0.0)

* Configuration area allows autoLogin username/password to be set. Fixes STRIPES-396.
* Support run-time toggling of the `showPerms`, `listInvisiblePerms`, and `hasAllPerms` settings. Fixes STRIPES-404.
* Add proof-of-concept use of hotkeys: command+up to go to Home page, command+down to go to About page. Towards STRIPES-13.
* Upgrade dependencies: stripes-components v0.12.0, stripes-core v1.9.0 and stripes-connect v2.2.0.

## [0.1.0](https://github.com/folio-org/ui-developer/tree/v0.1.0) (2017-05-22)

* The first formal release.
