<script lang="ts">
  import { Markdown } from '../../src';
  import ReactComponent from '../ReactComponent.svelte';

  export let elem_style: string = '';
  export let elem_classes: string[] = [];
  export let theme = 'light';
</script>

<ReactComponent
  {...$$restProps}
  component={Markdown}
  {elem_classes}
  {elem_style}
  {theme}
/>
