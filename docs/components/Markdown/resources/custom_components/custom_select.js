(props, cc, { el, onMount }) => {
  const options = JSON.parse(props.options);
  el.innerHTML = `
  ${options
    .map((option) => {
      return `<div>
        <label>${option} <input type="radio"/></label>
    <div>`;
    })
    .join('')}
  `;
  onMount(() => {
    const inputs = Array.from(el.getElementsByTagName('input'));
    Array.from(el.getElementsByTagName('label')).forEach((label, i) => {
      label.addEventListener('click', () => {
        inputs.forEach((input) => {
          input.checked = false;
        });
        const input = label.getElementsByTagName('input')[0];
        input.checked = true;
        // Use cc.dispatch to trigger events.
        cc.dispatch(options[i]);
      });
    });
  });
};
