import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { Actions, type ActionsFeedbackProps } from '@ant-design/x';

export const ActionsFeedback = sveltify<ActionsFeedbackProps>(
  ({ slots: _slots, ...props }) => {
    return (
      <>
        <Actions.Feedback {...props} />
      </>
    );
  }
);

export default ActionsFeedback;
