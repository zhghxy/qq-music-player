import { createStore } from 'redux';

export const  Reducer= (state={keyword:'',result:[],count:0},action)=>{
    switch(action.type){
        //根据关键词搜索页面
        case 'SEARCH':
            return{
                keyword:action.keyword,
                result:action.result,
                count:action.songCount
            };

        //切换搜索结果页面
        case 'CHANGE-PAGE':
            return Object.assign({},state,{result:action.result});
        default:
            return state
    }
}
export const Store=createStore(Reducer);