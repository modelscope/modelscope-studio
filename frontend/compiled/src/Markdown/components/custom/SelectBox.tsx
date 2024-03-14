import { useEffect, useMemo, useState } from 'react';
import type { Components } from 'react-markdown';
import {
  Button,
  Card,
  Checkbox,
  CheckboxOptionType,
  Col,
  ColProps,
  Radio,
  Row,
  Space,
} from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import cls from 'classnames';
import { isObject } from 'lodash-es';

import { FileView } from '../../../FileView';
import { safeParseJSON } from '../../../utils';
import { useMarkdownContext } from '../../context';
import { useCustomProps } from '../../hooks/useCustomProps';

export interface SelectBoxProps {
  type?: 'checkbox' | 'radio';
  direction?: 'horizontal' | 'vertical';
  shape?: 'card' | 'default';
  disabled?: boolean;
  value?: string;
  options?: string;
  'submit-text'?: string;
  'select-once'?: string; // boolean
  // card
  'item-width'?: string;
  'item-height'?: string;
  'img-height'?: string;
  'equal-height'?: string; // boolean
  columns?: string; // number | { xs: number, sm: number, md: number, lg: number, xl: number, xxl: number }
}

const custom_tag = 'select-box';

export const SelectBox: Components['select-box'] = (nodeProps) => {
  const [
    {
      direction,
      shape = 'default',
      type = 'radio',
      'img-height': imgHeight = '160px',
      'item-height': itemHeight,
      'item-width': itemWidth,
      'submit-text': submitText,
      'select-once': _selectOnce,
      'equal-height': _equalHeight,
      columns,
      ...props
    },
    { tagIndex },
  ] = useCustomProps(nodeProps);

  const selectOnce = typeof _selectOnce === 'string';
  const equalHeight = typeof _equalHeight === 'string';
  const { on_custom, preview, disabled: ctxDisabled } = useMarkdownContext();
  const spans: ColProps = useMemo(() => {
    if (direction !== 'vertical' && columns) {
      if (!Number.isNaN(Number(columns))) {
        return {
          span: Math.round(24 / Number(columns)),
        };
      }

      const columnsObject = safeParseJSON<{
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        xxl?: number;
      }>(columns || '', {});

      const _spans = Object.keys(columnsObject).reduce((acc, key) => {
        if (['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].includes(key)) {
          (acc as any)[key] = Math.round(
            24 / Number(columnsObject[key as keyof typeof columnsObject])
          );
        }
        return acc;
      }, {} as ColProps);

      if (Object.keys(_spans).length) {
        return _spans;
      }
    }

    return itemWidth
      ? {
          span: direction === 'vertical' ? 24 : undefined,
        }
      : {
          xs: 24,
          sm: direction === 'vertical' ? 24 : 12,
          md: direction === 'vertical' ? 24 : 12,
          lg: direction === 'vertical' ? 24 : 6,
        };
  }, [columns, direction, itemWidth]);
  const defaultValue: CheckboxGroupProps['defaultValue'] | string =
    useMemo(() => {
      if (type === 'radio') {
        return props.value;
      }
      return safeParseJSON(props.value || '', []);
    }, [props.value, type]);
  const [disabled, setDisabled] = useState(ctxDisabled || !!props.disabled);

  useEffect(() => {
    setDisabled(ctxDisabled || !!props.disabled);
  }, [ctxDisabled, props.disabled]);

  const options: (CheckboxOptionType & {
    imgSrc?: string;
  })[] = useMemo(() => {
    return safeParseJSON(props.options || '', []).map((option) => {
      if (!isObject(option)) {
        return {
          value: option,
          label: option,
        };
      }
      return option;
    });
  }, [props.options]);
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  let selectElement: React.ReactNode = null;

  const onCustom = (v: any) => {
    on_custom(custom_tag, tagIndex, v);
  };

  if (shape === 'card') {
    selectElement = (
      <Row gutter={[8, 8]}>
        {options.map((option, index) => {
          const label = option.label || option.value;
          const selected =
            type === 'checkbox'
              ? value?.includes(option.value as string)
              : option.value === value;

          return (
            <Col key={index} {...spans}>
              <Card
                style={{
                  width: itemWidth,
                  height: itemHeight,
                }}
                onClick={() => {
                  if (disabled) {
                    return;
                  }
                  let newValue: CheckboxGroupProps['value'] | string =
                    option.value as string;
                  if (type === 'checkbox' && Array.isArray(value)) {
                    if (value.includes(option.value as string)) {
                      newValue = value.filter((v) => v !== option.value);
                    } else {
                      newValue = [...value, option.value];
                    }
                  }
                  setValue(newValue);
                  if (selectOnce && !submitText) {
                    onCustom(newValue);
                    setDisabled(true);
                  }
                }}
                className={cls(
                  'ms-markdown-select-box-card',
                  equalHeight && 'ms-markdown-select-box-card-equal-height',
                  selected && 'ms-markdown-select-box-card-selected',
                  disabled && 'ms-markdown-select-box-card-disabled'
                )}
                size="small"
                cover={
                  option.imgSrc ? (
                    <FileView
                      style={{
                        maxWidth: '100%',
                        maxHeight: imgHeight,
                        height: imgHeight,
                      }}
                      preview={preview}
                      type="image"
                      url={option.imgSrc}
                      alt={`${label}`}
                    />
                  ) : null
                }
              >
                {label}
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  } else if (type === 'radio') {
    selectElement = (
      <Radio.Group
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value);
          if (selectOnce && !submitText) {
            onCustom(e.target.value);
            setDisabled(true);
          }
        }}
        value={value}
      >
        <Space direction={direction} wrap>
          {options.map((option, index) => {
            return (
              <Radio key={index} value={option.value}>
                {option.label || option.value}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
    );
  } else if (type === 'checkbox') {
    selectElement = (
      <Checkbox.Group
        disabled={disabled}
        value={value as CheckboxGroupProps['value']}
        onChange={(v) => {
          setValue(v);
          if (selectOnce && !submitText) {
            onCustom(v);
            setDisabled(true);
          }
        }}
      >
        <Space direction={direction} wrap>
          {options.map((option, index) => {
            return (
              <Checkbox key={index} value={option.value}>
                {option.label || option.value}
              </Checkbox>
            );
          })}
        </Space>
      </Checkbox.Group>
    );
  }

  return (
    <>
      {selectElement}
      {submitText && !disabled && (
        <div className="ms-markdown-select-box-submit-btn">
          <Button
            type="primary"
            onClick={() => {
              if (value) {
                onCustom(value);
                if (selectOnce) {
                  setDisabled(true);
                }
              }
            }}
          >
            {submitText}
          </Button>
        </div>
      )}
    </>
  );
};
