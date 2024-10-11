import { sveltify } from '@svelte-preprocess-react';
import { useEffect } from 'react';
import { useFunction } from '@utils/hooks/useFunction';
import { Form as AForm, type GetProps } from 'antd';

export const Form = sveltify<
  GetProps<typeof AForm> & {
    value: Record<string, any>;
    onValueChange: (value: Record<string, any>) => void;
  }
>(({ value, onValueChange, onValuesChange, feedbackIcons, ...props }) => {
  const [form] = AForm.useForm();
  const feedbackIconsFunction = useFunction(feedbackIcons);
  useEffect(() => {
    form.setFieldsValue(value);
  }, [form, value]);
  return (
    <AForm
      {...props}
      initialValues={value}
      form={form}
      feedbackIcons={feedbackIconsFunction}
      onValuesChange={(changedValues, values: any) => {
        onValueChange(values);
        onValuesChange?.(changedValues, values);
      }}
    />
  );
});

export default Form;
