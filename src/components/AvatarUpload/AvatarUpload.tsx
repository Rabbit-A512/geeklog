import * as React from 'react';
import { Upload, Icon, message, Card } from 'antd';
import { UploadFile } from "antd/lib/upload/interface";
import { getCurrentUser } from "../../utils/auth";

function beforeUpload(file: UploadFile) {
  const isJPG = file.type === 'image/jpeg';
  const isPNG = file.type === 'image/png';
  if (!isJPG && !isPNG) {
    message.error('只能上传jpg, jpeg, png格式的图片！');
  }

  return isJPG
}

class AvatarUpload extends React.Component {
  public state = {
    loading: false,
    imageUrl: ''
  };

  public handleChange = (info: any) => {
    console.log(info);
    if (info.file.status === 'uploading') {
      this.setState({
        loading: true
      });
      return;
    }
    if (info.file.status === 'done') {
      // getBase64(info.file.originFileObj, (imageUrl: string) => this.setState({
      //   imageUrl,
      //   loading: false
      // }))
      console.log(info.file.response);
      this.setState({
        imageUrl: info.file.response.data.avatar
      });
    }
  };

  public render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div>Upload</div>
      </div>
    );

    const imageUrl = this.state.imageUrl;
    const currentUser = getCurrentUser();

    return (
      <Card
        title={(
          <div>
            <h2>上传新头像</h2>
            <p>新头像需要重新登录后才能显示正确。</p>
          </div>
        )}
        style={{
          margin: '20px auto'
        }}
      >
        <Upload
          name={'avatar'}
          headers={{
            'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
          }}
          listType={'picture-card'}
          showUploadList={false}
          action={`http://47.106.158.254/avatars/${currentUser.user_id}`}
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt={'avatar'}/> : uploadButton}
        </Upload>
      </Card>
    );
  }
}

export default AvatarUpload;
