import _range from 'lodash/range';
import _uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import { EMITTER_STORE } from '../../stores';
import { observer, inject } from 'mobx-react';
import { EmitterStoreProp } from '../../stores/emitterStore';
import { Grid, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import _get from 'lodash/get';

type Props = {
  configName: string;
};

@inject(EMITTER_STORE)
@observer
class MultipleInput extends Component<Props & EmitterStoreProp> {
  getInputComponent = (length: number) => {
    const { configName, emitterStore, children } = this.props;
    const {
      currentEmitterConfig,
      changeEmitterConfig,
      emitterDefaultProps,
    } = emitterStore!;
    const values: any[] = _get(currentEmitterConfig, configName.split('>'));

    return _range(length).map((value, i) => {
      const last = value === length - 1;
      const addBtn = last ? (
        <Grid item xs={2}>
          <IconButton
            aria-label="Add"
            color="primary"
            onClick={() =>
              changeEmitterConfig(configName, [
                ...values,
                _get(emitterDefaultProps, configName.split('>'))[0],
              ])
            }
          >
            <AddIcon />
          </IconButton>
        </Grid>
      ) : null;

      return (
        <Grid container spacing={0} key={i}>
          <Grid item xs={last ? 8 : 10}>
            {(children as any)({
              configName: `${configName}>${value}`,
            })}
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="Delete"
              disabled={length === 1}
              onClick={() => {
                values.splice(value, 1);
                changeEmitterConfig(configName, values);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
          {addBtn}
        </Grid>
      );
    });
  };

  render() {
    const { configName, emitterStore } = this.props;
    const { currentEmitterConfig } = emitterStore!;
    const values = _get(currentEmitterConfig, configName.split('>'));
    const length = values.length;
    return this.getInputComponent(length);
  }
}

export default MultipleInput;
