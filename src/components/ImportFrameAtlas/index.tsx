import { Grid } from '@material-ui/core';
import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { EMITTER_STORE, EmitterStoreProp } from '../../stores';
import FileInput from '../FileInput';

@inject(EMITTER_STORE)
@observer
class ImportFrameAtlas extends React.Component<EmitterStoreProp> {
  handleChooseFile = (event: any, cb: any) => {
    const file = event.target.files[0];
    if (file) {
      cb(file);
    }
  };

  render() {
    const { setFrameImage, setFrameJSON, frame } = this.props.emitterStore!;
    const titleImage = frame.image.name
      ? frame.image.name
      : 'Choose Frame Image ...';
    const titleJSON = frame.json.name
      ? frame.json.name
      : 'Choose Frame JSON ...';

    return (
      <Fragment>
        <Grid item xs={12}>
          <Grid container spacing={8}>
            <Grid item xs={6}>
              <FileInput
                onSelectFile={(event: any) => {
                  this.handleChooseFile(event, setFrameImage);
                }}
                accept="image/*"
                tooltipTitle="*.png"
                buttonTitle={titleImage}
              />
            </Grid>
            <Grid item xs={6}>
              <FileInput
                accept="image/*"
                onSelectFile={(event: any) => {
                  this.handleChooseFile(event, setFrameJSON);
                }}
                tooltipTitle="*.json"
                buttonTitle={titleJSON}
              />
            </Grid>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default ImportFrameAtlas;
