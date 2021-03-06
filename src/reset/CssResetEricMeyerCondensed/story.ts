import {createElement as h} from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';
import CssResetEricMeyerCondensed from '.';
import ShowDocs from '../../../.storybook/ShowDocs'

storiesOf('CSS resets/CssResetEricMeyerCondensed', module)
  .add('Documentation', () => h(ShowDocs, {md: require('../../../docs/en/reset/CssResetEricMeyerCondensed.md')}))
  .add('Example', () =>
    h(CssResetEricMeyerCondensed)
  );
