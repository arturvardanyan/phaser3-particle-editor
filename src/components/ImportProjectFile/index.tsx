import { Button, Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { EDITOR_STORE, EditorStoreProp } from '../../stores';
import { ARCHIVE_EXTENSION } from '../../constants';
import FileInput from '../FileInput';

@inject(EDITOR_STORE)
@observer
class ImportProjectFile extends React.Component<EditorStoreProp> {
  handleChange = (event: any) => {
    const { setFile } = this.props.editorStore!;
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  render() {
    const { editorStore } = this.props;
    const { file, fileError, fileErrorText } = editorStore!;
    const inputLabel = file ? file.name : '  ';

    return (
      <Grid item xs={12}>
        <Grid container spacing={16}>
          <Grid item xs={4}>
            <FileInput
              accept="*"
              onSelectFile={this.handleChange}
              tooltipTitle={`*.${ARCHIVE_EXTENSION}`}
              buttonTitle="Choose ..."
            />
          </Grid>
          <Grid item xs={8}>
            <TextField label={inputLabel} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            {fileError && (
              <Typography color="error">{fileErrorText}</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

type Props = {
  onSuccessLoad: () => void;
  onReadyResult: (emitters: any) => void;
};

@inject(EDITOR_STORE)
@observer
class ImportProjectButton extends React.Component<Props & EditorStoreProp> {
  handleImport = async () => {
    const { editorStore, onSuccessLoad, onReadyResult } = this.props;
    const { importProject } = editorStore!;
    const result = await importProject();
    if (result) {
      onReadyResult(result);
      onSuccessLoad();
    }
  };

  render() {
    const { editorStore } = this.props;
    const { file, fileError, fileLoadingStatus } = editorStore!;

    return (
      <Button
        disabled={!Boolean(file) || fileError || fileLoadingStatus}
        size="small"
        variant="contained"
        onClick={this.handleImport}
        color="primary"
      >
        Open
      </Button>
    );
  }
}

export { ImportProjectButton };
export default ImportProjectFile;
