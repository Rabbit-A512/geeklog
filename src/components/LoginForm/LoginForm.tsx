import { Button, Form, Icon, Input, message } from 'antd';
import * as React from 'react';
import { FormEvent } from "react";

import './LoginForm.css';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { RouteComponentProps, StaticContext } from "react-router";
import myServer from '../../myServer';
import { AxiosError, AxiosResponse } from "axios";

const FormItem = Form.Item;

interface IProps extends RouteComponentProps<any, StaticContext, any>{
  form: WrappedFormUtils
}

class LoginForm extends React.Component<IProps> {

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((error: any, values: any) => {
      if (!error) {
        console.log('Login form values:', values);
        myServer.post('/login')
          .then((response: AxiosResponse) => {
            console.log(response.data);
            this.props.history.push('/');
          })
          .catch((netError: AxiosError) => {
            console.log((netError.response as AxiosResponse).status);
            message.error('用户名或密码错误！')
          });
      }
    });
  };

  public render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.handleSubmit}
        className={"LoginForm"}
        style={{
          maxWidth: '600px'
        }}
      >
        <h2>
          <Icon className={'LoginLogo'} type={'smile'} spin={true}/>
          &nbsp;欢迎
        </h2>
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
