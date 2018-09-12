import { Form, Icon, Input } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from 'react';
import { FormEvent } from "react";

class RegisterForm extends React.Component<FormComponentProps> {

  public state = {
    confirmDirty: false
  };

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('Register form value:', values);
      }
    });
  };

  public handleConFirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  };

  public compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致，请检查');
    } else {
      callback();
    }
  };

  public validateToNextPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      // @ts-ignore
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  };

  public render() {
    const getFieldDecorator = this.props.form.getFieldDecorator;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [
              {
                message: '请输入用户名',
                required: true
              }
            ]
          })(
            <Input
              placeholder={'Username'}
              type={'text'}
              prefix={<Icon type={'user'} style={{color: '#ccc'}}/>}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              {
                message: '请输入密码，密码长度不小于6位且必须包含字母和数字',
                required: true,
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(
            <Input
              placeholder={'Password'}
              type={'password'}
              prefix={<Icon type={'lock'} style={{color: 'rgba(0, 0, 0, .25)'}}/>}/>
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('confirm', {
            rules: [
              {
                message: '请输入密码，密码长度不小于6位且必须包含字母和数字',
                required: true,
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(
            <Input
              onBlur={this.handleConFirmBlur}
              placeholder={'Confirm Password'}
              type={'password'}
              prefix={<Icon type={'lock'} style={{color: 'rgba(0, 0, 0, .25)'}}/>}/>
          )}
        </FormItem>
      </Form>
    );
  }
}

const WrappedRegisterForm = Form.create()(RegisterForm);

export default WrappedRegisterForm;
