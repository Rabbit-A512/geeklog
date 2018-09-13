import { Button, Card, Form, Icon, Input, Tooltip } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from 'react';
import { FormEvent } from "react";

import TextArea from "antd/lib/input/TextArea";

class RegisterForm extends React.Component<FormComponentProps> {

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('Register form value:', values);
      }
    });
  };

  public render() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    return (
      <Card
        title={'修改个人信息'}
        style={{
          maxWidth: '600px',
          margin: '50px auto'
        }}
      >
        <Form
          onSubmit={this.handleSubmit}
          className={'RegisterForm'}
          style={{
            margin: '0 30px'
          }}
        >
          <FormItem
            label={(
              <span>昵称&nbsp;
                <Tooltip title={"昵称将作为您在此网站的主要称呼"}>
                <Icon type={'question-circle-o'}/>
              </Tooltip>
            </span>
            )}>
            {getFieldDecorator('nickname', {
              rules: [
                {
                  required: true,
                  message: "请输入昵称"
                }
              ]
            })(
              <Input type={'text'} placeholder={'轻舞飞扬'}/>
            )}
          </FormItem>
          <FormItem
            label={(
              <span>
              个人简介
            </span>
            )}>
            {getFieldDecorator('bio', {
              initialValue: '尚未填写...',
              rules: [
                {
                  required: true,
                  message: ''
                }
              ]
            })(
              <TextArea/>
            )}
          </FormItem>
          <Button htmlType={'submit'} type={'primary'}>注册</Button>
        </Form>
      </Card>
    );
  }
}

const WrappedRegisterForm = Form.create()(RegisterForm);

export default WrappedRegisterForm;
