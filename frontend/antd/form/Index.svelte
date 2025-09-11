<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import {
    getSetSlotParamsFn,
    getSlotContext,
    getSlots,
  } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { writable } from 'svelte/store';

  import type { FormProps } from './form';

  const AwaitedForm = importComponent(() => import('./form'));
  export let gradio: Gradio;
  export let value: Record<string, any>;
  export let form_action: FormProps['formAction'] | null = null;
  export let props: Record<string, any> = {};
  const updatedProps = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let _internal: {
    layout?: boolean;
  } = {};

  export let as_item: string | undefined;
  // gradio properties
  export let visible = true;
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};

  const [mergedProps, update] = getSlotContext(
    {
      gradio,
      props: $updatedProps,
      _internal,
      visible,
      elem_id,
      elem_classes,
      elem_style,
      as_item,
      value,
      form_action,
      restProps: $$restProps,
    },
    {
      form_name: 'name',
    }
  );
  const setSlotParams = getSetSlotParamsFn();
  const slots = getSlots();
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    as_item,
    value,
    form_action,
    restProps: $$restProps,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedForm then Form}
    <Form
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-form')}
      id={$mergedProps.elem_id}
      {...$mergedProps.restProps}
      {...$mergedProps.props}
      {...bindEvents($mergedProps, {
        fields_change: 'fieldsChange',
        finish_failed: 'finishFailed',
        values_change: 'valuesChange',
      })}
      slots={$slots}
      formAction={$mergedProps.form_action}
      value={$mergedProps.value}
      onValueChange={(v) => {
        value = v;
      }}
      onResetFormAction={() => {
        form_action = null;
      }}
      {setSlotParams}
    >
      <slot />
    </Form>
  {/await}
{/if}

<style>
</style>
