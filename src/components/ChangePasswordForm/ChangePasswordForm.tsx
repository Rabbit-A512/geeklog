import * as React from 'react';
import * as _ from 'lodash';
import { getAuthServer } from '../../utils/server';

import './ChangePasswordForm.css';
import { CSSProperties, FormEvent } from "react";
import Form, { WrappedFormUtils } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button/button";
import { Card } from "antd";
import { getCurrentUser } from "../../utils/auth";
import { RouteComponentProps } from "react-router";
import { AxiosError, AxiosResponse } from "axios";

interface IProps extends RouteComponentProps{
  form: WrappedFormUtils
}

class ChangePasswordForm extends React.Component<IProps> {

  public state = {
    confirmDirty: false
  };

  public submitHandler = (e: FormEvent) => {
    e.preventDefault();
    console.log(this.props.form);
    this.props.form.validateFields(((errors, values) => {
      if (!errors) {
        const user = getCurrentUser();
        if (!user) {
          this.props.history.replace('/login');
        } else {
          const temp = _.pick(values, ['old_password', 'new_password']);
          const reqBody = {...temp, user_id: user.user_id};
          const axios = getAuthServer();
          axios.post('/change-password', reqBody)
            .then((res: AxiosResponse) => {
              this.props.history.push(`/feature/user-home/${user.user_id}`);
            })
            .catch((error: AxiosError) => {
              console.log(error);
            });
        }
      }
    }));
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
        <Card
          title={'修改密码'}
          style={{
            maxWidth: '500px',
            margin: '30px auto'
          }}
        >
          <Form
            onSubmit={this.submitHandler}
            style={style}
          >
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
        </Card>
      </div>
    );
  }
}

const WrappedChangePasswordForm = Form.create()(ChangePasswordForm);

export default WrappedChangePasswordForm;
