import { useState } from 'react';
import { Button, Pane, Row, Col } from '@folio/stripes/components';

const BoomChakalaka = () => {
  const [boom, setBoom] = useState();

  const consoleError = (m) => {
    console.error(m);
  };

  const handlers = {
    npe: (missing) => {
      missing.foo.boomChakalaka();
    },

    tryThrowCatch: () => {
      try {
        throw new Error('boom chakalaka');
      } catch (e) {
        consoleError(e);
      }
    },

    promiseReject: () => {
      Promise.reject(new Error('boom chakalaka'));
    },

    uncaughtException: () => {
      throw new Error('boom chakalaka');
    },
  };

  Object.keys(handlers).forEach(h => {
    if (boom === h) {
      handlers[h]();
    }
  });

  return (
    <Pane
      defaultWidth="fill"
      paneTitle="Log some errors"
    >
      <Row>
        <Col xs={12}>
          <ul>
            <li><Button onClick={() => { setBoom('npe'); }}>NPE</Button></li>
            <li><Button onClick={() => { setBoom('tryThrowCatch'); }}>try/throw/catch</Button></li>
            <li><Button onClick={() => { setBoom('uncaughtException'); }}>uncaught exception</Button></li>
            <li><Button onClick={() => { setBoom('promiseReject'); }}>Promise.reject</Button></li>
          </ul>
        </Col>
      </Row>
    </Pane>
  );
};

export default BoomChakalaka;
