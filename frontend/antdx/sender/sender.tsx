import { sveltify } from '@svelte-preprocess-react';
import { useSuggestionOpenContext } from '@svelte-preprocess-react/react-contexts';
import { ReactSlot } from '@svelte-preprocess-react/react-slot';
import React from 'react';
import { Sender as XSender, type SenderProps } from '@ant-design/x';
import type { FileData } from '@gradio/client';
import { createFunction } from '@utils/createFunction';
import { useFunction } from '@utils/hooks/useFunction';
import { useValueChange } from '@utils/hooks/useValueChange';

function getConfig<T>(value: T): Partial<T & Record<PropertyKey, any>> {
  if (typeof value === 'object' && value !== null) {
    return value as any;
  }
  return {} as any;
}

export const Sender = sveltify<
  Omit<SenderProps, 'onPasteFile'> & {
    children?: React.ReactNode;
    upload: (files: File[]) => Promise<FileData[]>;
    onPasteFile?: (value: string[]) => void;
    onValueChange: (value: string) => void;
  },
  [
    'suffix',
    'header',
    'prefix',
    'footer',
    'skill.title',
    'skill.toolTip.title',
    'skill.closable.closeIcon',
  ]
>(
  ({
    slots,
    children,
    onValueChange,
    onChange,
    onPasteFile,
    upload,
    slotConfig,
    elRef,
    ...props
  }) => {
    const suffixFunction = useFunction(props.suffix, true);
    const headerFunction = useFunction(props.header, true);
    const prefixFunction = useFunction(props.prefix, true);
    const footerFunction = useFunction(props.footer, true);
    const supportSkill =
      props.skill ||
      slots['skill.title'] ||
      slots['skill.toolTip.title'] ||
      slots['skill.closable.closeIcon'];
    const supportSkillTooltip =
      slots['skill.toolTip.title'] || typeof props.skill?.toolTip === 'object';
    const skillTooltipConfig = getConfig(props.skill?.toolTip);
    const supportSkillClosable =
      slots['skill.closable.closeIcon'] || props.skill?.closable;
    const skillClosableConfig = getConfig(props.skill?.closable);

    const skillTooltipAfterOpenChangeFunction = useFunction(
      skillTooltipConfig.afterOpenChange
    );
    const skillTooltipGetPopupContainerFunction = useFunction(
      skillTooltipConfig.getPopupContainer
    );
    const [value, setValue] = useValueChange({
      onValueChange,
      value: props.value,
    });
    const open = useSuggestionOpenContext();
    return (
      <>
        <div style={{ display: 'none' }}>{children}</div>
        <XSender
          {...props}
          value={value}
          ref={elRef}
          skill={
            supportSkill
              ? {
                  ...(props.skill || {}),
                  title: slots['skill.title'] ? (
                    <ReactSlot slot={slots['skill.title']} />
                  ) : (
                    props.skill?.title
                  ),
                  value: props.skill?.value || '',
                  toolTip: supportSkillTooltip
                    ? {
                        ...skillTooltipConfig,
                        afterOpenChange: skillTooltipAfterOpenChangeFunction,
                        getPopupContainer:
                          skillTooltipGetPopupContainerFunction,
                        title: slots['showSorterTooltip.title'] ? (
                          <ReactSlot slot={slots['showSorterTooltip.title']} />
                        ) : (
                          skillTooltipConfig.title
                        ),
                      }
                    : props.skill?.toolTip,
                  closable: supportSkillClosable
                    ? {
                        ...skillClosableConfig,
                        closeIcon: slots['skill.closable.closeIcon'] ? (
                          <ReactSlot slot={slots['skill.closable.closeIcon']} />
                        ) : (
                          skillClosableConfig.closeIcon
                        ),
                      }
                    : props.skill?.closable,
                }
              : undefined
          }
          slotConfig={slotConfig?.map((c) => {
            return {
              ...c,
              formatResult: createFunction(c.formatResult),
              customRender:
                c.type === 'custom'
                  ? createFunction(c.customRender)
                  : undefined,
            };
          })}
          onSubmit={(...args) => {
            if (!open) {
              props.onSubmit?.(...args);
            }
          }}
          onChange={(v) => {
            onChange?.(v);
            setValue(v);
          }}
          onPasteFile={async (files) => {
            const urls = await upload(Array.from(files));
            onPasteFile?.(urls.map((url) => url.path));
          }}
          suffix={
            slots.suffix ? (
              <ReactSlot slot={slots.suffix} />
            ) : (
              suffixFunction || props.suffix
            )
          }
          header={
            slots.header ? (
              <ReactSlot slot={slots.header} />
            ) : (
              headerFunction || props.header
            )
          }
          prefix={
            slots.prefix ? (
              <ReactSlot slot={slots.prefix} />
            ) : (
              prefixFunction || props.prefix
            )
          }
          footer={
            slots.footer ? (
              <ReactSlot slot={slots.footer} />
            ) : (
              footerFunction || props.footer
            )
          }
        />
      </>
    );
  }
);

export default Sender;
