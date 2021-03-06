import {Provider, Consumer, withContext} from '../context';
import {h, THoc} from '../util';

export interface IThemeProps {
  name?: string;
  value: object;
}

export const Theme: React.StatelessComponent<IThemeProps> = (props) => {
  let {name = 'theme', value, children} = props;

  return h(Provider as any, {name, value}, children);
};

export interface IThemedProps {
  name?: string;
}

export const Themed: React.StatelessComponent<IThemedProps> = (props) => {
  let {name = 'theme', children} = props;

  return h(Consumer, {name}, children);
};

export const withTheme: THoc<any, any> = (Comp, name = 'theme') => withContext(Comp, name, {name});
