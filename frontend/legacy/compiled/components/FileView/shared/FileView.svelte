<script lang="ts">
  import { FileView } from '../../../src';
  import ReactComponent from '../../ReactComponent.svelte';

  export let elem_style: string = '';
  export let elem_classes: string[] = [];
</script>

<ReactComponent
  {...$$restProps}
  component={FileView}
  {elem_classes}
  {elem_style}
/>
