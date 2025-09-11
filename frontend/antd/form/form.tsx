import { sveltify } from '@svelte-preprocess-react';
import type { SetSlotParams } from '@svelte-preprocess-react/slot';
import { useEffect } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { useMemoizedFn } from '@utils/hooks/useMemoizedFn';
import { renderParamsSlot } from '@utils/renderParamsSlot';
import { Form as AForm, type GetProps } from 'antd';

export interface FormProps extends GetProps<typeof AForm> {
  value: Record<string, any>;
  onValueChange: (value: Record<string, any>) => void;
  setSlotParams: SetSlotParams;
  formAction?: 'reset' | 'submit' | 'validate' | null;
  onResetFormAction: () => void;
}

export const Form = sveltify<FormProps, ['requiredMark']>(
  ({
    value,
    formAction,
    onValueChange,
    requiredMark,
    onValuesChange,
    feedbackIcons,
    setSlotParams,
    slots,
    onResetFormAction,
    ...props
  }) => {
    const [form] = AForm.useForm();
    const feedbackIconsFunction = useFunction(feedbackIcons);
    const requiredMarkFunction = useFunction(requiredMark);
    const onResetFormActionMemoized = useMemoizedFn(onResetFormAction);

    useEffect(() => {
      switch (formAction) {
        case 'reset':
          form.resetFields();
          break;
        case 'submit':
          form.submit();
          break;
        case 'validate':
          form.validateFields();
          break;
      }
      onResetFormActionMemoized();
    }, [form, formAction, onResetFormActionMemoized]);

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
