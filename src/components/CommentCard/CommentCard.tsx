import * as React from 'react';
import { Comment } from "../../models/comment";
import { Button, Card, Form, Modal, message } from "antd";
import Avatar from "antd/lib/avatar";
import TextArea from "antd/lib/input/TextArea";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { getCurrentUser } from "../../utils/auth";
import server, { getAuthServer } from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";

const Meta = Card.Meta;

interface IProps {
  comment: Comment,
  form: WrappedFormUtils
}

class CommentCard extends React.Component<IProps> {

  public state = {
    modalVisible: false
  };


  public showModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  public handleOk = (e: any) => {
    console.log(e);
    console.log(this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);

        const currentUser = getCurrentUser();

        const reqBody = {
          content: values.comment,
          user_id: currentUser.user_id,
          article_id: this.props.comment.article_id,
          parent_id: this.props.comment.comment_id,
          // root_id: this.props.comment.root_id ? this.props.comment.root_id : this.props.comment.comment_id
        };

        const authServer = getAuthServer();

        authServer.post('/comments', reqBody)
          .then((res: AxiosResponse) => {
            console.log(res);
            this.setState({
              modalVisible: false
            });
          })
          .catch((error: AxiosError) => {
            console.log(error);
          });

        this.setState({
          modalVisible: false
        });
      } else {
        message.warning('回复内容不能为空！');
      }
    }));
  };

  public handleCancel = (e: any) => {
    console.log(e);
    this.setState({
      modalVisible: false
    });
  };

  public loadSubComments = () => {
    server.get(`/comments/${this.props.comment.comment_id}/sub_comments?page=1&size=10`)
      .then((res: AxiosResponse) => {
        console.log(res);
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public componentDidMount() {
    this.loadSubComments();
  }

  public render() {

    const { getFieldDecorator } = this.props.form;

    return (
      <Card
        bordered={false}
      >
        <Meta
          avatar={<Avatar icon={'user'}/>}
          title={`user_id: ${this.props.comment.user_id}`}
          description={this.props.comment.content}
        />
        <Button
          onClick={this.showModal}
          icon={'message'}
          htmlType={'button'}
        />
        <Modal
          title={`回复给${this.props.comment.user_id}`}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {getFieldDecorator('comment', {
            rules: [
              {
                required: true,
                message: '回复不能为空'
              }
            ]
          })(
            <TextArea
              autosize={{
                minRows: 2,
                maxRows: 8
              }}
            />
          )}

        </Modal>
      </Card>
    );
  }
}

const wrappedCommentCard = Form.create()(CommentCard);

export default wrappedCommentCard;
