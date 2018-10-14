import {
  Grid,
  WithStyles,
  withStyles,
  createStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { EDITOR_STORE, EditorStoreProp } from '../../stores';
import FileInput from '../FileInput';

const styles = (theme: Theme) =>
  createStyles({
    previewImgRoot: {
      position: 'relative',
      marginTop: theme.spacing.unit * 2,
      '&:hover div': {
        visibility: 'visible',
      },
    },
    removeImage: {
      height: theme.spacing.unit * 3,
      width: theme.spacing.unit * 3,
      top: -theme.spacing.unit,
      right: -theme.spacing.unit,
      fontFamily: theme.typography.fontFamily,
      background: '#d20000',
      position: 'absolute',
      cursor: 'pointer',
      color: '#fff',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      visibility: 'hidden',
    },
    preview: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    previewImg: {
      height: theme.spacing.unit * 12,
      boxSizing: 'border-box',
      border: `1px dotted ${theme.palette.background.default}`,
    },
  });

@inject(EDITOR_STORE)
@observer
class ImportBackground extends React.Component<
  EditorStoreProp & WithStyles<typeof styles>
> {
  handleChange = (event: any) => {
    const { setBackground } = this.props.editorStore!;
    const background = event.target.files[0];
    if (background) {
      setBackground(background);
    }
  };

  render() {
    const { editorStore, classes } = this.props;
    const { background, resetBackground } = editorStore!;
    const imageData: any = background.data;

    return (
      <Fragment>
        <Grid item xs={12}>
          <Grid container spacing={0}>
            <Grid item xs={3} />
            <Grid item xs={6}>
              <FileInput
                accept="image/*"
                onSelectFile={this.handleChange}
                tooltipTitle="*.png | *.jpeg | *.jpg"
                buttonTitle="Choose background ..."
              />
            </Grid>
            <Grid item xs={3} />
            {imageData ? (
              <Grid container spacing={8} justify="center">
                <Grid item xs={12} className={classes.preview}>
                  <div className={classes.previewImgRoot}>
                    <img src={imageData} className={classes.previewImg} />
                    <div
                      className={classes.removeImage}
                      onClick={resetBackground}
                    >
                      x
                    </div>
                  </div>
                </Grid>
                <Grid item>
                  <Typography>
                    {background.size.width}x{background.size.height}
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ImportBackground);
