import {
  Button,
  WithStyles,
  withStyles,
  createStyles,
  Theme,
  Tooltip,
} from '@material-ui/core';
import React, { Fragment } from 'react';
import AttachmentIcon from '@material-ui/icons/Attachment';
import _uniqueId from 'lodash/uniqueId';

const styles = (theme: Theme) =>
  createStyles({
    input: {
      display: 'none',
    },
    button: {
      margin: 0,
      overflow: 'hidden',
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
  });

interface Props {
  accept: string;
  onSelectFile: any;
  tooltipTitle: string;
  buttonTitle: string;
}

class FileInput extends React.Component<Props & WithStyles<typeof styles>> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const {
      classes,
      accept,
      onSelectFile,
      tooltipTitle,
      buttonTitle,
    } = this.props;
    const uniqueId: string = _uniqueId('button_');

    return (
      <Fragment>
        <input
          accept={accept}
          className={classes.input}
          id={uniqueId}
          type="file"
          onChange={onSelectFile}
        />
        <label htmlFor={uniqueId}>
          <Tooltip disableFocusListener title={tooltipTitle} placement="bottom">
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              fullWidth
              component="span"
            >
              {buttonTitle}
              <AttachmentIcon className={classes.rightIcon} />
            </Button>
          </Tooltip>
        </label>
      </Fragment>
    );
  }
}

export default withStyles(styles)(FileInput);
