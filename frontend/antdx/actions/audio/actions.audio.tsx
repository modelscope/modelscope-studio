import { sveltify } from '@svelte-preprocess-react';
import React from 'react';
import { Actions } from '@ant-design/x';
import type { ActionsAudioProps } from '@ant-design/x/es/actions/ActionsAudio';

export const ActionsAudio = sveltify<ActionsAudioProps>(
  ({ slots: _slots, ...props }) => {
    return (
      <>
        <Actions.Audio {...props} />
      </>
    );
  }
);

export default ActionsAudio;
