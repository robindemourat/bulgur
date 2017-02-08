/**
 * This module exports a stateless component rendering the aside contents of the editor feature interface
 * @module bulgur/features/Editor
 */
import React from 'react';

import './AsideViewLayout.scss';

import SlidesContainer from '../../../components/SlidesContainer/SlidesContainer';

/**
 * Renders the aside view of the editor
 * @param {object} props - the props to render
 * @param {function} props.openSettings
 * @param {object} props.activePresentation - the presentation being edited in the editor
 * @param {function} props.returnToLanding
 * @param {function} props.addSlide
 * @param {function} props.updateSlide
 * @param {function} props.removeSlide
 * @param {function} props.setActiveSlide
 * @param {string} props.activeSlideId
 * @return {ReactElement} markup
 */
const AsideViewLayout = ({
  openSettings,
  activePresentation = {},
  returnToLanding,
  addSlide,
  updateSlide,
  removeSlide,
  setActiveSlide,
  activeSlideId,
}) => (
  <aside className="bulgur-aside-view">
    <button onClick={openSettings} type="button"><img className="bulgur-icon-image" src={require('../assets/settings.svg')} /> {activePresentation.metadata && activePresentation.metadata.title && activePresentation.metadata.title.length ? activePresentation.metadata.title : 'untitled presentation'}</button>
    {
      activePresentation.order ?
        <SlidesContainer
          activePresentation={activePresentation}
          activeSlideId={activeSlideId}
          setActiveSlide={setActiveSlide}
          addSlide={addSlide}
          updateSlide={updateSlide}
          removeSlide={removeSlide} /> : null}
    <button type="button" onClick={returnToLanding}>← Home</button>
  </aside>
);

export default AsideViewLayout;
