import { Component } from 'vue';

export interface SchemaNode {
  name: string;
  label: string;
  schema: any;
  component: string | Component;
  componentOptions?: {
    [k: string]: any;
  };
}

export interface ErrorBag {
  [k: string]: string;
}
