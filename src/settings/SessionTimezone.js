import React from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Field, Form } from 'react-final-form';

import {
  Pane,
  Button,
  FormattedDate,
  FormattedTime,
  Row,
  Select,
  timezones
} from '@folio/stripes/components';

const timeZonesOptions = timezones.map(timezone => ({
  value: timezone.value,
  label: timezone.value,
}));

const SessionTimezone = (props) => {
  const intl = useIntl();

  const submit = (values) => {
    if (values.timezone) {
      props.stripes.setTimezone(values.timezone);
    }
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={intl.formatMessage({ id: 'ui-developer.sessionTimezone.temporarySessionTimezone' })}
    >
      <Form
        onSubmit={submit}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <Row>
              <Field
                component={Select}
                id="timezone"
                name="timezone"
                placeholder="---"
                dataOptions={timeZonesOptions}
                label={<FormattedMessage id="ui-developer.sessionTimezone.timeZone" />}
              />
            </Row>
            <Row>
              <FormattedMessage
                id="ui-developer.sessionTimezone.currentDateTime"
                values={{
                  timezone: props.stripes.timezone,
                  date: <FormattedDate value={(new Date()).toISOString()} />,
                  time: <FormattedTime value={(new Date()).toISOString()} />,
                }}
              />
            </Row>
            <Row>
              <Button
                id="clickable-save-timezone"
                buttonStyle="primary mega"
                type="submit"
                disabled={(pristine || submitting)}
              >
                <FormattedMessage id="stripes-core.button.save" />
              </Button>
            </Row>
          </form>
        )}
      />
    </Pane>
  );
};

SessionTimezone.propTypes = {
  stripes: PropTypes.shape({
    setTimezone: PropTypes.func,
    timezone: PropTypes.string,
  }).isRequired,
};

export default SessionTimezone;
