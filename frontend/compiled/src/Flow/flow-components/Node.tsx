import {
  type NodeProps,
  Position,
  useNodeId,
  useReactFlow,
} from '@xyflow/react';
import React, { memo, useMemo, useRef, useState } from 'react';
import {
  CaretRightOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Dropdown,
  Form,
  type FormProps,
  FormRule,
  Input,
  InputNumber,
  InputRef,
  type MenuProps,
  Radio,
  Select,
  Space,
  Switch,
  theme,
  Tooltip,
} from 'antd';
import { FormListProps } from 'antd/es/form';
import cls from 'classnames';
import { isNumber, isObject } from 'lodash-es';

import { CustomComponent } from '../components/CustomComponent';
import { FileUpload } from '../components/FileUpload';
import { FormListItemWrapper } from '../components/FormListItemWrapper';
import { useFlow } from '../FlowContext';
import { i18n } from '../i18n';
import { FlowNode, FlowNodeSchema } from '../type';
import {
  compileValidationSchema,
  createId,
  getAttrHandleId,
  getAttrItemHandleId,
  getHandleId,
  getValidationErrorMessage,
  updateNodeAttrs,
} from '../utils';

import { ConnectionHandle } from './ConnectionHandle';

// eslint-disable-next-line react/display-name
export const Node = memo<NodeProps<FlowNode>>(
  ({ data, selected }) => {
    const nodeId = useNodeId();
    const { token } = theme.useToken();
    const reactFlow = useReactFlow<FlowNode>();
    const {
      locale,
      flowSchema,
      setNodes,
      disabled,
      useFlowStore,
      custom_components,
    } = useFlow();
    const containerRef = useRef<HTMLDivElement | null>(null);
    // rename the node title
    const [isTitleEdit, setIsTitleEdit] = useState(false);
    const inputRef = useRef<InputRef | null>(null);
    // the schema of the current node
    const schema = useMemo(
      () => flowSchema.nodes.find((item) => item.name === data.name),
      [data.name, flowSchema.nodes]
    );
    const { nodeCount } = useFlowStore((state) => ({
      nodeCount: state.nodeCounts[data.name],
    }));
    const [form] = Form.useForm();

    if (!schema) {
      return null;
    }

    const attrs = data.attrs || ({} as NonNullable<FlowNode['data']['attrs']>);

    const title = data.title || schema.title || schema.name;
    const sourcePorts = schema.ports?.source || [Position.Right];
    const targetPorts = schema.ports?.target || [Position.Left];
    const showToolbar = schema.show_toolbar ?? true;
    const deletable = schema.deletable ?? true;
    const addable = schema.addable ?? true;
    const hasAttrs = schema.attrs && schema.attrs?.length >= 1;

    const defaultNodeWidth = hasAttrs ? 360 : 200;
    const nodeWidth = schema.width || defaultNodeWidth;
    const nodeHeight = schema.height;

    const onValueChanges: FormProps['onValuesChange'] = (_, values) => {
      setNodes(
        (nodes) =>
          nodes.map((node) => {
            if (node.id === nodeId) {
              return updateNodeAttrs(node, values);
            }
            return node;
          }),
        {
          dataChanged: true,
        }
      );
    };

    const onTitleUpdate = (value: string) => {
      setIsTitleEdit(false);
      if (value === data.title) {
        return;
      }
      setNodes(
        (nodes) =>
          nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  title: value,
                },
              };
            }
            return node;
          }),
        {
          dataChanged: true,
        }
      );
    };

    const renderPorts = (
      ports: FlowNodeSchema['ports'] = {
        source: [],
        target: [],
      },
      getId: (type: 'source' | 'target', index: number) => string
    ) => {
      return (
        <>
          {ports.target?.map((port, i) => {
            return (
              <ConnectionHandle
                key={i}
                className={cls(
                  'ms-flow-node-handle',
                  `ms-flow-node-handle-${port}`
                )}
                id={getId('target', i)}
                type="target"
                position={port}
              >
                <MinusOutlined className="ms-flow-node-handle-icon" />
              </ConnectionHandle>
            );
          })}
          {ports.source?.map((port, i) => {
            return (
              <ConnectionHandle
                key={i}
                className={cls(
                  'ms-flow-node-handle',
                  `ms-flow-node-handle-${port}`
                )}
                id={getId('source', i)}
                type="source"
                position={port}
              >
                <PlusOutlined className="ms-flow-node-handle-icon" />
              </ConnectionHandle>
            );
          })}
        </>
      );
    };

    const menus: MenuProps['items'] = [
      {
        key: 'rename',
        label: i18n('rename', locale),
        onClick() {
          setIsTitleEdit(true);
          requestAnimationFrame(() => {
            if (inputRef.current && inputRef.current.input) {
              inputRef.current.input.value = title;
              inputRef.current.focus();
            }
          });
        },
      },
      addable
        ? {
            key: 'duplicate',
            label: i18n('duplicate', locale),
            onClick() {
              if (!nodeId) {
                return;
              }
              const node = reactFlow.getNode(nodeId) as FlowNode;
              if (!node) {
                return;
              }

              setNodes(
                (nodes) => [
                  ...nodes.map((n) => {
                    if (n.id === nodeId) {
                      return {
                        ...n,
                        selected: false,
                      };
                    }
                    return n;
                  }),
                  {
                    ...node,
                    data: {
                      ...node.data,
                      title: `${title} Copy`,
                    },
                    id: createId(),
                    position: {
                      x: node.position.x + 50,
                      y: node.position.y + 50,
                    },
                  },
                ],
                {
                  dataChanged: true,
                  updateNodeCounts: true,
                }
              );
            },
          }
        : null,
      ...((deletable
        ? [
            {
              type: 'divider',
            },
            {
              key: 'delete',
              label: i18n('delete', locale),
              disabled:
                typeof schema.min === 'number' && nodeCount >= schema.min,
              danger: true,
              onClick() {
                setNodes(
                  (nodes) => nodes.filter((node) => node.id !== nodeId),
                  {
                    dataChanged: true,
                    updateNodeCounts: true,
                  }
                );
              },
            },
          ]
        : []) as NonNullable<MenuProps['items']>),
    ].filter(Boolean);

    return (
      <>
        <Card
          ref={containerRef}
          className="ms-flow-node"
          style={{
            width: nodeWidth,
            height: nodeHeight,
            borderWidth: 2,
            borderColor: selected ? `${token.colorPrimary}` : undefined,
            ...({
              '--ms-flow-node-text-error': token.colorError,
            } as React.CSSProperties),
          }}
          title={
            <div className="ms-flow-node-header">
              <div className="ms-flow-node-header-title">
                {schema.icon && (
                  <img src={schema.icon} alt={schema.title || schema.name} />
                )}
                {isTitleEdit ? (
                  <Input
                    ref={inputRef}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onTitleUpdate((e.target as HTMLInputElement).value);
                      }
                    }}
                    onBlur={(e) => {
                      onTitleUpdate(e.target.value);
                    }}
                  />
                ) : (
                  title
                )}
              </div>
              <div className="ms-flow-node-header-description">
                {schema.description}
              </div>
            </div>
          }
          styles={{
            body: {
              padding: hasAttrs ? '10px 20px' : 0,
            },
            header: {
              border: hasAttrs ? undefined : 'none',
            },
          }}
          extra={
            showToolbar ? (
              <Dropdown
                disabled={disabled}
                menu={{ items: menus }}
                placement="bottomRight"
                getPopupContainer={() => containerRef.current || document.body}
              >
                <EllipsisOutlined style={{ fontSize: 20, marginLeft: 4 }} />
              </Dropdown>
            ) : null
          }
        >
          {hasAttrs ? (
            <Form
              form={form}
              onValuesChange={onValueChanges}
              initialValues={attrs}
              disabled={disabled}
            >
              {schema.attrs?.map((attr, attrIndex) => {
                let content: React.ReactNode = null;
                switch (attr.type) {
                  case 'input':
                    content = <Input />;
                    break;
                  case 'textarea':
                    content = <Input.TextArea />;
                    break;
                  case 'radio':
                    content = (
                      <Radio.Group>
                        {attr.options?.map((option) => (
                          <Radio key={option.value} value={option.value}>
                            {option.label}
                          </Radio>
                        ))}
                      </Radio.Group>
                    );
                    break;
                  case 'checkbox':
                    content = (
                      <Checkbox.Group>
                        {attr.options?.map((option) => (
                          <Checkbox key={option.value} value={option.value}>
                            {option.label}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    );
                    break;
                  case 'number':
                    content = <InputNumber style={{ width: '100%' }} />;
                    break;
                  case 'select':
                    content = (
                      <Select
                        style={{ width: '100%' }}
                        options={attr.options}
                        getPopupContainer={() =>
                          containerRef.current || document.body
                        }
                      />
                    );
                    break;
                  case 'switch':
                    content = <Switch />;
                    break;
                  case 'file':
                    content = <FileUpload />;
                    break;
                  default:
                    if (attr.type) {
                      const component = custom_components[attr.type];
                      content = (
                        <CustomComponent
                          node={schema.name}
                          component={component}
                          attr={attr.name}
                        />
                      );
                    } else {
                      content = <Input />;
                    }
                }
                content = React.isValidElement<Record<PropertyKey, any>>(
                  content
                )
                  ? React.cloneElement(content, {
                      ...content.props,
                      ...attr.props,
                      disabled: attr.disabled || attr.props?.disabled,
                      className: cls(
                        attr.props?.className,
                        content.props.className,
                        'nodrag'
                      ),
                    })
                  : content;
                let addFn = () => {};

                const validate = attr.json_schema_validator
                  ? compileValidationSchema(attr.json_schema_validator)
                  : null;
                const requiredRule: FormRule = {
                  required: !!attr.required,
                  message: isObject(attr.required)
                    ? attr.required.message
                    : undefined,
                };
                const customRule: FormRule = {
                  validator(_, value) {
                    if (validate) {
                      const valid = validate(value);
                      if (!valid) {
                        const msg = getValidationErrorMessage(
                          validate.errors,
                          locale
                        );
                        return Promise.reject(new Error(msg));
                      }
                    }
                    return Promise.resolve();
                  },
                };
                const field = attr.list ? (
                  <div className="ms-flow-node-field-list">
                    <Form.List
                      name={attr.name}
                      rules={[customRule] as FormListProps['rules']}
                    >
                      {(fields, { add, remove }, meta) => {
                        addFn = add;
                        return (
                          <>
                            {fields.map((f, index) => {
                              return (
                                <div
                                  className="ms-flow-node-field ms-flow-node-field-item"
                                  key={f.key}
                                >
                                  <Form.Item
                                    {...f}
                                    label={attr.title || attr.name}
                                    labelCol={{ span: 0 }}
                                    rules={[requiredRule]}
                                  >
                                    <FormListItemWrapper
                                      index={index}
                                      onRemove={() => remove(f.name)}
                                      showRemove={
                                        !isObject(attr.list) ||
                                        !isNumber(attr.list.min) ||
                                        attr.list.min < attrs[attr.name]?.length
                                          ? true
                                          : false
                                      }
                                    >
                                      {content}
                                    </FormListItemWrapper>
                                  </Form.Item>
                                  {renderPorts(attr.ports, (type, i) =>
                                    getAttrItemHandleId({
                                      nodeId: nodeId || '',
                                      type,
                                      attr: attr.name,
                                      handleIndex: i,
                                      attrIndex,
                                      attrItemIndex: index,
                                    })
                                  )}
                                </div>
                              );
                            })}
                            <Form.ErrorList {...meta} />
                          </>
                        );
                      }}
                    </Form.List>
                  </div>
                ) : (
                  <div className="ms-flow-node-field">
                    <Form.Item
                      name={attr.name}
                      labelCol={{ span: 0 }}
                      label={attr.title || attr.name}
                      rules={[requiredRule, customRule]}
                    >
                      {content}
                    </Form.Item>
                    {renderPorts(attr.ports, (type, i) =>
                      getAttrHandleId({
                        nodeId: nodeId || '',
                        type,
                        handleIndex: i,
                        attrIndex,
                        attr: attr.name,
                      })
                    )}
                  </div>
                );

                const isAccordion = attr.is_accordion ?? true;

                return (
                  <Collapse
                    collapsible={isAccordion ? 'header' : 'icon'}
                    key={attr.name}
                    bordered={false}
                    defaultActiveKey={attr.name}
                    style={{ marginBottom: 16, position: 'relative' }}
                    expandIcon={({ isActive }) =>
                      isAccordion ? (
                        <CaretRightOutlined rotate={isActive ? 90 : 0} />
                      ) : null
                    }
                    items={[
                      {
                        key: attr.name,
                        label: (
                          <Space size="small">
                            <span
                              className={cls('ms-flow-node-field-label', {
                                'ms-flow-node-field-label-required':
                                  attr.required,
                              })}
                            >
                              {attr.title || attr.name}
                            </span>
                            {attr.description && (
                              <Tooltip
                                title={attr.description}
                                getPopupContainer={() =>
                                  containerRef.current || document.body
                                }
                              >
                                <InfoCircleOutlined style={{ opacity: 0.5 }} />
                              </Tooltip>
                            )}
                          </Space>
                        ),
                        style: { padding: 0 },
                        children: field,
                        extra:
                          attr.list &&
                          (!isObject(attr.list) ||
                            !isNumber(attr.list.max) ||
                            attr.list.max > attrs[attr.name]?.length) ? (
                            <Button
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                addFn();
                              }}
                              icon={<PlusOutlined />}
                            />
                          ) : null,
                      },
                    ]}
                  />
                );
              })}
            </Form>
          ) : null}
        </Card>
        {renderPorts(
          {
            source: sourcePorts,
            target: targetPorts,
          },
          (type, i) =>
            getHandleId({
              type,
              nodeId: nodeId || '',
              handleIndex: i,
            })
        )}
      </>
    );
  },
  (prev, next) => {
    return prev.data === next.data && prev.selected === next.selected;
  }
);
