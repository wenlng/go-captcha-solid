import {Component, createEffect, createMemo, For} from 'solid-js';
import {createStore} from "solid-js/store";
import {CaptchaData} from "./meta/data";
import {CaptchaConfig, defaultConfig} from "./meta/config";
import {CaptchaEvent} from "./meta/event";

import {useHandler} from "./hooks/useHandler";
import LoadingIcon from './../../assets/icons/LoadingIcon'
import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'

export interface Props {
  data?: CaptchaData,
  config?: CaptchaConfig;
  events?: CaptchaEvent,
}

const Index: Component<Props> = (props) => {
  const [conf, setConf] = createStore<CaptchaConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setConf((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [data, setData] = createStore<CaptchaData>({image: "", thumb: ""});
  createEffect(() => {
    setData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [events, setEvents] = createStore<CaptchaEvent>({});
  createEffect(() => {
    setEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  const handler = useHandler(data, events || {});

  const hPadding = conf.horizontalPadding || 0
  const vPadding = conf.verticalPadding || 0
  const width = (conf.width || 0) + ( vPadding * 2)

  const style = createMemo(() => ({
    "width":  width+ "px",
    "padding-left": vPadding + "px",
    "padding-right": vPadding + "px",
    "padding-top": hPadding + "px",
    "padding-bottom": hPadding + "px",
  }));

  return (
    <div class="go-captcha wrapper clickMode"
         classList={{"theme": conf.showTheme}}
         style={style()}>
      <div class="header">
        <span>{conf.title}</span>
        <img classList={{"hide": data?.thumb == ''}} style={{width: conf.thumbWidth + "px", height: conf.thumbHeight + "px"}} src={data?.thumb} alt="..." />
      </div>
      <div class="body" style={{width: conf.width + "px", height: conf.height + "px"}}>
        <div class="loading">
          <LoadingIcon />
        </div>
        <img class="picture" classList={{"hide": data?.image == ''}} style={{width: conf.width + "px", height: conf.height + "px"}} src={data?.image} alt="..." onClick={handler.clickEvent}/>
        <div class="dots">
          <For each={handler.dots()}>{(dot)=>(<div class="dot" style={{
            "top": (dot.y - 11) + "px",
            "left": (dot.x - 11) + "px",
          }}>{dot.index}</div>)}</For>
        </div>
      </div>
      <div class="footer">
        <div class="iconBlock">
          <CloseIcon width={22} height={22} onClick={handler.closeEvent}/>
          <RefreshIcon width={22} height={22} onClick={handler.refreshEvent}/>
        </div>
        <div class="buttonBlock">
          <button onClick={handler.confirmEvent}>{conf.buttonText}</button>
        </div>
      </div>
    </div>
  );
};

export default Index