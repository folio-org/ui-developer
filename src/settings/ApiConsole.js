import React, { useState, useContext } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStripes, CalloutContext } from '@folio/stripes/core';
import {
  Button,
  Col,
  IconButton,
  Pane,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

// for to provide list of HTTP methods, determine which ones get a body and
// disable/enable the body input field accordingly.
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'];
const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);

/**
 * Quote a single bare token as needed to make it valid JSON: numbers,
 * booleans, and null pass through unquoted; already-quoted strings are
 * re-quoted with double quotes; everything else (bare words/phrases used
 * as object keys or string values) gets wrapped in double quotes.
 */
function quotifyToken(raw) {
  if (raw === '') return '';

  const JSON_LITERAL_RE = /^(-?\d+(\.\d+)?([eE][+-]?\d+)?|true|false|null)$/;

  const isDoubleQuoted = raw.startsWith('"') && raw.endsWith('"') && raw.length >= 2;
  const isSingleQuoted = raw.startsWith('\'') && raw.endsWith('\'') && raw.length >= 2;

  if (isDoubleQuoted) {
    try {
      return JSON.stringify(JSON.parse(raw));
    } catch {
      return JSON.stringify(raw.slice(1, -1));
    }
  }

  if (isSingleQuoted) {
    return JSON.stringify(raw.slice(1, -1).replaceAll('\\\'', '\''));
  }

  if (JSON_LITERAL_RE.test(raw)) return raw;

  return JSON.stringify(raw);
}

/**
 * Walk a JSON5-ish string (structural chars {}[]:,  plus free-form tokens
 * in between) and quotify each bare token, leaving already-quoted strings
 * and JSON literals (numbers/true/false/null) alone. This lets a developer
 * paste a loosely-formatted object (unquoted keys/values, single quotes,
 * etc.) into the request body and turn it into valid JSON with one click.
 */
function quotifyBody(text) {
  const STRUCTURAL_CHARS = '{}[]:,';
  let out = '';
  let buffer = '';
  let i = 0;

  const flush = () => {
    out += quotifyToken(buffer.trim());
    buffer = '';
  };

  while (i < text.length) {
    const ch = text[i];

    if (ch === '"' || ch === '\'') {
      const quote = ch;
      let j = i + 1;
      while (j < text.length && text[j] !== quote) {
        j += (text[j] === '\\' && j + 1 < text.length) ? 2 : 1;
      }
      buffer += text.slice(i, j + 1);
      i = j + 1;
    } else if (STRUCTURAL_CHARS.includes(ch)) {
      flush();
      out += ch;
      i += 1;
    } else {
      buffer += ch;
      i += 1;
    }
  }
  flush();

  return out;
}

/**
 * Ad-hoc REST console: issue an arbitrary request against the backend
 * using the browser's existing session credentials (httpOnly cookie,
 * carried automatically via `credentials: 'include'`, plus the
 * X-Okapi-Token already held in the redux store), i.e. be Postman
 * without leaving FOLIO.
 */
const ApiConsole = () => {
  const stripes = useStripes();
  const callout = useContext(CalloutContext);

  const [method, setMethod] = useState('GET');
  const [path, setPath] = useState('');
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [response, setResponse] = useState(null);

  const bodyDisabled = METHODS_WITHOUT_BODY.has(method);

  const updateQueryParam = (index, field, value) => {
    setQueryParams(queryParams.map((qp, i) => (i === index ? { ...qp, [field]: value } : qp)));
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: '', value: '' }]);
  };

  const removeQueryParam = (index) => {
    setQueryParams(queryParams.filter((_qp, i) => i !== index));
  };

  const handleSend = (event) => {
    event.stopPropagation();
    setSending(true);
    setResponse(null);

    const url = new URL(path.startsWith('/') ? path : `/${path}`, stripes.okapi.url);
    queryParams.forEach(({ key, value }) => {
      if (key) url.searchParams.append(key, value);
    });

    const token = stripes.store.getState().okapi.token;
    const hasBody = body.trim() !== '' && !bodyDisabled;

    const options = {
      method,
      credentials: 'include',
      headers: {
        'X-Okapi-Tenant': stripes.okapi.tenant,
        ...(token && { 'X-Okapi-Token': token }),
        ...(hasBody && { 'Content-Type': 'application/json' }),
      },
      ...(hasBody && { body }),
    };

    fetch(url, options)
      .then(async (res) => {
        const text = await res.text();
        setResponse({
          status: res.status,
          statusText: res.statusText,
          headers: [...res.headers.entries()],
          body: text,
        });
      })
      .catch((err) => {
        callout.sendCallout({ type: 'error', message: err.message });
      })
      .finally(() => {
        setSending(false);
      });
  };

  const handleQuotify = () => {
    const quotified = quotifyBody(body);

    try {
      setBody(JSON.stringify(JSON.parse(quotified), null, 2));
    } catch {
      setBody(quotified);
      callout.sendCallout({ type: 'warning', message: <FormattedMessage id="ui-developer.apiConsole.quotifyIncomplete" /> });
    }
  };

  const formatResponse = () => {
    if (!response) return '';

    const headerLines = response.headers.map(([k, v]) => `${k}: ${v}`).join('\n');

    let prettyBody = response.body;
    try {
      prettyBody = JSON.stringify(JSON.parse(response.body), null, 2);
    } catch {
      // not JSON; show as-is
    }

    return `HTTP ${response.status} ${response.statusText}\n\n${headerLines}\n\n${prettyBody}`;
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-developer.apiConsole" />}
    >
      <Row>
        <Col xs={2}>
          <Select
            label={<FormattedMessage id="ui-developer.apiConsole.method" />}
            value={method}
            onChange={(event) => setMethod(event.target.value)}
            dataOptions={METHODS.map((m) => ({ value: m, label: m }))}
          />
        </Col>
        <Col xs={10}>
          <TextField
            label={<FormattedMessage id="ui-developer.apiConsole.endpoint" />}
            name="path"
            fullWidth
            placeholder="Ex: /users"
            value={path}
            onChange={(event) => setPath(event.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <FormattedMessage id="ui-developer.apiConsole.queryParams" />
        </Col>
      </Row>
      {queryParams.map((qp, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Row key={index}>
          <Col xs={5}>
            <TextField
              aria-label={<FormattedMessage id="ui-developer.apiConsole.paramKey" />}
              placeholder="Ex: limit"
              fullWidth
              value={qp.key}
              onChange={(event) => updateQueryParam(index, 'key', event.target.value)}
            />
          </Col>
          <Col xs={5}>
            <TextField
              aria-label={<FormattedMessage id="ui-developer.apiConsole.paramValue" />}
              placeholder="Ex: 100"
              fullWidth
              value={qp.value}
              onChange={(event) => updateQueryParam(index, 'value', event.target.value)}
            />
          </Col>
          <Col xs={2}>
            <IconButton
              icon="trash"
              aria-label={<FormattedMessage id="ui-developer.apiConsole.removeParam" />}
              onClick={() => removeQueryParam(index)}
            />
          </Col>
        </Row>
      ))}
      <Row>
        <Col xs={12}>
          <Button onClick={addQueryParam}><FormattedMessage id="ui-developer.apiConsole.addParam" /></Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <TextArea
            label={<FormattedMessage id="ui-developer.apiConsole.body" />}
            fullWidth
            disabled={bodyDisabled}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <Button disabled={bodyDisabled || !body.trim()} onClick={handleQuotify}>
            <FormattedMessage id="ui-developer.apiConsole.quotify" />
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Button buttonStyle="primary" disabled={sending} onClick={handleSend}>
            <FormattedMessage id={sending ? 'ui-developer.apiConsole.sending' : 'ui-developer.apiConsole.sendRequest'} />
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <TextArea
            label={<FormattedMessage id="ui-developer.apiConsole.response" />}
            fullWidth
            style={{ height: '50%' }}
            value={formatResponse()}
          />
        </Col>
      </Row>
    </Pane>
  );
};

export default ApiConsole;
