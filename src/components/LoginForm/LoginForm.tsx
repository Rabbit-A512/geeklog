import { Button, Col, Form, Icon, Input, message, Row } from 'antd';
import * as React from 'react';
import { FormEvent } from "react";

import './LoginForm.css';
import { WrappedFormUtils } from "antd/lib/form/Form";
import { RouteComponentProps, StaticContext } from "react-router";
import server from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { Link } from "react-router-dom";

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
        server.post('/login', values)
          .then((res: AxiosResponse) => {
            switch (res.data.code) {
              case 200:
                console.log(res.data);
                localStorage.setItem('token', res.data.data.token);
                this.props.history.push('/');
                break;
              default:
                message.error('用户名或密码错误！');
            }
          })
          .catch((netError: AxiosError) => {
            console.log(netError);
            message.error('用户名或密码错误！');
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
          maxWidth: '800px',
          width: '300px'
        }}
      >
        <h2>
          <Icon className={'LoginLogo'} type={'smile'}/>
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
        <Row
          style={{
            textAlign: 'center'
          }}
        >
          <Col span={12}>
            <Button type={'primary'} htmlType={'submit'}>登录</Button>
          </Col>
          <Col span={12}>
            <Link to={'/register'}>
              <Button htmlType={'button'}>注册</Button>
            </Link>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;
