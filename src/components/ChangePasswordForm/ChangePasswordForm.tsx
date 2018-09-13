import * as React from 'react';

import './ChangePasswordForm.css';
import { FormComponentProps } from "antd/lib/form";
import { CSSProperties, FormEvent } from "react";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button/button";
import { Divider } from "antd";

class ChangePasswordForm extends React.Component<FormComponentProps> {

  public state = {
    confirmDirty: false
  };

  public submitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log(this.props.form);
  };

  public handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({
      confirmDirty: this.state.confirmDirty || !!value
    });
  };

  public compareToFirstPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('两次密码输入不一致，请检查')
    } else {
      callback();
    }
  };

  public validateToNextPassword = (rule: any, value: any, callback: any) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      // @ts-ignore
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  public render() {

    const style: CSSProperties = {
      maxWidth: '330px',
      margin: '0 auto'
    };

    const getFieldDecorator = this.props.form.getFieldDecorator;
    return (
      <div>
        <Divider><h2>修改密码</h2></Divider>
        <Form onSubmit={this.submitHandler} style={style}>
          <FormItem label={'旧密码'}>
            {getFieldDecorator('old_password', {
              rules: [
                {
                  message: '请输入旧密码',
                  required: true
                }
              ]
            })(
              <Input type={'password'}/>
            )}
          </FormItem>
          <FormItem label={'新密码'}>
            {getFieldDecorator('new_password', {
              rules: [
                {
                  message: '请输入新密码',
                  required: true
                },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(
              <Input type={'password'} />
            )}
          </FormItem>
          <FormItem label={'确认新密码'}>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  message: '请再次输入新密码',
                  required: true
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(
              <Input onBlur={this.handleConfirmBlur} type={'password'} />
            )}
          </FormItem>
          <Button style={{ width: '100%' }} type={'primary'} htmlType={'submit'}>提交</Button>
        </Form>
      </div>
    );
  }
}

const WrappedChangePasswordForm = Form.create()(ChangePasswordForm);

export default WrappedChangePasswordForm;
