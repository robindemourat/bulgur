import React from 'react';

import 'react-select/dist/react-select.css';

import './TakeAwayDialog.scss';

export const ChooseTakeAwayStep = ({
  takeAway
}) => (
  <section className="new-story-dialog-step">
    <h1>I want to take away my story as ...</h1>
    <form className="take-away-type-choice">
      {
        // todo : put this data in a model file
        [{
          id: 'project',
          label: 'a project file (for reworking on this story later)'
        },
        {
          id: 'html',
          label: 'an all-in-one html file to upload to the website of my choice'
        },
        {
          id: 'github',
          label: 'a gist+bl.ocks online website'
        },
        ].map((takeAwayType, key) => {
          const onOptionClick = (evt) => {
            evt.stopPropagation();
            takeAway(takeAwayType);
          };
          return (
            <div className="take-away-type-item"
              key={key}>
              <input
                type="radio"
                id={takeAwayType}
                name={takeAwayType}
                value="type"
                checked={false} />
              <label
                onClick={onOptionClick}
                htmlFor={takeAwayType}>
                <img className="bulgur-icon-image" src={require('../assets/bulgur-take-away-type-' + takeAwayType.id + '.svg')} />
                <h3>{takeAwayType.label}</h3>
              </label>
            </div>);
      })}
    </form>
  </section>
);


const NewStoryDialogLayout = ({
  actions: {
    closeTakeAwayModal
  },
  takeAway,
  takeAwayLog,
  takeAwayLogStatus,
  gistUrl,
  blocksUrl
}) => (
  <div className="take-away-dialog">
    <ChooseTakeAwayStep takeAway={takeAway} />
    <section className="take-away-dialog-step pub-links">
      {
        takeAwayLog ? <p className="take-away-log" style={{background: takeAwayLogStatus === 'success' ? 'lightgreen' : 'lightblue'}}>{takeAwayLog}</p> : ''
      }
      {
        blocksUrl ?
          <h2>
            <a target="blank" href={blocksUrl}>Webpage url : {blocksUrl}</a>
          </h2> : ''
      }
      {
        gistUrl ?
          <h2>
            <a target="blank" href={gistUrl}>Source code url : {gistUrl}</a>
          </h2>
        : ''
      }
    </section>
    <section className="take-away-dialog-step">
      <button
        onClick={closeTakeAwayModal}>
        Cancel
      </button>
    </section>
  </div>
);

export default NewStoryDialogLayout;
