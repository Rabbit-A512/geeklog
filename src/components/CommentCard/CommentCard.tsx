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
import { Link } from "react-router-dom";
import FormItem from "antd/lib/form/FormItem";

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

    const comment = {...this.props.comment};

    const toUser = comment.to_user_nickname ? (
      <span>
        <span> 回复 </span>
        <SafeAvatar
          avatarPath={comment.to_user_avatar}
          size={'small'}
        />
        <span
          style={{
            fontSize: 'large',
            color: '#40a9ff'
          }}
        >
          {comment.to_user_nickname}
        </span>
      </span>
    ) : null;

    const fromArticle = !this.props.show_reply_btn ? (
      <div
        style={{
          fontSize: 'medium',
          color: '#52c41a',
          marginTop: '5px'
        }}
      >
        <span>来自文章：</span>
        <Link to={`/read-article/${comment.article_id}`}>
          {comment.article_title}
        </Link>
      </div>
    ) : null;

    return (
      <Card
        bordered={true}
        className={'w-100'}
      >
        <Meta
          avatar={(
            <Link to={`/user-home/${comment.user_id}`}>
              <SafeAvatar
                avatarPath={comment.from_user_avatar}
                size={'default'}
              />
            </Link>
          )}
          title={(
            <div>
              <div>
                <Link to={`/user-home/${comment.user_id}`}>
                  <span
                    style={{
                      fontSize: 'large',
                      color: '#40a9ff'
                    }}
                  >
                    {comment.from_user_nickname}
                  </span>
                </Link>
                {toUser}
              </div>
              {fromArticle}
            </div>
          )}
          description={(
            <div>
              <p
                style={{
                  color: '#333',
                  fontSize: 'medium'
                }}
              >{comment.content.length > 30 ? comment.content.substr(0, 30) + '...' : comment.content}</p>
              <p
                style={{
                  textAlign: 'right'
                }}
              >{format(comment.created_at, 'YYYY年 M月Do日, HH:mm:ss', {locale: zh_CN})}</p>
            </div>
          )}
        />
        {commentBtn}
        <Modal
          title={(
            <span>
              <span>回复给</span>
              <SafeAvatar
                avatarPath={comment.from_user_avatar}
                size={'small'}
              />
              &nbsp;
              {comment.from_user_nickname}
            </span>
          )}
          visible={this.state.modalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <FormItem>
            {getFieldDecorator('comment', {
              rules: [
                {
                  message: '评论不能为空',
                  required: true
                },
                {
                  message: '评论长度需要大于5小于255',
                  min: 5,
                  max: 255
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
          </FormItem>
        </Modal>
        {subComments}
      </Card>
    );
  }
}

const wrappedCommentCard = Form.create()(CommentCard);

export default withRouter(wrappedCommentCard);
