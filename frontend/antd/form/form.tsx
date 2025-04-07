import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useEffect } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Form as AForm, type GetProps } from 'antd';

export const Form = sveltify<
  GetProps<typeof AForm> & {
    value: Record<string, any>;
    onValueChange: (value: Record<string, any>) => void;
    setSlotParams: SetSlotParams;
  },
  ['requiredMark']
>(
  ({
    value,
    onValueChange,
    requiredMark,
    onValuesChange,
    feedbackIcons,
    setSlotParams,
    slots,
    ...props
  }) => {
    const [form] = AForm.useForm();
    const feedbackIconsFunction = useFunction(feedbackIcons);
    const requiredMarkFunction = useFunction(requiredMark);
    useEffect(() => {
      if (value) {
        form.setFieldsValue(value);
      } else {
        form.resetFields();
      }
    }, [form, value]);
    return (
      <AForm
        {...props}
        form={form}
        requiredMark={
          slots.requiredMark
            ? renderParamsSlot({
                key: 'requiredMark',
                setSlotParams,
                slots,
              })
            : requiredMark === 'optional'
              ? requiredMark
              : requiredMarkFunction || requiredMark
        }
        feedbackIcons={feedbackIconsFunction}
        onValuesChange={(changedValues, values: any) => {
          onValueChange(values);
          onValuesChange?.(changedValues, values);
        }}
      />
    );
  }
);

export default Form;
