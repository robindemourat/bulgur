/* eslint react/no-set-state: 0 */
/* eslint react/no-did-update-set-state: 0 */
/**
 * This module provides a reusable draft-powered text wysiwig editor component
 * @module bulgur/components/DraftEditor
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {debounce} from 'lodash';
import PresentationEditor from 'draft-js-plugins-editor';
import {
  RichUtils,
  EditorState,
} from 'draft-js';

import {stateFromMarkdown} from 'draft-js-import-markdown';
import {stateToMarkdown} from 'draft-js-export-markdown';

import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';

const richButtonsPlugin = createRichButtonsPlugin();

import './DraftEditor.scss';


import {translateNameSpacer} from '../../helpers/translateUtils';

const {
  // inline buttons
  ItalicButton,
  BoldButton,
  // MonospaceButton,
  UnderlineButton,
  // block buttons
  // ParagraphButton,
  // BlockquoteButton,
  // CodeButton,
  // OLButton,
  // ULButton,
  // H1Button,
  // H2Button,
  // H3Button,
  // H4Button,
  // H5Button,
  // H6Button
} = richButtonsPlugin;

export default class QuinoaDraftSlide extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props);
    // little hack to a bug generated by the editor plugin
    // which calls illegitimately onChange when plugins are initialized
    // (https://github.com/draft-js-plugins/draft-js-plugins/issues/311)
    this.state = {
      initialized: false,
      focused: false,
      editorState: props.slide && props.slide.markdown ? EditorState.createWithContent(stateFromMarkdown(props.slide.markdown)) : EditorState.createEmpty(),
      markdown: props.slide && props.slide.markdown ? props.slide.markdown : ''
    };

    this.onPresentationEditorChange = (editorState) => {
      if (this.state.initialized) {
        this.setState({
          editorState,
          // markdown
        });
        this.sendUpdate(editorState);
        // this.props.update(markdown);
      }
      else {
        this.setState({
          initialized: true
        });
      }
    };
    this.sendUpdate = debounce(this.sendUpdate, 400);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // update editor if markdown representation of content is different between props and state
    if (nextProps.slide && nextProps.slide.markdown !== undefined && nextProps.slide.markdown !== this.state.markdown) {
      const contentState = stateFromMarkdown(nextProps.slide.markdown);
      this.setState({
        editorState: EditorState.createWithContent(contentState),
        markdown: nextProps.slide.markdown
      });
    }
  }

  shouldComponentUpdate() {
    return true;
    //this.state.markdown !== nextState.markdown;
  }

  // componentDidUpdate() {
  //   console.log('component did update')
  //   if (this.props.slide && typeof this.props.slide.markdown === 'string' && this.props.slide.markdown !== this.state.markdown) {
  //     console.time('convert to markdown');
  //     this.setState({
  //       editorState: PresentationEditorState.createWithContent(stateFromMarkdown(this.props.slide.markdown)),
  //       markdown: this.props.slide.markdown
  //     });
  //     console.timeEnd('convert to markdown');
  //   }
  // }

  sendUpdate (editorState) {
    const markdown = stateToMarkdown(editorState.getCurrentContent());
    this.props.update(markdown);
    this.setState({
      markdown
    });
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState && typeof this.props.update === 'function') {
      this.onPresentationEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  render() {
    const translate = translateNameSpacer(this.context.t, 'Components.DraftEditor');
    const onChange = state => this.onPresentationEditorChange(state);
    const onGlobalClick = e => {
      e.stopPropagation();
      this.editorComponent.focus();
    };
    const onFocus = () => this.setState({focused: true});
    const onBlur = () => this.setState({focused: false});
    return (
      <div
        className={'bulgur-DraftEditor ' + (this.state.focused ? 'focused' : '')}
        onClick={onGlobalClick}>
        <div className="rich-buttons">
          <div className="buttons-group">
            <BoldButton label={translate('bold')} />
            <ItalicButton label={translate('italic')} />
            <UnderlineButton label={translate('underline')} />
          </div>

          {/*
          <div className="buttons-group">
            <ParagraphButton />
            <BlockquoteButton />
            <ULButton>List</ULButton>
          </div>
          */}
        </div>
        <PresentationEditor
          editorState={this.state.editorState}
          onChange={onChange}
          handleKeyCommand={this.handleKeyCommand}
          placeholder={translate('write-your-slide-comment-here')}
          ref={(editorComponent) => {
this.editorComponent = editorComponent;
}}
          onFocus={onFocus}
          onBlur={onBlur}
          plugins={[
              richButtonsPlugin
            ]} />
      </div>
    );
  }
}
