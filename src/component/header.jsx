import React from "react";
import $ from 'jquery';
import {Store} from '../reducer.js';
import '../css/header.scss';

/**
 * 向服务端发送搜索请求
 * @param {Number} offset 结果页面偏移数
 * @param {String} el     搜索关键字
 */
export const searchMusic=function(offset,el){
    const promise=new Promise(function(resolve,reject){
        const client=new XMLHttpRequest();
        client.onreadystatechange=function(){
            if(client.readyState==4){
                if(client.status==200){
                    console.log(el);
                    resolve({result:$.parseJSON(client.responseText),key:el});
                }
                else{
                    reject(new Error(client.statusText));
                }
            }
        }
        client.open('GET','http://localhost:3000/search?keywords='+el+'&offset='+offset+'&limit=20');
        client.send();
    })
    return promise;
  }
  const handleSearch=(e,offset=0)=>{ 
    var text=e.target.previousSibling.value;
   console.log(text);
    if(text!=''){
        searchMusic(offset,text).then(function(response){
            Store.dispatch({
                type:'SEARCH',
                keyword:response.key,
                result:response.result.result.songs,
                songCount:response.result.result.songCount});
        },function(error){
            console.log(error);
        })
    }
  }

export class Search extends React.Component{
    constructor(props){
        super(props);
        this.state={
            extend:true,
            notEnough:false
        }
        this.isExtend=this.isExtend.bind(this);
        this.handleOver=this.handleOver.bind(this);
        this.handleLeave=this.handleLeave.bind(this);
        window.onresize=this.isExtend;
    }
    componentDidMount(){
        this.isExtend();
    }

    //搜索栏伸缩效果
    isExtend(){

        //页面宽度小于1080px时搜索栏缩短，并且鼠标悬停时可以扩展
        if(document.body.clientWidth<1080)
          {  this.setState({
                extend:false,
                notEnough:true
            })
        }
        else{
            this.setState({
                extend:true,
                notEnough:false
            })
        }
    }
    handleOver(){
        if(!this.state.extend){
            setTimeout(this.setState({
                extend:true
            }),1000)
            
        }
    }
    handleLeave(){
        if(this.state.notEnough&&this.state.extend){
            this.setState({
                extend:false
            })
        }
    }
    render(){
        return(
        <div onMouseOver={this.handleOver} onMouseLeave={this.handleLeave} className="input-group search-box">
            <input type="text" style={this.state.extend?{width:150+'px'}:{width:0+'px',padding:'6px 0px'}} className="form-control search-input" placeholder="please input" aria-describedby="basic-addon1" />
            <span onClick={handleSearch} className="input-group-addon glyphicon glyphicon-search search-but" aria-hidden="true"></span>
            <table className="search-table">
                <tbody>
                    <tr><td><a href="#"><span>1</span><span>可能否</span></a></td></tr>
                    <tr><td><a href="#"><span>1</span><span>可能否</span></a></td></tr>
                    <tr><td><a href="#"><span>1</span><span>可能否</span></a></td></tr>
                </tbody>
            </table>
        </div>)
    }
}

export class TopHeader extends React.Component{
    constructor(props){
        super(props);
        this.state={
            tologin:false,
            signed:false
        }
        this.clickSign=this.clickSign.bind(this);
        this.submit=this.submit.bind(this);
    }
    clickSign(){
        if(!this.state.tologin&&!this.state.signed){
            this.setState({
                tologin:true
            })
        }
    }
    submit(){
        var user_name=document.getElementsByClassName("login-box")[0].getElementsByTagName("input")[0].value;
        var user_password=document.getElementsByClassName("login-box")[0].getElementsByTagName("input")[1].value;
        var request=new XMLHttpRequest();
        var that=this;
        request.onreadystatechange=function(){
            if(request.readyState===4){
                if(request.status===200){
                    that.setState({
                        signed:true
                    })
                    document.getElementsByClassName("login")[0].getElementsByClassName("close")[0].click();
                }
            }
        }
        if(user_name!=''&&user_password!=''){
            request.open('GET','http://localhost:3000/login/cellphone?phone='+user_name+'&password='+user_password);
            request.send();
        }
    }
    
    render(){
        return(
        <div className="topHeader">
            <h1 className="title">QQ音乐</h1>
            
            <div className="user">
                <a href="#" onClick={this.clickSign}>
        {this.state.signed?( <img  src={require("../photo/1.jpg")} alt=""/>): (<span>登陆</span>)}
                </a>
                <button className='green-but' value="开通绿钻豪华版">开通绿钻豪华版</button>
                <button className='white-but' value="开通付费包">开通付费包</button>
            </div>
            <Search />
            <ul className="top-nav">
                <li><a href="#">音乐馆</a></li>
                <li><a href="#">我的音乐</a></li>
                <li><a href="#">客户端</a></li>
                <li><a href="#">音乐号</a></li>
                <li><a href="#">VIP</a></li>
            </ul>
            <div style={{display:(this.state.tologin?'block':'none')}}  role='alert' className='login  alert alert-dismissble'>
                <p>手机号登陆</p>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={()=>this.setState({tologin:false})} ><span aria-hidden="true">&times;</span></button>
                <div className='login-box'>
                    <input type='text' placeholder='请输入手机号' />
                    <input type="password" placeholder='请输入密码'/>
                    <button className='login-box-but' type='button' onClick={this.submit} >登陆</button>
                </div>
            </div>
        </div>)
    }
}

export class MidHeader extends React.Component{
    render(){
        return(
            <div className="midHeader">
                <div className="input-group mid-search-box">
                    <input type="text" className="form-control mid-search-input" placeholder="please input" aria-describedby="basic-addon1" />
                    <span onClick={handleSearch} className="input-group-addon glyphicon glyphicon-search mid-search-but" aria-hidden="true"></span>
                </div>
                <div className="hot-rec">热门推荐</div>
                <div className="mid-recommend">
                    <span>热门搜索</span>
                    <a href="#">可能否</a>
                    <a href="#">星球坠落</a>
                    <a href="#">王力宏</a>
                    <a href="#">浪人琵琶</a>
                </div>
            </div>
        )
    }
}

//顶部固定搜索栏
export class FixTopSearch extends React.Component{
    constructor(props){
        super(props);
        this.state={
            show:false
        }
        this.handleScroll=this.handleScroll.bind(this);
    }
    componentDidMount(){
        window.onscroll=this.handleScroll;
    }

    handleScroll(){

        //向下滑动出现顶部搜索栏
        if($(window).scrollTop()>200){
            this.setState({
                show:true
            })
        }
        else{
            this.setState({
                show:false
            })
        }
    }
    render(){
        return(
        <div style={{display:(this.state.show?'block':'none')}} className="input-group fix-search">
            <input type="text" className="form-control fix-search-input " placeholder="please input" aria-describedby="basic-addon1" />
            <span className="input-group-addon glyphicon glyphicon-search " onClick={handleSearch} aria-hidden="true"></span>
        </div>
    )}
}