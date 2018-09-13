import * as React from 'react';
import { Upload, Icon, message, Card } from 'antd';
import { UploadFile } from "antd/lib/upload/interface";

function getBase64(img: Blob, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

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
      getBase64(info.file.originFileObj, (imageUrl: string) => this.setState({
        imageUrl,
        loading: false
      }))
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
          listType={'picture-card'}
          showUploadList={false}
          action={'//jsonplaceholder.typicode.com/posts/'}
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
