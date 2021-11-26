# Permissions for the Okapi Console

To use these facilities, you need the following permissions, which at present are not assigned to `diku_admin` on https://folio-snapshot.dev.folio.org/ and need to be manually assigned afresh each day:

**Environment tab:**
`okapi.env.list` (Okapi - list env variables)

**Modules tab:**
`okapi.proxy.modules.list` (Okapi - list modules),
`okapi.proxy.tenants.modules.post` (Okapi - Enable a module for tenant)

This can be done by turning on **List "invisible" permissions in add-perm menus?** at
https://folio-snapshot.dev.folio.org/settings/developer/configuration
and then editing the user at
https://folio-snapshot.dev.folio.org/users/7b9fece5-7958-5338-854e-5b6f4557a3dd/edit
and opening the **User permissions** accordion, scrolling to the bottom and clicking on
**Add permission**.

(Don't forget, after assigning permissions, to **Save &d close** twice: once on the add-permission page, and then again on the edit-user page. And remember that it often seems, oddly, to take a minute or so for a newly-added permissions to take effect.)

## See also

* [_Okapi Guide and Reference_](https://github.com/folio-org/okapi/blob/master/doc/guide.md)
* [Okapi's API description (RAML)](https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/okapi.raml)
* [Okapi's own generated module descriptor](okapi-mod-descr.json)

