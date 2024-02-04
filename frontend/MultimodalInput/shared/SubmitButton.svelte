<script lang="ts">
  import { BaseButton } from '@gradio/button';
  import type { I18nFormatter } from '@gradio/utils';
  import { createEventDispatcher } from 'svelte';

  export let i18n: I18nFormatter;
  export let disabled: boolean;
  export let props: Record<string, any> = {};
  const dispatch = createEventDispatcher<{
    click: void;
  }>();
</script>

<BaseButton
  variant="primary"
  {...props}
  elem_classes={props.elem_classes || []}
  on:click={() => dispatch('click')}
  disabled={disabled || props.disabled}
>
  {i18n(props.value || props.label || 'common.submit')}
</BaseButton>
