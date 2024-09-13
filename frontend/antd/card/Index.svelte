<svelte:options accessors={true} />

<script lang="ts">
  import {
    bindEvents,
    importComponent,
  } from '@svelte-preprocess-react/component';
  import { getSlotContext, getSlots } from '@svelte-preprocess-react/slot';
  import type React from 'react';
  import type { Gradio } from '@gradio/utils';
  import cls from 'classnames';
  import { type Writable, writable } from 'svelte/store';

  const AwaitedCard = importComponent(() => import('./card'));
  export let gradio: Gradio;
  export let _internal: Record<string, any> = {};
  export let actions;
  export let active_tab_key;
  export let bordered;
  export let cover;
  export let default_active_tab_key;
  export let extra;
  export let hoverable;
  export let loading;
  export let size;
  export let tab_bar_extra_content;
  export let tab_list;
  export let tab_props;
  export let title;
  export let type;
  export let class_names;
  export let styles;
  export let as_item: string | undefined;
  export let props: Record<string, any> = {};
  const updatedProps: Writable<typeof props> = writable(props);
  $: updatedProps.update((prev) => ({ ...prev, ...props }));
  export let elem_id = '';
  export let elem_classes: string[] = [];
  export let elem_style: React.CSSProperties = {};
  export let visible = true;
  const slots = getSlots();
  const [mergedProps, update] = getSlotContext({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    actions,
    active_tab_key,
    bordered,
    cover,
    default_active_tab_key,
    extra,
    hoverable,
    loading,
    size,
    tab_bar_extra_content,
    tab_list,
    tab_props,
    title,
    type,
    class_names,
    styles,
  });
  $: update({
    gradio,
    props: $updatedProps,
    _internal,
    as_item,
    visible,
    elem_id,
    elem_classes,
    elem_style,
    actions,
    active_tab_key,
    bordered,
    cover,
    default_active_tab_key,
    extra,
    hoverable,
    loading,
    size,
    tab_bar_extra_content,
    tab_list,
    tab_props,
    title,
    type,
    class_names,
    styles,
  });
</script>

{#if $mergedProps.visible}
  {#await AwaitedCard then Card}
    <Card
      style={$mergedProps.elem_style}
      className={cls($mergedProps.elem_classes, 'ms-gr-antd-card')}
      id={$mergedProps.elem_id}
      actions={$mergedProps.actions}
      activeTabKey={$mergedProps.active_tab_key}
      bordered={$mergedProps.bordered}
      cover={$mergedProps.cover}
      defaultActiveTabKey={$mergedProps.default_active_tab_key}
      extra={$mergedProps.extra}
      hoverable={$mergedProps.hoverable}
      loading={$mergedProps.loading}
      size={$mergedProps.size}
      tabBarExtraContent={$mergedProps.tab_bar_extra_content}
      tabList={$mergedProps.tab_list}
      tabProps={$mergedProps.tab_props}
      title={$mergedProps.title}
      type={$mergedProps.type}
      classNames={$mergedProps.class_names}
      styles={$mergedProps.styles}
      {...$mergedProps.props}
      {...bindEvents($mergedProps)}
      containsGrid={$mergedProps._internal.contains_grid}
      slots={$slots}
    >
      <slot></slot>
    </Card>
  {/await}
{/if}

<style>
</style>
