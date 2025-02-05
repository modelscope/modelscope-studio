import { sveltify } from '@svelte-preprocess-react';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import XSenderHeader from '@ant-design/x/es/sender/SenderHeader';
import {
  type SenderHeaderProps,
  SendHeaderContext,
} from '@ant-design/x/es/sender/SenderHeader';
import { ConfigProvider } from 'antd';

export const SenderHeader = sveltify<SenderHeaderProps, ['title']>(
  ({ slots, ...props }) => {
    const { getPrefixCls } = React.useContext(ConfigProvider.ConfigContext);

    // fix style
    return (
      <SendHeaderContext.Provider value={{ prefixCls: getPrefixCls('sender') }}>
        <XSenderHeader
          {...props}
          title={slots.title ? <ReactSlot slot={slots.title} /> : props.title}
        />
      </SendHeaderContext.Provider>
    );
  }
);

export default SenderHeader;
