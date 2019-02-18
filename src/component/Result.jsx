import React from "react";
import {Store} from '../reducer.js';
import {searchMusic} from './header.jsx';
import '../css/result.scss';

//搜索结果表头
export class ResultTab extends React.Component{
    render(){
        return(
            <div className='result-tab'>
                <a href="#">单曲</a>
                <a href="#">专辑</a>
                <a href="#">MV</a>
                <a href="#">歌词</a>
                <a href="#">用户</a>
            </div>
        )
    }
}

//搜索结果的单个歌曲条目
class SongItem extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
            <li className='song-item' id={this.props.id}>
                <div className='song-name'>
                    <div className="btn-group song-opera-item" role="group" aria-label="...">
                        <button type="button" className="btn btn-default" onClick={this.props.clickPlay}>
                            <span className="glyphicon glyphicon-play" aria-hidden="true" aria-label='播放'></span>
                        </button>
                        <button type="button" className="btn btn-default">
                            <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-default">
                            <span className="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
                        </button>
                        <button type="button" className="btn btn-default">
                            <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </button>
                    </div>
                    <a href="#" >{this.props.song_name}</a>
                </div>
                
                <a href="#" className='song-single'>{this.props.song_single}</a>
                <a href="#" className='song-album'>{this.props.song_album}</a>
                <a href="#" className='song-time'>{this.props.song_time}</a>
            </li>
        )
    }
}

//搜索结果容器
export class SongBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            player:{}
        }
    }
    songPlay(id){
        localStorage.setItem('id',id);
        if(this.state.player.closed!==false){
            localStorage.setItem('play',true);
            this.setState({
                player:window.open('../player.html','player')
            })
        }
    }
    render(){
        const results=Store.getState().result;
        const song_list=React.Children.toArray(results.map((item)=> {
                var minute=parseInt(item.duration/60000);
                var second=parseInt((item.duration%60000)/1000);
                return <SongItem  clickPlay={this.songPlay.bind(this,item.id)} key={item.id} id={item.id} song_name={item.name} song_single={item.artists[0].name} song_album={item.album.name} song_time={(minute<10?('0'+minute):minute)+':'+(second<10?('0'+second):second)} />
            }));
            return(
        <div className='song-box'>
            <div className="btn-group song-opera-box" role="group" aria-label="...">
                <button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-play" aria-hidden="true"></span>
                    播放全部
                    </button>
                <button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-check" aria-hidden="true"></span>
                    添加到
                </button>
                <button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
                    下载
                </button>
                <button type="button" className="btn btn-default">
                    <span className="glyphicon glyphicon-edit" aria-hidden="true"></span>
                    批量操作
                </button>
            </div>

            <div className='song-list-box'>
                <div className='song-list-tab'>
                    <span>歌曲</span>
                    <span>歌手</span>
                    <span>专辑</span>
                    <span>时长</span>
                </div>
                <ul className='song-list'>
                   {song_list.length>0?song_list:""}
                </ul>
            </div>
        </div>)
    }
}

//换页组件
class Page extends React.Component{
    constructor(props){
        super(props);
        this.state={
            index:1,
            page_list:[],
            created:false
        }
        this.clickPage=this.clickPage.bind(this);
        this.ahead=this.ahead.bind(this);
    }
    
    //换页选项卡初始化，页数大于5时只显示前4页的选项卡
    ahead(k){
        var page_list=[],
            count=Store.getState().count/20;
        console.log('ahead'+k);
        if(count>0){
            var length=count>5?5:count;
        
            for(var i=0;i<length;i++){
                page_list[i]=<li ><a className={k==i+1?'active':''} href="javascript:void(0)" key={i} onClick={this.clickPage} index={i+1}>{i+1}</a></li>;
            }
            if(count>5){
                page_list[length-1]=(<li className='disabled'>
                                        <span>...</span>
                                    </li>);
                page_list[length]=(<li>
                                        <a className={k==count?'active':''} href="javascript:void(0)" key={count} onClick={this.clickPage} index={count}>{count}</a>
                                    </li>);
                page_list[length+1]=(<li>
                                    <a href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                    </a>
                            </li>);                   
            }else{
                page_list[length]=(<li>
                    <a href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>); 
            }
            
        }   
        return page_list;
    }

    clickPage(e){
        var index=parseInt(e.target.attributes['index'].value);
        var list=[],
                count=Store.getState().count/20;
        /*ajax请求*/
        searchMusic((index-1)*20,Store.getState().keyword).then(function(response){
            Store.dispatch({type:'CHANGE-PAGE',result:response.result.result.songs})
        },function(error){
            console.log(error);
        })
        /*分页变化*/
        if(index>=4&&count-index>4){
            
            list[0]=(<li><a href="#" key={0} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        </a></li>);
            list[1]=<li><a className={i==index?'active':''} href="javascript:void(0)" key={1} onClick={this.clickPage} index={1}>{1}</a></li>;
            list[2]=<li className='disabled'><span>...</span></li>;
            for(var i=index-2,k=3;i<=index+2;i++,k++){
                list[k]=<li><a className={i==index?'active':''} href="javascript:void(0)" key={k} onClick={this.clickPage} index={i}>{i}</a></li>;
            }
            list[8]=(<li className='disabled'>
                        <span>...</span>
                    </li>);
            list[9]=<li><a className={i==index?'active':''} href="javascript:void(0)" key={9} onClick={this.clickPage} index={count}>{count}</a></li>;
            list[10]=(<li>
                        <a href="#" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </a>
                        </li>);
        }
        else if(index<4){
            list=this.ahead(index);
        }
        else{
            list[0]=(<li><a href="#" key={0} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        </a></li>);
            list[1]=<li><a className={i==index?'active':''} href="javascript:void(0)" key={1} onClick={this.clickPage} index={1}>{1}</a></li>;
            list[2]=<li className='disabled'><span>...</span></li>;
            for(var i=count-4,k=3;i<=count;i++,k++){
                list[k]=<li><a className={i==index?'active':''} href="javascript:void(0)" key={k} onClick={this.clickPage} index={i}>{i}</a></li>;
            }
            
        }
        this.setState({page_list:list});
    }
    render(){ 
        const page_list=this.ahead(1);
        return(
            <nav className='page' aria-label="Page navigation">
                <ul className="pagination pagination-lg">
                   {this.state.page_list.length>0?this.state.page_list:page_list}
                </ul>
            </nav>
        )
    }
}
export default class Result extends React.Component{
    render(){
        return(
            <div className='result'>
                <ResultTab />
                <SongBox />
                <Page />
            </div>
        )
    }
}

