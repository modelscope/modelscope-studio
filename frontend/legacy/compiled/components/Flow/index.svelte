<script lang="ts">
  import { Flow } from '../../src';
  import ReactComponent from '../ReactComponent.svelte';

  export let elem_style: string = '';
  export let elem_classes: string[] = [];
  export let theme = 'light';
</script>

<ReactComponent
  {...$$restProps}
  component={Flow}
  {elem_classes}
  {elem_style}
  {theme}
/>
