import * as React from 'react';
import { Comment } from "../../models/comment";
import { Button, Card, Form, Modal, message, Pagination, List } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { WrappedFormUtils } from "antd/lib/form/Form";
import { getCurrentUser } from "../../utils/auth";
import server, { getAuthServer } from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { format } from "date-fns";
import * as zh_CN from "date-fns/locale/zh_cn/index.js";
import SafeAvatar from '../SafeAvatar/SafeAvatar';
import { RouteComponentProps, withRouter } from "react-router";

const Meta = Card.Meta;
const Item = List.Item;

interface IProps extends RouteComponentProps{
  comment: Comment;
  form: WrappedFormUtils;
  show_sub: boolean;
  show_reply_btn: boolean;
  loadRootComments:() => void;
}

class CommentCard extends React.Component<IProps> {

  public state = {
    modalVisible: false,
    sub_comments: Array<Comment>(),
    page: 1,
    size: 5,
    total: 10,
    can_comment: true,
    from_user_name: '',
    to_user_name: '',
    article_name: '',
    avatar: ''
  };


  public showModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  public handleOk = (e: any) => {
    console.log(this.props.form.validateFields((errors, values) => {
      if (!errors) {
        console.log(values);

        const currentUser = getCurrentUser();

        const reqBody = {
          content: values.comment,
          user_id: currentUser.user_id,
          article_id: this.props.comment.article_id,
          parent_id: this.props.comment.comment_id,
        };

        const authServer = getAuthServer();

        authServer.post('/comments', reqBody)
          .then((res: AxiosResponse) => {
            console.log(res);
            this.loadSubComments(1);
            this.props.loadRootComments();
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

  public handlePageSizeChange = (page: number, size: number) => {
    this.loadSubComments(page);
  };

  public loadSubComments = (page: number) => {

    const url = `/comments/${this.props.comment.comment_id}/sub_comments?page=${page}&size=${this.state.size}`;

    server.get(url)
      .then((res: AxiosResponse) => {
        const subComments = res.data.data ? res.data.data.entities : [];
        const total = res.data.data ? res.data.data.total : 0;
        this.setState({
          sub_comments: subComments,
          total
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public componentDidMount() {
    this.loadSubComments(1);

    // set can_comment field state field
    const currentUser = getCurrentUser();
    if (!currentUser) {
      this.props.history.replace('/login');
      return;
    }
    server.get(`/users/${currentUser.user_id}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            can_comment: res.data.data.can_comment
          });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });

    const { user_id, article_id } = this.props.comment;
    server.get(`/users/${user_id}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            from_user_name: res.data.data.nickname,
            avatar: res.data.data.avatar
          });
        }
      });

    server.get(`/articles/${article_id}`)
      .then((res: AxiosResponse) => {
        if (res.data.code === 200) {
          this.setState({
            article_name: res.data.data.title
          });
        }
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  public render() {

    const { getFieldDecorator } = this.props.form;

    const WrappedComment = withRouter(Form.create()(CommentCard));

    let commentBtn = null;

    if (this.props.show_reply_btn) {
      commentBtn = this.state.can_comment ? (
        <Button
          onClick={this.showModal}
          icon={'message'}
          htmlType={'button'}
          style={{
            marginTop: 10
          }}
        >
          回复ta
        </Button>
      ) : (
        <p
          style={{
            color: 'red'
          }}
        >
          您的评论权限已经被管理员冻结，请联系管理员QQ:2654525303申请解冻。
        </p>
      );
    }

    const subComments = this.props.show_sub ? (
      <Card
        bordered={false}
        style={{
          paddingLeft: '30px',
          display: this.state.sub_comments.length > 0 ? 'inherit' : 'none'
        }}
      >
        <List
          itemLayout={'horizontal'}
          dataSource={this.state.sub_comments}
          renderItem={(item: Comment) => (
            <Item
            >
              <WrappedComment
                show_reply_btn={true}
                loadRootComments={() => this.loadSubComments(1)}
                show_sub={false}
                comment={item}
              />
            </Item>
          )}
        />
        <Pagination
          size={'small'}
          total={this.state.total}
          pageSize={this.state.size}
          onChange={this.handlePageSizeChange}
        />
      </Card>
    ) : null;

    return (
      <Card
        bordered={true}
        className={'w-100'}
      >
        <Meta
          avatar={(
            <SafeAvatar
              avatarPath={this.state.avatar}
              size={'default'}
            />
          )}
          title={(
            <div>
              <span
               style={{
                 fontSize: 'large',
                 color: '#40a9ff'
               }}
              >{this.state.from_user_name}</span>
              &nbsp;回复&nbsp;
              <span
                style={{
                  fontSize: 'large',
                  color: '#52c41a'
                }}
              >{this.state.article_name}</span>
            </div>
          )}
          description={(
            <div>
              <p>{this.props.comment.content}</p>
              <p
                style={{
                  textAlign: 'right'
                }}
              >{format(this.props.comment.created_at, 'YYYY年 MMMM Do, HH:mm:ss', {locale: zh_CN})}</p>
            </div>
          )}
        />
        {commentBtn}
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
        {subComments}
      </Card>
    );
  }
}

const wrappedCommentCard = Form.create()(CommentCard);

export default withRouter(wrappedCommentCard);
