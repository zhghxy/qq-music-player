import React from "react";
import ReactDOM from "react-dom";
import { createStore } from 'redux'
import { TopHeader, MidHeader, FixTopSearch } from './component/header.jsx'
import Result from './component/Result.jsx';
import './main.scss';
import {Store} from './reducer.js';


  const render=()=>{ReactDOM.render(
    <div >
      <TopHeader />
      <MidHeader />
      <FixTopSearch />
      <Result />
    </div>,
    document.getElementById("app")
  )
};

Store.subscribe(render);
render();