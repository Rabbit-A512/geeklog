import { Button, Card, Form, Icon, Input, Tooltip } from "antd";
import FormItem from "antd/lib/form/FormItem";
import * as React from 'react';
import { FormEvent } from "react";

import TextArea from "antd/lib/input/TextArea";
import { getCurrentUser } from "../../utils/auth";
import { RouteComponentProps } from "react-router";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { getAuthServer } from "../../utils/server";
import { AxiosError, AxiosResponse } from "axios";

// import { authServer } from '../../utils/server';

interface IProps extends RouteComponentProps{
  form: WrappedFormUtils
}

class RegisterForm extends React.Component<IProps> {

  public state = {
    user_id: null,
    nickname: null,
    bio: null
  };

  public componentDidMount() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      this.props.history.replace('/login');
    } else {
      const id = currentUser.user_id;
      const axios = getAuthServer();
      axios.get(`/users/${id}`)
        .then((res: AxiosResponse) => {
          this.setState({
            nickname: res.data.data.nickname,
            bio: res.data.data.bio,
            user_id: id
          });
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  }

  public handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.form.validateFields((error, values) => {
      if (!error) {
        console.log('Register form value:', values);
        const authServer = getAuthServer();
        authServer.put(`/users/${this.state.user_id}`, values)
          .then((res: AxiosResponse) => {
            console.log(res);
            if (res.data.code === 200) {
              this.props.history.push(`/feature/user-home/${this.state.user_id}`);
            }
          })
          .catch((axiosError: AxiosError) => {
            console.log(axiosError);
          });
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
              initialValue: this.state.nickname,
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
              initialValue: this.state.bio
            })(
              <TextArea/>
            )}
          </FormItem>
          <Button htmlType={'submit'} type={'primary'}>提交</Button>
        </Form>
      </Card>
    );
  }
}

const WrappedRegisterForm = Form.create()(RegisterForm);

export default WrappedRegisterForm;
