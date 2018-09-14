import * as React from 'react';
import Input from "antd/lib/input/Input";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Button from "antd/lib/button/button";
import { FormEvent } from "react";
import { Tabs, Select, Card } from "antd";
import * as ReactMarkdown from 'react-markdown';
import { UnControlled as CodeMirror } from "react-codemirror2";

import CodeBlock from "./CodeBlock";
import TextArea from "antd/lib/input/TextArea";

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class Editor extends React.Component<FormComponentProps> {
  public state = {
    theme: 'monokai',
    title: '你好世界',
    source: `# Hello Markdown

\`\`\`javascript
var a = 2;
console.log('Hello, world!');
\`\`\`
`
  };

  public formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log(this.props.form.getFieldsValue());
  };

  public themeChangeHandler = (value: string) => {
    this.setState({
      theme: value
    });
  };

  public render() {

    const getFieldDecorator = this.props.form.getFieldDecorator;

    return (
      <div>
        <h2
          style={{
            textAlign: 'center',
            marginTop: '20px'
          }}
        >新的文章</h2>

        <Form onSubmit={this.formSubmitHandler}>
          <FormItem
            label={"标题"}
            style={{
              maxWidth: '500px',
            }}
          >
            {getFieldDecorator('title', {
              rules: [
                {
                  message: '文章标题不能为空',
                  required: true
                }
              ],
              initialValue: this.state.title
            })(
              <Input
                id={'title'}
                disabled={false}
                type={'text'} />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('content', {
              initialValue: this.state.source
            })(
              <TextArea
                style={{
                  display: 'none'
                }}
              />
            )}
          </FormItem>
          <Tabs
            defaultActiveKey={'1'}
            type={'card'}
            style={{
              marginBottom: '10px'
            }}
          >
            <TabPane tab={'编辑'} key={'1'}>
              <Select
                defaultValue={'monokai'}
                onChange={this.themeChangeHandler}
                style={{
                  width: '200px',
                  marginBottom: '10px',
                  marginLeft: 'auto'
                }}
              >
                <Option value={'monokai'}>Monokai</Option>
                <Option value={'material'}>Material</Option>
                <Option value={'the-matrix'}>The Matrix</Option>
              </Select>
              <CodeMirror
                value={this.state.source}
                options={{
                  mode: 'markdown',
                  theme: this.state.theme,
                  lineNumbers: true
                }}
                onChange={(editor, data, value) => {
                  this.props.form.setFieldsValue({
                    content: value
                  })
                }}
              />
            </TabPane>
            <TabPane tab={'预览'} key={'2'}>
              <Card

              >
                <ReactMarkdown
                  source={this.props.form.getFieldValue('content')}
                  renderers={{
                    code: CodeBlock
                  }}
                />
              </Card>
            </TabPane>
          </Tabs>
          <Button type={'primary'} htmlType={'submit'}>提交</Button>
        </Form>
      </div>

    );
  }
}

const WrappedEditor = Form.create()(Editor);

export default WrappedEditor;
