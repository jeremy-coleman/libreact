import {Component, createElement as h} from 'react';
import {mock, IMockParams, IMockComponent} from './mock';
import {noop} from './util';

export type TLoaderPromise = () => Promise<React.ComponentClass<any> | React.StatelessComponent<any>>;
export type TLoader = TLoaderPromise;

export interface ILoadableParams<TProps> extends IMockParams<TProps> {
    loader: TLoader,
}

export interface ILoadableComponent<TProps> extends IMockComponent<TProps> {
    load();
}

export type TLoadable = <TProps>(params: ILoadableParams<TProps>) => ILoadableComponent<TProps>;

export const loadable: TLoadable = <TProps>(params: ILoadableParams<TProps>) => {
    const {loader} = params;
    const Mock: ILoadableComponent<TProps> = mock(params) as ILoadableComponent<TProps>;

    Mock.load = () => {
        loader().then((Implementation) => {
            Mock.implement((Implementation as any).default || Implementation);
        }, console.error);

        Mock.load = noop;
    };

    return Mock;
};
