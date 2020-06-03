# Change history for ui-developer

## 3.0.0 (IN PROGRESS)

* Correctly label the "Settings > Developer > Configuration" permissions. Fixes UID-22.
* Provide checkboxes for two more config settings: `showHomeLink` and `showDevInfo`. From v2.0.1.
* Increment `stripes` to `v4.0`, `react-intl` to `v4.5`, `react-intl-safe-html` to `v2.0`. Refs STRIPES-672.
* Use `intl.formatDisplayName` to display locale labels.
* Fix checkboxes in Configuration settings to correctly display initial values.

## [2.0.0](https://github.com/folio-org/ui-developer/tree/v2.0.0.0) (2020-03-12)
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
