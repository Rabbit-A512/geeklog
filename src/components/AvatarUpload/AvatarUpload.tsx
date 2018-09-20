import * as React from 'react';
import { Upload, Icon, message, Card } from 'antd';
import { UploadFile } from "antd/lib/upload/interface";
import { getCurrentUser } from "../../utils/auth";

function beforeUpload(file: UploadFile) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('只能上传JPG格式的图片！');
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
        title={'上传新的头像'}
        style={{
          marginTop: '20px',
          maxWidth: '330px'
        }}
      >
        <Upload
          name={'avatar'}
          headers={{
            Authorization: localStorage.getItem('token') || ''
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
