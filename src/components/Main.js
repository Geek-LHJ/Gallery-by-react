//CSS
require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

//引入图片的JSON格式数据
let imageDatas= require('../data/imageDatas.json');
// console.log('imageDatas:'+JSON.stringify(imageDatas));

let yeomanImage = require('../images/yeoman.png');

//将图片名信息转换为图片的URL路径信息，先写函数，再调用该函数
function genImageURL(imageDatasArr){
  for(let i= 0, j= imageDatasArr.length; i< j; i++){
    let singleImageData= imageDatasArr[i];
    singleImageData.imageURL =require('../images/'+ singleImageData.fileName);
    imageDatasArr[i]= singleImageData;
  }
  return imageDatasArr;
}
imageDatas= genImageURL(imageDatas);//对于只使用一次的函数还可以改写为立执行函数形式
// console.log('imageDatas:'+JSON.stringify(imageDatas));

//获取区间内的随机值
function getRangeRandom(low, high){
  return Math.ceil(Math.random()* (high - low)+ low);
}

//声明单幅图片的组件
let ImgFigure= React.createClass({
  render: function(){

    let styleObj= {};

    //如果props属性中制定了这张图片的位置，则使用
    if(this.props.arrange.pos){
      styleObj= this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} className="img-pic"/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
});

class AppComponent extends React.Component {
  Constant = {
    centerPos:{//中心
      left:0,
      right:0
    },
    hPosRange:{//水平方向分区取值范围
      leftSecX:[0, 0],
      rightSecX:[0, 0]
    },
    vPosRange:{//垂直方向分区取值范围
      x:[0, 0],
      topY:[0, 0]
    }
  };

  state = {
    imgsArrangeArr:[
      // {
      //   pos:{
      //     left:'0',
      //     top:'0'
      //   }
      // }
    ]
  };
  // 重新布局所有的图片
  reArrange(centerIndex){
    let imgsArrangeArr= this.state.imgsArrangeArr,
        Constant= this.Constant,
        centerPos= Constant.centerPos,
        hPosRange= Constant.hPosRange,
        vPosRange= Constant.vPosRange,
        hPosRangeLeftSecX= hPosRange.leftSecX,
        hPosRangeRightSecX= hPosRange.rightSecX,
        hPosRangeY= hPosRange.y,
        vPosRangeTopY= vPosRange.topY,
        vPosRangeX= vPosRange.x,

        imgsArrangeTopArr= [],
        topImgNum= Math.ceil(Math.random()* 2),//取一个或不取
        topImgSpliceIndex= 0,
        imgsArrangeCenterArr= imgsArrangeArr.splice(centerIndex, 1);

        //首先居中 centerIndex的图片
        imgsArrangeCenterArr[0].pos= centerPos;

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex= Math.ceil(Math.random()* (imgsArrangeArr.length- topImgNum));
        imgsArrangeTopArr= imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index].pos= {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          };
        });

        //布局左右两侧的图片
        for(let i= 0, j= imgsArrangeArr.length,k= j/ 2; i< j; i++){
          let hPosRangeLORX= null;
          //前半部分布局左边,有半部分布局右边
          if(i< k){
            hPosRangeLORX= hPosRangeLeftSecX;
          }else{
            hPosRangeLORX= hPosRangeRightSecX;
          }
          imgsArrangeArr[i].pos={
            top:getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
            left:getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          };
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr: imgsArrangeArr
        });
  }

  getInitialState(){
    return {
      imgsArrangeArr:[
        // {
        //   pos:{
        //     left:'0',
        //     top:'0'
        //   }
        // }
      ]
    };
  }
//组件加载后，为每张图片计算其位置的范围
  conponentDidMount(){
    //首先拿到舞台的大小
    let stageDOM= ReactDOM.findDOMNode(this.refs.stage),
        stageH= stageDOM.scrollHeight,
        stageW= stageDOM.scrollWidth,
        harfStageH=Math.ceil(stageH/ 2),
        harfStageW=Math.ceil(stageW/ 2);
    //拿到一个imageFogure 的大小
    let ImgFigureDOM= ReactDOM.findDOMNode(this.refs.ImgFigure0),
        imgW= ImgFigureDOM.scrollWidth,
        imgH= ImgFigureDOM.scrollHeight,
        harfImgW= Math.ceil(imgW/ 2),
        harfImgH= Math.ceil(imgH/ 2);
    //计算中心图片的位置点
    this.Constant.centerPos={
      left: harfStageW - harfImgW,
      top: harfStageH - harfImgH
    };
    //计算左侧、右侧排布图片的范围
    this.Constant.hPosRange.leftSecX[0] = -harfImgW;
    this.Constant.hPosRange.leftSecX[1] = harfStageW- harfImgW* 3;
    this.Constant.hPosRange.rightSecX[0] = harfStageW+ harfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW- harfImgW;
    this.Constant.hPosRange.y[0] = -harfImgH;
    this.Constant.hPosRange.y[1]= stageH- harfImgH;

    //计算上侧图片排布的取值范围
    this.Constant.vPosRange.topY[0]= -harfImgH;
    this.Constant.vPosRange.topY[1]= harfStageH- harfImgH* 3;
    this.Constant.vPosRange.x[0]= harfStageW- imgW;
    this.Constant.vPosRange.x[1]= harfStageW;

    this.reArrange(0);
  }

  render(){
    //创建管理整个图片的控制大管家，包括图片组件以及导航组件
    let controllerUnits= [],
        imgFigures= [];
    imageDatas.forEach((value, index) => {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          }
        };
      }

      imgFigures.push(<ImgFigure data= {value} ref={'imageFigure'+ index} arrange={this.state.imgsArrangeArr[index]}/>);
    });

    return (
      <section className="stage" ref="stage">
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
