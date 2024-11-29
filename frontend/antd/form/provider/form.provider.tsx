import { sveltify } from '@svelte-preprocess-react';
import { Form as AForm, type GetProps } from 'antd';

export const FormProvider = sveltify<
  GetProps<typeof AForm.Provider> & {
    onFormChange?: (
      name: string,
      info: Record<string, Record<string, any>>
    ) => void;
    onFormFinish?: (
      name: string,
      info: Record<string, Record<string, any>>
    ) => void;
  }
>(({ onFormChange, onFormFinish, ...props }) => {
  return (
    <AForm.Provider
      {...props}
      onFormChange={(name, info) => {
        onFormChange?.(name, {
          ...info,
          forms: Object.keys(info.forms).reduce(
            (acc, cur) => ({
              ...acc,
              [cur]: info.forms[cur].getFieldsValue(),
            }),
            {}
          ),
        });
      }}
      onFormFinish={(name, info) => {
        onFormFinish?.(name, {
          ...info,
          forms: Object.keys(info.forms).reduce(
            (acc, cur) => ({
              ...acc,
              [cur]: info.forms[cur].getFieldsValue(),
            }),
            {}
          ),
        });
      }}
    />
  );
});

export default FormProvider;
