/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, For} from 'solid-js';
import {createStore} from "solid-js/store";
import {ClickData} from "./meta/data";
import {ClickConfig, defaultConfig} from "./meta/config";
import {ClickEvent} from "./meta/event";

import {useHandler} from "./hooks/useHandler";
import LoadingIcon from './../../assets/icons/LoadingIcon'
import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'

export interface Props {
  data?: ClickData,
  config?: ClickConfig;
  events?: ClickEvent,
}

const Index: Component<Props> = (props) => {
  const [conf, setConf] = createStore<ClickConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setConf((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [data, setData] = createStore<ClickData>({image: "", thumb: ""});
  createEffect(() => {
    setData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [events, setEvents] = createStore<ClickEvent>({});
  createEffect(() => {
    setEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  const handler = useHandler(data, events || {});

  const hPadding = conf.horizontalPadding || 0
  const vPadding = conf.verticalPadding || 0
  const width = (conf.width || 0) + ( hPadding * 2) + (conf.showTheme ? 2 : 0)

  const style = createMemo(() => ({
    "width":  width+ "px",
    "padding-left": hPadding + "px",
    "padding-right": vPadding + "px",
    "padding-top": vPadding + "px",
    "padding-bottom": vPadding + "px",
  }));

  return (
    <div class="go-captcha gc-wrapper gc-click-mode"
         classList={{"gc-theme": conf.showTheme}}
         style={style()}>
      <div class="gc-header">
        <span>{conf.title}</span>
        <img classList={{"gc-hide": data?.thumb == ''}} style={{width: conf.thumbWidth + "px", height: conf.thumbHeight + "px"}} src={data?.thumb} alt="..." />
      </div>
      <div class="gc-body" style={{width: conf.width + "px", height: conf.height + "px"}}>
        <div class="gc-loading">
          <LoadingIcon />
        </div>
        <img class="gc-picture" classList={{"gc-hide": data?.image == ''}} style={{width: conf.width + "px", height: conf.height + "px"}} src={data?.image} alt="..." onClick={handler.clickEvent}/>
        <div class="gc-dots">
          <For each={handler.dots}>{(dot)=>(<div class="gc-dot" style={{
            "top": (dot.y - 11) + "px",
            "left": (dot.x - 11) + "px",
          }}>{dot.index}</div>)}</For>
        </div>
      </div>
      <div class="gc-footer">
        <div class="gc-icon-block">
          <CloseIcon width={22} height={22} onClick={handler.closeEvent}/>
          <RefreshIcon width={22} height={22} onClick={handler.refreshEvent}/>
        </div>
        <div class="gc-button-block">
          <button onClick={handler.confirmEvent}>{conf.buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default Index