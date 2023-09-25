import React, { useState } from 'react';
import { Form, Input, Select, Button, Row, Col } from 'antd';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/1337.css';
import './DynamicForm.css'; // Import your custom CSS file

const { Option } = Select;

const DynamicForm = () => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({ name: '', type: '' });

  const handleAddField = () => {
    if (newField.name && newField.type) {
      setFields([...fields, newField]);
      setNewField({ name: '', type: '' }); // Reset newField values
    }
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const handleAddNestedItem = (index) => {
    const updatedFields = [...fields];

    if (!updatedFields[index].nestedFields) {
      updatedFields[index].nestedFields = [];
    }

    // Create a new nested field with default values based on child field
    updatedFields[index].nestedFields.push({
      name: newField.name || 'DefaultName',
      type: newField.type || 'DefaultType',
    });

    setFields(updatedFields);
  };

  const handleRemoveNestedItem = (parentIndex, nestedIndex) => {
    const updatedFields = [...fields];
    updatedFields[parentIndex].nestedFields.splice(nestedIndex, 1);
    setFields(updatedFields);
  };

  // Handle changes in field name and type for both top-level and nested fields
  const handleFieldNameChange = (index, nestedIndex, value) => {
    const updatedFields = [...fields];
    if (nestedIndex !== undefined) {
      // Update the name of the nested field
      updatedFields[index].nestedFields[nestedIndex].name = value;
    } else {
      // Update the name of the top-level field
      updatedFields[index].name = value;
    }
    setFields(updatedFields);
  };

  const handleFieldTypeChange = (index, nestedIndex, value) => {
    const updatedFields = [...fields];
    if (nestedIndex !== undefined) {
      // Update the type of the nested field
      updatedFields[index].nestedFields[nestedIndex].type = value;
    } else {
      // Update the type of the top-level field
      updatedFields[index].type = value;
    }
    setFields(updatedFields);
  };

  const generateJSON = () => {
    const jsonFields = fields.map((field) => {
      const jsonField = { name: field.name, type: field.type };
      if (field.type === 'nested' && field.nestedFields) {
        jsonField[field.name] = field.nestedFields.map((nestedField) => ({
          name: nestedField.name || 'DefaultName',
          type: nestedField.type || 'DefaultType',
        }));
      }
      return jsonField;
    });

    return JSON.stringify(jsonFields, null, 2);
  };

  return (
    <div className="dynamic-form-container ">
      <Form form={form} layout="inline">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input
                placeholder="Field Name"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="type" rules={[{ required: true }]}>
              <Select
                style={{ width: '100%' }}
                placeholder="Field Type"
                value={newField.type}
                onChange={(value) => setNewField({ ...newField, type: value })}
              >
                <Option value="string">String</Option>
                <Option value="number">Number</Option>
                <Option value="nested">Nested</Option>
              </Select>
            </Form.Item>
            
          </Col>
          <Col span={6}>
            <Form.Item>
              <Button
                type="primary"
                block
                onClick={handleAddField}
              >
                Add Field
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div>
        {fields.map((field, index) => (
          <div key={index} className="field-container">
            <Row gutter={16}>
              <Col span={6}>
                <Input
                  placeholder="Field Name"
                  value={field.name}
                  onChange={(e) => handleFieldNameChange(index, undefined, e.target.value)}
                  
                />
              </Col>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="Field Type"
                  value={field.type}
                  onChange={(value) => handleFieldTypeChange(index, undefined, value)}
                  
                >
                  <Option value="string">String</Option>
                  <Option value="number">Number</Option>
                  <Option value="nested">Nested</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Button
                  type="danger"
                  onClick={() => handleRemoveField(index)}
                  className="className=dotted-border remove-button"
                >
                  Remove
                </Button>
              </Col>
            </Row>
            {field.type === 'nested' && field.nestedFields && field.nestedFields.length > 0 && (
              <div>
                {field.nestedFields.map((nestedField, nestedFieldIndex) => (
                  <Row gutter={16} key={nestedFieldIndex}>
                    <Col span={6}>
                      <Input
                        placeholder="Field Name"
                        value={nestedField.name}
                        onChange={(e) => handleFieldNameChange(index, nestedFieldIndex, e.target.value)}
                      />
                    </Col>
                    <Col span={6}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Field Type"
                        value={nestedField.type}
                        onChange={(value) => handleFieldTypeChange(index, nestedFieldIndex, value)}
                      >
                        <Option value="string">String</Option>
                        <Option value="number">Number</Option>
                        <Option value="nested">Nested</Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Button
                        type="danger"
                        onClick={() => handleRemoveNestedItem(index, nestedFieldIndex)}
                        className="dotted-border remove-button"
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              </div>
            )}
            {field.type === 'nested' && (
              <Row gutter={16}>
                <Col span={6} offset={6}>
                  <Button
                    type="primary"
                    onClick={() => handleAddNestedItem(index)}
                    style={{ width: `calc(100% - 32px)` }}
                  >
                    Add Item
                  </Button>
                </Col>
              </Row>
            )}
          </div>
        ))}
      </div>

      <div className="json-pretty-container" style={{ background: 'white' }}>
        
        <JSONPretty data={generateJSON()}  />
      </div>
    </div>
  );
};

export default DynamicForm;
