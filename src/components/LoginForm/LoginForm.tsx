import { Button, Form, Icon, Input } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import * as React from 'react';
import { FormEvent } from "react";

const FormItem = Form.Item;

class LoginForm extends React.Component<FormComponentProps> {

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('Login form values:', values);
      }
    });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} style={{maxWidth: '330px', margin: '100px auto'}}>

        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {
                message: '请输入用户名',
                required: true
              }
            ]
          })(
            <Input prefix={<Icon type={'user'} style={{color: 'rgba(0, 0, 0, 0.25)'}}/>} placeholder={'用户名'} />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                message: '请输入密码',
                required: true,
              }
            ]
          })(
            <Input
              placeholder={'Password'}
              type={'password'}
              prefix={<Icon type={'lock'} style={{color: 'rgba(0, 0, 0, .25)'}}/>}/>
          )}
        </FormItem>
        <Button type={'primary'} htmlType={'submit'} style={{width: '100%'}}>登录</Button>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;
