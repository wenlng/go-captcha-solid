/**
 * @Author Awen
 * @Date 2024/06/01
 * @Email wengaolng@gmail.com
 **/

import {Component, createEffect, createMemo, onMount} from "solid-js";
import {createStore} from "solid-js/store";
import {SlideData} from "./meta/data";
import {SlideConfig, defaultConfig} from "./meta/config";
import {SlideEvent} from "./meta/event";
import {useHandler} from "./hooks/useHandler";

import CloseIcon from './../../assets/icons/CloseIcon'
import RefreshIcon from './../../assets/icons/RefreshIcon'
import LoadingIcon from './../../assets/icons/LoadingIcon'
import ArrowsIcon from './../../assets/icons/ArrowsIcon'

export interface Props {
  data: SlideData,
  config?: SlideConfig;
  events?: SlideEvent,
}

const Index: Component<Props> = (props: Props) => {
  const [conf, setConf] = createStore<SlideConfig>({
    ...defaultConfig(),
  });
  createEffect(() => {
    setConf((s) => ({
      ...s,
      ...(props.config || {}),
    }));
  });

  const [data, setData] = createStore<SlideData>({
    thumbX: 0,
    thumbY: 0,
    thumbWidth: 0,
    thumbHeight: 0,
    image: "",
    thumb: "",
  });
  createEffect(() => {
    setData((s) => ({
      ...s,
      ...(props.data || {}),
    }));
  });

  const [events, setEvents] = createStore<SlideEvent>({});
  createEffect(() => {
    setEvents((s) => ({
      ...s,
      ...(props.events || {}),
    }));
  });

  let dragBarRef: any = null
  let containerRef: any = null
  let dragBlockRef: any = null
  let tileRef: any = null

  const handler = useHandler(data, events)

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

  onMount(() => {
    handler.initRefs(containerRef, tileRef, dragBlockRef, dragBarRef)
    dragBlockRef.addEventListener('dragstart', (event: any) => event.preventDefault());
  })

  return <div class="go-captcha gc-wrapper gc-slide-mode" classList={{"gc-theme": conf.showTheme}} style={style()}>
    <div class="gc-header">
      <span>{conf.title}</span>
      <div class="gc-icon-block">
        <CloseIcon width={22} height={22} onClick={handler.closeEvent}/>
        <RefreshIcon width={22} height={22} onClick={handler.refreshEvent}/>
      </div>
    </div>
    <div class="gc-body" ref={containerRef} style={{width: conf.width + "px", height: conf.height + "px"}}>
      <div class="gc-loading">
        <LoadingIcon />
      </div>
      <img class="gc-picture" classList={{"gc-hide": data.image == ""}} style={{width: conf.width + "px", height: conf.height + "px"}} src={data.image} alt="..." />
      <div class="gc-tile" ref={tileRef} style={{width: (data.thumbWidth || 0) + 'px', height: (data.thumbHeight || 0) + 'px', top: (data.thumbY || 0) + "px", left: handler.getState().thumbLeft + "px"}}>
        <img classList={{"gc-hide": data.thumb == ""}} src={data.thumb} alt="..."/>
      </div>
    </div>
    <div class="gc-footer">
      <div class="gc-drag-slide-bar" ref={dragBarRef} onMouseDown={handler.dragEvent}>
        <div class="gc-drag-line" />
        <div class="gc-drag-block" ref={dragBlockRef} onTouchStart={handler.dragEvent} style={{left: handler.getState().dragLeft + "px"}}>
          <ArrowsIcon />
        </div>
      </div>
    </div>
  </div>
}

export default Index