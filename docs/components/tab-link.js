(props, cc, { onMount, el }) => {
  onMount(() => {
    el.addEventListener('click', () => {
      cc.dispatch({
        tab: props.tab,
        component_tab: props['component-tab'],
      });
    });
  });
  const children = props.children[0].value;
  el.innerHTML = `${children}`;
  el.style.display = 'inline-block';
  el.style.cursor = 'pointer';
  el.style.color = 'var(--link-text-color)';
};
