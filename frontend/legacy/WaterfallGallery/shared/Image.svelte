<svelte:options accessors={true} />

<script lang="ts">
  import { IconButton } from '@gradio/atoms';
  import { Like } from '@gradio/icons';
  import { createEventDispatcher } from 'svelte';

  import DisLike from './Dislike.svelte';
  import type { GalleryImage } from './utils';

  const dispatch = createEventDispatcher<{
    click: void;
    label_click: void;
    like: boolean | undefined;
  }>();
  export let likeable: boolean;
  export let clickable: boolean;
  export let value: GalleryImage;
  export let action_label: string | undefined;
</script>

<div class="thumbnail-image-box">
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <img
    on:click={() => dispatch('click')}
    alt={value.caption || ''}
    src={value.image.url}
    class="thumbnail-img"
    loading="lazy"
  />

  {#if value.caption}
    <div class="foot-label left-label">
      {value.caption}
    </div>
  {/if}

  {#if clickable}
    <button
      class="foot-label right-label"
      on:click={() => {
        dispatch('label_click');
      }}>{action_label}</button
    >
  {/if}
  {#if likeable}
    <div class="like-button">
      <span style="margin-right: 1px;">
        <IconButton
          size="large"
          highlight={value.liked}
          Icon={Like}
          on:click={() => {
            if (value.liked) {
              value.liked = undefined;
              dispatch('like', undefined);
              return;
            }
            value.liked = true;
            dispatch('like', true);
          }}
        />
      </span>
      <span>
        <IconButton
          size="large"
          highlight={value.liked === false}
          Icon={DisLike}
          on:click={() => {
            if (value.liked === false) {
              value.liked = undefined;
              dispatch('like', undefined);
              return;
            }
            value.liked = false;
            dispatch('like', false);
          }}
        />
      </span>
    </div>
  {/if}
</div>

<style>
  .thumbnail-image-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .thumbnail-image-box:hover .left-label {
    opacity: 0.5;
  }

  .foot-label {
    position: absolute;
    /* left: 0; */
    /* right: var(--block-label-margin); */
    bottom: var(--block-label-margin);
    z-index: var(--layer-1);
    border-top: 1px solid var(--border-color-primary);
    border-left: 1px solid var(--border-color-primary);

    background: var(--background-fill-secondary);
    padding: var(--block-label-padding);
    max-width: 80%;
    overflow: hidden;
    font-size: var(--block-label-text-size);
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .left-label {
    left: 0;
    border-radius: 0 calc(var(--radius-lg) - 1px) 0 calc(var(--radius-lg) - 1px);
  }
  .right-label {
    right: var(--block-label-margin);
    border-radius: calc(var(--radius-lg) - 1px) 0 calc(var(--radius-lg) - 1px) 0;
  }
  .like-button {
    position: absolute;
    right: var(--block-label-margin);
    top: var(--block-label-margin);
    z-index: var(--layer-1);
    display: flex;
  }
  .like-button :global(.highlight svg) {
    fill: var(--color-accent);
  }

  .thumbnail-img {
    cursor: pointer;
    width: var(--size-full);
    overflow: hidden;
    object-fit: var(--object-fit);
    transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  .thumbnail-img:hover {
    transform: scale(1.05);
  }

  @keyframes shine {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }
</style>
