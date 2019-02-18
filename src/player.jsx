/**
 * @file 点击播放按钮后弹出此页面播放音乐
 */
import React from "react";
import ReactDOM from "react-dom";


var id;
window.addEventListener('storage',function(event){
    id=localStorage.getItem('id');
    render();
})
window.onload=function(){
    id=localStorage.id;
    render();
}
const render=()=>{ReactDOM.render(
    <audio autoPlay={'true'} src={"http://music.163.com/song/media/outer/url?id="+id+".mp3 "}></audio>,
    document.getElementById("root")
)};
