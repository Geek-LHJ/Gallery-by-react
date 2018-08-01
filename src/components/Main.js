//CSS
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

//引入图片的JSON格式数据
var imageDatas= require("../data/imageDatas.json");
console.log('imageDatas'+{imageDatas});

let yeomanImage = require('../images/yeoman.png');

//将图片名信息转换为图片的URL路径信息，先写函数，再调用该函数
function genImageURL(imageDatasArr){
  for(var i= 0, j= imageDatasArr.length; i< j; i++){
    var singleImageData= imageDatasArr[i];
    singleImageData.imageURL =require('../images/'+ singleImageData.fileName);
    imageDatasArr[i]= singleImageData;
  }
  return imageDatasArr;
}
imageDatas= genImageURL(imageDatas);//对于只使用一次的函数还可以改写为立执行函数形式

//声明单幅图片的组件
var ImgFigure= React.createClass({
  render: function(){
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2>{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
});

class AppComponent extends React.Component {
  render() {

    //创建管理整个图片的控制大管家，包括图片组件以及导航组件
    var controllerUnits= [],
        imgFigures= [];
    // imageDatas.forEach(() => {
    //   imgFigures.push(<ImgFigure data= {value}/>);
    // });


    return (
      <section className="stage">
        <section className="img-sec">
          {imgFigures}
          <img src={yeomanImage}/>
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
