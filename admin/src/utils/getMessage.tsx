import { useIntl } from 'react-intl';
import { isString } from 'lodash';
import { PLUGIN_ID } from '../pluginId';

const getMessage = (
  input: string | { id: string; props?: Record<string, string> },
  defaultMessage = '',
  inPluginScope = true
) => {
  const { formatMessage } = useIntl();
  let formattedId = '';
  if (isString(input)) {
    formattedId = input;
  } else {
    formattedId = input?.id;
  }
  return formatMessage(
    {
      id: `${inPluginScope ? PLUGIN_ID : 'app.components'}.${formattedId}`,
      defaultMessage,
    },
    isString(input) ? undefined : input?.props
  );
};

export {
    getMessage
};
