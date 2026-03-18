<script lang="ts">
  import {
    getProps,
    importComponent,
    processProps,
  } from '@svelte-preprocess-react/component';
  import { getSlots } from '@svelte-preprocess-react/svelte-contexts/slot.svelte';
  import cls from 'classnames';

  import type { FormProps } from './form';

  const AwaitedForm = importComponent(() => import('./form'));

  const props = $props();
  const {
    gradio,
    getComponentProps,
    getAdditionalProps,
    children,
    updateProps,
  } = getProps<{
    additional_props?: Record<string, any>;
    _internal: {
      layout?: boolean;
    };
    value?: Record<string, any>;
    form_action?: FormProps['formAction'] | null;
    form_name?: string;
    fields_change?: any;
    finish_failed?: any;
    values_change?: any;
  }>(() => props);

  const getProceedProps = processProps(
    () => {
      const {
        visible,
        _internal,
        as_item,
        elem_classes,
        elem_id,
        elem_style,
        value,
        form_action,
        ...restProps
      } = getComponentProps();
      return {
        gradio,
        additionalProps: getAdditionalProps(),
        _internal,
        as_item,
        restProps,
        visible,
        elem_id,
        elem_classes,
        elem_style,
        value,
        form_action,
      };
    },
    {
      fields_change: 'fieldsChange',
      finish_failed: 'finishFailed',
      values_change: 'valuesChange',
      form_name: 'name',
    }
  );
  const proceedProps = $derived(getProceedProps());

  const slots = getSlots();
</script>

{#if proceedProps.visible}
  {#await AwaitedForm then Form}
    <Form
      style={proceedProps.elem_style}
      className={cls(proceedProps.elem_classes, 'ms-gr-antd-form')}
      id={proceedProps.elem_id}
      {...proceedProps.restProps}
      {...proceedProps.additionalProps}
      slots={slots.value}
      formAction={proceedProps.form_action}
      value={proceedProps.value}
      onValueChange={(v) => {
        updateProps({
          value: v,
        });
      }}
      onResetFormAction={() => {
        updateProps({
          form_action: null,
        });
      }}
    >
      {@render children?.()}
    </Form>
  {/await}
{/if}
