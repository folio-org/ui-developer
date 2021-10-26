// XXX This is derived from
// https://github.com/folio-org/ui-users/blob/master/src/components/data/converters/permission.js
// and should be moved to stripes-util


/* eslint-disable no-console */
export function withTranslationErrorsDisabled(fn) {
  const savedConsoleError = console.error;
  console.error = (first, ...args) => {
    if (typeof first === 'object' && first.toString().includes('@formatjs/intl Error MISSING_TRANSLATION')) {
      // console.log('ignored error.log', first.toString());
    } else {
      savedConsoleError(first, ...args);
    }
  };
  const res = fn();
  console.error = savedConsoleError;
  return res;
}
/* eslint-enable no-console */


export function getPermissionLabelString(permission, formatMessage, showRaw) {
  const { permissionName } = permission;
  const displayName = permission.displayName ?? permissionName;

  const [pPrefix, ...pName] = permissionName.split('.');
  const i18nKey = `${pPrefix}.permission.${pName.join('.')}`;
  const label = withTranslationErrorsDisabled(() => {
    return formatMessage({ id: i18nKey, defaultMessage: displayName });
  });

  return showRaw ? `${permissionName} (${label})` : label;
}

