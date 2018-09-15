import { Button, Card, Form, Icon, Input, Tooltip } from "antd";
import { FormComponentProps } from "antd/lib/form";
import FormItem from "antd/lib/form/FormItem";
import * as React from 'react';
import { FormEvent } from "react";

import './RegisterForm.css';
import TextArea from "antd/lib/input/TextArea";
import axios from '../../myServer';
import { AxiosError, AxiosResponse } from "axios";

class RegisterForm extends React.Component<FormComponentProps> {

  public state = {
    confirmDirty: false
  };

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('Register form value:', values);
        axios.post('/users', values)
          .then((response: AxiosResponse) => {
            console.log(response);
          })
          .catch((axiosError: AxiosError) => {
            console.log(axiosError);
          });
      }
    });
  };

  public usernameValidator = (rule: any, value: any, callback: any) => {
    setTimeout(() => {
      callback(`${value} 已被占用`);
    }, 2000);
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
      <Card
        title={'注册新用户'}
        style={{
          maxWidth: '500px',
          margin: '50px auto'
        }}
      >
        <Form
          onSubmit={this.handleSubmit}
          className={'RegisterForm'}
          style={{
            margin: '0 50px'
          }}
        >
          <FormItem label={"用户名"}>
            {getFieldDecorator('username', {
              rules: [
                {
                  message: '请输入用户名',
                  required: true
                },
                {
                  validator: this.usernameValidator
                }
              ]
            })(
              <Input
                placeholder={'Username'}
                type={'text'}
                prefix={<Icon type={'user'} style={{color: '#ccc'}}/>}/>
            )}
          </FormItem>
          <FormItem label={"密码"}>
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
          <FormItem　label={"确认密码"}>
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
