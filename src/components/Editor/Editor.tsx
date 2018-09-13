import * as React from 'react';
import TextArea from "antd/lib/input/TextArea";
import Input from "antd/lib/input/Input";
import Form, { FormComponentProps } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Button from "antd/lib/button/button";
import { CSSProperties, FormEvent } from "react";
import { Divider } from "antd";

class Editor extends React.Component<FormComponentProps> {
  public state = {
    title: '你好世界',
    source: '# Hello Markdown'
  };

  public formSubmitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log(this.props.form.getFieldsValue());
  };

  public render() {

    const style: CSSProperties = {
      maxWidth: '330px',
    };

    const getFieldDecorator = this.props.form.getFieldDecorator;

    return (
      <div>
        <Divider><h2>新的文章</h2></Divider>
        <Form onSubmit={this.formSubmitHandler}>
          <FormItem label={"标题"} style={style}>
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
          <FormItem label={"内容"}>
            {getFieldDecorator('content', {
              initialValue: this.state.source
            })(
              <TextArea
                autosize={{minRows: 10}}/>
            )}
          </FormItem>
          <Button type={'primary'} htmlType={'submit'}>提交</Button>
        </Form>
      </div>

    );
  }
}

const WrappedEditor = Form.create()(Editor);

export default WrappedEditor;
