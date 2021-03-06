import {Component, createElement as h} from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';
import {MediaSensor, withMedia} from '..';
import ShowDocs from '../../../.storybook/ShowDocs'

const IsBig = ({isBig}) => h('div', null, `WIDTH IS GREATED THAN 480PX: ${isBig}`);

const IsBigWithMedia = withMedia(IsBig, 'isBig', {
  query: '(min-width: 480px)'
});

@withMedia('isBig', {
  query: '(min-width: 480px)'
})
class IsBigClass extends Component<any, any> {
  render () {
    return h('div', null, `WIDTH IS GREATED THAN 480PX: ${this.props.isBig}`);
  }
}

storiesOf('Sensors/MediaSensor', module)
  .add('Documentation', () => h(ShowDocs, {md: require('../../../docs/en/MediaSensor.md')}))
  .add('FaCC', () =>
    h(MediaSensor, {
      query: '(min-width: 480px)'
    }, (matches) =>
      h('div', {
        style: {
          border: '1px solid red'
        }
      },
        `WIDTH IS GREATED THAN 480PX: ${matches}`
      )
    )
  )
  .add('Render prop', () =>
    h(MediaSensor, {
      query: '(min-width: 480px)',
      render: (matches) =>
        h('div', {
          style: {
            border: '1px solid red'
          }
        },
          `WIDTH IS GREATED THAN 480PX: ${matches}`
        )
    })
  )
  .add('HOC', () => h(IsBigWithMedia))
  .add('Decorator', () => h(IsBigClass));
